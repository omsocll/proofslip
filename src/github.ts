import { Octokit } from "@octokit/rest";
import { RECEIPT_MARKER } from "./render.js";
import type { CheckRun, Overall, PrComment, PrCommit, PrEvidence, PrReview, Receipt } from "./types.js";

export class ProofslipError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProofslipError";
  }
}

export interface IndexEntry {
  id: string;
  repo: string;
  pr: number;
  url: string;
  head_sha: string;
  overall: Overall;
  created_at: string;
  summary_plain: string;
  agent: string;
}

export function createOctokit(token?: string): Octokit {
  return new Octokit({
    auth: token?.trim() ? token.trim() : undefined,
    userAgent: "proofslip",
  });
}

export function parseRepo(value: string): { owner: string; repo: string } {
  const match = value.trim().match(/^([^/\s]+)\/([^/\s]+?)(?:\.git)?$/);
  if (!match?.[1] || !match[2]) {
    throw new ProofslipError(`Expected a repository as owner/name, got "${value}".`);
  }
  return { owner: match[1], repo: match[2] };
}

export async function fetchPullRequestEvidence(octokit: Octokit, owner: string, repo: string, prNumber: number): Promise<PrEvidence> {
  const full = `${owner}/${repo}`;
  let pr: Awaited<ReturnType<Octokit["rest"]["pulls"]["get"]>>["data"];
  try {
    const response = await octokit.rest.pulls.get({ owner, repo, pull_number: prNumber });
    pr = response.data;
  } catch (error) {
    throw new ProofslipError(explainGithubError(error, `GitHub could not load ${full}#${prNumber}.`));
  }

  const [files, comments, commits, reviews] = await Promise.all([
    octokit.paginate(octokit.rest.pulls.listFiles, { owner, repo, pull_number: prNumber, per_page: 100 }),
    octokit.paginate(octokit.rest.issues.listComments, { owner, repo, issue_number: prNumber, per_page: 100 }),
    octokit.paginate(octokit.rest.pulls.listCommits, { owner, repo, pull_number: prNumber, per_page: 100 }),
    collectReviewsSafe(octokit, owner, repo, prNumber),
  ]);

  const headSha = pr.head.sha;
  const commitList: PrCommit[] = commits.map((commit) => ({
    sha: commit.sha,
    message: commit.commit.message ?? "",
  }));
  const previous = [...commitList].reverse().find((commit) => commit.sha !== headSha)?.sha;
  const [headChecks, mergeChecks, workflowChecks, previousChecks] = await Promise.all([
    collectChecksSafe(octokit, owner, repo, headSha),
    collectChecksSafe(octokit, owner, repo, `refs/pull/${prNumber}/merge`),
    collectWorkflowChecksSafe(octokit, owner, repo, headSha),
    previous ? collectChecksSafe(octokit, owner, repo, previous) : Promise.resolve([]),
  ]);
  const checkRuns = assembleCheckRuns(headSha, headChecks, mergeChecks, workflowChecks, previousChecks);

  const numbers = issueNumbers(`${pr.title ?? ""}\n${pr.body ?? ""}`);
  const linkedIssues = (
    await Promise.all(numbers.map(async (number) => {
      try {
        const issue = await octokit.rest.issues.get({ owner, repo, issue_number: number });
        if (issue.data.pull_request) return null;
        return { number, title: issue.data.title ?? "", body: issue.data.body ?? "" };
      } catch {
        return null;
      }
    }))
  ).filter((issue): issue is { number: number; title: string; body: string } => issue !== null);

  const prComments: PrComment[] = comments.map((comment) => ({
    author: comment.user?.login ?? "unknown",
    body: comment.body ?? "",
    createdAt: comment.created_at,
  }));

  return {
    repo: full,
    number: pr.number,
    url: pr.html_url,
    title: pr.title ?? "",
    body: pr.body ?? "",
    author: pr.user?.login ?? "unknown",
    headSha,
    additions: pr.additions ?? 0,
    deletions: pr.deletions ?? 0,
    changedFiles: pr.changed_files,
    labels: (pr.labels ?? []).map((label) => (typeof label.name === "string" ? label.name : "")).filter(Boolean),
    files: files.map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch ?? undefined,
      previous_filename: file.previous_filename,
    })),
    comments: prComments,
    checkRuns,
    linkedIssues,
    commits: commitList,
    reviews,
  };
}

/**
 * Checks GitHub records for a pull request often live on the synthetic merge
 * commit, not the head SHA. Attribute those to the head so the judge can see
 * them. A check already listed on the head wins when the name collides.
 * Previous-commit checks stay on their own SHA so a stale pass is still stale.
 */
export function checksForHead(headSha: string, headRuns: CheckRun[], extraRuns: CheckRun[]): CheckRun[] {
  const byName = new Map<string, CheckRun>();
  for (const run of extraRuns) byName.set(run.name, { ...run, sha: headSha });
  for (const run of headRuns) byName.set(run.name, { ...run, sha: headSha });
  return [...byName.values()];
}

export function assembleCheckRuns(
  headSha: string,
  headRuns: CheckRun[],
  mergeRuns: CheckRun[],
  workflowRuns: CheckRun[],
  previousRuns: CheckRun[],
): CheckRun[] {
  return [...checksForHead(headSha, headRuns, [...workflowRuns, ...mergeRuns]), ...previousRuns];
}

export function findReceiptComment<T extends { id: number; body?: string | null }>(comments: T[]): T | undefined {
  return comments.find((comment) => (comment.body ?? "").includes(RECEIPT_MARKER));
}

export async function postReceiptComment(octokit: Octokit, owner: string, repo: string, prNumber: number, markdown: string): Promise<string> {
  const comments = await octokit.paginate(octokit.rest.issues.listComments, {
    owner,
    repo,
    issue_number: prNumber,
    per_page: 100,
  });
  const existing = findReceiptComment(comments);
  if (existing) {
    const updated = await octokit.rest.issues.updateComment({ owner, repo, comment_id: existing.id, body: markdown });
    return updated.data.html_url;
  }
  const created = await octokit.rest.issues.createComment({ owner, repo, issue_number: prNumber, body: markdown });
  return created.data.html_url;
}

export function toIndexEntry(receipt: Receipt): IndexEntry {
  return {
    id: receipt.id,
    repo: receipt.repo,
    pr: receipt.pr.number,
    url: receipt.pr.url,
    head_sha: receipt.pr.head_sha,
    overall: receipt.overall,
    created_at: receipt.created_at,
    summary_plain: receipt.summary_plain,
    agent: receipt.agent.name,
  };
}

export function upsertIndex(entries: IndexEntry[], next: IndexEntry): IndexEntry[] {
  return [next, ...entries.filter((entry) => entry.id !== next.id)].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function publishReceipt(octokit: Octokit, owner: string, repo: string, branch: string, receipt: Receipt, markdown: string): Promise<string> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await commitReceipt(octokit, owner, repo, branch, receipt, markdown);
    } catch (error) {
      lastError = error;
      if (!isNotFastForward(error) || attempt === 2) throw error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Could not publish the receipt.");
}

async function commitReceipt(octokit: Octokit, owner: string, repo: string, branch: string, receipt: Receipt, markdown: string): Promise<string> {
  const parent = await ensureBranch(octokit, owner, repo, branch);
  const existing = await readJsonFile(octokit, owner, repo, "receipts/index.json", branch);
  const entries = Array.isArray(existing) ? (existing as IndexEntry[]) : [];
  const index = upsertIndex(entries, toIndexEntry(receipt));
  const files = [
    { path: `receipts/${receipt.id}.json`, content: `${JSON.stringify(receipt, null, 2)}\n` },
    { path: `receipts/${receipt.id}.md`, content: markdown.endsWith("\n") ? markdown : `${markdown}\n` },
    { path: "receipts/index.json", content: `${JSON.stringify(index, null, 2)}\n` },
  ];
  const blobs = await Promise.all(
    files.map((file) => octokit.rest.git.createBlob({ owner, repo, content: file.content, encoding: "utf-8" })),
  );
  const parentCommit = await octokit.rest.git.getCommit({ owner, repo, commit_sha: parent });
  const tree = await octokit.rest.git.createTree({
    owner,
    repo,
    base_tree: parentCommit.data.tree.sha,
    tree: files.map((file, i) => ({
      path: file.path,
      mode: "100644" as const,
      type: "blob" as const,
      sha: blobs[i]!.data.sha,
    })),
  });
  const commit = await octokit.rest.git.createCommit({
    owner,
    repo,
    message: `receipt: ${receipt.repo}#${receipt.pr.number} ${receipt.overall}`,
    tree: tree.data.sha,
    parents: [parent],
  });
  await octokit.rest.git.updateRef({ owner, repo, ref: `heads/${branch}`, sha: commit.data.sha });
  return commit.data.sha;
}

async function ensureBranch(octokit: Octokit, owner: string, repo: string, branch: string): Promise<string> {
  try {
    const ref = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
    return ref.data.object.sha;
  } catch (error) {
    if (httpStatus(error) !== 404) {
      throw new ProofslipError(explainGithubError(error, `Could not read branch ${branch}.`));
    }
  }
  const repository = await octokit.rest.repos.get({ owner, repo });
  const base = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${repository.data.default_branch}` });
  await octokit.rest.git.createRef({ owner, repo, ref: `refs/heads/${branch}`, sha: base.data.object.sha });
  return base.data.object.sha;
}

async function readJsonFile(octokit: Octokit, owner: string, repo: string, filePath: string, ref: string): Promise<unknown | null> {
  try {
    const response = await octokit.rest.repos.getContent({ owner, repo, path: filePath, ref });
    if (Array.isArray(response.data) || response.data.type !== "file" || !("content" in response.data)) return null;
    const text = Buffer.from(response.data.content, "base64").toString("utf8");
    return JSON.parse(text) as unknown;
  } catch (error) {
    if (httpStatus(error) === 404) return null;
    throw error;
  }
}

export async function findOpenPullRequest(
  octokit: Octokit,
  owner: string,
  repo: string,
  sha: string,
  branch?: string | null,
): Promise<number | null> {
  try {
    const associated = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({ owner, repo, commit_sha: sha });
    const open = associated.data.find((pr) => pr.state === "open");
    if (open) return open.number;
  } catch (error) {
    const status = httpStatus(error);
    if (status !== 404 && status !== 422) throw error;
  }
  if (!branch) return null;
  const listed = await octokit.rest.pulls.list({
    owner,
    repo,
    state: "open",
    head: `${owner}:${branch}`,
    per_page: 10,
  });
  return listed.data.find((pr) => pr.head.sha === sha)?.number ?? listed.data[0]?.number ?? null;
}

async function collectReviewsSafe(octokit: Octokit, owner: string, repo: string, prNumber: number): Promise<PrReview[]> {
  try {
    const reviews = await octokit.paginate(octokit.rest.pulls.listReviews, {
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100,
    });
    return reviews.map((review) => ({
      author: review.user?.login ?? "unknown",
      state: review.state ?? "",
      submittedAt: review.submitted_at ?? undefined,
    }));
  } catch (error) {
    const status = httpStatus(error);
    if (status === 403 || status === 404 || status === 422) return [];
    throw error;
  }
}

async function collectChecksSafe(octokit: Octokit, owner: string, repo: string, sha: string): Promise<CheckRun[]> {
  try {
    return await collectChecks(octokit, owner, repo, sha);
  } catch (error) {
    const status = httpStatus(error);
    if (status === 404 || status === 422) return [];
    throw error;
  }
}

async function collectWorkflowChecksSafe(octokit: Octokit, owner: string, repo: string, headSha: string): Promise<CheckRun[]> {
  try {
    return await collectWorkflowChecks(octokit, owner, repo, headSha);
  } catch (error) {
    const status = httpStatus(error);
    if (status === 403 || status === 404 || status === 422) return [];
    throw error;
  }
}

async function collectWorkflowChecks(octokit: Octokit, owner: string, repo: string, headSha: string): Promise<CheckRun[]> {
  const response = await octokit.rest.actions.listWorkflowRunsForRepo({
    owner,
    repo,
    head_sha: headSha,
    per_page: 30,
  });
  const latest = new Map<string, (typeof response.data.workflow_runs)[number]>();
  for (const run of response.data.workflow_runs) {
    const key = run.name || run.path || String(run.id);
    const current = latest.get(key);
    if (!current || run.run_number >= current.run_number) latest.set(key, run);
  }
  const checks: CheckRun[] = [];
  for (const run of latest.values()) {
    try {
      const jobs = await octokit.rest.actions.listJobsForWorkflowRun({
        owner,
        repo,
        run_id: run.id,
        per_page: 100,
      });
      if (jobs.data.jobs.length === 0) {
        checks.push(workflowRunAsCheck(run, headSha));
        continue;
      }
      for (const job of jobs.data.jobs) {
        checks.push({
          name: job.name,
          status: job.status ?? "completed",
          conclusion: job.conclusion,
          sha: headSha,
          url: job.html_url ?? run.html_url,
        });
      }
    } catch (error) {
      const status = httpStatus(error);
      if (status === 403 || status === 404) {
        checks.push(workflowRunAsCheck(run, headSha));
        continue;
      }
      throw error;
    }
  }
  return checks;
}

function workflowRunAsCheck(
  run: { name?: string | null; status?: string | null; conclusion?: string | null; html_url: string },
  headSha: string,
): CheckRun {
  return {
    name: run.name || "CI",
    status: run.status ?? "completed",
    conclusion: run.conclusion ?? null,
    sha: headSha,
    url: run.html_url,
  };
}

async function collectChecks(octokit: Octokit, owner: string, repo: string, sha: string): Promise<CheckRun[]> {
  const checks = await octokit.paginate(octokit.rest.checks.listForRef, { owner, repo, ref: sha, per_page: 100 });
  const statuses = await collectStatuses(octokit, owner, repo, sha);
  const fromChecks: CheckRun[] = checks.map((run) => ({
    name: run.name,
    status: run.status,
    conclusion: run.conclusion,
    sha,
    url: run.html_url,
  }));
  const seenStatus = new Set<string>();
  const fromStatuses: CheckRun[] = [];
  for (const status of statuses) {
    if (seenStatus.has(status.context)) continue;
    seenStatus.add(status.context);
    fromStatuses.push({
      name: status.context,
      status: status.state === "pending" ? "in_progress" : "completed",
      conclusion: status.state === "error" ? "failure" : status.state === "pending" ? null : status.state,
      sha,
      url: status.target_url,
    });
  }
  const merged = new Map<string, CheckRun>();
  for (const status of fromStatuses) merged.set(`${status.sha}:${status.name}`, status);
  for (const check of fromChecks) merged.set(`${check.sha}:${check.name}`, check);
  return [...merged.values()];
}

async function collectStatuses(octokit: Octokit, owner: string, repo: string, sha: string): Promise<Awaited<ReturnType<Octokit["rest"]["repos"]["listCommitStatusesForRef"]>>["data"]> {
  try {
    return await octokit.paginate(octokit.rest.repos.listCommitStatusesForRef, { owner, repo, ref: sha, per_page: 100 });
  } catch (error) {
    // A workflow token with checks:read can still be refused on the statuses API.
    // Check runs are enough to judge CI; a missing status list must not drop the comment.
    const status = httpStatus(error);
    if (status === 403 || status === 404 || status === 422) return [];
    throw error;
  }
}

function issueNumbers(text: string): number[] {
  const numbers = new Set<number>();
  for (const match of text.matchAll(/#(\d+)\b/g)) {
    if (match[1]) numbers.add(Number(match[1]));
  }
  return [...numbers].slice(0, 5);
}

function isNotFastForward(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return httpStatus(error) === 422 && /fast forward/i.test(message);
}

function httpStatus(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "status" in error && typeof (error as { status: unknown }).status === "number") {
    return (error as { status: number }).status;
  }
  return undefined;
}

function explainGithubError(error: unknown, prefix: string): string {
  const status = httpStatus(error);
  const message = error instanceof Error ? error.message : String(error);
  if (status === 404) return `${prefix} If the repository is private, set GITHUB_TOKEN or pass --token.`;
  if (status === 401 || status === 403) return `${prefix} GitHub refused the token (${status}). It needs pull requests, checks, and contents access.`;
  return `${prefix} ${message}`;
}

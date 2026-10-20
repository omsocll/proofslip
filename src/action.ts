import * as core from "@actions/core";
import fs from "node:fs";
import path from "node:path";
import { buildReceipt } from "./build.js";
import { detectAgent } from "./agents.js";
import { eventCommitSha, eventHeadBranch, splitList, resolvePullRequestNumber, type EventPayload } from "./event.js";
import { createOctokit, fetchPullRequestEvidence, findOpenPullRequest, parseRepo, postReceiptComment, publishReceipt } from "./github.js";
import { renderMarkdown } from "./render.js";

async function runAction(): Promise<void> {
  const token = core.getInput("github-token") || process.env.GITHUB_TOKEN || "";
  const onlyAgent = booleanInput("only-agent-prs", true);
  const extraLogins = splitList(core.getInput("agent-logins"));
  const labels = splitList(core.getInput("agent-labels"));
  const postComment = booleanInput("post-comment", true);
  const commitReceipt = booleanInput("commit-receipt", true);
  const branch = core.getInput("receipts-branch") || "receipts";
  const failOnMismatch = booleanInput("fail-on-mismatch", false);
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) throw new Error("GITHUB_REPOSITORY is not set.");
  const { owner, repo } = parseRepo(repository);

  const eventName = process.env.GITHUB_EVENT_NAME;
  const payload = readPayload();
  const octokit = createOctokit(token);
  let prNumber = resolvePullRequestNumber(eventName, payload, core.getInput("pr-number"));
  if (!prNumber) {
    const sha = eventCommitSha(eventName, payload);
    if (sha) prNumber = await findOpenPullRequest(octokit, owner, repo, sha, eventHeadBranch(eventName, payload));
  }
  if (!prNumber) {
    core.notice("proofslip found no pull request on this event, so there is nothing to receipt.");
    core.setOutput("overall", "skipped");
    return;
  }

  const evidence = await fetchPullRequestEvidence(octokit, owner, repo, prNumber);
  const detection = detectAgent(evidence, { extraLogins, labels: labels.length ? labels : undefined });
  if (onlyAgent && !detection.isAgent) {
    core.notice(`proofslip skipped PR #${prNumber}: ${evidence.author} does not look like a configured agent. Set only-agent-prs to false to receipt every pull request.`);
    core.setOutput("overall", "skipped");
    return;
  }

  const checkSummary = (evidence.checkRuns ?? [])
    .map((run) => `${run.name}=${run.conclusion ?? run.status}@${run.sha.slice(0, 7)}`)
    .join(", ");
  core.info(`Checks considered: ${checkSummary || "none"}`);

  const receipt = buildReceipt(evidence, { extraLogins, labels: labels.length ? labels : undefined });
  const markdown = renderMarkdown(receipt);
  const outDir = "proofslip-out";
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "receipt.json"), `${JSON.stringify(receipt, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, "receipt.md"), markdown);
  core.setOutput("overall", receipt.overall);
  core.setOutput("receipt-id", receipt.id);
  await core.summary.addRaw(markdown).write();
  core.info(receipt.summary_plain);

  if (postComment) {
    const url = await postReceiptComment(octokit, owner, repo, prNumber, markdown);
    core.setOutput("comment-url", url);
    core.info(`Updated the receipt comment: ${url}`);
  }
  if (commitReceipt) {
    try {
      const sha = await publishReceipt(octokit, owner, repo, branch, receipt, markdown);
      core.info(`Committed the receipt to ${branch} (${sha.slice(0, 7)}).`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      core.warning(`proofslip posted the receipt comment, but could not publish the ${branch} branch. ${message}`);
    }
  }
  if (failOnMismatch && receipt.overall === "doesnt_match") {
    core.setFailed("proofslip verdict is doesnt_match.");
  }
}

function booleanInput(name: string, fallback: boolean): boolean {
  const value = core.getInput(name);
  if (!value) return fallback;
  return core.getBooleanInput(name);
}

function readPayload(): EventPayload {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !fs.existsSync(eventPath)) return {};
  return JSON.parse(fs.readFileSync(eventPath, "utf8")) as EventPayload;
}

function invokedDirectly(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  return /[/\\]action\.(?:js|ts|mjs|cjs)$/.test(entry);
}

if (invokedDirectly()) {
  runAction().catch((error: unknown) => {
    core.setFailed(error instanceof Error ? error.message : String(error));
  });
}

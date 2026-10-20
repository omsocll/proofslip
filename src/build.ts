import { detectAgent, type DetectOptions } from "./agents.js";
import { extractClaims } from "./claims.js";
import { judgeClaims, overallVerdict } from "./judge.js";
import { summaryPlain, unverifiedFrom } from "./present.js";
import { detectRedFlags } from "./redflags.js";
import { reviewPushbackLine } from "./reviews.js";
import { receiptSchema } from "./schema.js";
import { claimSourceText, extractTask } from "./task.js";
import type { PrEvidence, Receipt } from "./types.js";
import { RECEIPT_SCHEMA_ID } from "./types.js";
import { VERSION } from "./version.js";

export interface BuildOptions extends DetectOptions {
  now?: Date;
  version?: string;
}

export function normalizeEvidence(input: PrEvidence): PrEvidence {
  return {
    ...input,
    title: input.title ?? "",
    body: input.body ?? "",
    author: input.author ?? "unknown",
    additions: input.additions ?? 0,
    deletions: input.deletions ?? 0,
    files: input.files ?? [],
    comments: input.comments ?? [],
    checkRuns: input.checkRuns ?? [],
    linkedIssues: input.linkedIssues ?? [],
    commits: input.commits ?? [],
    labels: input.labels ?? [],
    reviews: input.reviews ?? [],
  };
}

export function receiptId(repo: string, prNumber: number, sha: string): string {
  const slug = repo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${slug}-pr-${prNumber}-${sha.slice(0, 7)}`;
}

function holdChecksOut(overall: Receipt["overall"], heldBack: boolean): Receipt["overall"] {
  if (overall === "checks_out" && heldBack) return "partly_checked";
  return overall;
}

export function timestamp(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function buildReceipt(input: PrEvidence, options: BuildOptions = {}): Receipt {
  const evidence = normalizeEvidence(input);
  const agent = detectAgent(evidence, options);
  const task = extractTask(evidence);
  const claims = judgeClaims(extractClaims(claimSourceText(evidence), evidence.files), evidence);
  const report = detectRedFlags(evidence.files, evidence.checkRuns ?? [], evidence.headSha, claims);
  const reviewLine = reviewPushbackLine(evidence.reviews ?? []);
  const notes = reviewLine ? [...report.notes, reviewLine] : report.notes;
  const unverified = unverifiedFrom(claims, [...report.limits, ...notes]);
  const heldBack = reviewLine !== null || report.notes.some((note) => note.includes("do not by themselves"));
  const draft: Receipt = {
    schema: RECEIPT_SCHEMA_ID,
    id: receiptId(evidence.repo, evidence.number, evidence.headSha),
    created_at: timestamp(options.now ?? new Date()),
    repo: evidence.repo,
    pr: {
      number: evidence.number,
      url: evidence.url,
      head_sha: evidence.headSha,
      author: evidence.author,
    },
    agent: { name: agent.name, detected_by: agent.detectedBy },
    task,
    changes: {
      files_changed: evidence.changedFiles ?? evidence.files.length,
      additions: evidence.additions,
      deletions: evidence.deletions,
      files: evidence.files.map((file) => file.filename),
    },
    claims,
    red_flags: report.flags,
    overall: holdChecksOut(overallVerdict(claims, report.flags), heldBack),
    summary_plain: "",
    unverified,
    generator: { name: "proofslip", version: options.version ?? VERSION },
  };
  draft.summary_plain = summaryPlain(draft);
  return receiptSchema.parse(draft);
}

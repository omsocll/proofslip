import { isCiConfig, isTestFile } from "./diff.js";
import type { Receipt, ReceiptClaim } from "./types.js";
import { backtick, countLabel, formatList, lowerFirst } from "./text.js";

export const VERDICT_ICON = {
  confirmed: "✅",
  contradicted: "❌",
  stale: "⚠️",
  unverifiable: "❓",
} as const;

export const OVERALL_LABEL = {
  checks_out: "Checks out",
  partly_checked: "Partly checked",
  doesnt_match: "Doesn't match",
} as const;

export interface PresentedClaim {
  icon: string;
  text: string;
  detail: string;
  runUrl?: string;
  verdict: ReceiptClaim["verdict"];
}

export interface PresentedReceipt {
  overallLabel: string;
  task: string;
  changes: string;
  claims: PresentedClaim[];
  warnings: string[];
  unverified: string[];
  bottomLine: string;
  footer: string;
}

export function presentReceipt(receipt: Receipt): PresentedReceipt {
  return {
    overallLabel: OVERALL_LABEL[receipt.overall],
    task: taskLine(receipt),
    changes: describeChanges(receipt),
    claims: receipt.claims.map(presentClaim),
    warnings: receipt.red_flags.map((flag) => flag.summary),
    unverified: receipt.unverified ?? fallbackUnverified(receipt),
    bottomLine: bottomLine(receipt),
    footer: footer(receipt),
  };
}

export function summaryPlain(receipt: Receipt): string {
  const task = lowerFirst(receipt.task.text) || "do the work in the pull request";
  const count = receipt.changes.files_changed;
  const changed = `${count} ${count === 1 ? "file" : "files"} changed (${receipt.changes.additions} lines added, ${receipt.changes.deletions} removed).`;
  return `${receipt.agent.name} was asked to ${task}. ${changed} ${bottomLine(receipt)}`;
}

export function describeChanges(receipt: Receipt): string {
  const { files_changed: count, additions, deletions, files } = receipt.changes;
  if (count === 0 || files.length === 0) return "No files changed.";
  const line = `${countLabel(count, "file")} changed, ${countLabel(additions, "line")} added and ${deletions} removed.`;
  const readmes: string[] = [];
  const tests: string[] = [];
  const ci: string[] = [];
  const code: string[] = [];
  for (const file of files) {
    if (isTestFile(file)) tests.push(file);
    else if (/(^|\/)readme(\.|$)/i.test(file)) readmes.push(file);
    else if (isCiConfig(file)) ci.push(file);
    else code.push(file);
  }
  const parts: string[] = [];
  if (code.length > 0) parts.push(`code (${formatFiles(code)})`);
  if (tests.length > 0) parts.push(`tests (${formatFiles(tests)})`);
  if (ci.length > 0) parts.push(`CI config (${formatFiles(ci)})`);
  if (readmes.length === 1) parts.push("the README");
  else if (readmes.length > 1) parts.push(`docs (${formatFiles(readmes)})`);
  if (parts.length === 0) return line;
  return `${line} That includes ${formatList(parts)}.`;
}

export function bottomLine(receipt: Receipt): string {
  const contradicted = receipt.claims.filter((claim) => claim.verdict === "contradicted");
  const open = receipt.claims.filter((claim) => claim.verdict === "unverifiable" || claim.verdict === "stale");
  if (receipt.overall === "checks_out") {
    return "What we could check matches what the agent said.";
  }
  if (receipt.overall === "partly_checked") {
    const held = (receipt.unverified ?? []).find((line) => /asked for changes|do not by themselves/i.test(line));
    if (open.length === 0 && held) return held;
    if (open.length === 1) return "What we could check matches what the agent said. One claim still needs a human to look at it.";
    if (open.length > 1) {
      return `What we could check matches what the agent said. ${open.length} claims still need a human to look at them.`;
    }
    return "What we could check matches what the agent said. Some of this pull request still needs a human.";
  }
  const parts: string[] = [];
  if (contradicted.length === 1) parts.push(`One claim is contradicted: "${contradicted[0]!.text}".`);
  else if (contradicted.length > 1) parts.push(`${contradicted.length} claims are contradicted.`);
  if (receipt.red_flags.length === 1) parts.push(`There is a warning sign: ${receipt.red_flags[0]!.summary}`);
  else if (receipt.red_flags.length > 1) parts.push(`There are ${receipt.red_flags.length} warning signs.`);
  parts.push("This receipt does not match the agent's account.");
  return parts.join(" ");
}

export function unverifiedFrom(claims: ReceiptClaim[], limits: string[]): string[] {
  const lines = claims.filter((claim) => claim.verdict === "unverifiable").map((claim) => `"${claim.text}" — ${shortUnverified(claim)}`);
  return [...lines, ...limits];
}

function presentClaim(claim: ReceiptClaim): PresentedClaim {
  const runUrl = claim.evidence.find((item) => item.kind === "check_run" && item.url)?.url;
  return {
    icon: VERDICT_ICON[claim.verdict],
    text: claim.text,
    detail: claimDetail(claim),
    runUrl,
    verdict: claim.verdict,
  };
}

function claimDetail(claim: ReceiptClaim): string {
  if (claim.hedged) {
    const note = claim.evidence.find((item) => item.kind === "note")?.detail;
    return `we couldn't check this. ${note ?? "The agent already treated this as uncertain."}`;
  }
  if (claim.type === "file_changed") return fileDetail(claim);
  if (claim.type === "added_tests") return addedTestsDetail(claim);
  if (claim.type === "fixed_issue") return fixedDetail(claim);
  if (claim.type === "other") return "we couldn't check this. Nothing in the diff or the check runs covers it.";
  return checkDetail(claim);
}

function checkDetail(claim: ReceiptClaim): string {
  const name = claim.evidence.find((item) => item.kind === "check_run")?.name;
  const named = checkNameSuffix(name);
  const noun = checkNoun(claim.type);
  if (claim.verdict === "confirmed") return `confirmed. The ${noun} on this exact version of the code passed${named}.`;
  if (claim.verdict === "contradicted") {
    const note = claim.evidence.find((item) => item.kind === "note")?.detail;
    if (note) return `contradicted. ${note}`;
    return `contradicted. The ${noun} on this exact version of the code failed${named}.`;
  }
  if (claim.verdict === "stale") return `stale. This passed on an older commit${named}, not on the version in the pull request.`;
  const pending = claim.evidence.some((item) => item.conclusion === null || item.conclusion === "pending");
  if (pending) return `we couldn't check this. The ${noun} is still running${named}.`;
  const skipped = claim.evidence.some((item) => item.conclusion === "skipped" || item.conclusion === "cancelled");
  if (skipped) return `we couldn't check this. The ${noun} was skipped on this commit${named}.`;
  return `we couldn't check this. No ${noun} has run on this commit.`;
}

function checkNameSuffix(name: string | undefined): string {
  if (!name) return "";
  if (/^(tests?|ci)$/i.test(name.trim())) return "";
  return ` (${name})`;
}

function checkNoun(type: ReceiptClaim["type"]): string {
  if (type === "lint_pass") return "lint run";
  if (type === "build_pass") return "build";
  if (type === "typecheck_pass") return "typecheck";
  if (type === "checks_pass") return "checks";
  return "test run";
}

function fileDetail(claim: ReceiptClaim): string {
  const mentions = claim.evidence.filter((item) => item.detail?.startsWith("found in the patch:"));
  const present = claim.evidence
    .filter((item) => item.kind === "diff" && item.file && !item.detail?.startsWith("found in the patch:"))
    .map((item) => backtick(item.file!));
  const missing = claim.evidence.filter((item) => item.kind === "note" && item.file).map((item) => backtick(item.file!));
  if (claim.verdict === "unverifiable") {
    const note = claim.evidence.find((item) => item.kind === "note")?.detail;
    if (note?.toLowerCase().startsWith("couldn't verify")) return note.charAt(0).toLowerCase() + note.slice(1);
    return `couldn't verify this. ${note ?? "Nothing in the diff proves this sentence."}`;
  }
  if (claim.verdict === "confirmed") {
    const parts: string[] = [];
    if (present.length > 0) parts.push(`${formatList(present)} ${present.length === 1 ? "was" : "were"} changed`);
    if (mentions.length > 0) {
      const tokens = mentions.map((item) => backtick((item.detail ?? "").replace(/^found in the patch:\s*/, "")));
      parts.push(`${formatList(tokens)} ${tokens.length === 1 ? "is" : "are"} in the diff`);
    }
    if (parts.length === 0) return "confirmed. The named file was changed.";
    return `confirmed. ${parts.join(", and ")}.`;
  }
  if (missing.length > 0) return `contradicted. ${formatList(missing)} ${missing.length === 1 ? "is" : "are"} not in the diff.`;
  return "contradicted. The named file is not in the diff.";
}

function addedTestsDetail(claim: ReceiptClaim): string {
  if (claim.verdict === "confirmed") {
    const files = claim.evidence.filter((item) => item.kind === "diff" && item.file).map((item) => backtick(item.file!));
    const symbol = claim.evidence.find((item) => item.kind === "note" && item.detail?.startsWith("The changed tests mention"));
    const base = `confirmed. This pull request adds or updates ${files.length === 1 ? "a test file" : "test files"}${files.length ? ` (${formatList(files)})` : ""}.`;
    return symbol?.detail ? `${base} ${symbol.detail}` : base;
  }
  if (claim.verdict === "unverifiable") {
    const note = claim.evidence.find((item) => item.kind === "note")?.detail;
    if (note?.toLowerCase().startsWith("couldn't verify")) return note.charAt(0).toLowerCase() + note.slice(1);
    return `couldn't verify this. ${note ?? "Nothing in the diff proves a test was added."}`;
  }
  const symbol = claim.evidence.find((item) => item.kind === "note" && item.detail?.includes("not in the changed tests"));
  if (symbol?.detail) return `contradicted. ${symbol.detail}`;
  const deleted = claim.evidence.filter((item) => item.detail === "deleted" && item.file).map((item) => backtick(item.file!));
  if (deleted.length > 0) {
    const noun = deleted.length === 1 ? "the test file" : "the test files";
    return `contradicted. This pull request deleted ${noun} ${formatList(deleted)} and did not add or update a test.`;
  }
  return "contradicted. No test file was added or changed.";
}

function fixedDetail(claim: ReceiptClaim): string {
  if (claim.verdict === "confirmed") {
    return "confirmed. A test in this pull request mentions the issue, and the test run on this commit passed.";
  }
  return "we couldn't check this. Linking a pull request to an issue does not show the issue is fixed.";
}

function shortUnverified(claim: ReceiptClaim): string {
  if (claim.hedged) return "the agent already said this was uncertain.";
  if (claim.type === "other") return "nothing in GitHub's records covers it.";
  if (claim.type === "fixed_issue") return "a linked issue is not proof of a fix.";
  if (claim.evidence.some((item) => item.detail?.includes("cannot prove"))) return "a file name is not proof of that behaviour.";
  if (claim.evidence.some((item) => item.detail?.includes("too large"))) return "some diffs were too large to scan.";
  if (claim.evidence.some((item) => /couldn't verify|not in the diff/i.test(item.detail ?? ""))) return "couldn't verify it.";
  if (claim.verdict === "unverifiable") return "GitHub has no matching result for this commit.";
  return "this still needs a person.";
}

function fallbackUnverified(receipt: Receipt): string[] {
  return unverifiedFrom(receipt.claims, []);
}

function taskLine(receipt: Receipt): string {
  const text = receipt.task.text.trim().replace(/\.+$/, "");
  const issue = receipt.task.source.match(/^issue#(\d+)$/);
  if (issue && !text.includes(`#${issue[1]}`)) return `${text} (issue #${issue[1]}).`;
  return `${text}.`;
}

function footer(receipt: Receipt): string {
  const jsonUrl = `https://github.com/${receipt.repo}/blob/receipts/receipts/${receipt.id}.json`;
  return `[Pull request](${receipt.pr.url}) · [Raw JSON](${jsonUrl}) · Generated by proofslip v${receipt.generator.version}. This receipt only reports what GitHub records show. It is not a code review.`;
}

function formatFiles(files: string[]): string {
  const shown = files.slice(0, 6).map((file) => backtick(file));
  if (files.length > 6) shown.push(`${files.length - 6} more`);
  return formatList(shown);
}

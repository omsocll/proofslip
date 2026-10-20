import type { CheckRun, Evidence } from "./types.js";
import { defined } from "./text.js";

export type CheckKind = "test" | "lint" | "typecheck" | "build" | "other";

const FAIL = new Set(["failure", "timed_out", "startup_failure"]);
const RAN = new Set(["success", "failure", "timed_out", "startup_failure", "action_required", "neutral", "stale"]);

export type CiStatus = "none" | "pending" | "skipped" | "ran";

export function classifyCheck(name: string): CheckKind {
  const value = name.toLowerCase();
  if (/type[- ]?check|typecheck|\btsc\b|\bmypy\b|\bpyright\b/.test(value)) return "typecheck";
  if (/lint|eslint|ruff|clippy|stylelint|prettier|format/.test(value)) return "lint";
  if (/test|jest|vitest|pytest|rspec|mocha|cypress|playwright|phpunit|unittest|\bunit\b|\bspec\b|cargo test|go test/.test(value)) {
    return "test";
  }
  if (/build|compile|webpack|docker|package/.test(value)) return "build";
  return "other";
}

export function ciStatus(runs: CheckRun[], headSha: string): CiStatus {
  const onHead = runs.filter((run) => run.sha === headSha);
  if (onHead.length === 0) return "none";
  if (onHead.some((run) => run.status === "completed" && RAN.has(run.conclusion ?? ""))) return "ran";
  if (onHead.some((run) => run.status !== "completed")) return "pending";
  return "skipped";
}

export interface CheckJudgement {
  verdict: "confirmed" | "contradicted" | "stale" | "unverifiable";
  evidence: Evidence[];
  reason: "passed" | "failed" | "pending" | "skipped" | "stale" | "none";
}

export function judgeCheckGroup(runs: CheckRun[], headSha: string, kind: CheckKind | "any"): CheckJudgement {
  const relevant = kind === "any" ? runs : relevantChecks(runs, kind);
  const onHead = relevant.filter((run) => run.sha === headSha);
  const completed = onHead.filter((run) => run.status === "completed");
  const pending = onHead.filter((run) => run.status !== "completed");
  const failures = completed.filter((run) => FAIL.has(run.conclusion ?? ""));
  const successes = completed.filter((run) => run.conclusion === "success");

  if (failures.length > 0) {
    return { verdict: "contradicted", evidence: toEvidence(failures), reason: "failed" };
  }
  if (pending.length > 0) {
    return { verdict: "unverifiable", evidence: toEvidence(pending), reason: "pending" };
  }
  if (successes.length > 0 && groupPassed(kind, completed)) {
    return { verdict: "confirmed", evidence: toEvidence(successes), reason: "passed" };
  }
  const skipped = completed.filter((run) => run.conclusion === "skipped" || run.conclusion === "cancelled");
  if (skipped.length > 0) {
    return { verdict: "unverifiable", evidence: toEvidence(skipped), reason: "skipped" };
  }
  const older = relevant.filter((run) => run.sha !== headSha && run.conclusion === "success" && run.status === "completed");
  if (older.length > 0) {
    return { verdict: "stale", evidence: toEvidence(older.slice(0, 3)), reason: "stale" };
  }
  return { verdict: "unverifiable", evidence: [], reason: "none" };
}

function groupPassed(kind: CheckKind | "any", completed: CheckRun[]): boolean {
  if (kind !== "any") return true;
  return completed.every((run) => {
    const conclusion = run.conclusion ?? "";
    return conclusion === "success" || conclusion === "skipped" || conclusion === "neutral" || conclusion === "cancelled";
  });
}

function relevantChecks(runs: CheckRun[], kind: CheckKind): CheckRun[] {
  const specific = runs.filter((run) => classifyCheck(run.name) === kind);
  if (specific.length > 0) return specific;
  if (kind === "test") {
    const generic = runs.filter((run) => /^(ci|continuous integration|pipeline)$/i.test(run.name.trim()));
    if (generic.length > 0) return generic;
  }
  return [];
}

export function failedOnHead(runs: CheckRun[], headSha: string): CheckRun[] {
  return runs.filter((run) => run.sha === headSha && run.status === "completed" && FAIL.has(run.conclusion ?? ""));
}

function toEvidence(runs: CheckRun[]): Evidence[] {
  return runs.slice(0, 5).map((run) =>
    defined({
      kind: "check_run" as const,
      name: run.name,
      conclusion: run.conclusion,
      sha: run.sha,
      url: run.url ?? undefined,
    }),
  );
}

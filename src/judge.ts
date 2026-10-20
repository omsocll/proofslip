import { judgeCheckGroup, type CheckJudgement } from "./checks.js";
import { addedLines, isTestFile, patchMissing, patchText } from "./diff.js";
import { weakenedCommandFiles } from "./redflags.js";
import type { DiffFile, Evidence, PrEvidence, RawClaim, ReceiptClaim, RedFlag, Verdict } from "./types.js";
import { backtick, defined, formatList } from "./text.js";

export function judgeClaims(raw: RawClaim[], evidence: PrEvidence): ReceiptClaim[] {
  return raw.map((claim, index) => judgeOne(claim, evidence, index));
}

const HARD_FLAG = new Set(["tests_deleted", "tests_skipped", "assertions_removed", "test_command_weakened", "check_failed"]);
const CI_PASS = new Set(["tests_pass", "build_pass", "lint_pass", "typecheck_pass", "checks_pass"]);

export function overallVerdict(claims: ReceiptClaim[], redFlags: RedFlag[]): "checks_out" | "partly_checked" | "doesnt_match" {
  const hardFlag = redFlags.some((flag) => HARD_FLAG.has(flag.kind));
  const failedCheck = claims.some((claim) => claim.verdict === "contradicted" && CI_PASS.has(claim.type));
  if (hardFlag || failedCheck) return "doesnt_match";
  if (claims.length > 0 && claims.every((claim) => claim.verdict === "confirmed")) return "checks_out";
  return "partly_checked";
}

function judgeOne(claim: RawClaim, evidence: PrEvidence, index: number): ReceiptClaim {
  const runs = evidence.checkRuns ?? [];
  const files = evidence.files ?? [];
  let verdict: Verdict = "unverifiable";
  let items: Evidence[] = [];

  if (claim.type === "tests_pass" || claim.type === "build_pass" || claim.type === "lint_pass" || claim.type === "typecheck_pass" || claim.type === "checks_pass") {
    const kind = claim.type === "checks_pass" ? "any" : checkKind(claim.type);
    const judged = judgeCheckGroup(runs, evidence.headSha, kind);
    items = judged.evidence;
    verdict = claim.hedged ? "unverifiable" : judged.verdict;
    if (claim.hedged) items = annotateHedge(judged, items);
    if (verdict === "confirmed" && (claim.type === "tests_pass" || claim.type === "checks_pass")) {
      const weakened = weakenedCommandFiles(files);
      if (weakened.length > 0) {
        verdict = "contradicted";
        const names = formatList(weakened.map((file) => backtick(file)));
        items = [
          defined({
            kind: "note" as const,
            detail: `A green run does not count. The test command was weakened in ${names}, so the check can pass even when the tests fail.`,
            file: weakened[0],
          }),
          ...items,
        ];
      }
    }
  } else if (claim.type === "file_changed") {
    const result = judgeScoped(claim, files);
    verdict = result.verdict;
    items = result.evidence;
  } else if (claim.type === "added_tests") {
    const judged = judgeAddedTests(claim, files);
    verdict = judged.verdict;
    items = judged.evidence;
  } else if (claim.type === "fixed_issue") {
    const issue = claim.issue;
    const mentioning = files.filter((file) => {
      if (!isTestFile(file.filename) || file.status === "removed") return false;
      return (file.patch ?? "").includes(`#${issue}`);
    });
    const tests = judgeCheckGroup(runs, evidence.headSha, "test");
    const testsCount = tests.verdict === "confirmed" && weakenedCommandFiles(files).length === 0;
    if (issue !== undefined && mentioning.length > 0 && testsCount) {
      verdict = "confirmed";
      items = [
        ...mentioning.slice(0, 3).map((file) => defined({ kind: "diff" as const, file: file.filename })),
        ...tests.evidence.slice(0, 2),
      ];
    } else {
      verdict = "unverifiable";
      items = [
        defined({
          kind: "issue" as const,
          detail: issue
            ? `Linking this pull request to issue #${issue} does not show the issue is fixed.`
            : "No issue number was found.",
        }),
      ];
    }
  } else {
    verdict = "unverifiable";
    items = [defined({ kind: "note" as const, detail: "Nothing in the diff or the check runs can show this." })];
  }

  return defined({
    id: `c${index + 1}`,
    text: claim.text,
    type: claim.type,
    verdict,
    hedged: claim.hedged ? true : undefined,
    evidence: items,
  });
}

function checkKind(type: RawClaim["type"]): "test" | "lint" | "typecheck" | "build" {
  if (type === "lint_pass") return "lint";
  if (type === "typecheck_pass") return "typecheck";
  if (type === "build_pass") return "build";
  return "test";
}

function annotateHedge(judged: CheckJudgement, items: Evidence[]): Evidence[] {
  const note = hedgeNote(judged.reason);
  return [defined({ kind: "note" as const, detail: note }), ...items];
}

function hedgeNote(reason: CheckJudgement["reason"]): string {
  if (reason === "passed") return "The agent hedged. A matching check did pass, but the agent did not claim that outright.";
  if (reason === "failed") return "The agent hedged. A matching check on this commit failed.";
  if (reason === "pending") return "The agent hedged. A matching check is still running.";
  if (reason === "stale") return "The agent hedged. A matching check passed only on an older commit.";
  if (reason === "skipped") return "The agent hedged. The matching check was skipped.";
  return "The agent already treated this as uncertain.";
}

function judgeAddedTests(claim: RawClaim, files: DiffFile[]): { verdict: Verdict; evidence: Evidence[] } {
  const changed = files.filter((file) => testTouch(file) && file.status !== "removed" && file.status !== "unchanged");
  const deleted = files.filter((file) => isTestFile(file.filename) && file.status === "removed");
  const named = (claim.paths ?? []).filter((file) => isTestFile(file) || /\.(test|spec)\./i.test(file));
  const symbols = claim.mentions ?? [];

  if (changed.length === 0) {
    if (deleted.length > 0) {
      return {
        verdict: "contradicted",
        evidence: deleted.slice(0, 8).map((file) => defined({ kind: "diff" as const, file: file.filename, detail: "deleted" })),
      };
    }
    return {
      verdict: "unverifiable",
      evidence: [defined({ kind: "note" as const, detail: "Couldn't verify this. No test was added or changed." })],
    };
  }

  const missingNamed = named.filter((path) => !changed.some((file) => sameFile(path, file.filename)));
  if (named.length > 0 && missingNamed.length === named.length) {
    return {
      verdict: "unverifiable",
      evidence: missingNamed.map((file) => defined({ kind: "note" as const, file, detail: `Couldn't verify this. ${backtick(file)} is not in the diff.` })),
    };
  }

  const haystack = changed.map((file) => patchText(file.patch)).join("\n");
  const unscanned = changed.some((file) => patchMissing(file));
  const missingSymbols = symbols.filter((symbol) => !haystack.includes(symbol));
  if (missingSymbols.length > 0) {
    if (unscanned && haystack.trim() === "") {
      return {
        verdict: "unverifiable",
        evidence: [defined({ kind: "note" as const, detail: "The test diff was too large to look for the named symbol." })],
      };
    }
    return {
      verdict: "unverifiable",
      evidence: [
        ...changed.slice(0, 4).map((file) => defined({ kind: "diff" as const, file: file.filename })),
        defined({
          kind: "note" as const,
          detail: `Couldn't verify this. ${formatList(missingSymbols.map((symbol) => backtick(symbol)))} ${missingSymbols.length === 1 ? "is" : "are"} not in the changed tests.`,
        }),
      ],
    };
  }

  if (/\brebuil[dt]\b/i.test(claim.text) && /\bdist\b/i.test(claim.text) && !files.some((file) => /(?:^|\/)dist(?:\/|\.)/.test(file.filename))) {
    return {
      verdict: "unverifiable",
      evidence: [
        ...changed.slice(0, 4).map((file) => defined({ kind: "diff" as const, file: file.filename })),
        defined({ kind: "note" as const, detail: "A changed test file does not show that dist was rebuilt." }),
      ],
    };
  }

  const evidence: Evidence[] = changed.slice(0, 8).map((file) => defined({ kind: "diff" as const, file: file.filename }));
  if (symbols.length > 0) {
    evidence.push(defined({ kind: "note" as const, detail: `The changed tests mention ${formatList(symbols.map((symbol) => backtick(symbol)))}.` }));
  }
  return { verdict: "confirmed", evidence };
}

function judgeScoped(claim: RawClaim, files: DiffFile[]): { verdict: Verdict; evidence: Evidence[] } {
  const paths = claim.paths ?? [];
  const mentions = claim.mentions ?? [];
  const leftAlone = /\b(?:untouched|unchanged|left alone|without (?:editing|touching|changing|modifying)|not (?:edited|modified|changed|touched))\b/i.test(claim.text);
  if (leftAlone) {
    return {
      verdict: "unverifiable",
      evidence: [
        defined({
          kind: "note" as const,
          detail: "The sentence says this was left unchanged. A name in the patch, or a missing name, does not prove that.",
        }),
      ],
    };
  }
  const pathResult = paths.length > 0 ? judgeFiles(paths, files) : { verdict: "confirmed" as Verdict, evidence: [] as Evidence[] };
  const mentionResult = judgeMentions(mentions, files);
  const evidence = [...pathResult.evidence, ...mentionResult.evidence];
  if (paths.length === 0 && mentions.length === 0) {
    return {
      verdict: "unverifiable",
      evidence: [
        defined({
          kind: "note" as const,
          detail: "Couldn't verify this. A name in the diff confirms a sentence only when the sentence says that exact file or symbol was added or edited.",
        }),
      ],
    };
  }
  if (pathResult.verdict !== "confirmed" || mentionResult.verdict !== "confirmed") {
    return { verdict: "unverifiable", evidence };
  }
  const exclusive = exclusiveExtras(claim, files);
  if (exclusive.length > 0) {
    return {
      verdict: "unverifiable",
      evidence: [
        ...evidence,
        defined({
          kind: "note" as const,
          detail: `Couldn't verify this. Other files also changed (${formatList(exclusive.slice(0, 4).map((file) => backtick(file)))}), so this is not only that change.`,
        }),
      ],
    };
  }
  if (claim.overclaim) {
    return {
      verdict: "unverifiable",
      evidence: [
        ...evidence,
        defined({
          kind: "note" as const,
          detail: "The named file is in the diff, but this sentence claims behaviour a file name cannot prove.",
        }),
      ],
    };
  }
  return { verdict: "confirmed", evidence };
}

function testTouch(file: DiffFile): boolean {
  if (isTestFile(file.filename)) return true;
  return addedLines(file.patch).some((line) => /^\s*#\[(?:[\w:]+::)?test\]/.test(line) || /^\s*func\s+(?:\(\s*\w+\s+\*?\w+\s*\)\s+)?Test[A-Z]/.test(line));
}

function exclusiveExtras(claim: RawClaim, files: DiffFile[]): string[] {
  if (!/\bonly\b|\bthe only\b|\bno other files?\b|\bnothing else\b/i.test(claim.text)) return [];
  const named = new Set<string>();
  for (const path of claim.paths ?? []) {
    const match = resolvePath(path, files);
    if (match) named.add(match.filename);
  }
  for (const mention of [...(claim.mentions ?? []), ...(claim.supportingMentions ?? [])]) {
    for (const file of files) {
      if (file.status !== "unchanged" && patchText(file.patch).includes(mention)) named.add(file.filename);
    }
  }
  if (named.size === 0) return [];
  return files.filter((file) => file.status !== "unchanged" && !named.has(file.filename)).map((file) => file.filename);
}

function judgeMentions(mentions: string[], files: DiffFile[]): { verdict: Verdict; evidence: Evidence[] } {
  if (mentions.length === 0) return { verdict: "confirmed", evidence: [] };
  const found: Evidence[] = [];
  const missing: string[] = [];
  for (const mention of mentions) {
    const file = files.find((item) => item.status !== "unchanged" && patchText(item.patch).includes(mention));
    if (file) found.push(defined({ kind: "diff" as const, file: file.filename, detail: `found in the patch: ${mention}` }));
    else missing.push(mention);
  }
  if (missing.length === 0) return { verdict: "confirmed", evidence: found };
  const unscanned = files.some((file) => file.status !== "unchanged" && patchMissing(file));
  if (unscanned) {
    return {
      verdict: "unverifiable",
      evidence: [
        ...found,
        defined({
          kind: "note" as const,
          detail: `${formatList(missing.map((token) => backtick(token)))} ${missing.length === 1 ? "was" : "were"} not in the patches GitHub returned. Some diffs were too large to scan.`,
        }),
      ],
    };
  }
  return {
    verdict: "unverifiable",
    evidence: [
      ...found,
      ...missing.map((token) => defined({ kind: "note" as const, file: token, detail: `Couldn't verify this. ${backtick(token)} is not in the diff.` })),
    ],
  };
}

function sameFile(claimed: string, filename: string): boolean {
  if (filename === claimed) return true;
  if (filename.endsWith(`/${claimed}`)) return true;
  return filename.split("/").pop() === claimed.split("/").pop() && claimed.includes(".");
}

function judgeFiles(paths: string[], files: DiffFile[]): { verdict: Verdict; evidence: Evidence[] } {
  if (paths.length === 0) {
    return { verdict: "unverifiable", evidence: [defined({ kind: "note" as const, detail: "No file was named in the claim." })] };
  }
  const found: string[] = [];
  const missing: string[] = [];
  for (const path of paths) {
    const match = resolvePath(path, files);
    if (match) found.push(match.filename);
    else missing.push(path);
  }
  if (missing.length === 0) {
    return {
      verdict: "confirmed",
      evidence: found.map((file) => defined({ kind: "diff" as const, file })),
    };
  }
  return {
    verdict: "unverifiable",
    evidence: [
      ...found.map((file) => defined({ kind: "diff" as const, file })),
      ...missing.map((file) => defined({ kind: "note" as const, detail: `Couldn't verify this. ${backtick(file)} is not in the diff.`, file })),
    ],
  };
}

function resolvePath(claimed: string, files: DiffFile[]): DiffFile | undefined {
  const exact = files.find((file) => file.filename === claimed);
  if (exact) return exact;
  const bySuffix = files.filter((file) => file.filename.endsWith(`/${claimed}`));
  if (bySuffix.length === 1) return bySuffix[0];
  const base = claimed.split("/").pop();
  const byBase = files.filter((file) => file.filename.split("/").pop() === base);
  if (byBase.length === 1) return byBase[0];
  return undefined;
}

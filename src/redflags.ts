import { classifyCheck, ciStatus, failedOnHead } from "./checks.js";
import { addedLines, isCiConfig, isCodeFile, isCommandFile, isCommentLine, isTestFile, patchMissing, removedLines } from "./diff.js";
import type { CheckRun, ClaimType, DiffFile, RedFlag } from "./types.js";
import { backtick, formatList } from "./text.js";

const SKIP_PATTERNS = [
  /\bit\.skip\b/,
  /\btest\.skip\b/,
  /\bdescribe\.skip\b/,
  /\bcontext\.skip\b/,
  /\bxit\s*\(/,
  /\bxdescribe\s*\(/,
  /\bxtest\s*\(/,
  /\bxcontext\s*\(/,
  /@pytest\.mark\.skip/,
  /\bpytest\.skip\s*\(/,
  /\bunittest\.skip\b/,
  /\bt\.Skip(?:Now)?\s*\(/,
  /\b(?:it|test|describe)\.todo\s*\(/,
  /#\[ignore\]/,
];

const ASSERT_LINE =
  /\bexpect\s*\(|\bassert(?:Equal|Equals|True|False|NotEqual|_eq!|_ne!)?\b|\.should\b|\bself\.assert|\bconsole\.assert\b|\b(?:REQUIRE|CHECK|EXPECT_(?:EQ|NE|TRUE|FALSE|THAT|CALL))\s*\(/;

const TEST_CASE =
  /^\s*(?:it|test|describe)\s*\(|^\s*(?:async\s+)?def\s+test_|^\s*func\s+Test[A-Z]|^\s*#\[test\]|^\s*TEST(?:_F|_P)?\s*\(/;

const WEAK_COMMAND = /\|\|\s*true\b|\|\|\s*:\s*$|\|\|\s*exit\s+0\b|continue-on-error:\s*true/i;

const TEST_STEP =
  /\b(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?test\b|\b(?:pytest|vitest|jest|rspec|phpunit)\b|\bgo\s+test\b|\bcargo\s+test\b|\bmvn\s+(?:test|verify)\b|\bdotnet\s+test\b|\bpython\s+-m\s+(?:pytest|unittest)\b/i;

const PASS_CLAIM: ReadonlySet<ClaimType> = new Set([
  "tests_pass",
  "checks_pass",
  "lint_pass",
  "typecheck_pass",
  "build_pass",
]);

export interface ClaimSignal {
  type: ClaimType;
  hedged?: boolean;
}

export interface RedFlagReport {
  flags: RedFlag[];
  limits: string[];
  notes: string[];
}

export function weakenedCommandFiles(files: DiffFile[]): string[] {
  const weakened: string[] = [];
  for (const file of files) {
    if (!isCommandFile(file.filename) || file.status === "removed" || file.status === "unchanged") continue;
    if (patchMissing(file)) continue;
    const hit = addedLines(file.patch).some((line) => !isCommentLine(line) && WEAK_COMMAND.test(line));
    if (hit) weakened.push(file.filename);
  }
  return weakened;
}

export function detectRedFlags(
  files: DiffFile[],
  checkRuns: CheckRun[],
  headSha: string,
  claims: ClaimSignal[] = [],
): RedFlagReport {
  const flags: RedFlag[] = [];
  const limits: string[] = [];
  const notes: string[] = [];

  const deletedFiles = files.filter((file) => file.status === "removed" && isTestFile(file.filename));
  const caseRemovals: string[] = [];
  for (const file of files) {
    if (!isTestFile(file.filename) || file.status === "removed" || file.status === "unchanged") continue;
    if (patchMissing(file)) {
      limits.push(`The diff for ${backtick(file.filename)} was too large to inspect for deleted or skipped tests.`);
      continue;
    }
    const removed = removedLines(file.patch).filter((line) => !isCommentLine(line) && TEST_CASE.test(line)).length;
    const added = addedLines(file.patch).filter((line) => !isCommentLine(line) && TEST_CASE.test(line)).length;
    if (removed > added) caseRemovals.push(file.filename);
  }
  if (deletedFiles.length > 0 || caseRemovals.length > 0) {
    const names = [...deletedFiles.map((file) => file.filename), ...caseRemovals];
    const filePart = deletedFiles.length
      ? `Deleted ${deletedFiles.length === 1 ? "the test file" : "test files"} ${formatList(deletedFiles.map((file) => backtick(file.filename)))}.`
      : "";
    const casePart = caseRemovals.length
      ? `Removed test cases from ${formatList(caseRemovals.map((file) => backtick(file)))} without replacing them.`
      : "";
    flags.push({
      kind: "tests_deleted",
      summary: [filePart, casePart].filter(Boolean).join(" "),
      files: [...new Set(names)],
    });
  }

  const skipped: string[] = [];
  for (const file of files) {
    if (file.status === "removed" || file.status === "unchanged") continue;
    if (!isTestFile(file.filename) && !isCodeFile(file.filename)) continue;
    if (patchMissing(file)) continue;
    const hit = addedLines(file.patch).some((line) => !isCommentLine(line) && SKIP_PATTERNS.some((pattern) => pattern.test(line)));
    if (hit) skipped.push(file.filename);
  }
  if (skipped.length > 0) {
    flags.push({
      kind: "tests_skipped",
      summary: `Skipped tests were added in ${formatList(skipped.map((file) => backtick(file)))} (for example .skip, xit, or pytest.mark.skip).`,
      files: skipped,
    });
  }

  const assertionFiles: string[] = [];
  const assertionNotes: string[] = [];
  for (const file of files) {
    if (!isTestFile(file.filename) || file.status === "removed" || file.status === "unchanged") continue;
    if (patchMissing(file)) continue;
    const removed = removedLines(file.patch).filter((line) => !isCommentLine(line) && ASSERT_LINE.test(line)).length;
    const added = addedLines(file.patch).filter((line) => !isCommentLine(line) && ASSERT_LINE.test(line)).length;
    if (removed > added && removed > 0) {
      assertionFiles.push(file.filename);
      assertionNotes.push(`${backtick(file.filename)} (${removed} removed, ${added} added)`);
    }
  }
  if (assertionFiles.length > 0) {
    flags.push({
      kind: "assertions_removed",
      summary: `Removed assertions from tests without replacing them: ${formatList(assertionNotes)}.`,
      files: assertionFiles,
    });
  }

  const weakened = weakenedCommandFiles(files);
  if (weakened.length > 0) {
    flags.push({
      kind: "test_command_weakened",
      summary: `A test command was weakened in ${formatList(weakened.map((file) => backtick(file)))} (for example \`|| true\` or continue-on-error).`,
      files: weakened,
    });
  }

  const droppedSteps = droppedTestStepFiles(files);
  if (droppedSteps.length > 0) {
    const summary = `Removed a test step from ${formatList(droppedSteps.map((file) => backtick(file)))} and did not add one.`;
    const existing = flags.find((flag) => flag.kind === "tests_deleted");
    if (existing) {
      existing.summary = `${existing.summary} ${summary}`;
      existing.files = [...new Set([...existing.files, ...droppedSteps])];
    } else {
      flags.push({ kind: "tests_deleted", summary, files: droppedSteps });
    }
  }

  const ciFiles = files.filter((file) => isCiConfig(file.filename) && file.status !== "unchanged");
  const loud = new Set([...weakened, ...droppedSteps]);
  const benignCi = ciFiles.filter((file) => !loud.has(file.filename));
  if (benignCi.length > 0) {
    notes.push(
      `CI configuration changed in ${formatList(benignCi.map((file) => backtick(file.filename)))}. The edit does not drop a test step or weaken the test command, so it is not a warning sign by itself.`,
    );
  }

  const status = ciStatus(checkRuns, headSha);
  const passClaim = claims.some((claim) => PASS_CLAIM.has(claim.type) && !claim.hedged);
  if (passClaim && (status === "none" || status === "skipped")) {
    notes.push(
      status === "skipped"
        ? "CI checks on this commit were skipped or cancelled, so a claim that tests passed could not be verified."
        : "No CI checks have reported a result for this commit, so a claim that tests passed could not be verified.",
    );
  }

  const failed = unexplainedFailures(checkRuns, headSha, claims);
  const blocking = failed.filter((run) => isHardCheck(run.name));
  const advisory = failed.filter((run) => !isHardCheck(run.name) && isAdvisoryCheck(run.name));
  const other = failed.filter((run) => !isHardCheck(run.name) && !isAdvisoryCheck(run.name));
  if (blocking.length > 0) {
    flags.push({
      kind: "check_failed",
      summary: `These checks failed on this commit: ${formatList(blocking.map((run) => backtick(run.name)))}.`,
      files: [],
    });
  }
  if (advisory.length > 0) {
    notes.push(
      `These checks failed, but they are review bots or preview deploys, so they do not by themselves mean the change does not match: ${formatList(advisory.map((run) => backtick(run.name)))}.`,
    );
  }
  if (other.length > 0) {
    notes.push(
      `These checks failed, but they are not a test, build, lint, or security check, so they do not by themselves mean the change does not match: ${formatList(other.map((run) => backtick(run.name)))}.`,
    );
  }

  return { flags, limits, notes };
}

function droppedTestStepFiles(files: DiffFile[]): string[] {
  const dropped: string[] = [];
  for (const file of files) {
    if (!isCiConfig(file.filename) || file.status === "unchanged") continue;
    if (patchMissing(file)) continue;
    const removed = removedLines(file.patch).filter((line) => !isCommentLine(line) && TEST_STEP.test(line));
    const kept = addedLines(file.patch).some((line) => !isCommentLine(line) && TEST_STEP.test(line));
    if (removed.length > 0 && !kept) dropped.push(file.filename);
  }
  return dropped;
}

export function isHardCheck(name: string): boolean {
  if (isAdvisoryCheck(name)) return false;
  const kind = classifyCheck(name);
  if (kind === "test" || kind === "lint" || kind === "typecheck" || kind === "build") return true;
  return /\b(?:security|codeql|sast|semgrep|devskim|dependabot|vulnerabilit(?:y|ies)|secret scan|npm audit|cargo audit)\b/i.test(name);
}

export function isAdvisoryCheck(name: string): boolean {
  const value = name.toLowerCase();
  if (/coderabbit|greptile|bugbot|sourcery|ellipsis|claude-review|gemini code assist/.test(value)) return true;
  if (/\bcopilot\b/.test(value) && /\breview\b/.test(value)) return true;
  if (/netlify|deploy-preview|preview deploy|chromatic|argos|percy/.test(value)) return true;
  if (/\bvercel\b/.test(value) && /\b(?:preview|comment)\b/.test(value)) return true;
  if (/\b(?:redirect rules|header rules|pages changed)\b/.test(value)) return true;
  return false;
}

function unexplainedFailures(runs: CheckRun[], headSha: string, claims: ClaimSignal[]): CheckRun[] {
  return failedOnHead(runs, headSha).filter((run) => {
    const kind = classifyCheck(run.name);
    if (kind === "other") return true;
    const type: ClaimType =
      kind === "lint" ? "lint_pass" : kind === "typecheck" ? "typecheck_pass" : kind === "build" ? "build_pass" : "tests_pass";
    return !claims.some((claim) => claim.type === type);
  });
}

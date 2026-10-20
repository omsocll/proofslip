import type { DiffFile } from "./types.js";

const CODE_EXT = /\.(tsx?|jsx?|mjs|cjs|py|go|rb|rs|java|kt|php|cs|swift|scala|sh)$/i;

export function isTestFile(filename: string): boolean {
  const path = filename.replace(/\\/g, "/");
  const lower = path.toLowerCase();
  return (
    /(^|\/)(__tests__|tests?|specs?)(\/|$)/.test(lower) ||
    /\.(test|spec)\.[cm]?[jt]sx?$/.test(lower) ||
    /(?:^|\/)test_.+\.py$/.test(lower) ||
    /(?:^|\/).+_test\.py$/.test(lower) ||
    /_test\.go$/.test(lower) ||
    /_spec\.rb$/.test(lower) ||
    /(?:^|\/)[^/]*tests?\.php$/.test(lower) ||
    /(?:^|\/)[^/]*tests?\.cs$/.test(lower) ||
    /(?:^|\/)[^/]*test\.java$/.test(lower)
  );
}

export function isCiConfig(filename: string): boolean {
  const path = filename.replace(/\\/g, "/").toLowerCase();
  const base = path.split("/").pop() ?? path;
  return (
    path.startsWith(".github/workflows/") ||
    path.startsWith(".github/actions/") ||
    path.startsWith(".circleci/") ||
    path.startsWith(".buildkite/") ||
    base === "jenkinsfile" ||
    base === ".gitlab-ci.yml" ||
    base === "azure-pipelines.yml" ||
    base === ".travis.yml" ||
    base === "appveyor.yml" ||
    base === "bitbucket-pipelines.yml" ||
    base === "taskfile.yml"
  );
}

export function isCommandFile(filename: string): boolean {
  const path = filename.replace(/\\/g, "/").toLowerCase();
  const base = path.split("/").pop() ?? path;
  return (
    isCiConfig(filename) ||
    base === "package.json" ||
    base === "makefile" ||
    base === "justfile" ||
    base.endsWith(".sh") ||
    path.startsWith("scripts/")
  );
}

export function isCodeFile(filename: string): boolean {
  return CODE_EXT.test(filename);
}

export function fileStems(filename: string): string[] {
  const base = filename.split("/").pop() ?? filename;
  const withoutExt = base.replace(/\.[^.]+$/, "").replace(/\.(test|spec)$/i, "");
  return withoutExt
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .map((part) => part.toLowerCase())
    .filter((part) => part.length >= 4);
}

export function addedLines(patch: string | undefined): string[] {
  if (!patch) return [];
  return patch
    .split("\n")
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .map((line) => line.slice(1));
}

export function removedLines(patch: string | undefined): string[] {
  if (!patch) return [];
  return patch
    .split("\n")
    .filter((line) => line.startsWith("-") && !line.startsWith("---"))
    .map((line) => line.slice(1));
}

export function isCommentLine(line: string): boolean {
  const trimmed = line.trim();
  return (
    trimmed.startsWith("//") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("/*") ||
    trimmed.startsWith("--")
  );
}

export function patchMissing(file: DiffFile): boolean {
  if (file.status === "unchanged") return false;
  return file.patch === undefined || file.patch === "";
}

/** File contents GitHub included in a patch, without diff headers or the leading +, -, or space. */
export function patchText(patch: string | undefined): string {
  if (!patch) return "";
  return patch
    .split("\n")
    .filter((line) => !line.startsWith("@@") && !line.startsWith("diff ") && !line.startsWith("index "))
    .map((line) => (line.startsWith("+") || line.startsWith("-") || line.startsWith(" ") ? line.slice(1) : line))
    .join("\n");
}

import { describe, expect, it } from "vitest";
import { extractClaims, splitSentences } from "../src/claims.js";
import type { DiffFile } from "../src/types.js";

const files: DiffFile[] = [
  { filename: "src/Settings.tsx", status: "modified", additions: 1, deletions: 0 },
  { filename: "src/theme.ts", status: "modified", additions: 1, deletions: 0 },
  { filename: "src/Settings.test.tsx", status: "added", additions: 1, deletions: 0 },
  { filename: "README.md", status: "modified", additions: 1, deletions: 0 },
];

describe("extractClaims", () => {
  it("reads the common claim shapes", () => {
    const claims = extractClaims(
      [
        "All tests pass.",
        "Lint is clean.",
        "Typecheck passed.",
        "The build passed.",
        "CI is green.",
        "Added tests for the parser.",
        "Updated `src/theme.ts` to store the palette.",
        "Fixes #17.",
        "No breaking changes.",
        "Works on mobile.",
      ].join("\n"),
      files,
    );
    const types = claims.map((claim) => claim.type);
    expect(types).toContain("tests_pass");
    expect(types).toContain("lint_pass");
    expect(types).toContain("typecheck_pass");
    expect(types).toContain("build_pass");
    expect(types).toContain("checks_pass");
    expect(types).toContain("added_tests");
    expect(types).toContain("fixed_issue");
    expect(types).toContain("other");
    expect(claims.find((claim) => claim.type === "file_changed")?.paths).toEqual(["src/theme.ts"]);
    expect(claims.find((claim) => claim.type === "fixed_issue")?.issue).toBe(17);
    expect(claims.find((claim) => claim.type === "tests_pass")?.hedged).toBe(false);
  });

  it("records hedges instead of treating them as a pass", () => {
    const claims = extractClaims("I couldn't run the tests.\nTests should pass.\nThis should work.", files);
    const tests = claims.filter((claim) => claim.type === "tests_pass");
    expect(tests.every((claim) => claim.hedged)).toBe(true);
    expect(claims.some((claim) => claim.type === "other" && claim.hedged)).toBe(true);
  });

  it("does not treat a test filename stem as a change to that test", () => {
    const tests: DiffFile[] = [
      { filename: "tests/test_chat_snapshot.py", status: "modified", additions: 1, deletions: 0 },
    ];
    const claims = extractClaims("This body edit creates a separate metadata snapshot check.", tests);
    expect(claims.some((claim) => claim.type === "file_changed")).toBe(false);
  });

  it("does not treat ordinary words as an edit of a similarly named file", () => {
    const claims = extractClaims("Added a toggle to the settings page.", files);
    expect(claims.some((claim) => claim.type === "file_changed")).toBe(false);
  });

  it("ignores unchecked templates and fenced logs", () => {
    const text = "- [ ] All tests pass.\n```\nAll tests pass.\n```\n- [x] Lint is clean.";
    const claims = extractClaims(text, files);
    expect(claims.map((claim) => claim.type)).toEqual(["lint_pass"]);
  });

  it("splits a paragraph into sentences", () => {
    expect(splitSentences("All tests pass. Works on mobile.")).toEqual(["All tests pass.", "Works on mobile."]);
  });

  it("reads non-English test and fix lines, and keeps dotted tokens off the file list", () => {
    const claims = extractClaims(
      [
        "- [x] Frontend（47 テスト、すべて合格）",
        "Behebt #1583",
        "Corrige #9. Todos os testes passaram.",
        "Deleting an existing task uses `it.each` and still reads `params.name`.",
      ].join("\n"),
      files,
    );
    expect(claims.some((claim) => claim.type === "tests_pass" && claim.text.includes("すべて合格"))).toBe(true);
    expect(claims.find((claim) => claim.type === "fixed_issue" && claim.issue === 1583)).toBeTruthy();
    expect(claims.find((claim) => claim.type === "fixed_issue" && claim.issue === 9)).toBeTruthy();
    const portuguese = extractClaims("Todos os testes passaram.", files);
    expect(portuguese.some((claim) => claim.type === "tests_pass")).toBe(true);
    const dotted = claims.find((claim) => claim.mentions?.includes("it.each"));
    expect(dotted?.paths ?? []).not.toContain("it.each");
    expect(dotted?.mentions).toEqual(expect.arrayContaining(["it.each", "params.name"]));
  });

  it("treats a filename plus a rules claim as more than a file change", () => {
    const claims = extractClaims("The `CEEDAYS.cbl` stub implements the IBM rules.", files);
    const file = claims.find((claim) => claim.type === "file_changed");
    expect(file?.paths).toEqual(["CEEDAYS.cbl"]);
    expect(file?.overclaim).toBe(true);
  });

  it("keeps a user-facing bullet that names no file", () => {
    const claims = extractClaims("This PR lets users select several players.", files);
    expect(claims.map((claim) => claim.type)).toContain("other");
  });

  it("skips screenshot lines and what-changes headings", () => {
    const claims = extractClaims(
      [
        "What changes",
        "Behaviour changes:",
        "![the form](https://example.com/form.png)",
        "https://example.com/after.jpg",
        "Updated `src/theme.ts` to store the palette.",
      ].join("\n"),
      files,
    );
    expect(claims.map((claim) => claim.text)).toEqual(["Updated `src/theme.ts` to store the palette"]);
  });
});

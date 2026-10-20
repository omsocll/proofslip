import { describe, expect, it } from "vitest";
import { buildReceipt } from "../src/build.js";
import { renderMarkdown } from "../src/render.js";
import type { PrEvidence } from "../src/types.js";

const head = "a".repeat(40);
const older = "b".repeat(40);

function evidence(overrides: Partial<PrEvidence> = {}): PrEvidence {
  return {
    repo: "acme/widget",
    number: 1,
    url: "https://github.com/acme/widget/pull/1",
    title: "Do the thing",
    body: "All tests pass.",
    author: "copilot-swe-agent[bot]",
    headSha: head,
    additions: 3,
    deletions: 1,
    files: [{ filename: "src/app.ts", status: "modified", additions: 3, deletions: 1, patch: "+export const ok = true;\n" }],
    checkRuns: [],
    ...overrides,
  };
}

describe("judge", () => {
  it("marks a passing check on this commit as confirmed", () => {
    const receipt = buildReceipt(evidence({
      checkRuns: [{ name: "unit", status: "completed", conclusion: "success", sha: head, url: "https://example.test/run" }],
    }));
    expect(receipt.claims.find((claim) => claim.type === "tests_pass")?.verdict).toBe("confirmed");
    expect(receipt.overall).toBe("checks_out");
  });

  it("marks a failure on this commit as contradicted", () => {
    const receipt = buildReceipt(evidence({
      checkRuns: [{ name: "unit", status: "completed", conclusion: "failure", sha: head, url: null }],
    }));
    expect(receipt.claims.find((claim) => claim.type === "tests_pass")?.verdict).toBe("contradicted");
    expect(receipt.overall).toBe("doesnt_match");
  });

  it("marks a pass on an older commit as stale", () => {
    const receipt = buildReceipt(evidence({
      checkRuns: [{ name: "unit", status: "completed", conclusion: "success", sha: older, url: null }],
    }));
    expect(receipt.claims.find((claim) => claim.type === "tests_pass")?.verdict).toBe("stale");
    expect(receipt.red_flags.map((flag) => flag.kind)).not.toContain("ci_never_ran");
    expect(receipt.overall).toBe("partly_checked");
    expect(receipt.unverified?.some((line) => /no ci checks have reported a result/i.test(line))).toBe(true);
  });

  it("does not treat a still-running check as a failure or a red flag", () => {
    const receipt = buildReceipt(evidence({
      checkRuns: [{ name: "unit", status: "in_progress", conclusion: null, sha: head, url: null }],
    }));
    expect(receipt.claims.find((claim) => claim.type === "tests_pass")?.verdict).toBe("unverifiable");
    expect(receipt.red_flags).toEqual([]);
    expect(receipt.overall).toBe("partly_checked");
  });

  it("keeps a hedged test sentence unverifiable even when the run failed", () => {
    const receipt = buildReceipt(evidence({
      body: "I couldn't run the tests.",
      checkRuns: [{ name: "unit", status: "completed", conclusion: "failure", sha: head, url: null }],
    }));
    const claim = receipt.claims.find((item) => item.type === "tests_pass");
    expect(claim?.hedged).toBe(true);
    expect(claim?.verdict).toBe("unverifiable");
    expect(receipt.overall).toBe("partly_checked");
  });

  it("confirms a fixed-issue claim only when a new test mentions it and passes", () => {
    const passing = buildReceipt(evidence({
      body: "Fixes #12",
      title: "Handle empty input",
      files: [{
        filename: "src/input.test.ts",
        status: "added",
        additions: 4,
        deletions: 0,
        patch: "+test(\"empty #12\", () => expect(clean(\"\")).toBe(\"\"));\n",
      }],
      checkRuns: [{ name: "test", status: "completed", conclusion: "success", sha: head, url: null }],
      linkedIssues: [{ number: 12, title: "Handle empty input", body: "" }],
    }));
    expect(passing.claims.find((claim) => claim.type === "fixed_issue")?.verdict).toBe("confirmed");

    const unproven = buildReceipt(evidence({
      body: "Fixes #12",
      title: "Handle empty input",
      files: [{ filename: "src/input.ts", status: "modified", additions: 1, deletions: 0, patch: "+export const clean = (v) => v;\n" }],
      checkRuns: [{ name: "test", status: "completed", conclusion: "success", sha: head, url: null }],
      linkedIssues: [{ number: 12, title: "Handle empty input", body: "All tests pass." }],
    }));
    expect(unproven.claims.find((claim) => claim.type === "fixed_issue")?.verdict).toBe("unverifiable");
    expect(unproven.claims.some((claim) => claim.type === "tests_pass")).toBe(false);
  });

  it("does not treat a green run as proof when the test command was weakened", () => {
    const receipt = buildReceipt(evidence({
      files: [{
        filename: "package.json",
        status: "modified",
        additions: 1,
        deletions: 1,
        patch: "-  \"test\": \"vitest run\"\n+  \"test\": \"vitest run || true\"\n",
      }],
      checkRuns: [{ name: "test", status: "completed", conclusion: "success", sha: head, url: "https://example.test/run" }],
    }));
    const claim = receipt.claims.find((item) => item.type === "tests_pass");
    expect(claim?.verdict).toBe("contradicted");
    const markdown = renderMarkdown(receipt);
    expect(markdown).toContain("A green run does not count.");
    expect(markdown).toContain("`package.json`");
    expect(markdown).not.toContain("exact version of the code passed");
  });

  it("says which test file was deleted when none was added", () => {
    const receipt = buildReceipt(evidence({
      body: "Added tests.",
      files: [{
        filename: "tests/readme.test.ts",
        status: "removed",
        additions: 0,
        deletions: 4,
        patch: "-it(\"works\", () => expect(true).toBe(true));\n",
      }],
      checkRuns: [{ name: "test", status: "completed", conclusion: "success", sha: head, url: null }],
    }));
    const markdown = renderMarkdown(receipt);
    expect(receipt.claims.find((item) => item.type === "added_tests")?.verdict).toBe("contradicted");
    expect(markdown).toContain("deleted the test file `tests/readme.test.ts`");
    expect(markdown).not.toContain("No test file was added or changed.");
  });

  it("does not contradict a named file that is not in the diff", () => {
    const receipt = buildReceipt(evidence({
      body: "Updated `src/missing.ts`.",
      checkRuns: [{ name: "test", status: "completed", conclusion: "success", sha: head, url: null }],
    }));
    const claim = receipt.claims.find((item) => item.type === "file_changed");
    expect(claim?.verdict).toBe("unverifiable");
    expect(claim?.evidence.some((item) => /couldn't verify/i.test(item.detail ?? ""))).toBe(true);
    expect(receipt.overall).not.toBe("doesnt_match");
    expect(renderMarkdown(receipt).toLowerCase()).toContain("couldn't verify");
  });
});

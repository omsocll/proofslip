import { describe, expect, it } from "vitest";
import { describeChanges } from "../src/present.js";
import type { Receipt } from "../src/types.js";

function receipt(files: string[]): Receipt {
  return {
    schema: "agent-receipt/v0",
    id: "x",
    created_at: "2026-01-01T00:00:00.000Z",
    repo: "acme/widget",
    pr: { number: 1, url: "https://example.test/1", head_sha: "abc", author: "ada" },
    agent: { name: "ada", detected_by: "label" },
    task: { source: "pr", text: "Do the thing" },
    changes: { files_changed: files.length, additions: 1, deletions: 0, files },
    claims: [],
    red_flags: [],
    overall: "checks_out",
    summary_plain: "",
    generator: { name: "proofslip", version: "0.1.0" },
  };
}

describe("change summary", () => {
  it("treats a test file named readme as a test, not the README", () => {
    const summary = describeChanges(receipt(["package.json", "tests/readme.test.ts"]));
    expect(summary).toContain("tests (`tests/readme.test.ts`)");
    expect(summary).not.toContain("the README");
  });

  it("still calls README.md the README", () => {
    expect(describeChanges(receipt(["README.md"]))).toContain("the README");
  });
});

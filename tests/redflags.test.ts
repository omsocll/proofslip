import { describe, expect, it } from "vitest";
import { detectRedFlags } from "../src/redflags.js";
import type { CheckRun, DiffFile } from "../src/types.js";

const head = "a".repeat(40);
const passed: CheckRun = { name: "test", status: "completed", conclusion: "success", sha: head, url: null };

function flagKinds(files: DiffFile[], runs: CheckRun[] = [passed]): string[] {
  return detectRedFlags(files, runs, head).flags.map((flag) => flag.kind);
}

describe("detectRedFlags", () => {
  it("flags a deleted test file", () => {
    const files: DiffFile[] = [{ filename: "src/auth.test.ts", status: "removed", additions: 0, deletions: 10, patch: "-test('x', () => expect(1).toBe(1));\n" }];
    expect(flagKinds(files)).toContain("tests_deleted");
  });

  it("flags a skipped test and a weakened command, not a comment that mentions || true", () => {
    const files: DiffFile[] = [
      {
        filename: "src/user.test.ts",
        status: "modified",
        additions: 1,
        deletions: 1,
        patch: "@@\n-  it(\"works\", () => expect(1).toBe(1));\n+  it.skip(\"works\", () => {});\n",
      },
      {
        filename: ".github/workflows/ci.yml",
        status: "modified",
        additions: 2,
        deletions: 1,
        patch: "@@\n+# never do this: || true\n-      - run: npm test\n+      - run: npm test || true\n",
      },
    ];
    const kinds = flagKinds(files);
    expect(kinds).toContain("tests_skipped");
    expect(kinds).toContain("test_command_weakened");
    expect(kinds).not.toContain("ci_config_edited");
    expect(kinds).toContain("assertions_removed");
  });

  it("does not flag a comment or a markdown mention of it.skip", () => {
    const files: DiffFile[] = [
      {
        filename: "docs/notes.md",
        status: "added",
        additions: 1,
        deletions: 0,
        patch: "+Use it.skip when a test is flaky.\n",
      },
    ];
    expect(flagKinds(files)).not.toContain("tests_skipped");
  });

  it("does not flag assertions that were replaced", () => {
    const files: DiffFile[] = [
      {
        filename: "src/user.test.ts",
        status: "modified",
        additions: 1,
        deletions: 1,
        patch: "@@\n-    expect(value).toBe(1);\n+    expect(value).toBe(2);\n",
      },
    ];
    expect(flagKinds(files)).not.toContain("assertions_removed");
  });

  it("notes a missing CI result when a pass claim would need it, and does not make that a warning sign", () => {
    expect(flagKinds([], [])).not.toContain("ci_never_ran");
    const missing = detectRedFlags([], [], head, [{ type: "tests_pass" }]);
    expect(missing.flags.map((flag) => flag.kind)).not.toContain("ci_never_ran");
    expect(missing.notes.some((note) => /no ci checks have reported a result/i.test(note))).toBe(true);
    const pending: CheckRun = { name: "test", status: "in_progress", conclusion: null, sha: head, url: null };
    expect(detectRedFlags([], [pending], head, [{ type: "tests_pass" }]).notes.some((note) => /no ci checks/i.test(note))).toBe(false);
    expect(detectRedFlags([], [], head, [{ type: "tests_pass", hedged: true }]).notes.some((note) => /no ci checks/i.test(note))).toBe(false);
  });

  it("keeps a weakened command and a deleted test step, and only notes a benign workflow edit", () => {
    const weakened: DiffFile[] = [{
      filename: ".github/workflows/ci.yml",
      status: "modified",
      additions: 1,
      deletions: 1,
      patch: "@@\n-      - run: npm test\n+      - run: npm test || true\n",
    }];
    expect(flagKinds(weakened)).toContain("test_command_weakened");
    expect(flagKinds(weakened)).not.toContain("tests_deleted");

    const dropped: DiffFile[] = [{
      filename: ".github/workflows/ci.yml",
      status: "modified",
      additions: 1,
      deletions: 1,
      patch: "@@\n-      - run: npm test\n+      - run: npm run build\n",
    }];
    expect(flagKinds(dropped)).toContain("tests_deleted");
    expect(flagKinds(dropped)).not.toContain("ci_config_edited");

    const benign: DiffFile[] = [{
      filename: ".github/workflows/update-dashboard.yml",
      status: "modified",
      additions: 1,
      deletions: 1,
      patch: "@@\n-          ts-node scripts/generate-dashboard.ts\n+          node scripts/generate-dashboard.mjs\n",
    }];
    const report = detectRedFlags(benign, [passed], head);
    expect(report.flags).toEqual([]);
    expect(report.notes.some((note) => note.includes("update-dashboard.yml"))).toBe(true);
  });

  it("surfaces a failed check that is not a test run", () => {
    const security: CheckRun = { name: "security", status: "completed", conclusion: "failure", sha: head, url: null };
    const kinds = detectRedFlags([], [passed, security], head, [{ type: "tests_pass" }]).flags.map((flag) => flag.kind);
    expect(kinds).toContain("check_failed");
    expect(kinds).not.toContain("ci_never_ran");
  });
});

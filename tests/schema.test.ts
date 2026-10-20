import { readFileSync } from "node:fs";
import Ajv from "ajv/dist/2020.js";
import { describe, expect, it } from "vitest";
import { receiptSchema } from "../src/schema.js";
import { VERSION } from "../src/version.js";
import { loadFixture } from "./helpers.js";

const jsonSchema = JSON.parse(readFileSync("schema/receipt.v0.json", "utf8"));
const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as { version: string };

describe("receipt schema", () => {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(jsonSchema);

  it("accepts the spec example", () => {
    const example = {
      schema: "agent-receipt/v0",
      id: "omsocll-demo-pr-42-3f9c2e1",
      created_at: "2026-10-19T09:40:00Z",
      repo: "omsocll/demo",
      pr: {
        number: 42,
        url: "https://github.com/omsocll/demo/pull/42",
        head_sha: "3f9c2e1",
        author: "copilot-swe-agent[bot]",
      },
      agent: { name: "GitHub Copilot", detected_by: "author" },
      task: { source: "issue#17", text: "Add dark mode toggle to settings page" },
      changes: {
        files_changed: 4,
        additions: 120,
        deletions: 8,
        files: ["src/Settings.tsx", "src/theme.ts", "src/Settings.test.tsx", "README.md"],
      },
      claims: [
        {
          id: "c1",
          text: "All tests pass",
          type: "tests_pass",
          verdict: "confirmed",
          evidence: [{ kind: "check_run", name: "test", conclusion: "success", sha: "3f9c2e1", url: "https://github.com/omsocll/demo/actions/runs/123" }],
        },
        {
          id: "c2",
          text: "Added a toggle to the settings page",
          type: "file_changed",
          verdict: "confirmed",
          evidence: [{ kind: "diff", file: "src/Settings.tsx" }],
        },
        {
          id: "c3",
          text: "Works on mobile",
          type: "other",
          verdict: "unverifiable",
          evidence: [],
        },
      ],
      red_flags: [],
      overall: "partly_checked",
      summary_plain: "GitHub Copilot was asked to add a dark mode toggle to settings page.",
      generator: { name: "proofslip", version: "0.1.0" },
    };
    expect(receiptSchema.parse(example).id).toBe(example.id);
    expect(validate(example), ajv.errorsText(ajv.errors)).toBe(true);
  });

  it("accepts receipts built from the fixtures", () => {
    for (const name of ["honest.json", "false-tests-pass.json", "deleted-tests.json", "ci-never-ran.json", "partly-checked.json"]) {
      const { receipt } = loadFixture(name);
      expect(receiptSchema.parse(receipt).schema).toBe("agent-receipt/v0");
      expect(validate(receipt), `${name} ${ajv.errorsText(ajv.errors)}`).toBe(true);
    }
  });

  it("keeps the package version and the generator version together", () => {
    expect(VERSION).toBe(packageJson.version);
    expect(VERSION).toBe("0.1.1");
  });
});

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { run } from "../src/cli.js";
import { generateSite, loadReceipts } from "../src/site.js";
import { loadFixture } from "./helpers.js";

describe("cli", () => {
  it("writes a receipt from a fixture", async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "proofslip-"));
    const code = await run(["receipt", "--fixture", "fixtures/honest.json", "--out", out]);
    expect(code).toBe(0);
    const receipt = JSON.parse(fs.readFileSync(path.join(out, "receipt.json"), "utf8")) as { overall: string };
    expect(receipt.overall).toBe("checks_out");
    expect(fs.readFileSync(path.join(out, "receipt.md"), "utf8")).toContain("Checks out");
  });

  it("exits 2 when a mismatched receipt is asked to fail", async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "proofslip-"));
    const code = await run(["receipt", "--fixture", "fixtures/false-tests-pass.json", "--out", out, "--fail-on-mismatch"]);
    expect(code).toBe(2);
  });

  it("builds a filterable static log", () => {
    const source = fs.mkdtempSync(path.join(os.tmpdir(), "proofslip-receipts-"));
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "proofslip-site-"));
    for (const name of ["honest.json", "false-tests-pass.json", "deleted-tests.json"]) {
      const { receipt } = loadFixture(name);
      fs.writeFileSync(path.join(source, `${receipt.id}.json`), JSON.stringify(receipt));
    }
    fs.writeFileSync(path.join(source, "notes.json"), JSON.stringify({ hello: "not a receipt" }));
    const loaded = loadReceipts(source);
    expect(loaded.receipts).toHaveLength(3);
    expect(loaded.skipped).toEqual(["notes.json"]);
    generateSite(loaded.receipts, out);
    const index = fs.readFileSync(path.join(out, "index.html"), "utf8");
    expect(index).toContain('data-filter="checks_out"');
    expect(index).toContain('data-filter="partly_checked"');
    expect(index).toContain('data-filter="doesnt_match"');
    expect(index).toContain("data-overall=\"checks_out\"");
    expect(index).toContain("data-overall=\"doesnt_match\"");
    const page = fs.readFileSync(path.join(out, "receipts", `${loaded.receipts[0]!.id}.html`), "utf8");
    expect(page).toContain("What the agent was asked");
    expect(page).toContain("It is not a code review.");
    expect(fs.existsSync(path.join(out, "receipts", `${loaded.receipts[0]!.id}.json`))).toBe(true);
  });
});

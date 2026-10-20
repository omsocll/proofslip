import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { generateWebsite } from "../src/website.js";
import { loadReceipts } from "../src/site.js";
import { loadFixture } from "./helpers.js";

describe("public site", () => {
  it("writes a landing page and a receipt log", () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "proofslip-www-"));
    const honest = loadFixture("honest.json").receipt;
    const weakened = loadFixture("deleted-tests.json").receipt;
    generateWebsite([honest, weakened], out);
    const index = fs.readFileSync(path.join(out, "index.html"), "utf8");
    expect(index).toContain("Plain-English receipts for AI agent pull requests");
    expect(index).toContain("https://x.com/kickscosmo");
    expect(index).toContain("@kickscosmo");
    expect(index).toContain("https://github.com/omsocll");
    expect(index).toContain("github.com/omsocll/proofslip");
    expect(index).toContain("Checks out");
    expect(index).toContain("Doesn't match");
    expect(index).toContain("A green run does not count.");
    expect(index).toContain('href="log/index.html"');
    expect(index).toContain("agent pull request.");
    expect(index).toContain("How accurate is it?");
    expect(index).toContain("19/20");
    expect(index).toContain("Fresh set");
    expect(index).toContain("never been too rosy");
    expect(index).toContain("19 of the 19");
    expect(index).toContain("20 of 20");
    expect(index).toContain("15 of 20");
    expect(index).toContain("docs/evaluation.md");
    expect(index).toContain("Claimed");
    expect(index).toContain("Found");
    expect(index).toContain("#0f5132");
    expect(index).not.toContain("#1a2ee8");
    expect(index).toContain("data:image/svg+xml");
    expect(index).toContain("%23c3d4cb");
    expect(index).toContain(`data-copy="proofslip receipt --repo owner/name --pr 42"`);
    expect(index).toContain("fonts/outfit-800.woff2");
    expect(fs.existsSync(path.join(out, "fonts", "outfit-800.woff2"))).toBe(true);
    const log = fs.readFileSync(path.join(out, "log", "index.html"), "utf8");
    expect(log).toContain("Receipt log");
    expect(log).toContain("Get started");
    expect(log).toContain("../fonts/outfit-800.woff2");
    const receipt = fs.readFileSync(path.join(out, "log", "receipts", `${honest.id}.html`), "utf8");
    const email = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/;
    for (const page of [index, log, receipt]) {
      const visible = page.replaceAll("https://x.com/kickscosmo", "").replaceAll("@kickscosmo", "");
      expect(visible).not.toMatch(email);
    }
    expect(receipt).toContain("What the agent was asked");
    expect(receipt).toContain("../../fonts/outfit-800.woff2");
    expect(fs.existsSync(path.join(out, "log", "receipts", `${honest.id}.html`))).toBe(true);
  });

  it("commits the honest and dishonest demo receipts", () => {
    const { receipts } = loadReceipts("site/receipts");
    const overalls = receipts.map((receipt) => receipt.overall).sort();
    expect(overalls).toEqual(["checks_out", "doesnt_match"]);
    const dishonest = receipts.find((receipt) => receipt.overall === "doesnt_match");
    const tests = dishonest?.claims.find((claim) => claim.type === "tests_pass");
    const added = dishonest?.claims.find((claim) => claim.type === "added_tests");
    expect(tests?.verdict).toBe("contradicted");
    expect(tests?.evidence.some((item) => item.detail?.includes("green run does not count"))).toBe(true);
    expect(added?.verdict).toBe("contradicted");
    expect(added?.evidence.some((item) => item.detail === "deleted")).toBe(true);
  });
});

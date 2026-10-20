import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { renderMarkdown } from "../src/render.js";
import { loadFixture } from "./helpers.js";

describe("README sample", () => {
  it("includes the partly checked receipt the tool actually writes", () => {
    const readme = fs.readFileSync("README.md", "utf8");
    const markdown = renderMarkdown(loadFixture("partly-checked.json").receipt);
    const claim = markdown
      .split("\n")
      .find((line) => line.includes("Works on mobile"));
    expect(claim).toBeTruthy();
    expect(readme).toContain(claim!.replace(/^- /, "").trim());
    expect(readme).toContain("One claim still needs a human to look at it.");
    expect(readme).toContain("lindayi/hermes-mobile");
    expect(readme).toContain("10-second honesty check on every AI agent pull request, readable by anyone");
    expect(readme).toContain("omsocll/proofslip@v0.1.1");
    expect(readme).toContain("https://x.com/kickscosmo");
    expect(readme).toContain("https://proofslip.vercel.app");
    expect(readme).toContain("docs/evaluation.md");
  });
});
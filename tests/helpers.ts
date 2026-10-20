import fs from "node:fs";
import path from "node:path";
import { buildReceipt } from "../src/build.js";
import type { PrEvidence, Receipt } from "../src/types.js";

interface FixtureFile {
  name: string;
  now: string;
  evidence: PrEvidence;
}

export function loadFixture(name: string): { evidence: PrEvidence; receipt: Receipt } {
  const raw = JSON.parse(fs.readFileSync(path.join("fixtures", name), "utf8")) as FixtureFile;
  const receipt = buildReceipt(raw.evidence, { now: new Date(raw.now) });
  return { evidence: raw.evidence, receipt };
}

export function verdictOf(receipt: Receipt, type: Receipt["claims"][number]["type"]): string | undefined {
  return receipt.claims.find((claim) => claim.type === type)?.verdict;
}

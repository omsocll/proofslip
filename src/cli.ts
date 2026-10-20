import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { buildReceipt, type BuildOptions } from "./build.js";
import { createOctokit, fetchPullRequestEvidence, parseRepo, ProofslipError } from "./github.js";
import { renderMarkdown } from "./render.js";
import { generateSite, loadReceipts } from "./site.js";
import { generateWebsite } from "./website.js";
import type { PrEvidence } from "./types.js";
import { VERSION } from "./version.js";

interface FixtureFile {
  now?: string;
  evidence?: PrEvidence;
}

export async function run(argv: string[]): Promise<number> {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      pr: { type: "string" },
      repo: { type: "string" },
      token: { type: "string" },
      out: { type: "string" },
      fixture: { type: "string" },
      receipts: { type: "string" },
      json: { type: "boolean", default: false },
      "fail-on-mismatch": { type: "boolean", default: false },
      version: { type: "boolean", short: "v", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });

  if (values.version) {
    console.log(VERSION);
    return 0;
  }
  const command = positionals[0] ?? "receipt";
  if (values.help) {
    console.log(helpText());
    return 0;
  }
  if (command === "log") return writeLog(values.receipts, values.out);
  if (command === "site") return writeWebsite(values.receipts, values.out);
  if (command !== "receipt") {
    console.error(`Unknown command "${command}".\n\n${helpText()}`);
    return 1;
  }
  return writeReceipt(values);
}

async function writeReceipt(values: {
  pr?: string;
  repo?: string;
  token?: string;
  out?: string;
  fixture?: string;
  json: boolean;
  "fail-on-mismatch": boolean;
}): Promise<number> {
  const outDir = values.out ?? "proofslip-out";
  const built = values.fixture ? receiptFromFixture(values.fixture) : await receiptFromGitHub(values);
  const markdown = renderMarkdown(built.receipt);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "receipt.json"), `${JSON.stringify(built.receipt, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, "receipt.md"), markdown);
  if (values.json) console.log(JSON.stringify(built.receipt, null, 2));
  else console.log(markdown);
  console.error(`Wrote ${path.join(outDir, "receipt.json")} (${built.receipt.overall}).`);
  if (values["fail-on-mismatch"] && built.receipt.overall === "doesnt_match") return 2;
  return 0;
}

function receiptFromFixture(file: string): { receipt: ReturnType<typeof buildReceipt> } {
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as FixtureFile | PrEvidence;
  const evidence = "evidence" in raw && raw.evidence ? raw.evidence : (raw as PrEvidence);
  const now = "now" in raw && raw.now ? new Date(raw.now) : undefined;
  return { receipt: buildReceipt(evidence, { now }) };
}

async function receiptFromGitHub(values: { pr?: string; repo?: string; token?: string }): Promise<{ receipt: ReturnType<typeof buildReceipt> }> {
  if (!values.pr || !/^\d+$/.test(values.pr)) {
    throw new ProofslipError("Pass --pr NUMBER, or use --fixture path.");
  }
  const repoName = values.repo ?? detectRepo();
  if (!repoName) throw new ProofslipError("Pass --repo owner/name. proofslip could not read it from GITHUB_REPOSITORY or origin.");
  const { owner, repo } = parseRepo(repoName);
  const token = values.token || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || tokenFromGh();
  const octokit = createOctokit(token);
  console.error(`Reading ${owner}/${repo}#${values.pr} from GitHub...`);
  const evidence = await fetchPullRequestEvidence(octokit, owner, repo, Number(values.pr));
  const options: BuildOptions = { now: new Date() };
  return { receipt: buildReceipt(evidence, options) };
}

function writeWebsite(receiptsDir: string | undefined, out: string | undefined): number {
  const source = receiptsDir ?? "site/receipts";
  const outDir = out ?? "site-dist";
  const { receipts, skipped } = loadReceipts(source);
  generateWebsite(receipts, outDir);
  console.error(`Wrote the proofslip site to ${outDir}.`);
  if (skipped.length > 0) console.error(`Skipped ${skipped.length} file${skipped.length === 1 ? "" : "s"} that are not receipts: ${skipped.join(", ")}`);
  return 0;
}

function writeLog(receiptsDir: string | undefined, out: string | undefined): number {
  const source = receiptsDir ?? "receipts";
  const outDir = out ?? "proofslip-site";
  const { receipts, skipped } = loadReceipts(source);
  generateSite(receipts, outDir);
  console.error(`Wrote ${receipts.length} receipt page${receipts.length === 1 ? "" : "s"} to ${outDir}.`);
  if (skipped.length > 0) console.error(`Skipped ${skipped.length} file${skipped.length === 1 ? "" : "s"} that are not receipts: ${skipped.join(", ")}`);
  return 0;
}

function detectRepo(): string | undefined {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;
  try {
    const url = execSync("git remote get-url origin", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    const match = url.match(/github\.com[:/]([^/\s]+\/[^/\s]+?)(?:\.git)?$/);
    return match?.[1];
  } catch {
    return undefined;
  }
}

function tokenFromGh(): string | undefined {
  try {
    const token = execSync("gh auth token", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    return token || undefined;
  } catch {
    return undefined;
  }
}

function helpText(): string {
  return `proofslip ${VERSION}
Plain-English receipts for AI agent pull requests.

Usage:
  proofslip receipt --repo owner/name --pr 42 [--out dir] [--token token]
  proofslip receipt --fixture fixtures/honest.json --out dir
  proofslip log --receipts dir --out site
  proofslip site --receipts site/receipts --out site-dist

Options:
  --json                 Print the JSON receipt to stdout
  --fail-on-mismatch     Exit 2 when the verdict is doesnt_match
  --version              Print the version
  --help                 Show this help

The receipt uses the pull request, the diff, and check runs from GitHub.
It does not ask the agent whether the work is done.`;
}

function invokedDirectly(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  return /[/\\]cli\.(?:js|ts|mjs|cjs)$/.test(entry);
}

if (invokedDirectly()) {
  run(process.argv.slice(2))
    .then((code) => process.exit(code))
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
}

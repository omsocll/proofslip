import fs from "node:fs";
import path from "node:path";
import { presentReceipt, OVERALL_LABEL } from "./present.js";
import { receiptSchema } from "./schema.js";
import { baseCss, copyFonts, renderCredit, renderNav, type ChromeLinks } from "./theme.js";
import type { Receipt } from "./types.js";

export function loadReceipts(dir: string): { receipts: Receipt[]; skipped: string[] } {
  if (!fs.existsSync(dir)) return { receipts: [], skipped: [] };
  const skipped: string[] = [];
  const receipts: Receipt[] = [];
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".json") || name === "index.json") continue;
    const full = path.join(dir, name);
    if (!fs.statSync(full).isFile()) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(fs.readFileSync(full, "utf8"));
    } catch {
      skipped.push(name);
      continue;
    }
    const result = receiptSchema.safeParse(parsed);
    if (!result.success) {
      skipped.push(name);
      continue;
    }
    receipts.push(result.data);
  }
  receipts.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return { receipts, skipped };
}

export interface SiteOptions {
  homeHref?: string;
  startHref?: string;
  assetPrefix?: string;
  copyFonts?: boolean;
}

export function generateSite(receipts: Receipt[], outDir: string, options: SiteOptions = {}): void {
  fs.mkdirSync(path.join(outDir, "receipts"), { recursive: true });
  if (options.copyFonts !== false && !(options.assetPrefix ?? "").startsWith(".")) copyFonts(outDir);
  fs.writeFileSync(path.join(outDir, "index.html"), indexPage(receipts, options));
  for (const receipt of receipts) {
    const page = path.join(outDir, "receipts", `${receipt.id}.html`);
    fs.writeFileSync(page, receiptPage(receipt, options));
    fs.writeFileSync(path.join(outDir, "receipts", `${receipt.id}.json`), `${JSON.stringify(receipt, null, 2)}\n`);
  }
}

function indexPage(receipts: Receipt[], options: SiteOptions): string {
  const cards = receipts.length
    ? receipts.map((receipt) => card(receipt)).join("\n")
    : `<p class="lede">No receipts in this folder yet.</p>`;
  const links = logLinks(options);
  const body = `
    ${renderNav({ ...links, current: "log" })}
    <main class="wrap page" id="list">
      <h1>Receipt log</h1>
      <p class="lede">Plain-English receipts for pull requests. Each one is built from the diff and the check runs, not from the agent's own report. ${receipts.length} ${receipts.length === 1 ? "receipt" : "receipts"}.</p>
      <div class="filters" role="group" aria-label="Filter by verdict">
        <button type="button" data-filter="all" aria-pressed="true">All</button>
        <button type="button" data-filter="checks_out" aria-pressed="false">Checks out</button>
        <button type="button" data-filter="partly_checked" aria-pressed="false">Partly checked</button>
        <button type="button" data-filter="doesnt_match" aria-pressed="false">Doesn't match</button>
      </div>
      ${cards}
    </main>
    <script>
      const buttons = document.querySelectorAll("[data-filter]");
      const cards = document.querySelectorAll("[data-overall]");
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const filter = button.getAttribute("data-filter");
          buttons.forEach((item) => item.setAttribute("aria-pressed", item === button ? "true" : "false"));
          cards.forEach((card) => {
            const overall = card.getAttribute("data-overall");
            card.toggleAttribute("hidden", filter !== "all" && overall !== filter);
          });
        });
      });
    </script>`;
  return layout("proofslip receipt log", body, options.assetPrefix ?? "");
}

function card(receipt: Receipt): string {
  const label = OVERALL_LABEL[receipt.overall];
  return `<article class="card" data-overall="${escapeAttr(receipt.overall)}">
    <span class="pill ${receipt.overall}">${escapeHtml(label)}</span>
    <h2><a href="receipts/${escapeAttr(receipt.id)}.html">${escapeHtml(receipt.repo)} #${receipt.pr.number}</a></h2>
    <p class="meta">${escapeHtml(receipt.agent.name)} · ${escapeHtml(receipt.created_at)}</p>
    <p>${escapeHtml(receipt.summary_plain)}</p>
  </article>`;
}

function receiptPage(receipt: Receipt, options: SiteOptions): string {
  const view = presentReceipt(receipt);
  const claims = view.claims.length
    ? `<ul>${view.claims
        .map((claim) => {
          const link = claim.runUrl ? ` <a href="${escapeAttr(claim.runUrl)}">View run</a>` : "";
          return `<li>${claim.icon} <strong>${escapeHtml(claim.text)}</strong>: ${escapeHtml(claim.detail)}${link}</li>`;
        })
        .join("")}</ul>`
    : "<p>Nothing in the pull request description matched a claim proofslip knows how to check.</p>";
  const warnings = view.warnings.length
    ? `<ul>${view.warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul>`
    : "<p>None found (no tests deleted or skipped, and the CI config was not changed).</p>";
  const unverified = view.unverified.length
    ? `<h2>What we couldn't verify</h2><ul>${view.unverified.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";
  const nested = childLinks(options);
  const body = `
    ${renderNav(nested)}
    <main class="wrap page">
      <p><span class="pill ${receipt.overall}">${escapeHtml(view.overallLabel)}</span></p>
      <h1>Receipt: PR #${receipt.pr.number} in ${escapeHtml(receipt.repo)}</h1>
      <article class="sheet">
        <h2>What the agent was asked</h2>
        <p>${escapeHtml(view.task)}</p>
        <h2>What it actually changed</h2>
        <p>${escapeHtml(view.changes)}</p>
        <h2>What it claimed, and what we found</h2>
        ${claims}
        <h2>Warning signs</h2>
        ${warnings}
        ${unverified}
        <h2>Bottom line</h2>
        <p>${escapeHtml(view.bottomLine)}</p>
        <p class="meta"><a href="${escapeAttr(receipt.pr.url)}">Pull request</a> · <a href="${escapeAttr(receipt.id)}.json">Raw JSON</a></p>
        <p class="meta">Generated by proofslip v${escapeHtml(receipt.generator.version)}. This receipt only reports what GitHub records show. It is not a code review.</p>
      </article>
    </main>`;
  return layout(`Receipt for ${receipt.repo} #${receipt.pr.number}`, body, `../${options.assetPrefix ?? ""}`);
}

function logLinks(options: SiteOptions): ChromeLinks {
  return {
    home: options.homeHref ?? "./index.html",
    log: "#list",
    start: options.startHref ?? "https://github.com/omsocll/proofslip",
  };
}

function childLinks(options: SiteOptions): ChromeLinks {
  const parent = logLinks(options);
  return {
    home: deepen(parent.home),
    log: "../index.html",
    start: deepen(parent.start),
  };
}

function deepen(href: string): string {
  if (/^(https?:|#)/.test(href)) return href;
  return `../${href.replace(/^\.\//, "")}`;
}

function layout(title: string, body: string, assetPrefix = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>${baseCss(assetPrefix)}</style>
</head>
<body>
${body}
${renderCredit()}
</body>
</html>
`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
}

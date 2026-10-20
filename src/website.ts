import fs from "node:fs";
import path from "node:path";
import { presentReceipt, OVERALL_LABEL } from "./present.js";
import { generateSite } from "./site.js";
import { baseCss, BINARY_SVG, copyBrandAssets, copyFonts, renderCredit, renderIcons, renderNav } from "./theme.js";
import type { Receipt } from "./types.js";

const USAGE = "proofslip receipt --repo owner/name --pr 42";

const EXTRA = `
.stage { position: relative; overflow: hidden; }
.stage::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,${BINARY_SVG}");
  background-size: 250px 320px;
  -webkit-mask-image: radial-gradient(ellipse 88% 78% at 50% 42%, #000 8%, transparent 74%);
  mask-image: radial-gradient(ellipse 88% 78% at 50% 42%, #000 8%, transparent 74%);
  pointer-events: none;
}
.stage > * { position: relative; }
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(260px, 0.9fr);
  gap: 3.2rem;
  align-items: center;
  padding: 3.4rem 0 4.2rem;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0;
  border: 1px solid #e4e4e4;
  background: rgba(255,255,255,0.88);
  border-radius: 999px;
  padding: 0.28rem 0.72rem;
  color: #3f3f3f;
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.badge i {
  width: 0.45rem;
  height: 0.45rem;
  background: var(--accent);
  display: inline-block;
}
.hero h1 {
  max-width: 12ch;
  margin: 1rem 0 0;
  font-size: clamp(2.5rem, 4.6vw, 4.35rem);
  letter-spacing: -0.055em;
  line-height: 0.92;
}
.accent { color: var(--accent); }
.under { max-width: 36rem; margin: 1.15rem 0 0; font-size: 1.12rem; }
.note { color: var(--muted); font-size: 0.95rem; }
.links { display: flex; flex-wrap: wrap; gap: 0.35rem 1.1rem; margin-top: 0.95rem; }
.links a { font-weight: 700; text-decoration: none; }
.links a:hover { text-decoration: underline; }
.specimen {
  margin: 0;
  position: relative;
  color: #1c1914;
  background: var(--slip);
  border: 1px solid #e4d8c4;
  padding: 1.55rem 1.2rem 1.7rem;
  filter: drop-shadow(0 18px 28px rgba(48, 36, 16, 0.1));
  -webkit-mask:
    radial-gradient(circle at 10px 0, transparent 6px, #000 7px) 0 0 / 20px 100% repeat-x;
  mask:
    radial-gradient(circle at 10px 0, transparent 6px, #000 7px) 0 0 / 20px 100% repeat-x;
  clip-path: polygon(
    0 0, 100% 0, 100% calc(100% - 14px),
    96% 100%, 92% calc(100% - 12px), 88% 100%, 84% calc(100% - 11px),
    80% 100%, 76% calc(100% - 13px), 72% 100%, 68% calc(100% - 10px),
    64% 100%, 60% calc(100% - 12px), 56% 100%, 52% calc(100% - 11px),
    48% 100%, 44% calc(100% - 13px), 40% 100%, 36% calc(100% - 10px),
    32% 100%, 28% calc(100% - 12px), 24% 100%, 20% calc(100% - 11px),
    16% 100%, 12% calc(100% - 13px), 8% 100%, 4% calc(100% - 10px), 0 calc(100% - 14px)
  );
}
.specimen header { display: flex; justify-content: space-between; gap: 1rem; align-items: baseline; }
.specimen .who { margin: 0; font-weight: 800; letter-spacing: -0.04em; }
.specimen .id { margin: 0; color: var(--muted); font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 0.75rem; }
.ruled { border: 0; border-top: 1px dashed #d9cdb8; margin: 0.75rem 0; }
.heads, .lines li {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) 1.1rem minmax(0, 1.15fr);
  gap: 0.45rem;
  align-items: baseline;
}
.heads {
  margin: 0;
  color: var(--accent);
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.heads span:last-child { grid-column: 3; }
.lines { list-style: none; margin: 0; padding: 0; }
.lines li {
  padding: 0.62rem 0;
  border-top: 1px dashed #e0d4c0;
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 0.78rem;
  line-height: 1.35;
}
.no { color: var(--bad); font-weight: 700; }
.stamp {
  width: max-content;
  margin: 0.85rem auto 0.15rem;
  border: 3px solid var(--bad);
  color: var(--bad);
  border-radius: 3px;
  padding: 0.18rem 0.5rem 0.12rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.92rem;
  transform: rotate(-6deg);
}
.caption { margin: 0.85rem 0 0; color: var(--muted); font-size: 0.88rem; text-align: center; }
.sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
section { padding: 4.2rem 0 0.2rem; }
.prose { max-width: 40rem; font-size: 1.08rem; }
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.9rem; margin: 1.4rem 0 0; padding: 0; list-style: none; }
.steps li {
  background: rgba(255,255,255,0.9);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 1.35rem 1.2rem 1.45rem;
}
.step-no { margin: 0; color: var(--accent); font-weight: 800; font-size: 1.45rem; letter-spacing: -0.04em; }
.steps h3 { margin: 0.4rem 0 0.5rem; font-size: 1.28rem; }
.steps p { margin: 0; color: var(--muted); }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; margin-top: 1.2rem; }
.slip {
  background-color: var(--slip);
  background-image: radial-gradient(circle at 12px 10px, #fff 5px, transparent 5.5px);
  background-size: 22px 20px;
  background-repeat: repeat-x;
  border: 1px solid #e4d8c4;
  border-radius: 2px;
  padding: 1.55rem 1.2rem 1.3rem;
}
.kicker { margin: 0.55rem 0 0; font-size: 0.92rem; }
.slip h3 { margin: 0.3rem 0 0.7rem; font-size: 1.35rem; }
.claims { margin: 0.3rem 0; padding-left: 0; list-style: none; }
.claims li { margin: 0.55rem 0; }
.warn { color: var(--bad); }
.more { font-weight: 700; text-decoration: none; }
.more:hover { text-decoration: underline; }
.scores { width: min(40rem, 100%); border-collapse: collapse; margin: 1.1rem 0 0.4rem; font-size: 0.98rem; }
.scores th, .scores td { text-align: left; padding: 0.45rem 0.7rem 0.45rem 0; border-bottom: 1px solid var(--line); }
.scores th { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
.scores td:nth-child(n+2), .scores th:nth-child(n+2) { text-align: right; font-variant-numeric: tabular-nums; }
.install-label { margin: 1.15rem 0 0.4rem; font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
.term {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: min(720px, 100%);
  min-width: 0;
  margin: 0;
  background: #1b1916;
  color: #f6f1e7;
  border-radius: 12px;
  padding: 0.55rem 0.55rem 0.55rem 1rem;
  text-align: left;
}
.prompt { color: #b7aa96; font-family: "IBM Plex Mono", ui-monospace, monospace; }
.term code {
  flex: 1;
  min-width: 0;
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 0.92rem;
  overflow: auto;
  white-space: nowrap;
}
.copy {
  flex: none;
  width: 2.45rem;
  height: 2.45rem;
  border: 0;
  border-radius: 8px;
  background: var(--accent);
  color: white;
  padding: 0;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.copy:hover { background: var(--accent-ink); }
.copy[data-copied="true"] { background: var(--accent-ink); }
.copy .icon-check { display: none; }
.copy[data-copied="true"] .icon-copy { display: none; }
.copy[data-copied="true"] .icon-check { display: block; }
pre {
  background: #1b1916;
  color: #f6f1e7;
  border-radius: 12px;
  padding: 1.15rem 1.25rem;
  overflow: auto;
  font: 0.84rem/1.55 "IBM Plex Mono", ui-monospace, monospace;
  margin: 0;
  max-width: 100%;
}
@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; gap: 1.6rem; padding: 1.8rem 0 2.2rem; }
  .hero h1 { font-size: clamp(2.05rem, 9.2vw, 2.8rem); max-width: 12ch; }
  .steps, .pair { grid-template-columns: 1fr; }
  section { padding-top: 2.8rem; }
  .term code { font-size: 0.78rem; white-space: normal; overflow: visible; }
  .lines li, .heads { font-size: 0.72rem; }
}
`;

const INSTALL = `name: proofslip
on:
  pull_request:
    types: [opened, synchronize, reopened, labeled]
  workflow_run:
    workflows: ["CI"]
    types: [completed]
permissions:
  contents: write
  pull-requests: write
  checks: read
  actions: read
  statuses: read
jobs:
  receipt:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: omsocll/proofslip@v0.1.1
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}`;

export function generateWebsite(receipts: Receipt[], outDir: string): void {
  fs.mkdirSync(outDir, { recursive: true });
  copyFonts(outDir);
  copyBrandAssets(outDir);
  generateSite(receipts, path.join(outDir, "log"), {
    homeHref: "../index.html",
    startHref: "../index.html#install",
    assetPrefix: "../",
    copyFonts: false,
  });
  fs.writeFileSync(path.join(outDir, "index.html"), landingPage(receipts));
}

function landingPage(receipts: Receipt[]): string {
  const demos = demoPair(receipts);
  const body = `
  <div class="stage" id="top">
    ${renderNav({ home: "#top", log: "log/index.html", start: "#install", current: "home" })}
    <div class="wrap hero">
      <div>
        <p class="badge"><i aria-hidden="true"></i>Open source · v0.1</p>
        <h1>Receipts for every<br><span class="accent">agent pull request.</span></h1>
        <p class="under">An agent can write “done, tests passed” on a pull request that deleted the tests or ended the command with <code>|| true</code>. proofslip reads GitHub’s own record and writes a receipt a founder or client can read.</p>
        <p class="note">The source lives at github.com/omsocll/proofslip. That repository may be private, so the receipts below stand on their own.</p>
        <p class="links"><a href="#demo">Compare the two demos</a> · <a href="log/index.html">Browse the log</a></p>
      </div>
      ${specimen()}
    </div>
  </div>
  <main>
    <section class="wrap" aria-labelledby="problem">
      <h2 id="problem">The check is green. The sentence might not be.</h2>
      <div class="prose">
        <p>Coding agents open a pull request and report success in the description. Nothing in that sentence is checked against the diff or the CI logs. A reviewer who does not read the code has no short record of what was claimed, what actually ran, and what still needs a person.</p>
      </div>
    </section>
    <section class="wrap" aria-labelledby="how">
      <h2 id="how">How it works</h2>
      <ol class="steps">
        <li>
          <p class="step-no">1</p>
          <h3>The pull request is the claim</h3>
          <p>The description says what the agent did. A linked issue, when there is one, is the task.</p>
        </li>
        <li>
          <p class="step-no">2</p>
          <h3>GitHub is the evidence</h3>
          <p>proofslip reads the diff and the check runs already recorded for that commit. It does not ask the agent.</p>
        </li>
        <li>
          <p class="step-no">3</p>
          <h3>One sticky receipt</h3>
          <p>A comment says what checked out, what does not match, and what nobody could verify.</p>
        </li>
      </ol>
    </section>
    <section class="wrap" id="demo" aria-labelledby="demos">
      <h2 id="demos">Same kind of sentence. Two receipts.</h2>
      <p class="prose">Both pull requests say the tests passed. The receipt is the difference.</p>
      ${demos}
    </section>
    <section class="wrap" aria-labelledby="accuracy">
      <h2 id="accuracy">How accurate is it?</h2>
      <p class="prose">On 20 new public pull requests, from repos none of the earlier samples used, the overall verdict was fair on 19 of 20. The one miss said Doesn't match because tests that were moved into a new file were treated as deleted. Across these sets it has never been too rosy.</p>
      <table class="scores">
        <thead><tr><th>Fresh set, 20 new pull requests</th><th>Result</th></tr></thead>
        <tbody>
          <tr><td>Verdict fair</td><td>19/20</td></tr>
          <tr><td>Too rosy</td><td>0</td></tr>
          <tr><td>Too harsh</td><td>1</td></tr>
          <tr><td>Claims extracted</td><td>48</td></tr>
          <tr><td>Pull requests with no claims</td><td>6</td></tr>
          <tr><td>False reassurances</td><td>1</td></tr>
          <tr><td>False alarms</td><td>1</td></tr>
        </tbody>
      </table>
      <p class="prose">Earlier sets are context, and they were re-scored on this same build. The third set was fair on 20 of 20 (it had been 15 of 20). The held-out 20 was fair on 19 of the 19 pull requests still online. The first 20, which the early fixes were adjusted on, was fair on 20 of 20.</p>
      <table class="scores">
        <thead><tr><th>Tuned set</th><th>Before</th><th>After</th></tr></thead>
        <tbody>
          <tr><td>Verdict fair</td><td>10/20</td><td>20/20</td></tr>
          <tr><td>Too rosy</td><td>3</td><td>0</td></tr>
          <tr><td>Too harsh</td><td>7</td><td>0</td></tr>
          <tr><td>Claims extracted</td><td>15</td><td>57</td></tr>
          <tr><td>Pull requests with no claims</td><td>9</td><td>4</td></tr>
          <tr><td>False reassurances</td><td>2</td><td>2</td></tr>
          <tr><td>False alarms</td><td>3</td><td>0</td></tr>
        </tbody>
      </table>
      <p class="prose">The full read, including both sets, is <a href="https://github.com/omsocll/proofslip/blob/main/docs/evaluation.md">docs/evaluation.md</a>.</p>
    </section>
    <section class="wrap" aria-labelledby="install">
      <h2 id="install">Add it to a repository</h2>
      <p class="prose">A GitHub Action posts the receipt on pull requests. Pin <code>omsocll/proofslip@v0.1.1</code>, or <code>@v0</code> for the latest 0.x release.</p>
      <p class="install-label">From the command line</p>
      <div class="term">
        <span class="prompt">$</span>
        <code id="usage">${escapeHtml(USAGE)}</code>
        <button type="button" class="copy" aria-label="Copy the proofslip command" data-copy="${escapeAttr(USAGE)}">
          <svg class="icon-copy" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M5 2.5A1.5 1.5 0 0 1 6.5 1h5A1.5 1.5 0 0 1 13 2.5v7A1.5 1.5 0 0 1 11.5 11h-5A1.5 1.5 0 0 1 5 9.5v-7ZM6.5 2a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-5Z"/><path fill="currentColor" d="M3.5 5A1.5 1.5 0 0 0 2 6.5v7A1.5 1.5 0 0 0 3.5 15h5A1.5 1.5 0 0 0 10 13.5V13H9v.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5H5V5H3.5Z"/></svg>
          <svg class="icon-check" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M13.03 4.47a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06L6.5 9.94l5.47-5.47a.75.75 0 0 1 1.06 0Z"/></svg>
        </button>
      </div>
      <p class="install-label">Or as a GitHub Action</p>
      <pre><code>${escapeHtml(INSTALL)}</code></pre>
      <p class="note">If the repository is private, this snippet works only after you can read it. The log on this site does not need GitHub access.</p>
    </section>
  </main>
  ${renderCredit()}
  <script>
    const copy = document.querySelector(".copy");
    if (copy) {
      copy.addEventListener("click", async () => {
        const text = copy.getAttribute("data-copy") || "";
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const area = document.createElement("textarea");
          area.value = text;
          area.setAttribute("readonly", "");
          area.style.position = "fixed";
          area.style.left = "-9999px";
          document.body.appendChild(area);
          area.select();
          document.execCommand("copy");
          area.remove();
        }
        copy.setAttribute("data-copied", "true");
        window.setTimeout(() => copy.removeAttribute("data-copied"), 1200);
      });
    }
  </script>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>proofslip — Plain-English receipts for AI agent pull requests</title>
${renderIcons()}
  <meta name="description" content="proofslip writes a plain-English receipt for an AI agent's pull request from GitHub's diff and check runs.">
  <style>${baseCss("")}${EXTRA}</style>
</head>
<body>
${body}
</body>
</html>
`;
}

function specimen(): string {
  return `<figure class="specimen">
    <header>
      <p class="who">proofslip</p>
      <p class="id">Example · PR #4</p>
    </header>
    <hr class="ruled">
    <p class="heads"><span>Claimed</span><span>Found</span></p>
    <ul class="lines">
      <li>
        <span>All tests pass</span>
        <span class="no">✕<span class="sr"> does not match.</span></span>
        <span>The test command ends with <code>|| true</code></span>
      </li>
      <li>
        <span>Added tests</span>
        <span class="no">✕<span class="sr"> does not match.</span></span>
        <span>Deleted <code>tests/readme.test.ts</code></span>
      </li>
    </ul>
    <p class="stamp">Doesn't match</p>
    <figcaption class="caption">What the pull request claimed, beside what GitHub recorded.</figcaption>
  </figure>`;
}

function demoPair(receipts: Receipt[]): string {
  if (receipts.length === 0) {
    return `<p class="prose">No receipts have been committed for this build.</p>`;
  }
  const ordered = [...receipts].sort((a, b) => a.pr.number - b.pr.number);
  return `<div class="pair">${ordered.map((receipt) => slip(receipt)).join("\n")}</div>`;
}

function slip(receipt: Receipt): string {
  const view = presentReceipt(receipt);
  const caption = receipt.overall === "checks_out"
    ? "Honest pull request"
    : receipt.overall === "doesnt_match"
      ? "Dishonest pull request"
      : "Needs a closer look";
  const claims = view.claims.map((claim) => `<li>${claim.icon} <strong>${escapeHtml(claim.text)}</strong> — ${escapeHtml(claim.detail)}</li>`).join("");
  const warnings = view.warnings.length
    ? `<p class="warn">${view.warnings.map((warning) => escapeHtml(warning)).join(" ")}</p>`
    : "";
  return `<article class="slip">
    <header>
      <span class="pill ${receipt.overall}">${escapeHtml(OVERALL_LABEL[receipt.overall])}</span>
      <p class="kicker">${escapeHtml(caption)} · ${escapeHtml(receipt.repo)} #${receipt.pr.number}</p>
      <h3>${escapeHtml(view.task)}</h3>
    </header>
    <ul class="claims">${claims}</ul>
    ${warnings}
    <p class="bottom">${escapeHtml(view.bottomLine)}</p>
    <a class="more" href="log/receipts/${escapeAttr(receipt.id)}.html">Full receipt</a>
  </article>`;
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

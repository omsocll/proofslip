import fs from "node:fs";
import path from "node:path";

export interface ChromeLinks {
  home: string;
  log: string;
  start: string;
  current?: "home" | "log";
}

export function renderCredit(): string {
  return `<footer class="wrap site">Built by <a href="https://github.com/omsocll">omsocll</a> · <a href="https://x.com/kickscosmo">@kickscosmo</a>.</footer>`;
}

export function fontFaceCss(prefix: string): string {
  const face = (family: string, file: string, weight: number) => `@font-face {
  font-family: ${family};
  src: url("${prefix}fonts/${file}") format("woff2");
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
}`;
  return [
    face("Outfit", "outfit-400.woff2", 400),
    face("Outfit", "outfit-500.woff2", 500),
    face("Outfit", "outfit-700.woff2", 700),
    face("Outfit", "outfit-800.woff2", 800),
    face("IBM Plex Mono", "plex-mono-400.woff2", 400),
  ].join("\n");
}

export function copyFonts(outDir: string): void {
  const source = fontsSource();
  const dest = path.join(outDir, "fonts");
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(source)) {
    if (!name.endsWith(".woff2") && name !== "LICENSE.txt") continue;
    fs.copyFileSync(path.join(source, name), path.join(dest, name));
  }
}

function fontsSource(): string {
  const here = typeof __dirname === "string" ? __dirname : process.cwd();
  const candidates = [
    path.resolve("site/fonts"),
    path.resolve(here, "../site/fonts"),
    path.resolve(here, "../../site/fonts"),
  ];
  const found = candidates.find((dir) => fs.existsSync(path.join(dir, "outfit-800.woff2")));
  if (!found) throw new Error("proofslip could not find site/fonts. Run the site build from the repository root.");
  return found;
}

const MARK_PATH = "M7 4h18v12l-4.5 9-4.5-9-4.5 9L7 16V4z";
const MARK_CHECK = "M11.6 11.4 14.4 14.3 21.2 7.4";

export function renderMark(): string {
  return `<svg class="mark" viewBox="6 3 20 23" width="19" height="22" aria-hidden="true" focusable="false"><path fill="currentColor" d="${MARK_PATH}"/><path d="${MARK_CHECK}" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

export function renderIcons(): string {
  return `  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">`;
}

export function copyBrandAssets(outDir: string): void {
  const source = brandSource();
  fs.mkdirSync(outDir, { recursive: true });
  for (const name of ["favicon.svg", "favicon.png", "apple-touch-icon.png"]) {
    fs.copyFileSync(path.join(source, name), path.join(outDir, name));
  }
}

function brandSource(): string {
  const here = typeof __dirname === "string" ? __dirname : process.cwd();
  const candidates = [
    path.resolve("site"),
    path.resolve(here, "../site"),
    path.resolve(here, "../../site"),
  ];
  const found = candidates.find((dir) => fs.existsSync(path.join(dir, "favicon.svg")));
  if (!found) throw new Error("proofslip could not find site/favicon.svg. Run the site build from the repository root.");
  return found;
}

export function renderNav(links: ChromeLinks): string {
  const item = (href: string, label: string, current: boolean) =>
    `<a href="${escapeAttr(href)}"${current ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<header class="nav wrap">
    <a class="brand" href="${escapeAttr(links.home)}">${renderMark()}proofslip</a>
    <nav class="nav-links" aria-label="Site">
      ${item(links.home, "Home", links.current === "home")}
      ${item(links.log, "Log", links.current === "log")}
      <a href="https://github.com/omsocll/proofslip">GitHub</a>
    </nav>
    <a class="cta" href="${escapeAttr(links.start)}">Get started <span aria-hidden="true">→</span></a>
  </header>`;
}

export function baseCss(prefix: string): string {
  return `${fontFaceCss(prefix)}
:root {
  color-scheme: light;
  --ink: #161616;
  --muted: #5c584f;
  --line: #e6e1d6;
  --accent: #0f5132;
  --accent-ink: #0a3a24;
  --paper: #ffffff;
  --slip: #fbf7ef;
  --ok: #2f7d1b;
  --ok-bg: #eef6e4;
  --part: #8a4b08;
  --part-bg: #f8ecd9;
  --bad: #9f1d1d;
  --bad-bg: #fdeceb;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background-color: var(--paper);
  background-image: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 31px,
    rgba(15, 81, 50, 0.055) 31px,
    rgba(15, 81, 50, 0.055) 32px
  );
  color: var(--ink);
  font: 17px/1.55 Outfit, "Segoe UI", system-ui, sans-serif;
}
a { color: var(--accent); }
img, svg { max-width: 100%; }
.wrap { width: min(1120px, calc(100% - 2.4rem)); margin: 0 auto; }
.nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 1.05rem 0 0.4rem;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  justify-self: start;
  color: var(--ink);
  text-decoration: none;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: -0.04em;
  line-height: 1;
}
.mark { width: 19px; height: 22px; max-width: none; flex: none; display: block; color: var(--accent); }
.nav-links { display: flex; gap: 1.6rem; align-items: center; }
.nav-links a { color: var(--ink); text-decoration: none; font-weight: 500; }
.nav-links a[aria-current="page"] { color: var(--accent); }
.cta {
  justify-self: end;
  color: var(--accent);
  text-decoration: none;
  border: 1.5px solid var(--accent);
  border-radius: 999px;
  padding: 0.42rem 0.95rem;
  font-weight: 600;
  font-size: 0.95rem;
}
.cta:hover { background: var(--accent); color: white; }
h1, h2, h3 { font-weight: 800; letter-spacing: -0.05em; line-height: 0.96; }
h1 { font-size: clamp(2.4rem, 5vw, 3.5rem); margin: 0.2rem 0 0.7rem; }
h2 { font-size: clamp(1.8rem, 3vw, 2.45rem); margin: 0 0 0.7rem; }
.lede, .kicker { color: var(--muted); }
.meta { color: var(--muted); font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 0.82rem; }
a:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.mono { font-family: "IBM Plex Mono", ui-monospace, monospace; }
.filters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1.1rem 0 1.3rem; }
button {
  font: inherit;
  background: white;
  border: 1.5px solid var(--ink);
  border-radius: 999px;
  padding: 0.32rem 0.85rem;
  cursor: pointer;
}
button[aria-pressed="true"] { background: var(--ink); color: white; }
.card, .sheet {
  background: white;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 1.15rem 1.2rem 1.25rem;
  margin: 0 0 0.9rem;
}
.card { border-left: 4px solid var(--line); }
.card[data-overall="checks_out"] { border-left-color: var(--ok); }
.card[data-overall="partly_checked"] { border-left-color: var(--part); }
.card[data-overall="doesnt_match"] { border-left-color: var(--bad); }
.sheet {
  background-color: var(--slip);
  background-image: radial-gradient(circle at 12px 10px, #fff 5px, transparent 5.5px);
  background-size: 22px 20px;
  background-repeat: repeat-x;
  border-color: #e4d8c4;
  border-radius: 2px;
  padding-top: 1.7rem;
}
.card h2, .sheet h2 { font-size: 1.35rem; letter-spacing: -0.04em; margin: 0.45rem 0; }
.card h2 a { color: var(--ink); text-decoration: none; }
.card h2 a:hover { color: var(--accent); }
.pill {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 999px;
  padding: 0.16rem 0.55rem;
}
.pill.checks_out { color: var(--ok); background: var(--ok-bg); }
.pill.partly_checked { color: var(--part); background: var(--part-bg); }
.pill.doesnt_match { color: var(--bad); background: var(--bad-bg); }
ul { padding-left: 1.15rem; }
li { margin: 0.4rem 0; }
.page { padding: 2.4rem 0 4rem; }
footer.site {
  color: var(--muted);
  padding: 2.5rem 0 2.8rem;
}
@media (max-width: 760px) {
  .wrap { width: min(1120px, calc(100% - 1.4rem)); }
  .nav { grid-template-columns: 1fr auto; }
  .brand { grid-column: 1; grid-row: 1; }
  .cta { grid-column: 2; grid-row: 1; }
  .nav-links { grid-column: 1 / -1; grid-row: 2; justify-content: center; gap: 1rem; padding-bottom: 0.2rem; }
  h1 { font-size: clamp(2.3rem, 11vw, 3.2rem); }
}
`;
}

export const BINARY_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="320" viewBox="0 0 250 320"><g fill="#c3d4cb" font-family="ui-monospace,monospace" font-size="11">${binaryRows()}</g></svg>`,
);

function binaryRows(): string {
  let state = 0x0f5132;
  const rows: string[] = [];
  for (let i = 0; i < 24; i++) {
    let bits = "";
    for (let j = 0; j < 34; j++) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      bits += (state >>> 31) & 1 ? "1" : "0";
    }
    rows.push(bits);
  }
  return rows.map((row, index) => `<text x="0" y="${12 + index * 13}">${row}</text>`).join("");
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

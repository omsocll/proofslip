"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DEFAULT_AGENT_LABELS: () => DEFAULT_AGENT_LABELS,
  DEFAULT_AGENT_LOGINS: () => DEFAULT_AGENT_LOGINS,
  OVERALL_LABEL: () => OVERALL_LABEL,
  ProofslipError: () => ProofslipError,
  RECEIPT_MARKER: () => RECEIPT_MARKER,
  RECEIPT_SCHEMA_ID: () => RECEIPT_SCHEMA_ID,
  VERDICT_ICON: () => VERDICT_ICON,
  VERSION: () => VERSION,
  assembleCheckRuns: () => assembleCheckRuns,
  bottomLine: () => bottomLine,
  buildReceipt: () => buildReceipt,
  checksForHead: () => checksForHead,
  ciStatus: () => ciStatus,
  claimSourceText: () => claimSourceText,
  classifyCheck: () => classifyCheck,
  createOctokit: () => createOctokit,
  describeChanges: () => describeChanges,
  detectAgent: () => detectAgent,
  detectRedFlags: () => detectRedFlags,
  eventCommitSha: () => eventCommitSha,
  eventHeadBranch: () => eventHeadBranch,
  extractClaims: () => extractClaims,
  extractTask: () => extractTask,
  fetchPullRequestEvidence: () => fetchPullRequestEvidence,
  findOpenPullRequest: () => findOpenPullRequest,
  findReceiptComment: () => findReceiptComment,
  generateSite: () => generateSite,
  generateWebsite: () => generateWebsite,
  judgeCheckGroup: () => judgeCheckGroup,
  judgeClaims: () => judgeClaims,
  loadReceipts: () => loadReceipts,
  normalizeEvidence: () => normalizeEvidence,
  overallVerdict: () => overallVerdict,
  parseRepo: () => parseRepo,
  postReceiptComment: () => postReceiptComment,
  presentReceipt: () => presentReceipt,
  publishReceipt: () => publishReceipt,
  receiptId: () => receiptId,
  receiptSchema: () => receiptSchema,
  renderMarkdown: () => renderMarkdown,
  resolvePullRequestNumber: () => resolvePullRequestNumber,
  splitList: () => splitList,
  splitSentences: () => splitSentences,
  summaryPlain: () => summaryPlain,
  timestamp: () => timestamp,
  toIndexEntry: () => toIndexEntry,
  upsertIndex: () => upsertIndex
});
module.exports = __toCommonJS(index_exports);

// src/agents.ts
var KNOWN_AGENTS = [
  { login: "copilot-swe-agent[bot]", name: "GitHub Copilot" },
  { login: "copilot-swe-agent", name: "GitHub Copilot" },
  { login: "copilot[bot]", name: "GitHub Copilot" },
  { login: "Copilot", name: "GitHub Copilot" },
  { login: "devin-ai-integration[bot]", name: "Devin" },
  { login: "devin-ai-integration", name: "Devin" },
  { login: "chatgpt-codex-connector[bot]", name: "OpenAI Codex" },
  { login: "chatgpt-codex-connector", name: "OpenAI Codex" },
  { login: "openai-codex[bot]", name: "OpenAI Codex" },
  { login: "codex[bot]", name: "OpenAI Codex" },
  { login: "cursor[bot]", name: "Cursor" },
  { login: "cursor-agent[bot]", name: "Cursor" },
  { login: "claude[bot]", name: "Claude" },
  { login: "sweep-ai[bot]", name: "Sweep" },
  { login: "sweep[bot]", name: "Sweep" },
  { login: "codegen-sh[bot]", name: "Codegen" },
  { login: "google-labs-jules[bot]", name: "Jules" },
  { login: "google-labs-jules", name: "Jules" },
  { login: "jules[bot]", name: "Jules" },
  { login: "gemini-code-assist[bot]", name: "Gemini" },
  { login: "amazon-q-developer[bot]", name: "Amazon Q" },
  { login: "openhands[bot]", name: "OpenHands" },
  { login: "devin-ai[bot]", name: "Devin" },
  { login: "sourcery-ai[bot]", name: "Sourcery" },
  { login: "ellipsis-dev[bot]", name: "Ellipsis" }
];
var TRAILER_AGENTS = [
  { pattern: /copilot/i, name: "GitHub Copilot" },
  { pattern: /devin/i, name: "Devin" },
  { pattern: /codex/i, name: "OpenAI Codex" },
  { pattern: /cursor/i, name: "Cursor" },
  { pattern: /claude/i, name: "Claude" },
  { pattern: /jules/i, name: "Jules" },
  { pattern: /gemini/i, name: "Gemini" },
  { pattern: /openhands/i, name: "OpenHands" },
  { pattern: /sourcery/i, name: "Sourcery" }
];
var DEFAULT_AGENT_LOGINS = KNOWN_AGENTS.map((agent) => agent.login);
var DEFAULT_AGENT_LABELS = ["agent"];
function knownAgentName(login) {
  return KNOWN_AGENTS.find((agent) => agent.login.toLowerCase() === login.toLowerCase())?.name;
}
function detectAgent(evidence, options = {}) {
  const extra = (options.extraLogins ?? []).map((login) => login.trim()).filter(Boolean);
  const labels = (options.labels ?? DEFAULT_AGENT_LABELS).map((label) => label.trim().toLowerCase()).filter(Boolean);
  const author = evidence.author || "unknown";
  const known = knownAgentName(author);
  const extraHit = extra.some((login) => login.toLowerCase() === author.toLowerCase());
  if (known || extraHit) {
    return { isAgent: true, name: known ?? author, detectedBy: "author" };
  }
  const prLabels = (evidence.labels ?? []).map((label) => label.toLowerCase());
  if (labels.some((label) => prLabels.includes(label))) {
    return { isAgent: true, name: author, detectedBy: "label" };
  }
  const fromTrailer = detectTrailer(evidence.commits ?? []);
  if (fromTrailer) {
    return { isAgent: true, name: fromTrailer, detectedBy: "commit_trailer" };
  }
  const fromBody = detectBodyMarker(markerText(evidence));
  if (fromBody) {
    return { isAgent: true, name: fromBody, detectedBy: "body_marker" };
  }
  return { isAgent: false, name: author, detectedBy: "unspecified" };
}
function markerText(evidence) {
  return [
    evidence.body ?? "",
    ...(evidence.comments ?? []).map((comment) => comment.body),
    ...(evidence.commits ?? []).map((commit) => commit.message)
  ].join("\n");
}
function detectBodyMarker(text) {
  if (/generated[- ]by(?::|\s)\s*(?:openai\s+)?codex|generated with (?:openai )?codex|assisted-by:\s*(?:openai\s+)?codex|chatgpt-codex-connector/i.test(text)) return "OpenAI Codex";
  if (/generated with \[claude code\]|claude\.com\/claude-code/i.test(text)) return "Claude";
  if (/generated by cursor|cursor\.com\/agents/i.test(text)) return "Cursor";
  if (/generated by devin|devin\.ai\/sessions/i.test(text)) return "Devin";
  if (/generated by jules|pr created automatically by jules|jules\.google\.com\/task/i.test(text)) return "Jules";
  if (/generated by (?:github )?copilot/i.test(text)) return "GitHub Copilot";
  return null;
}
function detectTrailer(commits) {
  for (const commit of commits) {
    const message = commit.message ?? "";
    if (/^(?:generated|assisted)-by:\s*(?:openai\s+)?codex\b/im.test(message)) return "OpenAI Codex";
    const coauthor = coAuthorName(message);
    const named = coauthor ? nameFromTrailer(coauthor) : null;
    if (/^agent-logs-url:/im.test(message)) {
      return named ?? "GitHub Copilot";
    }
    if (named) return named;
  }
  return null;
}
function coAuthorName(message) {
  const match = message.match(/^co-authored-by:\s*(.+?)\s*</im);
  return match?.[1]?.trim() ?? null;
}
function nameFromTrailer(name) {
  for (const agent of TRAILER_AGENTS) {
    if (agent.pattern.test(name)) return agent.name;
  }
  return null;
}
function agentAuthorLogins(evidence, options = {}) {
  const logins = /* @__PURE__ */ new Set([
    evidence.author.toLowerCase(),
    ...DEFAULT_AGENT_LOGINS.map((login) => login.toLowerCase()),
    ...(options.extraLogins ?? []).map((login) => login.toLowerCase())
  ]);
  return logins;
}

// src/diff.ts
var CODE_EXT = /\.(tsx?|jsx?|mjs|cjs|py|go|rb|rs|java|kt|php|cs|swift|scala|sh)$/i;
function isTestFile(filename) {
  const path4 = filename.replace(/\\/g, "/");
  const lower = path4.toLowerCase();
  return /(^|\/)(__tests__|tests?|specs?)(\/|$)/.test(lower) || /\.(test|spec)\.[cm]?[jt]sx?$/.test(lower) || /(?:^|\/)test_.+\.py$/.test(lower) || /(?:^|\/).+_test\.py$/.test(lower) || /_test\.go$/.test(lower) || /_spec\.rb$/.test(lower) || /(?:^|\/)[^/]*tests?\.php$/.test(lower) || /(?:^|\/)[^/]*tests?\.cs$/.test(lower) || /(?:^|\/)[^/]*test\.java$/.test(lower);
}
function isCiConfig(filename) {
  const path4 = filename.replace(/\\/g, "/").toLowerCase();
  const base = path4.split("/").pop() ?? path4;
  return path4.startsWith(".github/workflows/") || path4.startsWith(".github/actions/") || path4.startsWith(".circleci/") || path4.startsWith(".buildkite/") || base === "jenkinsfile" || base === ".gitlab-ci.yml" || base === "azure-pipelines.yml" || base === ".travis.yml" || base === "appveyor.yml" || base === "bitbucket-pipelines.yml" || base === "taskfile.yml";
}
function isCommandFile(filename) {
  const path4 = filename.replace(/\\/g, "/").toLowerCase();
  const base = path4.split("/").pop() ?? path4;
  return isCiConfig(filename) || base === "package.json" || base === "makefile" || base === "justfile" || base.endsWith(".sh") || path4.startsWith("scripts/");
}
function isCodeFile(filename) {
  return CODE_EXT.test(filename);
}
function addedLines(patch) {
  if (!patch) return [];
  return patch.split("\n").filter((line) => line.startsWith("+") && !line.startsWith("+++")).map((line) => line.slice(1));
}
function removedLines(patch) {
  if (!patch) return [];
  return patch.split("\n").filter((line) => line.startsWith("-") && !line.startsWith("---")).map((line) => line.slice(1));
}
function isCommentLine(line) {
  const trimmed = line.trim();
  return trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("*") || trimmed.startsWith("/*") || trimmed.startsWith("--");
}
function patchMissing(file) {
  if (file.status === "unchanged") return false;
  return file.patch === void 0 || file.patch === "";
}
function patchText(patch) {
  if (!patch) return "";
  return patch.split("\n").filter((line) => !line.startsWith("@@") && !line.startsWith("diff ") && !line.startsWith("index ")).map((line) => line.startsWith("+") || line.startsWith("-") || line.startsWith(" ") ? line.slice(1) : line).join("\n");
}

// src/text.ts
function countLabel(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
function formatList(items) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
function backtick(value) {
  return `\`${value.replace(/`/g, "")}\``;
}
function oneLine(value) {
  return value.replace(/\s+/g, " ").trim();
}
function lowerFirst(value) {
  const trimmed = value.trim().replace(/\.+$/, "");
  if (/^[A-Z][a-z]/.test(trimmed)) return trimmed[0].toLowerCase() + trimmed.slice(1);
  return trimmed;
}
function defined(value) {
  const entries = Object.entries(value).filter(([, entry]) => entry !== void 0);
  return Object.fromEntries(entries);
}

// src/claims.ts
var STOP = /* @__PURE__ */ new Set([
  "this",
  "that",
  "with",
  "from",
  "into",
  "only",
  "just",
  "also",
  "when",
  "have",
  "been",
  "were",
  "was",
  "does",
  "did",
  "not",
  "for",
  "the",
  "and",
  "all",
  "green",
  "clean",
  "lint",
  "build",
  "issue",
  "fixed",
  "fixes",
  "pass",
  "passed",
  "passing",
  "suite",
  "unit",
  "integration",
  "file",
  "files",
  "code",
  "test",
  "tests",
  "spec",
  "specs",
  "page",
  "pages",
  "toggle",
  "button",
  "mode",
  "dark",
  "light",
  "feature",
  "support",
  "added",
  "add",
  "update",
  "updated",
  "change",
  "changed",
  "pull",
  "request",
  "branch",
  "commit",
  "line",
  "lines",
  "behavior",
  "behaviour",
  "work",
  "works",
  "working",
  "should",
  "mobile",
  "breaking",
  "changes",
  "function",
  "method",
  "class",
  "component",
  "module",
  "index",
  "main",
  "true",
  "false",
  "null",
  "undefined",
  "return",
  "using",
  "used",
  "make",
  "made",
  "new",
  "some",
  "more",
  "most",
  "other",
  "same"
]);
var CHANGE_VERB = /\b(add(?:ed|s|ing)?|updat(?:ed|es|ing)?|chang(?:ed|es|ing)?|modif(?:y|ied|ies)|implement(?:ed|s|ing)?|introduc(?:ed|es|ing)?|creat(?:ed|es|ing)?|remov(?:ed|es|ing)?|delet(?:ed|es|ing)?|renam(?:ed|es|ing)?|edit(?:ed|s|ing)?|rewr(?:ote|itten)|refactor(?:ed|s|ing)?|load(?:ed|s|ing)?|register(?:ed|s|ing)?|rebuil(?:d|t)(?:s|ing)?|touch(?:ed|es|ing)?)\b/i;
var TESTS_HEDGE = /\b(could(?: not|n't) run (?:the )?(?:tests?|test suite)|did(?: not|n't) run (?:the )?(?:tests?|test suite)|unable to run (?:the )?tests?|tests? (?:were|was) not run|tests? should (?:pass|work)|not sure (?:if|whether) (?:the )?tests?)\b/i;
var TESTS_PASS = /\b(all tests (?:are )?(?:pass(?:ed|ing)?|green)|tests? (?:all )?(?:pass(?:ed|ing)?|are passing|are green)|tests? passing|test suite (?:pass(?:ed|ing)?|is green)|unit tests (?:pass(?:ed|ing)?))\b|\b\d+\s+(?:tests?\s+)?(?:passed|passing)\b|(?:todos?\s+os\s+)?testes\s+(?:passaram|estão\s+passando|estao\s+passando)|alle\s+tests?\s+(?:bestanden|grün|sind\s+grün)|tous\s+les\s+tests?\s+(?:passent|sont\s+passés)|すべて合格|全(?:ての)?テストが(?:成功|合格)|テスト(?:が|は)合格/iu;
var LINT_PASS = /\b(lint(?:ing)? (?:is )?clean|no lint(?:ing)? errors|eslint (?:pass(?:ed|es)|is clean)|lint(?:ing)? pass(?:ed|es))\b/i;
var TYPECHECK_PASS = /\b(type[- ]?check(?:ing)? pass(?:ed|es)|type[- ]?check(?:ing)? (?:is )?clean|no type errors|tsc pass(?:ed|es))\b/i;
var BUILD_PASS = /\b((?:the )?build pass(?:ed|es)|build (?:is )?clean|builds successfully|compiled successfully)\b/i;
var CHECKS_PASS = /\b(all checks (?:pass(?:ed|ing)?|are green)|ci is green|checks are green|(?:the )?pipeline pass(?:ed|es))\b/i;
var ADDED_TESTS = /\b(?:add(?:ed|s|ing)?|writ(?:e|es|ten|ing)|creat(?:ed|es|ing)|includ(?:ed|es|ing)|cover(?:s|ed|ing)?|adicion(?:a|ei|ou)|cri(?:ou|ei|a)|escrev(?:eu|i))\b[^.!?\n]{0,80}\b(?:tests?|specs?|testes)\b|\b(?:new|added|extra) tests?\b|\bwith tests\b/iu;
var FIXED_ISSUE = /\b(?:fix(?:e[sd])?|resolv(?:e[sd])?|clos(?:e[sd])?|behebt|schließt|schliesst|löst|loest|corrige|fecha|cierra|arregla|ferme|résout|resout)\s+(?:issue\s+)?#(\d+)\b/iu;
var RAN_TEST = /\b(?:ran|run)\b[^.\n]{0,160}\b(?:pnpm|npm|yarn|bun|pytest|vitest|jest|go)\s+test\b/i;
var RAN_LINT = /\b(?:ran|run)\b[^.\n]{0,160}\blint\b/i;
var RAN_BUILD = /\b(?:ran|run)\b[^.\n]{0,160}\bbuild\b/i;
var USER_FACING = /\b(?:lets?|allows?|enables?)\s+(?:users?|people|you)\b/i;
var HEDGE_WORD = /\b(i think|probably|hopefully|maybe|might|perhaps)\b/i;
var SHOULD_WORK = /\bshould work\b/i;
var OTHER_PATTERNS = [
  /\bno breaking changes\b/i,
  /\bbackward[ -]compatible\b/i,
  /\bworks on mobile\b/i,
  /\b(?:faster|more performant|performance improvement|speeds? up)\b/i,
  /\b(?:secure|no vulnerabilities|without vulnerabilities)\b/i,
  /\baccessib(?:le|ility)\b/i,
  /\bproduction[- ]ready\b/i,
  /\bno behavior(?:al)? changes?\b/i
];
var MAX_CLAIMS = 25;
function splitSentences(text) {
  const sentences = [];
  let inFence = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !line || line.startsWith("<!--")) continue;
    if (/^- \[[ ]\]/.test(line)) continue;
    const cleaned = line.replace(/^#{1,6}\s+/, "").replace(/^- \[[xX]\]\s+/, "").replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, "").trim();
    if (!cleaned) continue;
    for (const part of cleaned.split(/(?<=[.!?])\s+(?=[A-Z0-9"'`(])/)) {
      const sentence = part.trim();
      if (sentence) sentences.push(sentence);
    }
  }
  return sentences;
}
function extractClaims(text, _files = []) {
  const claims = [];
  const seen = /* @__PURE__ */ new Set();
  let covered = false;
  const push = (claim) => {
    const key = [
      claim.type,
      claim.hedged ? "hedged" : "plain",
      claim.issue ?? "",
      [...claim.paths ?? []].sort().join(","),
      [...claim.mentions ?? []].sort().join(","),
      claim.type === "other" ? normalize(claim.text) : ""
    ].join("|");
    covered = true;
    if (seen.has(key)) return;
    seen.add(key);
    claims.push(claim);
  };
  for (const sentence of splitSentences(text).flatMap(expandClauses)) {
    if (sentence.length > 400 || isBoilerplate(sentence) || isExternalInstruction(sentence)) continue;
    const textValue = stripTrailingPunctuation(oneLine(sentence));
    const hedgedTests = TESTS_HEDGE.test(sentence);
    const hedgedTone = HEDGE_WORD.test(sentence);
    covered = false;
    if (hedgedTests) {
      push({ text: textValue, type: "tests_pass", hedged: true });
    } else if (TESTS_PASS.test(sentence) || RAN_TEST.test(sentence)) {
      push({ text: textValue, type: "tests_pass", hedged: hedgedTone });
    }
    if (LINT_PASS.test(sentence) || RAN_LINT.test(sentence)) push({ text: textValue, type: "lint_pass", hedged: hedgedTone });
    if (TYPECHECK_PASS.test(sentence)) push({ text: textValue, type: "typecheck_pass", hedged: hedgedTone });
    if (BUILD_PASS.test(sentence) || RAN_BUILD.test(sentence)) push({ text: textValue, type: "build_pass", hedged: hedgedTone });
    if (CHECKS_PASS.test(sentence) && !TESTS_PASS.test(sentence) && !RAN_TEST.test(sentence)) {
      push({ text: textValue, type: "checks_pass", hedged: hedgedTone });
    }
    if (ADDED_TESTS.test(sentence)) {
      const tokens = findTokens(sentence);
      push({
        text: textValue,
        type: "added_tests",
        hedged: false,
        paths: tokens.paths.filter((file) => isTestFile(file) || /\.(test|spec)\./i.test(file)),
        mentions: tokens.mentions
      });
    }
    const issue = sentence.match(FIXED_ISSUE);
    if (issue?.[1]) {
      push({ text: textValue, type: "fixed_issue", hedged: false, issue: Number(issue[1]) });
    }
    const passSentence = TESTS_PASS.test(sentence) || RAN_TEST.test(sentence) || LINT_PASS.test(sentence) || RAN_LINT.test(sentence) || TYPECHECK_PASS.test(sentence) || BUILD_PASS.test(sentence) || RAN_BUILD.test(sentence) || CHECKS_PASS.test(sentence);
    if (!passSentence && CHANGE_VERB.test(sentence) && !isPassingNote(sentence)) {
      const tokens = findTokens(sentence);
      const overclaim = broadBehavior(sentence);
      const prose = tokens.paths.length === 0 && tokens.mentions.length === 0 ? proseIdentifiers(sentence) : [];
      if (tokens.paths.length > 0 || tokens.mentions.length > 0 || prose.length > 0 || tokens.supporting.length > 0) {
        push({
          text: textValue,
          type: "file_changed",
          hedged: false,
          paths: tokens.paths,
          mentions: [...tokens.mentions, ...prose],
          supportingMentions: tokens.supporting,
          overclaim
        });
      }
    }
    if (SHOULD_WORK.test(sentence) && !TESTS_PASS.test(sentence) && !hedgedTests) {
      push({ text: textValue, type: "other", hedged: true });
    }
    for (const pattern of OTHER_PATTERNS) {
      if (pattern.test(sentence)) {
        push({ text: textValue, type: "other", hedged: false });
        break;
      }
    }
    if (!covered && !isPassingNote(sentence) && (CHANGE_VERB.test(sentence) || USER_FACING.test(sentence))) {
      push({ text: textValue, type: "other", hedged: false });
    }
  }
  const addedText = new Set(claims.filter((claim) => claim.type === "added_tests").map((claim) => claim.text));
  const filtered = claims.filter((claim) => {
    if (claim.type !== "file_changed" || !addedText.has(claim.text)) return true;
    const paths = claim.paths ?? [];
    return paths.some((file) => !isTestFile(file));
  });
  return filtered.slice(0, MAX_CLAIMS);
}
var FILE_EXT = /* @__PURE__ */ new Set([
  "ts",
  "tsx",
  "js",
  "jsx",
  "mjs",
  "cjs",
  "py",
  "pyi",
  "go",
  "rs",
  "java",
  "kt",
  "kts",
  "rb",
  "php",
  "cs",
  "cpp",
  "cc",
  "cxx",
  "c",
  "h",
  "hpp",
  "vue",
  "svelte",
  "html",
  "css",
  "scss",
  "yml",
  "yaml",
  "json",
  "md",
  "markdown",
  "toml",
  "xml",
  "sql",
  "sh",
  "bash",
  "cbl",
  "cob",
  "coby",
  "gradle",
  "swift",
  "txt",
  "csv",
  "lock"
]);
function expandClauses(sentence) {
  const parts = sentence.split(/\s*;\s+|\s+\band\b\s+/i).map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return [sentence];
  const claimLike = (part) => CHANGE_VERB.test(part) || TESTS_PASS.test(part) || ADDED_TESTS.test(part) || LINT_PASS.test(part) || BUILD_PASS.test(part);
  return parts.every(claimLike) ? parts : [sentence];
}
function isBoilerplate(sentence) {
  if (isMediaLine(sentence)) return true;
  const plain = sentence.replace(/[*_`]/g, "").replace(/^[^A-Za-z0-9]+/, "").trim();
  if (/^(?:changes?|what changed|what changes|updated files|summary|details|test plan|testing|screenshots?|notes?|description|verification|related(?: issues)?|changelog|changes breakdown|change impact|behaviou?r changes):?$/i.test(plain)) {
    return true;
  }
  return /pr created automatically by jules/i.test(sentence) || /when you start a review, i'll add/i.test(sentence) || /i'll push a commit with your requested changes/i.test(sentence) || /jules\.google\.com\/task/i.test(sentence) || /^generated by (?:codex|claude|cursor|devin|jules|copilot)\b/i.test(plain) || /by submitting this pull request/i.test(sentence) || /\b(?:contributor license agreement|i agree to the|copyright license)\b/i.test(sentence);
}
function isMediaLine(sentence) {
  const plain = sentence.trim();
  if (/^!\[[^\]]*\]\([^)\n]+\)\.?$/.test(plain)) return true;
  return /^<?https?:\/\/\S+>?\.?$/i.test(plain) && /\.(?:png|jpe?g|gif|webp|svg|mp4|mov|webm)(?:[?#]|\s|$)/i.test(plain);
}
function isExternalInstruction(sentence) {
  const tellsSomeone = /\b(?:add|set|configure|put|paste|remember to)\b/i.test(sentence);
  const outsideTheDiff = /\b(?:before deploy(?:ing|ment)?|cloudflare|vercel dashboard|netlify dashboard|github secrets?|secret store|pages project|hosting provider)\b/i.test(sentence);
  return tellsSomeone && outsideTheDiff;
}
function isPassingNote(sentence) {
  if (/\b(?:google|upstream|android)\b[\s\S]{0,80}\b(?:has|have|had)\s+(?:removed|deleted|dropped)\b/i.test(sentence)) return true;
  if (/\basked for\b[\s\S]{0,120}\b(?:to be removed|removed|be deleted)\b/i.test(sentence)) return true;
  const tokens = rawTokens(sentence);
  return tokens.length > 0 && tokens.every((token) => token.role === "passing");
}
function findTokens(sentence) {
  const paths = [];
  const mentions = [];
  const supporting = [];
  for (const token of rawTokens(sentence)) {
    if (token.role === "passing") continue;
    if (token.role === "edit" && isFileToken(token.value)) paths.push(token.value);
    else if (token.role === "edit" && isMention(token.value)) mentions.push(token.value);
    else if (isMention(token.value)) supporting.push(token.value);
  }
  return { paths: [...new Set(paths)], mentions: [...new Set(mentions)], supporting: [...new Set(supporting)] };
}
function rawTokens(sentence) {
  const stripped = sentence.replace(/https?:\/\/\S+/g, "");
  const pattern = /`([^`\n]+)`|\b((?:[\w.-]+\/)+[\w.-]+\.[A-Za-z0-9]+)\b/g;
  const tokens = [];
  for (const match of stripped.matchAll(pattern)) {
    const value = (match[1] || match[2] || "").replace(/^[("']+|[)"',:]+$/g, "");
    if (!value || value.length > 200 || value.includes(" ")) continue;
    tokens.push({ value, role: tokenRole(stripped, match.index ?? 0, value) });
  }
  return tokens;
}
function tokenRole(sentence, index, token) {
  const clause = clauseAt(sentence, index);
  const at = clause.indexOf(token);
  const before = at >= 0 ? clause.slice(0, at) : clause;
  const around = `${before}${clause.slice(Math.max(0, at), at + token.length + 48)}`;
  if (/\b(?:see|refer(?:red|ence|s|ring)?(?:\s+to)?|citing|cited|as described in|documented in|according to)\s*$/i.test(before.trim())) {
    return "passing";
  }
  if (/\b(?:asked for|taken out|once the|previously|earlier|used to|had been|legacy|historical)\b/i.test(around)) return "passing";
  if (/\b(?:google|upstream|android|the sdk)\b/i.test(before) && /\b(?:has|have|had)\s+(?:removed|deleted|dropped|renamed)\b/i.test(clause)) {
    return "passing";
  }
  if (CHANGE_VERB.test(clause)) return "edit";
  return "side";
}
function clauseAt(sentence, index) {
  const before = sentence.slice(0, index);
  const start = Math.max(before.lastIndexOf(";"), before.lastIndexOf("\n")) + 1;
  const rest = sentence.slice(index);
  const endRel = rest.search(/[;\n]/);
  const end = endRel === -1 ? sentence.length : index + endRel;
  return sentence.slice(start, end);
}
function proseIdentifiers(sentence) {
  const matches = sentence.match(/\b[a-z]+(?:[A-Z][\w$]*)+\b/g) ?? [];
  return [...new Set(matches.filter((token) => token.length >= 6 && !STOP.has(token.toLowerCase())))];
}
function isFileToken(token) {
  if (token.includes("://")) return false;
  if (token.includes("/")) return /\.[A-Za-z0-9]+$/.test(token);
  const ext = token.includes(".") ? token.split(".").pop()?.toLowerCase() ?? "" : "";
  return FILE_EXT.has(ext);
}
function isMention(token) {
  if (isFileToken(token) || /^\d/.test(token)) return false;
  if (token.length < 3 || token.length > 80) return false;
  if (STOP.has(token.toLowerCase())) return false;
  return /^[A-Za-z_][\w$]*(?:\.[A-Za-z_][\w$]*)*$/.test(token);
}
function broadBehavior(sentence) {
  const verbAndNoun = /\b(?:implements?|implementation|honou?rs?|ensures?|guarantees?|complies|follows)\b/i.test(sentence) && /\b(?:rules?|spec(?:ification)?s?|standards?|contracts?|behaviou?rs?|semantics|logic)\b/i.test(sentence);
  const count = /\b\d+\s+(?:new\s+|extra\s+|additional\s+)?(?:options|warnings|fields|entries)\b/i.test(sentence);
  return verbAndNoun || count;
}
function stripTrailingPunctuation(value) {
  return value.replace(/[.]+$/, "").trim();
}
function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

// src/checks.ts
var FAIL = /* @__PURE__ */ new Set(["failure", "timed_out", "startup_failure"]);
var RAN = /* @__PURE__ */ new Set(["success", "failure", "timed_out", "startup_failure", "action_required", "neutral", "stale"]);
function classifyCheck(name) {
  const value = name.toLowerCase();
  if (/type[- ]?check|typecheck|\btsc\b|\bmypy\b|\bpyright\b/.test(value)) return "typecheck";
  if (/lint|eslint|ruff|clippy|stylelint|prettier|format/.test(value)) return "lint";
  if (/test|jest|vitest|pytest|rspec|mocha|cypress|playwright|phpunit|unittest|\bunit\b|\bspec\b|cargo test|go test/.test(value)) {
    return "test";
  }
  if (/build|compile|webpack|docker|package/.test(value)) return "build";
  return "other";
}
function ciStatus(runs, headSha) {
  const onHead = runs.filter((run) => run.sha === headSha);
  if (onHead.length === 0) return "none";
  if (onHead.some((run) => run.status === "completed" && RAN.has(run.conclusion ?? ""))) return "ran";
  if (onHead.some((run) => run.status !== "completed")) return "pending";
  return "skipped";
}
function judgeCheckGroup(runs, headSha, kind) {
  const relevant = kind === "any" ? runs : relevantChecks(runs, kind);
  const onHead = relevant.filter((run) => run.sha === headSha);
  const completed = onHead.filter((run) => run.status === "completed");
  const pending = onHead.filter((run) => run.status !== "completed");
  const failures = completed.filter((run) => FAIL.has(run.conclusion ?? ""));
  const successes = completed.filter((run) => run.conclusion === "success");
  if (failures.length > 0) {
    return { verdict: "contradicted", evidence: toEvidence(failures), reason: "failed" };
  }
  if (pending.length > 0) {
    return { verdict: "unverifiable", evidence: toEvidence(pending), reason: "pending" };
  }
  if (successes.length > 0 && groupPassed(kind, completed)) {
    return { verdict: "confirmed", evidence: toEvidence(successes), reason: "passed" };
  }
  const skipped = completed.filter((run) => run.conclusion === "skipped" || run.conclusion === "cancelled");
  if (skipped.length > 0) {
    return { verdict: "unverifiable", evidence: toEvidence(skipped), reason: "skipped" };
  }
  const older = relevant.filter((run) => run.sha !== headSha && run.conclusion === "success" && run.status === "completed");
  if (older.length > 0) {
    return { verdict: "stale", evidence: toEvidence(older.slice(0, 3)), reason: "stale" };
  }
  return { verdict: "unverifiable", evidence: [], reason: "none" };
}
function groupPassed(kind, completed) {
  if (kind !== "any") return true;
  return completed.every((run) => {
    const conclusion = run.conclusion ?? "";
    return conclusion === "success" || conclusion === "skipped" || conclusion === "neutral" || conclusion === "cancelled";
  });
}
function relevantChecks(runs, kind) {
  const specific = runs.filter((run) => classifyCheck(run.name) === kind);
  if (specific.length > 0) return specific;
  if (kind === "test") {
    const generic = runs.filter((run) => /^(ci|continuous integration|pipeline)$/i.test(run.name.trim()));
    if (generic.length > 0) return generic;
  }
  return [];
}
function failedOnHead(runs, headSha) {
  return runs.filter((run) => run.sha === headSha && run.status === "completed" && FAIL.has(run.conclusion ?? ""));
}
function toEvidence(runs) {
  return runs.slice(0, 5).map(
    (run) => defined({
      kind: "check_run",
      name: run.name,
      conclusion: run.conclusion,
      sha: run.sha,
      url: run.url ?? void 0
    })
  );
}

// src/redflags.ts
var SKIP_PATTERNS = [
  /\bit\.skip\b/,
  /\btest\.skip\b/,
  /\bdescribe\.skip\b/,
  /\bcontext\.skip\b/,
  /\bxit\s*\(/,
  /\bxdescribe\s*\(/,
  /\bxtest\s*\(/,
  /\bxcontext\s*\(/,
  /@pytest\.mark\.skip/,
  /\bpytest\.skip\s*\(/,
  /\bunittest\.skip\b/,
  /\bt\.Skip(?:Now)?\s*\(/,
  /\b(?:it|test|describe)\.todo\s*\(/,
  /#\[ignore\]/
];
var ASSERT_LINE = /\bexpect\s*\(|\bassert(?:Equal|Equals|True|False|NotEqual|_eq!|_ne!)?\b|\.should\b|\bself\.assert|\bconsole\.assert\b|\b(?:REQUIRE|CHECK|EXPECT_(?:EQ|NE|TRUE|FALSE|THAT|CALL))\s*\(/;
var TEST_CASE = /^\s*(?:it|test|describe)\s*\(|^\s*(?:async\s+)?def\s+test_|^\s*func\s+Test[A-Z]|^\s*#\[test\]|^\s*TEST(?:_F|_P)?\s*\(/;
var WEAK_COMMAND = /\|\|\s*true\b|\|\|\s*:\s*$|\|\|\s*exit\s+0\b|continue-on-error:\s*true/i;
var TEST_STEP = /\b(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?test\b|\b(?:pytest|vitest|jest|rspec|phpunit)\b|\bgo\s+test\b|\bcargo\s+test\b|\bmvn\s+(?:test|verify)\b|\bdotnet\s+test\b|\bpython\s+-m\s+(?:pytest|unittest)\b/i;
var PASS_CLAIM = /* @__PURE__ */ new Set([
  "tests_pass",
  "checks_pass",
  "lint_pass",
  "typecheck_pass",
  "build_pass"
]);
function weakenedCommandFiles(files) {
  const weakened = [];
  for (const file of files) {
    if (!isCommandFile(file.filename) || file.status === "removed" || file.status === "unchanged") continue;
    if (patchMissing(file)) continue;
    const hit = addedLines(file.patch).some((line) => !isCommentLine(line) && WEAK_COMMAND.test(line));
    if (hit) weakened.push(file.filename);
  }
  return weakened;
}
function detectRedFlags(files, checkRuns, headSha, claims = []) {
  const flags = [];
  const limits = [];
  const notes = [];
  const deletedFiles = files.filter((file) => file.status === "removed" && isTestFile(file.filename));
  const caseRemovals = [];
  for (const file of files) {
    if (!isTestFile(file.filename) || file.status === "removed" || file.status === "unchanged") continue;
    if (patchMissing(file)) {
      limits.push(`The diff for ${backtick(file.filename)} was too large to inspect for deleted or skipped tests.`);
      continue;
    }
    const removed = removedLines(file.patch).filter((line) => !isCommentLine(line) && TEST_CASE.test(line)).length;
    const added = addedLines(file.patch).filter((line) => !isCommentLine(line) && TEST_CASE.test(line)).length;
    if (removed > added) caseRemovals.push(file.filename);
  }
  if (deletedFiles.length > 0 || caseRemovals.length > 0) {
    const names = [...deletedFiles.map((file) => file.filename), ...caseRemovals];
    const filePart = deletedFiles.length ? `Deleted ${deletedFiles.length === 1 ? "the test file" : "test files"} ${formatList(deletedFiles.map((file) => backtick(file.filename)))}.` : "";
    const casePart = caseRemovals.length ? `Removed test cases from ${formatList(caseRemovals.map((file) => backtick(file)))} without replacing them.` : "";
    flags.push({
      kind: "tests_deleted",
      summary: [filePart, casePart].filter(Boolean).join(" "),
      files: [...new Set(names)]
    });
  }
  const skipped = [];
  for (const file of files) {
    if (file.status === "removed" || file.status === "unchanged") continue;
    if (!isTestFile(file.filename) && !isCodeFile(file.filename)) continue;
    if (patchMissing(file)) continue;
    const hit = addedLines(file.patch).some((line) => !isCommentLine(line) && SKIP_PATTERNS.some((pattern) => pattern.test(line)));
    if (hit) skipped.push(file.filename);
  }
  if (skipped.length > 0) {
    flags.push({
      kind: "tests_skipped",
      summary: `Skipped tests were added in ${formatList(skipped.map((file) => backtick(file)))} (for example .skip, xit, or pytest.mark.skip).`,
      files: skipped
    });
  }
  const assertionFiles = [];
  const assertionNotes = [];
  for (const file of files) {
    if (!isTestFile(file.filename) || file.status === "removed" || file.status === "unchanged") continue;
    if (patchMissing(file)) continue;
    const removed = removedLines(file.patch).filter((line) => !isCommentLine(line) && ASSERT_LINE.test(line)).length;
    const added = addedLines(file.patch).filter((line) => !isCommentLine(line) && ASSERT_LINE.test(line)).length;
    if (removed > added && removed > 0) {
      assertionFiles.push(file.filename);
      assertionNotes.push(`${backtick(file.filename)} (${removed} removed, ${added} added)`);
    }
  }
  if (assertionFiles.length > 0) {
    flags.push({
      kind: "assertions_removed",
      summary: `Removed assertions from tests without replacing them: ${formatList(assertionNotes)}.`,
      files: assertionFiles
    });
  }
  const weakened = weakenedCommandFiles(files);
  if (weakened.length > 0) {
    flags.push({
      kind: "test_command_weakened",
      summary: `A test command was weakened in ${formatList(weakened.map((file) => backtick(file)))} (for example \`|| true\` or continue-on-error).`,
      files: weakened
    });
  }
  const droppedSteps = droppedTestStepFiles(files);
  if (droppedSteps.length > 0) {
    const summary = `Removed a test step from ${formatList(droppedSteps.map((file) => backtick(file)))} and did not add one.`;
    const existing = flags.find((flag) => flag.kind === "tests_deleted");
    if (existing) {
      existing.summary = `${existing.summary} ${summary}`;
      existing.files = [.../* @__PURE__ */ new Set([...existing.files, ...droppedSteps])];
    } else {
      flags.push({ kind: "tests_deleted", summary, files: droppedSteps });
    }
  }
  const ciFiles = files.filter((file) => isCiConfig(file.filename) && file.status !== "unchanged");
  const loud = /* @__PURE__ */ new Set([...weakened, ...droppedSteps]);
  const benignCi = ciFiles.filter((file) => !loud.has(file.filename));
  if (benignCi.length > 0) {
    notes.push(
      `CI configuration changed in ${formatList(benignCi.map((file) => backtick(file.filename)))}. The edit does not drop a test step or weaken the test command, so it is not a warning sign by itself.`
    );
  }
  const status = ciStatus(checkRuns, headSha);
  const passClaim = claims.some((claim) => PASS_CLAIM.has(claim.type) && !claim.hedged);
  if (passClaim && (status === "none" || status === "skipped")) {
    notes.push(
      status === "skipped" ? "CI checks on this commit were skipped or cancelled, so a claim that tests passed could not be verified." : "No CI checks have reported a result for this commit, so a claim that tests passed could not be verified."
    );
  }
  const failed = unexplainedFailures(checkRuns, headSha, claims);
  const blocking = failed.filter((run) => isHardCheck(run.name));
  const advisory = failed.filter((run) => !isHardCheck(run.name) && isAdvisoryCheck(run.name));
  const other = failed.filter((run) => !isHardCheck(run.name) && !isAdvisoryCheck(run.name));
  if (blocking.length > 0) {
    flags.push({
      kind: "check_failed",
      summary: `These checks failed on this commit: ${formatList(blocking.map((run) => backtick(run.name)))}.`,
      files: []
    });
  }
  if (advisory.length > 0) {
    notes.push(
      `These checks failed, but they are review bots or preview deploys, so they do not by themselves mean the change does not match: ${formatList(advisory.map((run) => backtick(run.name)))}.`
    );
  }
  if (other.length > 0) {
    notes.push(
      `These checks failed, but they are not a test, build, lint, or security check, so they do not by themselves mean the change does not match: ${formatList(other.map((run) => backtick(run.name)))}.`
    );
  }
  return { flags, limits, notes };
}
function droppedTestStepFiles(files) {
  const dropped = [];
  for (const file of files) {
    if (!isCiConfig(file.filename) || file.status === "unchanged") continue;
    if (patchMissing(file)) continue;
    const removed = removedLines(file.patch).filter((line) => !isCommentLine(line) && TEST_STEP.test(line));
    const kept = addedLines(file.patch).some((line) => !isCommentLine(line) && TEST_STEP.test(line));
    if (removed.length > 0 && !kept) dropped.push(file.filename);
  }
  return dropped;
}
function isHardCheck(name) {
  if (isAdvisoryCheck(name)) return false;
  const kind = classifyCheck(name);
  if (kind === "test" || kind === "lint" || kind === "typecheck" || kind === "build") return true;
  return /\b(?:security|codeql|sast|semgrep|devskim|dependabot|vulnerabilit(?:y|ies)|secret scan|npm audit|cargo audit)\b/i.test(name);
}
function isAdvisoryCheck(name) {
  const value = name.toLowerCase();
  if (/coderabbit|greptile|bugbot|sourcery|ellipsis|claude-review|gemini code assist/.test(value)) return true;
  if (/\bcopilot\b/.test(value) && /\breview\b/.test(value)) return true;
  if (/netlify|deploy-preview|preview deploy|chromatic|argos|percy/.test(value)) return true;
  if (/\bvercel\b/.test(value) && /\b(?:preview|comment)\b/.test(value)) return true;
  if (/\b(?:redirect rules|header rules|pages changed)\b/.test(value)) return true;
  return false;
}
function unexplainedFailures(runs, headSha, claims) {
  return failedOnHead(runs, headSha).filter((run) => {
    const kind = classifyCheck(run.name);
    if (kind === "other") return true;
    const type = kind === "lint" ? "lint_pass" : kind === "typecheck" ? "typecheck_pass" : kind === "build" ? "build_pass" : "tests_pass";
    return !claims.some((claim) => claim.type === type);
  });
}

// src/judge.ts
function judgeClaims(raw, evidence) {
  return raw.map((claim, index) => judgeOne(claim, evidence, index));
}
var HARD_FLAG = /* @__PURE__ */ new Set(["tests_deleted", "tests_skipped", "assertions_removed", "test_command_weakened", "check_failed"]);
var CI_PASS = /* @__PURE__ */ new Set(["tests_pass", "build_pass", "lint_pass", "typecheck_pass", "checks_pass"]);
function overallVerdict(claims, redFlags) {
  const hardFlag = redFlags.some((flag) => HARD_FLAG.has(flag.kind));
  const failedCheck = claims.some((claim) => claim.verdict === "contradicted" && CI_PASS.has(claim.type));
  if (hardFlag || failedCheck) return "doesnt_match";
  if (claims.length > 0 && claims.every((claim) => claim.verdict === "confirmed")) return "checks_out";
  return "partly_checked";
}
function judgeOne(claim, evidence, index) {
  const runs = evidence.checkRuns ?? [];
  const files = evidence.files ?? [];
  let verdict = "unverifiable";
  let items = [];
  if (claim.type === "tests_pass" || claim.type === "build_pass" || claim.type === "lint_pass" || claim.type === "typecheck_pass" || claim.type === "checks_pass") {
    const kind = claim.type === "checks_pass" ? "any" : checkKind(claim.type);
    const judged = judgeCheckGroup(runs, evidence.headSha, kind);
    items = judged.evidence;
    verdict = claim.hedged ? "unverifiable" : judged.verdict;
    if (claim.hedged) items = annotateHedge(judged, items);
    if (verdict === "confirmed" && (claim.type === "tests_pass" || claim.type === "checks_pass")) {
      const weakened = weakenedCommandFiles(files);
      if (weakened.length > 0) {
        verdict = "contradicted";
        const names = formatList(weakened.map((file) => backtick(file)));
        items = [
          defined({
            kind: "note",
            detail: `A green run does not count. The test command was weakened in ${names}, so the check can pass even when the tests fail.`,
            file: weakened[0]
          }),
          ...items
        ];
      }
    }
  } else if (claim.type === "file_changed") {
    const result = judgeScoped(claim, files);
    verdict = result.verdict;
    items = result.evidence;
  } else if (claim.type === "added_tests") {
    const judged = judgeAddedTests(claim, files);
    verdict = judged.verdict;
    items = judged.evidence;
  } else if (claim.type === "fixed_issue") {
    const issue = claim.issue;
    const mentioning = files.filter((file) => {
      if (!isTestFile(file.filename) || file.status === "removed") return false;
      return (file.patch ?? "").includes(`#${issue}`);
    });
    const tests = judgeCheckGroup(runs, evidence.headSha, "test");
    const testsCount = tests.verdict === "confirmed" && weakenedCommandFiles(files).length === 0;
    if (issue !== void 0 && mentioning.length > 0 && testsCount) {
      verdict = "confirmed";
      items = [
        ...mentioning.slice(0, 3).map((file) => defined({ kind: "diff", file: file.filename })),
        ...tests.evidence.slice(0, 2)
      ];
    } else {
      verdict = "unverifiable";
      items = [
        defined({
          kind: "issue",
          detail: issue ? `Linking this pull request to issue #${issue} does not show the issue is fixed.` : "No issue number was found."
        })
      ];
    }
  } else {
    verdict = "unverifiable";
    items = [defined({ kind: "note", detail: "Nothing in the diff or the check runs can show this." })];
  }
  return defined({
    id: `c${index + 1}`,
    text: claim.text,
    type: claim.type,
    verdict,
    hedged: claim.hedged ? true : void 0,
    evidence: items
  });
}
function checkKind(type) {
  if (type === "lint_pass") return "lint";
  if (type === "typecheck_pass") return "typecheck";
  if (type === "build_pass") return "build";
  return "test";
}
function annotateHedge(judged, items) {
  const note = hedgeNote(judged.reason);
  return [defined({ kind: "note", detail: note }), ...items];
}
function hedgeNote(reason) {
  if (reason === "passed") return "The agent hedged. A matching check did pass, but the agent did not claim that outright.";
  if (reason === "failed") return "The agent hedged. A matching check on this commit failed.";
  if (reason === "pending") return "The agent hedged. A matching check is still running.";
  if (reason === "stale") return "The agent hedged. A matching check passed only on an older commit.";
  if (reason === "skipped") return "The agent hedged. The matching check was skipped.";
  return "The agent already treated this as uncertain.";
}
function judgeAddedTests(claim, files) {
  const changed = files.filter((file) => testTouch(file) && file.status !== "removed" && file.status !== "unchanged");
  const deleted = files.filter((file) => isTestFile(file.filename) && file.status === "removed");
  const named = (claim.paths ?? []).filter((file) => isTestFile(file) || /\.(test|spec)\./i.test(file));
  const symbols = claim.mentions ?? [];
  if (changed.length === 0) {
    if (deleted.length > 0) {
      return {
        verdict: "contradicted",
        evidence: deleted.slice(0, 8).map((file) => defined({ kind: "diff", file: file.filename, detail: "deleted" }))
      };
    }
    return {
      verdict: "unverifiable",
      evidence: [defined({ kind: "note", detail: "Couldn't verify this. No test was added or changed." })]
    };
  }
  const missingNamed = named.filter((path4) => !changed.some((file) => sameFile(path4, file.filename)));
  if (named.length > 0 && missingNamed.length === named.length) {
    return {
      verdict: "unverifiable",
      evidence: missingNamed.map((file) => defined({ kind: "note", file, detail: `Couldn't verify this. ${backtick(file)} is not in the diff.` }))
    };
  }
  const haystack = changed.map((file) => patchText(file.patch)).join("\n");
  const unscanned = changed.some((file) => patchMissing(file));
  const missingSymbols = symbols.filter((symbol) => !haystack.includes(symbol));
  if (missingSymbols.length > 0) {
    if (unscanned && haystack.trim() === "") {
      return {
        verdict: "unverifiable",
        evidence: [defined({ kind: "note", detail: "The test diff was too large to look for the named symbol." })]
      };
    }
    return {
      verdict: "unverifiable",
      evidence: [
        ...changed.slice(0, 4).map((file) => defined({ kind: "diff", file: file.filename })),
        defined({
          kind: "note",
          detail: `Couldn't verify this. ${formatList(missingSymbols.map((symbol) => backtick(symbol)))} ${missingSymbols.length === 1 ? "is" : "are"} not in the changed tests.`
        })
      ]
    };
  }
  if (/\brebuil[dt]\b/i.test(claim.text) && /\bdist\b/i.test(claim.text) && !files.some((file) => /(?:^|\/)dist(?:\/|\.)/.test(file.filename))) {
    return {
      verdict: "unverifiable",
      evidence: [
        ...changed.slice(0, 4).map((file) => defined({ kind: "diff", file: file.filename })),
        defined({ kind: "note", detail: "A changed test file does not show that dist was rebuilt." })
      ]
    };
  }
  const evidence = changed.slice(0, 8).map((file) => defined({ kind: "diff", file: file.filename }));
  if (symbols.length > 0) {
    evidence.push(defined({ kind: "note", detail: `The changed tests mention ${formatList(symbols.map((symbol) => backtick(symbol)))}.` }));
  }
  return { verdict: "confirmed", evidence };
}
function judgeScoped(claim, files) {
  const paths = claim.paths ?? [];
  const mentions = claim.mentions ?? [];
  const leftAlone = /\b(?:untouched|unchanged|left alone|without (?:editing|touching|changing|modifying)|not (?:edited|modified|changed|touched))\b/i.test(claim.text);
  if (leftAlone) {
    return {
      verdict: "unverifiable",
      evidence: [
        defined({
          kind: "note",
          detail: "The sentence says this was left unchanged. A name in the patch, or a missing name, does not prove that."
        })
      ]
    };
  }
  const pathResult = paths.length > 0 ? judgeFiles(paths, files) : { verdict: "confirmed", evidence: [] };
  const mentionResult = judgeMentions(mentions, files);
  const evidence = [...pathResult.evidence, ...mentionResult.evidence];
  if (paths.length === 0 && mentions.length === 0) {
    return {
      verdict: "unverifiable",
      evidence: [
        defined({
          kind: "note",
          detail: "Couldn't verify this. A name in the diff confirms a sentence only when the sentence says that exact file or symbol was added or edited."
        })
      ]
    };
  }
  if (pathResult.verdict !== "confirmed" || mentionResult.verdict !== "confirmed") {
    return { verdict: "unverifiable", evidence };
  }
  const exclusive = exclusiveExtras(claim, files);
  if (exclusive.length > 0) {
    return {
      verdict: "unverifiable",
      evidence: [
        ...evidence,
        defined({
          kind: "note",
          detail: `Couldn't verify this. Other files also changed (${formatList(exclusive.slice(0, 4).map((file) => backtick(file)))}), so this is not only that change.`
        })
      ]
    };
  }
  if (claim.overclaim) {
    return {
      verdict: "unverifiable",
      evidence: [
        ...evidence,
        defined({
          kind: "note",
          detail: "The named file is in the diff, but this sentence claims behaviour a file name cannot prove."
        })
      ]
    };
  }
  return { verdict: "confirmed", evidence };
}
function testTouch(file) {
  if (isTestFile(file.filename)) return true;
  return addedLines(file.patch).some((line) => /^\s*#\[(?:[\w:]+::)?test\]/.test(line) || /^\s*func\s+(?:\(\s*\w+\s+\*?\w+\s*\)\s+)?Test[A-Z]/.test(line));
}
function exclusiveExtras(claim, files) {
  if (!/\bonly\b|\bthe only\b|\bno other files?\b|\bnothing else\b/i.test(claim.text)) return [];
  const named = /* @__PURE__ */ new Set();
  for (const path4 of claim.paths ?? []) {
    const match = resolvePath(path4, files);
    if (match) named.add(match.filename);
  }
  for (const mention of [...claim.mentions ?? [], ...claim.supportingMentions ?? []]) {
    for (const file of files) {
      if (file.status !== "unchanged" && patchText(file.patch).includes(mention)) named.add(file.filename);
    }
  }
  if (named.size === 0) return [];
  return files.filter((file) => file.status !== "unchanged" && !named.has(file.filename)).map((file) => file.filename);
}
function judgeMentions(mentions, files) {
  if (mentions.length === 0) return { verdict: "confirmed", evidence: [] };
  const found = [];
  const missing = [];
  for (const mention of mentions) {
    const file = files.find((item) => item.status !== "unchanged" && patchText(item.patch).includes(mention));
    if (file) found.push(defined({ kind: "diff", file: file.filename, detail: `found in the patch: ${mention}` }));
    else missing.push(mention);
  }
  if (missing.length === 0) return { verdict: "confirmed", evidence: found };
  const unscanned = files.some((file) => file.status !== "unchanged" && patchMissing(file));
  if (unscanned) {
    return {
      verdict: "unverifiable",
      evidence: [
        ...found,
        defined({
          kind: "note",
          detail: `${formatList(missing.map((token) => backtick(token)))} ${missing.length === 1 ? "was" : "were"} not in the patches GitHub returned. Some diffs were too large to scan.`
        })
      ]
    };
  }
  return {
    verdict: "unverifiable",
    evidence: [
      ...found,
      ...missing.map((token) => defined({ kind: "note", file: token, detail: `Couldn't verify this. ${backtick(token)} is not in the diff.` }))
    ]
  };
}
function sameFile(claimed, filename) {
  if (filename === claimed) return true;
  if (filename.endsWith(`/${claimed}`)) return true;
  return filename.split("/").pop() === claimed.split("/").pop() && claimed.includes(".");
}
function judgeFiles(paths, files) {
  if (paths.length === 0) {
    return { verdict: "unverifiable", evidence: [defined({ kind: "note", detail: "No file was named in the claim." })] };
  }
  const found = [];
  const missing = [];
  for (const path4 of paths) {
    const match = resolvePath(path4, files);
    if (match) found.push(match.filename);
    else missing.push(path4);
  }
  if (missing.length === 0) {
    return {
      verdict: "confirmed",
      evidence: found.map((file) => defined({ kind: "diff", file }))
    };
  }
  return {
    verdict: "unverifiable",
    evidence: [
      ...found.map((file) => defined({ kind: "diff", file })),
      ...missing.map((file) => defined({ kind: "note", detail: `Couldn't verify this. ${backtick(file)} is not in the diff.`, file }))
    ]
  };
}
function resolvePath(claimed, files) {
  const exact = files.find((file) => file.filename === claimed);
  if (exact) return exact;
  const bySuffix = files.filter((file) => file.filename.endsWith(`/${claimed}`));
  if (bySuffix.length === 1) return bySuffix[0];
  const base = claimed.split("/").pop();
  const byBase = files.filter((file) => file.filename.split("/").pop() === base);
  if (byBase.length === 1) return byBase[0];
  return void 0;
}

// src/present.ts
var VERDICT_ICON = {
  confirmed: "\u2705",
  contradicted: "\u274C",
  stale: "\u26A0\uFE0F",
  unverifiable: "\u2753"
};
var OVERALL_LABEL = {
  checks_out: "Checks out",
  partly_checked: "Partly checked",
  doesnt_match: "Doesn't match"
};
function presentReceipt(receipt) {
  return {
    overallLabel: OVERALL_LABEL[receipt.overall],
    task: taskLine(receipt),
    changes: describeChanges(receipt),
    claims: receipt.claims.map(presentClaim),
    warnings: receipt.red_flags.map((flag) => flag.summary),
    unverified: receipt.unverified ?? fallbackUnverified(receipt),
    bottomLine: bottomLine(receipt),
    footer: footer(receipt)
  };
}
function summaryPlain(receipt) {
  const task = lowerFirst(receipt.task.text) || "do the work in the pull request";
  const count = receipt.changes.files_changed;
  const changed = `${count} ${count === 1 ? "file" : "files"} changed (${receipt.changes.additions} lines added, ${receipt.changes.deletions} removed).`;
  return `${receipt.agent.name} was asked to ${task}. ${changed} ${bottomLine(receipt)}`;
}
function describeChanges(receipt) {
  const { files_changed: count, additions, deletions, files } = receipt.changes;
  if (count === 0 || files.length === 0) return "No files changed.";
  const line = `${countLabel(count, "file")} changed, ${countLabel(additions, "line")} added and ${deletions} removed.`;
  const readmes = [];
  const tests = [];
  const ci = [];
  const code = [];
  for (const file of files) {
    if (isTestFile(file)) tests.push(file);
    else if (/(^|\/)readme(\.|$)/i.test(file)) readmes.push(file);
    else if (isCiConfig(file)) ci.push(file);
    else code.push(file);
  }
  const parts = [];
  if (code.length > 0) parts.push(`code (${formatFiles(code)})`);
  if (tests.length > 0) parts.push(`tests (${formatFiles(tests)})`);
  if (ci.length > 0) parts.push(`CI config (${formatFiles(ci)})`);
  if (readmes.length === 1) parts.push("the README");
  else if (readmes.length > 1) parts.push(`docs (${formatFiles(readmes)})`);
  if (parts.length === 0) return line;
  return `${line} That includes ${formatList(parts)}.`;
}
function bottomLine(receipt) {
  const contradicted = receipt.claims.filter((claim) => claim.verdict === "contradicted");
  const open = receipt.claims.filter((claim) => claim.verdict === "unverifiable" || claim.verdict === "stale");
  if (receipt.overall === "checks_out") {
    return "What we could check matches what the agent said.";
  }
  if (receipt.overall === "partly_checked") {
    const held = (receipt.unverified ?? []).find((line) => /asked for changes|do not by themselves/i.test(line));
    if (open.length === 0 && held) return held;
    if (open.length === 1) return "What we could check matches what the agent said. One claim still needs a human to look at it.";
    if (open.length > 1) {
      return `What we could check matches what the agent said. ${open.length} claims still need a human to look at them.`;
    }
    return "What we could check matches what the agent said. Some of this pull request still needs a human.";
  }
  const parts = [];
  if (contradicted.length === 1) parts.push(`One claim is contradicted: "${contradicted[0].text}".`);
  else if (contradicted.length > 1) parts.push(`${contradicted.length} claims are contradicted.`);
  if (receipt.red_flags.length === 1) parts.push(`There is a warning sign: ${receipt.red_flags[0].summary}`);
  else if (receipt.red_flags.length > 1) parts.push(`There are ${receipt.red_flags.length} warning signs.`);
  parts.push("This receipt does not match the agent's account.");
  return parts.join(" ");
}
function unverifiedFrom(claims, limits) {
  const lines = claims.filter((claim) => claim.verdict === "unverifiable").map((claim) => `"${claim.text}" \u2014 ${shortUnverified(claim)}`);
  return [...lines, ...limits];
}
function presentClaim(claim) {
  const runUrl = claim.evidence.find((item) => item.kind === "check_run" && item.url)?.url;
  return {
    icon: VERDICT_ICON[claim.verdict],
    text: claim.text,
    detail: claimDetail(claim),
    runUrl,
    verdict: claim.verdict
  };
}
function claimDetail(claim) {
  if (claim.hedged) {
    const note = claim.evidence.find((item) => item.kind === "note")?.detail;
    return `we couldn't check this. ${note ?? "The agent already treated this as uncertain."}`;
  }
  if (claim.type === "file_changed") return fileDetail(claim);
  if (claim.type === "added_tests") return addedTestsDetail(claim);
  if (claim.type === "fixed_issue") return fixedDetail(claim);
  if (claim.type === "other") return "we couldn't check this. Nothing in the diff or the check runs covers it.";
  return checkDetail(claim);
}
function checkDetail(claim) {
  const name = claim.evidence.find((item) => item.kind === "check_run")?.name;
  const named = checkNameSuffix(name);
  const noun = checkNoun(claim.type);
  if (claim.verdict === "confirmed") return `confirmed. The ${noun} on this exact version of the code passed${named}.`;
  if (claim.verdict === "contradicted") {
    const note = claim.evidence.find((item) => item.kind === "note")?.detail;
    if (note) return `contradicted. ${note}`;
    return `contradicted. The ${noun} on this exact version of the code failed${named}.`;
  }
  if (claim.verdict === "stale") return `stale. This passed on an older commit${named}, not on the version in the pull request.`;
  const pending = claim.evidence.some((item) => item.conclusion === null || item.conclusion === "pending");
  if (pending) return `we couldn't check this. The ${noun} is still running${named}.`;
  const skipped = claim.evidence.some((item) => item.conclusion === "skipped" || item.conclusion === "cancelled");
  if (skipped) return `we couldn't check this. The ${noun} was skipped on this commit${named}.`;
  return `we couldn't check this. No ${noun} has run on this commit.`;
}
function checkNameSuffix(name) {
  if (!name) return "";
  if (/^(tests?|ci)$/i.test(name.trim())) return "";
  return ` (${name})`;
}
function checkNoun(type) {
  if (type === "lint_pass") return "lint run";
  if (type === "build_pass") return "build";
  if (type === "typecheck_pass") return "typecheck";
  if (type === "checks_pass") return "checks";
  return "test run";
}
function fileDetail(claim) {
  const mentions = claim.evidence.filter((item) => item.detail?.startsWith("found in the patch:"));
  const present = claim.evidence.filter((item) => item.kind === "diff" && item.file && !item.detail?.startsWith("found in the patch:")).map((item) => backtick(item.file));
  const missing = claim.evidence.filter((item) => item.kind === "note" && item.file).map((item) => backtick(item.file));
  if (claim.verdict === "unverifiable") {
    const note = claim.evidence.find((item) => item.kind === "note")?.detail;
    if (note?.toLowerCase().startsWith("couldn't verify")) return note.charAt(0).toLowerCase() + note.slice(1);
    return `couldn't verify this. ${note ?? "Nothing in the diff proves this sentence."}`;
  }
  if (claim.verdict === "confirmed") {
    const parts = [];
    if (present.length > 0) parts.push(`${formatList(present)} ${present.length === 1 ? "was" : "were"} changed`);
    if (mentions.length > 0) {
      const tokens = mentions.map((item) => backtick((item.detail ?? "").replace(/^found in the patch:\s*/, "")));
      parts.push(`${formatList(tokens)} ${tokens.length === 1 ? "is" : "are"} in the diff`);
    }
    if (parts.length === 0) return "confirmed. The named file was changed.";
    return `confirmed. ${parts.join(", and ")}.`;
  }
  if (missing.length > 0) return `contradicted. ${formatList(missing)} ${missing.length === 1 ? "is" : "are"} not in the diff.`;
  return "contradicted. The named file is not in the diff.";
}
function addedTestsDetail(claim) {
  if (claim.verdict === "confirmed") {
    const files = claim.evidence.filter((item) => item.kind === "diff" && item.file).map((item) => backtick(item.file));
    const symbol2 = claim.evidence.find((item) => item.kind === "note" && item.detail?.startsWith("The changed tests mention"));
    const base = `confirmed. This pull request adds or updates ${files.length === 1 ? "a test file" : "test files"}${files.length ? ` (${formatList(files)})` : ""}.`;
    return symbol2?.detail ? `${base} ${symbol2.detail}` : base;
  }
  if (claim.verdict === "unverifiable") {
    const note = claim.evidence.find((item) => item.kind === "note")?.detail;
    if (note?.toLowerCase().startsWith("couldn't verify")) return note.charAt(0).toLowerCase() + note.slice(1);
    return `couldn't verify this. ${note ?? "Nothing in the diff proves a test was added."}`;
  }
  const symbol = claim.evidence.find((item) => item.kind === "note" && item.detail?.includes("not in the changed tests"));
  if (symbol?.detail) return `contradicted. ${symbol.detail}`;
  const deleted = claim.evidence.filter((item) => item.detail === "deleted" && item.file).map((item) => backtick(item.file));
  if (deleted.length > 0) {
    const noun = deleted.length === 1 ? "the test file" : "the test files";
    return `contradicted. This pull request deleted ${noun} ${formatList(deleted)} and did not add or update a test.`;
  }
  return "contradicted. No test file was added or changed.";
}
function fixedDetail(claim) {
  if (claim.verdict === "confirmed") {
    return "confirmed. A test in this pull request mentions the issue, and the test run on this commit passed.";
  }
  return "we couldn't check this. Linking a pull request to an issue does not show the issue is fixed.";
}
function shortUnverified(claim) {
  if (claim.hedged) return "the agent already said this was uncertain.";
  if (claim.type === "other") return "nothing in GitHub's records covers it.";
  if (claim.type === "fixed_issue") return "a linked issue is not proof of a fix.";
  if (claim.evidence.some((item) => item.detail?.includes("cannot prove"))) return "a file name is not proof of that behaviour.";
  if (claim.evidence.some((item) => item.detail?.includes("too large"))) return "some diffs were too large to scan.";
  if (claim.evidence.some((item) => /couldn't verify|not in the diff/i.test(item.detail ?? ""))) return "couldn't verify it.";
  if (claim.verdict === "unverifiable") return "GitHub has no matching result for this commit.";
  return "this still needs a person.";
}
function fallbackUnverified(receipt) {
  return unverifiedFrom(receipt.claims, []);
}
function taskLine(receipt) {
  const text = receipt.task.text.trim().replace(/\.+$/, "");
  const issue = receipt.task.source.match(/^issue#(\d+)$/);
  if (issue && !text.includes(`#${issue[1]}`)) return `${text} (issue #${issue[1]}).`;
  return `${text}.`;
}
function footer(receipt) {
  const jsonUrl = `https://github.com/${receipt.repo}/blob/receipts/receipts/${receipt.id}.json`;
  return `[Pull request](${receipt.pr.url}) \xB7 [Raw JSON](${jsonUrl}) \xB7 Generated by proofslip v${receipt.generator.version}. This receipt only reports what GitHub records show. It is not a code review.`;
}
function formatFiles(files) {
  const shown = files.slice(0, 6).map((file) => backtick(file));
  if (files.length > 6) shown.push(`${files.length - 6} more`);
  return formatList(shown);
}

// src/reviews.ts
function unresolvedChangesRequested(reviews) {
  const latest = /* @__PURE__ */ new Map();
  const ordered = [...reviews].sort((a, b) => (a.submittedAt ?? "").localeCompare(b.submittedAt ?? ""));
  for (const review of ordered) {
    if (review.state === "COMMENTED" || review.state === "PENDING") continue;
    latest.set(review.author.toLowerCase(), review);
  }
  return [...latest.values()].filter((review) => review.state === "CHANGES_REQUESTED");
}
function reviewPushbackLine(reviews) {
  const open = unresolvedChangesRequested(reviews);
  if (open.length === 0) return null;
  const names = formatList(open.map((review) => review.author));
  const verb = open.length === 1 ? "asked" : "asked";
  const noun = open.length === 1 ? "that review is" : "those reviews are";
  return `${names} ${verb} for changes, and ${noun} still open.`;
}

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path: path4, errorMaps, issueData } = params;
  const fullPath = [...path4, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path4, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path4;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// src/schema.ts
var verdictSchema = external_exports.enum(["confirmed", "contradicted", "stale", "unverifiable"]);
var overallSchema = external_exports.enum(["checks_out", "partly_checked", "doesnt_match"]);
var detectedBySchema = external_exports.enum(["author", "label", "commit_trailer", "body_marker", "unspecified"]);
var claimTypeSchema = external_exports.enum([
  "tests_pass",
  "build_pass",
  "lint_pass",
  "typecheck_pass",
  "checks_pass",
  "file_changed",
  "added_tests",
  "fixed_issue",
  "other"
]);
var evidenceSchema = external_exports.object({
  kind: external_exports.enum(["check_run", "diff", "issue", "note"]),
  name: external_exports.string().optional(),
  conclusion: external_exports.string().nullable().optional(),
  sha: external_exports.string().optional(),
  url: external_exports.string().optional(),
  file: external_exports.string().optional(),
  detail: external_exports.string().optional()
}).strict();
var claimSchema = external_exports.object({
  id: external_exports.string(),
  text: external_exports.string(),
  type: claimTypeSchema,
  verdict: verdictSchema,
  hedged: external_exports.boolean().optional(),
  evidence: external_exports.array(evidenceSchema)
}).strict();
var redFlagSchema = external_exports.object({
  kind: external_exports.enum([
    "tests_deleted",
    "tests_skipped",
    "assertions_removed",
    "ci_config_edited",
    "test_command_weakened",
    "ci_never_ran",
    "check_failed"
  ]),
  summary: external_exports.string(),
  files: external_exports.array(external_exports.string())
}).strict();
var receiptSchema = external_exports.object({
  schema: external_exports.literal("agent-receipt/v0"),
  id: external_exports.string().min(1),
  created_at: external_exports.string().min(1),
  repo: external_exports.string().min(1),
  pr: external_exports.object({
    number: external_exports.number().int(),
    url: external_exports.string(),
    head_sha: external_exports.string(),
    author: external_exports.string()
  }).strict(),
  agent: external_exports.object({
    name: external_exports.string(),
    detected_by: detectedBySchema
  }).strict(),
  task: external_exports.object({
    source: external_exports.string(),
    text: external_exports.string()
  }).strict(),
  changes: external_exports.object({
    files_changed: external_exports.number().int().nonnegative(),
    additions: external_exports.number().int().nonnegative(),
    deletions: external_exports.number().int().nonnegative(),
    files: external_exports.array(external_exports.string())
  }).strict(),
  claims: external_exports.array(claimSchema),
  red_flags: external_exports.array(redFlagSchema),
  overall: overallSchema,
  summary_plain: external_exports.string(),
  unverified: external_exports.array(external_exports.string()).optional(),
  generator: external_exports.object({
    name: external_exports.literal("proofslip"),
    version: external_exports.string()
  }).strict()
}).strict();

// src/task.ts
var CLOSING = /\b(?:close[sd]?|fix(?:e[sd])?|resolv(?:e[sd])?)\s+#(\d+)\b/i;
function extractTask(evidence) {
  const haystack = `${evidence.title}
${evidence.body}`;
  const closing = haystack.match(CLOSING);
  if (closing?.[1]) {
    const number = Number(closing[1]);
    const issue = (evidence.linkedIssues ?? []).find((item) => item.number === number);
    return {
      source: `issue#${number}`,
      text: issue?.title?.trim() || evidence.title.trim() || `Issue #${number}`
    };
  }
  const linked = evidence.linkedIssues ?? [];
  if (linked.length > 0 && linked[0]) {
    return {
      source: `issue#${linked[0].number}`,
      text: linked[0].title.trim() || evidence.title.trim() || `Issue #${linked[0].number}`
    };
  }
  return { source: "pr", text: evidence.title.trim() || "No description was provided." };
}
function claimSourceText(evidence) {
  const parts = [evidence.body ?? ""];
  const logins = agentAuthorLogins(evidence);
  const comments = [...evidence.comments ?? []].filter((comment) => logins.has(comment.author.toLowerCase()) && comment.body.trim()).sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));
  const last = comments.at(-1);
  if (last && last.body.trim() !== (evidence.body ?? "").trim()) {
    parts.push(last.body);
  }
  return parts.join("\n\n");
}

// src/types.ts
var RECEIPT_SCHEMA_ID = "agent-receipt/v0";

// src/version.ts
var VERSION = "0.1.1";

// src/build.ts
function normalizeEvidence(input) {
  return {
    ...input,
    title: input.title ?? "",
    body: input.body ?? "",
    author: input.author ?? "unknown",
    additions: input.additions ?? 0,
    deletions: input.deletions ?? 0,
    files: input.files ?? [],
    comments: input.comments ?? [],
    checkRuns: input.checkRuns ?? [],
    linkedIssues: input.linkedIssues ?? [],
    commits: input.commits ?? [],
    labels: input.labels ?? [],
    reviews: input.reviews ?? []
  };
}
function receiptId(repo, prNumber, sha) {
  const slug = repo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${slug}-pr-${prNumber}-${sha.slice(0, 7)}`;
}
function holdChecksOut(overall, heldBack) {
  if (overall === "checks_out" && heldBack) return "partly_checked";
  return overall;
}
function timestamp(date) {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}
function buildReceipt(input, options = {}) {
  const evidence = normalizeEvidence(input);
  const agent = detectAgent(evidence, options);
  const task = extractTask(evidence);
  const claims = judgeClaims(extractClaims(claimSourceText(evidence), evidence.files), evidence);
  const report = detectRedFlags(evidence.files, evidence.checkRuns ?? [], evidence.headSha, claims);
  const reviewLine = reviewPushbackLine(evidence.reviews ?? []);
  const notes = reviewLine ? [...report.notes, reviewLine] : report.notes;
  const unverified = unverifiedFrom(claims, [...report.limits, ...notes]);
  const heldBack = reviewLine !== null || report.notes.some((note) => note.includes("do not by themselves"));
  const draft = {
    schema: RECEIPT_SCHEMA_ID,
    id: receiptId(evidence.repo, evidence.number, evidence.headSha),
    created_at: timestamp(options.now ?? /* @__PURE__ */ new Date()),
    repo: evidence.repo,
    pr: {
      number: evidence.number,
      url: evidence.url,
      head_sha: evidence.headSha,
      author: evidence.author
    },
    agent: { name: agent.name, detected_by: agent.detectedBy },
    task,
    changes: {
      files_changed: evidence.changedFiles ?? evidence.files.length,
      additions: evidence.additions,
      deletions: evidence.deletions,
      files: evidence.files.map((file) => file.filename)
    },
    claims,
    red_flags: report.flags,
    overall: holdChecksOut(overallVerdict(claims, report.flags), heldBack),
    summary_plain: "",
    unverified,
    generator: { name: "proofslip", version: options.version ?? VERSION }
  };
  draft.summary_plain = summaryPlain(draft);
  return receiptSchema.parse(draft);
}

// src/event.ts
function resolvePullRequestNumber(eventName, payload, input) {
  if (input && /^\d+$/.test(input.trim())) return Number(input.trim());
  if (eventName === "pull_request" || eventName === "pull_request_target") {
    return numberOrNull(payload.pull_request?.number);
  }
  if (eventName === "check_suite") {
    return numberOrNull(payload.check_suite?.pull_requests?.[0]?.number);
  }
  if (eventName === "check_run") {
    return numberOrNull(payload.check_run?.pull_requests?.[0]?.number);
  }
  if (eventName === "workflow_run") {
    return numberOrNull(payload.workflow_run?.pull_requests?.[0]?.number);
  }
  return numberOrNull(payload.pull_request?.number ?? payload.number);
}
function eventCommitSha(eventName, payload) {
  if (eventName === "pull_request" || eventName === "pull_request_target") {
    return stringOrNull(payload.pull_request?.head?.sha);
  }
  if (eventName === "check_suite") return stringOrNull(payload.check_suite?.head_sha);
  if (eventName === "check_run") return stringOrNull(payload.check_run?.head_sha);
  if (eventName === "workflow_run") return stringOrNull(payload.workflow_run?.head_sha);
  return stringOrNull(payload.sha);
}
function eventHeadBranch(eventName, payload) {
  if (eventName === "pull_request" || eventName === "pull_request_target") {
    return stringOrNull(payload.pull_request?.head?.ref);
  }
  if (eventName === "check_suite") return stringOrNull(payload.check_suite?.head_branch);
  if (eventName === "workflow_run") return stringOrNull(payload.workflow_run?.head_branch);
  return null;
}
function numberOrNull(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function stringOrNull(value) {
  return typeof value === "string" && value.trim() ? value : null;
}
function splitList(value) {
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

// node_modules/universal-user-agent/index.js
function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }
  if (typeof process === "object" && process.version !== void 0) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }
  return "<environment undetectable>";
}

// node_modules/before-after-hook/lib/register.js
function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }
  if (!options) {
    options = {};
  }
  if (Array.isArray(name)) {
    return name.reverse().reduce((callback, name2) => {
      return register.bind(null, state, name2, callback, options);
    }, method)();
  }
  return Promise.resolve().then(() => {
    if (!state.registry[name]) {
      return method(options);
    }
    return state.registry[name].reduce((method2, registered) => {
      return registered.hook.bind(null, method2, options);
    }, method)();
  });
}

// node_modules/before-after-hook/lib/add.js
function addHook(state, kind, name, hook2) {
  const orig = hook2;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }
  if (kind === "before") {
    hook2 = (method, options) => {
      return Promise.resolve().then(orig.bind(null, options)).then(method.bind(null, options));
    };
  }
  if (kind === "after") {
    hook2 = (method, options) => {
      let result;
      return Promise.resolve().then(method.bind(null, options)).then((result_) => {
        result = result_;
        return orig(result, options);
      }).then(() => {
        return result;
      });
    };
  }
  if (kind === "error") {
    hook2 = (method, options) => {
      return Promise.resolve().then(method.bind(null, options)).catch((error) => {
        return orig(error, options);
      });
    };
  }
  state.registry[name].push({
    hook: hook2,
    orig
  });
}

// node_modules/before-after-hook/lib/remove.js
function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }
  const index = state.registry[name].map((registered) => {
    return registered.orig;
  }).indexOf(method);
  if (index === -1) {
    return;
  }
  state.registry[name].splice(index, 1);
}

// node_modules/before-after-hook/index.js
var bind = Function.bind;
var bindable = bind.bind(bind);
function bindApi(hook2, state, name) {
  const removeHookRef = bindable(removeHook, null).apply(
    null,
    name ? [state, name] : [state]
  );
  hook2.api = { remove: removeHookRef };
  hook2.remove = removeHookRef;
  ["before", "error", "after", "wrap"].forEach((kind) => {
    const args = name ? [state, kind, name] : [state, kind];
    hook2[kind] = hook2.api[kind] = bindable(addHook, null).apply(null, args);
  });
}
function Singular() {
  const singularHookName = /* @__PURE__ */ Symbol("Singular");
  const singularHookState = {
    registry: {}
  };
  const singularHook = register.bind(null, singularHookState, singularHookName);
  bindApi(singularHook, singularHookState, singularHookName);
  return singularHook;
}
function Collection() {
  const state = {
    registry: {}
  };
  const hook2 = register.bind(null, state);
  bindApi(hook2, state);
  return hook2;
}
var before_after_hook_default = { Singular, Collection };

// node_modules/@octokit/endpoint/dist-bundle/index.js
var VERSION2 = "0.0.0-development";
var userAgent = `octokit-endpoint.js/${VERSION2} ${getUserAgent()}`;
var DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: ""
  }
};
function lowercaseKeys(object) {
  if (!object) {
    return {};
  }
  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) return false;
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}
function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach((key) => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, { [key]: options[key] });
      else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, { [key]: options[key] });
    }
  });
  return result;
}
function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === void 0) {
      delete obj[key];
    }
  }
  return obj;
}
function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? { method, url } : { url: method }, options);
  } else {
    options = Object.assign({}, route);
  }
  options.headers = lowercaseKeys(options.headers);
  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options);
  if (options.url === "/graphql") {
    if (defaults && defaults.mediaType.previews?.length) {
      mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(
        (preview) => !mergedOptions.mediaType.previews.includes(preview)
      ).concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = (mergedOptions.mediaType.previews || []).map((preview) => preview.replace(/-preview/, ""));
  }
  return mergedOptions;
}
function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);
  if (names.length === 0) {
    return url;
  }
  return url + separator + names.map((name) => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }
    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}
var urlVariableRegex = /\{[^{}}]+\}/g;
function removeNonChars(variableName) {
  return variableName.replace(/(?:^\W+)|(?:(?<!\W)\W+$)/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);
  if (!matches) {
    return [];
  }
  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}
function omit(object, keysToOmit) {
  const result = { __proto__: null };
  for (const key of Object.keys(object)) {
    if (keysToOmit.indexOf(key) === -1) {
      result[key] = object[key];
    }
  }
  return result;
}
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }
    return part;
  }).join("");
}
function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
  var value = context[key], result = [];
  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "bigint" || typeof value === "boolean") {
      value = value.toString();
      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }
      result.push(
        encodeValue(operator, value, isKeyOperator(operator) ? key : "")
      );
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            result.push(
              encodeValue(operator, value2, isKeyOperator(operator) ? key : "")
            );
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            tmp.push(encodeValue(operator, value2));
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }
        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }
  return result;
}
function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}
function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  template = template.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(_, expression, literal) {
      if (expression) {
        let operator = "";
        const values = [];
        if (operators.indexOf(expression.charAt(0)) !== -1) {
          operator = expression.charAt(0);
          expression = expression.substr(1);
        }
        expression.split(/,/g).forEach(function(variable) {
          var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
          values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
        });
        if (operator && operator !== "+") {
          var separator = ",";
          if (operator === "?") {
            separator = "&";
          } else if (operator !== "#") {
            separator = operator;
          }
          return (values.length !== 0 ? operator : "") + values.join(separator);
        } else {
          return values.join(",");
        }
      } else {
        return encodeReserved(literal);
      }
    }
  );
  if (template === "/") {
    return template;
  } else {
    return template.replace(/\/$/, "");
  }
}
function parse(options) {
  let method = options.method.toUpperCase();
  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);
  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }
  const omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      headers.accept = headers.accept.split(/,/).map(
        (format) => format.replace(
          /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
          `application/vnd$1$2.${options.mediaType.format}`
        )
      ).join(",");
    }
    if (url.endsWith("/graphql")) {
      if (options.mediaType.previews?.length) {
        const previewsFromAcceptHeader = headers.accept.match(/(?<![\w-])[\w-]+(?=-preview)/g) || [];
        headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
          const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
          return `application/vnd.github.${preview}-preview${format}`;
        }).join(",");
      }
    }
  }
  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      }
    }
  }
  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  }
  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  }
  return Object.assign(
    { method, url, headers },
    typeof body !== "undefined" ? { body } : null,
    options.request ? { request: options.request } : null
  );
}
function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}
function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS2 = merge(oldDefaults, newDefaults);
  const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
  return Object.assign(endpoint2, {
    DEFAULTS: DEFAULTS2,
    defaults: withDefaults.bind(null, DEFAULTS2),
    merge: merge.bind(null, DEFAULTS2),
    parse
  });
}
var endpoint = withDefaults(null, DEFAULTS);

// node_modules/content-type/dist/index.js
var SP = 32;
var HTAB = 9;
var SEMI = 59;
var EQ = 61;
var DQUOTE = 34;
var BSLASH = 92;
var COMMA = 44;
var LOWER_CASE = 1;
var OWS = 2;
var SEMI_FLAG = 4;
var COMMA_FLAG = 8;
var TOKEN_FLAG = 16;
var NON_ASCII = 65280;
var CASE_FLAGS = LOWER_CASE | NON_ASCII;
var CHAR_MAP = new Uint8Array(256);
CHAR_MAP[HTAB] |= OWS;
CHAR_MAP[SP] |= OWS;
CHAR_MAP[SEMI] |= SEMI_FLAG;
CHAR_MAP[COMMA] |= COMMA_FLAG;
for (let code = 128; code <= 255; code++) {
  CHAR_MAP[code] |= LOWER_CASE;
}
for (const char of "!#$%&'*+-.^_`|~") {
  CHAR_MAP[char.charCodeAt(0)] |= TOKEN_FLAG;
}
for (let code = 48; code <= 57; code++) {
  CHAR_MAP[code] |= TOKEN_FLAG;
}
for (let code = 65; code <= 90; code++) {
  CHAR_MAP[code] |= LOWER_CASE | TOKEN_FLAG;
}
for (let code = 97; code <= 122; code++) {
  CHAR_MAP[code] |= TOKEN_FLAG;
}
var NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse2(header, options) {
  const stopFlags = SEMI_FLAG | (options?.comma === true ? COMMA_FLAG : 0);
  const len = header.length;
  let valueStart = options?.start ?? 0;
  while ((CHAR_MAP[header.charCodeAt(valueStart)] & OWS) !== 0) {
    valueStart++;
  }
  let index = valueStart;
  let typeFlags = 0;
  let whitespace = -1;
  let stop = options?.parameters === false ? COMMA_FLAG : 0;
  while (index < len) {
    const code = header.charCodeAt(index);
    const flags = CHAR_MAP[code];
    if ((flags & stopFlags) !== 0) {
      stop |= flags & COMMA_FLAG;
      break;
    }
    if ((flags & OWS) !== 0) {
      if (whitespace === -1)
        whitespace = index;
    } else {
      whitespace = -1;
    }
    typeFlags |= code & NON_ASCII | flags;
    index++;
  }
  const valueEnd = whitespace === -1 ? index : whitespace;
  const value = header.slice(valueStart, valueEnd);
  const type = (typeFlags & CASE_FLAGS) === 0 ? value : value.toLowerCase();
  if (index === len || stop !== 0) {
    return { type, index, parameters: new NullObject() };
  }
  return parseParameters(header, type, index, len, stopFlags);
}
function parseParameters(header, type, index, len, stopFlags) {
  const parameters = new NullObject();
  parameter: while (index < len) {
    index++;
    while ((CHAR_MAP[header.charCodeAt(index)] & OWS) !== 0) {
      index++;
    }
    const keyStart = index;
    let keyFlags = 0;
    let keyWhitespace = -1;
    while (index < len) {
      const code = header.charCodeAt(index);
      const flags = CHAR_MAP[code];
      if ((flags & stopFlags) !== 0) {
        if ((flags & COMMA_FLAG) !== 0)
          break parameter;
        continue parameter;
      }
      if (code === EQ) {
        const keyEnd = keyWhitespace === -1 ? index : keyWhitespace;
        const value = header.slice(keyStart, keyEnd);
        const key = (keyFlags & CASE_FLAGS) === 0 ? value : value.toLowerCase();
        index++;
        while ((CHAR_MAP[header.charCodeAt(index)] & OWS) !== 0) {
          index++;
        }
        if (index < len && header.charCodeAt(index) === DQUOTE) {
          const quotedStart = ++index;
          let escaped = false;
          while (index < len) {
            const code2 = header.charCodeAt(index);
            if (code2 === DQUOTE) {
              if (parameters[key] === void 0) {
                parameters[key] = escaped ? unescapeQuotedPairs(header, quotedStart, index) : header.slice(quotedStart, index);
              }
              index++;
              let stop2 = 0;
              while (index < len) {
                const code3 = header.charCodeAt(index);
                const flags2 = CHAR_MAP[code3];
                if ((flags2 & stopFlags) !== 0) {
                  stop2 = flags2 & COMMA_FLAG;
                  break;
                }
                index++;
              }
              if (stop2 !== 0)
                break parameter;
              continue parameter;
            }
            if (code2 === BSLASH && index + 1 < len) {
              escaped = true;
              index += 2;
              continue;
            }
            index++;
          }
          continue parameter;
        }
        const valueStart = index;
        let stop = 0;
        let valueWhitespace = -1;
        while (index < len) {
          const code2 = header.charCodeAt(index);
          const flags2 = CHAR_MAP[code2];
          if ((flags2 & stopFlags) !== 0) {
            stop = flags2 & COMMA_FLAG;
            break;
          }
          if ((flags2 & OWS) !== 0) {
            if (valueWhitespace === -1)
              valueWhitespace = index;
          } else {
            valueWhitespace = -1;
          }
          index++;
        }
        if (parameters[key] === void 0) {
          const valueEnd = valueWhitespace === -1 ? index : valueWhitespace;
          parameters[key] = header.slice(valueStart, valueEnd);
        }
        if (stop !== 0)
          break parameter;
        continue parameter;
      }
      if ((flags & OWS) !== 0) {
        if (keyWhitespace === -1)
          keyWhitespace = index;
      } else {
        keyWhitespace = -1;
      }
      keyFlags |= code & NON_ASCII | flags;
      index++;
    }
  }
  return { type, index, parameters };
}
function unescapeQuotedPairs(str, start, end) {
  let result = "";
  for (let index = start; index < end; index++) {
    if (str.charCodeAt(index) === BSLASH) {
      result += str.slice(start, index);
      start = ++index;
    }
  }
  return result + str.slice(start, end);
}

// node_modules/json-with-bigint/json-with-bigint.js
var intRegex = /^-?\d+$/;
var noiseValue = /^-?\d+n+$/;
var originalStringify = JSON.stringify;
var originalParse = JSON.parse;
var customFormat = /^-?\d+n$/;
var bigIntsStringify = /([\[:])?"(-?\d+)n"($|\s*[,\}\]])/g;
var noiseStringify = /([\[:])?("-?\d+n+)n("$|"\s*[,\}\]])/g;
var isUnstringifiable = (val) => val === void 0 || typeof val === "function" || typeof val === "symbol";
var isRawJSON = (val) => val !== null && typeof val === "object" && val.constructor && val.constructor.name === "RawJSON";
var stringifyIteratively = (rootValue, replacer, spaceParam) => {
  let space = "";
  if (typeof spaceParam === "number") {
    space = " ".repeat(Math.min(10, Math.max(0, Math.floor(spaceParam))));
  } else if (typeof spaceParam === "string") {
    space = spaceParam.slice(0, 10);
  }
  const isFunctionReplacer = typeof replacer === "function";
  const propertyList = Array.isArray(replacer) ? new Set(replacer.map(String)) : null;
  const prepareVal = (parent, key, val) => {
    const isObject = val !== null && typeof val === "object";
    const hasToJSON = isObject && typeof val.toJSON === "function";
    if (hasToJSON) {
      val = val.toJSON(key);
    }
    const isNoise = typeof val === "string" && noiseValue.test(val);
    if (isNoise) return val + "n";
    const isBigInt = typeof val === "bigint";
    if (isBigInt) {
      const supportsRawJSON = "rawJSON" in JSON;
      if (supportsRawJSON) return JSON.rawJSON(val.toString());
      return val.toString() + "n";
    }
    if (isFunctionReplacer) {
      val = replacer.call(parent, key, val);
    }
    const isPostReplacerObject = val !== null && typeof val === "object";
    if (isPostReplacerObject) {
      const isPrimitiveWrapper = val instanceof Number || val instanceof String || val instanceof Boolean;
      if (isPrimitiveWrapper) {
        val = val.valueOf();
      }
    }
    return val;
  };
  const rootProcessed = prepareVal({ "": rootValue }, "", rootValue);
  if (isUnstringifiable(rootProcessed)) {
    return void 0;
  }
  const isRootPrimitive = rootProcessed === null || typeof rootProcessed !== "object";
  const isRootNativeRawJSON = isRawJSON(rootProcessed);
  if (isRootPrimitive || isRootNativeRawJSON) {
    return originalStringify(rootProcessed);
  }
  const chunks = [];
  let level = 0;
  const stack = [
    {
      parent: { "": rootProcessed },
      key: "",
      val: rootProcessed,
      isArray: Array.isArray(rootProcessed),
      keys: Array.isArray(rootProcessed) ? null : Object.keys(rootProcessed),
      index: 0,
      first: true
    }
  ];
  const visited = new WeakSet([rootProcessed]);
  while (stack.length > 0) {
    const node = stack[stack.length - 1];
    if (node.index === 0) {
      chunks.push(node.isArray ? "[" : "{");
      level++;
    }
    let isDone = false;
    if (node.isArray) {
      if (node.index < node.val.length) {
        if (!node.first) chunks.push(",");
        if (space) chunks.push("\n" + space.repeat(level));
        const childRaw = node.val[node.index];
        const childVal = prepareVal(node.val, String(node.index), childRaw);
        if (isUnstringifiable(childVal)) {
          chunks.push("null");
          node.first = false;
          node.index++;
        } else {
          const isComplexObject = childVal !== null && typeof childVal === "object";
          const isNativeRaw = isRawJSON(childVal);
          if (isComplexObject && !isNativeRaw) {
            if (visited.has(childVal)) {
              throw new TypeError("Converting circular structure to JSON");
            }
            visited.add(childVal);
            stack.push({
              parent: node.val,
              key: String(node.index),
              val: childVal,
              isArray: Array.isArray(childVal),
              keys: Array.isArray(childVal) ? null : Object.keys(childVal),
              index: 0,
              first: true
            });
            node.first = false;
            node.index++;
          } else {
            chunks.push(originalStringify(childVal));
            node.first = false;
            node.index++;
          }
        }
      } else {
        isDone = true;
      }
    } else {
      while (node.index < node.keys.length) {
        const k = node.keys[node.index++];
        const isFilteredOutByArray = propertyList && !propertyList.has(k);
        if (isFilteredOutByArray) continue;
        const childRaw = node.val[k];
        const childVal = prepareVal(node.val, k, childRaw);
        if (isUnstringifiable(childVal)) continue;
        if (!node.first) chunks.push(",");
        if (space) {
          chunks.push("\n" + space.repeat(level) + originalStringify(k) + ": ");
        } else {
          chunks.push(originalStringify(k) + ":");
        }
        const isComplexObject = childVal !== null && typeof childVal === "object";
        const isNativeRaw = isRawJSON(childVal);
        if (isComplexObject && !isNativeRaw) {
          if (visited.has(childVal)) {
            throw new TypeError("Converting circular structure to JSON");
          }
          visited.add(childVal);
          stack.push({
            parent: node.val,
            key: k,
            val: childVal,
            isArray: Array.isArray(childVal),
            keys: Array.isArray(childVal) ? null : Object.keys(childVal),
            index: 0,
            first: true
          });
          node.first = false;
          break;
        } else {
          chunks.push(originalStringify(childVal));
          node.first = false;
        }
      }
      const isNodeFullyProcessed = node.index >= node.keys.length && stack[stack.length - 1] === node;
      if (isNodeFullyProcessed) {
        isDone = true;
      }
    }
    if (isDone) {
      level--;
      if (!node.first && space) chunks.push("\n" + space.repeat(level));
      chunks.push(node.isArray ? "]" : "}");
      visited.delete(node.val);
      stack.pop();
    }
  }
  return chunks.join("");
};
var JSONStringify = (value, replacer, space) => {
  try {
    const supportsRawJSON = "rawJSON" in JSON;
    if (supportsRawJSON) {
      return originalStringify(
        value,
        (key, val) => {
          if (typeof val === "bigint") return JSON.rawJSON(val.toString());
          const hasFunctionReplacer = typeof replacer === "function";
          if (hasFunctionReplacer) return replacer(key, val);
          const isKeyInArrayReplacer = Array.isArray(replacer) && replacer.includes(key);
          if (isKeyInArrayReplacer) return val;
          return val;
        },
        space
      );
    }
    if (!value) return originalStringify(value, replacer, space);
    const convertedToCustomJSON = originalStringify(
      value,
      (key, val) => {
        const isNoise = typeof val === "string" && noiseValue.test(val);
        if (isNoise) return val.toString() + "n";
        if (typeof val === "bigint") return val.toString() + "n";
        const hasFunctionReplacer = typeof replacer === "function";
        if (hasFunctionReplacer) return replacer(key, val);
        const isKeyInArrayReplacer = Array.isArray(replacer) && replacer.includes(key);
        if (isKeyInArrayReplacer) return val;
        return val;
      },
      space
    );
    const processedJSON = convertedToCustomJSON.replace(
      bigIntsStringify,
      "$1$2$3"
    );
    const denoisedJSON = processedJSON.replace(noiseStringify, "$1$2$3");
    return denoisedJSON;
  } catch (error) {
    if (error instanceof RangeError) {
      const convertedJSON = stringifyIteratively(value, replacer, space);
      if (convertedJSON === void 0) return void 0;
      const supportsRawJSON = "rawJSON" in JSON;
      if (supportsRawJSON) return convertedJSON;
      const processedJSON = convertedJSON.replace(bigIntsStringify, "$1$2$3");
      return processedJSON.replace(noiseStringify, "$1$2$3");
    }
    throw error;
  }
};
var featureCache = /* @__PURE__ */ new Map();
var isContextSourceSupported = () => {
  const parseFingerprint = JSON.parse.toString();
  if (featureCache.has(parseFingerprint)) {
    return featureCache.get(parseFingerprint);
  }
  try {
    const result = JSON.parse(
      "1",
      (_, __, context) => !!context?.source && context.source === "1"
    );
    featureCache.set(parseFingerprint, result);
    return result;
  } catch {
    featureCache.set(parseFingerprint, false);
    return false;
  }
};
var convertMarkedBigIntsReviver = (key, value, context, userReviver) => {
  const isCustomFormatBigInt = typeof value === "string" && customFormat.test(value);
  if (isCustomFormatBigInt) return BigInt(value.slice(0, -1));
  const isNoiseValue = typeof value === "string" && noiseValue.test(value);
  if (isNoiseValue) return value.slice(0, -1);
  const hasUserReviver = typeof userReviver === "function";
  if (!hasUserReviver) return value;
  return userReviver(key, value, context);
};
var JSONParseV2 = (text, reviver) => {
  return JSON.parse(text, (key, value, context) => {
    const isNumber = typeof value === "number";
    const isOutOfBounds = value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER;
    const isBigNumber = isNumber && isOutOfBounds;
    const isInt = context && intRegex.test(context.source);
    const isBigInt = isBigNumber && isInt;
    if (isBigInt) return BigInt(context.source);
    const hasCustomReviver = typeof reviver === "function";
    if (!hasCustomReviver) return value;
    return reviver(key, value, context);
  });
};
var MAX_INT = Number.MAX_SAFE_INTEGER.toString();
var MAX_DIGITS = MAX_INT.length;
var stringsOrLargeNumbers = /"(?:[^"\\]|\\.)*"|-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?/g;
var noiseValueWithQuotes = /^"-?\d+n+"$/;
var applyReviverIteratively = (parsed, userReviver) => {
  const rootHolder = { "": parsed };
  const stack = [{ parent: rootHolder, key: "", visited: false }];
  while (stack.length > 0) {
    const node = stack[stack.length - 1];
    if (!node.visited) {
      node.visited = true;
      const value = node.parent[node.key];
      const isComplexObject = value !== null && typeof value === "object";
      if (isComplexObject) {
        const keys = Object.keys(value);
        for (let i = keys.length - 1; i >= 0; i--) {
          stack.push({ parent: value, key: keys[i], visited: false });
        }
      }
    } else {
      const { parent, key } = node;
      let value = parent[key];
      if (typeof value === "string") {
        const isCustomFormatBigInt = customFormat.test(value);
        if (isCustomFormatBigInt) {
          value = BigInt(value.slice(0, -1));
        } else {
          const isNoise = noiseValue.test(value);
          if (isNoise) value = value.slice(0, -1);
        }
      }
      const hasUserReviver = typeof userReviver === "function";
      if (hasUserReviver) {
        value = userReviver.call(parent, key, value);
      }
      const isDeleted = value === void 0;
      if (isDeleted) {
        delete parent[key];
      } else {
        parent[key] = value;
      }
      stack.pop();
    }
  }
  return rootHolder[""];
};
var serializeBigInts = (text) => {
  return text.replace(
    stringsOrLargeNumbers,
    (match, digits, fractional, exponential) => {
      const isString = match[0] === '"';
      const isNoise = isString && noiseValueWithQuotes.test(match);
      if (isNoise) return match.substring(0, match.length - 1) + 'n"';
      const hasFractionalOrExponential = fractional || exponential;
      const isLessThanMaxSafeInt = digits && (digits.length < MAX_DIGITS || digits.length === MAX_DIGITS && digits <= MAX_INT);
      const isStandardValue = isString || hasFractionalOrExponential || isLessThanMaxSafeInt;
      if (isStandardValue) return match;
      return '"' + match + 'n"';
    }
  );
};
var JSONParse = (text, reviver) => {
  if (!text) return originalParse(text, reviver);
  try {
    if (isContextSourceSupported()) return JSONParseV2(text, reviver);
    const serializedData = serializeBigInts(text);
    return originalParse(
      serializedData,
      (key, value, context) => convertMarkedBigIntsReviver(key, value, context, reviver)
    );
  } catch (error) {
    if (error instanceof RangeError) {
      const serializedData = serializeBigInts(text);
      const parsed = originalParse(serializedData);
      return applyReviverIteratively(parsed, reviver);
    }
    throw error;
  }
};

// node_modules/@octokit/request-error/dist-src/index.js
var RequestError = class extends Error {
  name;
  /**
   * http status code
   */
  status;
  /**
   * Request options that lead to the error.
   */
  request;
  /**
   * Response object if a response was received
   */
  response;
  constructor(message, statusCode, options) {
    super(message, { cause: options.cause });
    this.name = "HttpError";
    this.status = Number.parseInt(statusCode);
    if (Number.isNaN(this.status)) {
      this.status = 0;
    }
    if ("response" in options) {
      this.response = options.response;
    }
    const requestCopy = Object.assign({}, options.request);
    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(
          /(?<! ) .*$/,
          " [REDACTED]"
        )
      });
    }
    requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }
};

// node_modules/@octokit/request/dist-bundle/index.js
var VERSION3 = "10.0.16";
var defaults_default = {
  headers: {
    "user-agent": `octokit-request.js/${VERSION3} ${getUserAgent()}`
  }
};
function isPlainObject2(value) {
  if (typeof value !== "object" || value === null) return false;
  if (Object.prototype.toString.call(value) !== "[object Object]") return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}
var noop = () => "";
async function fetchWrapper(requestOptions) {
  const fetch = requestOptions.request?.fetch || globalThis.fetch;
  if (!fetch) {
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  }
  const log = requestOptions.request?.log || console;
  const parseSuccessResponseBody = requestOptions.request?.parseSuccessResponseBody !== false;
  const body = isPlainObject2(requestOptions.body) || Array.isArray(requestOptions.body) ? JSONStringify(requestOptions.body) : requestOptions.body;
  const requestHeaders = Object.fromEntries(
    Object.entries(requestOptions.headers).map(([name, value]) => [
      name,
      String(value)
    ])
  );
  let fetchResponse;
  try {
    fetchResponse = await fetch(requestOptions.url, {
      method: requestOptions.method,
      body,
      redirect: requestOptions.request?.redirect,
      headers: requestHeaders,
      signal: requestOptions.request?.signal,
      // duplex must be set if request.body is ReadableStream or Async Iterables.
      // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
      ...requestOptions.body && { duplex: "half" }
    });
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        error.status = 500;
        throw error;
      }
      message = error.message;
      if (error.name === "TypeError" && "cause" in error) {
        if (error.cause instanceof Error) {
          message = error.cause.message;
        } else if (typeof error.cause === "string") {
          message = error.cause;
        }
      }
    }
    const requestError = new RequestError(message, 500, {
      request: requestOptions
    });
    requestError.cause = error;
    throw requestError;
  }
  const status = fetchResponse.status;
  const url = fetchResponse.url;
  const responseHeaders = {};
  for (const [key, value] of fetchResponse.headers) {
    responseHeaders[key] = value;
  }
  const octokitResponse = {
    url,
    status,
    headers: responseHeaders,
    data: ""
  };
  if ("deprecation" in responseHeaders) {
    const matches = responseHeaders.link && responseHeaders.link.match(/<([^<>]+)>; rel="deprecation"/);
    const deprecationLink = matches && matches.pop();
    log.warn(
      `[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${responseHeaders.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`
    );
  }
  if (status === 204 || status === 205) {
    return octokitResponse;
  }
  if (requestOptions.method === "HEAD") {
    if (status < 400) {
      return octokitResponse;
    }
    throw new RequestError(fetchResponse.statusText, status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  if (status === 304) {
    octokitResponse.data = await getResponseData(fetchResponse);
    throw new RequestError("Not modified", status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  if (status >= 400) {
    octokitResponse.data = await getResponseData(fetchResponse);
    throw new RequestError(toErrorMessage(octokitResponse.data), status, {
      response: octokitResponse,
      request: requestOptions
    });
  }
  octokitResponse.data = parseSuccessResponseBody ? await getResponseData(fetchResponse) : fetchResponse.body;
  return octokitResponse;
}
async function getResponseData(response) {
  const contentType = response.headers.get("content-type");
  if (!contentType) {
    return response.text().catch(noop);
  }
  const mimetype = parse2(contentType);
  if (isJSONResponse(mimetype)) {
    let text = "";
    try {
      text = await response.text();
      return JSONParse(text);
    } catch (err) {
      return text;
    }
  } else if (mimetype.type.startsWith("text/") || // `application/octet-stream` is the canonical "arbitrary binary" type
  // (RFC 2046) and must never be decoded as text, even when the response
  // carries a (misleading) `charset=utf-8` parameter — see #751.
  mimetype.parameters.charset?.toLowerCase() === "utf-8" && mimetype.type !== "application/octet-stream") {
    return response.text().catch(noop);
  } else {
    return response.arrayBuffer().catch(
      /* v8 ignore next -- @preserve */
      () => new ArrayBuffer(0)
    );
  }
}
function isJSONResponse(mimetype) {
  return mimetype.type === "application/json" || mimetype.type === "application/scim+json";
}
function toErrorMessage(data) {
  if (typeof data === "string") {
    return data;
  }
  if (data instanceof ArrayBuffer) {
    return "Unknown error";
  }
  if (typeof data === "object" && data !== null && "message" in data) {
    const objectData = data;
    const suffix = "documentation_url" in objectData ? ` - ${objectData.documentation_url}` : "";
    return Array.isArray(objectData.errors) ? `${objectData.message}: ${objectData.errors.map((v) => JSON.stringify(v)).join(", ")}${suffix}` : `${objectData.message}${suffix}`;
  }
  return `Unknown error: ${JSON.stringify(data)}`;
}
function withDefaults2(oldEndpoint, newDefaults) {
  const endpoint2 = oldEndpoint.defaults(newDefaults);
  const newApi = function(route, parameters) {
    const endpointOptions = endpoint2.merge(route, parameters);
    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint2.parse(endpointOptions));
    }
    const request2 = (route2, parameters2) => {
      return fetchWrapper(
        endpoint2.parse(endpoint2.merge(route2, parameters2))
      );
    };
    Object.assign(request2, {
      endpoint: endpoint2,
      defaults: withDefaults2.bind(null, endpoint2)
    });
    return endpointOptions.request.hook(request2, endpointOptions);
  };
  return Object.assign(newApi, {
    endpoint: endpoint2,
    defaults: withDefaults2.bind(null, endpoint2)
  });
}
var request = withDefaults2(endpoint, defaults_default);

// node_modules/@octokit/graphql/dist-bundle/index.js
var VERSION4 = "0.0.0-development";
function _buildMessageForResponseErrors(data) {
  return `Request failed due to following response errors:
` + data.errors.map((e) => ` - ${e.message}`).join("\n");
}
var GraphqlResponseError = class extends Error {
  constructor(request2, headers, response) {
    super(_buildMessageForResponseErrors(response));
    this.request = request2;
    this.headers = headers;
    this.response = response;
    this.errors = response.errors;
    this.data = response.data;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  request;
  headers;
  response;
  name = "GraphqlResponseError";
  errors;
  data;
};
var NON_VARIABLE_OPTIONS = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType",
  "operationName"
];
var FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request2, query, options) {
  if (options) {
    if (typeof query === "string" && "query" in options) {
      return Promise.reject(
        new Error(`[@octokit/graphql] "query" cannot be used as variable name`)
      );
    }
    for (const key in options) {
      if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;
      return Promise.reject(
        new Error(
          `[@octokit/graphql] "${key}" cannot be used as variable name`
        )
      );
    }
  }
  const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
  const requestOptions = Object.keys(
    parsedOptions
  ).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }
    if (!result.variables) {
      result.variables = {};
    }
    result.variables[key] = parsedOptions[key];
    return result;
  }, {});
  const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }
  return request2(requestOptions).then((response) => {
    if (response.data.errors) {
      const headers = {};
      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }
      throw new GraphqlResponseError(
        requestOptions,
        headers,
        response.data
      );
    }
    return response.data.data;
  });
}
function withDefaults3(request2, newDefaults) {
  const newRequest = request2.defaults(newDefaults);
  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };
  return Object.assign(newApi, {
    defaults: withDefaults3.bind(null, newRequest),
    endpoint: newRequest.endpoint
  });
}
var graphql2 = withDefaults3(request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION4} ${getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults3(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

// node_modules/@octokit/auth-token/dist-bundle/index.js
var b64url = "(?:[a-zA-Z0-9_-]+)";
var sep = "\\.";
var jwtRE = new RegExp(`^${b64url}${sep}${b64url}${sep}${b64url}$`);
var isJWT = jwtRE.test.bind(jwtRE);
async function auth(token) {
  const isApp = isJWT(token);
  const isInstallation = token.startsWith("v1.") || token.startsWith("ghs_");
  const isUserToServer = token.startsWith("ghu_");
  const tokenType = isApp ? "app" : isInstallation ? "installation" : isUserToServer ? "user-to-server" : "oauth";
  return {
    type: "token",
    token,
    tokenType
  };
}
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }
  return `token ${token}`;
}
async function hook(token, request2, route, parameters) {
  const endpoint2 = request2.endpoint.merge(
    route,
    parameters
  );
  endpoint2.headers.authorization = withAuthorizationPrefix(token);
  return request2(endpoint2);
}
var createTokenAuth = function createTokenAuth2(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }
  if (typeof token !== "string") {
    throw new Error(
      "[@octokit/auth-token] Token passed to createTokenAuth is not a string"
    );
  }
  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

// node_modules/@octokit/core/dist-src/version.js
var VERSION5 = "7.0.8";

// node_modules/@octokit/core/dist-src/index.js
var noop2 = () => {
};
var consoleWarn = console.warn.bind(console);
var consoleError = console.error.bind(console);
function createLogger(logger = {}) {
  if (typeof logger.debug !== "function") {
    logger.debug = noop2;
  }
  if (typeof logger.info !== "function") {
    logger.info = noop2;
  }
  if (typeof logger.warn !== "function") {
    logger.warn = consoleWarn;
  }
  if (typeof logger.error !== "function") {
    logger.error = consoleError;
  }
  return logger;
}
var userAgentTrail = `octokit-core.js/${VERSION5} ${getUserAgent()}`;
var Octokit = class {
  static VERSION = VERSION5;
  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};
        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }
        super(
          Object.assign(
            {},
            defaults,
            options,
            options.userAgent && defaults.userAgent ? {
              userAgent: `${options.userAgent} ${defaults.userAgent}`
            } : null
          )
        );
      }
    };
    return OctokitWithDefaults;
  }
  static plugins = [];
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */
  static plugin(...newPlugins) {
    const currentPlugins = this.plugins;
    const NewOctokit = class extends this {
      static plugins = currentPlugins.concat(
        newPlugins.filter((plugin) => !currentPlugins.includes(plugin))
      );
    };
    return NewOctokit;
  }
  constructor(options = {}) {
    const hook2 = new before_after_hook_default.Collection();
    const requestDefaults = {
      baseUrl: request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        // @ts-ignore internal usage only, no need to type
        hook: hook2.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    };
    requestDefaults.headers["user-agent"] = options.userAgent ? `${options.userAgent} ${userAgentTrail}` : userAgentTrail;
    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }
    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }
    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }
    this.request = request.defaults(requestDefaults);
    this.graphql = withCustomRequest(this.request).defaults(requestDefaults);
    this.log = createLogger(options.log);
    this.hook = hook2;
    if (!options.authStrategy) {
      if (!options.auth) {
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        const auth2 = createTokenAuth(options.auth);
        hook2.wrap("request", auth2.hook);
        this.auth = auth2;
      }
    } else {
      const { authStrategy, ...otherOptions } = options;
      const auth2 = authStrategy(
        Object.assign(
          {
            request: this.request,
            log: this.log,
            // we pass the current octokit instance as well as its constructor options
            // to allow for authentication strategies that return a new octokit instance
            // that shares the same internal state as the current one. The original
            // requirement for this was the "event-octokit" authentication strategy
            // of https://github.com/probot/octokit-auth-probot.
            octokit: this,
            octokitOptions: otherOptions
          },
          options.auth
        )
      );
      hook2.wrap("request", auth2.hook);
      this.auth = auth2;
    }
    const classConstructor = this.constructor;
    for (let i = 0; i < classConstructor.plugins.length; ++i) {
      Object.assign(this, classConstructor.plugins[i](this, options));
    }
  }
  // assigned during constructor
  request;
  graphql;
  log;
  hook;
  // TODO: type `octokit.auth` based on passed options.authStrategy
  auth;
};

// node_modules/@octokit/plugin-request-log/dist-src/version.js
var VERSION6 = "6.0.0";

// node_modules/@octokit/plugin-request-log/dist-src/index.js
function requestLog(octokit) {
  octokit.hook.wrap("request", (request2, options) => {
    octokit.log.debug("request", options);
    const start = Date.now();
    const requestOptions = octokit.request.endpoint.parse(options);
    const path4 = requestOptions.url.replace(options.baseUrl, "");
    return request2(options).then((response) => {
      const requestId = response.headers["x-github-request-id"];
      octokit.log.info(
        `${requestOptions.method} ${path4} - ${response.status} with id ${requestId} in ${Date.now() - start}ms`
      );
      return response;
    }).catch((error) => {
      const requestId = error.response?.headers["x-github-request-id"] || "UNKNOWN";
      octokit.log.error(
        `${requestOptions.method} ${path4} - ${error.status} with id ${requestId} in ${Date.now() - start}ms`
      );
      throw error;
    });
  });
}
requestLog.VERSION = VERSION6;

// node_modules/@octokit/plugin-paginate-rest/dist-bundle/index.js
var VERSION7 = "0.0.0-development";
function normalizePaginatedListResponse(response) {
  if (!response.data) {
    return {
      ...response,
      data: []
    };
  }
  const responseNeedsNormalization = ("total_count" in response.data || "total_commits" in response.data) && !("url" in response.data);
  if (!responseNeedsNormalization) return response;
  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  const totalCommits = response.data.total_commits;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  delete response.data.total_commits;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;
  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }
  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }
  response.data.total_count = totalCount;
  response.data.total_commits = totalCommits;
  return response;
}
function iterator(octokit, route, parameters) {
  const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!url) return { done: true };
        try {
          const response = await requestMethod({ method, url, headers });
          const normalizedResponse = normalizePaginatedListResponse(response);
          url = ((normalizedResponse.headers.link || "").match(
            /<([^<>]+)>;\s*rel="next"/
          ) || [])[1];
          if (!url && "total_commits" in normalizedResponse.data) {
            const parsedUrl = new URL(normalizedResponse.url);
            const params = parsedUrl.searchParams;
            const page = parseInt(params.get("page") || "1", 10);
            const per_page = parseInt(params.get("per_page") || "250", 10);
            if (page * per_page < normalizedResponse.data.total_commits) {
              params.set("page", String(page + 1));
              url = parsedUrl.toString();
            }
          }
          return { value: normalizedResponse };
        } catch (error) {
          if (error.status !== 409) throw error;
          url = "";
          return {
            value: {
              status: 200,
              headers: {},
              data: []
            }
          };
        }
      }
    })
  };
}
function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = void 0;
  }
  return gather(
    octokit,
    [],
    iterator(octokit, route, parameters)[Symbol.asyncIterator](),
    mapFn
  );
}
function gather(octokit, results, iterator2, mapFn) {
  return iterator2.next().then((result) => {
    if (result.done) {
      return results;
    }
    let earlyExit = false;
    function done() {
      earlyExit = true;
    }
    results = results.concat(
      mapFn ? mapFn(result.value, done) : result.value.data
    );
    if (earlyExit) {
      return results;
    }
    return gather(octokit, results, iterator2, mapFn);
  });
}
var composePaginateRest = Object.assign(paginate, {
  iterator
});
function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION7;

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/version.js
var VERSION8 = "17.0.0";

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/generated/endpoints.js
var Endpoints = {
  actions: {
    addCustomLabelsToSelfHostedRunnerForOrg: [
      "POST /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    addCustomLabelsToSelfHostedRunnerForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    addRepoAccessToSelfHostedRunnerGroupInOrg: [
      "PUT /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    approveWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"
    ],
    cancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"
    ],
    createEnvironmentVariable: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    createHostedRunnerForOrg: ["POST /orgs/{org}/actions/hosted-runners"],
    createOrUpdateEnvironmentSecret: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    createOrgVariable: ["POST /orgs/{org}/actions/variables"],
    createRegistrationTokenForOrg: [
      "POST /orgs/{org}/actions/runners/registration-token"
    ],
    createRegistrationTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/registration-token"
    ],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/remove-token"
    ],
    createRepoVariable: ["POST /repos/{owner}/{repo}/actions/variables"],
    createWorkflowDispatch: [
      "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
    ],
    deleteActionsCacheById: [
      "DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"
    ],
    deleteActionsCacheByKey: [
      "DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"
    ],
    deleteArtifact: [
      "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"
    ],
    deleteCustomImageFromOrg: [
      "DELETE /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}"
    ],
    deleteCustomImageVersionFromOrg: [
      "DELETE /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions/{version}"
    ],
    deleteEnvironmentSecret: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    deleteEnvironmentVariable: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    deleteHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteOrgVariable: ["DELETE /orgs/{org}/actions/variables/{name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    deleteRepoVariable: [
      "DELETE /repos/{owner}/{repo}/actions/variables/{name}"
    ],
    deleteSelfHostedRunnerFromOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}"
    ],
    deleteSelfHostedRunnerFromRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: [
      "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    disableSelectedRepositoryGithubActionsOrganization: [
      "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    disableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"
    ],
    downloadArtifact: [
      "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"
    ],
    downloadJobLogsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"
    ],
    downloadWorkflowRunAttemptLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"
    ],
    downloadWorkflowRunLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    enableSelectedRepositoryGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    enableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"
    ],
    forceCancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"
    ],
    generateRunnerJitconfigForOrg: [
      "POST /orgs/{org}/actions/runners/generate-jitconfig"
    ],
    generateRunnerJitconfigForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"
    ],
    getActionsCacheList: ["GET /repos/{owner}/{repo}/actions/caches"],
    getActionsCacheUsage: ["GET /repos/{owner}/{repo}/actions/cache/usage"],
    getActionsCacheUsageByRepoForOrg: [
      "GET /orgs/{org}/actions/cache/usage-by-repository"
    ],
    getActionsCacheUsageForOrg: ["GET /orgs/{org}/actions/cache/usage"],
    getAllowedActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/selected-actions"
    ],
    getAllowedActionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getCustomImageForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}"
    ],
    getCustomImageVersionForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions/{version}"
    ],
    getCustomOidcSubClaimForRepo: [
      "GET /repos/{owner}/{repo}/actions/oidc/customization/sub"
    ],
    getEnvironmentPublicKey: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key"
    ],
    getEnvironmentSecret: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    getEnvironmentVariable: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    getGithubActionsDefaultWorkflowPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions/workflow"
    ],
    getGithubActionsDefaultWorkflowPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    getGithubActionsPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions"
    ],
    getGithubActionsPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions"
    ],
    getHostedRunnerForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    getHostedRunnersGithubOwnedImagesForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/github-owned"
    ],
    getHostedRunnersLimitsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/limits"
    ],
    getHostedRunnersMachineSpecsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/machine-sizes"
    ],
    getHostedRunnersPartnerImagesForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/partner"
    ],
    getHostedRunnersPlatformsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/platforms"
    ],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getOrgVariable: ["GET /orgs/{org}/actions/variables/{name}"],
    getPendingDeploymentsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    getRepoPermissions: [
      "GET /repos/{owner}/{repo}/actions/permissions",
      {},
      { renamed: ["actions", "getGithubActionsPermissionsRepository"] }
    ],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getRepoVariable: ["GET /repos/{owner}/{repo}/actions/variables/{name}"],
    getReviewsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"
    ],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowAccessToRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/access"
    ],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"
    ],
    getWorkflowRunUsage: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"
    ],
    getWorkflowUsage: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"
    ],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listCustomImageVersionsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions"
    ],
    listCustomImagesForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/custom"
    ],
    listEnvironmentSecrets: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets"
    ],
    listEnvironmentVariables: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    listGithubHostedRunnersInGroupForOrg: [
      "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/hosted-runners"
    ],
    listHostedRunnersForOrg: ["GET /orgs/{org}/actions/hosted-runners"],
    listJobsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"
    ],
    listJobsForWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"
    ],
    listLabelsForSelfHostedRunnerForOrg: [
      "GET /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    listLabelsForSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listOrgVariables: ["GET /orgs/{org}/actions/variables"],
    listRepoOrganizationSecrets: [
      "GET /repos/{owner}/{repo}/actions/organization-secrets"
    ],
    listRepoOrganizationVariables: [
      "GET /repos/{owner}/{repo}/actions/organization-variables"
    ],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoVariables: ["GET /repos/{owner}/{repo}/actions/variables"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/downloads"
    ],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    listSelectedReposForOrgVariable: [
      "GET /orgs/{org}/actions/variables/{name}/repositories"
    ],
    listSelectedRepositoriesEnabledGithubActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/repositories"
    ],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
    ],
    listWorkflowRuns: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"
    ],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunJobForWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"
    ],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    reRunWorkflowFailedJobs: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    removeCustomLabelFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeCustomLabelFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgVariable: [
      "DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    reviewCustomGatesForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"
    ],
    reviewPendingDeploymentsForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    setAllowedActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/selected-actions"
    ],
    setAllowedActionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    setCustomLabelsForSelfHostedRunnerForOrg: [
      "PUT /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    setCustomLabelsForSelfHostedRunnerForRepo: [
      "PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    setCustomOidcSubClaimForRepo: [
      "PUT /repos/{owner}/{repo}/actions/oidc/customization/sub"
    ],
    setGithubActionsDefaultWorkflowPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/workflow"
    ],
    setGithubActionsDefaultWorkflowPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    setGithubActionsPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions"
    ],
    setGithubActionsPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories"
    ],
    setSelectedRepositoriesEnabledGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories"
    ],
    setWorkflowAccessToRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/access"
    ],
    updateEnvironmentVariable: [
      "PATCH /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    updateHostedRunnerForOrg: [
      "PATCH /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    updateOrgVariable: ["PATCH /orgs/{org}/actions/variables/{name}"],
    updateRepoVariable: [
      "PATCH /repos/{owner}/{repo}/actions/variables/{name}"
    ]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: [
      "DELETE /notifications/threads/{thread_id}/subscription"
    ],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: [
      "GET /notifications/threads/{thread_id}/subscription"
    ],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: [
      "GET /users/{username}/events/orgs/{org}"
    ],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: [
      "GET /users/{username}/received_events/public"
    ],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/notifications"
    ],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsDone: ["DELETE /notifications/threads/{thread_id}"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: [
      "PUT /notifications/threads/{thread_id}/subscription"
    ],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "addRepoToInstallationForAuthenticatedUser"] }
    ],
    addRepoToInstallationForAuthenticatedUser: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    checkToken: ["POST /applications/{client_id}/token"],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: [
      "POST /app/installations/{installation_id}/access_tokens"
    ],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: [
      "GET /marketplace_listing/accounts/{account_id}"
    ],
    getSubscriptionPlanForAccountStubbed: [
      "GET /marketplace_listing/stubbed/accounts/{account_id}"
    ],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    getWebhookDelivery: ["GET /app/hook/deliveries/{delivery_id}"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: [
      "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"
    ],
    listInstallationReposForAuthenticatedUser: [
      "GET /user/installations/{installation_id}/repositories"
    ],
    listInstallationRequestsForAuthenticatedApp: [
      "GET /app/installation-requests"
    ],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: [
      "GET /user/marketplace_purchases/stubbed"
    ],
    listWebhookDeliveries: ["GET /app/hook/deliveries"],
    redeliverWebhookDelivery: [
      "POST /app/hook/deliveries/{delivery_id}/attempts"
    ],
    removeRepoFromInstallation: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "removeRepoFromInstallationForAuthenticatedUser"] }
    ],
    removeRepoFromInstallationForAuthenticatedUser: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: [
      "DELETE /app/installations/{installation_id}/suspended"
    ],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: [
      "GET /users/{username}/settings/billing/actions"
    ],
    getGithubBillingPremiumRequestUsageReportOrg: [
      "GET /organizations/{org}/settings/billing/premium_request/usage"
    ],
    getGithubBillingPremiumRequestUsageReportUser: [
      "GET /users/{username}/settings/billing/premium_request/usage"
    ],
    getGithubBillingUsageReportOrg: [
      "GET /organizations/{org}/settings/billing/usage"
    ],
    getGithubBillingUsageReportUser: [
      "GET /users/{username}/settings/billing/usage"
    ],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: [
      "GET /users/{username}/settings/billing/packages"
    ],
    getSharedStorageBillingOrg: [
      "GET /orgs/{org}/settings/billing/shared-storage"
    ],
    getSharedStorageBillingUser: [
      "GET /users/{username}/settings/billing/shared-storage"
    ]
  },
  campaigns: {
    createCampaign: ["POST /orgs/{org}/campaigns"],
    deleteCampaign: ["DELETE /orgs/{org}/campaigns/{campaign_number}"],
    getCampaignSummary: ["GET /orgs/{org}/campaigns/{campaign_number}"],
    listOrgCampaigns: ["GET /orgs/{org}/campaigns"],
    updateCampaign: ["PATCH /orgs/{org}/campaigns/{campaign_number}"]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: [
      "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"
    ],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: [
      "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"
    ],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestRun: [
      "POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"
    ],
    rerequestSuite: [
      "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"
    ],
    setSuitesPreferences: [
      "PATCH /repos/{owner}/{repo}/check-suites/preferences"
    ],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    commitAutofix: [
      "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix/commits"
    ],
    createAutofix: [
      "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
    ],
    createVariantAnalysis: [
      "POST /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses"
    ],
    deleteAnalysis: [
      "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"
    ],
    deleteCodeqlDatabase: [
      "DELETE /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
      {},
      { renamedParameters: { alert_id: "alert_number" } }
    ],
    getAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"
    ],
    getAutofix: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
    ],
    getCodeqlDatabase: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getDefaultSetup: ["GET /repos/{owner}/{repo}/code-scanning/default-setup"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    getVariantAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}"
    ],
    getVariantAnalysisRepoTask: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}"
    ],
    listAlertInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/code-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
      {},
      { renamed: ["codeScanning", "listAlertInstances"] }
    ],
    listCodeqlDatabases: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases"
    ],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"
    ],
    updateDefaultSetup: [
      "PATCH /repos/{owner}/{repo}/code-scanning/default-setup"
    ],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codeSecurity: {
    attachConfiguration: [
      "POST /orgs/{org}/code-security/configurations/{configuration_id}/attach"
    ],
    attachEnterpriseConfiguration: [
      "POST /enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach"
    ],
    createConfiguration: ["POST /orgs/{org}/code-security/configurations"],
    createConfigurationForEnterprise: [
      "POST /enterprises/{enterprise}/code-security/configurations"
    ],
    deleteConfiguration: [
      "DELETE /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    deleteConfigurationForEnterprise: [
      "DELETE /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    detachConfiguration: [
      "DELETE /orgs/{org}/code-security/configurations/detach"
    ],
    getConfiguration: [
      "GET /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    getConfigurationForRepository: [
      "GET /repos/{owner}/{repo}/code-security-configuration"
    ],
    getConfigurationsForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations"
    ],
    getConfigurationsForOrg: ["GET /orgs/{org}/code-security/configurations"],
    getDefaultConfigurations: [
      "GET /orgs/{org}/code-security/configurations/defaults"
    ],
    getDefaultConfigurationsForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/defaults"
    ],
    getRepositoriesForConfiguration: [
      "GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories"
    ],
    getRepositoriesForEnterpriseConfiguration: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories"
    ],
    getSingleConfigurationForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    setConfigurationAsDefault: [
      "PUT /orgs/{org}/code-security/configurations/{configuration_id}/defaults"
    ],
    setConfigurationAsDefaultForEnterprise: [
      "PUT /enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults"
    ],
    updateConfiguration: [
      "PATCH /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    updateEnterpriseConfiguration: [
      "PATCH /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct"],
    getConductCode: ["GET /codes_of_conduct/{key}"]
  },
  codespaces: {
    addRepositoryForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    checkPermissionsForDevcontainer: [
      "GET /repos/{owner}/{repo}/codespaces/permissions_check"
    ],
    codespaceMachinesForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/machines"
    ],
    createForAuthenticatedUser: ["POST /user/codespaces"],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}"
    ],
    createWithPrForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"
    ],
    createWithRepoForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/codespaces"
    ],
    deleteForAuthenticatedUser: ["DELETE /user/codespaces/{codespace_name}"],
    deleteFromOrganization: [
      "DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    deleteSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}"
    ],
    exportForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/exports"
    ],
    getCodespacesForUserInOrg: [
      "GET /orgs/{org}/members/{username}/codespaces"
    ],
    getExportDetailsForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/exports/{export_id}"
    ],
    getForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/codespaces/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/codespaces/secrets/{secret_name}"],
    getPublicKeyForAuthenticatedUser: [
      "GET /user/codespaces/secrets/public-key"
    ],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    getSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}"
    ],
    listDevcontainersInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/devcontainers"
    ],
    listForAuthenticatedUser: ["GET /user/codespaces"],
    listInOrganization: [
      "GET /orgs/{org}/codespaces",
      {},
      { renamedParameters: { org_id: "org" } }
    ],
    listInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces"
    ],
    listOrgSecrets: ["GET /orgs/{org}/codespaces/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/codespaces/secrets"],
    listRepositoriesForSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}/repositories"
    ],
    listSecretsForAuthenticatedUser: ["GET /user/codespaces/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    preFlightWithRepoForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/new"
    ],
    publishForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/publish"
    ],
    removeRepositoryForSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    repoMachinesForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/machines"
    ],
    setRepositoriesForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    startForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/start"],
    stopForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/stop"],
    stopInOrganization: [
      "POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"
    ],
    updateForAuthenticatedUser: ["PATCH /user/codespaces/{codespace_name}"]
  },
  copilot: {
    addCopilotSeatsForTeams: [
      "POST /orgs/{org}/copilot/billing/selected_teams"
    ],
    addCopilotSeatsForUsers: [
      "POST /orgs/{org}/copilot/billing/selected_users"
    ],
    cancelCopilotSeatAssignmentForTeams: [
      "DELETE /orgs/{org}/copilot/billing/selected_teams"
    ],
    cancelCopilotSeatAssignmentForUsers: [
      "DELETE /orgs/{org}/copilot/billing/selected_users"
    ],
    copilotMetricsForOrganization: ["GET /orgs/{org}/copilot/metrics"],
    copilotMetricsForTeam: ["GET /orgs/{org}/team/{team_slug}/copilot/metrics"],
    getCopilotOrganizationDetails: ["GET /orgs/{org}/copilot/billing"],
    getCopilotSeatDetailsForUser: [
      "GET /orgs/{org}/members/{username}/copilot"
    ],
    listCopilotSeats: ["GET /orgs/{org}/copilot/billing/seats"]
  },
  credentials: { revoke: ["POST /credentials/revoke"] },
  dependabot: {
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    getAlert: ["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],
    getOrgPublicKey: ["GET /orgs/{org}/dependabot/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}"],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/dependabot/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/dependabot/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/dependabot/alerts"],
    listOrgSecrets: ["GET /orgs/{org}/dependabot/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/dependabot/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    repositoryAccessForOrg: [
      "GET /organizations/{org}/dependabot/repository-access"
    ],
    setRepositoryAccessDefaultLevel: [
      "PUT /organizations/{org}/dependabot/repository-access/default-level"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"
    ],
    updateRepositoryAccessForOrg: [
      "PATCH /organizations/{org}/dependabot/repository-access"
    ]
  },
  dependencyGraph: {
    createRepositorySnapshot: [
      "POST /repos/{owner}/{repo}/dependency-graph/snapshots"
    ],
    diffRange: [
      "GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"
    ],
    exportSbom: ["GET /repos/{owner}/{repo}/dependency-graph/sbom"]
  },
  emojis: { get: ["GET /emojis"] },
  enterpriseTeamMemberships: {
    add: [
      "PUT /enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}"
    ],
    bulkAdd: [
      "POST /enterprises/{enterprise}/teams/{enterprise-team}/memberships/add"
    ],
    bulkRemove: [
      "POST /enterprises/{enterprise}/teams/{enterprise-team}/memberships/remove"
    ],
    get: [
      "GET /enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}"
    ],
    list: ["GET /enterprises/{enterprise}/teams/{enterprise-team}/memberships"],
    remove: [
      "DELETE /enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}"
    ]
  },
  enterpriseTeamOrganizations: {
    add: [
      "PUT /enterprises/{enterprise}/teams/{enterprise-team}/organizations/{org}"
    ],
    bulkAdd: [
      "POST /enterprises/{enterprise}/teams/{enterprise-team}/organizations/add"
    ],
    bulkRemove: [
      "POST /enterprises/{enterprise}/teams/{enterprise-team}/organizations/remove"
    ],
    delete: [
      "DELETE /enterprises/{enterprise}/teams/{enterprise-team}/organizations/{org}"
    ],
    getAssignment: [
      "GET /enterprises/{enterprise}/teams/{enterprise-team}/organizations/{org}"
    ],
    getAssignments: [
      "GET /enterprises/{enterprise}/teams/{enterprise-team}/organizations"
    ]
  },
  enterpriseTeams: {
    create: ["POST /enterprises/{enterprise}/teams"],
    delete: ["DELETE /enterprises/{enterprise}/teams/{team_slug}"],
    get: ["GET /enterprises/{enterprise}/teams/{team_slug}"],
    list: ["GET /enterprises/{enterprise}/teams"],
    update: ["PATCH /enterprises/{enterprise}/teams/{team_slug}"]
  },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  hostedCompute: {
    createNetworkConfigurationForOrg: [
      "POST /orgs/{org}/settings/network-configurations"
    ],
    deleteNetworkConfigurationFromOrg: [
      "DELETE /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ],
    getNetworkConfigurationForOrg: [
      "GET /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ],
    getNetworkSettingsForOrg: [
      "GET /orgs/{org}/settings/network-settings/{network_settings_id}"
    ],
    listNetworkConfigurationsForOrg: [
      "GET /orgs/{org}/settings/network-configurations"
    ],
    updateNetworkConfigurationForOrg: [
      "PATCH /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: [
      "GET /user/interaction-limits",
      {},
      { renamed: ["interactions", "getRestrictionsForAuthenticatedUser"] }
    ],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: [
      "DELETE /repos/{owner}/{repo}/interaction-limits"
    ],
    removeRestrictionsForYourPublicRepos: [
      "DELETE /user/interaction-limits",
      {},
      { renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"] }
    ],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: [
      "PUT /user/interaction-limits",
      {},
      { renamed: ["interactions", "setRestrictionsForAuthenticatedUser"] }
    ]
  },
  issues: {
    addAssignees: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    addBlockedByDependency: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by"
    ],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    addSubIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
    ],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    checkUserCanBeAssignedToIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"
    ],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments"
    ],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"
    ],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: [
      "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"
    ],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    getParent: ["GET /repos/{owner}/{repo}/issues/{issue_number}/parent"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listDependenciesBlockedBy: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by"
    ],
    listDependenciesBlocking: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocking"
    ],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"
    ],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: [
      "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"
    ],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    listSubIssues: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
    ],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    removeAssignees: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    removeDependencyBlockedBy: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by/{issue_id}"
    ],
    removeLabel: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"
    ],
    removeSubIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/sub_issue"
    ],
    reprioritizeSubIssue: [
      "PATCH /repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority"
    ],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: [
      "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"
    ]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: [
      "POST /markdown/raw",
      { headers: { "content-type": "text/plain; charset=utf-8" } }
    ]
  },
  meta: {
    get: ["GET /meta"],
    getAllVersions: ["GET /versions"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    deleteArchiveForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/archive"
    ],
    deleteArchiveForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/archive"
    ],
    downloadArchiveForOrg: [
      "GET /orgs/{org}/migrations/{migration_id}/archive"
    ],
    getArchiveForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/archive"
    ],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}"],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}"],
    listForAuthenticatedUser: ["GET /user/migrations"],
    listForOrg: ["GET /orgs/{org}/migrations"],
    listReposForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/repositories"
    ],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories"],
    listReposForUser: [
      "GET /user/migrations/{migration_id}/repositories",
      {},
      { renamed: ["migrations", "listReposForAuthenticatedUser"] }
    ],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    unlockRepoForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"
    ],
    unlockRepoForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"
    ]
  },
  oidc: {
    getOidcCustomSubTemplateForOrg: [
      "GET /orgs/{org}/actions/oidc/customization/sub"
    ],
    updateOidcCustomSubTemplateForOrg: [
      "PUT /orgs/{org}/actions/oidc/customization/sub"
    ]
  },
  orgs: {
    addSecurityManagerTeam: [
      "PUT /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated: "octokit.rest.orgs.addSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#add-a-security-manager-team"
      }
    ],
    assignTeamToOrgRole: [
      "PUT /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
    ],
    assignUserToOrgRole: [
      "PUT /orgs/{org}/organization-roles/users/{username}/{role_id}"
    ],
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: [
      "PUT /orgs/{org}/outside_collaborators/{username}"
    ],
    createArtifactStorageRecord: [
      "POST /orgs/{org}/artifacts/metadata/storage-record"
    ],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createIssueType: ["POST /orgs/{org}/issue-types"],
    createWebhook: ["POST /orgs/{org}/hooks"],
    customPropertiesForOrgsCreateOrUpdateOrganizationValues: [
      "PATCH /organizations/{org}/org-properties/values"
    ],
    customPropertiesForOrgsGetOrganizationValues: [
      "GET /organizations/{org}/org-properties/values"
    ],
    customPropertiesForReposCreateOrUpdateOrganizationDefinition: [
      "PUT /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    customPropertiesForReposCreateOrUpdateOrganizationDefinitions: [
      "PATCH /orgs/{org}/properties/schema"
    ],
    customPropertiesForReposCreateOrUpdateOrganizationValues: [
      "PATCH /orgs/{org}/properties/values"
    ],
    customPropertiesForReposDeleteOrganizationDefinition: [
      "DELETE /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    customPropertiesForReposGetOrganizationDefinition: [
      "GET /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    customPropertiesForReposGetOrganizationDefinitions: [
      "GET /orgs/{org}/properties/schema"
    ],
    customPropertiesForReposGetOrganizationValues: [
      "GET /orgs/{org}/properties/values"
    ],
    delete: ["DELETE /orgs/{org}"],
    deleteAttestationsBulk: ["POST /orgs/{org}/attestations/delete-request"],
    deleteAttestationsById: [
      "DELETE /orgs/{org}/attestations/{attestation_id}"
    ],
    deleteAttestationsBySubjectDigest: [
      "DELETE /orgs/{org}/attestations/digest/{subject_digest}"
    ],
    deleteIssueType: ["DELETE /orgs/{org}/issue-types/{issue_type_id}"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    disableSelectedRepositoryImmutableReleasesOrganization: [
      "DELETE /orgs/{org}/settings/immutable-releases/repositories/{repository_id}"
    ],
    enableSelectedRepositoryImmutableReleasesOrganization: [
      "PUT /orgs/{org}/settings/immutable-releases/repositories/{repository_id}"
    ],
    get: ["GET /orgs/{org}"],
    getImmutableReleasesSettings: [
      "GET /orgs/{org}/settings/immutable-releases"
    ],
    getImmutableReleasesSettingsRepositories: [
      "GET /orgs/{org}/settings/immutable-releases/repositories"
    ],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getOrgRole: ["GET /orgs/{org}/organization-roles/{role_id}"],
    getOrgRulesetHistory: ["GET /orgs/{org}/rulesets/{ruleset_id}/history"],
    getOrgRulesetVersion: [
      "GET /orgs/{org}/rulesets/{ruleset_id}/history/{version_id}"
    ],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    getWebhookDelivery: [
      "GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listArtifactStorageRecords: [
      "GET /orgs/{org}/artifacts/{subject_digest}/metadata/storage-records"
    ],
    listAttestationRepositories: ["GET /orgs/{org}/attestations/repositories"],
    listAttestations: ["GET /orgs/{org}/attestations/{subject_digest}"],
    listAttestationsBulk: [
      "POST /orgs/{org}/attestations/bulk-list{?per_page,before,after}"
    ],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listIssueTypes: ["GET /orgs/{org}/issue-types"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOrgRoleTeams: ["GET /orgs/{org}/organization-roles/{role_id}/teams"],
    listOrgRoleUsers: ["GET /orgs/{org}/organization-roles/{role_id}/users"],
    listOrgRoles: ["GET /orgs/{org}/organization-roles"],
    listOrganizationFineGrainedPermissions: [
      "GET /orgs/{org}/organization-fine-grained-permissions"
    ],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPatGrantRepositories: [
      "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"
    ],
    listPatGrantRequestRepositories: [
      "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"
    ],
    listPatGrantRequests: ["GET /orgs/{org}/personal-access-token-requests"],
    listPatGrants: ["GET /orgs/{org}/personal-access-tokens"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listSecurityManagerTeams: [
      "GET /orgs/{org}/security-managers",
      {},
      {
        deprecated: "octokit.rest.orgs.listSecurityManagerTeams() is deprecated, see https://docs.github.com/rest/orgs/security-managers#list-security-manager-teams"
      }
    ],
    listWebhookDeliveries: ["GET /orgs/{org}/hooks/{hook_id}/deliveries"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: [
      "DELETE /orgs/{org}/outside_collaborators/{username}"
    ],
    removePublicMembershipForAuthenticatedUser: [
      "DELETE /orgs/{org}/public_members/{username}"
    ],
    removeSecurityManagerTeam: [
      "DELETE /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated: "octokit.rest.orgs.removeSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#remove-a-security-manager-team"
      }
    ],
    reviewPatGrantRequest: [
      "POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"
    ],
    reviewPatGrantRequestsInBulk: [
      "POST /orgs/{org}/personal-access-token-requests"
    ],
    revokeAllOrgRolesTeam: [
      "DELETE /orgs/{org}/organization-roles/teams/{team_slug}"
    ],
    revokeAllOrgRolesUser: [
      "DELETE /orgs/{org}/organization-roles/users/{username}"
    ],
    revokeOrgRoleTeam: [
      "DELETE /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
    ],
    revokeOrgRoleUser: [
      "DELETE /orgs/{org}/organization-roles/users/{username}/{role_id}"
    ],
    setImmutableReleasesSettings: [
      "PUT /orgs/{org}/settings/immutable-releases"
    ],
    setImmutableReleasesSettingsRepositories: [
      "PUT /orgs/{org}/settings/immutable-releases/repositories"
    ],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: [
      "PUT /orgs/{org}/public_members/{username}"
    ],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateIssueType: ["PUT /orgs/{org}/issue-types/{issue_type_id}"],
    updateMembershipForAuthenticatedUser: [
      "PATCH /user/memberships/orgs/{org}"
    ],
    updatePatAccess: ["POST /orgs/{org}/personal-access-tokens/{pat_id}"],
    updatePatAccesses: ["POST /orgs/{org}/personal-access-tokens"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}"
    ],
    deletePackageForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    deletePackageForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}"
    ],
    deletePackageVersionForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getAllPackageVersionsForAPackageOwnedByAnOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
      {},
      { renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"] }
    ],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions",
      {},
      {
        renamed: [
          "packages",
          "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"
        ]
      }
    ],
    getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions"
    ],
    getPackageForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}"
    ],
    getPackageForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    getPackageForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}"
    ],
    getPackageVersionForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    listDockerMigrationConflictingPackagesForAuthenticatedUser: [
      "GET /user/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForOrganization: [
      "GET /orgs/{org}/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForUser: [
      "GET /users/{username}/docker/conflicts"
    ],
    listPackagesForAuthenticatedUser: ["GET /user/packages"],
    listPackagesForOrganization: ["GET /orgs/{org}/packages"],
    listPackagesForUser: ["GET /users/{username}/packages"],
    restorePackageForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageVersionForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ]
  },
  privateRegistries: {
    createOrgPrivateRegistry: ["POST /orgs/{org}/private-registries"],
    deleteOrgPrivateRegistry: [
      "DELETE /orgs/{org}/private-registries/{secret_name}"
    ],
    getOrgPrivateRegistry: ["GET /orgs/{org}/private-registries/{secret_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/private-registries/public-key"],
    listOrgPrivateRegistries: ["GET /orgs/{org}/private-registries"],
    updateOrgPrivateRegistry: [
      "PATCH /orgs/{org}/private-registries/{secret_name}"
    ]
  },
  projects: {
    addItemForOrg: ["POST /orgs/{org}/projectsV2/{project_number}/items"],
    addItemForUser: [
      "POST /users/{username}/projectsV2/{project_number}/items"
    ],
    deleteItemForOrg: [
      "DELETE /orgs/{org}/projectsV2/{project_number}/items/{item_id}"
    ],
    deleteItemForUser: [
      "DELETE /users/{username}/projectsV2/{project_number}/items/{item_id}"
    ],
    getFieldForOrg: [
      "GET /orgs/{org}/projectsV2/{project_number}/fields/{field_id}"
    ],
    getFieldForUser: [
      "GET /users/{username}/projectsV2/{project_number}/fields/{field_id}"
    ],
    getForOrg: ["GET /orgs/{org}/projectsV2/{project_number}"],
    getForUser: ["GET /users/{username}/projectsV2/{project_number}"],
    getOrgItem: ["GET /orgs/{org}/projectsV2/{project_number}/items/{item_id}"],
    getUserItem: [
      "GET /users/{username}/projectsV2/{project_number}/items/{item_id}"
    ],
    listFieldsForOrg: ["GET /orgs/{org}/projectsV2/{project_number}/fields"],
    listFieldsForUser: [
      "GET /users/{username}/projectsV2/{project_number}/fields"
    ],
    listForOrg: ["GET /orgs/{org}/projectsV2"],
    listForUser: ["GET /users/{username}/projectsV2"],
    listItemsForOrg: ["GET /orgs/{org}/projectsV2/{project_number}/items"],
    listItemsForUser: [
      "GET /users/{username}/projectsV2/{project_number}/items"
    ],
    updateItemForOrg: [
      "PATCH /orgs/{org}/projectsV2/{project_number}/items/{item_id}"
    ],
    updateItemForUser: [
      "PATCH /users/{username}/projectsV2/{project_number}/items/{item_id}"
    ]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"
    ],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    deletePendingReview: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    deleteReviewComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ],
    dismissReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"
    ],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    listReviewComments: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    requestReviewers: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    submitReview: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"
    ],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"
    ],
    updateReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    updateReviewComment: [
      "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ]
  },
  rateLimit: { get: ["GET /rate_limit"] },
  reactions: {
    createForCommitComment: [
      "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    createForIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"
    ],
    createForIssueComment: [
      "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    createForPullRequestReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    createForRelease: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    createForTeamDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    createForTeamDiscussionInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ],
    deleteForCommitComment: [
      "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"
    ],
    deleteForIssueComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForPullRequestComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForRelease: [
      "DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussion: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussionComment: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"
    ],
    listForCommitComment: [
      "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
    listForIssueComment: [
      "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    listForPullRequestReviewComment: [
      "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    listForRelease: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    listForTeamDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    listForTeamDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ]
  },
  repos: {
    acceptInvitation: [
      "PATCH /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "acceptInvitationForAuthenticatedUser"] }
    ],
    acceptInvitationForAuthenticatedUser: [
      "PATCH /user/repository_invitations/{invitation_id}"
    ],
    addAppAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    addTeamAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    addUserAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    cancelPagesDeployment: [
      "POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel"
    ],
    checkAutomatedSecurityFixes: [
      "GET /repos/{owner}/{repo}/automated-security-fixes"
    ],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkImmutableReleases: ["GET /repos/{owner}/{repo}/immutable-releases"],
    checkPrivateVulnerabilityReporting: [
      "GET /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    checkVulnerabilityAlerts: [
      "GET /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    codeownersErrors: ["GET /repos/{owner}/{repo}/codeowners/errors"],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    compareCommitsWithBasehead: [
      "GET /repos/{owner}/{repo}/compare/{basehead}"
    ],
    createAttestation: ["POST /repos/{owner}/{repo}/attestations"],
    createAutolink: ["POST /repos/{owner}/{repo}/autolinks"],
    createCommitComment: [
      "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    createCommitSignatureProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentBranchPolicy: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    createDeploymentProtectionRule: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    createDeploymentStatus: [
      "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateEnvironment: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createOrgRuleset: ["POST /orgs/{org}/rulesets"],
    createPagesDeployment: ["POST /repos/{owner}/{repo}/pages/deployments"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages"],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createRepoRuleset: ["POST /repos/{owner}/{repo}/rulesets"],
    createUsingTemplate: [
      "POST /repos/{template_owner}/{template_repo}/generate"
    ],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    customPropertiesForReposCreateOrUpdateRepositoryValues: [
      "PATCH /repos/{owner}/{repo}/properties/values"
    ],
    customPropertiesForReposGetRepositoryValues: [
      "GET /repos/{owner}/{repo}/properties/values"
    ],
    declineInvitation: [
      "DELETE /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "declineInvitationForAuthenticatedUser"] }
    ],
    declineInvitationForAuthenticatedUser: [
      "DELETE /user/repository_invitations/{invitation_id}"
    ],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    deleteAdminBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    deleteAnEnvironment: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    deleteAutolink: ["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    deleteBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: [
      "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"
    ],
    deleteDeploymentBranchPolicy: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: [
      "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    deleteOrgRuleset: ["DELETE /orgs/{org}/rulesets/{ruleset_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages"],
    deletePullRequestReviewProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: [
      "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    deleteRepoRuleset: ["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: [
      "DELETE /repos/{owner}/{repo}/automated-security-fixes"
    ],
    disableDeploymentProtectionRule: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    disableImmutableReleases: [
      "DELETE /repos/{owner}/{repo}/immutable-releases"
    ],
    disablePrivateVulnerabilityReporting: [
      "DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    disableVulnerabilityAlerts: [
      "DELETE /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    downloadArchive: [
      "GET /repos/{owner}/{repo}/zipball/{ref}",
      {},
      { renamed: ["repos", "downloadZipballArchive"] }
    ],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: [
      "PUT /repos/{owner}/{repo}/automated-security-fixes"
    ],
    enableImmutableReleases: ["PUT /repos/{owner}/{repo}/immutable-releases"],
    enablePrivateVulnerabilityReporting: [
      "PUT /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    enableVulnerabilityAlerts: [
      "PUT /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    generateReleaseNotes: [
      "POST /repos/{owner}/{repo}/releases/generate-notes"
    ],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    getAdminBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    getAllDeploymentProtectionRules: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
    getAllStatusCheckContexts: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"
    ],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics"],
    getAppsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"
    ],
    getAutolink: ["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    getBranchRules: ["GET /repos/{owner}/{repo}/rules/branches/{branch}"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: [
      "GET /repos/{owner}/{repo}/collaborators/{username}/permission"
    ],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getCustomDeploymentProtectionRule: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentBranchPolicy: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    getDeploymentStatus: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"
    ],
    getEnvironment: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getOrgRuleSuite: ["GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"],
    getOrgRuleSuites: ["GET /orgs/{org}/rulesets/rule-suites"],
    getOrgRuleset: ["GET /orgs/{org}/rulesets/{ruleset_id}"],
    getOrgRulesets: ["GET /orgs/{org}/rulesets"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getPagesDeployment: [
      "GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}"
    ],
    getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getRepoRuleSuite: [
      "GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"
    ],
    getRepoRuleSuites: ["GET /repos/{owner}/{repo}/rulesets/rule-suites"],
    getRepoRuleset: ["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    getRepoRulesetHistory: [
      "GET /repos/{owner}/{repo}/rulesets/{ruleset_id}/history"
    ],
    getRepoRulesetVersion: [
      "GET /repos/{owner}/{repo}/rulesets/{ruleset_id}/history/{version_id}"
    ],
    getRepoRulesets: ["GET /repos/{owner}/{repo}/rulesets"],
    getStatusChecksProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    getTeamsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"
    ],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"
    ],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    getWebhookDelivery: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    listActivities: ["GET /repos/{owner}/{repo}/activity"],
    listAttestations: [
      "GET /repos/{owner}/{repo}/attestations/{subject_digest}"
    ],
    listAutolinks: ["GET /repos/{owner}/{repo}/autolinks"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"
    ],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: [
      "GET /repos/{owner}/{repo}/commits/{ref}/statuses"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listCustomDeploymentRuleIntegrations: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"
    ],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentBranchPolicies: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    listDeploymentStatuses: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"
    ],
    listReleaseAssets: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/assets"
    ],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhookDeliveries: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"
    ],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    mergeUpstream: ["POST /repos/{owner}/{repo}/merge-upstream"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeAppAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    removeCollaborator: [
      "DELETE /repos/{owner}/{repo}/collaborators/{username}"
    ],
    removeStatusCheckContexts: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    removeStatusCheckProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    removeTeamAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    removeUserAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics"],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    setAppAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    setStatusCheckContexts: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    setTeamAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    setUserAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateDeploymentBranchPolicy: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: [
      "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    updateOrgRuleset: ["PUT /orgs/{org}/rulesets/{ruleset_id}"],
    updatePullRequestReviewProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: [
      "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    updateRepoRuleset: ["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    updateStatusCheckPotection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
      {},
      { renamed: ["repos", "updateStatusCheckProtection"] }
    ],
    updateStatusCheckProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: [
      "PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    uploadReleaseAsset: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
      { baseUrl: "https://uploads.github.com" }
    ]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits"],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics"],
    users: ["GET /search/users"]
  },
  secretScanning: {
    createPushProtectionBypass: [
      "POST /repos/{owner}/{repo}/secret-scanning/push-protection-bypasses"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ],
    getScanHistory: ["GET /repos/{owner}/{repo}/secret-scanning/scan-history"],
    listAlertsForOrg: ["GET /orgs/{org}/secret-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    listLocationsForAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"
    ],
    listOrgPatternConfigs: [
      "GET /orgs/{org}/secret-scanning/pattern-configurations"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ],
    updateOrgPatternConfigs: [
      "PATCH /orgs/{org}/secret-scanning/pattern-configurations"
    ]
  },
  securityAdvisories: {
    createFork: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks"
    ],
    createPrivateVulnerabilityReport: [
      "POST /repos/{owner}/{repo}/security-advisories/reports"
    ],
    createRepositoryAdvisory: [
      "POST /repos/{owner}/{repo}/security-advisories"
    ],
    createRepositoryAdvisoryCveRequest: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"
    ],
    getGlobalAdvisory: ["GET /advisories/{ghsa_id}"],
    getRepositoryAdvisory: [
      "GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ],
    listGlobalAdvisories: ["GET /advisories"],
    listOrgRepositoryAdvisories: ["GET /orgs/{org}/security-advisories"],
    listRepositoryAdvisories: ["GET /repos/{owner}/{repo}/security-advisories"],
    updateRepositoryAdvisory: [
      "PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    addOrUpdateRepoPermissionsInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    checkPermissionsForRepoInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    deleteDiscussionInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    getDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    getMembershipForUserInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/invitations"
    ],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    removeRepoInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    updateDiscussionCommentInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    updateDiscussionInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: [
      "POST /user/emails",
      {},
      { renamed: ["users", "addEmailForAuthenticatedUser"] }
    ],
    addEmailForAuthenticatedUser: ["POST /user/emails"],
    addSocialAccountForAuthenticatedUser: ["POST /user/social_accounts"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: [
      "POST /user/gpg_keys",
      {},
      { renamed: ["users", "createGpgKeyForAuthenticatedUser"] }
    ],
    createGpgKeyForAuthenticatedUser: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: [
      "POST /user/keys",
      {},
      { renamed: ["users", "createPublicSshKeyForAuthenticatedUser"] }
    ],
    createPublicSshKeyForAuthenticatedUser: ["POST /user/keys"],
    createSshSigningKeyForAuthenticatedUser: ["POST /user/ssh_signing_keys"],
    deleteAttestationsBulk: [
      "POST /users/{username}/attestations/delete-request"
    ],
    deleteAttestationsById: [
      "DELETE /users/{username}/attestations/{attestation_id}"
    ],
    deleteAttestationsBySubjectDigest: [
      "DELETE /users/{username}/attestations/digest/{subject_digest}"
    ],
    deleteEmailForAuthenticated: [
      "DELETE /user/emails",
      {},
      { renamed: ["users", "deleteEmailForAuthenticatedUser"] }
    ],
    deleteEmailForAuthenticatedUser: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: [
      "DELETE /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "deleteGpgKeyForAuthenticatedUser"] }
    ],
    deleteGpgKeyForAuthenticatedUser: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: [
      "DELETE /user/keys/{key_id}",
      {},
      { renamed: ["users", "deletePublicSshKeyForAuthenticatedUser"] }
    ],
    deletePublicSshKeyForAuthenticatedUser: ["DELETE /user/keys/{key_id}"],
    deleteSocialAccountForAuthenticatedUser: ["DELETE /user/social_accounts"],
    deleteSshSigningKeyForAuthenticatedUser: [
      "DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getById: ["GET /user/{account_id}"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: [
      "GET /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "getGpgKeyForAuthenticatedUser"] }
    ],
    getGpgKeyForAuthenticatedUser: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: [
      "GET /user/keys/{key_id}",
      {},
      { renamed: ["users", "getPublicSshKeyForAuthenticatedUser"] }
    ],
    getPublicSshKeyForAuthenticatedUser: ["GET /user/keys/{key_id}"],
    getSshSigningKeyForAuthenticatedUser: [
      "GET /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    list: ["GET /users"],
    listAttestations: ["GET /users/{username}/attestations/{subject_digest}"],
    listAttestationsBulk: [
      "POST /users/{username}/attestations/bulk-list{?per_page,before,after}"
    ],
    listBlockedByAuthenticated: [
      "GET /user/blocks",
      {},
      { renamed: ["users", "listBlockedByAuthenticatedUser"] }
    ],
    listBlockedByAuthenticatedUser: ["GET /user/blocks"],
    listEmailsForAuthenticated: [
      "GET /user/emails",
      {},
      { renamed: ["users", "listEmailsForAuthenticatedUser"] }
    ],
    listEmailsForAuthenticatedUser: ["GET /user/emails"],
    listFollowedByAuthenticated: [
      "GET /user/following",
      {},
      { renamed: ["users", "listFollowedByAuthenticatedUser"] }
    ],
    listFollowedByAuthenticatedUser: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: [
      "GET /user/gpg_keys",
      {},
      { renamed: ["users", "listGpgKeysForAuthenticatedUser"] }
    ],
    listGpgKeysForAuthenticatedUser: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: [
      "GET /user/public_emails",
      {},
      { renamed: ["users", "listPublicEmailsForAuthenticatedUser"] }
    ],
    listPublicEmailsForAuthenticatedUser: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: [
      "GET /user/keys",
      {},
      { renamed: ["users", "listPublicSshKeysForAuthenticatedUser"] }
    ],
    listPublicSshKeysForAuthenticatedUser: ["GET /user/keys"],
    listSocialAccountsForAuthenticatedUser: ["GET /user/social_accounts"],
    listSocialAccountsForUser: ["GET /users/{username}/social_accounts"],
    listSshSigningKeysForAuthenticatedUser: ["GET /user/ssh_signing_keys"],
    listSshSigningKeysForUser: ["GET /users/{username}/ssh_signing_keys"],
    setPrimaryEmailVisibilityForAuthenticated: [
      "PATCH /user/email/visibility",
      {},
      { renamed: ["users", "setPrimaryEmailVisibilityForAuthenticatedUser"] }
    ],
    setPrimaryEmailVisibilityForAuthenticatedUser: [
      "PATCH /user/email/visibility"
    ],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};
var endpoints_default = Endpoints;

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/endpoints-to-methods.js
var endpointMethodsMap = /* @__PURE__ */ new Map();
for (const [scope, endpoints] of Object.entries(endpoints_default)) {
  for (const [methodName, endpoint2] of Object.entries(endpoints)) {
    const [route, defaults, decorations] = endpoint2;
    const [method, url] = route.split(/ /);
    const endpointDefaults = Object.assign(
      {
        method,
        url
      },
      defaults
    );
    if (!endpointMethodsMap.has(scope)) {
      endpointMethodsMap.set(scope, /* @__PURE__ */ new Map());
    }
    endpointMethodsMap.get(scope).set(methodName, {
      scope,
      methodName,
      endpointDefaults,
      decorations
    });
  }
}
var handler = {
  has({ scope }, methodName) {
    return endpointMethodsMap.get(scope).has(methodName);
  },
  getOwnPropertyDescriptor(target, methodName) {
    return {
      value: this.get(target, methodName),
      // ensures method is in the cache
      configurable: true,
      writable: true,
      enumerable: true
    };
  },
  defineProperty(target, methodName, descriptor) {
    Object.defineProperty(target.cache, methodName, descriptor);
    return true;
  },
  deleteProperty(target, methodName) {
    delete target.cache[methodName];
    return true;
  },
  ownKeys({ scope }) {
    return [...endpointMethodsMap.get(scope).keys()];
  },
  set(target, methodName, value) {
    return target.cache[methodName] = value;
  },
  get({ octokit, scope, cache }, methodName) {
    if (cache[methodName]) {
      return cache[methodName];
    }
    const method = endpointMethodsMap.get(scope).get(methodName);
    if (!method) {
      return void 0;
    }
    const { endpointDefaults, decorations } = method;
    if (decorations) {
      cache[methodName] = decorate(
        octokit,
        scope,
        methodName,
        endpointDefaults,
        decorations
      );
    } else {
      cache[methodName] = octokit.request.defaults(endpointDefaults);
    }
    return cache[methodName];
  }
};
function endpointsToMethods(octokit) {
  const newMethods = {};
  for (const scope of endpointMethodsMap.keys()) {
    newMethods[scope] = new Proxy({ octokit, scope, cache: {} }, handler);
  }
  return newMethods;
}
function decorate(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);
  function withDecorations(...args) {
    let options = requestWithDefaults.endpoint.merge(...args);
    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: void 0
      });
      return requestWithDefaults(options);
    }
    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(
        `octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`
      );
    }
    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }
    if (decorations.renamedParameters) {
      const options2 = requestWithDefaults.endpoint.merge(...args);
      for (const [name, alias] of Object.entries(
        decorations.renamedParameters
      )) {
        if (name in options2) {
          octokit.log.warn(
            `"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`
          );
          if (!(alias in options2)) {
            options2[alias] = options2[name];
          }
          delete options2[name];
        }
      }
      return requestWithDefaults(options2);
    }
    return requestWithDefaults(...args);
  }
  return Object.assign(withDecorations, requestWithDefaults);
}

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-src/index.js
function restEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit);
  return {
    rest: api
  };
}
restEndpointMethods.VERSION = VERSION8;
function legacyRestEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit);
  return {
    ...api,
    rest: api
  };
}
legacyRestEndpointMethods.VERSION = VERSION8;

// node_modules/@octokit/rest/dist-src/version.js
var VERSION9 = "22.0.1";

// node_modules/@octokit/rest/dist-src/index.js
var Octokit2 = Octokit.plugin(requestLog, legacyRestEndpointMethods, paginateRest).defaults(
  {
    userAgent: `octokit-rest.js/${VERSION9}`
  }
);

// src/render.ts
var RECEIPT_MARKER = "<!-- proofslip-receipt -->";
var NO_WARNINGS = "none found (no tests deleted or skipped, and the CI config was not changed).";
function renderMarkdown(receipt) {
  const view = presentReceipt(receipt);
  const lines = [
    RECEIPT_MARKER,
    `**\u{1F9FE} Receipt: PR #${receipt.pr.number} in ${receipt.repo} \xB7 ${view.overallLabel}**`,
    "",
    `**What the agent was asked:** ${view.task}`,
    "",
    `**What it actually changed:** ${view.changes}`,
    "",
    "**What it claimed, and what we found:**"
  ];
  if (view.claims.length === 0) {
    lines.push("- Nothing in the pull request description matched a claim proofslip knows how to check.");
  } else {
    for (const claim of view.claims) {
      const link = claim.runUrl ? ` [View run](${claim.runUrl})` : "";
      lines.push(`- ${claim.icon} *"${escapeQuote(claim.text)}"*: ${claim.detail}${link}`);
    }
  }
  lines.push("");
  if (view.warnings.length === 0) {
    lines.push(`**Warning signs:** ${NO_WARNINGS}`);
  } else {
    lines.push("**Warning signs:**");
    for (const warning of view.warnings) lines.push(`- ${warning}`);
  }
  if (view.unverified.length > 0) {
    lines.push("");
    lines.push("**What we couldn't verify:**");
    for (const item of view.unverified) lines.push(`- ${item}`);
  }
  lines.push("");
  lines.push(`**Bottom line:** ${view.bottomLine}`);
  lines.push("");
  lines.push(view.footer);
  lines.push("");
  return lines.join("\n");
}
function escapeQuote(value) {
  return value.replace(/"/g, "'");
}

// src/github.ts
var ProofslipError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ProofslipError";
  }
};
function createOctokit(token) {
  return new Octokit2({
    auth: token?.trim() ? token.trim() : void 0,
    userAgent: "proofslip"
  });
}
function parseRepo(value) {
  const match = value.trim().match(/^([^/\s]+)\/([^/\s]+?)(?:\.git)?$/);
  if (!match?.[1] || !match[2]) {
    throw new ProofslipError(`Expected a repository as owner/name, got "${value}".`);
  }
  return { owner: match[1], repo: match[2] };
}
async function fetchPullRequestEvidence(octokit, owner, repo, prNumber) {
  const full = `${owner}/${repo}`;
  let pr;
  try {
    const response = await octokit.rest.pulls.get({ owner, repo, pull_number: prNumber });
    pr = response.data;
  } catch (error) {
    throw new ProofslipError(explainGithubError(error, `GitHub could not load ${full}#${prNumber}.`));
  }
  const [files, comments, commits, reviews] = await Promise.all([
    octokit.paginate(octokit.rest.pulls.listFiles, { owner, repo, pull_number: prNumber, per_page: 100 }),
    octokit.paginate(octokit.rest.issues.listComments, { owner, repo, issue_number: prNumber, per_page: 100 }),
    octokit.paginate(octokit.rest.pulls.listCommits, { owner, repo, pull_number: prNumber, per_page: 100 }),
    collectReviewsSafe(octokit, owner, repo, prNumber)
  ]);
  const headSha = pr.head.sha;
  const commitList = commits.map((commit) => ({
    sha: commit.sha,
    message: commit.commit.message ?? ""
  }));
  const previous = [...commitList].reverse().find((commit) => commit.sha !== headSha)?.sha;
  const [headChecks, mergeChecks, workflowChecks, previousChecks] = await Promise.all([
    collectChecksSafe(octokit, owner, repo, headSha),
    collectChecksSafe(octokit, owner, repo, `refs/pull/${prNumber}/merge`),
    collectWorkflowChecksSafe(octokit, owner, repo, headSha),
    previous ? collectChecksSafe(octokit, owner, repo, previous) : Promise.resolve([])
  ]);
  const checkRuns = assembleCheckRuns(headSha, headChecks, mergeChecks, workflowChecks, previousChecks);
  const numbers = issueNumbers(`${pr.title ?? ""}
${pr.body ?? ""}`);
  const linkedIssues = (await Promise.all(numbers.map(async (number) => {
    try {
      const issue = await octokit.rest.issues.get({ owner, repo, issue_number: number });
      if (issue.data.pull_request) return null;
      return { number, title: issue.data.title ?? "", body: issue.data.body ?? "" };
    } catch {
      return null;
    }
  }))).filter((issue) => issue !== null);
  const prComments = comments.map((comment) => ({
    author: comment.user?.login ?? "unknown",
    body: comment.body ?? "",
    createdAt: comment.created_at
  }));
  return {
    repo: full,
    number: pr.number,
    url: pr.html_url,
    title: pr.title ?? "",
    body: pr.body ?? "",
    author: pr.user?.login ?? "unknown",
    headSha,
    additions: pr.additions ?? 0,
    deletions: pr.deletions ?? 0,
    changedFiles: pr.changed_files,
    labels: (pr.labels ?? []).map((label) => typeof label.name === "string" ? label.name : "").filter(Boolean),
    files: files.map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch ?? void 0,
      previous_filename: file.previous_filename
    })),
    comments: prComments,
    checkRuns,
    linkedIssues,
    commits: commitList,
    reviews
  };
}
function checksForHead(headSha, headRuns, extraRuns) {
  const byName = /* @__PURE__ */ new Map();
  for (const run of extraRuns) byName.set(run.name, { ...run, sha: headSha });
  for (const run of headRuns) byName.set(run.name, { ...run, sha: headSha });
  return [...byName.values()];
}
function assembleCheckRuns(headSha, headRuns, mergeRuns, workflowRuns, previousRuns) {
  return [...checksForHead(headSha, headRuns, [...workflowRuns, ...mergeRuns]), ...previousRuns];
}
function findReceiptComment(comments) {
  return comments.find((comment) => (comment.body ?? "").includes(RECEIPT_MARKER));
}
async function postReceiptComment(octokit, owner, repo, prNumber, markdown) {
  const comments = await octokit.paginate(octokit.rest.issues.listComments, {
    owner,
    repo,
    issue_number: prNumber,
    per_page: 100
  });
  const existing = findReceiptComment(comments);
  if (existing) {
    const updated = await octokit.rest.issues.updateComment({ owner, repo, comment_id: existing.id, body: markdown });
    return updated.data.html_url;
  }
  const created = await octokit.rest.issues.createComment({ owner, repo, issue_number: prNumber, body: markdown });
  return created.data.html_url;
}
function toIndexEntry(receipt) {
  return {
    id: receipt.id,
    repo: receipt.repo,
    pr: receipt.pr.number,
    url: receipt.pr.url,
    head_sha: receipt.pr.head_sha,
    overall: receipt.overall,
    created_at: receipt.created_at,
    summary_plain: receipt.summary_plain,
    agent: receipt.agent.name
  };
}
function upsertIndex(entries, next) {
  return [next, ...entries.filter((entry) => entry.id !== next.id)].sort((a, b) => b.created_at.localeCompare(a.created_at));
}
async function publishReceipt(octokit, owner, repo, branch, receipt, markdown) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await commitReceipt(octokit, owner, repo, branch, receipt, markdown);
    } catch (error) {
      lastError = error;
      if (!isNotFastForward(error) || attempt === 2) throw error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Could not publish the receipt.");
}
async function commitReceipt(octokit, owner, repo, branch, receipt, markdown) {
  const parent = await ensureBranch(octokit, owner, repo, branch);
  const existing = await readJsonFile(octokit, owner, repo, "receipts/index.json", branch);
  const entries = Array.isArray(existing) ? existing : [];
  const index = upsertIndex(entries, toIndexEntry(receipt));
  const files = [
    { path: `receipts/${receipt.id}.json`, content: `${JSON.stringify(receipt, null, 2)}
` },
    { path: `receipts/${receipt.id}.md`, content: markdown.endsWith("\n") ? markdown : `${markdown}
` },
    { path: "receipts/index.json", content: `${JSON.stringify(index, null, 2)}
` }
  ];
  const blobs = await Promise.all(
    files.map((file) => octokit.rest.git.createBlob({ owner, repo, content: file.content, encoding: "utf-8" }))
  );
  const parentCommit = await octokit.rest.git.getCommit({ owner, repo, commit_sha: parent });
  const tree = await octokit.rest.git.createTree({
    owner,
    repo,
    base_tree: parentCommit.data.tree.sha,
    tree: files.map((file, i) => ({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blobs[i].data.sha
    }))
  });
  const commit = await octokit.rest.git.createCommit({
    owner,
    repo,
    message: `receipt: ${receipt.repo}#${receipt.pr.number} ${receipt.overall}`,
    tree: tree.data.sha,
    parents: [parent]
  });
  await octokit.rest.git.updateRef({ owner, repo, ref: `heads/${branch}`, sha: commit.data.sha });
  return commit.data.sha;
}
async function ensureBranch(octokit, owner, repo, branch) {
  try {
    const ref = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
    return ref.data.object.sha;
  } catch (error) {
    if (httpStatus(error) !== 404) {
      throw new ProofslipError(explainGithubError(error, `Could not read branch ${branch}.`));
    }
  }
  const repository = await octokit.rest.repos.get({ owner, repo });
  const base = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${repository.data.default_branch}` });
  await octokit.rest.git.createRef({ owner, repo, ref: `refs/heads/${branch}`, sha: base.data.object.sha });
  return base.data.object.sha;
}
async function readJsonFile(octokit, owner, repo, filePath, ref) {
  try {
    const response = await octokit.rest.repos.getContent({ owner, repo, path: filePath, ref });
    if (Array.isArray(response.data) || response.data.type !== "file" || !("content" in response.data)) return null;
    const text = Buffer.from(response.data.content, "base64").toString("utf8");
    return JSON.parse(text);
  } catch (error) {
    if (httpStatus(error) === 404) return null;
    throw error;
  }
}
async function findOpenPullRequest(octokit, owner, repo, sha, branch) {
  try {
    const associated = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({ owner, repo, commit_sha: sha });
    const open = associated.data.find((pr) => pr.state === "open");
    if (open) return open.number;
  } catch (error) {
    const status = httpStatus(error);
    if (status !== 404 && status !== 422) throw error;
  }
  if (!branch) return null;
  const listed = await octokit.rest.pulls.list({
    owner,
    repo,
    state: "open",
    head: `${owner}:${branch}`,
    per_page: 10
  });
  return listed.data.find((pr) => pr.head.sha === sha)?.number ?? listed.data[0]?.number ?? null;
}
async function collectReviewsSafe(octokit, owner, repo, prNumber) {
  try {
    const reviews = await octokit.paginate(octokit.rest.pulls.listReviews, {
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100
    });
    return reviews.map((review) => ({
      author: review.user?.login ?? "unknown",
      state: review.state ?? "",
      submittedAt: review.submitted_at ?? void 0
    }));
  } catch (error) {
    const status = httpStatus(error);
    if (status === 403 || status === 404 || status === 422) return [];
    throw error;
  }
}
async function collectChecksSafe(octokit, owner, repo, sha) {
  try {
    return await collectChecks(octokit, owner, repo, sha);
  } catch (error) {
    const status = httpStatus(error);
    if (status === 404 || status === 422) return [];
    throw error;
  }
}
async function collectWorkflowChecksSafe(octokit, owner, repo, headSha) {
  try {
    return await collectWorkflowChecks(octokit, owner, repo, headSha);
  } catch (error) {
    const status = httpStatus(error);
    if (status === 403 || status === 404 || status === 422) return [];
    throw error;
  }
}
async function collectWorkflowChecks(octokit, owner, repo, headSha) {
  const response = await octokit.rest.actions.listWorkflowRunsForRepo({
    owner,
    repo,
    head_sha: headSha,
    per_page: 30
  });
  const latest = /* @__PURE__ */ new Map();
  for (const run of response.data.workflow_runs) {
    const key = run.name || run.path || String(run.id);
    const current = latest.get(key);
    if (!current || run.run_number >= current.run_number) latest.set(key, run);
  }
  const checks = [];
  for (const run of latest.values()) {
    try {
      const jobs = await octokit.rest.actions.listJobsForWorkflowRun({
        owner,
        repo,
        run_id: run.id,
        per_page: 100
      });
      if (jobs.data.jobs.length === 0) {
        checks.push(workflowRunAsCheck(run, headSha));
        continue;
      }
      for (const job of jobs.data.jobs) {
        checks.push({
          name: job.name,
          status: job.status ?? "completed",
          conclusion: job.conclusion,
          sha: headSha,
          url: job.html_url ?? run.html_url
        });
      }
    } catch (error) {
      const status = httpStatus(error);
      if (status === 403 || status === 404) {
        checks.push(workflowRunAsCheck(run, headSha));
        continue;
      }
      throw error;
    }
  }
  return checks;
}
function workflowRunAsCheck(run, headSha) {
  return {
    name: run.name || "CI",
    status: run.status ?? "completed",
    conclusion: run.conclusion ?? null,
    sha: headSha,
    url: run.html_url
  };
}
async function collectChecks(octokit, owner, repo, sha) {
  const checks = await octokit.paginate(octokit.rest.checks.listForRef, { owner, repo, ref: sha, per_page: 100 });
  const statuses = await collectStatuses(octokit, owner, repo, sha);
  const fromChecks = checks.map((run) => ({
    name: run.name,
    status: run.status,
    conclusion: run.conclusion,
    sha,
    url: run.html_url
  }));
  const seenStatus = /* @__PURE__ */ new Set();
  const fromStatuses = [];
  for (const status of statuses) {
    if (seenStatus.has(status.context)) continue;
    seenStatus.add(status.context);
    fromStatuses.push({
      name: status.context,
      status: status.state === "pending" ? "in_progress" : "completed",
      conclusion: status.state === "error" ? "failure" : status.state === "pending" ? null : status.state,
      sha,
      url: status.target_url
    });
  }
  const merged = /* @__PURE__ */ new Map();
  for (const status of fromStatuses) merged.set(`${status.sha}:${status.name}`, status);
  for (const check of fromChecks) merged.set(`${check.sha}:${check.name}`, check);
  return [...merged.values()];
}
async function collectStatuses(octokit, owner, repo, sha) {
  try {
    return await octokit.paginate(octokit.rest.repos.listCommitStatusesForRef, { owner, repo, ref: sha, per_page: 100 });
  } catch (error) {
    const status = httpStatus(error);
    if (status === 403 || status === 404 || status === 422) return [];
    throw error;
  }
}
function issueNumbers(text) {
  const numbers = /* @__PURE__ */ new Set();
  for (const match of text.matchAll(/#(\d+)\b/g)) {
    if (match[1]) numbers.add(Number(match[1]));
  }
  return [...numbers].slice(0, 5);
}
function isNotFastForward(error) {
  const message = error instanceof Error ? error.message : String(error);
  return httpStatus(error) === 422 && /fast forward/i.test(message);
}
function httpStatus(error) {
  if (typeof error === "object" && error !== null && "status" in error && typeof error.status === "number") {
    return error.status;
  }
  return void 0;
}
function explainGithubError(error, prefix) {
  const status = httpStatus(error);
  const message = error instanceof Error ? error.message : String(error);
  if (status === 404) return `${prefix} If the repository is private, set GITHUB_TOKEN or pass --token.`;
  if (status === 401 || status === 403) return `${prefix} GitHub refused the token (${status}). It needs pull requests, checks, and contents access.`;
  return `${prefix} ${message}`;
}

// src/site.ts
var import_node_fs2 = __toESM(require("fs"));
var import_node_path2 = __toESM(require("path"));

// src/theme.ts
var import_node_fs = __toESM(require("fs"));
var import_node_path = __toESM(require("path"));
function renderCredit() {
  return `<footer class="wrap site">Built by <a href="https://github.com/omsocll">omsocll</a> \xB7 <a href="https://x.com/kickscosmo">@kickscosmo</a>.</footer>`;
}
function fontFaceCss(prefix) {
  const face = (family, file, weight) => `@font-face {
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
    face("IBM Plex Mono", "plex-mono-400.woff2", 400)
  ].join("\n");
}
function copyFonts(outDir) {
  const source = fontsSource();
  const dest = import_node_path.default.join(outDir, "fonts");
  import_node_fs.default.mkdirSync(dest, { recursive: true });
  for (const name of import_node_fs.default.readdirSync(source)) {
    if (!name.endsWith(".woff2") && name !== "LICENSE.txt") continue;
    import_node_fs.default.copyFileSync(import_node_path.default.join(source, name), import_node_path.default.join(dest, name));
  }
}
function fontsSource() {
  const here = typeof __dirname === "string" ? __dirname : process.cwd();
  const candidates = [
    import_node_path.default.resolve("site/fonts"),
    import_node_path.default.resolve(here, "../site/fonts"),
    import_node_path.default.resolve(here, "../../site/fonts")
  ];
  const found = candidates.find((dir) => import_node_fs.default.existsSync(import_node_path.default.join(dir, "outfit-800.woff2")));
  if (!found) throw new Error("proofslip could not find site/fonts. Run the site build from the repository root.");
  return found;
}
function renderNav(links) {
  const item = (href, label, current) => `<a href="${escapeAttr(href)}"${current ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<header class="nav wrap">
    <a class="brand" href="${escapeAttr(links.home)}">proofslip<svg class="mark" viewBox="0 0 16 18" width="14" height="16" aria-hidden="true"><path fill="currentColor" d="M3 1.2h10a1 1 0 0 1 1 1V16l-2.2-1.35L9.8 16 8 14.65 6.2 16l-2-1.35L2 16V2.2a1 1 0 0 1 1-1Zm1.3 3.1h7.4v1.15H4.3V4.3Zm0 2.5h7.4v1.15H4.3V6.8Zm0 2.5h4.6v1.15H4.3V9.3Z"/></svg></a>
    <nav class="nav-links" aria-label="Site">
      ${item(links.home, "Home", links.current === "home")}
      ${item(links.log, "Log", links.current === "log")}
      <a href="https://github.com/omsocll/proofslip">GitHub</a>
    </nav>
    <a class="cta" href="${escapeAttr(links.start)}">Get started <span aria-hidden="true">\u2192</span></a>
  </header>`;
}
function baseCss(prefix) {
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
  justify-self: start;
  color: var(--ink);
  text-decoration: none;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: -0.04em;
}
.mark { width: 0.78em; height: auto; margin-left: 0.28em; vertical-align: -0.08em; color: var(--accent); }
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
var BINARY_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="320" viewBox="0 0 250 320"><g fill="#c3d4cb" font-family="ui-monospace,monospace" font-size="11">${binaryRows()}</g></svg>`
);
function binaryRows() {
  let state = 1003826;
  const rows = [];
  for (let i = 0; i < 24; i++) {
    let bits = "";
    for (let j = 0; j < 34; j++) {
      state = Math.imul(state, 1664525) + 1013904223 >>> 0;
      bits += state >>> 31 & 1 ? "1" : "0";
    }
    rows.push(bits);
  }
  return rows.map((row, index) => `<text x="0" y="${12 + index * 13}">${row}</text>`).join("");
}
function escapeAttr(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

// src/site.ts
function loadReceipts(dir) {
  if (!import_node_fs2.default.existsSync(dir)) return { receipts: [], skipped: [] };
  const skipped = [];
  const receipts = [];
  for (const name of import_node_fs2.default.readdirSync(dir)) {
    if (!name.endsWith(".json") || name === "index.json") continue;
    const full = import_node_path2.default.join(dir, name);
    if (!import_node_fs2.default.statSync(full).isFile()) continue;
    let parsed;
    try {
      parsed = JSON.parse(import_node_fs2.default.readFileSync(full, "utf8"));
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
function generateSite(receipts, outDir, options = {}) {
  import_node_fs2.default.mkdirSync(import_node_path2.default.join(outDir, "receipts"), { recursive: true });
  if (options.copyFonts !== false && !(options.assetPrefix ?? "").startsWith(".")) copyFonts(outDir);
  import_node_fs2.default.writeFileSync(import_node_path2.default.join(outDir, "index.html"), indexPage(receipts, options));
  for (const receipt of receipts) {
    const page = import_node_path2.default.join(outDir, "receipts", `${receipt.id}.html`);
    import_node_fs2.default.writeFileSync(page, receiptPage(receipt, options));
    import_node_fs2.default.writeFileSync(import_node_path2.default.join(outDir, "receipts", `${receipt.id}.json`), `${JSON.stringify(receipt, null, 2)}
`);
  }
}
function indexPage(receipts, options) {
  const cards = receipts.length ? receipts.map((receipt) => card(receipt)).join("\n") : `<p class="lede">No receipts in this folder yet.</p>`;
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
function card(receipt) {
  const label = OVERALL_LABEL[receipt.overall];
  return `<article class="card" data-overall="${escapeAttr2(receipt.overall)}">
    <span class="pill ${receipt.overall}">${escapeHtml(label)}</span>
    <h2><a href="receipts/${escapeAttr2(receipt.id)}.html">${escapeHtml(receipt.repo)} #${receipt.pr.number}</a></h2>
    <p class="meta">${escapeHtml(receipt.agent.name)} \xB7 ${escapeHtml(receipt.created_at)}</p>
    <p>${escapeHtml(receipt.summary_plain)}</p>
  </article>`;
}
function receiptPage(receipt, options) {
  const view = presentReceipt(receipt);
  const claims = view.claims.length ? `<ul>${view.claims.map((claim) => {
    const link = claim.runUrl ? ` <a href="${escapeAttr2(claim.runUrl)}">View run</a>` : "";
    return `<li>${claim.icon} <strong>${escapeHtml(claim.text)}</strong>: ${escapeHtml(claim.detail)}${link}</li>`;
  }).join("")}</ul>` : "<p>Nothing in the pull request description matched a claim proofslip knows how to check.</p>";
  const warnings = view.warnings.length ? `<ul>${view.warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}</ul>` : "<p>None found (no tests deleted or skipped, and the CI config was not changed).</p>";
  const unverified = view.unverified.length ? `<h2>What we couldn't verify</h2><ul>${view.unverified.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
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
        <p class="meta"><a href="${escapeAttr2(receipt.pr.url)}">Pull request</a> \xB7 <a href="${escapeAttr2(receipt.id)}.json">Raw JSON</a></p>
        <p class="meta">Generated by proofslip v${escapeHtml(receipt.generator.version)}. This receipt only reports what GitHub records show. It is not a code review.</p>
      </article>
    </main>`;
  return layout(`Receipt for ${receipt.repo} #${receipt.pr.number}`, body, `../${options.assetPrefix ?? ""}`);
}
function logLinks(options) {
  return {
    home: options.homeHref ?? "./index.html",
    log: "#list",
    start: options.startHref ?? "https://github.com/omsocll/proofslip"
  };
}
function childLinks(options) {
  const parent = logLinks(options);
  return {
    home: deepen(parent.home),
    log: "../index.html",
    start: deepen(parent.start)
  };
}
function deepen(href) {
  if (/^(https?:|#)/.test(href)) return href;
  return `../${href.replace(/^\.\//, "")}`;
}
function layout(title, body, assetPrefix = "") {
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
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function escapeAttr2(value) {
  return escapeHtml(value);
}

// src/website.ts
var import_node_fs3 = __toESM(require("fs"));
var import_node_path3 = __toESM(require("path"));
var USAGE = "proofslip receipt --repo owner/name --pr 42";
var EXTRA = `
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
var INSTALL = `name: proofslip
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
function generateWebsite(receipts, outDir) {
  import_node_fs3.default.mkdirSync(outDir, { recursive: true });
  copyFonts(outDir);
  generateSite(receipts, import_node_path3.default.join(outDir, "log"), {
    homeHref: "../index.html",
    startHref: "../index.html#install",
    assetPrefix: "../",
    copyFonts: false
  });
  import_node_fs3.default.writeFileSync(import_node_path3.default.join(outDir, "index.html"), landingPage(receipts));
}
function landingPage(receipts) {
  const demos = demoPair(receipts);
  const body = `
  <div class="stage" id="top">
    ${renderNav({ home: "#top", log: "log/index.html", start: "#install", current: "home" })}
    <div class="wrap hero">
      <div>
        <p class="badge"><i aria-hidden="true"></i>Open source \xB7 v0.1</p>
        <h1>Receipts for every<br><span class="accent">agent pull request.</span></h1>
        <p class="under">An agent can write \u201Cdone, tests passed\u201D on a pull request that deleted the tests or ended the command with <code>|| true</code>. proofslip reads GitHub\u2019s own record and writes a receipt a founder or client can read.</p>
        <p class="note">The source lives at github.com/omsocll/proofslip. That repository may be private, so the receipts below stand on their own.</p>
        <p class="links"><a href="#demo">Compare the two demos</a> \xB7 <a href="log/index.html">Browse the log</a></p>
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
        <code id="usage">${escapeHtml2(USAGE)}</code>
        <button type="button" class="copy" aria-label="Copy the proofslip command" data-copy="${escapeAttr3(USAGE)}">
          <svg class="icon-copy" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M5 2.5A1.5 1.5 0 0 1 6.5 1h5A1.5 1.5 0 0 1 13 2.5v7A1.5 1.5 0 0 1 11.5 11h-5A1.5 1.5 0 0 1 5 9.5v-7ZM6.5 2a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-5Z"/><path fill="currentColor" d="M3.5 5A1.5 1.5 0 0 0 2 6.5v7A1.5 1.5 0 0 0 3.5 15h5A1.5 1.5 0 0 0 10 13.5V13H9v.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5H5V5H3.5Z"/></svg>
          <svg class="icon-check" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M13.03 4.47a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06L6.5 9.94l5.47-5.47a.75.75 0 0 1 1.06 0Z"/></svg>
        </button>
      </div>
      <p class="install-label">Or as a GitHub Action</p>
      <pre><code>${escapeHtml2(INSTALL)}</code></pre>
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
  <title>proofslip \u2014 Plain-English receipts for AI agent pull requests</title>
  <meta name="description" content="proofslip writes a plain-English receipt for an AI agent's pull request from GitHub's diff and check runs.">
  <style>${baseCss("")}${EXTRA}</style>
</head>
<body>
${body}
</body>
</html>
`;
}
function specimen() {
  return `<figure class="specimen">
    <header>
      <p class="who">proofslip</p>
      <p class="id">Example \xB7 PR #4</p>
    </header>
    <hr class="ruled">
    <p class="heads"><span>Claimed</span><span>Found</span></p>
    <ul class="lines">
      <li>
        <span>All tests pass</span>
        <span class="no">\u2715<span class="sr"> does not match.</span></span>
        <span>The test command ends with <code>|| true</code></span>
      </li>
      <li>
        <span>Added tests</span>
        <span class="no">\u2715<span class="sr"> does not match.</span></span>
        <span>Deleted <code>tests/readme.test.ts</code></span>
      </li>
    </ul>
    <p class="stamp">Doesn't match</p>
    <figcaption class="caption">What the pull request claimed, beside what GitHub recorded.</figcaption>
  </figure>`;
}
function demoPair(receipts) {
  if (receipts.length === 0) {
    return `<p class="prose">No receipts have been committed for this build.</p>`;
  }
  const ordered = [...receipts].sort((a, b) => a.pr.number - b.pr.number);
  return `<div class="pair">${ordered.map((receipt) => slip(receipt)).join("\n")}</div>`;
}
function slip(receipt) {
  const view = presentReceipt(receipt);
  const caption = receipt.overall === "checks_out" ? "Honest pull request" : receipt.overall === "doesnt_match" ? "Dishonest pull request" : "Needs a closer look";
  const claims = view.claims.map((claim) => `<li>${claim.icon} <strong>${escapeHtml2(claim.text)}</strong> \u2014 ${escapeHtml2(claim.detail)}</li>`).join("");
  const warnings = view.warnings.length ? `<p class="warn">${view.warnings.map((warning) => escapeHtml2(warning)).join(" ")}</p>` : "";
  return `<article class="slip">
    <header>
      <span class="pill ${receipt.overall}">${escapeHtml2(OVERALL_LABEL[receipt.overall])}</span>
      <p class="kicker">${escapeHtml2(caption)} \xB7 ${escapeHtml2(receipt.repo)} #${receipt.pr.number}</p>
      <h3>${escapeHtml2(view.task)}</h3>
    </header>
    <ul class="claims">${claims}</ul>
    ${warnings}
    <p class="bottom">${escapeHtml2(view.bottomLine)}</p>
    <a class="more" href="log/receipts/${escapeAttr3(receipt.id)}.html">Full receipt</a>
  </article>`;
}
function escapeHtml2(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function escapeAttr3(value) {
  return escapeHtml2(value);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_AGENT_LABELS,
  DEFAULT_AGENT_LOGINS,
  OVERALL_LABEL,
  ProofslipError,
  RECEIPT_MARKER,
  RECEIPT_SCHEMA_ID,
  VERDICT_ICON,
  VERSION,
  assembleCheckRuns,
  bottomLine,
  buildReceipt,
  checksForHead,
  ciStatus,
  claimSourceText,
  classifyCheck,
  createOctokit,
  describeChanges,
  detectAgent,
  detectRedFlags,
  eventCommitSha,
  eventHeadBranch,
  extractClaims,
  extractTask,
  fetchPullRequestEvidence,
  findOpenPullRequest,
  findReceiptComment,
  generateSite,
  generateWebsite,
  judgeCheckGroup,
  judgeClaims,
  loadReceipts,
  normalizeEvidence,
  overallVerdict,
  parseRepo,
  postReceiptComment,
  presentReceipt,
  publishReceipt,
  receiptId,
  receiptSchema,
  renderMarkdown,
  resolvePullRequestNumber,
  splitList,
  splitSentences,
  summaryPlain,
  timestamp,
  toIndexEntry,
  upsertIndex
});
/*! Bundled license information:

content-type/dist/index.js:
  (*!
   * content-type
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)

@octokit/request-error/dist-src/index.js:
  (* v8 ignore else -- @preserve -- Bug with vitest coverage where it sees an else branch that doesn't exist *)

@octokit/request/dist-bundle/index.js:
  (* v8 ignore next -- @preserve *)
  (* v8 ignore else -- @preserve *)

@octokit/graphql/dist-bundle/index.js:
  (* v8 ignore if -- @preserve *)
*/

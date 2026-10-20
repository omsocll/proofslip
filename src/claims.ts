import { isTestFile } from "./diff.js";
import type { DiffFile, RawClaim } from "./types.js";
import { oneLine } from "./text.js";

const STOP = new Set([
  "this", "that", "with", "from", "into", "only", "just", "also", "when", "have", "been",
  "were", "was", "does", "did", "not", "for", "the", "and", "all", "green", "clean",
  "lint", "build", "issue", "fixed", "fixes", "pass", "passed", "passing", "suite",
  "unit", "integration", "file", "files", "code", "test", "tests", "spec", "specs",
  "page", "pages", "toggle", "button", "mode", "dark", "light", "feature", "support",
  "added", "add", "update", "updated", "change", "changed", "pull", "request", "branch",
  "commit", "line", "lines", "behavior", "behaviour", "work", "works", "working",
  "should", "mobile", "breaking", "changes", "function", "method", "class", "component",
  "module", "index", "main", "true", "false", "null", "undefined", "return",
  "using", "used", "make", "made", "new", "some", "more", "most", "other", "same",
]);

const CHANGE_VERB =
  /\b(add(?:ed|s|ing)?|updat(?:ed|es|ing)?|chang(?:ed|es|ing)?|modif(?:y|ied|ies)|implement(?:ed|s|ing)?|introduc(?:ed|es|ing)?|creat(?:ed|es|ing)?|remov(?:ed|es|ing)?|delet(?:ed|es|ing)?|renam(?:ed|es|ing)?|edit(?:ed|s|ing)?|rewr(?:ote|itten)|refactor(?:ed|s|ing)?|load(?:ed|s|ing)?|register(?:ed|s|ing)?|rebuil(?:d|t)(?:s|ing)?|touch(?:ed|es|ing)?)\b/i;

const TESTS_HEDGE =
  /\b(could(?: not|n't) run (?:the )?(?:tests?|test suite)|did(?: not|n't) run (?:the )?(?:tests?|test suite)|unable to run (?:the )?tests?|tests? (?:were|was) not run|tests? should (?:pass|work)|not sure (?:if|whether) (?:the )?tests?)\b/i;

const TESTS_PASS =
  /\b(all tests (?:are )?(?:pass(?:ed|ing)?|green)|tests? (?:all )?(?:pass(?:ed|ing)?|are passing|are green)|tests? passing|test suite (?:pass(?:ed|ing)?|is green)|unit tests (?:pass(?:ed|ing)?))\b|\b\d+\s+(?:tests?\s+)?(?:passed|passing)\b|(?:todos?\s+os\s+)?testes\s+(?:passaram|estão\s+passando|estao\s+passando)|alle\s+tests?\s+(?:bestanden|grün|sind\s+grün)|tous\s+les\s+tests?\s+(?:passent|sont\s+passés)|すべて合格|全(?:ての)?テストが(?:成功|合格)|テスト(?:が|は)合格/iu;

const LINT_PASS = /\b(lint(?:ing)? (?:is )?clean|no lint(?:ing)? errors|eslint (?:pass(?:ed|es)|is clean)|lint(?:ing)? pass(?:ed|es))\b/i;
const TYPECHECK_PASS =
  /\b(type[- ]?check(?:ing)? pass(?:ed|es)|type[- ]?check(?:ing)? (?:is )?clean|no type errors|tsc pass(?:ed|es))\b/i;
const BUILD_PASS = /\b((?:the )?build pass(?:ed|es)|build (?:is )?clean|builds successfully|compiled successfully)\b/i;
const CHECKS_PASS = /\b(all checks (?:pass(?:ed|ing)?|are green)|ci is green|checks are green|(?:the )?pipeline pass(?:ed|es))\b/i;
const ADDED_TESTS =
  /\b(?:add(?:ed|s|ing)?|writ(?:e|es|ten|ing)|creat(?:ed|es|ing)|includ(?:ed|es|ing)|cover(?:s|ed|ing)?|adicion(?:a|ei|ou)|cri(?:ou|ei|a)|escrev(?:eu|i))\b[^.!?\n]{0,80}\b(?:tests?|specs?|testes)\b|\b(?:new|added|extra) tests?\b|\bwith tests\b/iu;
const FIXED_ISSUE =
  /\b(?:fix(?:e[sd])?|resolv(?:e[sd])?|clos(?:e[sd])?|behebt|schließt|schliesst|löst|loest|corrige|fecha|cierra|arregla|ferme|résout|resout)\s+(?:issue\s+)?#(\d+)\b/iu;
const RAN_TEST = /\b(?:ran|run)\b[^.\n]{0,160}\b(?:pnpm|npm|yarn|bun|pytest|vitest|jest|go)\s+test\b/i;
const RAN_LINT = /\b(?:ran|run)\b[^.\n]{0,160}\blint\b/i;
const RAN_BUILD = /\b(?:ran|run)\b[^.\n]{0,160}\bbuild\b/i;
const USER_FACING = /\b(?:lets?|allows?|enables?)\s+(?:users?|people|you)\b/i;
const HEDGE_WORD = /\b(i think|probably|hopefully|maybe|might|perhaps)\b/i;
const SHOULD_WORK = /\bshould work\b/i;

const OTHER_PATTERNS: RegExp[] = [
  /\bno breaking changes\b/i,
  /\bbackward[ -]compatible\b/i,
  /\bworks on mobile\b/i,
  /\b(?:faster|more performant|performance improvement|speeds? up)\b/i,
  /\b(?:secure|no vulnerabilities|without vulnerabilities)\b/i,
  /\baccessib(?:le|ility)\b/i,
  /\bproduction[- ]ready\b/i,
  /\bno behavior(?:al)? changes?\b/i,
];

const MAX_CLAIMS = 25;

export function splitSentences(text: string): string[] {
  const sentences: string[] = [];
  let inFence = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !line || line.startsWith("<!--")) continue;
    if (/^- \[[ ]\]/.test(line)) continue;
    const cleaned = line
      .replace(/^#{1,6}\s+/, "")
      .replace(/^- \[[xX]\]\s+/, "")
      .replace(/^[-*+]\s+/, "")
      .replace(/^\d+\.\s+/, "")
      .trim();
    if (!cleaned) continue;
    for (const part of cleaned.split(/(?<=[.!?])\s+(?=[A-Z0-9"'`(])/)) {
      const sentence = part.trim();
      if (sentence) sentences.push(sentence);
    }
  }
  return sentences;
}

export function extractClaims(text: string, _files: DiffFile[] = []): RawClaim[] {
  const claims: RawClaim[] = [];
  const seen = new Set<string>();
  let covered = false;

  const push = (claim: RawClaim) => {
    const key = [
      claim.type,
      claim.hedged ? "hedged" : "plain",
      claim.issue ?? "",
      [...(claim.paths ?? [])].sort().join(","),
      [...(claim.mentions ?? [])].sort().join(","),
      claim.type === "other" ? normalize(claim.text) : "",
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
        mentions: tokens.mentions,
      });
    }

    const issue = sentence.match(FIXED_ISSUE);
    if (issue?.[1]) {
      push({ text: textValue, type: "fixed_issue", hedged: false, issue: Number(issue[1]) });
    }

    const passSentence =
      TESTS_PASS.test(sentence) || RAN_TEST.test(sentence) || LINT_PASS.test(sentence) || RAN_LINT.test(sentence) ||
      TYPECHECK_PASS.test(sentence) || BUILD_PASS.test(sentence) || RAN_BUILD.test(sentence) || CHECKS_PASS.test(sentence);
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
          overclaim,
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

const FILE_EXT = new Set([
  "ts", "tsx", "js", "jsx", "mjs", "cjs", "py", "pyi", "go", "rs", "java", "kt", "kts",
  "rb", "php", "cs", "cpp", "cc", "cxx", "c", "h", "hpp", "vue", "svelte", "html", "css",
  "scss", "yml", "yaml", "json", "md", "markdown", "toml", "xml", "sql", "sh", "bash",
  "cbl", "cob", "coby", "gradle", "swift", "txt", "csv", "lock",
]);

function expandClauses(sentence: string): string[] {
  const parts = sentence.split(/\s*;\s+|\s+\band\b\s+/i).map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return [sentence];
  const claimLike = (part: string) =>
    CHANGE_VERB.test(part) || TESTS_PASS.test(part) || ADDED_TESTS.test(part) || LINT_PASS.test(part) || BUILD_PASS.test(part);
  return parts.every(claimLike) ? parts : [sentence];
}

function isBoilerplate(sentence: string): boolean {
  if (isMediaLine(sentence)) return true;
  const plain = sentence.replace(/[*_`]/g, "").replace(/^[^A-Za-z0-9]+/, "").trim();
  if (/^(?:changes?|what changed|what changes|updated files|summary|details|test plan|testing|screenshots?|notes?|description|verification|related(?: issues)?|changelog|changes breakdown|change impact|behaviou?r changes):?$/i.test(plain)) {
    return true;
  }
  return (
    /pr created automatically by jules/i.test(sentence) ||
    /when you start a review, i'll add/i.test(sentence) ||
    /i'll push a commit with your requested changes/i.test(sentence) ||
    /jules\.google\.com\/task/i.test(sentence) ||
    /^generated by (?:codex|claude|cursor|devin|jules|copilot)\b/i.test(plain) ||
    /by submitting this pull request/i.test(sentence) ||
    /\b(?:contributor license agreement|i agree to the|copyright license)\b/i.test(sentence)
  );
}

function isMediaLine(sentence: string): boolean {
  const plain = sentence.trim();
  if (/^!\[[^\]]*\]\([^)\n]+\)\.?$/.test(plain)) return true;
  return /^<?https?:\/\/\S+>?\.?$/i.test(plain) && /\.(?:png|jpe?g|gif|webp|svg|mp4|mov|webm)(?:[?#]|\s|$)/i.test(plain);
}

function isExternalInstruction(sentence: string): boolean {
  const tellsSomeone = /\b(?:add|set|configure|put|paste|remember to)\b/i.test(sentence);
  const outsideTheDiff = /\b(?:before deploy(?:ing|ment)?|cloudflare|vercel dashboard|netlify dashboard|github secrets?|secret store|pages project|hosting provider)\b/i.test(sentence);
  return tellsSomeone && outsideTheDiff;
}

function isPassingNote(sentence: string): boolean {
  if (/\b(?:google|upstream|android)\b[\s\S]{0,80}\b(?:has|have|had)\s+(?:removed|deleted|dropped)\b/i.test(sentence)) return true;
  if (/\basked for\b[\s\S]{0,120}\b(?:to be removed|removed|be deleted)\b/i.test(sentence)) return true;
  const tokens = rawTokens(sentence);
  return tokens.length > 0 && tokens.every((token) => token.role === "passing");
}

function findTokens(sentence: string): { paths: string[]; mentions: string[]; supporting: string[] } {
  const paths: string[] = [];
  const mentions: string[] = [];
  const supporting: string[] = [];
  for (const token of rawTokens(sentence)) {
    if (token.role === "passing") continue;
    if (token.role === "edit" && isFileToken(token.value)) paths.push(token.value);
    else if (token.role === "edit" && isMention(token.value)) mentions.push(token.value);
    else if (isMention(token.value)) supporting.push(token.value);
  }
  return { paths: [...new Set(paths)], mentions: [...new Set(mentions)], supporting: [...new Set(supporting)] };
}

function rawTokens(sentence: string): { value: string; role: TokenRole }[] {
  const stripped = sentence.replace(/https?:\/\/\S+/g, "");
  const pattern = /`([^`\n]+)`|\b((?:[\w.-]+\/)+[\w.-]+\.[A-Za-z0-9]+)\b/g;
  const tokens: { value: string; role: TokenRole }[] = [];
  for (const match of stripped.matchAll(pattern)) {
    const value = (match[1] || match[2] || "").replace(/^[("']+|[)"',:]+$/g, "");
    if (!value || value.length > 200 || value.includes(" ")) continue;
    tokens.push({ value, role: tokenRole(stripped, match.index ?? 0, value) });
  }
  return tokens;
}

type TokenRole = "edit" | "passing" | "side";

function tokenRole(sentence: string, index: number, token: string): TokenRole {
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

function clauseAt(sentence: string, index: number): string {
  const before = sentence.slice(0, index);
  const start = Math.max(before.lastIndexOf(";"), before.lastIndexOf("\n")) + 1;
  const rest = sentence.slice(index);
  const endRel = rest.search(/[;\n]/);
  const end = endRel === -1 ? sentence.length : index + endRel;
  return sentence.slice(start, end);
}

function proseIdentifiers(sentence: string): string[] {
  const matches = sentence.match(/\b[a-z]+(?:[A-Z][\w$]*)+\b/g) ?? [];
  return [...new Set(matches.filter((token) => token.length >= 6 && !STOP.has(token.toLowerCase())))];
}

function isFileToken(token: string): boolean {
  if (token.includes("://")) return false;
  if (token.includes("/")) return /\.[A-Za-z0-9]+$/.test(token);
  const ext = token.includes(".") ? token.split(".").pop()?.toLowerCase() ?? "" : "";
  return FILE_EXT.has(ext);
}

function isMention(token: string): boolean {
  if (isFileToken(token) || /^\d/.test(token)) return false;
  if (token.length < 3 || token.length > 80) return false;
  if (STOP.has(token.toLowerCase())) return false;
  return /^[A-Za-z_][\w$]*(?:\.[A-Za-z_][\w$]*)*$/.test(token);
}

function broadBehavior(sentence: string): boolean {
  const verbAndNoun =
    /\b(?:implements?|implementation|honou?rs?|ensures?|guarantees?|complies|follows)\b/i.test(sentence) &&
    /\b(?:rules?|spec(?:ification)?s?|standards?|contracts?|behaviou?rs?|semantics|logic)\b/i.test(sentence);
  const count = /\b\d+\s+(?:new\s+|extra\s+|additional\s+)?(?:options|warnings|fields|entries)\b/i.test(sentence);
  return verbAndNoun || count;
}

function stripTrailingPunctuation(value: string): string {
  return value.replace(/[.]+$/, "").trim();
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

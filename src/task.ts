import { agentAuthorLogins } from "./agents.js";
import type { PrEvidence } from "./types.js";

const CLOSING = /\b(?:close[sd]?|fix(?:e[sd])?|resolv(?:e[sd])?)\s+#(\d+)\b/i;

export function extractTask(evidence: PrEvidence): { source: string; text: string } {
  const haystack = `${evidence.title}\n${evidence.body}`;
  const closing = haystack.match(CLOSING);
  if (closing?.[1]) {
    const number = Number(closing[1]);
    const issue = (evidence.linkedIssues ?? []).find((item) => item.number === number);
    return {
      source: `issue#${number}`,
      text: issue?.title?.trim() || evidence.title.trim() || `Issue #${number}`,
    };
  }
  const linked = evidence.linkedIssues ?? [];
  if (linked.length > 0 && linked[0]) {
    return {
      source: `issue#${linked[0].number}`,
      text: linked[0].title.trim() || evidence.title.trim() || `Issue #${linked[0].number}`,
    };
  }
  return { source: "pr", text: evidence.title.trim() || "No description was provided." };
}

/** Claims come from the PR body and the latest comment by the author or a known agent, not from the linked issue. */
export function claimSourceText(evidence: PrEvidence): string {
  const parts = [evidence.body ?? ""];
  const logins = agentAuthorLogins(evidence);
  const comments = [...(evidence.comments ?? [])]
    .filter((comment) => logins.has(comment.author.toLowerCase()) && comment.body.trim())
    .sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""));
  const last = comments.at(-1);
  if (last && last.body.trim() !== (evidence.body ?? "").trim()) {
    parts.push(last.body);
  }
  return parts.join("\n\n");
}

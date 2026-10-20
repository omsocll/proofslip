import { presentReceipt } from "./present.js";
import type { Receipt } from "./types.js";

export const RECEIPT_MARKER = "<!-- proofslip-receipt -->";

export const NO_WARNINGS = "none found (no tests deleted or skipped, and the CI config was not changed).";

export function renderMarkdown(receipt: Receipt): string {
  const view = presentReceipt(receipt);
  const lines: string[] = [
    RECEIPT_MARKER,
    `**🧾 Receipt: PR #${receipt.pr.number} in ${receipt.repo} · ${view.overallLabel}**`,
    "",
    `**What the agent was asked:** ${view.task}`,
    "",
    `**What it actually changed:** ${view.changes}`,
    "",
    "**What it claimed, and what we found:**",
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

function escapeQuote(value: string): string {
  return value.replace(/"/g, "'");
}

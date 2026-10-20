import type { PrReview } from "./types.js";
import { formatList } from "./text.js";

/** Latest decisive review per person. A later approval clears an earlier request. Comments do not. */
export function unresolvedChangesRequested(reviews: PrReview[]): PrReview[] {
  const latest = new Map<string, PrReview>();
  const ordered = [...reviews].sort((a, b) => (a.submittedAt ?? "").localeCompare(b.submittedAt ?? ""));
  for (const review of ordered) {
    if (review.state === "COMMENTED" || review.state === "PENDING") continue;
    latest.set(review.author.toLowerCase(), review);
  }
  return [...latest.values()].filter((review) => review.state === "CHANGES_REQUESTED");
}

export function reviewPushbackLine(reviews: PrReview[]): string | null {
  const open = unresolvedChangesRequested(reviews);
  if (open.length === 0) return null;
  const names = formatList(open.map((review) => review.author));
  const verb = open.length === 1 ? "asked" : "asked";
  const noun = open.length === 1 ? "that review is" : "those reviews are";
  return `${names} ${verb} for changes, and ${noun} still open.`;
}

export function formatList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function backtick(value: string): string {
  return `\`${value.replace(/`/g, "")}\``;
}

export function oneLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function lowerFirst(value: string): string {
  const trimmed = value.trim().replace(/\.+$/, "");
  if (/^[A-Z][a-z]/.test(trimmed)) return trimmed[0]!.toLowerCase() + trimmed.slice(1);
  return trimmed;
}

export function defined<T extends object>(value: T): T {
  const entries = Object.entries(value).filter(([, entry]) => entry !== undefined);
  return Object.fromEntries(entries) as T;
}

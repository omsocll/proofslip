export interface EventPayload {
  pull_request?: { number?: number; head?: { sha?: string; ref?: string } };
  number?: number;
  sha?: string;
  check_suite?: { pull_requests?: Array<{ number?: number }>; head_sha?: string; head_branch?: string };
  check_run?: { pull_requests?: Array<{ number?: number }>; head_sha?: string };
  workflow_run?: {
    pull_requests?: Array<{ number?: number }>;
    head_sha?: string;
    head_branch?: string;
  };
}

export function resolvePullRequestNumber(eventName: string | undefined, payload: EventPayload, input?: string): number | null {
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

export function eventCommitSha(eventName: string | undefined, payload: EventPayload): string | null {
  if (eventName === "pull_request" || eventName === "pull_request_target") {
    return stringOrNull(payload.pull_request?.head?.sha);
  }
  if (eventName === "check_suite") return stringOrNull(payload.check_suite?.head_sha);
  if (eventName === "check_run") return stringOrNull(payload.check_run?.head_sha);
  if (eventName === "workflow_run") return stringOrNull(payload.workflow_run?.head_sha);
  return stringOrNull(payload.sha);
}

export function eventHeadBranch(eventName: string | undefined, payload: EventPayload): string | null {
  if (eventName === "pull_request" || eventName === "pull_request_target") {
    return stringOrNull(payload.pull_request?.head?.ref);
  }
  if (eventName === "check_suite") return stringOrNull(payload.check_suite?.head_branch);
  if (eventName === "workflow_run") return stringOrNull(payload.workflow_run?.head_branch);
  return null;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function splitList(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

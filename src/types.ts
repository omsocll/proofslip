export const RECEIPT_SCHEMA_ID = "agent-receipt/v0" as const;

export type Verdict = "confirmed" | "contradicted" | "stale" | "unverifiable";
export type Overall = "checks_out" | "partly_checked" | "doesnt_match";
export type DetectedBy = "author" | "label" | "commit_trailer" | "body_marker" | "unspecified";

export type ClaimType =
  | "tests_pass"
  | "build_pass"
  | "lint_pass"
  | "typecheck_pass"
  | "checks_pass"
  | "file_changed"
  | "added_tests"
  | "fixed_issue"
  | "other";

export type RedFlagKind =
  | "tests_deleted"
  | "tests_skipped"
  | "assertions_removed"
  | "ci_config_edited"
  | "test_command_weakened"
  | "ci_never_ran"
  | "check_failed";

export type EvidenceKind = "check_run" | "diff" | "issue" | "note";

export interface Evidence {
  kind: EvidenceKind;
  name?: string;
  conclusion?: string | null;
  sha?: string;
  url?: string;
  file?: string;
  detail?: string;
}

export interface ReceiptClaim {
  id: string;
  text: string;
  type: ClaimType;
  verdict: Verdict;
  hedged?: boolean;
  evidence: Evidence[];
}

export interface RedFlag {
  kind: RedFlagKind;
  summary: string;
  files: string[];
}

export interface Receipt {
  schema: typeof RECEIPT_SCHEMA_ID;
  id: string;
  created_at: string;
  repo: string;
  pr: {
    number: number;
    url: string;
    head_sha: string;
    author: string;
  };
  agent: {
    name: string;
    detected_by: DetectedBy;
  };
  task: {
    source: string;
    text: string;
  };
  changes: {
    files_changed: number;
    additions: number;
    deletions: number;
    files: string[];
  };
  claims: ReceiptClaim[];
  red_flags: RedFlag[];
  overall: Overall;
  summary_plain: string;
  unverified?: string[];
  generator: {
    name: "proofslip";
    version: string;
  };
}

export interface DiffFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
  previous_filename?: string;
}

export interface CheckRun {
  name: string;
  status: string;
  conclusion: string | null;
  sha: string;
  url: string | null;
}

export interface PrComment {
  author: string;
  body: string;
  createdAt?: string;
}

export interface LinkedIssue {
  number: number;
  title: string;
  body?: string;
}

export interface PrCommit {
  sha: string;
  message: string;
}

export interface PrReview {
  author: string;
  state: string;
  submittedAt?: string;
}

/** What GitHub recorded about a pull request. The judge only sees this. */
export interface PrEvidence {
  repo: string;
  number: number;
  url: string;
  title: string;
  body: string;
  author: string;
  headSha: string;
  additions: number;
  deletions: number;
  changedFiles?: number;
  files: DiffFile[];
  comments?: PrComment[];
  checkRuns?: CheckRun[];
  linkedIssues?: LinkedIssue[];
  commits?: PrCommit[];
  labels?: string[];
  reviews?: PrReview[];
}

export interface RawClaim {
  text: string;
  type: ClaimType;
  hedged: boolean;
  paths?: string[];
  /** Identifiers that are not filenames. The judge looks for them in patch text. */
  mentions?: string[];
  /**
   * Identifiers the sentence names without claiming each one was edited.
   * Finding one can support the sentence. Missing one does not contradict it.
   */
  supportingMentions?: string[];
  /** The sentence claims behaviour a filename or a changed test file cannot prove. */
  overclaim?: boolean;
  issue?: number;
}

export interface AgentDetection {
  isAgent: boolean;
  name: string;
  detectedBy: DetectedBy;
}

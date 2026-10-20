import { z } from "zod";

export const verdictSchema = z.enum(["confirmed", "contradicted", "stale", "unverifiable"]);
export const overallSchema = z.enum(["checks_out", "partly_checked", "doesnt_match"]);
export const detectedBySchema = z.enum(["author", "label", "commit_trailer", "body_marker", "unspecified"]);

export const claimTypeSchema = z.enum([
  "tests_pass",
  "build_pass",
  "lint_pass",
  "typecheck_pass",
  "checks_pass",
  "file_changed",
  "added_tests",
  "fixed_issue",
  "other",
]);

export const evidenceSchema = z
  .object({
    kind: z.enum(["check_run", "diff", "issue", "note"]),
    name: z.string().optional(),
    conclusion: z.string().nullable().optional(),
    sha: z.string().optional(),
    url: z.string().optional(),
    file: z.string().optional(),
    detail: z.string().optional(),
  })
  .strict();

export const claimSchema = z
  .object({
    id: z.string(),
    text: z.string(),
    type: claimTypeSchema,
    verdict: verdictSchema,
    hedged: z.boolean().optional(),
    evidence: z.array(evidenceSchema),
  })
  .strict();

export const redFlagSchema = z
  .object({
    kind: z.enum([
      "tests_deleted",
      "tests_skipped",
      "assertions_removed",
      "ci_config_edited",
      "test_command_weakened",
      "ci_never_ran",
      "check_failed",
    ]),
    summary: z.string(),
    files: z.array(z.string()),
  })
  .strict();

export const receiptSchema = z
  .object({
    schema: z.literal("agent-receipt/v0"),
    id: z.string().min(1),
    created_at: z.string().min(1),
    repo: z.string().min(1),
    pr: z
      .object({
        number: z.number().int(),
        url: z.string(),
        head_sha: z.string(),
        author: z.string(),
      })
      .strict(),
    agent: z
      .object({
        name: z.string(),
        detected_by: detectedBySchema,
      })
      .strict(),
    task: z
      .object({
        source: z.string(),
        text: z.string(),
      })
      .strict(),
    changes: z
      .object({
        files_changed: z.number().int().nonnegative(),
        additions: z.number().int().nonnegative(),
        deletions: z.number().int().nonnegative(),
        files: z.array(z.string()),
      })
      .strict(),
    claims: z.array(claimSchema),
    red_flags: z.array(redFlagSchema),
    overall: overallSchema,
    summary_plain: z.string(),
    unverified: z.array(z.string()).optional(),
    generator: z
      .object({
        name: z.literal("proofslip"),
        version: z.string(),
      })
      .strict(),
  })
  .strict();

export type ReceiptInput = z.infer<typeof receiptSchema>;

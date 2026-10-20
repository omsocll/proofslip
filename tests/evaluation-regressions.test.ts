import { describe, expect, it } from "vitest";
import { buildReceipt } from "../src/build.js";
import type { PrEvidence } from "../src/types.js";

const head = "c".repeat(40);

function evidence(overrides: Partial<PrEvidence> = {}): PrEvidence {
  return {
    repo: "acme/widget",
    number: 7,
    url: "https://github.com/acme/widget/pull/7",
    title: "Change",
    body: "",
    author: "devin-ai-integration[bot]",
    headSha: head,
    additions: 4,
    deletions: 1,
    files: [],
    checkRuns: [{ name: "test", status: "completed", conclusion: "success", sha: head, url: null }],
    ...overrides,
  };
}

describe("evaluation regressions", () => {
  it("finds a dotted backtick token in the patch instead of calling it a missing file", () => {
    const receipt = buildReceipt(evidence({
      body: "Deleting an existing task uses `it.each` and still reads `params.name`.",
      files: [{
        filename: "src/App.test.jsx",
        status: "modified",
        additions: 2,
        deletions: 0,
        patch: "+  it.each([\"first\", \"last\"]);\n+  const id = params.name;\n",
      }],
    }));
    const claim = receipt.claims.find((item) => item.text.includes("it.each"));
    expect(claim?.verdict).toBe("confirmed");
    expect(claim?.evidence.some((item) => item.detail === "`it.each` is not in the diff.")).toBe(false);
    expect(receipt.overall).not.toBe("doesnt_match");
  });

  it("does not force Doesn't match when nobody claimed the tests passed and CI never ran", () => {
    const receipt = buildReceipt(evidence({
      body: "Updated `index.html` to look up the link colour by id.",
      files: [{ filename: "index.html", status: "modified", additions: 1, deletions: 1, patch: "+ colour = node.id\n" }],
      checkRuns: [],
    }));
    expect(receipt.red_flags.map((flag) => flag.kind)).not.toContain("ci_never_ran");
    expect(receipt.overall).not.toBe("doesnt_match");
  });

  it("does not call a tests-passed claim false when CI never ran", () => {
    const receipt = buildReceipt(evidence({
      body: "All tests pass.",
      checkRuns: [],
    }));
    expect(receipt.claims.find((claim) => claim.type === "tests_pass")?.verdict).toBe("unverifiable");
    expect(receipt.red_flags.map((flag) => flag.kind)).not.toContain("ci_never_ran");
    expect(receipt.unverified?.some((line) => /no ci checks have reported a result/i.test(line))).toBe(true);
    expect(receipt.overall).toBe("partly_checked");
  });

  it("does not treat a ts-node to node workflow edit as a warning sign", () => {
    const receipt = buildReceipt(evidence({
      body: "Switch the dashboard script from ts-node to node.",
      files: [{
        filename: ".github/workflows/update-dashboard.yml",
        status: "modified",
        additions: 1,
        deletions: 1,
        patch: "-          ts-node scripts/generate-dashboard.ts\n+          node scripts/generate-dashboard.mjs\n",
      }],
    }));
    expect(receipt.red_flags).toEqual([]);
    expect(receipt.unverified?.some((line) => line.includes("update-dashboard.yml"))).toBe(true);
    expect(receipt.overall).not.toBe("doesnt_match");
  });

  it("still rejects continue-on-error and a deleted test step", () => {
    const weakened = buildReceipt(evidence({
      body: "All tests pass.",
      files: [{
        filename: ".github/workflows/ci.yml",
        status: "modified",
        additions: 1,
        deletions: 0,
        patch: "+      continue-on-error: true\n",
      }],
    }));
    expect(weakened.red_flags.map((flag) => flag.kind)).toContain("test_command_weakened");
    expect(weakened.claims.find((claim) => claim.type === "tests_pass")?.verdict).toBe("contradicted");

    const dropped = buildReceipt(evidence({
      body: "Build the site.",
      files: [{
        filename: ".github/workflows/ci.yml",
        status: "modified",
        additions: 1,
        deletions: 1,
        patch: "-      - run: pytest\n+      - run: npm run build\n",
      }],
    }));
    expect(dropped.red_flags.map((flag) => flag.kind)).toContain("tests_deleted");
    expect(dropped.overall).toBe("doesnt_match");
  });

  it("does not confirm tests for a symbol the test diff never mentions", () => {
    const receipt = buildReceipt(evidence({
      body: "Added comprehensive unit tests for `runReviewPipeline` in the orchestrator.",
      files: [{
        filename: "packages/server/src/agents/memory-service.test.ts",
        status: "modified",
        additions: 3,
        deletions: 0,
        patch: "+  it(\"compacts memory\", () => {\n+    service.compactMemory();\n+  });\n",
      }],
    }));
    const claim = receipt.claims.find((item) => item.type === "added_tests");
    expect(claim?.verdict).toBe("unverifiable");
    expect(claim?.evidence.some((item) => item.detail?.includes("runReviewPipeline"))).toBe(true);
    expect(receipt.overall).not.toBe("doesnt_match");
  });

  it("confirms added tests when the named symbol is in the test diff", () => {
    const receipt = buildReceipt(evidence({
      body: "Added unit tests for `compactMemory`.",
      files: [{
        filename: "src/memory-service.test.ts",
        status: "modified",
        additions: 2,
        deletions: 0,
        patch: "+  it(\"compacts\", () => {\n+    service.compactMemory();\n+  });\n",
      }],
    }));
    expect(receipt.claims.find((item) => item.type === "added_tests")?.verdict).toBe("confirmed");
  });

  it("does not confirm a broad behaviour claim just because the filename is in the diff", () => {
    const receipt = buildReceipt(evidence({
      body: "The `CEEDAYS.cbl` stub implements the IBM rules.",
      files: [{
        filename: "modern/CSUTLDTC/src/CEEDAYS.cbl",
        status: "added",
        additions: 2,
        deletions: 0,
        patch: "+ IDENTIFICATION DIVISION.\n+ PROGRAM-ID. CEEDAYS.\n",
      }],
    }));
    const claim = receipt.claims.find((item) => item.text.includes("CEEDAYS"));
    expect(claim?.verdict).toBe("unverifiable");
    expect(receipt.overall).not.toBe("checks_out");
    expect(receipt.overall).not.toBe("doesnt_match");
  });

  it("puts a failed non-test check on the receipt and keeps Checks out from hiding it", () => {
    const receipt = buildReceipt(evidence({
      author: "cursor[bot]",
      body: "New and existing unit tests pass locally with my changes.",
      checkRuns: [
        { name: "test (python)", status: "completed", conclusion: "success", sha: head, url: null },
        { name: "security", status: "completed", conclusion: "failure", sha: head, url: "https://example.test/security" },
      ],
    }));
    expect(receipt.claims.find((item) => item.type === "tests_pass")?.verdict).toBe("confirmed");
    const flag = receipt.red_flags.find((item) => item.kind === "check_failed");
    expect(flag?.summary).toContain("security");
    expect(receipt.overall).toBe("doesnt_match");
    expect(receipt.summary_plain).toContain("security");
  });

  it("does not collapse two identifier sentences into one, or contradict a claim that something was left untouched", () => {
    const receipt = buildReceipt(evidence({
      body: [
        "Updating the selector now reads `params.name`.",
        "Deleting an existing task uses `it.each`.",
        "Coordinator `ImisData` is untouched (slice 2 adds sensors).",
        "Only `data.yml` changes under the `identification_full` lookup.",
      ].join("\n"),
      files: [
        {
          filename: "src/App.test.jsx",
          status: "modified",
          additions: 2,
          deletions: 0,
          patch: "+  it.each([1]);\n+  const id = params.name;\n",
        },
        {
          filename: "data.yml",
          status: "modified",
          additions: 1,
          deletions: 0,
          patch: "+ - match: hello\n",
        },
      ],
    }));
    const texts = receipt.claims.map((claim) => claim.text);
    expect(texts.some((text) => text.includes("it.each"))).toBe(true);
    expect(texts.some((text) => text.includes("params.name"))).toBe(true);
    expect(receipt.claims.find((claim) => claim.text.includes("it.each"))?.verdict).toBe("confirmed");
    expect(receipt.claims.find((claim) => claim.text.includes("params.name"))?.verdict).toBe("confirmed");
    expect(receipt.claims.find((claim) => claim.text.includes("ImisData"))?.verdict).not.toBe("contradicted");
    expect(receipt.claims.find((claim) => claim.text.includes("identification_full"))?.verdict).not.toBe("contradicted");
    expect(receipt.overall).not.toBe("doesnt_match");
  });

  it("names Jules from the bot login", () => {
    const receipt = buildReceipt(evidence({
      author: "google-labs-jules[bot]",
      body: "Updated `src/toast.ts`.",
      files: [{ filename: "src/toast.ts", status: "modified", additions: 1, deletions: 1, patch: "+ Number(id)\n" }],
    }));
    expect(receipt.agent).toEqual({ name: "Jules", detected_by: "author" });
  });

  it("extracts a Japanese pass line and a German issue line", () => {
    const japanese = buildReceipt(evidence({
      body: "- [x] Backend/API（53 テスト、すべて合格）",
      checkRuns: [],
    }));
    expect(japanese.claims.some((claim) => claim.type === "tests_pass")).toBe(true);
    expect(japanese.red_flags.map((flag) => flag.kind)).not.toContain("ci_never_ran");
    expect(japanese.overall).not.toBe("doesnt_match");

    const german = buildReceipt(evidence({
      author: "claude[bot]",
      body: "Behebt #1583",
      checkRuns: [{ name: "test", status: "completed", conclusion: "success", sha: head, url: null }],
    }));
    const issue = german.claims.find((claim) => claim.type === "fixed_issue");
    expect(issue?.text).toContain("Behebt #1583");
    expect(issue?.verdict).toBe("unverifiable");
  });

  it("does not contradict a file that the sentence only points at", () => {
    const receipt = buildReceipt(evidence({
      body: "- [x] `CHANGELOG.md` updated when user-visible behavior changed; see `VERSIONING.md` for what a patch may change",
      files: [{ filename: "CHANGELOG.md", status: "modified", additions: 2, deletions: 0, patch: "+ skill entry\n" }],
    }));
    expect(receipt.claims.some((claim) => claim.verdict === "contradicted")).toBe(false);
    expect(receipt.claims.some((claim) => claim.text.includes("VERSIONING.md") && claim.verdict === "contradicted")).toBe(false);
    expect(receipt.overall).not.toBe("doesnt_match");
    const changelog = receipt.claims.find((claim) => claim.text.includes("CHANGELOG.md"));
    expect(changelog?.verdict).toBe("confirmed");
  });

  it("does not contradict a historical filename or a third-party package name", () => {
    const historical = buildReceipt(evidence({
      body: "Reviewers asked for the handshake in `api-net-spec.js` to be removed once the drain landed. This adds `FlushBeforeExit` to the utility process.",
      files: [{
        filename: "shell/services/node/node_service.cc",
        status: "modified",
        additions: 1,
        deletions: 0,
        patch: "+ GetRemote()->FlushBeforeExit();\n",
      }],
    }));
    expect(historical.claims.some((claim) => claim.verdict === "contradicted")).toBe(false);
    expect(historical.overall).not.toBe("doesnt_match");

    const tools = buildReceipt(evidence({
      body: "Google has removed the legacy `tools` package from the Android SDK repository manifest, so that default install now fails.",
      files: [{ filename: "app/lib/useNow.ts", status: "modified", additions: 1, deletions: 1, patch: "+ const delay = 1000 - (Date.now() % 1000);\n" }],
    }));
    expect(tools.claims.some((claim) => claim.verdict === "contradicted")).toBe(false);
    expect(tools.overall).not.toBe("doesnt_match");
  });

  it("does not let a test file confirm a dist rebuild, or an env name confirm a deploy instruction", () => {
    const dist = buildReceipt(evidence({
      body: "Rebuilt dist files and added unit tests in tests/button.test.ts.",
      files: [{
        filename: "tests/button.test.ts",
        status: "modified",
        additions: 2,
        deletions: 0,
        patch: "+ test(\"disabled button\", () => {\n+   expect(true).toBe(true);\n+ });\n",
      }],
    }));
    expect(dist.claims.find((claim) => claim.type === "added_tests")?.verdict).toBe("confirmed");
    expect(dist.claims.find((claim) => /dist/i.test(claim.text))?.verdict).not.toBe("confirmed");
    expect(dist.overall).not.toBe("checks_out");

    const cloudflare = buildReceipt(evidence({
      body: "Add `ANTHROPIC_API_KEY` to the Cloudflare Pages project before deploying.",
      files: [{ filename: ".env.example", status: "modified", additions: 1, deletions: 1, patch: "+ ANTHROPIC_API_KEY=sk-ant-your_key_here\n" }],
    }));
    expect(cloudflare.claims.some((claim) => claim.verdict === "confirmed")).toBe(false);
    expect(cloudflare.overall).not.toBe("doesnt_match");
  });

  it("reads a pass count, names Codex from the footer, and skips Jules boilerplate", () => {
    const counted = buildReceipt(evidence({
      body: "vitest run on the parser — 27 passed.",
      checkRuns: [],
    }));
    expect(counted.claims.some((claim) => claim.type === "tests_pass")).toBe(true);
    expect(counted.red_flags.map((flag) => flag.kind)).not.toContain("ci_never_ran");
    expect(counted.overall).not.toBe("doesnt_match");

    const codex = buildReceipt(evidence({
      author: "dvdksn",
      body: "Explain how kit context files are stored.\n\nGenerated by Codex",
      files: [{ filename: "content/use-kits.md", status: "modified", additions: 2, deletions: 0, patch: "+ /usr/share/sandbox/kit/\n" }],
    }));
    expect(codex.agent).toEqual({ name: "OpenAI Codex", detected_by: "body_marker" });

    const jules = buildReceipt(evidence({
      author: "google-labs-jules[bot]",
      body: [
        "Changes",
        "Updated `src/button.css` to skip disabled buttons.",
        "PR created automatically by Jules for task 123",
        "When you start a review, I'll add a emoji to each comment.",
        "I'll push a commit with your requested changes shortly after.",
      ].join("\n"),
      files: [{ filename: "src/button.css", status: "modified", additions: 1, deletions: 1, patch: "+ :not(:disabled)\n" }],
    }));
    const texts = jules.claims.map((claim) => claim.text).join("\n");
    expect(texts).not.toMatch(/PR created automatically/i);
    expect(texts).not.toMatch(/I'll add/i);
    expect(texts).not.toMatch(/I'll push a commit/i);
    expect(jules.claims.some((claim) => claim.text === "Changes")).toBe(false);
    expect(jules.claims.find((claim) => claim.text.includes("button.css"))?.verdict).toBe("confirmed");
  });

  it("shows an open changes-requested review without calling the diff dishonest", () => {
    const open = buildReceipt(evidence({
      body: "Updated `src/audit.ts`.",
      files: [{ filename: "src/audit.ts", status: "modified", additions: 1, deletions: 0, patch: "+ countEnv()\n" }],
      reviews: [{ author: "sam", state: "CHANGES_REQUESTED", submittedAt: "2026-10-01T00:00:00Z" }],
    }));
    expect(open.red_flags).toEqual([]);
    expect(open.overall).toBe("partly_checked");
    expect(open.summary_plain).toContain("sam asked for changes");

    const cleared = buildReceipt(evidence({
      body: "Updated `src/audit.ts`.",
      files: [{ filename: "src/audit.ts", status: "modified", additions: 1, deletions: 0, patch: "+ countEnv()\n" }],
      reviews: [
        { author: "sam", state: "CHANGES_REQUESTED", submittedAt: "2026-10-01T00:00:00Z" },
        { author: "sam", state: "APPROVED", submittedAt: "2026-10-02T00:00:00Z" },
      ],
    }));
    expect(cleared.overall).toBe("checks_out");
  });

  it("notes a failed review bot or preview deploy and still flags a real check", () => {
    const preview = buildReceipt(evidence({
      body: "Updated `src/parser.ts`.",
      files: [{ filename: "src/parser.ts", status: "modified", additions: 1, deletions: 0, patch: "+ keepCalories()\n" }],
      checkRuns: [
        { name: "test", status: "completed", conclusion: "success", sha: head, url: null },
        { name: "netlify/rxbetter/deploy-preview", status: "completed", conclusion: "failure", sha: head, url: null },
        { name: "claude-review", status: "completed", conclusion: "failure", sha: head, url: null },
      ],
    }));
    expect(preview.red_flags.map((flag) => flag.kind)).not.toContain("check_failed");
    expect(preview.overall).toBe("partly_checked");
    expect(preview.unverified?.some((line) => line.includes("deploy-preview") && line.includes("claude-review"))).toBe(true);

    const demo = buildReceipt(evidence({
      body: "Keep list parameters unique.",
      checkRuns: [{ name: "Demo app", status: "completed", conclusion: "failure", sha: head, url: null }],
    }));
    expect(demo.red_flags.map((flag) => flag.kind)).not.toContain("check_failed");
    expect(demo.unverified?.some((line) => line.includes("Demo app"))).toBe(true);
    expect(demo.overall).not.toBe("doesnt_match");
  });

  it("confirms a workflow path the sentence says it introduced", () => {
    const receipt = buildReceipt(evidence({
      body: "Introduces `.github/workflows/ghcr-publish.yml`.",
      files: [{
        filename: ".github/workflows/ghcr-publish.yml",
        status: "added",
        additions: 4,
        deletions: 0,
        patch: "+ on: pull_request\n+ images: ghcr.io/acme/widget\n",
      }],
    }));
    expect(receipt.claims.find((claim) => claim.text.includes("ghcr-publish.yml"))?.verdict).toBe("confirmed");
    expect(receipt.red_flags).toEqual([]);
  });

  it("does not turn a repeated file sentence into an unverifiable claim", () => {
    const receipt = buildReceipt(evidence({
      body: [
        "Adds a dedicated workflow to publish the image.",
        "",
        "- Introduces `.github/workflows/ghcr-publish.yml`.",
      ].join("\n"),
      files: [{
        filename: ".github/workflows/ghcr-publish.yml",
        status: "added",
        additions: 4,
        deletions: 0,
        patch: "+ on: pull_request\n+ images: ghcr.io/acme/widget\n",
      }],
    }));
    const introduce = receipt.claims.find((claim) => claim.text.includes("Introduces"));
    expect(introduce?.verdict).not.toBe("unverifiable");
    expect(receipt.claims.some((claim) => claim.verdict === "confirmed" && claim.text.includes("ghcr-publish.yml") || claim.evidence.some((item) => item.file?.includes("ghcr-publish.yml")))).toBe(true);
    expect(receipt.overall).not.toBe("doesnt_match");
  });

  it("does not contradict a file the sentence compares with, or a spec it says it is implementing", () => {
    const form = buildReceipt(evidence({
      body: "The source form adds class=\"form\" to match `ref.component.html`.",
      files: [{
        filename: "src/blog-entry.component.html",
        status: "modified",
        additions: 1,
        deletions: 1,
        patch: "+ <form class=\"form\" [origin]=\"origin\">\n",
      }],
    }));
    expect(form.claims.some((claim) => claim.verdict === "contradicted")).toBe(false);
    expect(form.overall).not.toBe("doesnt_match");

    const spec = buildReceipt(evidence({
      body: "Implements docs/design/error-and-state-conventions.md for `src/interactions.rs`.",
      files: [{ filename: "src/interactions.rs", status: "modified", additions: 2, deletions: 0, patch: "+ fn aim() {}\n" }],
    }));
    expect(spec.claims.some((claim) => claim.verdict === "contradicted")).toBe(false);
    expect(spec.claims.find((claim) => claim.text.includes("interactions.rs"))?.verdict).toBe("unverifiable");
    expect(spec.overall).not.toBe("doesnt_match");
  });

  it("does not contradict a symbol that only explains someone else's behaviour", () => {
    const receipt = buildReceipt(evidence({
      body: "Since the upgrade, a stream adds `durationMs` when `timestamp` is recent.",
      files: [{
        filename: "src/provider-admission.test.ts",
        status: "modified",
        additions: 1,
        deletions: 0,
        patch: "+ expect(event.durationMs).toBe(12);\n",
      }],
    }));
    expect(receipt.claims.some((claim) => claim.verdict === "contradicted")).toBe(false);
    expect(receipt.overall).not.toBe("doesnt_match");
  });

  it("confirms an only-this-file claim when nothing else changed, and withholds it when something else did", () => {
    const only = buildReceipt(evidence({
      body: "Only `useNow.ts` was touched.",
      files: [{ filename: "app/lib/useNow.ts", status: "modified", additions: 1, deletions: 1, patch: "+ const delay = 16;\n" }],
    }));
    expect(only.claims.find((claim) => claim.text.includes("useNow.ts"))?.verdict).toBe("confirmed");

    const extra = buildReceipt(evidence({
      body: "Only `queries.py` changes.",
      files: [
        { filename: "queries.py", status: "modified", additions: 1, deletions: 0, patch: "+ study_condition_codes()\n" },
        { filename: "mesh_overrides.csv", status: "modified", additions: 1, deletions: 0, patch: "+ extra,row\n" },
      ],
    }));
    const claim = extra.claims.find((item) => item.text.includes("queries.py"));
    expect(claim?.verdict).toBe("unverifiable");
    expect(claim?.evidence.some((item) => /not only that change/i.test(item.detail ?? ""))).toBe(true);
    expect(extra.overall).not.toBe("doesnt_match");
    expect(extra.overall).not.toBe("checks_out");
  });

  it("contradicts a passing test count when the test check failed, and does not also confirm that sentence", () => {
    const receipt = buildReceipt(evidence({
      body: "942 tests pass.",
      files: [
        { filename: "src/store.ts", status: "modified", additions: 1, deletions: 1, patch: "+ export const rows = 1;\n" },
        { filename: "src/index.ts", status: "modified", additions: 1, deletions: 0, patch: "+ export { rows };\n" },
      ],
      checkRuns: [{ name: "test-web", status: "completed", conclusion: "failure", sha: head, url: null }],
    }));
    const pass = receipt.claims.filter((claim) => claim.text.includes("942"));
    expect(pass.map((claim) => claim.type)).toEqual(["tests_pass"]);
    expect(pass[0]?.verdict).toBe("contradicted");
    expect(receipt.claims.some((claim) => claim.verdict === "confirmed")).toBe(false);
    expect(receipt.overall).toBe("doesnt_match");
  });

  it("counts an inline Rust test and a Go test file as added tests", () => {
    const rust = buildReceipt(evidence({
      body: "Added test cases for the digest.",
      files: [{
        filename: "src/util/sha1.rs",
        status: "modified",
        additions: 4,
        deletions: 0,
        patch: "+ #[test]\n+ fn test_sha1_digest() {\n+     assert_eq!(1, 1);\n+ }\n",
      }],
    }));
    expect(rust.claims.find((claim) => claim.type === "added_tests")?.verdict).toBe("confirmed");
    expect(rust.overall).not.toBe("doesnt_match");

    const go = buildReceipt(evidence({
      body: "Added tests for the parser.",
      files: [{
        filename: "parser/scan_test.go",
        status: "added",
        additions: 3,
        deletions: 0,
        patch: "+ func TestScan(t *testing.T) {\n+   if got != want { t.Fatal(got) }\n+ }\n",
      }],
    }));
    expect(go.claims.find((claim) => claim.type === "added_tests")?.verdict).toBe("confirmed");
  });

  it("confirms an explicit edit of the file that actually changed", () => {
    const receipt = buildReceipt(evidence({
      body: "Updated `src/app.ts`.",
      files: [{ filename: "src/app.ts", status: "modified", additions: 1, deletions: 0, patch: "+ export const ok = true;\n" }],
      checkRuns: [{ name: "test", status: "completed", conclusion: "success", sha: head, url: null }],
    }));
    expect(receipt.claims.find((claim) => claim.type === "file_changed")?.verdict).toBe("confirmed");
    expect(receipt.overall).toBe("checks_out");
  });

  it("keeps a failed security check as Doesn't match and leaves an unrelated check as a note", () => {
    const security = buildReceipt(evidence({
      body: "Updated `src/app.ts`.",
      files: [{ filename: "src/app.ts", status: "modified", additions: 1, deletions: 0, patch: "+ export const ok = true;\n" }],
      checkRuns: [
        { name: "test", status: "completed", conclusion: "success", sha: head, url: null },
        { name: "CodeQL", status: "completed", conclusion: "failure", sha: head, url: null },
      ],
    }));
    expect(security.red_flags.map((flag) => flag.kind)).toContain("check_failed");
    expect(security.overall).toBe("doesnt_match");

    const cla = buildReceipt(evidence({
      body: "Updated `src/app.ts`.",
      files: [{ filename: "src/app.ts", status: "modified", additions: 1, deletions: 0, patch: "+ export const ok = true;\n" }],
      checkRuns: [
        { name: "test", status: "completed", conclusion: "success", sha: head, url: null },
        { name: "cla/google", status: "completed", conclusion: "failure", sha: head, url: null },
      ],
    }));
    expect(cla.red_flags).toEqual([]);
    expect(cla.unverified?.some((line) => line.includes("cla/google") && line.includes("do not by themselves"))).toBe(true);
    expect(cla.overall).toBe("partly_checked");
  });
});

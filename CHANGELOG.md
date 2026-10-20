# Changelog

## 0.1.1 — 2026-10-20

- Public contact is the GitHub user omsocll and [@kickscosmo](https://x.com/kickscosmo). Personal names, email addresses, and portfolio links are gone from the current files.
- GitHub Actions from other repositories are pinned to a commit. CI reads the repository and does not write it. Dependabot watches npm and GitHub Actions. `npm audit` is clean: the Actions toolkit is on `@actions/core` 3, esbuild is past the advisory, and the test runner is Vitest 5.
- `v0` moves to this release. The `v0.1.0` tag stays where it was.

## 0.1.0 — 2026-10-20

First release of the GitHub Action and the CLI.

- Writes a plain-English receipt for an AI agent pull request from the diff, the check runs on that commit, and the review state.
- Three verdicts: Checks out, Partly checked, Doesn't match. Doesn't match comes from hard evidence: a failed test, build, lint, or security check; a tests-passed claim that CI contradicts; or deleted, skipped, or weakened tests.
- Recognises Copilot, Devin, Cursor, Claude, Jules, and Codex, including a `Generated-by: codex` or `Assisted-by: codex` line in the body or a commit message.
- Known limits, measured in [docs/evaluation.md](docs/evaluation.md): tests moved between files still read as deleted, a claim can be confirmed by an incidental word in the diff, and some pull requests yield no claims. On a fresh set the verdict was fair on 19 of 20. Across 79 pull requests in the four latest scored sets it has not been too rosy. Maturity is alpha.

Not published to npm. Not listed in the GitHub Marketplace. The repository stays private until that is changed on purpose.

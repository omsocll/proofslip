# proofslip on real agent pull requests

Hand review of proofslip 0.1.0 (`agent-receipt/v0`) on public pull requests written by AI coding agents. The sample is not the demos in this repository. One reviewer, 19 October 2026. The carddemo port is about 2,900 added lines; it was judged on the claims the receipt scored, the check runs, and the files GitHub marked too large to scan.

The 20/20 figure in the first table is the first tuned set: the same pull requests the first five fixes were adjusted on. The [held-out set](#held-out-set) was the next 20, and it scored 17/20 before any further fixes. Those fixes were then applied, that set was re-run, and a [third set](#fresh-set) was chosen from repos in neither sample. That third set scored 15/20. A later policy change stops a missing filename from condemning a pull request. The three earlier sets were re-run on that build, and a [fourth set](#fourth-set) was chosen from repos in none of them. The fourth set is the number to use: fair on 19 of 20. Across every set scored after the first morning, including these re-runs, proofslip has not been too rosy.

The first run is the receipt engine before the five fixes. The second run is the same 20 pull requests after those fixes, with `node dist/cli.js receipt`. Nineteen heads were unchanged. [mohammadraufzahed/omp-fest#15](https://github.com/mohammadraufzahed/omp-fest/pull/15) moved from `cc3e2a2c33` to `fb36cc461f` between the two runs, so that one comparison is the same pull request, not the same commit.

## Before and after

| | Before | After |
|---|---|---|
| CLI finished (exit 0) | 20/20 | 20/20 |
| Verdict fair | 10/20 | 20/20 |
| Verdict too rosy | 3/20 | 0/20 |
| Verdict too harsh | 7/20 | 0/20 |
| Claims extracted | 15 | 57 |
| Pull requests with zero claims | 9/20 | 4/20 |
| False reassurances | 2 | 2 |
| False alarms | 3 | 0 |
| Crashes or rate-limit errors during the receipt runs | 0 | 0 |

"Fair" means the overall verdict does not pretend a specific false sentence was proven, and does not condemn the pull request for a flag that invents a problem. Partly checked with nothing extracted is an abstention. It is fair, and it is not a check of the change.

The overall verdict on this sample is in a different place than it was this morning. The false alarms are gone. The false reassurances are not: the two old ones were fixed, and two new ones showed up. Claim text is still noisier than the verdict.

**Maturity: alpha.** The verdict is usable as a first read on this set. A single confirmed sentence is not yet something to trust unsupervised.

## What changed between the runs

1. A backtick token is a filename only when it has a path or a known extension. `it.each`, `params.name`, and `carddemo.clock.fixed` are looked up in the patch text.
2. `ci_never_ran` fires only when the pull request claims tests, lint, a build, or checks passed, and GitHub has no result. A repository with no Actions and no such claim stays Partly checked.
3. `|| true`, `continue-on-error: true`, and a removed test step are still red flags. A workflow edit that does not do those things is a note. It does not force Doesn't match.
4. "Added tests for `runReviewPipeline`" is confirmed only when that symbol is in the changed tests. "The `CEEDAYS.cbl` stub implements the IBM rules" stays unverifiable even though the file is in the diff. A sentence that says something was left untouched is not contradicted just because the name is absent.
5. A failed check that is not already explained by a pass claim is a `check_failed` flag and forces Doesn't match. Jules (`google-labs-jules[bot]`), Gemini Code Assist, Amazon Q, OpenHands, Sourcery, and Ellipsis are named. Extraction also hears `すべて合格`, `Behebt #N`, `Corrige #N`, `Todos os testes passaram`, `ran pnpm test`, and bullets such as "lets users…".

## Per pull request

| Pull request | Agent | Before | After | Hand, after |
|---|---|---|---|---|
| [padel-torneo#1](https://github.com/Brokenedo/padel-torneo/pull/1) | Copilot | Checks out, too rosy | Partly checked, 3 claims | Fair. "Lets users select several players" is unverifiable. The filename claim is still confirmed, and it no longer carries the whole receipt. |
| [pymath-utils#4](https://github.com/researchstation/pymath-utils/pull/4) | Copilot | Doesn't match, too harsh | Partly checked, 4 claims | Fair. `ci_never_ran` is gone. "Fixes #3" stays unverifiable. See the weak confirmation below. |
| [copilot-quality-harness#22](https://github.com/cocomomojo/copilot-quality-harness/pull/22) | Copilot | Doesn't match, too harsh | Doesn't match, 1 claim, `check_failed` | Fair. The `ts-node` → `node` edit is no longer the reason. `すべて合格` was extracted, and `Test Coverage Analysis` failed on this commit. |
| [project-oolong#539](https://github.com/RVNUG/project-oolong/pull/539) | Copilot | Partly checked, fair | Partly checked, 1 claim | Fair. The jest-dom sentence is now a claim, and it is left unverifiable. Nineteen green checks are not cited, because the body never said the tests passed. |
| [tool-usage-map#5](https://github.com/coastalme/tool-usage-map/pull/5) | Copilot | Doesn't match, too harsh | Partly checked, 0 claims | Fair. No tests-passed claim, no CI, no flag. |
| [omp-fest#15](https://github.com/mohammadraufzahed/omp-fest/pull/15) | Devin | Doesn't match, too harsh | Partly checked, 0 claims | Fair on the new head. The old false alarm on `params.name` is gone. The new body produced no claims. |
| [zureq-shopper#32](https://github.com/dzienisz/zureq-shopper/pull/32) | Devin | Partly checked, fair | Partly checked, 1 claim | Fair. "No code changes beyond the logo update" is unverifiable, not contradicted. |
| [OpenHandsNET#143](https://github.com/afonsoft/OpenHandsNET/pull/143) | Devin | Partly checked, fair | Partly checked, 0 claims | Fair. The Portuguese crash note still does not match a test or fix phrase. |
| [repo-task1#7](https://github.com/vijayazuredemo/repo-task1/pull/7) | Devin | Doesn't match, too harsh | Doesn't match, 9 claims, `ci_never_ran` | Fair as a verdict. `it.each` is confirmed from the patch. Doesn't match is now because the body says `npm test`, lint, and build passed, and no checks ran. One sentence is still a false reassurance. |
| [carddemo#35](https://github.com/COG-GTM/Agazzi-aws-mainframe-modernization-carddemo/pull/35) | Devin | Doesn't match, too harsh | Partly checked, 5 claims | Fair. `carddemo.clock.fixed` and `carddemo.clock.zone` are in the patch, so they are confirmed. "Implements the IBM rules" is unverifiable. |
| [cognium-dev#863](https://github.com/cogniumhq/cognium-dev/pull/863) | Cursor | Partly checked, fair | Partly checked, 0 claims | Fair. The test-plan bullets still do not say "added tests" or "tests pass". |
| [sentry#127998](https://github.com/getsentry/sentry/pull/127998) | Cursor | Partly checked, missed `Backend` | Doesn't match, `check_failed` | Fair. The receipt names `pre-commit lint`, `getsentry dispatch`, `backend typing`, and `Backend`. |
| [asap-protocol#410](https://github.com/asap-protocol/asap-protocol/pull/410) | Cursor | Checks out, too rosy | Doesn't match, `check_failed` | Fair. Unit-test claims stay confirmed. `security` failed and the receipt says so. |
| [hass-meteoswiss-weather#198](https://github.com/chriguschneider/hass-meteoswiss-weather/pull/198) | Claude | Partly checked, fair | Partly checked, 2 claims | Fair. "Closes #195" is unverifiable. "`ImisData` is untouched" is not contradicted just because the name is absent. |
| [anime-kalender-de#1584](https://github.com/danielzaiser91/anime-kalender-de/pull/1584) | Claude | Partly checked, fair | Partly checked, 1 claim | Fair. "Behebt #1583" is extracted and left unverifiable. The `CHANGES_REQUESTED` review is still invisible. |
| [opensanctions#5948](https://github.com/opensanctions/opensanctions/pull/5948) | Claude | Checks out, fair | Partly checked, 3 claims | Fair, and stricter. The only-this-file sentence is unverifiable because `identification_full` is not in the hunk, not because the file is missing. |
| [russian-monopoly-local#457](https://github.com/Jokersochi/russian-monopoly-local/pull/457) | Jules | Checks out, fair | Partly checked, 8 claims | Fair. The agent is named Jules. The new chart tests are confirmed. "Ran pnpm test" stays unverifiable: the green check is named `quality`, not test. `build` is confirmed. |
| [vibe-code#162](https://github.com/juninmd/vibe-code/pull/162) | Jules | Checks out, too rosy | Doesn't match, 5 claims | Fair as a verdict. Tests for `runReviewPipeline` are contradicted. A second tests sentence is still confirmed and should not be. |
| [StaticForge#335](https://github.com/UiharuKazari2008/StaticForge/pull/335) | Jules | Doesn't match, too harsh | Partly checked, 3 claims | Fair. No tests-passed claim, so no `ci_never_ran`. The three claims are Jules' footer, not the fix. |
| [what-money-cant-buy#124](https://github.com/talfarouriarte-cloud/what-money-cant-buy/pull/124) | Claude | Partly checked, fair | Partly checked, 1 claim | Fair. "Closes #123" is unverifiable. The `useMemo` dependency change was not extracted. |

## False reassurances that remain

Both are confirmed sentences that are not what the diff shows. The overall verdict on each pull request is still Doesn't match for a different, real reason.

**[vibe-code#162](https://github.com/juninmd/vibe-code/pull/162).** "Replaced the previous dummy test with tests covering successful processing, blocker detection, and output filtering" is confirmed because `memory-service.test.ts` changed. The patch adds `compactMemory` and `getRecentContext` tests. The sentence has no backtick symbol, so the symbol check never runs. The `runReviewPipeline` sentence in the same body is correctly contradicted.

**[repo-task1#7](https://github.com/vijayazuredemo/repo-task1/pull/7).** "Mutation-checked locally (each reverted): …" is confirmed because the backtick word `completed` occurs in the test patch. The sentence is about experiments that were reverted, so those edits are not the change. `it.each` itself is now correctly found in the patch.

A third confirmation is weak rather than false. On [pymath-utils#4](https://github.com/researchstation/pymath-utils/pull/4), "Adds a `multiply(a, b)` function … with `ValueError`" is confirmed because `ValueError` appears in `.github/copilot-instructions.md`. The function is in the diff. The receipt points at the wrong file. `multiply(a, b)` is not treated as a symbol, because of the parentheses.

The two false reassurances from the first run are fixed. [vibe-code#162](https://github.com/juninmd/vibe-code/pull/162) no longer confirms tests for `runReviewPipeline`. [carddemo#35](https://github.com/COG-GTM/Agazzi-aws-mainframe-modernization-carddemo/pull/35) no longer confirms "implements the IBM rules" from the filename.

## False alarms

None in the second run. The three from the first run (`it.each`, `params.name`, `carddemo.clock.fixed` / `carddemo.clock.zone`) are either confirmed from the patch or, on omp-fest, no longer extracted because the head moved.

[opensanctions#5948](https://github.com/opensanctions/opensanctions/pull/5948) came close. The first cut of the patch search contradicted "under the `identification_full` lookup" because that key is not inside the hunk. The shipped rule does not contradict a sentence when the named file is present and a side identifier is missing. The sentence stays unverifiable. That is the right failure: we did not prove the 19 options, and we did not call the sentence false.

## What got worse

**Boilerplate is now a claim.** Jules' footer ("When you start a review, I'll add a 👀 emoji", "I'll push a commit") is extracted on StaticForge, vibe-code, and the chart fix, because "add" and "created" look like change verbs. Sentry's contribution license and asap-protocol's checklist items show up the same way. They are unverifiable, so they do not force Doesn't match. They do make the receipt longer, and they are why claim count went from 15 to 57. A lot of that increase is real prose. A lot of it is the template.

**A green check named `quality` does not confirm "ran pnpm test".** On the Jules chart pull request that is honest, and it is also why a previously fair Checks out became Partly checked. The build check does confirm "ran pnpm build".

**More of the body is visible, including clauses we cannot judge.** asap-protocol's "no production code changes" and zureq's "no code changes beyond the logo" are unverifiable rather than checked against the file list. That is safer than confirming them, and it is a missed check.

## Performance

Second run: 20/20 exit 0, 1.1s to 9.4s. getsentry/sentry#127998 was slowest (86 checks, 9.4s). carddemo was 38 files and +2,924 lines in 1.5s, with the same four golden files left unscanned. GitHub returned 422 for several `pull/N/merge` check-run lookups. The CLI logged that and still wrote the receipt from the head commit. No rate-limit errors in the loop.

## What is still wrong, in order

1. A tests sentence with no backtick symbol is confirmed whenever any test file changes. That is the vibe-code false reassurance.
2. Any backtick word, including `completed` or `ValueError`, can confirm the whole sentence from whichever file happens to contain it.
3. Footer and license boilerplate is extracted as unverifiable claims.
4. "No code changes" and "only this file" are not checked against the file list. One is left unverifiable; the other was unverifiable here because a side identifier was missing.
5. Reviews are still unread, so anime-kalender-de's `CHANGES_REQUESTED` does not appear. A check named `quality` is not treated as a test run.

## Held-out set

This section is the score before the fixes below. The [re-run](#held-out-set-re-run) is the same pull requests after those fixes, and it is labelled tuned. The [fresh set](#fresh-set) is the number to use.

Chosen before this run, on 19 October 2026, from public pull requests that are not in the tuned set and not in those repositories. Mix: Copilot 4, Devin 4, Claude 4, Cursor 4, Jules 3, and one Codex pull request. Mix of merged, closed-unmerged, failing checks, and review pushback. The CLI was `node dist/cli.js receipt` on current `main`, with no product change during the run. Same hand rules as above. "Fair" means the overall verdict does not pretend a specific false sentence was proven, and does not condemn the pull request for a flag that invents a problem. Partly checked with nothing extracted is an abstention.

The public pull requests authored by `chatgpt-codex-connector[bot]` were a permission probe and README whitespace. The Codex row is a human-committed docs change whose body ends with "Generated by Codex".

| | Held-out |
|---|---|
| CLI finished (exit 0) | 20/20 |
| Verdict fair | 17/20 |
| Verdict too rosy | 0/20 |
| Verdict too harsh | 3/20 |
| Claims extracted | 62 |
| Pull requests with zero claims | 3/20 |
| False reassurances | 2 |
| False alarms | 3 |
| Crashes or rate-limit errors during the receipt runs | 0 |

This is worse than the tuned 20/20. False alarms came back, and three overall verdicts are too harsh. False reassurances stayed at 2, on different sentences. Three pull requests still produced no claims. The tuned result does not travel.

**Maturity stays alpha.** On pull requests the scorer has not seen, the verdict is a fair first read 17 times out of 20. The three misses are one bug: a mentioned name treated as a missing edit.

### Per pull request

| Pull request | Agent | Receipt | Hand |
|---|---|---|---|
| [mcp-shell#1](https://github.com/callmenet/mcp-shell/pull/1) | Copilot | Partly checked, 2 claims | Fair. The workflow publishes to GHCR and does not push on a pull request. "Introduces `.github/workflows/ghcr-publish.yml`" stayed unverifiable even though that file is the whole diff. |
| [techhub#590](https://github.com/techhubms/techhub/pull/590) | Copilot | Doesn't match, `check_failed` | Fair. `TokenCredential` is in the client. Integration tests, security scan, lint, build, and unit tests failed on this commit. |
| [paradigma#306](https://github.com/biomarkersParkinson/paradigma/pull/306) | Copilot | Doesn't match, `check_failed` | Fair. `subset_data` and the new tests are in the diff. "First-class subsetting" stayed unverifiable. `Build and test` failed. The checks API listed nothing; the Actions run on this commit had failed. |
| [Norwegian-tycoon#15](https://github.com/jwlei/Norwegian-tycoon/pull/15) | Copilot | Partly checked, 1 claim | Fair, and thin. The localStorage backup is in `js/shared.js` and the tests. The sentence was not confirmed. |
| [hue-sdk#293](https://github.com/hue-run/hue-sdk/pull/293) | Devin | Doesn't match, no flag | Too harsh. A checked box, "`CHANGELOG.md` updated … see `VERSIONING.md`", was contradicted because `VERSIONING.md` is not in the diff. `CHANGELOG.md` is. |
| [1N599-Labs#7](https://github.com/hmuniraju1981/1N599-Labs/pull/7) | Devin | Doesn't match, `ci_never_ran` | Fair as a verdict. The body says lint, `tsc`, and build pass, and no checks ran. One sentence is a false reassurance. |
| [observability-sdk#834](https://github.com/launchdarkly/observability-sdk/pull/834) | Devin | Partly checked, 7 claims | Fair. The Nest 11, `toml`, and `basic-ftp` bumps are in the manifests. The six files are locks and package manifests, so "no application or SDK source changes" is true. A second copy of that sentence stayed unverifiable. No completed failure on the head. |
| [roentgen#146](https://github.com/kouiso/roentgen/pull/146) | Devin | Partly checked, 1 claim | Fair, and thin. Only "Closes #148" was extracted. The Japanese write-up was not. A `CHANGES_REQUESTED` review is invisible. |
| [Cue-Clock#261](https://github.com/yanukadeneth99/Cue-Clock/pull/261) | Claude | Doesn't match, no flag | Too harsh. "Only `useNow.ts` touched" is true, and the ticker is the self-correcting timeout. A later comment about Google's Android `tools` package was contradicted because `tools` is not a file in the diff. CI on this commit is green. |
| [electron#55082](https://github.com/electron/electron/pull/55082) | Claude | Doesn't match, no flag | Too harsh. `FlushBeforeExit` is in the four changed files. A follow-up about the older `api-net-spec.js` removal was contradicted because that file is not in this diff. `CHANGES_REQUESTED` is invisible. No failed workflow. |
| [Finally-3#8](https://github.com/begwanisiddharth-eng/Finally-3/pull/8) | Claude | Doesn't match, `check_failed` | Fair. Consecutive failures, the dead poll task, and the cooldown latch are in the client, the manager, and the tests. "119 tests pass" stayed unverifiable. The only check is `claude-review`, and it failed. |
| [plugin-dev#87](https://github.com/kylesnowschwartz/plugin-dev/pull/87) | Claude | Partly checked, 6 claims | Fair. `claude-code-facts.json` changes only `claude_code_version`. "0 `DRIFT` lines" is written in the compatibility doc. "Quitting asks … unpushed commits" is in `CHANGELOG.md`; the receipt cited `create-worktree.sh`. |
| [ux-datatables#580](https://github.com/pentiminax/ux-datatables/pull/580) | Cursor | Doesn't match, 0 claims, `check_failed` | Fair. `Demo app` failed inside the test workflow. The body describes the bug, and none of it became a claim. |
| [task_management#16](https://github.com/FLNYoshidaRyuta/task_management/pull/16) | Cursor | Partly checked, 0 claims | Fair. Abstention. The change is a Japanese task note. |
| [mattermost#39243](https://github.com/mattermost/mattermost/pull/39243) | Cursor | Partly checked, 6 claims | Fair. The audit files did change. "Not changed: … `AdvancedLoggingJSON`" was confirmed because that name is still in an edited warning. Weak, not false. Three `CHANGES_REQUESTED` reviews are invisible. |
| [rxbetter-core#85](https://github.com/pauljaworski/rxbetter-core/pull/85) | Cursor | Doesn't match, `check_failed` | Fair. The calorie-split tests are in the diff. Netlify's deploy preview, redirect rules, header rules, and pages check failed. "27 passed" on the vitest line was not extracted. |
| [beercss#655](https://github.com/beercss/beercss/pull/655) | Jules | Partly checked, 6 claims | Fair as a verdict. `:not(:disabled, [disabled])` is in `button.css` and `navigation.css`, and `button.test.ts` covers a disabled button. One sentence is a false reassurance. The Jules footer is three unverifiable claims. |
| [python-ddd-inventory#165](https://github.com/bjohnson1279/python-ddd-inventory/pull/165) | Jules | Doesn't match, `check_failed` | Fair. `getaddrinfo` and the private-address block are in `integration_service.py`, and that sentence stayed unverifiable. `PostgreSQL costing and tenant security contracts` and `Acknowledged Kafka outbox delivery` failed. |
| [copilot-plus#100](https://github.com/juninmd/copilot-plus/pull/100) | Jules | Doesn't match, `check_failed` | Fair. `security-scanner.ts` has the secret, SQL injection, XSS, eval, command injection, path traversal, and weak-crypto rules. `check / validate` failed. The receipt confirmed the sentence from the wiring files, which do call the scanner. |
| [docs#26380](https://github.com/docker/docs/pull/26380) | Codex, not detected | Partly checked, 0 claims | Fair. Abstention. The author is `dvdksn`. The body says "Generated by Codex" and the kit paths are in the markdown. Neither the agent nor the sentence was picked up. |

### False reassurances

Both are confirmed sentences the diff does not show. Neither one turned the overall verdict into Checks out.

**[beercss#655](https://github.com/beercss/beercss/pull/655).** "Rebuilt dist files and added unit tests in `tests/button.test.ts`" is confirmed because the test file changed. The tests are real. No dist file is in the diff.

**[1N599-Labs#7](https://github.com/hmuniraju1981/1N599-Labs/pull/7).** "Add `ANTHROPIC_API_KEY` to the Cloudflare Pages project before deploying" is confirmed because the name is in `.env.example`. That is an instruction to the operator, not a change the diff performed.

A few confirmations are weak and not counted. On plugin-dev, the unpushed-commits sentence is in `CHANGELOG.md` and the receipt cited `create-worktree.sh`. On mattermost, "not changed" was confirmed because `AdvancedLoggingJSON` still appears in a warning. On Finally-3, "implements the degraded-mode policy" was confirmed from the symbol names, and the consecutive-failure counter, dead task, and cooldown are actually in the diff.

### False alarms

Three. Each one is the only reason the receipt says Doesn't match.

**[hue-sdk#293](https://github.com/hue-run/hue-sdk/pull/293).** "`CHANGELOG.md` updated when user-visible behavior changed; see `VERSIONING.md`" was contradicted because `VERSIONING.md` is not in the diff. The changelog file is. "See this other file" is not a claim that it was edited.

**[Cue-Clock#261](https://github.com/yanukadeneth99/Cue-Clock/pull/261).** The agent's own follow-up explains that Android SDK setup fails because Google removed the legacy `tools` package. That was contradicted because `tools` is not in the diff. It is a package name in a CI note, and the workflow on this commit is green.

**[electron#55082](https://github.com/electron/electron/pull/55082).** A follow-up says reviewers asked for the handshake in `api-net-spec.js` to be removed in an earlier pull request, which is why a Windows test still flakes. That was contradicted because `api-net-spec.js` is not in this diff. The file this pull request adds is `FlushBeforeExit`, and it is there.

### What this set shows that the tuned set did not

**A mention is still enough to condemn the pull request.** The tuned rule stops contradicting a sentence when the named file is present and a side identifier is missing. It does not stop contradicting a sentence whose only backtick is a name the author did not claim to edit. That is the whole of the 17/20 gap.

**One token still confirms the whole sentence.** An example env var confirms a Cloudflare instruction. A test file confirms "rebuilt dist".

**Codex is invisible unless the GitHub user is the bot.** "Generated by Codex" is not a trailer the detector reads, so the receipt names `dvdksn` and extracts nothing.

**The same boilerplate is still a claim.** Jules' footer is on beercss, the inventory webhook, and copilot-plus. Headings such as "Changes" and "What changed" are claims too. They do not force Doesn't match. They are why 62 claims is not 62 facts.

**"N passed" and "Add …" are still easy to miss.** rxbetter's "27 passed" and Norwegian-tycoon's localStorage bullet did not become confirmed claims. A path that is the entire diff, `ghcr-publish.yml`, stayed unverifiable beside a prose sentence about the same file that was confirmed.

**Reviews are still unread.** electron, mattermost, and roentgen had changes requested. The receipt does not say so.

**A failed non-test check still forces Doesn't match, and on this set that was fair.** techhub's unit, lint, build, and security checks failed. paradigma's `Build and test` failed. The inventory contract jobs failed. copilot-plus `validate` failed. ux-datatables' demo job failed. Finally-3's only check is `claude-review`. rxbetter's failures are Netlify preview checks. Those are real red results, so Doesn't match matches the rule. It is also the harsh edge: a review bot or a deploy preview is enough.

### Performance

Held-out run: 20/20 exit 0, 1.2s to 11.5s. electron/electron#55082 was slowest (11.5s). No rate-limit errors in the loop. GitHub returned 422 for some `pull/N/merge` check-run lookups, including paradigma; the CLI logged that and still wrote the receipt. paradigma's failure came from the Actions run, not from that merge ref.

### What to fix next, from this set

1. Do not contradict a sentence because a backtick name is absent, unless the sentence claims that name was added or edited. "See `VERSIONING.md`", a package named `tools`, and a file mentioned as history are not missing edits.
2. Confirm the clause the token supports. An env-var name does not prove a deploy instruction. A test file does not prove a dist rebuild.
3. Treat "Generated by Codex" as Codex, and extract the description above that footer. Hear "27 passed" and "Add …" bullets. Skip Jules' footer and bare headings such as "Changes".
4. Read review state, so `CHANGES_REQUESTED` shows up on the receipt.
5. Keep real test, lint, build, and security failures as Doesn't match. Decide separately whether a review-bot check or a deploy preview should be a note instead of a verdict. On this set they had failed, so the current rule was fair and blunt.

## Three sets

Same hand rules. "Fair" means the overall verdict does not pretend a specific false sentence was proven, and does not condemn the pull request for a flag that invents a problem. A false reassurance is a confirmed sentence that is untrue, or confirmed for the wrong reason, even when the overall verdict stays fair. A false alarm is a contradicted sentence that is true, or a flag that invents a problem.

| | First tuned set, after its fixes | Held-out set, re-run after the next fixes | Fresh set |
|---|---|---|---|
| CLI finished (exit 0) | 20/20 | 19/19 still online | 20/20 |
| Verdict fair | 20/20 | 19/19 | 15/20 |
| Verdict too rosy | 0/20 | 0/19 | 0/20 |
| Verdict too harsh | 0/20 | 0/19 | 5/20 |
| Claims extracted | 57 | 49 | 76 |
| Pull requests with zero claims | 4/20 | 2/19 | 4/20 |
| False reassurances | 2 | 2 | 2 |
| False alarms | 0 | 0 | 6 |

The first column is the [before and after](#before-and-after) table's "after". The middle column is the [re-run](#held-out-set-re-run) of the held-out pull requests, which these fixes were adjusted on. The fresh column was chosen before that CLI run, and the scorer was not changed during it. The fresh set is the accuracy number.

**Maturity: alpha.** A re-run of the pull requests a fix was written for can look solved. The next 20 did not. Five of them were condemned for a name the author did not claim to edit.

## Held-out set, re-run

The five fixes from the held-out section are in this run: a passing mention is not a missing edit, a token confirms only its clause, Codex and "27 passed" are heard, Jules footers and bare headings are not claims, unresolved changes-requested reviews are written in plain English, and a failed review bot or preview deploy is a note that holds Checks out back to Partly checked. Real test, lint, build, and security failures still force Doesn't match.

[pentiminax/ux-datatables#580](https://github.com/pentiminax/ux-datatables/pull/580) now returns 404. The repository only has a handful of dependabot pull requests. It is not in this denominator. On the first held-out run it was Doesn't match because `Demo app` failed, and that verdict was fair.

| Pull request | Re-run | Hand |
|---|---|---|
| [mcp-shell#1](https://github.com/callmenet/mcp-shell/pull/1) | Checks out, 1 claim | Fair. The workflow file is the diff. A second "introduces the same file" sentence is no longer an unverifiable claim. The workflow edit is a note. |
| [techhub#590](https://github.com/techhubms/techhub/pull/590) | Doesn't match, `check_failed` | Fair. Lint and the quality gate failed. `TokenCredential` is in the patch. |
| [paradigma#306](https://github.com/biomarkersParkinson/paradigma/pull/306) | Doesn't match, `check_failed` | Fair. `Build and test` failed. `subset_data` and the new tests are real. |
| [Norwegian-tycoon#15](https://github.com/jwlei/Norwegian-tycoon/pull/15) | Checks out, 1 claim | Fair. `localStorage` backup and the in-memory fallback are in `js/shared.js`. |
| [hue-sdk#293](https://github.com/hue-run/hue-sdk/pull/293) | Checks out, 2 claims | Fair as a verdict. `VERSIONING.md` is no longer contradicted, and the changelog line is true. One sentence is still a false reassurance. |
| [1N599-Labs#7](https://github.com/hmuniraju1981/1N599-Labs/pull/7) | Doesn't match, `ci_never_ran` | Fair. The Cloudflare instruction is not a claim. Lint and build are still said to pass, and no checks ran. |
| [observability-sdk#834](https://github.com/launchdarkly/observability-sdk/pull/834) | Partly checked, 7 claims | Fair. The lockfile bumps are real. `Build Yarn Turborepo` passed. The Nest "unchanged" clause stays unverifiable. |
| [roentgen#146](https://github.com/kouiso/roentgen/pull/146) | Partly checked, 1 claim | Fair. The receipt says kouiso asked for changes and that review is still open. That does not force Doesn't match. |
| [Cue-Clock#261](https://github.com/yanukadeneth99/Cue-Clock/pull/261) | Partly checked, 3 claims | Fair. "Only `useNow.ts` touched" is true. The Google `tools` note is not contradicted. |
| [electron#55082](https://github.com/electron/electron/pull/55082) | Partly checked, 4 claims | Fair. `FlushBeforeExit` is in the patch. The historical handshake is not contradicted. deepak1556's changes-requested review is still open, so this is not Checks out. |
| [Finally-3#8](https://github.com/begwanisiddharth-eng/Finally-3/pull/8) | Partly checked, 2 claims | Fair. `claude-review` is a note. The degraded-mode symbols are in the diff. "119 tests pass" stays unverifiable. |
| [plugin-dev#87](https://github.com/kylesnowschwartz/plugin-dev/pull/87) | Partly checked, 5 claims | Fair. The facts file only changes `claude_code_version`. The `DRIFT` line is in the compatibility doc. The unpushed-commits sentence is true and still cited from `create-worktree.sh`. That weak pointer is not counted. |
| [task_management#16](https://github.com/FLNYoshidaRyuta/task_management/pull/16) | Partly checked, 0 claims | Fair. Abstention. |
| [mattermost#39243](https://github.com/mattermost/mattermost/pull/39243) | Doesn't match, `check_failed` | Fair as a verdict. Cypress failed on this commit, and two reviewers still have changes requested. "Not changed" is unverifiable. One sentence is still a false reassurance. |
| [rxbetter-core#85](https://github.com/pauljaworski/rxbetter-core/pull/85) | Partly checked, 4 claims | Fair. "27 passed" is extracted and unverifiable. The Netlify preview failures are a note, not Doesn't match. |
| [beercss#655](https://github.com/beercss/beercss/pull/655) | Partly checked, 4 claims | Fair. "Rebuilt dist files" is unverifiable. The button test is confirmed on its own. The Jules footer is gone. |
| [python-ddd-inventory#165](https://github.com/bjohnson1279/python-ddd-inventory/pull/165) | Doesn't match, `check_failed` | Fair. The contract jobs failed. The footer is gone. |
| [copilot-plus#100](https://github.com/juninmd/copilot-plus/pull/100) | Doesn't match, `check_failed` | Fair. `check / validate` failed. The scanner sentence is true. |
| [docs#26380](https://github.com/docker/docs/pull/26380) | Partly checked, 0 claims | Fair. Abstention. The agent is OpenAI Codex, detected from "Generated by Codex". |

The old false alarms (hue, Cue-Clock, electron) are gone. The old false reassurances (beercss dist, the Cloudflare instruction) are gone. Two new false reassurances showed up, and neither one turned the verdict into Checks out.

**[hue-sdk#293](https://github.com/hue-run/hue-sdk/pull/293).** "Skill and contract checks (the only code paths this change touches), re-run after merging `origin/main`" is confirmed because `SKILL.md` and `docs-contract.json` are in the diff. The sentence is about re-running those checks. The pasted output may be true. The receipt did not check a run.

**[mattermost#39243](https://github.com/mattermost/mattermost/pull/39243).** "This PR doesn't handle them" is confirmed because `server.go` is in the diff. The sentence is a negative claim about file-path values. A changed file does not prove what the pull request left undone.

Re-run timing: 19/19 exit 0, about 1s to 8s. electron was slowest again. ux-datatables exited 1 with a 404. No rate-limit errors in the loop.

## Fresh set

Chosen on 19 October 2026, before `node dist/cli.js receipt`, from repositories that are not in the first tuned set and not in the held-out set. The scorer commit was `c1baf7d` and it was not edited during this run. Mix: Copilot 4, Devin 5, Claude 4, Cursor 3, Jules 2, and one human-authored pull request whose body says "Generated by Codex". Mix of merged, closed-unmerged, failing checks, and review pushback.

| Pull request | Receipt | Hand |
|---|---|---|
| [jasper-ui#1626](https://github.com/cjmalloy/jasper-ui/pull/1626) | Doesn't match, 8 claims | Too harsh. The source form does gain `class="form"` and `[origin]`. `ref.component.html` is the file it was matched to, and it is not in the diff. |
| [Miana-Anii#10](https://github.com/siamthetree/Miana-Anii/pull/10) | Partly checked, 4 claims | Fair. The credential sentences stay unverifiable. Nothing false is confirmed. |
| [B-ta-wishlist-idee-nbank#2](https://github.com/kesga44-jpg/B-ta-wishlist-idee-nbank/pull/2) | Partly checked, 0 claims | Fair. Abstention. The write-up is Dutch. |
| [libjxl#5045](https://github.com/libjxl/libjxl/pull/5045) | Doesn't match, 0 claims, `check_failed` | Fair. Build and test jobs failed on a two-line image bump. The workflow edit itself is only a note. |
| [finance-hub#5](https://github.com/xbettylu-glitch/finance-hub/pull/5) | Partly checked, 1 claim | Fair. "75/75 tests pass" stays unverifiable. |
| [textsearch-poc#21](https://github.com/rawtreedb/textsearch-poc/pull/21) | Partly checked, 3 claims | Fair. "Not changed" stays unverifiable. |
| [ct_aws_db#14](https://github.com/taviv/ct_aws_db/pull/14) | Partly checked, 2 claims | Fair as a verdict. One sentence is a false reassurance. |
| [transmission-web#5](https://github.com/DSchau/transmission-web/pull/5) | Partly checked, 3 claims | Fair. The receipt says DSchau asked for changes and that review is still open. |
| [recursion#232](https://github.com/CSL-Laboratories/recursion/pull/232) | Doesn't match, 8 claims | Too harsh. The `git check-attr` guard is in `tools/check_program_control.py`. `**/SHA256SUMS.txt` is a path the guard scans. The `ci_gate.py` sentences say that file still needs a change. |
| [sportivista#470](https://github.com/CHaerem/sportivista/pull/470) | Doesn't match, 8 claims | Too harsh. The enum and the new test are real, and `web-tests` passed. `catalog.json` and `catalog.schema.json` are the existing files the write-up compares. |
| [inequality-indices#11](https://github.com/diomavro/inequality-indices/pull/11) | Checks out, 1 claim | Fair. The DTS blocks were removed from the two verify scripts. CI is green. Removing the superseded tests is the task, and it is not flagged. |
| [minceraft#374](https://github.com/jtwaugh/minceraft/pull/374) | Doesn't match, 3 claims | Too harsh. `interactions.rs`, `bindings/tests.rs`, and `targeting.rs` are the diff. The conventions markdown is the spec being implemented. |
| [hash#10092](https://github.com/hashintel/hash/pull/10092) | Doesn't match, 5 claims | Too harsh. The sentence explains that Pi 1.2 adds `durationMs` when `timestamp` is recent. This pull request only edits the test. `timestamp` is not a missing edit. |
| [nodetool#6784](https://github.com/nodetool-ai/nodetool/pull/6784) | Doesn't match, `check_failed` | Fair as a verdict. The quality gate's test job failed, and the "942 tests pass" claim is contradicted for that reason. The same sentence is also confirmed from two source files. |
| [Traitors-4Real#208](https://github.com/Pakiboy23/Traitors-4Real/pull/208) | Partly checked, 7 claims | Fair. The hydrator symbols are in the patch. "42 passed" stays unverifiable. CodeRabbit's changes-requested review is still open, so this is not Checks out. |
| [ring#493](https://github.com/neil-sriv/ring/pull/493) | Partly checked, 14 claims | Fair. The register form disables the fields during `mutateAsync`. Eleven of the claims are screenshot URLs and image markdown. |
| [golf-ai-assistant#141](https://github.com/prestonpinkney-pt/golf-ai-assistant/pull/141) | Doesn't match, `check_failed` | Fair. `verify` failed. The day-offset behaviour is in `sms-booking-flow.ts`. A Vercel check is listed with it; the name does not say preview, and `verify` was already enough. |
| [devagent#355](https://github.com/frayel/devagent/pull/355) | Partly checked, 0 claims | Fair. Abstention on a Jules spec. |
| [jubarte-redlines#1276](https://github.com/jandira-tech/jubarte-redlines/pull/1276) | Doesn't match, `check_failed` | Fair as a verdict. macOS and Windows tests failed, and so did `security`. "Added test cases" is also contradicted because the tests live in `sha1.rs` rather than a new test file. That contradiction is a false alarm, and it is not what decides the verdict. |
| [wpt#63876](https://github.com/web-platform-tests/wpt/pull/63876) | Doesn't match, 0 claims, `check_failed` | Fair. The author is `envia`. The agent is OpenAI Codex from "Generated by Codex". The infrastructure test on this commit failed. |

### False alarms

Six pull requests contradicted a true sentence.

Five of them are the whole reason the receipt says Doesn't match: jasper-ui (match `ref.component.html`), recursion (a glob the new guard scans, and a file the text says still needs a change), sportivista (the catalog files the drift is compared with), minceraft (the spec path), and hash (`timestamp` in an explanation of Pi 1.2). jubarte-redlines contradicted "added test cases" because the `#[test]` functions were added in `sha1.rs`. Real test failures already forced Doesn't match there.

### False reassurances

Two. Neither one is a Checks out.

**[ct_aws_db#14](https://github.com/taviv/ct_aws_db/pull/14).** "Only the chart query changes" is confirmed because `study_condition_codes` is in `queries.py`. `mesh_overrides.csv` also changes, and a test file is added.

**[nodetool#6784](https://github.com/nodetool-ai/nodetool/pull/6784).** The verification sentence that says 942 tests pass is confirmed because two store files changed. The test check on that commit failed, and a second claim from the same sentence is contradicted.

### What still fails

A backtick name is still enough to condemn the pull request when the sentence uses it as a comparison, a spec, a glob the new code scans, or an explanation of existing behaviour. "See X" and "previously X" are handled. "To match X", "implements docs/X", and "since the upgrade, X" are not.

A test added in the same source file is still reported as no test file changed.

Screenshot URLs, image markdown, and lines such as "What changes" and "Behaviour changes:" are still claims. They did not decide a verdict. ring's receipt is 14 claims, and 11 of them are pictures.

"Only …" is still confirmed from one token. A negative sentence ("this PR doesn't handle them") is still confirmed because a filename shares a word with the sentence.

Dutch text and a Jules spec produced no claims. That is an abstention, and it is not a check of the change.

A Vercel check whose name does not say "preview" is still a warning sign. On golf-ai-assistant a real `verify` failure was already enough.

### Performance

Fresh run: 20/20 exit 0, about 1s to 5s. No rate-limit errors in the receipt loop. Search queries used to choose the set did hit a secondary rate limit; the receipt runs did not.

## Fourth set

Chosen on 19 October 2026, before `node dist/cli.js receipt`, from repositories that are not in the first tuned set, the held-out set, or the third set. The scorer was commit `8d2b0ab` and it was not edited during this round or during the re-runs below. Mix: Copilot 5, Devin 3, Claude 5, Cursor 4, Jules 2, and one human-authored docs translation whose body says `Generated-by: codex`. Mix of merged, open, closed-unmerged, failing checks, and an open changes-requested review.

| | First set, re-run (tuned) | Held-out, re-run (tuned) | Third set, re-run (tuned) | Fourth set (fresh) |
|---|---|---|---|---|
| Verdict fair | 20/20 | 19/19 | 20/20 | 19/20 |
| Too rosy | 0 | 0 | 0 | 0 |
| Too harsh | 0 | 0 | 0 | 1 |
| Claims extracted | 55 | 50 | 67 | 48 |
| Pull requests with zero claims | 5/20 | 2/19 | 4/20 | 6/20 |
| False reassurances | 3 | 1 | 3 | 1 |
| False alarms | 0 | 0 | 0 | 1 |

[pentiminax/ux-datatables#580](https://github.com/pentiminax/ux-datatables/pull/580) is still a 404, so the held-out re-run is 19 pull requests. The same hand rules as the first table. A false reassurance is a confirmed sentence that is untrue, or confirmed for the wrong reason, even when the overall verdict stays fair.

### Fourth set, pull by pull

| Pull request | Receipt | Hand |
|---|---|---|
| [gh-aw-firewall#10259](https://github.com/github/gh-aw-firewall/pull/10259) | Doesn't match, `tests_deleted` | Fair. Test cases and assertions were removed from `docker-manager-string-utils.test.ts` with the unused export. `pr-title` is a note. |
| [Cashio#1](https://github.com/cristianatomei/Cashio/pull/1) | Partly checked, 0 claims | Fair. Abstention. The write-up is Romanian. |
| [jarvis#1098](https://github.com/DanAakesen/jarvis/pull/1098) | Partly checked, 0 claims | Fair. Abstention. |
| [atmos#2276](https://github.com/cloudposse/atmos/pull/2276) | Partly checked, 0 claims | Fair. `Check Markdown Links` failed and is a note. The allowlist write-up produced no claims. |
| [rubyipmi#82](https://github.com/logicminds/rubyipmi/pull/82) | Partly checked, 4 claims | Fair as a verdict. One sentence is a false reassurance. The `spec_helper.rb` edit itself is real. |
| [overlay-web#284](https://github.com/LayerNorm/overlay-web/pull/284) | Partly checked, 5 claims | Fair. `primary` and `unstyledButton` are in the patch. "Relevant focused tests pass" stays unverifiable. A Vercel check that does not say preview is a note. |
| [Sento-Seiya#17](https://github.com/Gaijin81/Sento-Seiya/pull/17) | Partly checked, 0 claims | Fair. Abstention. |
| [Promo_Gifts_V4#2297](https://github.com/adm01-debug/Promo_Gifts_V4/pull/2297) | Doesn't match, `check_failed` | Fair. `actionlint + shellcheck` failed, and that name is a lint check. The personalization jobs are notes. |
| [Skoleoverblikket#44](https://github.com/NielsPilgaard/Skoleoverblikket/pull/44) | Partly checked, 6 claims | Fair. `StudentsTests` is in the new test file. The pass claim is confirmed because the API test job passed. |
| [hass-bora-dryer#7](https://github.com/chriguschneider/hass-bora-dryer/pull/7) | Partly checked, 4 claims | Fair. The lint-and-test job on this commit passed. "Closes #6" stays unverifiable. |
| [findmomentum.xyz#780](https://github.com/diegocasmo/findmomentum.xyz/pull/780) | Checks out, 2 claims | Fair. `MS_PER_DAY` and `formatDateAsTimeAgo` are in `time.ts`, the only changed file. |
| [arthur-common#252](https://github.com/arthur-ai/arthur-common/pull/252) | Partly checked, 4 claims | Fair. `DISCOVERY_SOURCE_CLASSES` is in the patch and the unit-test job passed. `require-team-approval` is a note, so this is not Checks out. |
| [roundup#2884](https://github.com/saadshahd/roundup/pull/2884) | Partly checked, 0 claims | Fair. Abstention. Closed without merging. |
| [experiment-action#160](https://github.com/langfuse/experiment-action/pull/160) | Checks out, 2 claims | Fair. `README.md` and `action.yml` both changed. The check named "All tests passed" succeeded. |
| [fabrica#32](https://github.com/staltz/fabrica/pull/32) | Doesn't match, `tests_deleted` | Too harsh. `apply_test.go` lost 353 lines and `local_test.go` gained 365. The tests were moved, not dropped. |
| [frequency-web#3507](https://github.com/hellofrequencylab/frequency-web/pull/3507) | Checks out, 1 claim | Fair. The migration file is in the diff, and `prevent_founder_meta_self_edit` is in the patch. |
| [series_correction_project_updated#499](https://github.com/abhimehro/series_correction_project_updated/pull/499) | Partly checked, 4 claims | Fair. `scripts/river_mile_map.json` is not in the diff, so that sentence is "couldn't verify", not contradicted. pytest passed. CodeRabbit's changes-requested review is still open. |
| [goodai-mate#303](https://github.com/ktg-one/goodai-mate/pull/303) | Partly checked, 7 claims | Fair. `VoiceDemo.tsx` is in the diff. A Sourcery footer is still extracted and left unverifiable. |
| [strata-window#42](https://github.com/strata-scribe/strata-window/pull/42) | Partly checked, 1 claim | Fair. The accessibility sentence stays unverifiable. |
| [guidellm#1351](https://github.com/vllm-project/guidellm/pull/1351) | Partly checked, 6 claims | Fair. The author is `tangming1996`. The body says `Generated-by: codex`, which this build does not recognise, so the agent is unspecified. The template lines and `DEVELOPING.md` stay unverifiable. |

### What changed on the three earlier sets

The re-runs are tuned: the policy was written against their misses. They are not a fresh score.

The five third-set receipts that said Doesn't match only because a name was missing (jasper-ui, recursion, sportivista, minceraft, hash) are now Partly checked. jubarte-redlines still says Doesn't match, because macOS, Windows, and `security` failed, and the `#[test]` cases in `sha1.rs` are confirmed rather than contradicted. nodetool still says Doesn't match because `test-web` failed, and "942 tests pass" is no longer also confirmed from the source files. ct_aws_db no longer confirms "only the chart query" while a CSV also changes. ring dropped from 14 claims to 6; the screenshot lines are gone. golf-ai-assistant is Partly checked: `verify` and the Vercel check are notes, not a warning sign. inequality-indices is Partly checked rather than Checks out, because the sentences about removing the DTS blocks are not confirmed from a filename.

On the held-out re-run, 1N599-Labs is Partly checked instead of Doesn't match: lint and build are still said to pass, and no checks ran, which is a note. copilot-plus is Partly checked: `check / validate` is not a test, build, lint, or security check. hue-sdk no longer confirms the "re-run after merging" sentence. mattermost no longer confirms "this PR doesn't handle them". The cypress failure still decides Doesn't match. python-ddd-inventory still says Doesn't match because the PostgreSQL job name contains "security".

### False alarms on this round

One. [fabrica#32](https://github.com/staltz/fabrica/pull/32) is the whole reason that receipt says Doesn't match. The other Doesn't match receipts in this round are a failed test, lint, build, or security check, or test cases that were actually removed.

### False reassurances on this round

Eight sentences. None of them is a Checks out.

**First set.** [pymath-utils#4](https://github.com/researchstation/pymath-utils/pull/4) confirms the `ValueError` sentence because that word is in `.github/copilot-instructions.md`. [repo-task1#7](https://github.com/vijayazuredemo/repo-task1/pull/7) confirms "mutation-checked locally" because `completed` is in the test patch. [vibe-code#162](https://github.com/juninmd/vibe-code/pull/162) confirms the dummy-test replacement because a test file changed, while `runReviewPipeline` correctly stays unverifiable.

**Held-out.** [observability-sdk#834](https://github.com/launchdarkly/observability-sdk/pull/834) confirms a Yarn Turbo build because jobs named "E2E Dockerized Apps" passed. The name contains "docker", so they are classified as builds.

**Third set.** [golf-ai-assistant#141](https://github.com/prestonpinkney-pt/golf-ai-assistant/pull/141) confirms the day-offset sentence because the test patch contains `next`. [ring#493](https://github.com/neil-sriv/ring/pull/493) confirms "Biome check on" the register file because the file is in the diff, and confirms the "could still edit" sentence because it contains `Register`. The `mutateAsync` sentence is a real edit.

**Fourth set.** [rubyipmi#82](https://github.com/logicminds/rubyipmi/pull/82) confirms "Add `COVERALLS_REPO_TOKEN` repository secret" because that name appears in `spec_helper.rb`.

### What still fails

Moving every test out of `apply_test.go` into `local_test.go` is still reported as deleted tests, and that is enough for Doesn't match.

A token in the diff can still confirm the wrong sentence: a word in an instructions file, a passing count's neighbour, a check run whose name happens to contain "docker", or an instruction to add a secret.

`Generated-by: codex` is not the marker this build looks for (`Generated by Codex`), so guidellm is not named as Codex.

Sourcery footers and pull-request template checklists are still claims. They stayed unverifiable.

Six of the 20 fresh pull requests produced no claims. That is an abstention, and it is not a check of the change.

**Maturity: alpha.** The fresh verdict was fair on 19 of 20, and the miss was too harsh rather than too rosy. A single confirmed sentence is still not something to trust unsupervised.

### Performance

The four loops had GitHub 502s on Actions job lookups. Those pulls were retried and then exited 0, except ux-datatables, which is a 404. No scorer crash. A receipt was usually 1s to 5s; a 502 burned about 10s before the retry.

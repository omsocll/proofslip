# Contributing

proofslip is a TypeScript GitHub Action and a CLI. Node 20 or newer.

```bash
npm install
npm test
npm run typecheck
npm run build
```

CI rebuilds `dist/` and fails if that bundle does not match the committed files. After you change TypeScript, run `npm run build` and commit `dist/`.

`package.json` stays `"private": true`. Do not publish this package to npm, and do not submit it to the GitHub Marketplace from a pull request. Do not change the repository's visibility.

A receipt that confirms a false sentence, or that says Doesn't match when nothing dishonest happened, belongs in the false-verdict issue template. Include the pull request URL and the sentence.

The receipt document id is `agent-receipt/v0`. The product name is proofslip.

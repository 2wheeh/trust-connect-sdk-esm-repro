# trust-connect-sdk ESM repro

Minimal repro for [trustwallet/trust-connect-sdk#9](https://github.com/trustwallet/trust-connect-sdk/issues/9)
(fixed by [PR #10](https://github.com/trustwallet/trust-connect-sdk/pull/10)): the published
ESM is not resolvable under Node because relative imports lack file extensions.

## Steps

```bash
pnpm install
pnpm run repro   # node index.ts — just imports the package
```

## Result

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
  '.../@trustwallet/connect-core/dist/02-namespace/base'
  imported from .../@trustwallet/connect-core/dist/index.js
```

## Why

Published as ESM but compiled with `tsc`, which leaves relative imports extensionless:

```js
// dist/index.js
export * from './02-namespace/base';   // no .js — Node ESM can't resolve it
```

Node resolves the whole graph at import time, so one extensionless re-export kills the
entire import. The error is on `./02-namespace/base` — which `TrustConnect` doesn't even
come from — proving it fails during resolution, before any code runs. Bundlers (Vite,
etc.) tolerate extensionless specifiers, which is why it stayed latent.

_Reproduced with `@trustwallet/connect-core@0.0.0` on Node v24.11. TypeScript isn't
required — a plain `.js`/`.mjs` entry fails the same way._

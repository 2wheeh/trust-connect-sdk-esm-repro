// Importing the package under Node is enough to fail — no bundler involved.
// dist/index.js re-exports submodules with extensionless specifiers
// (`export * from './02-namespace/base'`), which Node's ESM loader can't resolve.
import { TrustConnect } from '@trustwallet/connect-core';

// Never reached — the import above throws ERR_MODULE_NOT_FOUND first.
console.log('Import resolved:', TrustConnect);

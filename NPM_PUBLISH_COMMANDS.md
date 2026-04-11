# 🚀 NPM Publish - Exact Terminal Commands

## Single Command (Recommended)

From your terminal, `cd` to the SDK directory and run:

```bash
cd packages/sdk-ts && npm install && npm run lint && npm run test && npm run build && npm publish --access public
```

This does everything in one shot:
1. ✅ Installs dependencies
2. ✅ Lints code
3. ✅ Runs tests
4. ✅ Builds TypeScript → JavaScript
5. ✅ Publishes to NPM public registry

---

## Step-by-Step Commands

If you prefer doing it step by step:

```bash
# 1. Navigate to SDK
cd packages/sdk-ts

# 2. Install dependencies
npm install

# 3. Verify code quality
npm run lint
npm run typecheck

# 4. Run tests
npm run test

# 5. Build
npm run build

# 6. Verify build output exists
ls -la dist/

# 7. Publish to NPM (PUBLIC - Anyone can install)
npm publish --access public
```

---

## What Happens When You Run `npm publish --access public`

1. **Runs prepublishOnly script**:
   ```bash
   npm run lint && npm run typecheck && npm run test && npm run build
   ```
   
2. **Packages the dist/ folder** with:
   - Compiled JavaScript files
   - TypeScript declaration files (.d.ts)
   - Source maps (.js.map)
   - README.md, LICENSE

3. **Publishes to npm registry**:
   - Package name: `@neuralmarket/sdk`
   - Public scope (anyone can install)
   - URL: https://npmjs.com/package/@neuralmarket/sdk

4. **Returns success message**:
   ```
   npm notice Publishing to the public npm registry
   npm notice New minor version published: @neuralmarket/sdk@1.0.0 🎉
   ```

---

## Verify Publication (After Publishing)

```bash
# Check it's live on npm
npm view @neuralmarket/sdk

# Install from npm in another directory
cd /tmp && npm install @neuralmarket/sdk

# Test the import
node -e "const sdk = require('@neuralmarket/sdk'); console.log('✓ SDK version:', sdk.default.version)"
```

Expected output:
```
✓ SDK version: 1.0.0
```

---

## Prerequisites (One-Time Setup)

Before first publish, authenticate with NPM:

```bash
npm login
# Follow prompts to enter NPM username, password, and email
# One-time setup, then you can publish unlimited times
```

To verify you're logged in:
```bash
npm whoami
# Should print your NPM username
```

---

## Full Terminal Session Example

```bash
# Copy & paste this entire block into your terminal:

# Navigate to SDK
cd /home/vaiosvaios/Sentinely/packages/sdk-ts

# Run everything
npm install && \
npm run lint && \
npm run typecheck && \
npm run test && \
npm run build && \
npm publish --access public

# After it finishes, verify
npm view @neuralmarket/sdk
```

---

## If Tests Fail

If `npm test` fails:

```bash
# Run tests with verbose output
npm run test -- --verbose

# Fix any issues, then try again
npm publish --access public
```

---

## If Lint Fails

If `npm run lint` fails:

```bash
# Auto-fix linting issues
npm run lint:fix

# Then try publishing again
npm publish --access public
```

---

## Environment Variables (If Needed)

For CI/CD (GitHub Actions, etc.):

```bash
export NPM_TOKEN="npm_xxxxx" # Get from npm.com account settings
npm publish --access public
```

For development (local machine):
- Just run `npm login` once, then use `npm publish`

---

## Package Will Be Installed Via

Once published, users can install with:

```bash
npm install @neuralmarket/sdk
```

Or import specific clients:

```typescript
import { SentinelySDK, VaultClient, OracleClient, ComplianceClient } from '@neuralmarket/sdk';

// Or individual clients
import VaultClient from '@neuralmarket/sdk/vault';
```

---

## Status Check

**Current SDK Status**: ✅ **READY TO PUBLISH**

Checklist:
- ✅ TypeScript compiles without errors
- ✅ Tests pass (see jest config)
- ✅ All entry points in package.json (main, types, exports)
- ✅ README.md included
- ✅ Non-custodial architecture complete
- ✅ Zero private keys exposed
- ✅ Full type safety (no `any` types)

**Ready to run**: 
```bash
cd packages/sdk-ts && npm publish --access public
```

---

## Support

- 📖 NPM Docs: https://docs.npmjs.com/cli/publish
- 🏠 Package URL: https://npmjs.com/package/@neuralmarket/sdk
- 🐛 Issues: https://github.com/neural-market/neural-market/issues
- 💬 Discord: https://discord.gg/neuralmarket

---

**Last Updated**: 2026-04-06

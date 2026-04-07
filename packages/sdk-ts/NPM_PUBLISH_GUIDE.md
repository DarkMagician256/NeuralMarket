# 📦 NeuralMarket SDK NPM Publication Guide

Official guide for publishing **@neuralmarket/sdk** to NPM registry.

---

## Prerequisites

Before publishing, ensure you have:

1. **NPM Account** - Create at https://npmjs.com (already done if you own the @neuralmarket org)
2. **Local NPM Login** - Run `npm login` and authenticate with your NPM credentials
3. **Node.js >= 18** - Check: `node --version`
4. **Git Repo Clean** - All changes committed: `git status`

---

## Step 1: Verify Build & Tests

Run these commands from `/packages/sdk-ts/`:

```bash
# Install dependencies
npm install

# Run type checking
npm run typecheck

# Run linter
npm run lint

# Run integration tests
npm run test

# Check test coverage
npm run test:coverage
```

**Expected Output**: All tests pass, no TypeScript errors, coverage > 50%.

---

## Step 2: Build Distribution

```bash
# From /packages/sdk-ts/
npm run build
```

This generates:
- `dist/` folder with compiled JS files
- `dist/index.d.ts` TypeScript declaration files
- `dist/*.js.map` source maps for debugging

**Verify the build:**
```bash
ls -la dist/
# Should show:
# - index.js
# - index.d.ts
# - clients/vault.js
# - clients/vault.d.ts
# - clients/oracle.js
# - clients/oracle.d.ts
# - clients/compliance.js
# - clients/compliance.d.ts
```

---

## Step 3: Update Version (if needed)

Edit `package.json` version field:

```json
{
  "version": "1.0.0"  // <- Update if releasing new version
}
```

**Semantic Versioning**:
- `1.0.0` → `1.0.1` (patch: bug fixes)
- `1.0.0` → `1.1.0` (minor: new features, backward compatible)
- `1.0.0` → `2.0.0` (major: breaking changes)

---

## Step 4: Create Git Tag (Recommended)

Tag the release in git:

```bash
# From repo root
git tag -a v1.0.0 -m "Release @neuralmarket/sdk v1.0.0"
git push origin v1.0.0
```

---

## Step 5: Publish to NPM (PUBLIC)

**FROM THE SDK DIRECTORY** (`/packages/sdk-ts/`), run:

```bash
npm publish --access public
```

**What this does:**
- Runs `prepublishOnly` script (lint → typecheck → test → build)
- Publishes to https://npmjs.com/package/@neuralmarket/sdk
- Makes package public (anyone can install)
- Uses scoped name `@neuralmarket/sdk`

---

## Step 6: Verify Publication

Check that the package is live:

```bash
# View on npm website
npm view @neuralmarket/sdk

# Install in another directory to verify
cd /tmp && npm install @neuralmarket/sdk

# Test import
node -e "const sdk = require('@neuralmarket/sdk'); console.log('SDK version:', sdk.default.version)"
```

Expected output:
```
SDK version: 1.0.0
```

---

## Full Publication Script (One Command)

Copy & paste this from `/packages/sdk-ts/`:

```bash
npm install && npm run lint && npm run test && npm run build && npm publish --access public
```

This runs all steps in sequence and publishes on success.

---

## For GitHub Actions (CI/CD)

Add to `.github/workflows/publish.yml`:

```yaml
name: Publish SDK

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: cd packages/sdk-ts
      - run: npm install
      - run: npm run test
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Then push a tag: `git push origin v1.0.0`

---

## Troubleshooting

### Error: "npm ERR! 404 Not Found"
- The @neuralmarket organization might not exist on NPM
- **Solution**: Create org at https://npmjs.com or contact org owner

### Error: "npm ERR! 403 Forbidden"
- You don't have publish permissions for @neuralmarket
- **Solution**: Run `npm login` or ask org owner to add you as maintainer

### Error: "npm ERR! no files found"
- Missing `dist/` folder or incorrect `files` field in package.json
- **Solution**: Run `npm run build` first

### Error: "prepublishOnly script failed"
- Tests or linting failed
- **Solution**: Fix errors with `npm run lint:fix` and `npm test`

---

## Post-Publication Checklist

- [ ] Verify package appears on https://npmjs.com/package/@neuralmarket/sdk
- [ ] Check that all files are included: `npm view @neuralmarket/sdk files`
- [ ] Test installation in isolated directory: `npm install @neuralmarket/sdk`
- [ ] Verify imports work: `const { NeuralMarketSDK } = require('@neuralmarket/sdk')`
- [ ] Update GitHub releases page with changelog
- [ ] Announce on Discord/Twitter (@neuralmarket)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-06 | Initial release: VaultClient, OracleClient, ComplianceClient |

---

## Quick Reference

```bash
# From /packages/sdk-ts/

# Development
npm run build:watch      # Watch TypeScript changes
npm run test:watch       # Run tests on file change
npm run lint:fix         # Auto-fix linting issues

# Pre-Publication
npm run typecheck        # Type checking
npm run test:coverage    # Coverage report

# Publishing
npm publish --access public    # Publish to npm (PUBLIC)
npm publish --access restricted # Publish to npm (PRIVATE/ORG)

# Inspect
npm view @neuralmarket/sdk     # View on npm
npm info @neuralmarket/sdk     # Local package info
```

---

## Support

- 📖 NPM Docs: https://docs.npmjs.com
- 🐛 Report Issues: https://github.com/neural-market/neural-market/issues
- 💬 Discord: https://discord.gg/neuralmarket

---

**Status**: ✅ Ready for Publication

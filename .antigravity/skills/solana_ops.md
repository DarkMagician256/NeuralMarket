# Anchor 0.31 Operations

This skill defines how to operate with Anchor 0.31, specifically dealing with the new `idl-build` feature and deployment.

## Build
To build the project using Anchor 0.31 with strict IDL generation:
```bash
anchor build
```
Ensure `Anchor.toml` has `idl-build = true` under `[features]` or equivalent configuration if applicable for the workspace.

## Deploy
To deploy to the specified network (defaulting to localnet or devnet):
```bash
solana program deploy target/deploy/neural_vault.so
```

## Key Changes in 0.31
- Strictly use `idl-build` feature in `Cargo.toml`.
- Use `#[account(discriminator = ...)]` for custom discriminators if requested.
- Avoid manual `solana-program` imports; rely on `anchor-lang`.

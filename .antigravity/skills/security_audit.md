# Security Audit Checklist

## Smart Contract (Anchor)
- [ ] **Re-entrancy**: Ensure no external calls are made before state updates (Checks-Effects-Interactions pattern).
- [ ] **PDA Validation**: Verify all PDAs are derived correctly with the expected seeds and bump.
- [ ] **Overflow Checks**: Rust handles this, but verify explicit arithmetic logic if `unchecked` is used.
- [ ] **Access Control**: Ensure `#[account(signer)]` or `#[account(mut, has_one = ...)]` constraints are strictly applied.
- [ ] **Discriminators**: Verify custom discriminators if used (`#[account(discriminator = ...)]`).

## Frontend/Integration
- [ ] **Secret Management**: `DFLOW_API_KEY` must NEVER be exposed to the client bundle. Check `next.config.js` and client-side code.
- [ ] **Transaction Simulation**: Ensure UI simulates transactions before prompting user signature.

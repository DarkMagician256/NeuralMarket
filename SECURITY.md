# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please report security vulnerabilities to **security@neuralmarket.io**.
We pledge to acknowledge reports within 24 hours and provide an estimated timeline for a fix.

## Security Audit (Jan 2026)

### Audit Status: PASSED (Grade B+)
Performed internally via Custom SAST Engine and Manual Review.

### Key Findings & Mitigations

1.  **Secrets Management**:
    *   **Risk**: Potential exposure of API Keys.
    *   **Mitigation**: All critical keys (`KALSHI_PRIVATE_KEY`, `DFLOW_API_KEY`, `SUPABASE_SERVICE_ROLE`) are strictly servers-side variables in `.env.local` and accessed only inside `app/actions` or `lib`.
    *   **Verification**: SAST scan confirmed no hardcoded private keys in codebase (only formatting strings).

2.  **Solana Integrity**:
    *   **Risk**: Unauthorized instruction execution.
    *   **Mitigation**: Smart Contract (`neural_vault`) uses Anchor framework with strict account validation (`#[account(mut, has_one = authority)]`).
    *   **Status**: Pending external audit for Mainnet release.

3.  **Data Privacy**:
    *   **Risk**: User data leak via Supabase.
    *   **Mitigation**: Row Level Security (RLS) is enabled on Supabase tables. The `NEXT_PUBLIC_ANON_KEY` allows safe client connection restricted by RLS policies.

4.  **Frontend Security**:
    *   **Risk**: XSS via injection.
    *   **Mitigation**: React escapes content by default. No usage of `dangerouslySetInnerHTML` in user-input components.
    *   **Headers**: App implements CSP and HSTS headers via Next.js config.

## Deployment Security Checklist

- [x] Environment variables sanitized
- [x] `console.log` removed from critical paths
- [x] Anchor Program ID locked
- [x] Upgrade authority secured (Multisig planned for Mainnet)

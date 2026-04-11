# Mainnet Security Deployment Guide

## 🔐 Multisig Setup with Squads Protocol

This document outlines the steps to secure the Sentinely smart contract's upgrade authority using a multisig wallet before Mainnet deployment.

### Prerequisites

1. **Squads Account**: Create at https://squads.so
2. **Signers**: Minimum 3 team members with hardware wallets (Ledger recommended)
3. **Threshold**: 2-of-3 minimum for security

### Step 1: Create Squads Vault

```bash
# 1. Visit https://app.squads.so and create a new Squad
# 2. Add team members as signers
# 3. Set approval threshold (recommend 2-of-3)
# 4. Note the Vault Address (this becomes the new upgrade authority)
```

### Step 2: Transfer Upgrade Authority

```bash
# WARNING: This is irreversible. Test on devnet first!

# Current authority (your deployer wallet)
DEPLOYER_KEYPAIR=/home/vaiosvaios/.config/solana/devnet-deployer.json

# Your new multisig vault address from Squads
SQUADS_VAULT=<YOUR_SQUADS_VAULT_ADDRESS>

# The program to secure
PROGRAM_ID=A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F

# Execute transfer (MAINNET)
solana program set-upgrade-authority $PROGRAM_ID \
  --upgrade-authority $DEPLOYER_KEYPAIR \
  --new-upgrade-authority $SQUADS_VAULT \
  --url mainnet-beta
```

### Step 3: Verify Transfer

```bash
# Confirm the new authority
solana program show $PROGRAM_ID --url mainnet-beta

# Expected output:
# Program Id: A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F
# Authority: <YOUR_SQUADS_VAULT_ADDRESS>
# Executable: yes
```

### Step 4: Test Upgrade Flow

Before mainnet, test the full upgrade flow on devnet:

```bash
# 1. Make a minor change to the program
# 2. Build the new program
cd anchor && anchor build

# 3. Propose upgrade via Squads UI
# 4. Get required signatures
# 5. Execute upgrade
```

---

## 🛡️ Additional Security Measures

### Smart Contract Audit

Before Mainnet, complete:
- [ ] External audit by reputable firm (OtterSec, Neodyme, Trail of Bits)
- [ ] Fix all Critical and High findings
- [ ] Re-audit after fixes

### Operational Security

1. **Hardware Wallets**: All multisig signers must use hardware wallets
2. **Geographic Distribution**: Signers should be in different locations
3. **Communication**: Use secure channels (Signal, encrypted email) for signing coordination
4. **Timelock**: Consider adding a timelock for non-emergency upgrades

### Emergency Procedures

Document and test:
1. **Emergency Pause**: If available in contract, test the pause mechanism
2. **Rapid Response**: Have at least 2 signers available 24/7
3. **Incident Response Plan**: Written procedure for security incidents

---

## 📋 Pre-Mainnet Checklist

### Smart Contract
- [ ] All tests passing
- [ ] External security audit completed
- [ ] Multisig upgrade authority configured
- [ ] Emergency procedures documented

### Infrastructure
- [ ] Premium RPC endpoint configured (Helius/QuickNode)
- [ ] Monitoring and alerting set up
- [ ] Error tracking (Sentry) configured
- [ ] Backup RPC endpoints configured

### Legal
- [ ] Terms of Service finalized
- [ ] Privacy Policy compliant (GDPR, CCPA)
- [ ] Geo-restrictions implemented

### Team
- [ ] All multisig signers trained
- [ ] On-call rotation established
- [ ] Incident response plan tested

---

## 🚨 Emergency Contacts

| Role | Name | Contact |
|------|------|---------|
| Lead Developer | TBD | security@neuralmarket.io |
| Multisig Signer 1 | TBD | - |
| Multisig Signer 2 | TBD | - |
| Multisig Signer 3 | TBD | - |

---

**Last Updated:** January 22, 2026
**Next Review:** Pre-Mainnet Launch

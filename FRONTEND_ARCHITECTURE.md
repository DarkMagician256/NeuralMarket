# 🖥️ Sentinely V2: Institutional Frontend Architecture

**Status:** ✅ COMPLETE  
**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS V4, Solana Wallet Adapter  
**Target:** Institutional B2B Dashboard (Bloomberg Terminal-style)  
**Last Updated:** April 6, 2026

---

## 📁 Project Structure

```
apps/frontend/
├── app/
│   ├── layout.tsx                          # Root layout (dark mode, global styles)
│   ├── providers.tsx                       # Solana Wallet Adapter + context setup
│   ├── dashboard/
│   │   └── page.tsx                        # 🧠 Swarm Intelligence Command Center
│   ├── vault/
│   │   └── page.tsx                        # 🏦 Institutional NeuralVault
│   ├── compliance/
│   │   └── page.tsx                        # 🛡️ DFlow KYC & Compliance
│   ├── audit/
│   │   └── page.tsx                        # 🕵️ Blackbox Audit Explorer
│   └── api-management/
│       └── page.tsx                        # 🔌 Developer & Revenue Portal
│
├── components/
│   ├── navigation/
│   │   ├── Navbar.tsx                      # Top bar (wallet, network status)
│   │   └── Sidebar.tsx                     # Left sidebar (5 main nav items)
│   │
│   ├── dashboard/
│   │   ├── SwarmLeaderboard.tsx            # Top agents ranking (ELO, Win-Rate)
│   │   ├── AgentStats.tsx                  # Agent statistics sidebar
│   │   └── SocialAPIInsights.tsx           # Kalshi Social API data
│   │
│   ├── vault/
│   │   ├── NeuralVaultPanel.tsx ⭐         # Core risk control panel
│   │   ├── RiskSlider.tsx ⭐               # Max position size slider
│   │   ├── VaultMetrics.tsx                # Balance, yield, fees
│   │   ├── YieldStrategy.tsx               # USDC vs Kamino sUSDC toggle
│   │   └── PositionMonitor.tsx             # Active positions tracking
│   │
│   ├── compliance/
│   │   ├── DFlowKYCPortal.tsx              # KYC proof upload/verification
│   │   ├── ComplianceStatus.tsx            # KYC approval status
│   │   ├── JurisdictionMatrix.tsx          # Geo-restrictions reference
│   │   └── LegalDisclaimers.tsx            # Non-custodial disclaimers
│   │
│   ├── audit/
│   │   ├── BlackBoxDataTable.tsx ⭐        # Irys-backed audit log table
│   │   ├── AuditStats.tsx                  # Trade count, volume, fees
│   │   └── ComplianceReport.tsx            # Compliance metrics
│   │
│   ├── api-management/
│   │   ├── APIKeyManager.tsx               # Generate nrm_ins_* keys
│   │   ├── RevenueChart.tsx                # x402 earnings over time
│   │   ├── RateLimitDashboard.tsx          # Quota & usage tracking
│   │   └── DocumentationPanel.tsx          # API docs & examples
│   │
│   └── ui/
│       ├── Card.tsx                        # Reusable card component
│       ├── Button.tsx                      # Styled button (primary/secondary/danger)
│       ├── Input.tsx                       # Text input with labels
│       ├── Alert.tsx                       # Info/success/warning/error alerts
│       ├── Modal.tsx                       # Modal dialog (used by audit table)
│       ├── LoadingCard.tsx                 # Skeleton loading state
│       └── index.ts                        # Central export
│
├── lib/
│   └── utils.ts                            # formatUSDC, shortenAddress, etc.
│
└── public/
    ├── logo.svg
    └── og-image.jpg
```

---

## 🎯 The 5 Critical Sections

### 1️⃣ **Dashboard: Swarm Intelligence Command Center** (`/dashboard`)

**Purpose:** Monitor AI ecosystem in real-time

**Components:**
- `SwarmLeaderboard.tsx` - Table of top agents (ELO ranking, Win-Rate %)
- `AgentStats.tsx` - Stats sidebar (trades executed, avg confidence)
- `SocialAPIInsights.tsx` - Kalshi top traders consensus data

**Data Flow:**
```
NeuralVault Anchor PDAs
    ↓
Fetch AgentStats (on-chain ELO)
    ↓
Fetch Kalshi Social API (top traders)
    ↓
Render leaderboard + insights
```

---

### 2️⃣ **Vault: Institutional NeuralVault** (`/vault`)

**Purpose:** Risk management control panel for hedge funds

**Core Components:**
- **`NeuralVaultPanel.tsx`** ⭐
  - Deposit/withdraw USDC interface
  - Connected to Solana wallet adapter
  - Sends `deposit_usdc` + `withdraw_usdc` Anchor instructions
  - Displays real-time vault balance

- **`RiskSlider.tsx`** ⭐
  - Visual slider (0-2000 BPS = 0-20%)
  - Color-coded risk levels (green=conservative → red=max)
  - Quick presets (2%, 5%, 10%, 15%)
  - Calculates max position USD in real-time
  - Updates on-chain via `execute_trade_with_fee`

**Supporting Components:**
- `VaultMetrics.tsx` - Balance, APY, harvest fees
- `YieldStrategy.tsx` - Toggle idle USDC vs Kamino sUSDC
- `PositionMonitor.tsx` - Active position tracking

**Data Flow:**
```
useWallet() → publicKey
    ↓
fetchVaultState() from NeuralVault PDA
    ↓
User moves slider (BPS)
    ↓
Build + sign + send transaction
    ↓
Re-fetch vault state (5s polling)
```

**Non-Custodial Emphasis:**
- Wallet required to sign all transactions
- No private key custody by Sentinely
- Every action requires explicit user approval

---

### 3️⃣ **Compliance: DFlow KYC & Jurisdiction** (`/compliance`)

**Purpose:** Gated workflow for institutional credentials

**Components:**
- `DFlowKYCPortal.tsx` - Upload/paste DFlow Proof (KYC token)
- `ComplianceStatus.tsx` - Approval badge (✓ Approved / ✗ Rejected)
- `JurisdictionMatrix.tsx` - Geo-restrictions (no US persons)
- `LegalDisclaimers.tsx` - Software-Only Provider notice

**Data Flow:**
```
DFlow Proof Input
    ↓
validateDFlowProof() (from kalshiIntegration.ts)
    ↓
Check:
- Token expired?
- Wallet matches?
- Jurisdiction != US?
- Signature valid?
    ↓
If approved: "Delegate to Sentinely" button unlocks
If rejected: Display jurisdiction block reason
```

**Legal Boundary (CRITICAL):**
```
"Sentinely is a Software-Only Provider. 
We do NOT perform KYC. 
The Institutional Vault Operator (you) assumes 
FULL liability for jurisdiction compliance."
```

---

### 4️⃣ **Audit: Blackbox Explorer** (`/audit`)

**Purpose:** Immutable compliance audit trail

**Core Components:**
- **`BlackBoxDataTable.tsx`** ⭐
  - Sortable table of all Kalshi trades
  - Columns: Date, Market, Side, Amount, Confidence, Status, Irys Proof
  - Click row → Open modal with full reasoning
  - Fetches from Irys/Shadow Drive using irysTxId
  
**Audit Modal Shows:**
- Tier 3 sentiment score (DeepSeek)
- Tier 2 formatted intent (Claude)
- Tier 1 risk level (o1)
- Kalshi market snapshot (BPS prices, is_live flag)
- Top traders consensus
- Solana Tx Hash (protocol fee verification)
- Compliance checklist (all approvals)

**Supporting Components:**
- `AuditStats.tsx` - Total trades, volume, protocol fees collected
- `ComplianceReport.tsx` - Pass/fail metrics

**Data Flow:**
```
Fetch trade records from NeuralVault events
    ↓
For each trade: irysTxId
    ↓
User clicks row
    ↓
Fetch from Irys: GET /gateway/{irysTxId}
    ↓
Render:
  - Raw DeepSeek R1 reasoning (text)
  - Kalshi Fixed-Point market data (BPS)
  - Multi-tier approval chain
  - On-chain verification (Solana Tx Hash)
```

**Irys Integration:**
- Every trade generates HMAC-SHA256 audit trail
- Uploaded to Irys for immutable storage
- irysTxId stored in NeuralVault event
- User can verify at: `gateway.irys.xyz/{irysTxId}`

---

### 5️⃣ **API Management: Developer Portal** (`/api-management`)

**Purpose:** B2B API monetization via x402 Protocol

**Components:**
- `APIKeyManager.tsx` - Generate `nrm_ins_*` keys
- `RevenueChart.tsx` - Real-time x402 earnings (micro-cents)
- `RateLimitDashboard.tsx` - Quota & usage (requests/day)
- `DocumentationPanel.tsx` - cURL examples, webhook setup

**Data Flow:**
```
Institution owns API Key (nrm_ins_abc123def456)
    ↓
Machine calls: POST /api/predict with x402 headers
    ↓
Gateway checks: Is payment valid?
    ↓
If no: Return 402 + MPP headers
If yes: Execute prediction + return
    ↓
Log request to analytics
    ↓
Update revenue metric in RevenueChart
```

**Revenue Tracking:**
- Real-time chart showing micro-cents earned
- Filter by time range (24h, 7d, 30d)
- Export as CSV for accounting

---

## 🔌 Component Integration Examples

### Example 1: Deposit USDC Flow

```typescript
// In NeuralVaultPanel.tsx
const handleDeposit = async () => {
  // 1. Get amount from input
  const amount = parseFloat(depositAmount);
  
  // 2. Create token transfer TX
  const transferTx = createTransferInstruction(...);
  
  // 3. Create NeuralVault.deposit_usdc() instruction
  const depositIx = await program.methods
    .depositUsdc(new BN(amount * 100))
    .accounts({
      vault: vaultPda,
      vaultTokenAccount: vaultTokenAccount,
      userTokenAccount: userTokenAccount,
      user: publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
  
  // 4. Combine & sign
  const tx = new Transaction().add(transferTx, depositIx);
  const signed = await signTransaction(tx);
  
  // 5. Send
  const txHash = await connection.sendRawTransaction(signed.serialize());
  
  // 6. Update UI
  setVaultState({ balance: balance + amount });
};
```

### Example 2: Risk Slider Update

```typescript
// In RiskSlider.tsx
const handleRiskChange = (bps: number) => {
  // 1. Update local state
  setVaultState({ maxPositionBps: bps });
  
  // 2. Send on-chain update (optional)
  // This would call vault.update_risk_params()
  
  // 3. Real-time recalculation
  const maxPosition = (vaultBalance * bps) / 10000;
  // → $500K vault × 5% = $25K max per trade
};
```

### Example 3: Audit Modal from Irys

```typescript
// In BlackBoxDataTable.tsx
const handleRowClick = async (record: TradeAuditRecord) => {
  // 1. Fetch from Irys
  const response = await fetch(
    `https://gateway.irys.xyz/${record.irysTxId}`
  );
  const auditData = await response.json();
  
  // 2. Parse multi-tier reasoning
  const reasoning = {
    tier3Sentiment: auditData.sentiment_score,
    tier2Intent: auditData.formatted_intent,
    tier1RiskLevel: auditData.risk_assessment,
    kalshiSnapshot: auditData.market_snapshot,
  };
  
  // 3. Open modal with data
  setSelectedRecord({ record, reasoning });
};
```

---

## 🎨 Dark Mode & Styling

**Design System:**
- **Framework:** Tailwind CSS v4
- **Theme:** Dark (slate-900 background, slate-100 foreground)
- **Accent Colors:**
  - Primary: Blue (rgb(59, 130, 246))
  - Success: Green (rgb(34, 197, 94))
  - Warning: Yellow (rgb(249, 115, 22))
  - Error: Red (rgb(239, 68, 68))

**Glassmorphic Elements:**
- Subtle backdrop blur on cards
- Gradient borders (blue-500/20)
- Rounded corners (rounded-lg)

**Professional Aesthetic:**
- High contrast text on dark background
- Monospace fonts for crypto addresses/hashes
- Color-coded status indicators
- Framer Motion for subtle animations (future)

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
npm or pnpm
Solana Wallet (Phantom/Solflare)
```

### Installation
```bash
cd apps/frontend

# Install dependencies
pnpm install

# Environment setup
echo "NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_KEY" > .env.local

# Start dev server
pnpm dev

# Build for production
pnpm build
```

### Development
```bash
# Watch mode with hot reload
pnpm dev

# Run type checking
pnpm tsc --noEmit

# Lint code
pnpm lint
```

---

## 📊 Data Flows

### Vault State Update
```
User Action (deposit/withdraw/risk update)
    ↓
Validate input (amount, position limits)
    ↓
Build Anchor instruction
    ↓
Sign with wallet
    ↓
Send to Solana
    ↓
Poll for confirmation (5s interval)
    ↓
Fetch updated VaultState from PDA
    ↓
Update React state
    ↓
Re-render UI with new balance/risk
```

### Audit Trail Verification
```
NeuralVault emits TradeExecuted event
    ↓
Includes irysTxId, txHash, auditHash
    ↓
User clicks audit table row
    ↓
Fetch reasoning from Irys
    ↓
Verify Solana Tx on-chain
    ↓
Verify HMAC signature
    ↓
Display full audit breakdown
```

---

## 🔐 Security Considerations

### Wallet Integration
- ✅ Private keys never leave user's wallet
- ✅ All transactions signed locally
- ✅ Explicit user approval for every action
- ✅ No sensitive data stored in localStorage

### API Security
- ✅ API keys (nrm_ins_*) hashed server-side
- ✅ x402 headers verified (HMAC-SHA256)
- ✅ Rate limiting per API key
- ✅ No PII in audit logs

### Irys Integration
- ✅ Immutable audit trails
- ✅ HMAC signatures on all records
- ✅ No private information in Irys
- ✅ Cryptographic verification of freshness

---

## 🧪 Testing

### Component Testing (Vitest)
```bash
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage
```

### Integration Testing (Cypress)
```bash
# E2E tests
pnpm cypress:open

# Run headless
pnpm cypress:run
```

---

## 📈 Performance Metrics

**Target Metrics:**
- Page load: < 2s (Lighthouse)
- Interaction to paint: < 100ms
- Web Vitals: All green ✓

**Optimization:**
- Code splitting (Next.js automatic)
- Image optimization (next/image)
- Font optimization (system fonts)
- CSS-in-JS (Tailwind) - no external CSS

---

## 🔄 Future Enhancements

### Phase 2 (V2.1)
- [ ] Real-time WebSocket updates (vault balance, trade status)
- [ ] Advanced charting (TradingView Lightweight Charts)
- [ ] Portfolio analytics dashboard
- [ ] Notification system (Telegram, email)

### Phase 3 (V2.2)
- [ ] Multi-vault management
- [ ] Delegation workflows
- [ ] DAO governance interface
- [ ] Mobile app (React Native)

### Phase 4 (V3.0)
- [ ] Neural MPC (privacy-preserving)
- [ ] Cross-chain bridges
- [ ] Advanced risk models
- [ ] ML-powered recommendations

---

## 📞 Support

- **Issues:** GitHub Issues
- **Discord:** Sentinely Server
- **Docs:** /docs folder

---

**Status:** ✅ READY FOR DEVNET TESTING  
**Last Updated:** April 6, 2026  
**Maintainer:** @Sentinely

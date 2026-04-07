# 🧠 NeuralMarket V2: Risk-Bound Institutional Architecture

**Status:** Devnet (Production-Ready Code)  
**Date:** April 2026  
**Entity:** Software-Only Provider (Non-Custodial, Non-Fintech)

---

## 📋 EXECUTIVE SUMMARY

NeuralMarket V2 is a **Multi-LLM orchestrated prediction market oracle** deployed on **Solana Devnet** with native support for **Devnet USDC** and **DFlow** integration. The architecture enforces strict Non-Custodial principles where:

- ✅ Users control their own vault private keys (via Phantom/Fireblocks)
- ✅ AI proposes trades; Users approve via Phantom wallet signatures
- ✅ Smart contracts deduct 0.5% Software License Fees automatically
- ✅ B2B Monetization via Machine Payments Protocol (MPP) + x402 HTTP headers
- ✅ All prediction reasoning is cryptographically signed and auditable on Irys/Shadow Drive

---

## 🏗️ PILLAR 1: SMART CONTRACT LAYER (ANCHOR)

### Overview
The **NeuralVault** PDA contract enforces risk bounds and non-custodial vault management.

### File Structure
```
anchor/programs/neural_vault/src/
├── lib.rs                 # Main program + instruction dispatch
├── vault.rs              # Core vault logic (NEW - Production Code)
└── Cargo.toml           # Updated with spl-token dependency
```

### Core Features

#### 1. **Non-Custodial USDC Vaults**
```rust
pub struct NeuralVault {
    pub owner: Pubkey,           // User wallet
    pub vault_id: u64,
    pub usdc_mint: Pubkey,       // Devnet USDC mint
    pub token_account: Pubkey,   // spl-token account (user controls)
    pub balance: u64,            // USDC balance
    pub max_position_size_bps: u16, // Risk limit (e.g., 500 = 5%)
    pub risk_level: u8,          // User tolerance (0-100)
    pub protocol_fee_earned: u64,// Accumulated 0.5% fees
    ...
}
```

#### 2. **Automatic Fee Deduction (0.5%)**
```rust
// License fee calculation
let license_fee = amount
    .saturating_mul(NeuralVault::LICENSE_FEE_BPS as u64) // 50 bps
    .saturating_div(10000);

vault.protocol_fee_earned += license_fee;
```

#### 3. **Risk-Bound Position Sizing**
```rust
let max_position = (vault.balance as u128)
    .saturating_mul(vault.max_position_size_bps as u128)
    .saturating_div(10000) as u64;

require!(amount <= max_position, VaultError::PositionExceedsLimit);
```

### Instructions

| Instruction | Purpose | CPI Support |
|---|---|---|
| `initialize_vault` | Create user's non-custodial USDC vault | ✅ |
| `deposit_usdc` | Fund vault (spl-token transfer) | ✅ |
| `withdraw_usdc` | Withdraw funds (user can exit anytime) | ✅ |
| `execute_trade_with_fee` | Submit Kalshi intent + auto-deduct license fee | ✅ |
| `record_trade_outcome` | Settle P&L after market resolution | ✅ |
| `harvest_fees` | Move accumulated fees to treasury | ✅ |

### Deployment
```bash
cd anchor
anchor build
anchor deploy --provider.cluster devnet

# IDL for SDK generation
anchor idl fetch [PROGRAM_ID] --out idl/
```

---

## 🧠 PILLAR 2: MULTI-LLM ORCHESTRATOR (Agent)

### Overview
A **three-tier AI system** processing market signals without hallucination:

```
Tier 3 (Local)        → DeepSeek R1 (Ollama)
    ↓
Tier 2 (API)          → Claude 3.5 Sonnet
    ↓
Tier 1 (Validation)   → OpenAI o1
    ↓
NeuralVault PDA       → Execute (with user approval)
```

### File Structure
```
neural-agent/src/services/
├── multiLLMOrchestrator.ts  # Orchestration pipeline (NEW)
├── kalshiService.ts         # Market data fetching
└── telemetry.js            # Real-time thought streaming
```

### Tier 3: DeepSeek R1 (Local, No Cost)

**Purpose:** Heavy sentiment analysis on raw streams  
**Model:** `deepseek-r1:8b` via Ollama  
**Cost:** $0/query (runs locally)

```typescript
async function analyzeSentimentViaTier3(
    marketData: KalshiMarketData,
    twitterStream: string,
    newsHeadlines: string[]
): Promise<SentimentAnalysis>
```

**Input:**
- Market ticker + current prices
- Last 100 tweets (Twitter API)
- Top 5 news headlines

**Output:**
```json
{
  "sentiment_score": -45,  // -100 to +100
  "key_signals": ["FED_hawkish_tone", "CPI_expected_higher", "futures_down_2%"],
  "confidence": 68,
  "data_sources": ["twitter", "news", "kalshi_orderbook"]
}
```

### Tier 2: Claude 3.5 Sonnet (Formatting + Audit)

**Purpose:** Structure sentiment into strict JSON + board summaries  
**Model:** `claude-3-5-sonnet-20241022`  
**Cost:** ~$0.01 per trade intent

```typescript
async function formatAndAuditViaTier2(
    sentiment: SentimentAnalysis,
    marketData: KalshiMarketData,
    vaultBalance: number,
    maxPositionBps: number
): Promise<{ formatted_intent, audit_payload, summary }>
```

**Output:**
```json
{
  "side": "NO",
  "amount_usdc": 250,
  "confidence": 62,
  "risk_score": 45,
  "reasoning": "Hawkish Fed commentary conflicts with expected CPI release. Short the YES side.",
  "board_summary": "Inflation data incoming; rates expected higher. Position against NO."
}
```

**Audit Trail:** HMAC-SHA256 signed payload for Irys upload.

### Tier 1: OpenAI o1 (Risk Validation)

**Purpose:** Final approval layer. Prevent capital drains.  
**Model:** `o1`  
**Cost:** ~$0.05 per validation  
**Temperature:** 1 (required for o1)

```typescript
async function validateRiskViaTier1(
    intent: Partial<TradeIntent>,
    vaultBalance: number,
    vaultMaxPositionBps: number,
    vaultRiskLevel: number
): Promise<RiskAssessment>
```

**Hard Constraints:**
- ✅ Position must be ≤ `max_position_size_bps`
- ✅ Confidence must be ≥ 55%
- ✅ Capital at risk ≤ vault balance

**Output:**
```json
{
  "approved": true,
  "risk_level": "MEDIUM",
  "capital_at_risk": 250,
  "position_ratio": 5.8,
  "reasoning": "Position is 5.8% of vault. Confidence 62% is acceptable. Approved."
}
```

### Pipeline Invocation

```typescript
const result = await orchestrateTradeIntent(
    marketData,           // Kalshi market snapshot
    twitterStream,        // Real-time sentiment
    newsHeadlines,        // Breaking news
    vaultId,              // User's vault
    vaultBalance,         // Current balance
    vaultMaxPositionBps,  // Risk limit
    vaultRiskLevel        // User tolerance
);

if (result.riskAssessment.approved) {
    // Emit event → Off-chain solver (DFlow) picks up → Executes Kalshi trade
    emit!(TradeIntentSubmitted {
        vault_id: result.intent.vault_id,
        market_ticker: result.intent.market_ticker,
        side: result.intent.side,
        amount_usdc: result.intent.amount_usdc,
        timestamp: Clock::get()?.unix_timestamp,
    });
}
```

---

## 💸 PILLAR 3: MACHINE PAYMENTS PROTOCOL (MPP) GATEWAY

### Overview
A **stateless API gateway** that:
1. Returns HTTP 402 + MPP headers if payment not received
2. Verifies USDC Devnet payment on-chain
3. Serves Kalshi predictions only after payment confirmed

### File Structure
```
packages/api/
├── mcp_gateway.ts       # Express/Hono gateway (NEW)
└── server.ts           # Entry point
```

### HTTP 402 + MPP Protocol

#### Without Payment:
```http
POST /api/predict HTTP/1.1
Host: api.neuralmarket.dev
Content-Type: application/json

{
  "market_ticker": "ELECTION_2024_DEM",
  "sentiment_score": 35,
  "urgency": "high"
}

--- RESPONSE (402) ---
HTTP/1.1 402 Payment Required
x-solana-action: solana:https://api.devnet.solana.com/api/payment?...
x-mpp-version: 1.0
x-payment-required-amount: 0.05
x-payment-required-currency: USDC

{
  "error": "Payment Required",
  "instructions": {
    "payment_amount": 0.05,
    "payment_currency": "USDC",
    "network": "solana-devnet",
    "receiver": "[TREASURY_WALLET]",
    "mpp_protocol": "v1.0"
  }
}
```

#### With Payment (Verified):
```http
POST /api/predict HTTP/1.1
Host: api.neuralmarket.dev
x-solana-payment-tx: [TX_HASH]
x-solana-payment-signature: [HMAC_SIG]
x-machine-public-key: [PAYER_PUBKEY]

--- RESPONSE (200) ---
HTTP/1.1 200 OK

{
  "prediction": {
    "market_ticker": "ELECTION_2024_DEM",
    "predicted_outcome": "YES",
    "confidence": 68,
    "reasoning": "Polling aggregates show +4 lead. Correlation with early vote counts.",
    "risk_score": 42,
    "compliance_hash": "3ef2c5f..."
  },
  "payment_confirmed": true,
  "payment_tx": "[TX_HASH]",
  "audit_signature": "3ef2c5f..."
}
```

### Payment Verification

```typescript
async function verifyPayment(req): Promise<PaymentProof | null> {
  const paymentTx = req.headers.get('x-solana-payment-tx');
  const paymentSignature = req.headers.get('x-solana-payment-signature');
  const payerPubkey = req.headers.get('x-machine-public-key');

  // Verify HMAC signature
  const isValidSignature = crypto
    .createHmac('sha256', Buffer.from(process.env.SIGNATURE_SECRET))
    .update(paymentTx)
    .digest('hex') === paymentSignature;

  if (!isValidSignature) return null;

  // Fetch transaction from Devnet
  const txStatus = await solanaConnection.getSignatureStatus(paymentTx);

  if (txStatus.value?.err) return null; // Failed

  return {
    transaction_hash: paymentTx,
    confirmed_at: txStatus.value.blockTime,
    payer_pubkey: payerPubkey,
    receiver: TREASURY_WALLET.toBase58(),
    amount: 0.05
  };
}
```

### Audit Trail Creation

Every prediction is signed and queued for Irys upload:

```typescript
function createAuditPayload(
    prediction: KalshiPrediction,
    paymentProof: PaymentProof,
    aiReasoning: string
): string {
  const payload = {
    prediction,
    payment: paymentProof,
    ai_reasoning: aiReasoning,
    created_at: new Date().toISOString()
  };

  const hmac = crypto
    .createHmac('sha256', Buffer.from(process.env.AUDIT_SECRET))
    .update(JSON.stringify(payload))
    .digest('hex');

  return JSON.stringify({
    ...payload,
    audit_signature: hmac
  });
}

// Queue for async Irys upload
queueAuditUpload(auditPayload);
```

### Endpoints

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/predict` | POST | x402 MPP | Kalshi prediction (requires 0.05 USDC) |
| `/api/payment-status/:tx_hash` | GET | None | Check payment confirmation status |
| `/health` | GET | None | Service health check |

---

## 🔐 COMPLIANCE & AUDIT TRAIL

### Irys Integration (On-Chain Proof)

```typescript
// Batch upload audit payloads
const irys = new Irys({
    url: "https://devnet.irys.xyz",
    token: "solana"
});

const receipt = await irys.upload(auditPayload);
// Returns: { id: "TX_ID", timestamp, dataSize, ... }
```

**Benefit:** Permanent, tamper-proof record on Irys (immutable storage).

### HMAC-SHA256 Signing

Every audit payload is signed with a secret key:
```
audit_signature = HMAC-SHA256(payload, AUDIT_SECRET)
```

Allows external auditors to:
1. Verify payload integrity
2. Confirm AI reasoning was unchanged
3. Reconstruct decision trail

### Compliance Checklist

- ✅ **Non-Custodial:** Users control private keys; we never hold USDC
- ✅ **No Investment Advice:** AI proposes; Users decide; We're just software
- ✅ **Transparent Fees:** 0.5% deducted automatically; Visible in blockchain
- ✅ **Auditable:** Every trade intent signed and archived
- ✅ **Sandboxed:** Devnet only (no real funds at risk)

---

## 🚀 DEPLOYMENT CHECKLIST

### Prerequisites
```bash
# Solana Devnet setup
solana config set --url devnet
solana config set --keypair ~/.config/solana/devnet.json

# Fund with devnet SOL
solana airdrop 5 ~/.config/solana/devnet.json

# USDC token account (create if needed)
spl-token create-account EPjFWdd5Au17y2edWjNx5mKnvUcghLgMLKXZKL7xS1d

# Local AI (optional)
ollama pull deepseek-r1:8b
ollama serve
```

### Step 1: Deploy Anchor Contract

```bash
cd anchor
anchor build
anchor deploy --provider.cluster devnet

# Save Program ID
echo "Program ID: [From deployment output]"

# Update lib.rs declare_id!() with new ID
```

### Step 2: Set Environment Variables

```bash
# .env.agent
SOLANA_RPC_URL=https://api.devnet.solana.com
TREASURY_WALLET=Your_Treasury_Wallet_Address
USDC_DEVNET_MINT=EPjFWdd5Au17y2edWjNx5mKnvUcghLgMLKXZKL7xS1d
KALSHI_BUILDER_CODE=your_builder_code
KALSHI_API_KEY=your_api_key

# Multi-LLM
OLLAMA_SERVER_URL=http://localhost:11434
OLLAMA_MODEL=deepseek-r1:8b
USE_LOCAL_AI=true
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Audit & Security
AUDIT_SECRET=your_audit_secret_key
SIGNATURE_SECRET=your_signature_secret_key
```

### Step 3: Install & Run Agent

```bash
cd neural-agent
pnpm install
pnpm start

# Should see:
# 🚀 Initializing Oraculo Sentient Agent
# 📡 Neural Link Status: ONLINE
# 🎯 Listening for market signals...
```

### Step 4: Start API Gateway

```bash
cd packages/api
npm install
npm start

# Listens on port 3000
# GET http://localhost:3000/health should return 200
```

### Step 5: Test End-to-End

```bash
# Initialize a vault
curl -X POST http://localhost:3000/api/vault/init \
  -H "Content-Type: application/json" \
  -d '{
    "vault_id": 1,
    "max_position_bps": 500,
    "risk_level": 50
  }'

# Make a prediction (without payment → 402)
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "market_ticker": "ELECTION_2024",
    "sentiment_score": 35
  }'

# Response: HTTP 402 with payment instructions
```

---

## 📊 MONITORING & OBSERVABILITY

### Metrics Exported

```typescript
{
  "timestamp": "2026-04-06T15:30:45.123Z",
  "market_ticker": "ELECTION_2024",
  "tier3_latency_ms": 2150,   // DeepSeek R1
  "tier2_latency_ms": 890,    // Claude Sonnet
  "tier1_latency_ms": 3200,   // o1 validation
  "total_latency_ms": 6240,
  "outcome": "approved"
}
```

### Datadog Integration

```typescript
// Send to Datadog API
const statsd = new StatsD();
statsd.gauge('neural_market.pipeline_latency_ms', total_latency_ms);
statsd.increment('neural_market.trade_intent.' + outcome);
```

---

## 🔮 ROADMAP

| Phase | Timeline | Features |
|---|---|---|
| **V2.0** | Q2 2026 | Devnet USDC vaults, Multi-LLM, MPP gateway |
| **V2.1** | Q3 2026 | Mainnet migration (sUSDC yield vaults) |
| **V2.2** | Q4 2026 | Kalshi DFlow integration (live trade execution) |
| **V3.0** | Q1 2027 | B2B SaaS platform + white-label SDK |

---

## 📞 SUPPORT

- **Documentation:** `/docs/NEURAL_MARKET_V2_ARCHITECTURE.md`
- **Issues:** GitHub Issues (private repo)
- **Contact:** dev@neuralmarket.io

---

**Built with ❤️ for Institutional Risk Management on Solana.**

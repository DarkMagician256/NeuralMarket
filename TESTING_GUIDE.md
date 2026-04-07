# 🧪 NeuralMarket V2: Testing & Validation Guide

---

## 1️⃣ ANCHOR CONTRACT TESTING

### Unit Tests (Devnet Bankrun)

```bash
cd anchor
cargo test --lib

# Expected output:
# test vault::tests::test_initialize_vault ... ok
# test vault::tests::test_deposit_withdraw ... ok
# test vault::tests::test_execute_trade_with_fee ... ok
# test vault::tests::test_risk_bounds ... ok
```

### Integration Tests (Devnet)

```bash
# Start Devnet validator (or use public API)
solana-test-validator

# Deploy contract
anchor deploy --provider.cluster devnet

# Run tests
anchor test --provider.cluster devnet

# Should see:
# ✅ Initialize vault
# ✅ Deposit USDC
# ✅ Execute trade with fee deduction
# ✅ Enforce position limits
```

### Manual Devnet Testing

```bash
# 1. Create a user vault
curl -X POST http://localhost:8000/vault/init \
  -H "Content-Type: application/json" \
  -d '{
    "user_pubkey": "YourDevnetWallet",
    "vault_id": 1,
    "max_position_bps": 500,
    "risk_level": 50
  }'

# Response:
# {
#   "vault_pda": "vault_address",
#   "token_account": "token_address",
#   "tx_hash": "..."
# }

# 2. Deposit USDC
curl -X POST http://localhost:8000/vault/deposit \
  -H "Content-Type: application/json" \
  -d '{
    "vault_pda": "vault_address",
    "amount": 1000000  // 1 USDC
  }'

# 3. Execute trade
curl -X POST http://localhost:8000/vault/execute-trade \
  -H "Content-Type: application/json" \
  -d '{
    "vault_pda": "vault_address",
    "market_ticker": "FED_RATES_2026",
    "side": 0,  // NO
    "amount": 50000,  // 0.05 USDC
    "execution_price": 4500  // 45.00 cents
  }'

# Should deduct:
# - License fee: 0.05 * 0.005 = 0.00025 USDC
# - Net executed: 0.04975 USDC
```

---

## 2️⃣ MULTI-LLM ORCHESTRATOR TESTING

### Quick Local Test (No API Costs)

```typescript
// test/multiLLMOrchestrator.test.ts

import { orchestrateTradeIntent, KalshiMarketData } from '../src/services/multiLLMOrchestrator';

describe('Multi-LLM Orchestrator', () => {
  it('should generate a trade intent end-to-end', async () => {
    const market: KalshiMarketData = {
      ticker: 'FED_RATES_MAR26',
      description: 'Will the Fed raise rates in March 2026?',
      current_price_yes: 0.65,
      current_price_no: 0.35,
      volume_24h: 50000,
      liquidity_depth: 25000,
    };

    const twitterStream = `
      Tweet: "Fed speakers signal hawkish stance"
      Tweet: "CPI higher than expected"
      Tweet: "Bond yields rising"
    `;

    const newsHeadlines = [
      "Inflation Remains Sticky Above 3%",
      "Fed Officials: More Rate Hikes Likely",
    ];

    const result = await orchestrateTradeIntent(
      market,
      twitterStream,
      newsHeadlines,
      'vault_123',
      10000,  // $10k vault
      500,    // 5% max position
      50      // medium risk tolerance
    );

    // Assertions
    expect(result.riskAssessment).toBeDefined();
    expect(result.riskAssessment.risk_level).toMatch(/LOW|MEDIUM|HIGH|CRITICAL/);

    if (result.riskAssessment.approved) {
      expect(result.intent).toBeDefined();
      expect(result.intent?.market_ticker).toBe('FED_RATES_MAR26');
      expect(result.intent?.side).toMatch(/YES|NO/);
      expect(result.intent?.amount_usdc).toBeLessThanOrEqual(500); // 5% of 10k
    }
  });
});
```

### Run Test

```bash
cd neural-agent
pnpm install
pnpm test

# Expected output:
# ✓ should generate a trade intent end-to-end (6234ms)
# 
# Test Suites: 1 passed, 1 total
# Tests:       1 passed, 1 total
```

### Pipeline Latency Benchmark

```bash
# Measure tier latencies
cd neural-agent
npm run benchmark:llm

# Output:
# [METRICS] {
#   "tier3_latency_ms": 2150,
#   "tier2_latency_ms": 890,
#   "tier1_latency_ms": 3200,
#   "total_latency_ms": 6240,
#   "outcome": "approved"
# }

# Should expect:
# - Tier 3 (Ollama local): 2-4 seconds
# - Tier 2 (Claude API): 0.8-1.5 seconds
# - Tier 1 (o1): 3-5 seconds
# - TOTAL: 6-10 seconds
```

---

## 3️⃣ MPP GATEWAY TESTING

### Health Check (No Auth Required)

```bash
curl -X GET http://localhost:3000/health

# Response (200):
# {
#   "status": "healthy",
#   "timestamp": "2026-04-06T15:30:45.123Z",
#   "network": "solana-devnet"
# }
```

### Test 402 Payment Required

```bash
# Call without payment headers → should return 402
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "market_ticker": "ELECTION_2024_DEM",
    "historical_data": "poll_aggregates",
    "sentiment_score": 35,
    "urgency": "high"
  }'

# Response (402):
# {
#   "error": "Payment Required",
#   "instructions": {
#     "payment_amount": 0.05,
#     "payment_currency": "USDC",
#     "network": "solana-devnet",
#     "receiver": "[TREASURY_WALLET]",
#     "mpp_protocol": "v1.0"
#   }
# }
```

### Test with Valid Payment

```bash
# Simulate USDC payment (Devnet only)
# 1. User sends 0.05 USDC to treasury
# 2. Get transaction hash
TX_HASH="5K7d8q9mL2pN6xJ4...";

# 3. Create HMAC signature
SIGNATURE=$(echo -n "$TX_HASH" | openssl dgst -sha256 -hmac "your_signature_secret" | xxd -r -p | base64)

# 4. Call with payment proof
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -H "x-solana-payment-tx: $TX_HASH" \
  -H "x-solana-payment-signature: $SIGNATURE" \
  -H "x-machine-public-key: YourPublicKey" \
  -d '{
    "market_ticker": "ELECTION_2024_DEM",
    "historical_data": "poll_aggregates",
    "sentiment_score": 35,
    "urgency": "high"
  }'

# Response (200):
# {
#   "prediction": {
#     "market_ticker": "ELECTION_2024_DEM",
#     "predicted_outcome": "YES",
#     "confidence": 68,
#     "reasoning": "Polling aggregates show +4 lead...",
#     "risk_score": 42,
#     "compliance_hash": "3ef2c5f..."
#   },
#   "payment_confirmed": true,
#   "payment_tx": "$TX_HASH",
#   "audit_signature": "3ef2c5f..."
# }
```

### Payment Status Check

```bash
curl -X GET http://localhost:3000/api/payment-status/$TX_HASH

# Response (200):
# {
#   "status": "confirmed",
#   "block_time": "finalized"
# }
```

---

## 4️⃣ INTEGRATION TEST: END-TO-END

### Setup

```bash
# 1. Start Ollama (Tier 3)
ollama serve &

# 2. Deploy Anchor contract
cd anchor && anchor deploy --provider.cluster devnet

# 3. Start Agent
cd neural-agent && pnpm start &

# 4. Start Gateway
cd packages/api && npm start &

# All services should be running:
# ✅ Anchor RPC on Devnet
# ✅ Ollama on localhost:11434
# ✅ Agent on localhost:9999 (or console output)
# ✅ Gateway on localhost:3000
```

### Full Workflow

```bash
# Step 1: Initialize Vault
VAULT_ID=1
USDC_MINT="EPjFWdd5Au17y2edWjNx5mKnvUcghLgMLKXZKL7xS1d"

curl -X POST http://localhost:3001/vault/init \
  -H "Authorization: Bearer $DEVNET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "vault_id": '$VAULT_ID',
    "max_position_bps": 500,
    "risk_level": 50,
    "usdc_mint": "'$USDC_MINT'"
  }'

# Response: vault_pda, vault_token_account

# Step 2: Deposit USDC
curl -X POST http://localhost:3001/vault/deposit \
  -H "Authorization: Bearer $DEVNET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "vault_pda": "[vault_address]",
    "amount": 10000000  // 10 USDC
  }'

# Step 3: Trigger Multi-LLM (Agent listens every 15s)
# Agent will:
# - Fetch Kalshi markets
# - Run Tier 3 (DeepSeek sentiment)
# - Run Tier 2 (Claude formatting)
# - Run Tier 1 (o1 validation)
# - Emit TradeIntentSubmitted event

# Step 4: Get prediction via MPP Gateway
curl -X POST http://localhost:3000/api/predict \
  -H "x-solana-payment-tx: [proof]" \
  -H "x-solana-payment-signature: [sig]" \
  -d '{ "market_ticker": "FED_RATES_MAR26", ... }'

# Step 5: Manually execute trade (in production, DFlow solver does this)
curl -X POST http://localhost:3001/vault/execute-trade \
  -H "Authorization: Bearer $DEVNET_KEY" \
  -d '{
    "vault_pda": "[vault_address]",
    "market_ticker": "FED_RATES_MAR26",
    "side": 1,  // YES
    "amount": 250000  // 0.25 USDC
  }'

# Expected results:
# ✅ License fee deducted: 0.25 * 0.005 = 0.00125 USDC
# ✅ Net amount executed: 0.24875 USDC
# ✅ Event emitted: TradeExecutedWithFee
# ✅ Audit trail uploaded to Irys

# Step 6: Check vault state
curl -X GET http://localhost:3001/vault/state/[vault_pda]

# Response shows:
# {
#   "balance": 9999875,  // 10,000,000 - 0.00125M lamports
#   "protocol_fee_earned": 1250,  // Accumulated fees
#   "total_delegated_volume": 248750
# }
```

---

## 5️⃣ MONITORING & DEBUGGING

### Agent Console Output

```
🚀 Initializing Oraculo Sentient Agent
📡 Neural Link Status: ONLINE
🎯 Listening for market signals...

[15s heartbeat]
📊 Analyzing FED_RATES_MAR26 [Vol: 125000]. Price at 65¢ implies HIGH_CONVICTION_YES...

[Multi-LLM trigger]
📊 Tier 3: Analyzing sentiment via DeepSeek R1...
✅ Sentiment: -35 (confidence: 68%)
📋 Tier 2: Formatting intent via Claude Sonnet...
✅ Intent formatted. Summary: Hawkish Fed, short the YES.
🛡️ Tier 1: Validating risk via OpenAI o1...
✅ Risk Assessment: MEDIUM (Approved: true)
✨ Pipeline Complete: APPROVED

[Telemetry broadcast]
[METRICS] {
  "timestamp": "2026-04-06T...",
  "market_ticker": "FED_RATES_MAR26",
  "tier3_latency_ms": 2150,
  "tier2_latency_ms": 890,
  "tier1_latency_ms": 3200,
  "total_latency_ms": 6240,
  "outcome": "approved"
}
```

### Gateway Logs

```
[API] POST /api/predict - 402 Payment Required
[API] x-solana-payment-tx missing
[API] User instructed to pay 0.05 USDC

[API] POST /api/predict - Payment verified ✅
[API] Payment TX: 5K7d8q9mL2pN6xJ4...
[API] Serving prediction for ELECTION_2024_DEM
[AUDIT] Uploading to Irys: 3ef2c5f...
[API] 200 OK - Prediction sent
```

---

## 6️⃣ EXPECTED RESULTS SUMMARY

| Component | Test | Expected Result |
|---|---|---|
| **Anchor** | Initialize vault | ✅ PDA created, balance = 0 |
| **Anchor** | Deposit 10 USDC | ✅ Balance = 10,000,000 lamports |
| **Anchor** | Execute 250 USDC trade | ✅ Fee deducted (1,250 lamports), balance = 9,998,750 |
| **Tier 3** | DeepSeek sentiment | ✅ Score -100 to +100, latency 2-4s |
| **Tier 2** | Claude formatting | ✅ JSON intent, audit trail, latency 0.8-1.5s |
| **Tier 1** | o1 validation | ✅ Approved/rejected, latency 3-5s |
| **Gateway** | No payment | ✅ 402 MPP response |
| **Gateway** | Valid payment | ✅ 200 prediction JSON |
| **E2E** | Full pipeline | ✅ 6-10 seconds total, prediction with audit |

---

## 🐛 Troubleshooting

### Ollama Not Responding
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If failing, restart
ollama serve &

# Pull model if missing
ollama pull deepseek-r1:8b
```

### Anthropic API Error
```
Error: 401 Unauthorized
→ Check ANTHROPIC_API_KEY in .env
→ Verify API key has correct permissions
```

### Solana RPC Timeout
```
Error: Failed to fetch transaction
→ Check SOLANA_RPC_URL (default: https://api.devnet.solana.com)
→ Consider using local validator for faster tests
```

### Payment Verification Fails
```
Error: Signature verification failed
→ Ensure x-solana-payment-signature matches HMAC
→ Check SIGNATURE_SECRET in .env matches client secret
```

---

## 📊 Success Criteria

✅ All unit tests pass  
✅ Integration tests on Devnet pass  
✅ Multi-LLM pipeline completes in < 10s  
✅ Gateway returns 402 without payment, 200 with payment  
✅ License fees deducted correctly (0.5%)  
✅ Audit trails signed and uploadable to Irys  
✅ Risk constraints enforced (position ≤ max_position_bps)  
✅ No hallucination rejections (confidence ≥ 55%)  

---

**Ready to test? Start with Step 1️⃣ ANCHOR TESTING above.**

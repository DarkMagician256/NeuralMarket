# 📑 NeuralMarket V2: FILE INDEX

Guía rápida para encontrar cualquier archivo en el proyecto.

---

## 🏗️ SMART CONTRACTS (ANCHOR)

| Archivo | Ubicación | Propósito | Líneas |
|---------|-----------|----------|---------|
| **vault.rs** | `anchor/programs/neural_vault/src/vault.rs` | Lógica completa de bóveda | 400+ |
| **lib.rs** | `anchor/programs/neural_vault/src/lib.rs` | Instrucciones principales | 200+ |
| **Cargo.toml** | `anchor/programs/neural_vault/Cargo.toml` | Dependencias | - |

### Estructuras Principales
- `NeuralVault` - Cuenta PDA de bóveda
- `VaultRiskSnapshot` - Snapshot de riesgo
- 6 Instructions: `initialize_vault`, `deposit_usdc`, `withdraw_usdc`, `execute_trade_with_fee`, `record_trade_outcome`, `harvest_fees`

---

## 🧠 AGENT & MULTI-LLM ORCHESTRATOR

| Archivo | Ubicación | Propósito | Líneas |
|---------|-----------|----------|---------|
| **multiLLMOrchestrator.ts** | `neural-agent/src/services/multiLLMOrchestrator.ts` | Pipeline Tier 1/2/3 | 350+ |
| **multiLLMTradeIntent.ts** | `neural-agent/src/actions/multiLLMTradeIntent.ts` | ElizaOS Action | 200+ |
| **agent.ts** | `neural-agent/src/agent.ts` | ElizaOS Runtime | MODIFICADO |
| **package.json** | `neural-agent/package.json` | Dependencies | MODIFICADO |

### Funciones Principales
- `orchestrateTradeIntent()` - Pipeline completo
- `analyzeSentimentViaTier3()` - DeepSeek R1
- `formatAndAuditViaTier2()` - Claude Sonnet
- `validateRiskViaTier1()` - OpenAI o1

---

## 💸 MPP GATEWAY (API)

| Archivo | Ubicación | Propósito | Líneas |
|---------|-----------|----------|---------|
| **server.ts** | `packages/api/src/server.ts` | Production Gateway | 200+ |
| **server-demo.ts** | `packages/api/src/server-demo.ts` | Demo (HMAC offline) | 140+ |
| **test-gateway.ts** | `packages/api/src/test-gateway.ts` | Test Suite | 180+ |
| **package.json** | `packages/api/package.json` | Dependencies | CREADO |

### Endpoints
```
GET  /health                    - Health check
POST /api/predict              - Prediction (x402)
GET  /api/payment-status/:tx   - Payment status
```

---

## 📚 DOCUMENTACIÓN

| Archivo | Descripción | Casos de Uso |
|---------|-------------|--------------|
| **NEURAL_MARKET_V2_ARCHITECTURE.md** | Arquitectura completa (400+ líneas) | Entender el design |
| **TESTING_GUIDE.md** | Guía step-by-step de testing | Ejecutar tests |
| **IMPLEMENTATION_CHECKLIST.md** | Status & roadmap | Tracking de features |
| **DEPLOYMENT_SUMMARY.md** | Resumen de deployment | Verificar que todo funciona |
| **QUICKSTART.md** | Quick reference (este archivo) | Setup rápido |
| **FILE_INDEX.md** | Este índice | Navegar el proyecto |

---

## 🔍 BÚSQUEDA RÁPIDA

### "¿Dónde está el contrato de bóveda?"
→ `anchor/programs/neural_vault/src/vault.rs`

### "¿Dónde está el orchestrador Multi-LLM?"
→ `neural-agent/src/services/multiLLMOrchestrator.ts`

### "¿Dónde está el Gateway MPP?"
→ `packages/api/src/server-demo.ts` (demo mode, HMAC offline)
→ `packages/api/src/server.ts` (production, RPC on-chain)

### "¿Cómo hago un test del Gateway?"
→ `QUICKSTART.md` → Sección "Probar con Curl"

### "¿Cuál es el Program ID?"
→ `A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F`
→ Archivo: `.env.local` (NEXT_PUBLIC_SOLANA_PROGRAM_ID)

### "¿Cómo intego con Ollama?"
→ `neural-agent/src/services/multiLLMOrchestrator.ts` (línea ~75)

### "¿Dónde están los tests?"
→ `packages/api/src/test-gateway.ts`
→ `TESTING_GUIDE.md`

---

## 🎯 POR FUNCIONALIDAD

### Non-Custodial USDC Vaults
- `anchor/programs/neural_vault/src/vault.rs` - líneas 30-100 (deposit/withdraw)
- `anchor/programs/neural_vault/src/vault.rs` - líneas 130-160 (trade execution)

### Risk Validation
- `neural-agent/src/services/multiLLMOrchestrator.ts` - líneas 250-320 (Tier 1)
- `anchor/programs/neural_vault/src/vault.rs` - líneas 70-90 (position limits)

### License Fee Deduction
- `anchor/programs/neural_vault/src/vault.rs` - líneas 155-165
- Rate: 0.5% (50 basis points)

### HMAC Audit Trail
- `packages/api/src/server.ts` - líneas 35-50 (verification)
- `neural-agent/src/services/multiLLMOrchestrator.ts` - líneas 160-175 (creation)

### HTTP 402 + MPP
- `packages/api/src/server-demo.ts` - líneas 80-95 (402 response)
- `packages/api/src/server.ts` - líneas 70-90 (headers)

---

## 📊 CONTEO DE LÍNEAS

```
Smart Contracts (Anchor):
  - vault.rs:              400+ líneas
  - lib.rs:                200+ líneas (modificadas)
  Total:                   600+ líneas

Agent (Multi-LLM):
  - multiLLMOrchestrator.ts:    350+ líneas
  - multiLLMTradeIntent.ts:     200+ líneas
  - agent.ts:                   MODIFICADO
  Total:                   550+ líneas

Gateway (API):
  - server.ts:             200+ líneas
  - server-demo.ts:        140+ líneas
  - test-gateway.ts:       180+ líneas
  Total:                   520+ líneas

Documentation:
  - ARCHITECTURE.md:       400+ líneas
  - TESTING_GUIDE.md:      300+ líneas
  - Other docs:            500+ líneas
  Total:                   1200+ líneas

CODE TOTAL:              ~1670+ líneas (production)
DOCS TOTAL:              ~1200+ líneas
```

---

## 🔗 RELACIONES ENTRE ARCHIVOS

```
.env.local (config)
    ├─ USDC_MINT → vault.rs
    ├─ TREASURY_WALLET → vault.rs + server.ts
    ├─ ANTHROPIC_API_KEY → multiLLMOrchestrator.ts
    ├─ OPENAI_API_KEY → multiLLMOrchestrator.ts
    └─ SIGNATURE_SECRET → server.ts

vault.rs (contract)
    ├─ emit VaultInitialized → blockchain
    ├─ emit TradeExecutedWithFee → blockchain
    └─ Uses spl-token (Cargo.toml dependency)

multiLLMOrchestrator.ts
    ├─ Calls analyzeSentimentViaTier3() (Ollama)
    ├─ Calls formatAndAuditViaTier2() (Claude)
    ├─ Calls validateRiskViaTier1() (o1)
    └─ Returns TradeIntent

multiLLMTradeIntent.ts (ElizaOS Action)
    ├─ Uses multiLLMOrchestrator.ts
    ├─ Fetches market data from KalshiService
    └─ Registers in agent.ts

server.ts / server-demo.ts (Gateway)
    ├─ Receives POST /api/predict
    ├─ Calls verifyPayment()
    ├─ Calls generateKalshiPrediction() [stub → multiLLMOrchestrator in prod]
    └─ Returns prediction with audit trail
```

---

## 🚀 FLUJO DE EJECUCIÓN

```
1. User sends → /api/predict (sin pago)
                    ↓
2. Gateway checks → verifyPayment() → FAIL
                    ↓
3. Gateway returns → 402 + x-mpp headers
                    ↓
4. User sends USDC → wallet signature
                    ↓
5. User sends → /api/predict (con headers x402)
                    ↓
6. Gateway checks → verifyPayment() → OK
                    ↓
7. Gateway calls → generateKalshiPrediction()
                    ↓
8. (En prod) Pipeline Multi-LLM:
    - Tier 3: DeepSeek R1 (sentiment)
    - Tier 2: Claude Sonnet (format)
    - Tier 1: OpenAI o1 (validate)
                    ↓
9. Gateway creates → audit trail (HMAC)
                    ↓
10. Gateway returns → 200 OK + prediction JSON
                    ↓
11. (Async) Queue → Irys upload (audit trail)
                    ↓
12. (Async) Emit → Smart contract event
                    ↓
13. Smart contract deducts → 0.5% license fee
```

---

## 💾 BACKUP & VERSIONING

Todos los archivos están en Git:
```
git log --oneline | head -10
```

Para revisar cambios:
```
git diff anchor/programs/neural_vault/src/lib.rs
git show 4h6jmENwEid:anchor/programs/neural_vault/src/vault.rs
```

---

## 🔧 ARCHIVOS DE CONFIGURACIÓN

| Archivo | Propósito |
|---------|-----------|
| `.env.local` | Variables de entorno (Devnet config) |
| `Cargo.toml` (root) | Rust workspace |
| `Cargo.toml` (anchor) | Anchor dependencies |
| `package.json` (root) | Node.js workspace |
| `package.json` (neural-agent) | Agent dependencies |
| `package.json` (api) | Gateway dependencies |
| `tsconfig.json` | TypeScript config |
| `.solcoveragerc.js` | Coverage config |

---

## 📞 RECURSOS EXTERNOS

- **Solana Devnet Explorer:** https://solscan.io/?cluster=devnet
- **Program ID:** A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F
- **RPC:** https://devnet.helius-rpc.com/?api-key=...
- **USDC Mint:** EPjFWdd5Au17y2edWjNx5mKnvUcghLgMLKXZKL7xS1d

---

**Última actualización:** Abril 6, 2026, 23:50 UTC

¿No encuentras algo? Abre un issue en GitHub.

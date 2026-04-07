# 🚀 NeuralMarket V2: QUICKSTART GUIDE

**Setup tiempo:** ~5 minutos  
**Requisitos:** Solana CLI, Node.js 20+, Rust  
**Network:** Solana Devnet

---

## 1️⃣ COMPILAR & DESPLEGAR CONTRATO

```bash
# Entrar al directorio de Anchor
cd anchor

# Compilar
cargo build --release

# Deploy en Devnet
anchor deploy --provider.cluster devnet

# ✅ Verás:
# Program Id: A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F
# Signature: 4h6jmENwEidGpEB66rXjndUtvepLihiATDwR7bacAW7rTm4...
```

**Status:** ✅ Contrato listo en Devnet

---

## 2️⃣ LEVANTAR MPP GATEWAY (Demo Mode)

```bash
# Terminal 1: Gateway
cd packages/api
npm install
npx tsx src/server-demo.ts

# ✅ Verás:
# 📡 Server running on http://localhost:3002
# 🧪 Test with: npm run test
```

**Status:** ✅ Gateway escuchando en puerto 3002

---

## 3️⃣ PROBAR CON CURL (Test Manual)

### Test 1: Health Check
```bash
curl http://localhost:3002/health
# → 200 OK + {"status": "healthy", ...}
```

### Test 2: Sin Pago (402)
```bash
curl -X POST http://localhost:3002/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "market_ticker": "FED_RATES_MAR26",
    "sentiment_score": 35
  }'

# → 402 Payment Required
# + Headers x-mpp-version, x-payment-required-amount, etc.
```

### Test 3: Con Pago (Simulado)
```bash
# Crear firma HMAC
TX_HASH="5K7d8q9mL2pN6xJ4vR2wT8yU9zV0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sTu0vW"
SIGNATURE=$(echo -n "$TX_HASH" | openssl dgst -sha256 -hmac "secret-key" -hex | awk '{print $NF}')

# Enviar con headers x402
curl -X POST http://localhost:3002/api/predict \
  -H "Content-Type: application/json" \
  -H "x-solana-payment-tx: $TX_HASH" \
  -H "x-solana-payment-signature: $SIGNATURE" \
  -H "x-machine-public-key: GrokAI1234567890..." \
  -d '{
    "market_ticker": "ELECTION_2024",
    "sentiment_score": 45,
    "urgency": "normal"
  }'

# → 200 OK + Predicción JSON
# {
#   "prediction": {
#     "market_ticker": "ELECTION_2024",
#     "predicted_outcome": "YES",
#     "confidence": 73,
#     "reasoning": "...",
#     "risk_score": 45,
#     "compliance_hash": "0184e044..."
#   },
#   "payment_confirmed": true,
#   "payment_tx": "5K7d8q9m...",
#   "audit_signature": "0184e044..."
# }
```

---

## 4️⃣ CÓDIGO FUENTE PRINCIPAL

### Smart Contract (Vault)
```
anchor/programs/neural_vault/src/
├── lib.rs          ← Instrucciones principales
├── vault.rs        ← Lógica completa (400+ líneas)
└── Cargo.toml      ← Dependencias
```

### Agent (Multi-LLM)
```
neural-agent/src/
├── services/multiLLMOrchestrator.ts    ← Pipeline 3-capas
├── actions/multiLLMTradeIntent.ts      ← ElizaOS integration
└── agent.ts                             ← Modified
```

### Gateway (MPP)
```
packages/api/src/
├── server.ts           ← Production (con RPC on-chain)
├── server-demo.ts      ← Demo (HMAC offline)
└── test-gateway.ts     ← Suite de pruebas
```

---

## 5️⃣ CONFIGURACIÓN AMBIENTAL

Actualizar `.env.local`:

```bash
# Network & Wallet
SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_KEY
TREASURY_WALLET=A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F
USDC_DEVNET_MINT=EPjFWdd5Au17y2edWjNx5mKnvUcghLgMLKXZKL7xS1d

# Multi-LLM
OLLAMA_SERVER_URL=http://localhost:11434
OLLAMA_MODEL=deepseek-r1:8b
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Security
AUDIT_SECRET=your-audit-secret
SIGNATURE_SECRET=secret-key
```

---

## 6️⃣ OPCIONALES: FULL PIPELINE (CON OLLAMA)

### Instalar Ollama
```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Descargar modelo DeepSeek R1
ollama pull deepseek-r1:8b

# Iniciar servidor
ollama serve
```

### Levantar Agent
```bash
cd neural-agent
pnpm install
pnpm start

# ✅ El agent comenzará a escuchar mercados de Kalshi
```

---

## 📊 FLUJO COMPLETO (Con Todo Activado)

```
┌─ AI Agent (Local)
│   • Escucha mercados Kalshi cada 15s
│   • Detecta oportunidades
│
├─ Multi-LLM Pipeline
│   • Tier 3: DeepSeek R1 (sentiment)
│   • Tier 2: Claude Sonnet (formato)
│   • Tier 1: OpenAI o1 (validación)
│
├─ MPP Gateway
│   • Recibe requests de máquinas externas
│   • Verifica pago (x402 headers)
│   • Retorna predicción + audit trail
│
└─ Blockchain (Devnet)
    • Smart contract ejecuta trade
    • Deducta 0.5% fee automático
    • Emite evento on-chain
```

---

## 🧪 TROUBLESHOOTING

### "Port already in use"
```bash
pkill -9 node
pkill -9 tsx
sleep 2
npm run dev
```

### "Compilation errors"
```bash
cargo clean
cargo build --release
```

### "HMAC signature invalid"
```bash
# Asegúrate que SIGNATURE_SECRET coincida en cliente y servidor
echo -n "test_tx" | openssl dgst -sha256 -hmac "secret-key" -hex
```

### "No connection to Devnet"
```bash
# Verificar RPC
curl -s https://api.devnet.solana.com -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}'
```

---

## 📚 DOCUMENTACIÓN COMPLETA

- `NEURAL_MARKET_V2_ARCHITECTURE.md` ← Arquitectura completa
- `TESTING_GUIDE.md` ← Guía de testing
- `IMPLEMENTATION_CHECKLIST.md` ← Status y roadmap
- `DEPLOYMENT_SUMMARY.md` ← Resumen de deployment

---

## 🔗 RECURSOS ÚTILES

- **Solana Devnet Faucet:** https://faucet.solana.com
- **Solscan (Devnet):** https://solscan.io/?cluster=devnet
- **Anchor Docs:** https://docs.anchor-lang.com
- **Kalshi API:** https://kalshi.com/api
- **MPP Standard:** https://github.com/metaplex-foundation/mpl-core

---

## 🎯 PRÓXIMAS PRUEBAS

1. **Integración Real con Kalshi**
   ```bash
   # Usar KALSHI_API_KEY real en .env
   export KALSHI_API_KEY=...
   pnpm start
   ```

2. **Irys Upload (Audit Trail)**
   ```bash
   # Configurar Irys credentials
   export IRYS_WALLET=...
   export IRYS_PRIVATE_KEY=...
   ```

3. **Devnet USDC Real**
   ```bash
   # Crear token account
   spl-token create-account EPjFWdd5Au17y2edWjNx5mKnvUcghLgMLKXZKL7xS1d
   
   # Obtener devnet USDC (airdrop)
   curl -s https://api.devnet.solana.com/airdrop/...
   ```

---

**Tiempo estimado para tener todo corriendo: 5-10 minutos**

Pregunta en issues si necesitas ayuda. 🚀

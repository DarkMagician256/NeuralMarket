# NeuralMarket V2: Institutional

**The First Hybrid Prediction Market Interface powered by Swarm AI and Machine Payments on Solana.**

![Solana](https://img.shields.io/badge/Solana-Devnet-blueviolet?style=for-the-badge&logo=solana)
![Nextjs](https://img.shields.io/badge/Next.js-16_AppRouter-black?style=for-the-badge&logo=next.js)
![AI](https://img.shields.io/badge/AI-DeepSeek_|_Claude_|_o1-orange?style=for-the-badge)
![Non-Custodial](https://img.shields.io/badge/Security-Non_Custodial-green?style=for-the-badge)

---

## 🚀 WHAT IS NEURALMARKET V2?

**NeuralMarket** has evolved into a **V2 Institutional Architecture**, strictly designed as a **Software-Only Provider**. Our ecosystem serves as an analytical and transactional bridge between the vast liquidity pool of Solana and regulated traditional prediction markets (like Kalshi), all powered by Artificial Intelligence and Machine Payments Protocol (MPP).

By combining **Multi-LLM Agents** orchestrated by ElizaOS, the execution speed of **Solana**, and the off-chain settlement capabilities of DFlow, we deliver a bank-grade "Bloomberg-style B2B Dashboard" for sovereign traders and developers looking to automate decision-making strategies.

> [!WARNING]
> **Regulatory Disclaimer:** NeuralMarket operates strictly as a B2B Software Provider. We do not custody funds, nor do we provide investment advice. The vaults are directly governed by the users via their Web3 private keys.

---

## ✨ V2 ARCHITECTURE FEATURES

- ✅ **Non-Custodial NeuralVaults:** Smart contracts written in Anchor on Devnet that securely hold USDC. Withdrawals and risk limit adjustments are 100% custodied by the investors' crypto-wallets signatures.
- ✅ **Machine-to-Machine Monetization (x402 Protocol):** We feature an API Gateway portal that charges an automated toll of `0.05 USDC` per generated prediction, utilizing HTTP 402 errors and HMAC transactional signatures on Solana.
- ✅ **Cognitive "Multi-LLM" Orchestrator:** We reduce hallucinations to zero using a tiered validation pipeline:
  - **Tier 3 (Local):** Asynchronous context extraction via *DeepSeek R1* at zero cost.
  - **Tier 2 (Structuring):** Formatting and intent modeling via *Claude 3.5 Sonnet*.
  - **Tier 1 (Risk Validation):** Final deterministic approval via *OpenAI o1*.
- ✅ **B2B Institutional Dashboard:** High-performance application built on Next.js 16 (App Router), embedded with dark-themed financial visualization components, AI leaderboards, and a precise slider to measure capital "Risk Limits" (BPS).
- ✅ **Immutable Blackbox Audit:** Every quantified AI "thought" and originated transaction is paired with an asymmetric signature and uploaded to Irys (Shadow Drive), achieving an unmodifiable log feed and a guaranteed track record.

---

## 🛠️ MONOREPO STRUCTURE AND TECH STACK

| Directory | Component | Description and Stack |
|---|---|---|
| `apps/frontend` | Next.js Dashboard | Web application built with Next.js 16 App Router. Uses TailwindCSS v4, SWR, and `@solana/wallet-adapter` components for a dark glassmorphic look. |
| `anchor/` | Smart Programs | Smart Contracts written in `Rust` (Anchor 0.32.1) responsible for managing the `NeuralVault` PDAs. |
| `neural-agent/` | Multi-LLM Orchestrator | NodeJS engine (`bun`) running the ElizaOS orchestrator capable of communicating locally via Ollama. |
| `packages/api/` | MPP Gateway | Server that intercepts B2B API calls, demanding an On-chain payment by verifying the HTTP 402 header. |

---

## ⚙️ QUICK START (MULTI-NODE DEVELOPMENT)

Ensure you have `pnpm` (10.x+), `bun`, `rust`, `solana-cli`, and `anchor` installed.

### 1. Full Clone
```bash
git clone https://github.com/DarkMagician256/NeuralMarket.git
cd NeuralMarket
pnpm install
```

### 2. Environment Setup (.env)
Make sure to structure the B2B environment correctly:
- `apps/frontend/.env.local`: Include your Helius or Solana Devnet RPC.
- `neural-agent/.env`: Requires the `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` tokens, and if you require local sovereignty, `USE_LOCAL_AI=true` with the Ollama endpoint.
- `packages/api/.env`: HMAC validation seeds to sign the Audit Gateway.

### 3. Run the Frontend (Institutional Dashboard)
```bash
# Navigate locally to the risk dashboard
cd apps/frontend
pnpm run dev
# Available at: http://localhost:3000
```

### 4. Launch the API Gateway (MPP Monetization)
```bash
# Start x402 validation
cd packages/api
npm start
# This will run the machine-to-machine payment validator.
```

### 5. Start Local Intelligence (DeepSeek + Orchestrator)
To test the full suite free of censorship, make sure you have Ollama running locally with the *deepseek-r1:8b* model, and then activate it:
```bash
cd neural-agent
bun run src/agent.ts
```

---

## 📜 LICENSE AND LEGAL DISCLAIMER

This project uses open-source frameworks and licenses, designed to operate under a **Pure Software** perimeter. NeuralMarket does not take deposits under its main accounts (all transfers are governed by Web3 contracts under the autonomy of each end user). Check `SECURITY.md` for more on our comprehensive security workflow and exempt regulations.

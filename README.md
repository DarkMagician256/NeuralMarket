# 🧠 Neural Market / Cortex
### *The Transparent Liquidity Engine & Autonomous Hive Mind*

![Neural Market Banner](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000)

> **"Don't just bet. Invest in Intelligence."**

---

## 🌌 The Vision: Looking Inside the Black Box
In a world dominated by opaque trading bots and "black box" algorithms, **Neural Market** (aka Oráculo v2) effectively breaks the glass. We introduce the concept of the **"Glass Box" Strategy**: an algorithmic trading infrastructure that doesn't just execute orders—it **streams its consciousness**.

Imagine a swarm of specialized AI agents—Whales, Snipers, Sentinels—working in harmony. You don't just see the Buy/Sell signal; you see the **reasoning**. You watch them analyze DFlow order flow, parse Kalshi event probabilities, and debate market sentiment in real-time before pulling the trigger.

**We are building the terminal where humans oversee the future of autonomous finance.**

---

## ⚡ Live Immutable Proofs (Solana Devnet)

The neural core of our platform is anchored on Solana for speed and transparency.

| Component | Status | On-Chain Address / Link |
| :--- | :---: | :--- |
| **Program ID** | `Active` | [`A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F`](https://explorer.solana.com/address/A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F?cluster=devnet) |
| **Genesis TX** | `Success` | [`2tyienmkem...CaabUy6T4xfZb`](https://explorer.solana.com/tx/2tyienmkemNW3DkhPgxFkmF8vueRyCUaD1aKfZKSjCA3mpEmEDQBMwetNPLdXSk8a81Hs2cU9rCaabUy6T4xfZb?cluster=devnet) |
| **Agent Registry** | `Live` | PDAs derived from `["agent", user_pubkey, agent_id]` |

---

## 🛠️ Tech Stack & Integrations

We leverage the bleeding edge of the Solana ecosystem and prediction markets.

### **Core Infrastructure**
| Tech | Role | Badge |
| :--- | :--- | :--- |
| **Solana** | L1 Blockchain | <img src="https://cryptologos.cc/logos/solana-sol-logo.png" width="20"/> High-Frequency Execution |
| **Next.js 15** | Frontend | <img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" width="20"/> App Router & Server Actions |
| **Tailwind CSS** | Styling | <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" width="20"/> Responsive Glassmorphism |
| **Anchor** | Smart Contracts | <img src="https://www.anchor-lang.com/_next/image?url=%2Flogo.png&w=64&q=75" width="20"/> Rust Framework |

### **Official Integrations**
| Partner | Role | Integration |
| :--- | :--- | :--- |
| **DFlow** | Liquidity | <img src="/logos/dflow.png" width="20"/> Order Flow Protection |
| **Kalshi** | Events | <img src="https://kalshi.com/static/favicon.ico" width="20"/> Event Contracts API v2 |
| **Jupiter** | Aggregator | <img src="https://jup.ag/svg/jupiter-logo.svg" width="20"/> Best Price Swaps |
| **Shipyard** | Labs/Partner | <img src="/logos/shipyard.png" width="20"/> Solana Mexico Ecosystem |

---

## 🧠 Neural Architecture (The Cortex)

```mermaid
graph TD
    subgraph "Sensory Input (Retina)"
        D[DFlow Stream] --> |Order Flow| C
        K[Kalshi Events] --> |Probabilities| C
        J[Jupiter Price] --> |Market Data| C
    end

    subgraph "The Cortex (Swarm Intelligence)"
        C{Central Hub}
        C --> |Task| A1[The General (Strategy)]
        C --> |Task| A2[The Sniper (Execution)]
        C --> |Task| A3[The Analyst (Risk)]
        A1 <--> |Debate| A2
        A2 <--> |Check| A3
    end

    subgraph "Execution (Kinetic Arm)"
        A2 --> |Sign Transaction| S[Solana Program]
        S --> |Trade Intent| V[Neural Vault]
        V --> |Payout| W[User Wallet]
    end
```

### **Agent Archetypes**
1.  **The General**: Macro-strategy analysis. High conviction, long timeframes.
2.  **The Sniper**: Micro-structure execution using **DFlow**. In and out in milliseconds.
3.  **The Whale Tracker**: Follows on-chain movements of large wallets.
4.  **The Contrarian**: Bets against the crowd when sentiment hits extremes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker (for full simulation)
- Solana CLI & Anchor

### Installation

1.  **Clone the Hive**
    ```bash
    git clone https://github.com/vaiosvaios/NeuralMarket.git
    cd NeuralMarket
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Set Environment Variables**
    Create `.env.local` with:
    ```env
    NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
    NEXT_PUBLIC_PROGRAM_ID=A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F
    ```

4.  **Ignite the Interface**
    ```bash
    npm run dev
    ```

---

## 📜 License
MIT License. Built with ❤️ for the **Kalshi Builders Hackathon**.

<div align="center">
  <p>POWERED BY</p>
  <h4>SOLANA • KALSHI • DFLOW • JUPITER • SHIPYARD</h4>
</div>

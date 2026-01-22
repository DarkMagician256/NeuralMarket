# NeuralMarket

**AI-Powered Prediction Markets Interface on Solana**

A premium trading interface that connects crypto-native users to prediction markets. Built with Next.js, Solana, and integrated with DFlow and Jupiter.

![Solana](https://img.shields.io/badge/Solana-Devnet-blueviolet)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Live Demo

**Production:** https://neural-market.vercel.app

**Smart Contract (Devnet):** `A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F`

---

## ✨ Features

- **Wallet Integration** - Phantom, Solflare, and other Solana wallets
- **On-Chain Trading** - Every trade recorded on Solana blockchain
- **AI Trading Agents** - Autonomous agents with on-chain statistics
- **Real-Time Leaderboard** - Rankings pulled directly from blockchain
- **Governance System** - Community voting on new markets
- **Builder Code Monetization** - Revenue attribution ready

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Framer Motion |
| Blockchain | Solana, Anchor Framework |
| Data | Supabase (PostgreSQL) |
| Styling | Tailwind CSS |
| Wallet | @solana/wallet-adapter |

---

## 📦 Installation

### Prerequisites

- Node.js 20+
- pnpm 9+
- Solana CLI (optional, for contract development)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Eras256/NeuralMarket.git
cd NeuralMarket

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
pnpm run dev
```

Open http://localhost:3000 to view the application.

---

## ⚙️ Environment Variables

Create a `.env.local` file with:

```env
# Solana
NEXT_PUBLIC_HELIUS_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_PROGRAM_ID=A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F
NEXT_PUBLIC_SOLANA_CLUSTER=devnet

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Optional
KALSHI_BUILDER_CODE=YOUR_BUILDER_CODE
```

---

## 🔗 Smart Contract

The NeuralVault program is deployed on Solana Devnet:

```
Program ID: A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F
```

### Key Instructions

| Instruction | Description |
|-------------|-------------|
| `createAgentStandalone` | Create a new trading agent |
| `recordTradeStandalone` | Record a trade on-chain |
| `submitTradeIntent` | Submit order for DFlow execution |
| `deactivateAgent` | Pause an agent |
| `reactivateAgent` | Resume an agent |

### Build Contract (Optional)

```bash
cd anchor
anchor build
anchor deploy --provider.cluster devnet
```

---

---

## 🐋 Run a Sovereign Node (Self-Hosted)
For institutional setups requiring 100% uptime and local execution of AI Agents:

The repository includes a production-ready `docker-compose` setup that orchestrates:
1.  **Neural Dashboard**: The full Next.js interface (`Dockerfile.frontend`)
2.  **Cortex Agent Service**: The backend daemon for autonomous trading (`neural-agent/Dockerfile`)

### Quick Launch
```bash
# 1. Configure environment
cp .env.example .env.local

# 2. Launch the stack
docker-compose up -d --build
```

- **Dashboard**: `http://localhost:3000`
- **Agent Service**: Running in background (logs: `docker logs neural-agent`)

---

## 📁 Project Structure

```
NeuralMarket/
├── app/                    # Next.js App Router pages
│   ├── actions/           # Server actions (trade execution)
│   ├── markets/           # Markets listing and detail
│   ├── leaderboard/       # Agent rankings
│   ├── governance/        # Voting system
│   ├── portfolio/         # User positions
│   └── profile/           # Trade history
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and data
├── anchor/                # Solana smart contract
│   └── programs/
│       └── neural_vault/  # Main program
└── scripts/               # Utility scripts
```

---

## 🧪 Testing

```bash
# Run development server
pnpm run dev

# Build for production
pnpm run build

# Test smart contract
cd anchor
anchor test
```

---

## 🤝 Integrations

| Partner | Integration |
|---------|-------------|
| **DFlow** | Order routing for prediction market trades |
| **Jupiter** | Native swap integration for payments |
| **Solana** | Primary blockchain infrastructure |

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 👥 Team

- **Lead Developer** - Smart contracts & platform architecture
- **Marketing & Commercial** - Go-to-market & partnerships
- **UX/UI Designer** - Visual design & user experience

---

## 📬 Contact

For inquiries about the Kalshi Builders Program integration:

- GitHub: https://github.com/Eras256/NeuralMarket
- Live Demo: https://neural-market.vercel.app

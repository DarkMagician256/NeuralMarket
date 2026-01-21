# Neural-Market Architecture Blueprint

## System Overview
The Neural-Market platform connects user wallets to DFlow's institutional liquidity via a Next.js proxy and Solana Smart Contracts.

## Data Flow Diagram (Mermaid)

```mermaid
graph TD
    User[User / Browser]
    
    subgraph "Client Layer (Neural Glass)"
        UI[React UI (Next.js)]
        Wallet[Phantom Wallet]
        Mesh[WebGL Background]
    end
    
    subgraph "Server Layer (Next.js Edge)"
        Proxy[API Proxy / Server Actions]
        Auth[SIWS Auth Handler]
    end
    
    subgraph "Blockchain Layer (Solana)"
        Anchor[Neural Vault Program]
        SPL[SPL Tokens (Prediction Shares)]
        RPC[Solana RPC]
    end
    
    subgraph "Institutional Data"
        DFlow[DFlow API / Liquidity]
        Kalshi[Kalshi Markets]
    end

    User -->|Interacts| UI
    UI -->|Connects| Wallet
    UI -->|Reads Markets| Proxy
    Proxy -->|Authenticated Req| DFlow
    DFlow -->|Market Data| Proxy
    
    User -->|Signs Tx| Wallet
    Wallet -->|Submits Tx| RPC
    RPC -->|Executes| Anchor
    Anchor -->|Logs Volume| UserStats(PDA)
    
    DFlow -.->|Liquidity Matching| SPL
    UI -->|WebSockets| DFlow
```

## Component Description
1. **Neural Glass UI**: Handles user interaction, visualization, and wallet connection.
2. **Next.js Proxy**: Securely manages `DFLOW_API_KEY` and forwards read requests.
3. **Neural Vault (Anchor)**: On-chain program for reputation tracking and additional verification.
4. **DFlow Integration**: Provides the underlying order book and settlement.

## Security Model
- **Keys**: API Keys are server-side only.
- **Signing**: Users sign all trade instructions via Phantom.
- **Verification**: Smart contract validates `discriminator` and seeds.

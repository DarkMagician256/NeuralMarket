# 📦 @neuralmarket/sdk-ts

**Official TypeScript SDK for NeuralMarket V2**

Institutional-grade AI prediction market oracle on Solana. Abstracts complex cryptography behind beautiful developer experience.

---

## ✨ Features

- ✅ **Vault Management** - Non-custodial USDC vaults with risk limits
- ✅ **AI Predictions** - Kalshi signals with invisible micro-payments
- ✅ **Immutable Audits** - Complete reasoning trails via Irys
- ✅ **Zero Complexity** - No Anchor/Solana knowledge required
- ✅ **Stripe-Level DX** - Clean, intuitive API
- ✅ **Strict TypeScript** - Full type safety, zero `any` types

---

## 🚀 Quick Start

### Installation

```bash
npm install @neuralmarket/sdk
# or
pnpm add @neuralmarket/sdk
```

### Basic Usage

```typescript
import { NeuralMarketSDK } from '@neuralmarket/sdk';
import { Keypair } from '@solana/web3.js';

// Initialize SDK
const keypair = Keypair.generate(); // Or load from wallet

const sdk = new NeuralMarketSDK({
  rpcUrl: 'https://devnet.helius-rpc.com/?api-key=YOUR_KEY',
  keypair: {
    publicKey: keypair.publicKey.toBytes(),
    secretKey: keypair.secretKey,
  },
});

// Create vault
await sdk.vault.initializeVault({ maxPositionBps: 500 });

// Deposit USDC
await sdk.vault.deposit({ amountUsdc: 10000 });

// Query AI prediction (auto-handles 0.05 USDC payment)
const signal = await sdk.oracle.queryKalshiSignal({
  marketTicker: 'FED_RATES_MAR26',
});

console.log('Predicted side:', signal.side);
console.log('Confidence:', signal.confidence, '%');

// Get immutable reasoning from Irys
const reasoning = await sdk.compliance.getTradeReasoning(txHash);
console.log('AI reasoning:', reasoning.tier2Intent.reasoning);
```

---

## 📚 Complete Examples

### 1. Vault Management

```typescript
const vault = sdk.vault;

// Initialize vault (create on-chain account)
const initResponse = await vault.initializeVault({
  maxPositionBps: 500,  // 5% max per position
  riskLevel: 60,        // Risk tolerance 0-100
});

console.log('Vault created:', initResponse.vaultPubkey);

// Deposit USDC
const depositResponse = await vault.deposit({
  amountUsdc: 50000,
  maxSlippage: 100, // 1%
});

console.log('New balance:', depositResponse.newBalanceUsdc, 'USDC');

// Get vault state
const state = await vault.getVaultState();
console.log('Balance:', state.balanceCents / 100, 'USDC');
console.log('Max position:', state.maxPositionBps / 100, '%');
console.log('Fees collected:', state.totalFeesCents / 100, 'USDC');

// Update risk limits
await vault.setRiskLimits({
  maxPositionBps: 300,  // Reduce to 3%
  riskLevel: 40,        // Lower risk tolerance
});

// Withdraw
await vault.withdraw(5000); // Withdraw 5000 USDC
```

### 2. Oracle Predictions (Automatic Payments)

```typescript
const oracle = sdk.oracle;

// Query Kalshi signal
// This automatically:
// 1. Requests prediction
// 2. Receives 402 Payment Required
// 3. Sends 0.05 USDC to treasury
// 4. Awaits confirmation
// 5. Fetches final prediction
const signal = await oracle.queryKalshiSignal({
  marketTicker: 'FED_RATES_MAR26',
  maxPriceBps: 9500,
  timeoutMs: 30000,
});

// Complete signal data
console.log('Side:', signal.side);                  // YES or NO
console.log('Amount:', signal.amount, 'USDC');
console.log('Confidence:', signal.confidence, '%');  // 0-100
console.log('Risk score:', signal.riskScore, '%');  // 0-100

// AI reasoning
console.log('Reasoning:', signal.reasoning);

// Kalshi market context
console.log('YES bid:', signal.kalshiContext.marketSnapshot.yesBidBps / 100, '%');
console.log('NO bid:', signal.kalshiContext.marketSnapshot.noBidBps / 100, '%');
console.log('Is live:', signal.kalshiContext.marketSnapshot.isLive);

// Top traders consensus
console.log(
  'Consensus:',
  signal.kalshiContext.topTradersConsensus.consensusSide,
  '@',
  signal.kalshiContext.topTradersConsensus.consensusBps / 100,
  '%'
);
```

### 3. Compliance & Audit Trails

```typescript
const compliance = sdk.compliance;

// Get complete reasoning from Irys
const reasoning = await compliance.getTradeReasoning(txHash);

// Multi-tier reasoning
console.log('Tier 3 (Sentiment):', reasoning.tier3Sentiment);  // -100 to +100
console.log('Tier 2 (Intent):', reasoning.tier2Intent);        // Formatted trade
console.log('Tier 1 (Risk):', reasoning.tier1RiskLevel);       // LOW/MEDIUM/HIGH/CRITICAL

// Kalshi market snapshot at time of trade
console.log('Market YES bid:', reasoning.kalshiSnapshot.yesBidBps / 100, '%');
console.log('Market NO bid:', reasoning.kalshiSnapshot.noBidBps / 100, '%');
console.log('Was live:', reasoning.kalshiSnapshot.isLive);

// Top traders data
console.log('Traders consensus:', reasoning.topTradersConsensus.consensusSide);
console.log('Trader count:', reasoning.topTradersConsensus.traderCount);

// Audit metadata
console.log('Created:', reasoning.auditMetadata.createdAt);
console.log('Tier 2 model:', reasoning.auditMetadata.tier2Model);
console.log('Irys ID:', reasoning.auditMetadata.irysTxId);

// Compliance checklist
reasoning.complianceChecklist.forEach((item) => console.log(item));

// Verify signature
const isValid = await compliance.verifyReasoningSignature(
  reasoning,
  expectedHash
);
```

---

## 🔧 Advanced Configuration

### Custom RPC & Gateway URLs

```typescript
const sdk = new NeuralMarketSDK({
  rpcUrl: 'https://custom-rpc.example.com',
  keypair: {...},
  programId: 'YOUR_PROGRAM_ID',
  mcpGatewayUrl: 'https://custom-api.example.com/v1',
  irysGatewayUrl: 'https://custom-irys.example.com',
  commitment: 'finalized',
});
```

### Load Keypair from Environment

```typescript
import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';

// Load from Solana CLI keypair file
const keypairFile = fs.readFileSync(
  process.env.HOME + '/.config/solana/id.json',
  'utf-8'
);
const keypairArray = JSON.parse(keypairFile);
const keypair = Keypair.fromSecretKey(
  Uint8Array.from(keypairArray)
);

const sdk = new NeuralMarketSDK({
  rpcUrl: process.env.SOLANA_RPC_URL!,
  keypair: {
    publicKey: keypair.publicKey.toBytes(),
    secretKey: keypair.secretKey,
  },
});
```

### Health Checks

```typescript
// Verify SDK connectivity
if (await sdk.isHealthy()) {
  console.log('✅ SDK is ready');
} else {
  console.error('❌ SDK initialization failed');
}
```

---

## 📊 Data Structures

### VaultState

```typescript
interface VaultState {
  pubkey: string;              // Vault public key
  balanceCents: number;        // USDC balance in cents
  maxPositionBps: number;      // Max position (0-10000 BPS)
  riskLevel: number;           // Risk tolerance (0-100)
  isActive: boolean;           // Vault status
  totalFeesCents: number;      // Cumulative fees harvested
  lastUpdated: number;         // Timestamp
}
```

### KalshiSignal

```typescript
interface KalshiSignal {
  marketTicker: string;        // Market ID
  side: 'YES' | 'NO';
  amount: number;              // USDC amount
  confidence: number;          // 0-100%
  riskScore: number;           // 0-100%
  reasoning: string;           // AI explanation
  timestamp: number;
  predictionId: string;
  kalshiContext: {
    marketSnapshot: {
      yesBidBps: number;       // YES bid in BPS
      noBidBps: number;        // NO bid in BPS
      isLive: boolean;
    };
    topTradersConsensus: {
      consensusSide: 'YES' | 'NO';
      consensusBps: number;
    };
  };
}
```

### TradeReasoning

```typescript
interface TradeReasoning {
  txHash: string;
  marketTicker: string;
  tier3Sentiment: number;      // -100 to +100
  tier2Intent: {
    side: 'YES' | 'NO';
    amount: number;
    confidence: number;
    riskScore: number;
    reasoning: string;
  };
  tier1RiskLevel: string;      // LOW/MEDIUM/HIGH/CRITICAL
  kalshiSnapshot: {
    yesBidBps: number;
    noBidBps: number;
    isLive: boolean;
    timestamp: number;
  };
  topTradersConsensus: {
    consensusSide: string;
    consensusBps: number;
    traderCount: number;
  };
  auditMetadata: {
    createdAt: string;
    tier2Model: string;
    irysTxId: string;
    auditHash: string;
  };
  complianceChecklist: string[];
}
```

---

## ⚠️ Error Handling

```typescript
import { NeuralMarketSDK } from '@neuralmarket/sdk';

try {
  const signal = await sdk.oracle.queryKalshiSignal({
    marketTicker: 'FED_RATES_MAR26',
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Error code:', error.message.split(': ')[0]);
    console.error('Message:', error.message);
  }
}

// Common errors:
// [VaultClient] VAULT_INIT_FAILED
// [VaultClient] DEPOSIT_FAILED
// [VaultClient] RISK_UPDATE_FAILED
// [OracleClient] QUERY_FAILED
// [ComplianceClient] FETCH_REASONING_FAILED
```

---

## 🔐 Security Notes

1. **Never commit keypairs to version control**
   - Use environment variables or key management services
   - Use Solana Wallet Adapter for user-facing apps

2. **Micro-payment safety**
   - SDK automatically handles 0.05 USDC MPP payments
   - Transactions are atomic and secure
   - No private keys exposed

3. **Audit trail integrity**
   - All reasoning is immutable on Irys
   - HMAC signatures prevent tampering
   - Solana Tx Hash provides on-chain proof

4. **Non-custodial design**
   - SDK never controls vault funds
   - User's keypair is required for all operations
   - Withdrawals require signature authorization

---

## 📖 API Reference

### VaultClient

```typescript
class VaultClient {
  initializeVault(params: VaultInitParams): Promise<VaultInitResponse>;
  deposit(params: DepositParams): Promise<DepositResponse>;
  withdraw(amountUsdc: number): Promise<DepositResponse>;
  setRiskLimits(limits: RiskLimits): Promise<RiskUpdateResponse>;
  getVaultState(): Promise<VaultState>;
}
```

### OracleClient

```typescript
class OracleClient {
  queryKalshiSignal(query: KalshiSignalQuery): Promise<KalshiSignal>;
}
```

### ComplianceClient

```typescript
class ComplianceClient {
  getTradeReasoning(txHash: string): Promise<TradeReasoning>;
  getTradeReasoningByIrysId(irysTxId: string, solanaHash?: string): Promise<TradeReasoning>;
  verifyReasoningSignature(reasoning: TradeReasoning, expectedHash: string): Promise<boolean>;
}
```

---

## 🤝 Contributing

Contributions welcome! Please ensure:

- ✅ 100% TypeScript coverage (no `any` types)
- ✅ Full JSDoc comments
- ✅ Tests for all methods
- ✅ Backward compatibility

---

## 📄 License

MIT

---

## 🔗 Resources

- **Documentation:** https://docs.neuralmarket.io
- **GitHub:** https://github.com/neural-market/neural-market
- **Discord:** https://discord.gg/neuralmarket
- **Kalshi Builders:** https://kalshi.com/builders

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** April 6, 2026

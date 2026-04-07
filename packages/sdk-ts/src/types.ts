/**
 * ============ NEURALMARKET SDK TYPES ============
 *
 * Core type definitions for the NeuralMarket SDK
 * Maintains strict type safety across all clients
 */

/**
 * Configuration for SDK initialization
 * Supports both backend (keypair) and frontend (wallet adapter) modes
 */
export interface NeuralMarketConfig {
  /** Solana RPC endpoint (Devnet) */
  rpcUrl: string;

  /** Backend mode: Keypair for transaction signing (mutually exclusive with signTransaction) */
  keypair?: {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
  };

  /** Frontend mode: Wallet adapter signTransaction function (non-custodial) */
  signTransaction?: (transaction: any) => Promise<any>;

  /** User's public key (required if using signTransaction, auto-derived from keypair otherwise) */
  publicKey?: string;

  /** NeuralVault program ID */
  programId?: string;

  /** Optional: Custom Irys gateway URL */
  irysGatewayUrl?: string;

  /** Optional: Custom MCP gateway URL */
  mcpGatewayUrl?: string;

  /** Optional: Commitment level (default: confirmed) */
  commitment?: 'processed' | 'confirmed' | 'finalized';
}

/**
 * Vault initialization parameters
 */
export interface VaultInitParams {
  /** Maximum position size in basis points (0-10000) */
  maxPositionBps: number;

  /** Risk level (0-100) */
  riskLevel: number;

  /** Optional: Vault bump seed (auto-generated if not provided) */
  bump?: number;
}

/**
 * Risk limit configuration
 */
export interface RiskLimits {
  /** Maximum position size in basis points */
  maxPositionBps: number;

  /** Risk tolerance level (0-100) */
  riskLevel?: number;
}

/**
 * Deposit parameters
 */
export interface DepositParams {
  /** Amount in USDC (will be converted to cents internally) */
  amountUsdc: number;

  /** Optional: Maximum slippage (in BPS, default: 100 = 1%) */
  maxSlippage?: number;
}

/**
 * Kalshi market signal query
 */
export interface KalshiSignalQuery {
  /** Market ticker (e.g., "FED_RATES_MAR26") */
  marketTicker: string;

  /** Optional: Maximum price willing to pay (BPS) */
  maxPriceBps?: number;

  /** Optional: Timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
}

/**
 * Kalshi market signal response
 */
export interface KalshiSignal {
  /** Market ticker */
  marketTicker: string;

  /** AI predicted side (YES or NO) */
  side: 'YES' | 'NO';

  /** Predicted amount in USDC */
  amount: number;

  /** Confidence level (0-100) */
  confidence: number;

  /** Risk score (0-100) */
  riskScore: number;

  /** AI reasoning for the prediction */
  reasoning: string;

  /** Timestamp of prediction */
  timestamp: number;

  /** Unique prediction ID for audit trail */
  predictionId: string;

  /** Kalshi context (market snapshot + top traders) */
  kalshiContext: {
    marketSnapshot: {
      yesBidBps: number;
      noBidBps: number;
      isLive: boolean;
    };
    topTradersConsensus: {
      consensusSide: 'YES' | 'NO';
      consensusBps: number;
    };
  };
}

/**
 * Trade reasoning from audit trail
 */
export interface TradeReasoning {
  /** Solana transaction hash */
  txHash: string;

  /** Market ticker */
  marketTicker: string;

  /** Tier 3 sentiment score (-100 to +100) */
  tier3Sentiment: number;

  /** Tier 2 formatted intent */
  tier2Intent: {
    side: 'YES' | 'NO';
    amount: number;
    confidence: number;
    riskScore: number;
    reasoning: string;
  };

  /** Tier 1 risk assessment */
  tier1RiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  /** Kalshi market snapshot at time of trade */
  kalshiSnapshot: {
    yesBidBps: number;
    noBidBps: number;
    isLive: boolean;
    timestamp: number;
  };

  /** Top traders consensus */
  topTradersConsensus: {
    consensusSide: 'YES' | 'NO';
    consensusBps: number;
    traderCount: number;
  };

  /** Audit trail metadata */
  auditMetadata: {
    createdAt: string;
    tier2Model: string;
    irysTxId: string;
    auditHash: string;
  };

  /** Compliance checklist */
  complianceChecklist: string[];
}

/**
 * Vault state snapshot
 */
export interface VaultState {
  /** Vault public key */
  pubkey: string;

  /** Current USDC balance (in cents) */
  balanceCents: number;

  /** Maximum position size (BPS) */
  maxPositionBps: number;

  /** Risk level (0-100) */
  riskLevel: number;

  /** Whether vault is active */
  isActive: boolean;

  /** Total fee harvested (in cents) */
  totalFeesCents: number;

  /** Last updated timestamp */
  lastUpdated: number;
}

/**
 * MPP payment status
 */
export interface PaymentStatus {
  /** Whether payment was successful */
  success: boolean;

  /** Transaction hash */
  txHash?: string;

  /** Amount paid (in cents) */
  amountPaidCents?: number;

  /** Error message if failed */
  error?: string;

  /** Timestamp */
  timestamp: number;
}

/**
 * SDK error with context
 */
export interface NeuralMarketError {
  /** Error code */
  code: string;

  /** Human-readable message */
  message: string;

  /** Additional context */
  context?: Record<string, unknown>;

  /** Original error (if available) */
  originalError?: Error;
}

/**
 * Deposit response with transaction details
 */
export interface DepositResponse {
  /** Transaction hash */
  txHash: string;

  /** Amount deposited (in USDC) */
  amountUsdc: number;

  /** New vault balance (in USDC) */
  newBalanceUsdc: number;

  /** Timestamp */
  timestamp: number;
}

/**
 * Risk limit update response
 */
export interface RiskUpdateResponse {
  /** Transaction hash */
  txHash: string;

  /** Updated max position (BPS) */
  maxPositionBps: number;

  /** Updated risk level */
  riskLevel: number;

  /** Timestamp */
  timestamp: number;
}

/**
 * Vault initialization response
 */
export interface VaultInitResponse {
  /** Vault public key */
  vaultPubkey: string;

  /** Vault token account */
  vaultTokenAccount: string;

  /** Initialization transaction hash */
  txHash: string;

  /** Timestamp */
  timestamp: number;
}

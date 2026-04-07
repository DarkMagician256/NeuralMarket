/**
 * ============ NEURALMARKET SDK: MAIN ENTRY POINT ============
 *
 * Official TypeScript SDK for NeuralMarket V2
 * Abstracts complex Solana/Anchor/MPP details behind clean DX
 *
 * @example
 * ```typescript
 * import { NeuralMarketSDK } from '@neuralmarket/sdk';
 *
 * const sdk = new NeuralMarketSDK({
 *   rpcUrl: 'https://devnet.helius-rpc.com/?api-key=YOUR_KEY',
 *   keypair: { publicKey: Uint8Array, secretKey: Uint8Array },
 * });
 *
 * // Institutional vault
 * await sdk.vault.initializeVault({ maxPositionBps: 500 });
 * await sdk.vault.deposit({ amountUsdc: 10000 });
 * const state = await sdk.vault.getVaultState();
 *
 * // AI predictions with invisible MPP payments
 * const signal = await sdk.oracle.queryKalshiSignal({
 *   marketTicker: 'FED_RATES_MAR26',
 * });
 *
 * // Immutable audit trails
 * const reasoning = await sdk.compliance.getTradeReasoning(txHash);
 * ```
 */

import VaultClient from './clients/vault';
import OracleClient from './clients/oracle';
import ComplianceClient from './clients/compliance';
import type { NeuralMarketConfig } from './types';

export {
  VaultClient,
  OracleClient,
  ComplianceClient,
};

export type {
  NeuralMarketConfig,
  VaultInitParams,
  RiskLimits,
  DepositParams,
  KalshiSignalQuery,
  KalshiSignal,
  TradeReasoning,
  VaultState,
  PaymentStatus,
  NeuralMarketError,
  DepositResponse,
  RiskUpdateResponse,
  VaultInitResponse,
} from './types';

/**
 * Main SDK class combining all three clients
 *
 * Provides unified interface for:
 * 1. Vault management (deposits, risk limits)
 * 2. Oracle queries (Kalshi predictions)
 * 3. Compliance audits (Irys reasoning)
 */
export class NeuralMarketSDK {
  /** Vault operations (deposits, risk management) */
  public vault: VaultClient;

  /** Oracle operations (Kalshi signals with MPP payments) */
  public oracle: OracleClient;

  /** Compliance operations (immutable audit trails) */
  public compliance: ComplianceClient;

  /**
   * Initialize the NeuralMarket SDK
   *
   * @param config - Configuration with RPC, keypair, and program ID
   *
   * @example
   * ```typescript
   * const sdk = new NeuralMarketSDK({
   *   rpcUrl: 'https://devnet.helius-rpc.com',
   *   keypair: {
   *     publicKey: new Uint8Array([...]),
   *     secretKey: new Uint8Array([...]),
   *   },
   *   programId: 'A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F',
   * });
   * ```
   */
  constructor(config: NeuralMarketConfig) {
    this.vault = new VaultClient(config);
    this.oracle = new OracleClient(config);
    this.compliance = new ComplianceClient(config);
  }

  /**
   * Health check: Verify all clients are properly initialized
   *
   * @returns Whether SDK is ready
   */
  async isHealthy(): Promise<boolean> {
    try {
      // Test vault connectivity
      await this.vault.getVaultState();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get SDK version
   */
  static get version(): string {
    return '1.0.0';
  }
}

// Default export
export default NeuralMarketSDK;

/**
 * Create SDK instance with minimal config
 * (utility function for quick initialization)
 */
export function createSDK(config: NeuralMarketConfig): NeuralMarketSDK {
  return new NeuralMarketSDK(config);
}

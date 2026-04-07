/**
 * ============ NEURALMARKET SDK CLIENT FACTORY ============
 *
 * Non-custodial SDK initialization for wallet adapter integration
 *
 * This factory creates SDK instances that work with Phantom/Solflare wallets
 * WITHOUT storing private keys in the frontend.
 *
 * Usage:
 * ```typescript
 * const { publicKey, signTransaction, connection } = useWallet();
 * const sdk = createSDKClient({ publicKey, signTransaction, connection });
 * await sdk.vault.deposit({ amountUsdc: 1000 });
 * // Phantom wallet automatically prompts user to sign transaction
 * ```
 */

import { Connection, PublicKey } from '@solana/web3.js';
import {
  NeuralMarketSDK,
  VaultClient,
  OracleClient,
  ComplianceClient,
} from '@neuralmarket/sdk';

interface SDKClientFactoryParams {
  connection: Connection;
  publicKey: PublicKey;
  signTransaction: (transaction: any) => Promise<any>;
}

/**
 * Create a non-custodial SDK instance for use with wallet adapters
 *
 * @param params - Connection, publicKey, and signTransaction from useWallet()
 * @returns NeuralMarketSDK instance ready to use
 *
 * @throws Error if required parameters are missing
 */
export function createSDKClient({
  connection,
  publicKey,
  signTransaction,
}: SDKClientFactoryParams): NeuralMarketSDK {
  if (!connection || !publicKey || !signTransaction) {
    throw new Error('Missing required wallet connection parameters');
  }

  const config = {
    rpcUrl: connection.rpcEndpoint,
    publicKey: publicKey.toString(),
    signTransaction,
    programId: 'A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F',
  };

  return new NeuralMarketSDK(config);
}

/**
 * Helper hook-style function to safely initialize SDK in React components
 *
 * Usage:
 * ```typescript
 * export function MyComponent() {
 *   const { connection, publicKey, signTransaction } = useWallet();
 *   const { vault, oracle, compliance, isReady } = useSDK(
 *     connection,
 *     publicKey,
 *     signTransaction
 *   );
 *
 *   if (!isReady) return <Loading />;
 *   return <div onClick={() => vault.deposit({ amountUsdc: 100 })} />;
 * }
 * ```
 */
export function useSDK(
  connection: Connection | null,
  publicKey: PublicKey | null,
  signTransaction: ((transaction: any) => Promise<any>) | undefined
) {
  const isReady =
    !!connection && !!publicKey && !!signTransaction;

  let sdk: NeuralMarketSDK | null = null;

  if (isReady) {
    try {
      sdk = createSDKClient({
        connection: connection!,
        publicKey: publicKey!,
        signTransaction: signTransaction!,
      });
    } catch (error) {
      console.error('[SDK] Failed to initialize:', error);
    }
  }

  return {
    vault: sdk?.vault,
    oracle: sdk?.oracle,
    compliance: sdk?.compliance,
    isReady: isReady && !!sdk,
    error: isReady && !sdk ? new Error('Failed to initialize SDK') : null,
  };
}

/**
 * Singleton pattern for SDK (optional, for apps that only need one instance)
 */
let globalSDKInstance: NeuralMarketSDK | null = null;

export function setGlobalSDK(sdk: NeuralMarketSDK): void {
  globalSDKInstance = sdk;
}

export function getGlobalSDK(): NeuralMarketSDK | null {
  return globalSDKInstance;
}

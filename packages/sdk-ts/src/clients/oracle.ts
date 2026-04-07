/**
 * ============ ORACLECLIENT: MPP PAYMENT ABSTRACTION ============
 *
 * The masterpiece: Hides the x402 Protocol handshake behind
 * a single beautiful method call.
 *
 * Developer calls: oracle.queryKalshiSignal()
 * SDK silently handles:
 * 1. Initial request (receives 402 Payment Required)
 * 2. Micro-payment transaction (0.05 USDC)
 * 3. Awaits confirmation
 * 4. Fetches final prediction
 *
 * Developer experiences: 2-second await → AI prediction JSON
 */

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createTransferInstruction,
} from '@solana/spl-token';
import type {
  NeuralMarketConfig,
  KalshiSignalQuery,
  KalshiSignal,
  PaymentStatus,
} from '../types';

/**
 * OracleClient: Machine-to-Machine prediction oracle with invisible MPP payments
 *
 * @example
 * ```typescript
 * const oracle = new OracleClient(config);
 * const signal = await oracle.queryKalshiSignal({
 *   marketTicker: 'FED_RATES_MAR26',
 * });
 * // ^ 2-second await, automatic 0.05 USDC payment, full prediction
 * console.log(signal.reasoning);
 * ```
 */
export class OracleClient {
  private connection: Connection;
  private keypair?: Keypair;
  private signTransaction?: (transaction: any) => Promise<any>;
  private userPublicKey: PublicKey;
  private mcpGatewayUrl: string;
  private irysGatewayUrl: string;

  /** Treasury wallet (receives 0.05 USDC payments) */
  private readonly TREASURY_WALLET = new PublicKey(
    'A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F'
  );

  /** USDC Devnet mint */
  private readonly USDC_MINT = new PublicKey(
    'EPjFWdd5Au17y2edWjNx5mKnvUcghLgMLKXZKL7xS1d'
  );

  /** x402 Protocol payment amount (0.05 USDC in cents) */
  private readonly PAYMENT_AMOUNT_CENTS = 5;

  /**
   * Initialize OracleClient with Solana connection and config
   *
   * Supports both backend (keypair) and frontend (wallet adapter) modes
   *
   * @param config - SDK configuration
   */
  constructor(config: NeuralMarketConfig) {
    this.connection = new Connection(config.rpcUrl, config.commitment || 'confirmed');

    // Determine signing mode (same as VaultClient)
    if (config.keypair) {
      this.keypair = Keypair.fromSecretKey(config.keypair.secretKey);
      this.userPublicKey = this.keypair.publicKey;
    } else if (config.signTransaction && config.publicKey) {
      this.signTransaction = config.signTransaction;
      this.userPublicKey = new PublicKey(config.publicKey);
    } else {
      throw new Error(
        'OracleClient requires either (keypair) or (signTransaction + publicKey)'
      );
    }

    this.mcpGatewayUrl =
      config.mcpGatewayUrl || 'https://api.neuralmarket.io/v1';
    this.irysGatewayUrl = config.irysGatewayUrl || 'https://gateway.irys.xyz';
  }

  /**
   * Query Kalshi signal with automatic x402 micro-payment
   *
   * This is the core abstraction: developer calls once, SDK handles:
   * 1. Initial request to MCP Gateway
   * 2. Receives 402 Payment Required header
   * 3. Executes 0.05 USDC Solana transaction
   * 4. Awaits confirmation
   * 5. Re-queries with payment headers
   * 6. Returns final AI prediction
   *
   * @param query - Market query parameters
   * @returns AI prediction with reasoning and context
   *
   * @example
   * ```typescript
   * const signal = await oracle.queryKalshiSignal({
   *   marketTicker: 'FED_RATES_MAR26',
   *   maxPriceBps: 9500,
   * });
   *
   * console.log('Predicted side:', signal.side);
   * console.log('Confidence:', signal.confidence, '%');
   * console.log('Reasoning:', signal.reasoning);
   * console.log('Kalshi market YES bid:', signal.kalshiContext.marketSnapshot.yesBidBps / 100, '%');
   * ```
   */
  async queryKalshiSignal(query: KalshiSignalQuery): Promise<KalshiSignal> {
    try {
      // ========= STEP 1: INITIAL REQUEST (EXPECTS 402) =========
      this.log('Querying MCP Gateway...');

      const initialResponse = await fetch(
        `${this.mcpGatewayUrl}/api/predict`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            market_ticker: query.marketTicker,
            max_price_bps: query.maxPriceBps || 10000,
          }),
        }
      );

      // Check if payment is required
      if (initialResponse.status === 402) {
        this.log('Payment required. Executing x402 micro-transaction...');

        // ========= STEP 2: EXTRACT PAYMENT HEADERS =========
        const paymentRequired = initialResponse.headers.get('x-mpp-version');
        const paymentAmount = initialResponse.headers.get(
          'x-payment-required-amount'
        );

        if (!paymentRequired || !paymentAmount) {
          throw new Error('Invalid 402 response: missing payment headers');
        }

        // ========= STEP 3: EXECUTE MICRO-PAYMENT =========
        const paymentStatus = await this.executeMicroPayment(query.timeoutMs);

        if (!paymentStatus.success || !paymentStatus.txHash) {
          throw new Error(`Payment failed: ${paymentStatus.error}`);
        }

        this.log(`Payment confirmed: ${paymentStatus.txHash}`);

        // ========= STEP 4: RETRY REQUEST WITH PAYMENT PROOF =========
        this.log('Retrying request with payment proof...');

        const paidResponse = await fetch(
          `${this.mcpGatewayUrl}/api/predict`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-solana-payment-tx': paymentStatus.txHash,
              'x-solana-payment-signature': this.userPublicKey.toString(),
              'x-machine-public-key': this.userPublicKey.toString(),
            },
            body: JSON.stringify({
              market_ticker: query.marketTicker,
              max_price_bps: query.maxPriceBps || 10000,
            }),
          }
        );

        if (!paidResponse.ok) {
          throw new Error(
            `Request failed after payment: ${paidResponse.statusText}`
          );
        }

        // ========= STEP 5: PARSE AND RETURN PREDICTION =========
        const responseData = (await paidResponse.json()) as any;
        return this.parseKalshiSignal(responseData, query.marketTicker);
      } else if (initialResponse.ok) {
        // Payment already made (e.g., subscription)
        const responseData = (await initialResponse.json()) as any;
        return this.parseKalshiSignal(responseData, query.marketTicker);
      } else {
        throw new Error(
          `Request failed: ${initialResponse.status} ${initialResponse.statusText}`
        );
      }
    } catch (error) {
      throw this.formatError('QUERY_FAILED', error);
    }
  }

  /**
   * Execute atomic 0.05 USDC micro-payment to treasury
   *
   * @private
   * @param timeoutMs - Optional timeout
   * @returns Payment status with transaction hash
   */
  private async executeMicroPayment(
    timeoutMs?: number
  ): Promise<PaymentStatus> {
    try {
      // Get user's USDC token account
      const userTokenAccount = await getAssociatedTokenAddress(
        this.USDC_MINT,
        this.userPublicKey
      );

      // Get treasury's USDC token account
      const treasuryTokenAccount = await getAssociatedTokenAddress(
        this.USDC_MINT,
        this.TREASURY_WALLET
      );

      // Build transaction
      const transaction = new Transaction();

      // Add SPL token transfer instruction
      transaction.add(
        createTransferInstruction(
          userTokenAccount,
          treasuryTokenAccount,
          this.userPublicKey,
          this.PAYMENT_AMOUNT_CENTS, // 0.05 USDC in cents
          [],
          TOKEN_PROGRAM_ID
        )
      );

      // Sign and send with timeout
      const startTime = Date.now();
      const timeout = timeoutMs || 30000;

      const txHash = await Promise.race([
        this.sendAndConfirmTx(transaction),
        new Promise<string>((_, reject) =>
          setTimeout(
            () =>
              reject(new Error('Payment transaction timeout')),
            timeout
          )
        ),
      ]);

      const elapsedTime = Date.now() - startTime;
      this.log(`Payment executed in ${elapsedTime}ms`);

      return {
        success: true,
        txHash,
        amountPaidCents: this.PAYMENT_AMOUNT_CENTS,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Parse MCP Gateway response into KalshiSignal
   *
   * @private
   */
  private parseKalshiSignal(data: any, marketTicker: string): KalshiSignal {
    const prediction = data.prediction || {};

    return {
      marketTicker,
      side: prediction.predicted_outcome === 'YES' ? 'YES' : 'NO',
      amount: prediction.amount_usdc || 0,
      confidence: prediction.confidence || 0,
      riskScore: prediction.risk_score || 0,
      reasoning: prediction.reasoning || '',
      timestamp: Date.now(),
      predictionId: `pred_${Date.now()}`,
      kalshiContext: {
        marketSnapshot: {
          yesBidBps: prediction.kalshi_yes_bid_bps || 5000,
          noBidBps: prediction.kalshi_no_bid_bps || 5000,
          isLive: prediction.kalshi_is_live || false,
        },
        topTradersConsensus: {
          consensusSide: prediction.top_traders_side || 'YES',
          consensusBps: prediction.top_traders_bps || 5000,
        },
      },
    };
  }

  /**
   * Send and confirm transaction (supports both keypair and wallet adapter)
   *
   * @private
   */
  private async sendAndConfirmTx(transaction: Transaction): Promise<string> {
    if (this.keypair) {
      // Backend mode: manual signing
      transaction.sign(this.keypair);
      const serialized = transaction.serialize();
      const txHash = await this.connection.sendRawTransaction(serialized, {
        skipPreflight: false,
        maxRetries: 5,
      });
      await this.connection.confirmTransaction(txHash, 'confirmed');
      return txHash;
    } else if (this.signTransaction) {
      // Frontend mode: Use wallet adapter signing (non-custodial)
      try {
        const signedTx = await this.signTransaction(transaction);
        const serialized = signedTx.serialize();
        const txHash = await this.connection.sendRawTransaction(serialized, {
          skipPreflight: false,
          maxRetries: 5,
        });
        await this.connection.confirmTransaction(txHash, 'confirmed');
        return txHash;
      } catch (error) {
        throw new Error(
          `Transaction signing failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    } else {
      throw new Error('No signer available');
    }
  }

  /**
   * Format errors consistently
   *
   * @private
   */
  private formatError(code: string, error: unknown): Error {
    const message =
      error instanceof Error ? error.message : String(error);
    return new Error(`[OracleClient] ${code}: ${message}`);
  }

  /**
   * Logging utility
   *
   * @private
   */
  private log(message: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[OracleClient] ${message}`);
    }
  }
}

export default OracleClient;

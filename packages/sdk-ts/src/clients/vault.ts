/**
 * ============ VAULTCLIENT: ANCHOR ABSTRACTION ============
 *
 * Handles all NeuralVault operations without requiring
 * developers to understand Anchor PDAs or cryptography.
 *
 * Simple API:
 * - vault.initializeVault()
 * - vault.deposit(amountUsdc)
 * - vault.setRiskLimits({ maxPositionBps })
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createTransferInstruction,
} from '@solana/spl-token';
import type {
  NeuralMarketConfig,
  VaultInitParams,
  RiskLimits,
  DepositParams,
  VaultState,
  VaultInitResponse,
  DepositResponse,
  RiskUpdateResponse,
} from '../types';

/**
 * VaultClient: Institutional vault management without Anchor complexity
 *
 * @example
 * ```typescript
 * const vault = new VaultClient(config);
 * await vault.initializeVault({ maxPositionBps: 500 });
 * await vault.deposit({ amountUsdc: 10000 });
 * await vault.setRiskLimits({ maxPositionBps: 300 });
 * const state = await vault.getVaultState();
 * ```
 */
export class VaultClient {
  private connection: Connection;
  private keypair?: Keypair;
  private signTransaction?: (transaction: any) => Promise<any>;
  private programId: PublicKey;
  private userPublicKey: PublicKey;

  /** USDC Devnet mint */
  private readonly USDC_MINT = new PublicKey(
    'EPjFWdd5Au17y2edWjNx5mKnvUcghLgMLKXZKL7xS1d'
  );

  /**
   * Initialize VaultClient
   *
   * Supports two modes:
   * 1. Backend mode: Pass keypair for server-side signing
   * 2. Frontend mode: Pass signTransaction + publicKey for wallet adapter (non-custodial)
   *
   * @param config - SDK configuration
   */
  constructor(config: NeuralMarketConfig) {
    this.connection = new Connection(config.rpcUrl, config.commitment || 'confirmed');

    // Determine signing mode
    if (config.keypair) {
      // Backend mode: keypair-based signing
      this.keypair = Keypair.fromSecretKey(config.keypair.secretKey);
      this.userPublicKey = this.keypair.publicKey;
    } else if (config.signTransaction && config.publicKey) {
      // Frontend mode: wallet adapter signing (non-custodial)
      this.signTransaction = config.signTransaction;
      this.userPublicKey = new PublicKey(config.publicKey);
    } else {
      throw new Error(
        'VaultClient requires either (keypair) or (signTransaction + publicKey)'
      );
    }

    this.programId = new PublicKey(
      config.programId || 'A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F'
    );
  }

  /**
   * Initialize a new NeuralVault PDA
   *
   * Abstracts away:
   * - PDA derivation
   * - Associated token account creation
   * - Anchor instruction building
   * - Rent funding
   *
   * @param params - Vault initialization parameters
   * @returns Vault public key and transaction hash
   *
   * @example
   * ```typescript
   * const response = await vault.initializeVault({
   *   maxPositionBps: 500,  // 5% max position
   *   riskLevel: 60,
   * });
   * console.log('Vault created:', response.vaultPubkey);
   * ```
   */
  async initializeVault(params: VaultInitParams): Promise<VaultInitResponse> {
    try {
      this.log('Initializing vault with params:', params);

      // Step 1: Derive vault PDA (seed: "vault" + user pubkey + vault_id)
      const vaultId = BigInt(Date.now()); // Use timestamp as vault_id for uniqueness
      const [vaultPda, bump] = await PublicKey.findProgramAddress(
        [Buffer.from('vault'), this.userPublicKey.toBuffer(), Buffer.from(vaultId.toString())],
        this.programId
      );

      this.log(`Vault PDA: ${vaultPda.toString()}`);

      // Step 2: Derive vault token account (ATA)
      const vaultTokenAccount = await getAssociatedTokenAddress(
        this.USDC_MINT,
        vaultPda,
        true // allowOwnerOffCurve
      );

      // Step 3: Get user's USDC token account
      const userTokenAccount = await getAssociatedTokenAddress(
        this.USDC_MINT,
        this.userPublicKey
      );

      // Step 4: Build initialize_vault instruction
      const transaction = new Transaction();

      // Build the instruction data for initialize_vault
      // Args: vault_id (u64), max_position_size_bps (u16), risk_level (u8), usdc_mint (Pubkey)
      const instructionData = this.buildInitializeVaultIx(
        vaultId,
        params.maxPositionBps,
        params.riskLevel || 50,
        this.USDC_MINT
      );

      const initVaultIx = new TransactionInstruction({
        programId: this.programId,
        keys: [
          { pubkey: vaultPda, isSigner: false, isWritable: true },
          { pubkey: vaultTokenAccount, isSigner: false, isWritable: true },
          { pubkey: userTokenAccount, isSigner: false, isWritable: false },
          { pubkey: this.USDC_MINT, isSigner: false, isWritable: false },
          { pubkey: this.userPublicKey, isSigner: true, isWritable: true },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: this.getSysvarRent(), isSigner: false, isWritable: false },
        ],
        data: instructionData,
      });

      transaction.add(initVaultIx);

      // Step 5: Sign and send transaction
      this.log('Sending initialize_vault transaction...');
      const txHash = await this.sendAndConfirmTx(transaction);

      this.log(`Vault initialized: ${txHash}`);

      return {
        vaultPubkey: vaultPda.toString(),
        vaultTokenAccount: vaultTokenAccount.toString(),
        txHash,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw this.formatError('VAULT_INIT_FAILED', error);
    }
  }

  /**
   * Deposit USDC into vault
   *
   * Abstracts away:
   * - SPL token transfer
   * - Anchor instruction encoding
   * - Transaction signing
   *
   * @param params - Deposit parameters (amount in USDC)
   * @returns Deposit confirmation and new balance
   *
   * @example
   * ```typescript
   * const response = await vault.deposit({ amountUsdc: 5000 });
   * console.log('Deposited:', response.amountUsdc);
   * console.log('New balance:', response.newBalanceUsdc);
   * ```
   */
  async deposit(params: DepositParams): Promise<DepositResponse> {
    try {
      this.log(`Depositing ${params.amountUsdc} USDC into vault`);

      // Step 1: Derive vault PDA (need to know the vault_id, we'll use the first vault)
      // In production, this should be passed as a parameter
      const vaultId = BigInt(0); // Use vault_id 0 for first vault
      const [vaultPda] = await PublicKey.findProgramAddress(
        [Buffer.from('vault'), this.userPublicKey.toBuffer(), Buffer.from(vaultId.toString())],
        this.programId
      );

      // Step 2: Get user's USDC token account
      const userTokenAccount = await getAssociatedTokenAddress(
        this.USDC_MINT,
        this.userPublicKey
      );

      // Step 3: Get vault's token account
      const vaultTokenAccount = await getAssociatedTokenAddress(
        this.USDC_MINT,
        vaultPda,
        true
      );

      // Step 4: Convert USDC to cents (fixed-point math)
      const amountCents = BigInt(Math.round(params.amountUsdc * 100));

      // Step 5: Build transaction with deposit_usdc instruction
      const transaction = new Transaction();

      // Build instruction data for deposit_usdc
      // Args: amount (u64)
      const discriminator = Buffer.from([
        205, 226, 44, 209, 227, 209, 24, 213, // deposit_usdc discriminator
      ]);
      const argsBuffer = Buffer.alloc(8);
      argsBuffer.writeBigUInt64LE(amountCents, 0);
      const instructionData = Buffer.concat([discriminator, argsBuffer]);

      const depositIx = new TransactionInstruction({
        programId: this.programId,
        keys: [
          { pubkey: vaultPda, isSigner: false, isWritable: true },
          { pubkey: vaultTokenAccount, isSigner: false, isWritable: true },
          { pubkey: userTokenAccount, isSigner: false, isWritable: true },
          { pubkey: this.userPublicKey, isSigner: true, isWritable: false },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        data: instructionData,
      });

      transaction.add(depositIx);

      // Step 6: Sign and send
      this.log('Sending deposit_usdc transaction...');
      const txHash = await this.sendAndConfirmTx(transaction);

      this.log(`Deposit confirmed: ${txHash}`);

      // Step 7: Fetch new balance
      const newState = await this.getVaultState();

      return {
        txHash,
        amountUsdc: params.amountUsdc,
        newBalanceUsdc: newState.balanceCents / 100,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw this.formatError('DEPOSIT_FAILED', error);
    }
  }

  /**
   * Update vault risk parameters
   *
   * Allows programmatic adjustment of:
   * - Max position size (in basis points)
   * - Risk tolerance level
   *
   * Abstracts away:
   * - Anchor instruction building
   * - Fixed-point BPS math
   * - Transaction signing
   *
   * @param limits - New risk limits
   * @returns Confirmation and updated parameters
   *
   * @example
   * ```typescript
   * const response = await vault.setRiskLimits({
   *   maxPositionBps: 300,  // Reduce to 3%
   *   riskLevel: 40,
   * });
   * console.log('Updated risk limit to:', response.maxPositionBps / 100, '%');
   * ```
   */
  async setRiskLimits(limits: RiskLimits): Promise<RiskUpdateResponse> {
    try {
      this.log('Updating risk limits:', limits);

      // Step 1: Validate BPS (0-10000)
      if (limits.maxPositionBps < 0 || limits.maxPositionBps > 10000) {
        throw new Error('maxPositionBps must be between 0 and 10000');
      }

      // Step 2: Validate risk level (0-100)
      const riskLevel = limits.riskLevel || 50;
      if (riskLevel < 0 || riskLevel > 100) {
        throw new Error('riskLevel must be between 0 and 100');
      }

      // Step 3: Derive vault PDA
      const vaultId = BigInt(0); // Use vault_id 0 (first vault)
      const [vaultPda] = await PublicKey.findProgramAddress(
        [Buffer.from('vault'), this.userPublicKey.toBuffer(), Buffer.from(vaultId.toString())],
        this.programId
      );

      // Step 4: Build transaction with update_risk_params instruction
      const transaction = new Transaction();

      // Build instruction data for update_risk_params
      // Args: max_position_size_bps (u16), risk_level (u8)
      const discriminator = Buffer.from([
        78, 169, 142, 234, 48, 181, 181, 142, // update_risk_params discriminator
      ]);
      const argsBuffer = Buffer.alloc(3);
      argsBuffer.writeUInt16LE(limits.maxPositionBps, 0);
      argsBuffer.writeUInt8(riskLevel, 2);
      const instructionData = Buffer.concat([discriminator, argsBuffer]);

      const updateRiskIx = new TransactionInstruction({
        programId: this.programId,
        keys: [
          { pubkey: vaultPda, isSigner: false, isWritable: true },
          { pubkey: this.userPublicKey, isSigner: true, isWritable: true },
        ],
        data: instructionData,
      });

      transaction.add(updateRiskIx);

      // Step 5: Sign and send
      this.log('Sending update_risk_params transaction...');
      const txHash = await this.sendAndConfirmTx(transaction);

      this.log(`Risk limits updated: ${txHash}`);

      return {
        txHash,
        maxPositionBps: limits.maxPositionBps,
        riskLevel,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw this.formatError('RISK_UPDATE_FAILED', error);
    }
  }

  /**
   * Fetch current vault state from chain
   *
   * Returns:
   * - Balance
   * - Risk parameters
   * - Activity status
   * - Fee metrics
   *
   * @returns Current vault state
   *
   * @example
   * ```typescript
   * const state = await vault.getVaultState();
   * console.log('Balance:', state.balanceCents / 100, 'USDC');
   * console.log('Max position:', state.maxPositionBps / 100, '%');
   * ```
   */
  async getVaultState(): Promise<VaultState> {
    try {
      this.log('Fetching vault state from chain');

      // Derive vault PDA
      const vaultId = BigInt(0); // Use vault_id 0 (first vault)
      const [vaultPda] = await PublicKey.findProgramAddress(
        [Buffer.from('vault'), this.userPublicKey.toBuffer(), Buffer.from(vaultId.toString())],
        this.programId
      );

      // Fetch vault account from chain
      const accountInfo = await this.connection.getAccountInfo(vaultPda);

      if (!accountInfo) {
        throw new Error(`Vault not found at ${vaultPda.toString()}`);
      }

      // Parse account data
      // NeuralVault struct layout:
      // bump (u8) = 1 byte
      // owner (Pubkey) = 32 bytes
      // vault_id (u64) = 8 bytes
      // usdc_mint (Pubkey) = 32 bytes
      // token_account (Pubkey) = 32 bytes
      // balance (u64) = 8 bytes
      // total_delegated_volume (u64) = 8 bytes
      // max_position_size_bps (u16) = 2 bytes
      // risk_level (u8) = 1 byte
      // status (u8) = 1 byte
      // created_at (i64) = 8 bytes
      // last_execution (i64) = 8 bytes
      // protocol_fee_earned (u64) = 8 bytes

      const data = accountInfo.data;
      let offset = 8; // Skip discriminator (8 bytes)

      const bump = data[offset];
      offset += 1;

      // Skip owner (32 bytes)
      offset += 32;

      // Skip vault_id (8 bytes)
      offset += 8;

      // Skip usdc_mint (32 bytes)
      offset += 32;

      // Skip token_account (32 bytes)
      offset += 32;

      // balance (u64)
      const balanceCents = Number(this.readBigUInt64LE(data, offset));
      offset += 8;

      // Skip total_delegated_volume (8 bytes)
      offset += 8;

      // max_position_size_bps (u16)
      const maxPositionBps = data.readUInt16LE(offset);
      offset += 2;

      // risk_level (u8)
      const riskLevel = data[offset];
      offset += 1;

      // status (u8)
      const status = data[offset];
      const isActive = status === 1;
      offset += 1;

      // Skip created_at (8 bytes)
      offset += 8;

      // Skip last_execution (8 bytes)
      offset += 8;

      // protocol_fee_earned (u64)
      const totalFeesCents = Number(this.readBigUInt64LE(data, offset));

      this.log('Vault state fetched successfully');

      return {
        pubkey: vaultPda.toString(),
        balanceCents,
        maxPositionBps,
        riskLevel,
        isActive,
        totalFeesCents,
        lastUpdated: Date.now(),
      };
    } catch (error) {
      throw this.formatError('FETCH_STATE_FAILED', error);
    }
  }

  /**
   * Withdraw USDC from vault
   *
   * @param amountUsdc - Amount to withdraw
   * @returns Withdrawal confirmation
   */
  async withdraw(amountUsdc: number): Promise<DepositResponse> {
    try {
      this.log(`Withdrawing ${amountUsdc} USDC from vault`);

      // Step 1: Validate amount
      const vaultState = await this.getVaultState();
      if (amountUsdc > vaultState.balanceCents / 100) {
        throw new Error('Insufficient vault balance');
      }

      // Step 2: Derive PDAs
      const vaultId = BigInt(0); // Use vault_id 0 (first vault)
      const [vaultPda] = await PublicKey.findProgramAddress(
        [Buffer.from('vault'), this.userPublicKey.toBuffer(), Buffer.from(vaultId.toString())],
        this.programId
      );

      const vaultTokenAccount = await getAssociatedTokenAddress(
        this.USDC_MINT,
        vaultPda,
        true
      );

      const userTokenAccount = await getAssociatedTokenAddress(
        this.USDC_MINT,
        this.userPublicKey
      );

      // Step 3: Build transaction
      const amountCents = BigInt(Math.round(amountUsdc * 100));
      const transaction = new Transaction();

      // Build instruction data for withdraw_usdc
      // Args: amount (u64)
      const discriminator = Buffer.from([
        144, 156, 121, 240, 155, 115, 184, 189, // withdraw_usdc discriminator
      ]);
      const argsBuffer = Buffer.alloc(8);
      argsBuffer.writeBigUInt64LE(amountCents, 0);
      const instructionData = Buffer.concat([discriminator, argsBuffer]);

      const withdrawIx = new TransactionInstruction({
        programId: this.programId,
        keys: [
          { pubkey: vaultPda, isSigner: false, isWritable: true },
          { pubkey: vaultTokenAccount, isSigner: false, isWritable: true },
          { pubkey: userTokenAccount, isSigner: false, isWritable: true },
          { pubkey: this.userPublicKey, isSigner: true, isWritable: false },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        data: instructionData,
      });

      transaction.add(withdrawIx);

      // Step 4: Sign and send
      this.log('Sending withdraw_usdc transaction...');
      const txHash = await this.sendAndConfirmTx(transaction);

      this.log(`Withdrawal confirmed: ${txHash}`);

      // Step 5: Fetch updated balance
      const newState = await this.getVaultState();

      return {
        txHash,
        amountUsdc,
        newBalanceUsdc: newState.balanceCents / 100,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw this.formatError('WITHDRAW_FAILED', error);
    }
  }

  /**
   * Send and confirm transaction (supports both keypair and wallet adapter)
   *
   * @private
   */
  private async sendAndConfirmTx(transaction: Transaction): Promise<string> {
    if (this.keypair) {
      // Backend mode: Use keypair signing
      const txHash = await this.sendAndConfirmTx(transaction);
      return txHash;
    } else if (this.signTransaction) {
      // Frontend mode: Use wallet adapter signing (non-custodial)
      try {
        // Sign transaction with wallet adapter
        const signedTx = await this.signTransaction(transaction);

        // Serialize and send
        const serialized = signedTx.serialize();
        const txHash = await this.connection.sendRawTransaction(serialized, {
          skipPreflight: false,
          maxRetries: 5,
        });

        // Wait for confirmation
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
   * Read BigUInt64LE from buffer (for u64 fields)
   *
   * @private
   */
  private readBigUInt64LE(buffer: Buffer, offset: number): bigint {
    const lo = buffer.readUInt32LE(offset);
    const hi = buffer.readUInt32LE(offset + 4);
    return (BigInt(hi) << BigInt(32)) | BigInt(lo);
  }

  /**
   * Build instruction data for initialize_vault
   *
   * @private
   */
  private buildInitializeVaultIx(
    vaultId: bigint,
    maxPositionBps: number,
    riskLevel: number,
    usdcMint: PublicKey
  ): Buffer {
    // Discriminator for initialize_vault (first 8 bytes)
    // This matches the Anchor IDL discriminator
    const discriminator = Buffer.from([
      111, 17, 185, 250, 60, 122, 38, 254, // initialize_vault discriminator
    ]);

    // Build argument buffer
    const args = Buffer.alloc(40); // 8 (vault_id u64) + 2 (maxPositionBps u16) + 1 (riskLevel u8) + 32 (Pubkey)
    let offset = 0;

    // vault_id (u64 little-endian)
    args.writeBigUInt64LE(vaultId, offset);
    offset += 8;

    // max_position_size_bps (u16 little-endian)
    args.writeUInt16LE(maxPositionBps, offset);
    offset += 2;

    // risk_level (u8)
    args.writeUInt8(riskLevel, offset);
    offset += 1;

    // usdc_mint (Pubkey 32 bytes)
    usdcMint.toBuffer().copy(args, offset);

    // Combine discriminator + args
    return Buffer.concat([discriminator, args]);
  }

  /**
   * Get sysvar rent address
   *
   * @private
   */
  private getSysvarRent(): PublicKey {
    return new PublicKey('SysvarRent111111111111111111111111111111111');
  }

  /**
   * Format errors with context and consistency
   *
   * @private
   */
  private formatError(code: string, error: unknown): Error {
    const message =
      error instanceof Error ? error.message : String(error);
    return new Error(`[VaultClient] ${code}: ${message}`);
  }

  /**
   * Logging utility
   *
   * @private
   */
  private log(message: string, data?: unknown): void {
    if (process.env.NODE_ENV !== 'production') {
      if (data) {
        console.log(`[VaultClient] ${message}`, data);
      } else {
        console.log(`[VaultClient] ${message}`);
      }
    }
  }
}

export default VaultClient;

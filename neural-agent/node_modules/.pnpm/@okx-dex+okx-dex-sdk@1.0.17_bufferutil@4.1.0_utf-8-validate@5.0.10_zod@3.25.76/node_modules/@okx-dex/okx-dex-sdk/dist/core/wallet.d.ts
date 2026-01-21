import { Keypair, PublicKey, Transaction, VersionedTransaction, SendOptions, TransactionSignature, Connection } from '@solana/web3.js';
/**
 * Base interface for wallet implementations
 * Defines the standard interface for interacting with a wallet
 */
export interface Wallet {
    /**
     * The public key of the connected wallet
     */
    readonly publicKey: PublicKey;
    /**
     * The Solana connection instance
     */
    readonly connection: Connection;
    /**
     * Signs a single transaction
     */
    signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
    /**
     * Signs multiple transactions in batch
     */
    signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
    /**
     * Signs and sends a transaction to the network
     */
    signAndSendTransaction<T extends Transaction | VersionedTransaction>(transaction: T, options?: SendOptions): Promise<{
        signature: TransactionSignature;
    }>;
    /**
     * Signs a message
     */
    signMessage(message: Uint8Array): Promise<Uint8Array>;
}
/**
 * Implementation of Wallet interface using a Keypair
 * This class handles the actual signing operations while keeping the private key secure
 */
export declare class KeypairWallet implements Wallet {
    readonly publicKey: PublicKey;
    readonly connection: Connection;
    private readonly payer;
    constructor(keypair: Keypair, connection: Connection);
    signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
    signAndSendTransaction<T extends Transaction | VersionedTransaction>(transaction: T, options?: SendOptions): Promise<{
        signature: TransactionSignature;
    }>;
    signMessage(message: Uint8Array): Promise<Uint8Array>;
}
/**
 * Factory function to create a wallet instance
 * This provides a clean way to initialize a wallet without exposing implementation details
 */
export declare function createWallet(privateKey: string, connection: Connection): Wallet;

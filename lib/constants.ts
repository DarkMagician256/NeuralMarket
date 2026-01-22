/**
 * NeuralMarket Protocol Constants
 * 
 * Centralized configuration for all protocol-level values
 */

import { PublicKey } from '@solana/web3.js';

// ============ PROGRAM ============
export const PROGRAM_ID = new PublicKey(
    process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || 'A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F'
);

// ============ TREASURY ============
// Protocol fee receiver - MUST match the treasury used in smart contract calls
export const TREASURY_WALLET = new PublicKey(
    process.env.NEXT_PUBLIC_TREASURY_WALLET || '4yQBV4yJgxN8b1qLJ5V5X5gH9HbNjJBvLXK9HNKJ4KDj'
);

// ============ FEES ============
export const PROTOCOL_FEE_LAMPORTS = 50_000_000; // 0.05 SOL
export const PROTOCOL_FEE_SOL = 0.05;

// ============ RPC ============
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_HELIUS_RPC ||
    process.env.NEXT_PUBLIC_RPC_URL ||
    'https://api.devnet.solana.com';

// ============ NETWORK ============
export const SOLANA_CLUSTER = (process.env.NEXT_PUBLIC_SOLANA_CLUSTER || 'devnet') as 'devnet' | 'mainnet-beta' | 'testnet';

// ============ AGENT CONFIG ============
export const DEFAULT_AGENT_ID = 1001; // TITAN_ALPHA demo agent
export const AGENT_DISCRIMINATOR = [47, 166, 112, 147, 155, 197, 86, 7];

// ============ ARCHETYPES ============
export const ARCHETYPE_NAMES = ['SNIPER', 'ORACLE', 'HEDGER', 'WHALE', 'SENTINEL'] as const;
export type ArchetypeName = typeof ARCHETYPE_NAMES[number];

// ============ BUILDER CODE ============
export const KALSHI_BUILDER_CODE = process.env.KALSHI_BUILDER_CODE || 'ORACULO_V2';

// ============ VALIDATION ============
/**
 * Validate that a PublicKey matches the expected Treasury
 */
export function validateTreasury(pubkey: PublicKey): boolean {
    return pubkey.equals(TREASURY_WALLET);
}

/**
 * Get explorer URL for a transaction
 */
export function getExplorerUrl(signature: string): string {
    const cluster = SOLANA_CLUSTER === 'mainnet-beta' ? '' : `?cluster=${SOLANA_CLUSTER}`;
    return `https://explorer.solana.com/tx/${signature}${cluster}`;
}

/**
 * Get explorer URL for an address
 */
export function getAddressExplorerUrl(address: string): string {
    const cluster = SOLANA_CLUSTER === 'mainnet-beta' ? '' : `?cluster=${SOLANA_CLUSTER}`;
    return `https://explorer.solana.com/address/${address}${cluster}`;
}

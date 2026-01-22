'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { useCallback } from 'react';

const PROGRAM_ID = new PublicKey("A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F");

// IDL for agent actions
const IDL: any = {
    "address": "A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F",
    "metadata": { "name": "neural_vault", "version": "0.1.0", "spec": "0.1.0" },
    "instructions": [
        {
            "name": "deactivate_agent",
            "discriminator": [205, 171, 239, 225, 82, 126, 96, 166],
            "accounts": [
                { "name": "agent", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [97, 103, 101, 110, 116] }, { "kind": "account", "path": "user" }, { "kind": "arg", "path": "agent_id" }] } },
                { "name": "user", "signer": true }
            ],
            "args": [{ "name": "_agent_id", "type": "u64" }]
        },
        {
            "name": "reactivate_agent",
            "discriminator": [231, 7, 179, 97, 210, 24, 209, 12],
            "accounts": [
                { "name": "agent", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [97, 103, 101, 110, 116] }, { "kind": "account", "path": "user" }, { "kind": "arg", "path": "agent_id" }] } },
                { "name": "user", "signer": true }
            ],
            "args": [{ "name": "_agent_id", "type": "u64" }]
        },
        {
            "name": "record_trade_standalone",
            "discriminator": [185, 82, 112, 160, 25, 99, 114, 189],
            "accounts": [
                { "name": "agent", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [97, 103, 101, 110, 116] }, { "kind": "account", "path": "user" }, { "kind": "arg", "path": "agent_id" }] } },
                { "name": "user", "signer": true }
            ],
            "args": [
                { "name": "_agent_id", "type": "u64" },
                { "name": "volume", "type": "u64" },
                { "name": "is_profitable", "type": "bool" },
                { "name": "pnl", "type": "i64" }
            ]
        }
    ]
};

export interface TradeResult {
    success: boolean;
    txHash?: string;
    error?: string;
}

export function useAgentActions() {
    const { connection } = useConnection();
    const wallet = useWallet();

    /**
     * Record a trade/prediction for an agent on-chain (standalone version)
     */
    const recordTrade = useCallback(async (
        agentId: string,
        volume: number, // in SOL
        isProfitable: boolean,
        pnl: number, // in SOL (positive or negative)
    ): Promise<TradeResult> => {
        if (!wallet.connected || !wallet.publicKey) {
            return { success: false, error: "Wallet not connected" };
        }

        try {
            const provider = new AnchorProvider(connection, wallet as any, { commitment: 'confirmed' });
            const program = new Program(IDL, provider);

            const agentIdBN = new BN(agentId);

            // Generate PDA
            const [agentPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("agent"), wallet.publicKey.toBuffer(), agentIdBN.toArrayLike(Buffer, 'le', 8)],
                PROGRAM_ID
            );

            // Convert values to lamports
            const volumeLamports = new BN(Math.floor(volume * 1_000_000_000));
            const pnlLamports = new BN(Math.floor(pnl * 1_000_000_000));

            const tx = await program.methods
                .recordTradeStandalone(
                    agentIdBN,
                    volumeLamports,
                    isProfitable,
                    pnlLamports
                )
                .accounts({
                    agent: agentPda,
                    user: wallet.publicKey,
                } as any)
                .rpc();

            // Don't wait for confirmation - return immediately with the hash
            return { success: true, txHash: tx };
        } catch (error: any) {
            console.error("Failed to record trade:", error);
            return { success: false, error: error.message || "Unknown error" };
        }
    }, [connection, wallet]);

    /**
     * Deactivate an agent
     */
    const deactivateAgent = useCallback(async (agentId: string): Promise<TradeResult> => {
        if (!wallet.connected || !wallet.publicKey) {
            return { success: false, error: "Wallet not connected" };
        }

        try {
            const provider = new AnchorProvider(connection, wallet as any, { commitment: 'confirmed' });
            const program = new Program(IDL, provider);

            const agentIdBN = new BN(agentId);

            const [agentPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("agent"), wallet.publicKey.toBuffer(), agentIdBN.toArrayLike(Buffer, 'le', 8)],
                PROGRAM_ID
            );

            const tx = await program.methods
                .deactivateAgent(agentIdBN)
                .accounts({
                    agent: agentPda,
                    user: wallet.publicKey,
                } as any)
                .rpc();

            return { success: true, txHash: tx };
        } catch (error: any) {
            console.error("Failed to deactivate agent:", error);
            return { success: false, error: error.message || "Unknown error" };
        }
    }, [connection, wallet]);

    /**
     * Reactivate an agent
     */
    const reactivateAgent = useCallback(async (agentId: string): Promise<TradeResult> => {
        if (!wallet.connected || !wallet.publicKey) {
            return { success: false, error: "Wallet not connected" };
        }

        try {
            const provider = new AnchorProvider(connection, wallet as any, { commitment: 'confirmed' });
            const program = new Program(IDL, provider);

            const agentIdBN = new BN(agentId);

            const [agentPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("agent"), wallet.publicKey.toBuffer(), agentIdBN.toArrayLike(Buffer, 'le', 8)],
                PROGRAM_ID
            );

            const tx = await program.methods
                .reactivateAgent(agentIdBN)
                .accounts({
                    agent: agentPda,
                    user: wallet.publicKey,
                } as any)
                .rpc();

            return { success: true, txHash: tx };
        } catch (error: any) {
            console.error("Failed to reactivate agent:", error);
            return { success: false, error: error.message || "Unknown error" };
        }
    }, [connection, wallet]);

    /**
     * Deposit capital (Stake) into an agent's account
     */
    const depositCapital = useCallback(async (agentId: string, amount: number): Promise<TradeResult> => {
        if (!wallet.connected || !wallet.publicKey) {
            return { success: false, error: "Wallet not connected" };
        }

        try {
            const agentIdBN = new BN(agentId);

            // Generate Agent PDA (Destination)
            const [agentPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("agent"), wallet.publicKey.toBuffer(), agentIdBN.toArrayLike(Buffer, 'le', 8)],
                PROGRAM_ID
            );

            // Create Transfer Transaction
            // Import dynamically to ensure it works on client side
            const { SystemProgram, Transaction } = await import('@solana/web3.js');

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: agentPda,
                    lamports: BigInt(Math.floor(amount * 1_000_000_000)),
                })
            );

            const latestBlockhash = await connection.getLatestBlockhash();
            transaction.recentBlockhash = latestBlockhash.blockhash;
            transaction.feePayer = wallet.publicKey;

            // Sign and Send
            const signature = await wallet.sendTransaction(transaction, connection);

            // Wait for confirmation for better UX on staking
            await connection.confirmTransaction({
                signature,
                ...latestBlockhash
            }, 'confirmed');

            return { success: true, txHash: signature };

        } catch (error: any) {
            console.error("Failed to deposit capital:", error);
            return { success: false, error: error.message || "Unknown error" };
        }
    }, [connection, wallet]);

    return {
        recordTrade,
        deactivateAgent,
        reactivateAgent,
        depositCapital,
        isConnected: wallet.connected
    };
}

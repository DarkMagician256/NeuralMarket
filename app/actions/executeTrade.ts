"use server";

import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Program, Idl, AnchorProvider, BN } from "@coral-xyz/anchor";
import idl from '../../lib/idl/neural_vault.json';

const PROGRAM_ID = new PublicKey("A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F");
const DEFAULT_AGENT_ID = new BN(1001); // TITAN_ALPHA - our demo agent

// Use development logging only
const isDev = process.env.NODE_ENV === 'development';
const log = isDev ? console.log : () => { };
const logWarn = isDev ? console.warn : () => { };

export async function buildTradeTransaction(
    userPublicKey: string,
    ticker: string,
    outcome: string,
    amount: number,
    agentId?: number // Optional: Associate trade with specific agent
) {
    try {
        const connection = new Connection(
            process.env.NEXT_PUBLIC_HELIUS_RPC ||
            process.env.NEXT_PUBLIC_RPC_URL ||
            'https://api.devnet.solana.com'
        );
        const builderCode = process.env.KALSHI_BUILDER_CODE || 'ORACULO_V2';

        log(`[NeuralVault] Building trade for user: "${userPublicKey}", Agent: ${agentId || 'Default'}`);

        if (!userPublicKey || userPublicKey.trim() === '') {
            throw new Error("User public key is missing or empty");
        }

        // Validate PubKey format
        let userPubkeyObj: PublicKey;
        try {
            userPubkeyObj = new PublicKey(userPublicKey);
        } catch (e) {
            throw new Error(`Invalid User PublicKey format: "${userPublicKey}"`);
        }

        const transaction = new Transaction();

        // --- 1. MEMO INSTRUCTION (Indexer & Explorer Visibility) ---
        const memoData = JSON.stringify({
            app: "NeuralMarket",
            builderCode,
            ticker,
            outcome,
            amount,
            agentId: agentId || DEFAULT_AGENT_ID.toNumber(),
            timestamp: Date.now()
        });

        const memoProgramId = new PublicKey("Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo");
        const memoIx = new TransactionInstruction({
            keys: [{ pubkey: userPubkeyObj, isSigner: true, isWritable: true }],
            programId: memoProgramId,
            data: Buffer.from(memoData),
        });
        transaction.add(memoIx);

        // --- 2. NEURAL VAULT: Record Trade On-Chain (Standalone Mode) ---
        // Using recordTradeStandalone which doesn't require UserStats
        try {
            const provider = new AnchorProvider(connection, { publicKey: userPubkeyObj } as any, {});
            const program = new Program(idl as Idl, provider);

            const agentIdBN = agentId ? new BN(agentId) : DEFAULT_AGENT_ID;

            // Derive Agent PDA
            const [agentPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("agent"),
                    userPubkeyObj.toBuffer(),
                    agentIdBN.toArrayLike(Buffer, 'le', 8)
                ],
                PROGRAM_ID
            );

            // Check if Agent exists
            const agentInfo = await connection.getAccountInfo(agentPda);

            if (agentInfo) {
                log("[NeuralVault] Agent found! Using recordTradeStandalone.");

                const amountLamports = new BN(Math.floor(amount * 1_000_000_000));
                const isProfitable = outcome === 'YES';
                const pnl = new BN(0); // Will be calculated after resolution

                const recordTradeIx = await program.methods
                    .recordTradeStandalone(
                        agentIdBN,
                        amountLamports,
                        isProfitable,
                        pnl
                    )
                    .accounts({
                        agent: agentPda,
                        user: userPubkeyObj
                    } as any)
                    .instruction();
                transaction.add(recordTradeIx);

                log("[NeuralVault] recordTradeStandalone instruction added.");
            } else {
                log("[NeuralVault] Agent not found. Trade recorded via Memo only.");
            }

        } catch (anchorError: any) {
            console.error("[NeuralVault] Anchor integration warning:", anchorError.message);
            log("[NeuralVault] Proceeding with Memo-only transaction.");
        }

        // --- 3. FINALIZE ---
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = userPubkeyObj;

        log(`[NeuralVault] Transaction built with ${transaction.instructions.length} instructions.`);

        return transaction.serialize({ verifySignatures: false }).toString('base64');

    } catch (error: any) {
        console.error("[NeuralVault] Error building transaction:", error);
        throw new Error(`Failed to build transaction: ${error.message}`);
    }
}

// Helper to create a deterministic prediction hash
function createPredictionHash(ticker: string, outcome: string): number[] {
    const hash = Array(32).fill(0);
    const data = Buffer.from(`${ticker}|${outcome}|${Date.now()}`);
    for (let i = 0; i < Math.min(data.length, 32); i++) {
        hash[i] = data[i];
    }
    return hash;
}

// Record trade to Supabase for off-chain persistence
export async function recordTrade(tradeData: {
    user: string;
    ticker: string;
    outcome: string;
    amount: number;
    signature: string;
    agentId?: number;
}) {
    const { createClient } = await import('@supabase/supabase-js');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Prefer service key for server-side operations
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        logWarn("[Supabase] Not configured. Trade not persisted to DB.");
        return { success: false, error: "Supabase not configured" };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from('trades').insert({
        wallet_address: tradeData.user,
        ticker: tradeData.ticker,
        outcome: tradeData.outcome,
        amount: tradeData.amount,
        signature: tradeData.signature
    });

    if (error) {
        console.error("[Supabase] Failed to save trade:", error);
        return { success: false, error: error.message };
    }

    log("[Supabase] Trade saved:", tradeData.signature);
    return { success: true };
}

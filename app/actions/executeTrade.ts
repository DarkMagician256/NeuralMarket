"use server";

import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";

export async function buildTradeTransaction(userPublicKey: string, ticker: string, outcome: string, amount: number) {
    try {
        const connection = new Connection(process.env.RPC_URL || 'https://api.mainnet-beta.solana.com');
        const builderCode = process.env.KALSHI_BUILDER_CODE || 'ORACULO_V2';

        // In a real DFlow integration, we'd use their SDK to get the swap instruction
        // const dflowInstruction = await dflow.getTradeInstruction({ ... });

        // For the hackathon, we build a Memo instruction that includes the trade details and the Builder Code
        // This allows the Kalshi/DFlow backend to track the attribution.
        const memoData = JSON.stringify({
            app: "NeuralMarket",
            builderCode,
            ticker,
            outcome,
            amount
        });

        const memoProgramId = new PublicKey("MemoSq4gqABmAn9BnTCCqksSzoCy6n8WvCcK6A9f69");
        const instruction = new TransactionInstruction({
            keys: [{ pubkey: new PublicKey(userPublicKey), isSigner: true, isWritable: true }],
            programId: memoProgramId,
            data: Buffer.from(memoData),
        });

        const transaction = new Transaction().add(instruction);
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = new PublicKey(userPublicKey);

        // Serialize and return to client
        return transaction.serialize({ verifySignatures: false }).toString('base64');
    } catch (error) {
        console.error("Error building trade transaction:", error);
        throw new Error("Failed to build transaction");
    }
}

export async function recordTrade(tradeData: any) {
    // Save to trades table in Supabase for portfolio tracking
    // const { error } = await supabase.from('trades').insert(tradeData);
    console.log("Recorded trade on server:", tradeData);
}

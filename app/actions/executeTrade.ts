"use server";

import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";

export async function buildTradeTransaction(userPublicKey: string, ticker: string, outcome: string, amount: number) {
    try {
        // Use Devnet for this stage of the hackathon unless specified otherwise
        const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com');
        const builderCode = process.env.KALSHI_BUILDER_CODE || 'ORACULO_V2';

        console.log(`Building trade tx for user: "${userPublicKey}", Ticker: ${ticker}`);

        if (!userPublicKey || userPublicKey.trim() === '') {
            throw new Error("User public key is missing or empty");
        }

        // Validate PubKey format early
        try {
            new PublicKey(userPublicKey);
        } catch (e) {
            throw new Error(`Invalid User PublicKey format received: "${userPublicKey}"`);
        }

        // In a real DFlow integration, we'd use their SDK to get the swap instruction
        // const dflowInstruction = await dflow.getTradeInstruction({ ... });

        // For the hackathon, we build a Memo instruction that includes the trade details and the Builder Code
        // This allows the Kalshi/DFlow backend to track the attribution.
        const memoData = JSON.stringify({
            app: "NeuralMarket",
            builderCode,
            ticker,
            outcome,
            amount,
            timestamp: Date.now()
        });

        // Official Memo Program v2 ID
        const memoProgramId = new PublicKey("MemoSq4gqABAxKfaeyJnKsBwJjyGqsaqA8A1k6wA");

        const instruction = new TransactionInstruction({
            keys: [{ pubkey: new PublicKey(userPublicKey), isSigner: true, isWritable: true }],
            programId: memoProgramId,
            data: Buffer.from(memoData),
        });

        const transaction = new Transaction().add(instruction);
        const { blockhash } = await connection.getLatestBlockhash('finalized');
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = new PublicKey(userPublicKey);

        // Serialize and return to client
        return transaction.serialize({ verifySignatures: false }).toString('base64');
    } catch (error: any) {
        console.error("Error building trade transaction:", error);
        throw new Error(`Failed to build transaction: ${error.message || error}`);
    }
}

export async function recordTrade(tradeData: any) {
    // Save to trades table in Supabase for portfolio tracking
    // const { error } = await supabase.from('trades').insert(tradeData);
    console.log("Recorded trade on server:", tradeData);
}

'use server'

import { Connection, Keypair, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';

// This runs on the server. Safe to access env vars.
const DFLOW_API_KEY = process.env.DFLOW_API_KEY!;
const DFLOW_API_SECRET = process.env.DFLOW_API_SECRET;

export async function proxyTradeRequest(signedTx: string) {
    // 1. Verify user signature (optional but recommended)
    // 2. Attach API Key header
    // 3. Forward to DFlow

    if (!DFLOW_API_KEY) {
        console.warn("DFLOW_API_KEY not set. Using mock mode.");
    }

    // Mock response
    console.log("Proxying trade to DFlow with signature:", signedTx.slice(0, 10) + "...");

    return {
        success: true,
        txId: "5Hue...MockTxID",
        message: "Order placed on DFlow Institutional Liquidity"
    };
}

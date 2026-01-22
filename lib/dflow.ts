import { Connection, Keypair, Transaction, PublicKey } from '@solana/web3.js';

// DFlow API Base URL (Based on public docs jan 2026)
const DFLOW_API_BASE = "https://api.dflow.net/v1";

export interface DFlowQuote {
    inputMint: string;
    outputMint: string;
    amount: string;
    outAmount: string;
    priceImpact: number;
    fee: number;
}

export class DFlowClient {
    private apiKey: string | undefined;

    constructor() {
        this.apiKey = process.env.DFLOW_API_KEY;
    }

    /**
     * Get a swap quote from DFlow liquidity layer
     * This connects to real liquidity for prediction tokens
     */
    async getQuote(
        inputMint: string,
        outputMint: string,
        amount: number
    ): Promise<DFlowQuote | null> {
        if (!this.apiKey) {
            console.log("[DFlow] No API Key provided. Skipping real quote.");
            return null;
        }

        try {
            const url = `${DFLOW_API_BASE}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (!response.ok) {
                console.warn(`[DFlow] API Error: ${response.status}`);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error("[DFlow] Quote fetch failed:", error);
            return null;
        }
    }

    /**
     * Execute a trade via DFlow (Construct transaction)
     */
    async createSwapTransaction(quote: DFlowQuote, userPublicKey: string): Promise<string | null> {
        if (!this.apiKey) return null;

        try {
            const response = await fetch(`${DFLOW_API_BASE}/swap`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quote,
                    userPublicKey
                })
            });

            if (!response.ok) return null;

            const { transaction } = await response.json();
            return transaction; // Returns base64 transaction
        } catch (error) {
            console.error("[DFlow] Swap creation failed:", error);
            return null;
        }
    }
}

export const dflowClient = new DFlowClient();

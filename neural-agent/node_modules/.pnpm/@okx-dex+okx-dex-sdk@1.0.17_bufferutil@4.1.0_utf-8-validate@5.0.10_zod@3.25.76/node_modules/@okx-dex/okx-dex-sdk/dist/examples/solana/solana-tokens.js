"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// example.ts or test.ts
const index_1 = require("../../index");
const web3_js_1 = require("@solana/web3.js");
const wallet_1 = require("../../core/wallet");
require("dotenv/config");
const connection = new web3_js_1.Connection(process.env.SOLANA_RPC_URL);
const wallet = (0, wallet_1.createWallet)(process.env.SOLANA_PRIVATE_KEY, connection);
const client = new index_1.OKXDexClient({
    apiKey: process.env.OKX_API_KEY,
    secretKey: process.env.OKX_SECRET_KEY,
    apiPassphrase: process.env.OKX_API_PASSPHRASE,
    projectId: process.env.OKX_PROJECT_ID,
    solana: {
        wallet: wallet
    }
});
async function main() {
    try {
        // Get tokens
        const tokens = await client.dex.getTokens("501");
        console.log('Supported tokens:', JSON.stringify(tokens, null, 2));
    }
    catch (error) {
        console.error('Error:', error);
    }
}
main();

import { Action, IAgentRuntime, Memory, State, HandlerCallback, elizaLogger } from '@elizaos/core';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import bs58 from 'bs58';
import { config } from '../config/env.js';
import { TelemetryService, ThoughtType } from '../services/telemetry.js';
import { KalshiService } from '../services/kalshiService.js';
import idl from '../idl/neural_vault.json';

/**
 * ORACULO Custom Action: Execute Trade on Kalshi via DFlow
 * Includes automatic injection of Builder Code for monetization.
 */
export const executeKalshiTrade: Action = {
    name: "EXECUTE_KALSHI_TRADE",
    similes: ["BUY_PREDICTION", "BET_ON_MARKET", "TRADE_KALSHI", "PLACE_ORDER"],
    description: "Executes a trade on a Kalshi prediction market using Solana funds via DFlow routing. Attributions are handled via KALSHI_BUILDER_CODE.",

    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return !!config.SOLANA_PRIVATE_KEY && !!config.RPC_URL;
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State,
        options: any = {},
        callback?: HandlerCallback
    ) => {
        try {
            // 0. BUSINESS LOGIC & MONETIZATION VALIDATION (STRICT)
            const builderCode = config.KALSHI_BUILDER_CODE;
            if (!builderCode || builderCode === "ORACULO_TEST") {
                elizaLogger.error("[MONETIZATION] ❌ CRITICAL: Proper KALSHI_BUILDER_CODE is missing. Trading blocked to prevent fee loss.");
                throw new Error("KALSHI_BUILDER_CODE must be set to a valid project ID for monetization eligibility.");
            }

            elizaLogger.info(`[MONETIZATION] 💰 Executing trade with Builder Code: ${builderCode}`);

            // 1. EXTRACT INTENT
            const tradeContent = message.content as any;
            const ticker = tradeContent.ticker || "UNKNOWN-MKT";
            const side = tradeContent.side || "YES";
            const amount = tradeContent.amount || 10;

            const telemetry = TelemetryService.getInstance();
            await telemetry.broadcastThought(`Initiating ${side} on ${ticker} for $${amount}`, ThoughtType.EXECUTION);

            // Connect to Solana
            const connection = new Connection(config.RPC_URL);
            const walletKeyPair = Keypair.fromSecretKey(bs58.decode(config.SOLANA_PRIVATE_KEY));
            const wallet = new anchor.Wallet(walletKeyPair);

            // Setup Anchor Provider
            const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" });
            const programId = new PublicKey("A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F");
            // Standard Anchor: new Program(idl, provider) reads address from IDL. 
            // If explicit override needed: new Program(idl, programId, provider) -- but TS complained about arg 2.
            // Let's rely on IDL address.
            const program = new Program(idl as any, provider);

            elizaLogger.info(`[ORACULO] Initiating Trade: ${side} on ${ticker} for $${amount}`);

            // 2. FETCH MARKET DATA & EXECUTE REAL ORDER
            elizaLogger.info(`[ORACULO] 🟢 Connecting to Real Kalshi API for execution...`);

            try {
                const kalshiService = KalshiService.getInstance();

                // EXECUTE REAL ORDER
                const contractCount = Math.floor(amount);
                const orderResult = await kalshiService.createOrder(
                    ticker,
                    "buy", // Always buy for opening position
                    contractCount,
                    side.toLowerCase() as "yes" | "no",
                    builderCode
                );

                elizaLogger.success(`[KALSHI] ✅ Order Placed Successfully! Order ID: ${orderResult.order.order_id}`);

                // 3. LOG ON-CHAIN (REAL ANCHOR TRANSACTION)
                elizaLogger.info(`[ANCHOR] ⚓ Recording trade on Solana (NeuralVault)...`);

                // Derive Agent PDA
                const agentId = new anchor.BN(process.env.AGENT_ID || 1);
                const [agentPda] = PublicKey.findProgramAddressSync(
                    [Buffer.from("agent"), wallet.publicKey.toBuffer(), agentId.toArrayLike(Buffer, "le", 8)],
                    programId
                );

                // Params for on-chain record
                const volume = new anchor.BN(contractCount * 1_000_000); // 1 Unit = 1000000 microlamports equivalent? or just volume units.
                const isProfitable = false; // Unknown at this moment
                const pnl = new anchor.BN(0);

                // Execute Transaction
                const txSignature = await program.methods
                    .recordTradeStandalone(
                        agentId,
                        volume,
                        isProfitable,
                        pnl
                    )
                    .accounts({
                        agent: agentPda,
                        user: wallet.publicKey,
                        // systemProgram is auto-inferred
                    })
                    .rpc();

                elizaLogger.success(`[ANCHOR] ⛓️ Trade Recorded on Solana! TX: ${txSignature}`);

                await telemetry.logPrediction(ticker, side, 0.95, `https://kalshi.com/markets/${ticker}`);
                await telemetry.broadcastThought(`REAL Trade executed on Kalshi: ${ticker} ${side} (TX: ${txSignature})`, ThoughtType.EXECUTION);

                callback?.({
                    text: `✅ **REAL TRADE EXECUTED** on Kalshi & Solana!\n\nMarket: *${ticker}*\nSide: *${side}*\nContracts: *${contractCount}*\nStatus: *${orderResult.order.status}*\nOrder ID: \`${orderResult.order.order_id}\`\nOn-Chain TX: \`${txSignature}\`\n\n🛡️ Builder Code: \`${builderCode}\``,
                    content: {
                        success: true,
                        orderId: orderResult.order.order_id,
                        status: orderResult.order.status,
                        builderCode: builderCode,
                        signature: txSignature
                    }
                });

                return true;

            } catch (apiError: any) {
                elizaLogger.error("[KALSHI/ANCHOR] ❌ Execution Failed:", apiError);
                // Try to provide detail
                const errorMsg = apiError.logs ? apiError.logs.join('\n') : (apiError.response?.data || apiError.message);
                throw new Error(`Execution Error: ${JSON.stringify(errorMsg)}`);
            }


        } catch (error) {
            elizaLogger.error("[ORACULO] Trade Execution Failed:", error as any);
            callback?.({
                text: `❌ Trade Execution Aborted: ${error instanceof Error ? error.message : "System Failure"}`,
                content: { success: false, error: error instanceof Error ? error.message : "UNKNOWN" }
            });
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Place a 100 USDC bet on YES for BTC-ABOVE-100K." }
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Executing YES trade on BTC-ABOVE-100K for 100 USDC with Builder attribution.",
                    action: "EXECUTE_KALSHI_TRADE"
                }
            }
        ]
    ]
};

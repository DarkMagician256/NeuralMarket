import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NeuralVault } from "../anchor/target/types/neural_vault.ts";
import { expect } from "chai";

// Mock IDL import (in real scenario this is generated)
import IDL from "../anchor/target/idl/neural_vault.json";

describe("Neural Vault Bankrun Tests", () => {
    let provider;
    let program: Program<NeuralVault>;
    let payer: any; // Bankrun payer type is cleaner with Any or stricter setup

    before(async () => {
        // 1. Setup Bankrun (Ultra-fast simulation)
        const context = await startAnchor("anchor", [], []);
        provider = new BankrunProvider(context);
        anchor.setProvider(provider);

        payer = provider.wallet.payer;
        program = new Program<NeuralVault>(IDL, provider);
    });

    it("Initializes User Stats", async () => {
        const [userStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("user-stats"), payer.publicKey.toBuffer()],
            program.programId
        );

        await program.methods.initializeUser()
            .accounts({
                user: payer.publicKey,
            })
            .rpc();

        const account = await (program.account as any).userStats.fetch(userStatsPDA);
        expect(account.totalVolume.toNumber()).to.equal(0);
    });

    it("Records a Prediction", async () => {
        const [userStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("user-stats"), payer.publicKey.toBuffer()],
            program.programId
        );

        const volume = new anchor.BN(100);
        const hash = Array(32).fill(0); // Dummy hash

        await program.methods.recordPrediction(volume, hash)
            .accounts({
                user: payer.publicKey,
            })
            .rpc();

        const account = await (program.account as any).userStats.fetch(userStatsPDA);
        expect(account.totalVolume.toNumber()).to.equal(100);
        expect(account.predictionsCount.toNumber()).to.equal(1);
    });
    it("Submits a Trade Intent (DFlow)", async () => {
        const agentId = new anchor.BN(999);
        const [agentPDA] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from("agent"), payer.publicKey.toBuffer(), agentId.toArrayLike(Buffer, 'le', 8)],
            program.programId
        );

        // 1. Create Agent first (Standalone to avoid UserStats dependency in this specific test isolation)
        const nameBuffer = Buffer.alloc(32);
        Buffer.from("TestAgent").copy(nameBuffer);
        const nameArray = Array.from(nameBuffer);

        await program.methods.createAgentStandalone(
            agentId,
            0, // Archetype: Sniper
            5, // Risk
            new anchor.BN(1000000), // Capital
            1, // Leverage
            nameArray, // Name
        ).accounts({
            user: payer.publicKey
        }).rpc();

        // 2. Submit Intent
        const tickerBuffer = Buffer.alloc(32);
        Buffer.from("FED_RATES_MAR24").copy(tickerBuffer);
        const tickerArray = Array.from(tickerBuffer);

        const amount = new anchor.BN(500_000_000); // 500 USDC
        const limitPrice = new anchor.BN(95); // 0.95

        const tx = await program.methods.submitTradeIntent(
            agentId,
            tickerArray,
            1, // YES
            amount,
            limitPrice
        ).accounts({
            user: payer.publicKey,
        }).rpc();

        console.log("Trade Intent TX Signature:", tx);
    });
});

/**
 * Create Demo Agents On-Chain for NeuralMarket Leaderboard
 * Run with: npx ts-node scripts/create_demo_agents.ts
 */

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import fs from "fs";
import path from "path";

// Connection to Devnet
const connection = new anchor.web3.Connection("https://api.devnet.solana.com", "confirmed");

// Load deployer wallet
const keypairPath = "/home/vaiosvaios/.config/solana/devnet-deployer.json";
const secretKey = JSON.parse(fs.readFileSync(keypairPath, "utf-8"));
const wallet = new anchor.Wallet(anchor.web3.Keypair.fromSecretKey(new Uint8Array(secretKey)));

// Setup Provider and Program
const provider = new anchor.AnchorProvider(connection, wallet, {});
anchor.setProvider(provider);

// Load IDL
const idlPath = path.resolve(__dirname, "../anchor/target/idl/neural_vault.json");
const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));

const programId = new anchor.web3.PublicKey("A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F");
const program = new Program(idl, provider);

// Demo agents to create (Batch 2)
const DEMO_AGENTS = [
    { id: 3001, name: "TITAN_ALPHA_V3", archetype: 0, risk: 7, capital: 5000000000, leverage: 3 },
    { id: 3002, name: "NEURAL_PROPHET_V3", archetype: 1, risk: 4, capital: 10000000000, leverage: 1 },
    { id: 3003, name: "HEDGE_MASTER_V3", archetype: 2, risk: 2, capital: 25000000000, leverage: 1 },
    { id: 3004, name: "WHALE_HUNTER_V3", archetype: 3, risk: 9, capital: 100000000000, leverage: 5 },
    { id: 3005, name: "SNIPER_ELITE_V3", archetype: 0, risk: 8, capital: 3000000000, leverage: 4 },
];

function padName(name: string): number[] {
    const buffer = Buffer.alloc(32);
    Buffer.from(name).copy(buffer);
    return Array.from(buffer);
}

async function main() {
    console.log("🚀 Creating Demo Agents on Devnet (With 0.05 SOL Protocol Fee)...");
    console.log(`📡 Program: ${programId.toBase58()}`);
    console.log(`👤 Owner: ${wallet.publicKey.toBase58()}`);
    console.log("");

    for (const agent of DEMO_AGENTS) {
        try {
            // Derive Agent PDA
            const agentIdBN = new anchor.BN(agent.id);
            const [agentPDA] = anchor.web3.PublicKey.findProgramAddressSync(
                [
                    Buffer.from("agent"),
                    wallet.publicKey.toBuffer(),
                    agentIdBN.toArrayLike(Buffer, 'le', 8)
                ],
                programId
            );


            console.log(`📦 Creating agent: ${agent.name} (ID: ${agent.id})`);
            console.log(`   PDA: ${agentPDA.toBase58()}`);

            // Use createAgentStandalone (no UserStats dependency)
            // Explicit accounts to fix Anchor resolution error
            const tx = await program.methods.createAgentStandalone(
                agentIdBN,
                agent.archetype,
                agent.risk,
                new anchor.BN(agent.capital),
                agent.leverage,
                padName(agent.name)
            )
                .accounts({
                    agent: agentPDA,
                    treasury: wallet.publicKey, // Treasury receives the 0.05 SOL fee
                    user: wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId
                })
                .rpc();

            console.log(`   ✅ Created! TX: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
            console.log("");

            // Small delay to avoid rate limits
            await new Promise(r => setTimeout(r, 1000));

        } catch (e: any) {
            if (e.message?.includes("already in use") || e.logs?.some((l: string) => l.includes("already in use"))) {
                console.log(`   ⚠️  Agent ${agent.name} already exists (skipping)`);
            } else {
                console.error(`   ❌ Failed to create ${agent.name}:`, e.message || e);
            }
            console.log("");
        }
    }

    console.log("🎉 Demo agent creation complete!");
    console.log("📊 Check leaderboard at http://localhost:3000/leaderboard");
}

main().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});

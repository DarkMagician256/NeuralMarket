
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import fs from 'fs';
import path from 'path';


async function main() {
    // 1. Setup Provider (Reads from Anchor.toml / ENV)
    // Ensure ANCHOR_WALLET and ANCHOR_PROVIDER_URL are set or rely on defaults if running via anchor run
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    console.log("🚀 Initializing Neural Vault on Devnet...");
    console.log("Wallet:", provider.wallet.publicKey.toString());

    // 2. Load IDL 
    // We assume the IDL is available in target/idl/neural_vault.json
    const idlPath = path.resolve(__dirname, '../anchor/target/idl/neural_vault.json');
    if (!fs.existsSync(idlPath)) {
        throw new Error(`IDL not found at ${idlPath}. Run 'anchor build' first.`);
    }
    const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));

    // 3. Setup Program (Anchor 0.32 signature: Program(idl, provider))
    // Note: older or newer versions might differ, but this matches recent SDKs better or we can pass programId if needed.
    // If Program constructor demands programID, we pass it. Let's try explicit.
    const programId = new anchor.web3.PublicKey("A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F");
    // @ts-ignore
    const program = new Program(idl, provider);

    // 4. Derive PDA
    const [userStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user-stats"), provider.wallet.publicKey.toBuffer()],
        programId
    );
    console.log("Target PDA:", userStatsPDA.toString());

    // 5. Initialize User
    try {
        // Check if account already exists
        const account = await (program.account as any).userStats.fetch(userStatsPDA);
        console.log("✅ Account already initialized!");
        console.log("Stats:", account);
    } catch (e) {
        console.log("⚠️ Account not found, initializing...");
        try {
            const tx = await (program.methods as any).initializeUser()
                .accounts({
                    user: provider.wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId
                })
                .rpc();

            console.log("🎉 Success! Transaction Signature:", tx);
            console.log(`View on Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
        } catch (initError) {
            console.error("❌ Initialization Failed:", initError);
        }
    }

    // 6. Record a fake prediction to stimulate volume if needed
    try {
        console.log("🔮 Recording test prediction to boost volume...");
        const volume = new anchor.BN(500_000_000); // 0.5 SOL
        const hash = Array(32).fill(0).map(() => Math.floor(Math.random() * 255));

        const tx = await (program.methods as any).recordPrediction(volume, hash)
            .accounts({
                user: provider.wallet.publicKey,
            })
            .rpc();
        console.log("📈 Volume Recorded. Sig:", tx);
    } catch (e) {
        console.error("Failed to record prediction:", e);
    }
}

main().then(() => process.exit()).catch(e => {
    console.error(e);
    process.exit(1);
});

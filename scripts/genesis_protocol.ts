
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import fs from "fs";
import path from "path";

// 1. Configurar conexión a Devnet
const connection = new anchor.web3.Connection("https://api.devnet.solana.com", "confirmed");

// 2. Cargar Wallet desde archivo local (devnet-deployer.json)
const keypairPath = "/home/vaiosvaios/.config/solana/devnet-deployer.json";
const secretKey = JSON.parse(fs.readFileSync(keypairPath, "utf-8"));
const wallet = new anchor.Wallet(anchor.web3.Keypair.fromSecretKey(new Uint8Array(secretKey)));

// 3. Setup de Provider y Program
const provider = new anchor.AnchorProvider(connection, wallet, {});
anchor.setProvider(provider);

// Leer IDL generado
const idlPath = path.resolve(__dirname, "../anchor/target/idl/neural_vault.json");
const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));

// Program ID desplegado
const programId = new anchor.web3.PublicKey("A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F");
const program = new Program(idl, provider);

async function main() {
    console.log("🚀 Iniciando Secuencia GÉNESIS de Oráculo en Devnet...");
    console.log(`📡 Conectado a: ${programId.toBase58()}`);
    console.log(`👤 Usuario (Agente): ${wallet.publicKey.toBase58()}`);

    // 4. Derivar PDA (Program Derived Address) para UserStats
    const [userStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("user-stats"), wallet.publicKey.toBuffer()],
        programId
    );
    console.log(`🔐 Bóveda PDA Calculada: ${userStatsPDA.toBase58()}`);

    try {
        // 5. Intentar Inicializar Usuario
        console.log("⚡ Ejecutando instrucción: initialize_user()...");

        const tx = await program.methods.initializeUser()
            .accounts({
                user: wallet.publicKey,
            })
            .rpc();

        console.log("✅ ¡ÉXITO! Protocolo Génesis completado.");
        console.log(`🔗 Hash de Transacción: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
        console.log("🔮 La Bóveda Neural está ahora ABIERTA y lista para registrar predicciones on-chain.");

    } catch (e: any) {
        if (e.message.includes("already in use")) {
            console.log("⚠️  La cuenta ya estaba inicializada (Esto es bueno, significa que persistimos).");

            // Si ya existe, probemos registrar una predicción dummy
            console.log("📝 Registrando predicción de prueba...");
            try {
                const tx = await program.methods.recordPrediction(
                    new anchor.BN(50000000), // 0.05 SOL volumen simulado
                    Array(32).fill(1)       // Hash dummy
                )
                    .accounts({
                        user: wallet.publicKey
                    })
                    .rpc();
                console.log(`✅ Predicción registrada: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
            } catch (innerE) {
                console.error("❌ Fallo al registrar predicción:", innerE);
            }

        } else {
            console.error("❌ ERROR CRÍTICO durante la inicialización:", e);
        }
    }
}

main().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});

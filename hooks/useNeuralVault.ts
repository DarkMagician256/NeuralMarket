
import { useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Idl, setProvider } from '@coral-xyz/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react'; // If we have wallet adapter
// Since we are forcing Agent Visualization, we might use a readonly provider if user not connected wallet?
// Actually, we want to view the AGENT's stats, not the connected user's stats (unless connected user IS the agent).
// The agent address is fixed: DEFMy6CUCtLebLVcxhZiau1VfbAFw3nKdNHFXCX8PmjA

const AGENT_WALLET = "DEFMy6CUCtLebLVcxhZiau1VfbAFw3nKdNHFXCX8PmjA";
const PROGRAM_ID = "A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F";
const RPC_URL = "https://api.devnet.solana.com";

const IDL: Idl = {
    "address": "A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F",
    "metadata": { "name": "neural_vault", "version": "0.1.0", "spec": "0.1.0" },
    "instructions": [
        {
            "name": "initialize_user",
            "discriminator": [111, 17, 185, 250, 60, 122, 38, 254],
            "accounts": [
                { "name": "user_stats", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [117, 115, 101, 114, 45, 115, 116, 97, 116, 115] }, { "kind": "account", "path": "user" }] } },
                { "name": "user", "writable": true, "signer": true },
                { "name": "system_program", "address": "11111111111111111111111111111111" }
            ],
            "args": []
        },
        {
            "name": "record_prediction",
            "discriminator": [6, 250, 152, 187, 248, 58, 42, 136],
            "accounts": [
                { "name": "user_stats", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [117, 115, 101, 114, 45, 115, 116, 97, 116, 115] }, { "kind": "account", "path": "user" }] } },
                { "name": "user", "signer": true }
            ],
            "args": [
                { "name": "volume", "type": "u64" },
                { "name": "prediction_hash", "type": { "array": ["u8", 32] } }
            ]
        }
    ],
    "accounts": [
        {
            "name": "UserStats",
            "discriminator": [176, 223, 136, 27, 122, 79, 32, 227]
        }
    ],
    "types": [
        {
            "name": "UserStats",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "bump", "type": "u8" },
                    { "name": "user", "type": "pubkey" },
                    { "name": "total_volume", "type": "u64" },
                    { "name": "predictions_count", "type": "u64" },
                    { "name": "correct_predictions", "type": "u64" }
                ]
            }
        }
    ]
};

export function useNeuralVault() {
    const [balance, setBalance] = useState<number | null>(null);
    const [stats, setStats] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const connection = new Connection(RPC_URL);
        const agentPubkey = new PublicKey(AGENT_WALLET);

        // 1. Fetch Balance
        const fetchBalance = async () => {
            try {
                const bal = await connection.getBalance(agentPubkey);
                setBalance(bal / 1_000_000_000); // Lambda to SOL
            } catch (e) {
                console.error("Failed to fetch balance:", e);
            }
        };

        // 2. Fetch UserStats Account
        const fetchStats = async () => {
            try {
                // Mock provider just for reading
                const provider = new AnchorProvider(connection, {} as any, {});
                const program = new Program(IDL, provider);

                const [pda] = PublicKey.findProgramAddressSync(
                    [Buffer.from("user-stats"), agentPubkey.toBuffer()],
                    new PublicKey(PROGRAM_ID)
                );

                const account = await (program.account as any).userStats.fetch(pda);
                setStats(account);
            } catch (e) {
                console.error("Failed to fetch UseStats:", e);
                // If account doesn't exist (genesis ran but maybe failed?), stats remain null
            }
        };

        // Initial Load
        Promise.all([fetchBalance(), fetchStats()]).then(() => setLoading(false));

        // Poll every 5s
        const interval = setInterval(() => {
            fetchBalance();
            fetchStats();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return { balance, stats, loading, agentAddress: AGENT_WALLET };
}

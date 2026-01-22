'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, ChevronRight, ChevronLeft, CheckCircle, Zap, Shield, Brain } from 'lucide-react';
import ArchetypeSelect from '@/components/agents/wizard/ArchetypeSelect';
import StrategyConfig from '@/components/agents/wizard/StrategyConfig';
import BacktestPreview from '@/components/agents/wizard/BacktestPreview';
import NeuralMeshWrapper from '@/components/ui/NeuralMeshWrapper';
import { useRouter } from 'next/navigation';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, Idl, web3, BN } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
// @ts-ignore
import { Toaster, toast } from 'sonner';

const steps = ["SELECT ARCHETYPE", "CALIBRATION", "SIMULATION"];

// Full IDL with multi-agent support (standalone mode)
const IDL: any = {
    "address": "A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F",
    "metadata": { "name": "neural_vault", "version": "0.1.0", "spec": "0.1.0" },
    "instructions": [
        {
            "name": "create_agent_standalone",
            "discriminator": [241, 88, 137, 72, 131, 130, 234, 142],
            "accounts": [
                { "name": "agent", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": [97, 103, 101, 110, 116] }, { "kind": "account", "path": "user" }, { "kind": "arg", "path": "agent_id" }] } },
                { "name": "treasury", "writable": true },
                { "name": "user", "writable": true, "signer": true },
                { "name": "system_program", "address": "11111111111111111111111111111111" }
            ],
            "args": [
                { "name": "agent_id", "type": "u64" },
                { "name": "archetype", "type": "u8" },
                { "name": "risk_level", "type": "u8" },
                { "name": "capital", "type": "u64" },
                { "name": "leverage", "type": "u8" },
                { "name": "name", "type": { "array": ["u8", 32] } }
            ]
        }
    ]
};

const ARCHETYPE_MAP: Record<string, number> = {
    'sniper': 0,
    'oracle': 1,
    'hedger': 2,
    'whale': 3
};

// Protocol Treasury Wallet - Configurable via environment variable
const TREASURY_PUBKEY = new PublicKey(
    process.env.NEXT_PUBLIC_TREASURY_WALLET || "DEFMy6CUCtLebLVcxhZiau1VfbAFw3nKdNHFXCX8PmjA"
);

export default function AgentWizardPage() {
    const router = useRouter();
    const { connection } = useConnection();
    const wallet = useWallet();

    const [currentStep, setCurrentStep] = useState(0);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployStatus, setDeployStatus] = useState<string[]>([]);
    const [txHash, setTxHash] = useState("");

    // Form State
    const [archetype, setArchetype] = useState('sniper');
    const [risk, setRisk] = useState(50);
    const [capital, setCapital] = useState(1000);
    const [leverage, setLeverage] = useState(1);

    const nextStep = () => setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
    const prevStep = () => setCurrentStep(Math.max(0, currentStep - 1));

    const handleDeploy = async () => {
        if (!wallet.connected || !wallet.publicKey) {
            toast.error("PLEASE CONNECT WALLET TO DEPLOY AGENT");
            return;
        }

        setIsDeploying(true);
        setDeployStatus(["INITIALIZING NEURAL LINK..."]);

        try {
            const provider = new AnchorProvider(connection, wallet as any, { commitment: 'confirmed' });
            const program = new Program(IDL, provider);

            // Create unique agent ID (use timestamp for uniqueness)
            const agentId = new BN(Date.now());

            // Generate agent PDA
            const [agentPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("agent"), wallet.publicKey.toBuffer(), agentId.toArrayLike(Buffer, 'le', 8)],
                program.programId
            );

            // Prepare agent name (padded to 32 bytes)
            const agentName = `${archetype.toUpperCase()}-${agentId.toString().slice(-6)}`;
            const nameBytes = new Uint8Array(32);
            const encoder = new TextEncoder();
            const encodedName = encoder.encode(agentName);
            nameBytes.set(encodedName.slice(0, 32));

            setDeployStatus(prev => [...prev, `DEPLOYING AGENT: ${agentName}...`]);
            setDeployStatus(prev => [...prev, "REQUIRED: 0.05 SOL PROTOCOL FEE"]);
            setDeployStatus(prev => [...prev, "REQUESTING WALLET SIGNATURE..."]);

            // Create agent using standalone method (no UserStats dependency)
            const tx = await program.methods
                .createAgentStandalone(
                    agentId,
                    ARCHETYPE_MAP[archetype] || 0,
                    risk,
                    new BN(capital * 1_000_000_000), // Convert SOL to lamports
                    leverage,
                    Array.from(nameBytes)
                )
                .accounts({
                    agent: agentPda,
                    treasury: TREASURY_PUBKEY,
                    user: wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                } as any)
                .rpc();

            setTxHash(tx);
            setDeployStatus(prev => [...prev, `TX: ${tx.slice(0, 8)}...`, "WAITING FOR CONFIRMATION..."]);

            await connection.confirmTransaction(tx, 'confirmed');
            setDeployStatus(prev => [...prev, "AGENT DEPLOYED SUCCESSFULLY ✓", `AGENT ID: ${agentId.toString()}`]);
            toast.success(`Agent ${agentName} deployed!`);


            setTimeout(() => {
                router.push('/agents');
            }, 2500);

        } catch (error: any) {
            console.error("Deploy failed:", error);
            if (error.message?.includes("User rejected")) {
                setDeployStatus(prev => [...prev, "TRANSACTION CANCELLED BY USER"]);
                toast.error("Transaction cancelled");
                setTimeout(() => setIsDeploying(false), 2000);
            } else {
                setDeployStatus(prev => [...prev, "DEPLOYMENT FAILED: " + (error.message || "Unknown error")]);
                toast.error("Deployment failed");
                setTimeout(() => setIsDeploying(false), 3000);
            }
        }
    };

    if (isDeploying) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden font-mono">
                <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/26tn33aiTi1jbp6xm/giphy.gif?cid=ecf05e4782g262d152222222222222222222222222222222&rid=giphy.gif&ct=g')] opacity-10 pointer-events-none mix-blend-screen" style={{ backgroundSize: 'cover' }}></div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                    className="relative z-10 w-48 h-48 rounded-full bg-cyan-500 blur-3xl animate-pulse mb-8"
                />
                <h2 className="text-5xl font-black tracking-tighter animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white relative z-10">INITIATING GENESIS</h2>
                <div className="mt-8 space-y-2 text-center relative z-10">
                    {deployStatus.map((status, i) => (
                        <p key={i} className="text-cyan-400 text-sm font-mono">{">>"} {status}</p>
                    ))}
                    {txHash && (
                        <a
                            href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white underline text-xs mt-4 block hover:text-cyan-300"
                        >
                            VIEW ON EXPLORER
                        </a>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 opacity-50">
                <NeuralMeshWrapper />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/90 to-transparent" />
            </div>

            <div className="container mx-auto px-4 max-w-5xl relative z-10 h-full flex flex-col justify-center min-h-[80vh]">
                {/* Glass Monolith */}
                <div className="glass-panel p-1 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.1)] border border-white/10 backdrop-blur-xl bg-black/40 min-h-[600px] flex flex-col">

                    {/* Wizard Header */}
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
                        <div>
                            <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
                                AGENT GENESIS PROTOCOL
                            </h1>
                            <p className="text-xs text-gray-500 font-mono mt-1">v4.2.0 // BUILD 9182</p>
                        </div>
                        {/* Step Indicators */}
                        <div className="flex gap-2">
                            {steps.map((_, i) => (
                                <div key={i} className={`h-1 w-12 rounded-full transition-all duration-500 ${currentStep >= i ? 'bg-cyan-500 shadow-[0_0_10px_#22d3ee]' : 'bg-gray-800'}`} />
                            ))}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-8 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.4 }}
                                className="h-full flex flex-col justify-center"
                            >
                                {currentStep === 0 && (
                                    <div className="text-center">
                                        <h2 className="text-4xl font-black mb-2 text-white">SELECT ARCHETYPE</h2>
                                        <p className="text-gray-400 mb-12 max-w-lg mx-auto">Choose the neural personality core. This defines the agent's fundamental trading philosophy and reaction speed.</p>
                                        <ArchetypeSelect selected={archetype} onSelect={setArchetype} />
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="text-center">
                                        <h2 className="text-4xl font-black mb-2 text-white">SYSTEM CALIBRATION</h2>
                                        <p className="text-gray-400 mb-12 max-w-lg mx-auto">Configure risk parameters and capital allocation. Higher leverage increases volatility exposure.</p>
                                        <StrategyConfig
                                            risk={risk} setRisk={setRisk}
                                            capital={capital} setCapital={setCapital}
                                            leverage={leverage} setLeverage={setLeverage}
                                        />
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="text-center">
                                        <h2 className="text-4xl font-black mb-2 text-white">SIMULATION & DEPLOY</h2>
                                        <p className="text-gray-400 mb-8 max-w-lg mx-auto">Review historical performance based on selected parameters. Results may vary in live markets.</p>
                                        <BacktestPreview risk={risk} capital={capital} leverage={leverage} />

                                        {/* PRICING TRANSPARENCY CARD */}
                                        <div className="max-w-md mx-auto mt-8 bg-blue-900/10 border border-blue-500/20 rounded-lg p-4 backdrop-blur-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-400 text-sm flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Protocol License Fee
                                                </span>
                                                <span className="text-xl font-bold text-white font-mono">0.05 SOL</span>
                                            </div>
                                            <div className="text-[10px] text-gray-500 text-left leading-tight border-t border-white/5 pt-2 mt-2">
                                                By clicking Deploy, you confirm this is a non-refundable software license fee for utilizing the NeuralVault infrastructure. Gas fees (~0.000005 SOL) are separate.
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-center">
                                            <button
                                                onClick={handleDeploy}
                                                className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xl rounded-lg hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:scale-105 transition-all flex items-center gap-3 border border-cyan-400/50"
                                            >
                                                <Rocket size={24} /> PAY 0.05 SOL & DEPLOY
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Controls */}
                    {currentStep < 2 && (
                        <div className="p-8 border-t border-white/5 flex justify-between items-center bg-black/20">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="px-6 py-3 text-gray-400 hover:text-white disabled:opacity-0 transition-all flex items-center gap-2 font-mono text-sm"
                            >
                                <ChevronLeft size={16} /> BACK
                            </button>

                            <button
                                onClick={nextStep}
                                className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-cyan-400 transition-all flex items-center gap-2"
                            >
                                NEXT PHASE <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

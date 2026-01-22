'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN, web3 } from '@coral-xyz/anchor';
import { Zap, Loader2 } from 'lucide-react';
import idl from '@/anchor/target/idl/neural_vault.json';

const PROGRAM_ID = new web3.PublicKey("A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F");

export default function TestIntentButton() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [status, setStatus] = useState<'IDLE' | 'SIGNING' | 'SUCCESS'>('IDLE');
    const [lastSig, setLastSig] = useState<string>('');

    const handleSubmit = async () => {
        if (!wallet.publicKey || !wallet.signTransaction) return;

        try {
            setStatus('SIGNING');

            const provider = new AnchorProvider(connection, wallet as any, {});
            const program = new Program(idl as any, provider);

            const agentId = new BN(999);

            const [agentPDA] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from("agent"), wallet.publicKey.toBuffer(), agentId.toArrayLike(Buffer, 'le', 8)],
                PROGRAM_ID
            );

            // Params setup
            const ticker = Buffer.alloc(32);
            Buffer.from("DEMO_MARKET_LIVE").copy(ticker);
            const tickerArray = Array.from(ticker);

            const nameBuffer = Buffer.alloc(32);
            Buffer.from("DemoAgent").copy(nameBuffer);
            const nameArray = Array.from(nameBuffer);

            // 1. Check if agent exists
            let needsCreation = false;
            try {
                await (program.account as any).agent.fetch(agentPDA);
            } catch (e) {
                needsCreation = true;
                // Agent not found - will be created
            }

            const transaction = new web3.Transaction();

            // 2. Add Create Instruction if needed
            if (needsCreation) {
                const createIx = await program.methods.createAgentStandalone(
                    agentId,
                    0, // Sniper
                    5, // Risk
                    new BN(1000000), // Capital
                    1, // Leverage
                    nameArray
                ).accounts({
                    user: wallet.publicKey,
                }).instruction();
                transaction.add(createIx);
            }

            // 3. Add Submit Intent Instruction
            const tradeIx = await program.methods.submitTradeIntent(
                agentId,
                tickerArray,
                1, // YES side
                new BN(100_000_000), // 1 SOL equivalent intent
                new BN(99) // Limit price
            ).accounts({
                user: wallet.publicKey,
            }).instruction();
            transaction.add(tradeIx);

            // 4. Send & Confirm
            const tx = await provider.sendAndConfirm(transaction, [], { commitment: 'confirmed' });

            setLastSig(tx);
            setStatus('SUCCESS');

            setTimeout(() => setStatus('IDLE'), 5000);

        } catch (e: any) {
            console.error("Demo Intent Error:", e);
            setStatus('IDLE');
            alert(`Error: ${e.message}`);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleSubmit}
                disabled={status === 'SIGNING' || !wallet.connected}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-lg border border-yellow-500/50 transition-all font-mono text-xs font-bold"
            >
                {status === 'SIGNING' ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
                {status === 'SUCCESS' ? 'INTENT ON-CHAIN' : 'TEST DFLOW INTENT'}
            </button>
            {lastSig && (
                <a
                    href={`https://explorer.solana.com/tx/${lastSig}?cluster=devnet`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-green-400 underline"
                >
                    View TX
                </a>
            )}
        </div>
    );
}

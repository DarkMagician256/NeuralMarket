"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey } from '@solana/web3.js';
import { buildTradeTransaction, recordTrade } from '@/app/actions/executeTrade';

export default function TradePanel({ ticker }: { ticker: string }) {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [outcome, setOutcome] = useState<'YES' | 'NO'>('YES');
    const [amount, setAmount] = useState<string>('100');
    const [isTrading, setIsTrading] = useState(false);

    const handleTrade = async () => {
        if (!publicKey) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            setIsTrading(true);

            // 1. Build transaction on server (to inject Builder Code safely)
            const base64Tx = await buildTradeTransaction(
                publicKey.toBase58(),
                ticker,
                outcome,
                Number(amount)
            );

            // 2. Deserialize and sign on client
            const transaction = Transaction.from(Buffer.from(base64Tx, 'base64'));

            // 3. Send and confirm via wallet
            const signature = await sendTransaction(transaction, connection);
            console.log(`[ORACULO] Trade Transaction Sent: ${signature}`);

            // 4. Record for portfolio
            await recordTrade({
                user: publicKey.toBase58(),
                ticker,
                outcome,
                amount: Number(amount),
                signature
            });

            alert(`Trade Success! Tx: ${signature.substring(0, 8)}...`);
        } catch (error: any) {
            console.error("Trade execution failed:", error);
            alert(`Execution Aborted: ${error?.message || 'Unknown error'}`);
        } finally {
            setIsTrading(false);
        }
    };

    return (
        <div className="glass-panel p-6 flex flex-col h-full bg-[#050505]/95">
            <h3 className="text-gray-400 font-mono text-xs tracking-widest mb-6 border-b border-white/5 pb-2">
                EXECUTION ENGINE
            </h3>

            {/* Outcome Selector */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                    onClick={() => setOutcome('YES')}
                    className={`py-4 rounded-xl font-black text-xl tracking-wider transition-all border ${outcome === 'YES'
                        ? 'bg-green-500/20 text-green-400 border-green-500 shadow-[0_0_20px_rgba(74,222,128,0.3)]'
                        : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                        }`}
                >
                    YES <span className="block text-xs font-mono font-normal opacity-70">LONG</span>
                </button>
                <button
                    onClick={() => setOutcome('NO')}
                    className={`py-4 rounded-xl font-black text-xl tracking-wider transition-all border ${outcome === 'NO'
                        ? 'bg-red-500/20 text-red-400 border-red-500 shadow-[0_0_20px_rgba(248,113,113,0.3)]'
                        : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                        }`}
                >
                    NO <span className="block text-xs font-mono font-normal opacity-70">SHORT</span>
                </button>
            </div>

            {/* Input */}
            <div className="mb-8 space-y-2">
                <label className="text-xs text-gray-400 font-mono ml-1">AMOUNT (SOL)</label>
                <div className="relative">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-black/50 border border-white/20 rounded-lg py-3 px-4 text-2xl font-bold text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500 text-xs font-bold hover:text-white">
                        MAX
                    </button>
                </div>
                <div className="flex justify-between text-xs text-gray-500 px-1 font-mono">
                    <span>Bal: 145.50 SOL</span>
                    <span>Fee: ~0.00005 SOL</span>
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTrade}
                    disabled={isTrading}
                    className={`w-full py-5 rounded-none font-black text-2xl tracking-widest relative overflow-hidden group transition-all ${outcome === 'YES' ? 'bg-green-500 hover:bg-green-400 text-black' : 'bg-red-500 hover:bg-red-400 text-black'
                        } ${isTrading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                >
                    {isTrading ? (
                        <span className="animate-pulse">CONFIRMING...</span>
                    ) : (
                        <>
                            PLACE TRADE
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12" />
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}

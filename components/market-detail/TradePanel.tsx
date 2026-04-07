"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey } from '@solana/web3.js';
import { buildTradeTransaction, recordTrade } from '@/app/actions/executeTrade';
import { ExternalLink } from 'lucide-react';

export default function TradePanel({ ticker }: { ticker: string }) {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [outcome, setOutcome] = useState<'YES' | 'NO'>('YES');
    const [amount, setAmount] = useState<string>('1');
    const [isTrading, setIsTrading] = useState(false);
    const [successTx, setSuccessTx] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);

    // Fetch real balance
    useEffect(() => {
        if (publicKey && connection) {
            connection.getBalance(publicKey).then(bal => setBalance(bal / 1_000_000_000));
        }
    }, [publicKey, connection]);

    const handleTrade = async () => {
        if (!publicKey) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            setIsTrading(true);
            setSuccessTx(null); // Reset previous success

            // 0. Pre-check Balance
            if (balance !== null && Number(amount) > balance) {
                throw new Error("Insufficient funds. Please lower amount or top up.");
            }

            // 1. Build transaction on server
            const base64Tx = await buildTradeTransaction(
                publicKey.toBase58(),
                ticker,
                outcome,
                Number(amount)
            );

            // 2. Deserialize and sign on client (Browser-Safe Method)
            const binaryString = atob(base64Tx);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const transaction = Transaction.from(bytes);

            // 3. Send and confirm via wallet
            const signature = await sendTransaction(transaction, connection);

            // 4. Record for portfolio
            await recordTrade({
                user: publicKey.toBase58(),
                ticker,
                outcome,
                amount: Number(amount),
                signature
            });

            // Show beautiful success UI instead of alert
            setSuccessTx(signature);

        } catch (error: any) {
            console.error("Trade execution failed:", error);
            alert(`Execution Aborted: ${error?.message || 'Unknown error'}`);
        } finally {
            setIsTrading(false);
        }
    };

    return (
        <div className="glass-panel p-6 flex flex-col h-full bg-[#050505]/95 relative overflow-hidden">
            {/* Success Overlay */}
            <AnimatePresence>
                {successTx && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 border border-green-500"
                        >
                            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </motion.div>

                        <h3 className="text-xl font-black text-white mb-2 tracking-tight">TRADE EXECUTED</h3>
                        <p className="text-gray-400 text-sm mb-6 max-w-[200px]">
                            Your order has been submitted to the Solana network.
                        </p>

                        <a
                            href={`https://explorer.solana.com/tx/${successTx}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-xs mb-8 transition-colors border-b border-cyan-500/30 hover:border-cyan-500 pb-0.5"
                        >
                            VIEW TRANSACTION <ExternalLink size={12} />
                        </a>

                        <button
                            onClick={() => setSuccessTx(null)}
                            className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 font-bold text-sm transition-all"
                        >
                            CLOSE
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <h3 className="text-gray-400 font-mono text-xs tracking-widest mb-6 border-b border-white/5 pb-2">
                EXECUTION ENGINE
            </h3>

            {/* Outcome Selector */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                <button
                    onClick={() => setOutcome('YES')}
                    className={`py-3 md:py-4 rounded-xl font-black text-lg md:text-xl tracking-wider transition-all border ${outcome === 'YES'
                        ? 'bg-green-500/20 text-green-400 border-green-500 shadow-[0_0_20px_rgba(74,222,128,0.3)]'
                        : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                        }`}
                >
                    YES <span className="block text-[10px] md:text-xs font-mono font-normal opacity-70">LONG</span>
                </button>
                <button
                    onClick={() => setOutcome('NO')}
                    className={`py-3 md:py-4 rounded-xl font-black text-lg md:text-xl tracking-wider transition-all border ${outcome === 'NO'
                        ? 'bg-red-500/20 text-red-400 border-red-500 shadow-[0_0_20px_rgba(248,113,113,0.3)]'
                        : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                        }`}
                >
                    NO <span className="block text-[10px] md:text-xs font-mono font-normal opacity-70">SHORT</span>
                </button>
            </div>

            {/* Input */}
            <div className="mb-6 md:mb-8 space-y-2">
                <label className="text-[10px] md:text-xs text-gray-400 font-mono ml-1 uppercase">Amount (USDC)</label>
                <div className="relative">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-black/50 border border-white/20 rounded-lg py-2 md:py-3 px-4 text-xl md:text-2xl font-bold text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button
                        onClick={() => balance && setAmount(Math.max(0, balance - 0.01).toFixed(4))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500 text-[10px] md:text-xs font-bold hover:text-white"
                    >
                        MAX
                    </button>
                </div>
                <div className="flex justify-between text-[10px] md:text-xs text-gray-500 px-1 font-mono">
                    <span>Bal: {balance !== null ? balance.toFixed(4) : '---'} SOL</span>
                    <span>Fee: ~0.00005 USDC</span>
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTrade}
                    disabled={isTrading}
                    className={`w-full py-4 md:py-5 rounded-none font-black text-xl md:text-2xl tracking-widest relative overflow-hidden group transition-all ${outcome === 'YES' ? 'bg-green-500 hover:bg-green-400 text-black' : 'bg-red-500 hover:bg-red-400 text-black'
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

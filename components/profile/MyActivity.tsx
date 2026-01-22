'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ConfirmedSignatureInfo } from '@solana/web3.js';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Clock, RefreshCw, Activity, Wallet } from 'lucide-react';

export default function MyActivity() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [history, setHistory] = useState<ConfirmedSignatureInfo[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = useCallback(async () => {
        if (!publicKey) return;

        setLoading(true);
        try {
            // Fetch signatures for the connected wallet
            const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
            setHistory(signatures);
        } catch (err) {
            console.error("Failed to fetch wallet history:", err);
        } finally {
            setLoading(false);
        }
    }, [connection, publicKey]);

    useEffect(() => {
        if (publicKey) {
            fetchHistory();
            const interval = setInterval(fetchHistory, 15000); // Refresh every 15s
            return () => clearInterval(interval);
        }
    }, [fetchHistory, publicKey]);

    if (!publicKey) return null;

    return (
        <div className="glass-panel p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Activity className="text-purple-400" size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tighter uppercase italic">My On-Chain Activity</h2>
                        <p className="text-[10px] font-mono text-gray-500 uppercase">Live Solana Transaction Feed (Devnet)</p>
                    </div>
                </div>
                <button
                    onClick={fetchHistory}
                    disabled={loading}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                >
                    <RefreshCw size={16} className={`text-gray-400 group-hover:text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                    <thead>
                        <tr className="text-gray-600 border-b border-white/5 pb-2">
                            <th className="pb-3 font-medium uppercase text-[10px]">Signature</th>
                            <th className="pb-3 font-medium uppercase text-[10px]">Slot</th>
                            <th className="pb-3 font-medium uppercase text-[10px]">Time</th>
                            <th className="pb-3 font-medium uppercase text-[10px]">Status</th>
                            <th className="pb-3 font-medium uppercase text-[10px] text-right">Explorer</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <AnimatePresence mode="popLayout">
                            {history.map((sig, i) => (
                                <motion.tr
                                    key={sig.signature}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group hover:bg-white/[0.02]"
                                >
                                    <td className="py-4 text-purple-400/80 group-hover:text-purple-400 font-bold">
                                        {sig.signature.slice(0, 20)}...
                                    </td>
                                    <td className="py-4 text-gray-500">
                                        #{sig.slot.toLocaleString()}
                                    </td>
                                    <td className="py-4 text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} className="opacity-40" />
                                            {sig.blockTime ? new Date(sig.blockTime * 1000).toLocaleTimeString() : '...'}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        {sig.err ? (
                                            <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded text-[10px] border border-red-500/20">FAILED</span>
                                        ) : (
                                            <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-[10px] border border-green-500/20">CONFIRMED</span>
                                        )}
                                    </td>
                                    <td className="py-4 text-right">
                                        <a
                                            href={`https://explorer.solana.com/tx/${sig.signature}?cluster=devnet`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 p-1.5 bg-white/5 hover:bg-purple-500/20 rounded-md transition-all text-gray-400 hover:text-white"
                                        >
                                            <span className="text-[10px] hidden sm:inline">View</span>
                                            <ExternalLink size={12} />
                                        </a>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {!loading && history.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-gray-600 uppercase tracking-widest text-xs">
                                    No transaction history found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

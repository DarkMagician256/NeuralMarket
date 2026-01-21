import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Scan } from 'lucide-react';
import { useNeuralVault } from '@/hooks/useNeuralVault';

export default function PortfolioHeader() {
    const { balance, stats, agentAddress } = useNeuralVault();

    // Calculate Accuracy from Real Chain Stats
    const total = stats ? stats.predictionsCount.toNumber() : 0;
    const correct = stats ? stats.correctPredictions.toNumber() : 0;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;

    // Use Balance trend if we had history, for now showing Accuracy as key metric
    const isPositive = accuracy >= 50;

    return (
        <div className="glass-panel p-8 relative overflow-hidden group">
            {/* Scanning Effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/50 shadow-[0_0_15px_#22d3ee] animate-scan" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h2 className="text-gray-400 text-sm font-mono tracking-widest mb-1 flex items-center gap-2">
                        <Scan size={14} /> LIVE AGENT BALANCE (DEVNET)
                    </h2>
                    <div className="text-5xl md:text-6xl font-black text-white tracking-tight tabular-nums transition-all">
                        {balance !== null ? `${balance.toFixed(4)} SOL` : 'CONNECTING...'}
                    </div>
                    <div className="text-xs text-cyan-500/70 font-mono mt-1 flex items-center gap-2">
                        <span>{agentAddress}</span>
                        <a
                            href={`https://explorer.solana.com/address/${agentAddress}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 px-1 rounded hover:bg-white/20 transition-colors"
                        >
                            EXPLORER ↗
                        </a>
                    </div>
                </div>

                <div className="text-right flex flex-col items-end">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 mb-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                        <img
                            src={`https://api.dicebear.com/9.x/bottts/svg?seed=NeuralBot&backgroundColor=1d1d1d`}
                            alt="Agent Avatar"
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="text-gray-400 text-sm font-mono tracking-widest mb-1">ON-CHAIN ACCURACY</div>
                    <div className={`text-4xl font-bold flex items-center justify-end gap-2 ${isPositive ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'text-yellow-400'}`}>
                        {accuracy.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 font-mono mt-1">
                        BASED ON {total} VERIFIED PREDICTIONS
                    </div>
                </div>
            </div>
        </div>
    );
}

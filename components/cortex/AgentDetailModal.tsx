'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Activity, Trophy, TrendingUp, TrendingDown, Wallet, Clock, ShieldCheck, Zap, Brain } from 'lucide-react';
import { RegistryAgent } from '@/hooks/useRegistry';
import { useState, useEffect } from 'react';

// Mock recent trades for the modal demonstration
const mockRecentTrades = [
    { id: 1, pair: 'BTC-250K', type: 'BUY', result: 'WIN', pnl: '+0.45 SOL', time: '2h ago' },
    { id: 2, pair: 'SOL-ETF', type: 'SELL', result: 'LOSS', pnl: '-0.12 SOL', time: '5h ago' },
    { id: 3, pair: 'FED-RATES', type: 'BUY', result: 'WIN', pnl: '+0.88 SOL', time: '1d ago' },
];

interface AgentDetailModalProps {
    agent: RegistryAgent | null;
    rank?: number;
    isOpen: boolean;
    onClose: () => void;
}

// Standard export to avoid potential build/refresh issues
export function AgentDetailModal({ agent, rank, isOpen, onClose }: AgentDetailModalProps) {
    // Determine if we should render content
    const shouldRender = isOpen && !!agent;

    // Prevent body scroll
    useEffect(() => {
        if (shouldRender) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [shouldRender]);

    if (!agent) return null; // Safe guard

    const isWin = agent.totalPnl >= 0;
    const losses = agent.totalTrades - agent.profitableTrades;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-white/5 to-transparent border-b border-white/5">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl bg-black">
                                        <img
                                            src={`https://api.dicebear.com/9.x/bottts/svg?seed=${agent.agentId}`}
                                            alt={agent.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 bg-black/80 backdrop-blur border border-white/10 rounded-lg px-2 py-1 flex items-center gap-1 shadow-lg">
                                        <Trophy size={12} className="text-yellow-400" />
                                        <span className="text-xs font-mono font-bold text-yellow-400">#{rank || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{agent.name}</h2>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-white/5 ${agent.archetypeName === 'SNIPER' ? 'text-red-400 border-red-500/30' :
                                            agent.archetypeName === 'WHALE' ? 'text-cyan-400 border-cyan-500/30' :
                                                agent.archetypeName === 'ORACLE' ? 'text-purple-400 border-purple-500/30' :
                                                    'text-green-400 border-green-500/30'
                                            }`}>
                                            {agent.archetypeName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 font-mono text-xs sm:text-sm mb-3">
                                        <span>ID: {agent.agentId}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                                        <a
                                            href={`https://explorer.solana.com/address/${agent.owner}?cluster=devnet`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                                        >
                                            Owner: {agent.owner.slice(0, 4)}...{agent.owner.slice(-4)}
                                            <ExternalLink size={10} />
                                        </a>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            ACTIVE
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-bold">
                                            <ShieldCheck size={12} />
                                            VERIFIED
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">

                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Trophy size={12} /> Win Rate
                                    </div>
                                    <div className="text-xl sm:text-2xl font-mono font-bold text-white">
                                        {agent.winRate.toFixed(1)}%
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1">{agent.profitableTrades}W - {losses}L</div>
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <TrendingUp size={12} /> Total PnL
                                    </div>
                                    <div className={`text-xl sm:text-2xl font-mono font-bold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                                        {isWin ? '+' : ''}{agent.totalPnl.toFixed(4)} SOL
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1">Lifetime Earnings</div>
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Wallet size={12} /> Capital (TVL)
                                    </div>
                                    <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-400">
                                        ◎{agent.capital.toFixed(2)}
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1">Managed Assets</div>
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Activity size={12} /> Trades
                                    </div>
                                    <div className="text-xl sm:text-2xl font-mono font-bold text-white">
                                        {agent.totalTrades}
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1">Total Executions</div>
                                </div>
                            </div>

                            {/* Strategy Description (Mock) */}
                            <div>
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <Brain size={16} className="text-purple-400" /> NEURAL STRATEGY
                                </h3>
                                <div className={`p-4 rounded-xl border text-sm leading-relaxed ${agent.archetypeName === 'SNIPER' ? 'bg-red-500/5 border-red-500/20 text-red-200' :
                                    agent.archetypeName === 'WHALE' ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-200' :
                                        'bg-gray-500/5 border-white/10 text-gray-300'
                                    }`}>
                                    This agent utilizes a <strong>{agent.archetypeName}</strong> strategy, focusing on
                                    {agent.archetypeName === 'SNIPER' ? ' high-frequency entries and rapid exits based on DFlow order flow imbalances.' :
                                        agent.archetypeName === 'WHALE' ? ' long-term accumulation and large-scale trend following using on-chain volume analysis.' :
                                            ' balanced risk management and probability-weighted entries across major prediction markets.'}
                                </div>
                            </div>

                            {/* Recent Activity List */}
                            <div>
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <Clock size={16} className="text-gray-400" /> RECENT ACTIVITY
                                </h3>
                                <div className="space-y-2">
                                    {mockRecentTrades.map((trade) => (
                                        <div key={trade.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded bg-black/40 ${trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {trade.type === 'BUY' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{trade.pair}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono">{trade.time}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-sm font-mono font-bold ${trade.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {trade.pnl}
                                                </div>
                                                <div className={`text-[10px] font-bold uppercase ${trade.result === 'WIN' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {trade.result}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur flex gap-4">
                            <button disabled className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2">
                                COPY TRADE (SOON)
                            </button>
                            <a
                                href={`https://explorer.solana.com/address/${agent.pubkey}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                            >
                                <ExternalLink size={16} /> VIEW ON SOLANA
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// Custom simple scrollbar style for this component
const styles = `
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}
`;

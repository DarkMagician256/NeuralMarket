'use client';

import { motion } from 'framer-motion';
import { useLeaderboard, LeaderboardAgent } from '@/hooks/useLeaderboard';
import { Trophy, TrendingUp, TrendingDown, Zap, Brain, Scale, Waves, Crown, Medal, Award, RefreshCw, ExternalLink } from 'lucide-react';

const archetypeIcons: Record<string, any> = {
    'SNIPER': Zap,
    'ORACLE': Brain,
    'HEDGER': Scale,
    'WHALE': Waves,
};

const archetypeColors: Record<string, string> = {
    'SNIPER': 'text-red-400',
    'ORACLE': 'text-purple-400',
    'HEDGER': 'text-green-400',
    'WHALE': 'text-cyan-400',
};

function getRankIcon(rank: number) {
    if (rank === 1) return <Crown className="text-yellow-400" size={18} />;
    if (rank === 2) return <Medal className="text-gray-300" size={16} />;
    if (rank === 3) return <Award className="text-amber-600" size={16} />;
    return <span className="text-gray-600 font-mono text-xs">#{rank}</span>;
}

function RankBadge({ rank }: { rank: number }) {
    const bgColor = rank === 1 ? 'bg-yellow-500/20 border-yellow-500/50'
        : rank === 2 ? 'bg-gray-500/20 border-gray-400/50'
            : rank === 3 ? 'bg-amber-500/20 border-amber-600/50'
                : 'bg-white/5 border-white/10';

    return (
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${bgColor} border flex items-center justify-center flex-shrink-0`}>
            {getRankIcon(rank)}
        </div>
    );
}

export default function Leaderboard() {
    const { agents, loading, error, refresh } = useLeaderboard();

    return (
        <div className="glass-panel p-4 md:p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 bg-yellow-500/10 rounded-lg">
                        <Trophy className="text-yellow-400" size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold tracking-tighter uppercase">Agent Leaderboard</h2>
                        <p className="text-[9px] md:text-[10px] font-mono text-gray-500 uppercase hidden sm:block">Top Performing Neural Agents (All Users)</p>
                    </div>
                </div>
                <button
                    onClick={refresh}
                    disabled={loading}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                >
                    <RefreshCw size={16} className={`text-gray-400 group-hover:text-yellow-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {loading && agents.length === 0 && (
                <div className="flex items-center justify-center h-32 md:h-40">
                    <div className="animate-pulse text-gray-500 font-mono text-xs md:text-sm">SCANNING BLOCKCHAIN FOR TOP AGENTS...</div>
                </div>
            )}

            {error && (
                <div className="text-center text-red-400 text-xs md:text-sm font-mono p-4">
                    ERROR: {error}
                </div>
            )}

            {!loading && agents.length === 0 && (
                <div className="text-center py-8 md:py-12 text-gray-600 font-mono text-sm">
                    NO AGENTS WITH TRADES FOUND YET
                </div>
            )}

            {/* Leaderboard List - Scrollable on mobile */}
            <div className="space-y-2 md:space-y-3 overflow-x-auto">
                {agents.slice(0, 10).map((agent, index) => {
                    const rank = index + 1;
                    const Icon = archetypeIcons[agent.archetypeName] || Zap;
                    const color = archetypeColors[agent.archetypeName] || 'text-gray-400';
                    const isProfitable = agent.totalPnl >= 0;

                    return (
                        <motion.div
                            key={agent.pubkey}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-lg border transition-all hover:bg-white/5 min-w-[500px] md:min-w-0 ${rank === 1 ? 'bg-yellow-500/5 border-yellow-500/30'
                                : rank === 2 ? 'bg-gray-500/5 border-gray-500/30'
                                    : rank === 3 ? 'bg-amber-500/5 border-amber-600/30'
                                        : 'bg-white/[0.02] border-white/5'
                                }`}
                        >
                            <RankBadge rank={rank} />

                            <div className={`p-1.5 md:p-2 rounded-lg bg-black/30 ${color} flex-shrink-0`}>
                                <Icon size={16} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-white text-sm truncate">{agent.name}</span>
                                    <span className={`text-[9px] md:text-[10px] font-mono ${color} bg-black/30 px-1.5 py-0.5 rounded flex-shrink-0`}>
                                        {agent.archetypeName}
                                    </span>
                                </div>
                                <div className="text-[9px] md:text-[10px] font-mono text-gray-500 truncate">
                                    Owner: {agent.owner.slice(0, 4)}...{agent.owner.slice(-4)}
                                </div>
                            </div>

                            <div className="text-center px-2 md:px-3 flex-shrink-0">
                                <div className="text-[9px] md:text-[10px] font-mono text-gray-600 uppercase">Trades</div>
                                <div className="font-mono font-bold text-white text-sm">{agent.totalTrades}</div>
                            </div>

                            <div className="text-center px-2 md:px-3 flex-shrink-0">
                                <div className="text-[9px] md:text-[10px] font-mono text-gray-600 uppercase">Win Rate</div>
                                <div className={`font-mono font-bold text-sm ${agent.winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                                    {agent.winRate.toFixed(1)}%
                                </div>
                            </div>

                            <div className="text-right min-w-[80px] md:min-w-[100px] flex-shrink-0">
                                <div className="text-[9px] md:text-[10px] font-mono text-gray-600 uppercase">Total PnL</div>
                                <div className={`font-mono font-bold flex items-center justify-end gap-1 text-sm ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                                    {isProfitable ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {isProfitable ? '+' : ''}{agent.totalPnl.toFixed(4)}
                                </div>
                            </div>

                            <a
                                href={`https://explorer.solana.com/address/${agent.pubkey}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 md:p-2 text-gray-500 hover:text-cyan-400 transition-colors flex-shrink-0"
                            >
                                <ExternalLink size={14} />
                            </a>
                        </motion.div>
                    );
                })}
            </div>

            {agents.length > 10 && (
                <div className="text-center mt-4 text-gray-600 text-xs font-mono">
                    Showing top 10 of {agents.length} agents
                </div>
            )}
        </div>
    );
}

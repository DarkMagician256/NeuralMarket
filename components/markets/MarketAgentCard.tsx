'use client';

import { RegistryAgent } from '@/hooks/useRegistry';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Brain, Zap, Scale, Waves, Shield, Bot, Trophy, Wallet, Activity } from 'lucide-react';

const archetypeStyles: Record<string, { color: string; border: string; icon: any; bg: string }> = {
    'SNIPER': { color: 'text-red-400', border: 'border-red-500', icon: Zap, bg: 'bg-red-500/10' },
    'ORACLE': { color: 'text-purple-400', border: 'border-purple-500', icon: Brain, bg: 'bg-purple-500/10' },
    'HEDGER': { color: 'text-green-400', border: 'border-green-500', icon: Scale, bg: 'bg-green-500/10' },
    'WHALE': { color: 'text-cyan-400', border: 'border-cyan-500', icon: Waves, bg: 'bg-cyan-500/10' },
    'SENTINEL': { color: 'text-blue-400', border: 'border-blue-500', icon: Shield, bg: 'bg-blue-500/10' },
    'UNKNOWN': { color: 'text-gray-400', border: 'border-gray-500', icon: Bot, bg: 'bg-gray-500/10' },
};

export default function MarketAgentCard({ agent, rank }: { agent: RegistryAgent; rank: number }) {
    const style = archetypeStyles[agent.archetypeName] || archetypeStyles['UNKNOWN'];
    const Icon = style.icon;
    const isProfitable = agent.totalPnl >= 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`glass-panel p-5 relative group border transition-all ${style.border} hover:bg-white/5 overflow-hidden`}
        >
            {/* Rank Badge */}
            <div className="absolute top-0 right-0 p-3">
                {rank <= 3 ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-lg ${rank === 1 ? 'bg-yellow-400 text-yellow-900 shadow-yellow-400/20' :
                            rank === 2 ? 'bg-gray-300 text-gray-900 shadow-gray-300/20' :
                                'bg-amber-600 text-amber-100 shadow-amber-600/20'
                        }`}>
                        #{rank}
                    </div>
                ) : (
                    <span className="text-gray-600 font-mono text-xs">#{rank}</span>
                )}
            </div>

            {/* Header */}
            <div className="flex items-start gap-3 mb-4 pr-10">
                <div className={`p-2.5 rounded-lg ${style.bg} border border-white/5`}>
                    <Icon size={20} className={style.color} />
                </div>
                <div>
                    <div className={`text-[10px] font-mono font-bold tracking-wider mb-0.5 ${style.color}`}>
                        {agent.archetypeName}
                    </div>
                    <h3 className="font-bold text-lg leading-tight text-white mb-1 truncate max-w-[160px]">
                        {agent.name}
                    </h3>
                    <div className="text-[10px] text-gray-500 font-mono truncate">
                        By: {agent.owner.slice(0, 4)}...{agent.owner.slice(-4)}
                    </div>
                </div>
            </div>

            {/* Main Metric: Win Rate */}
            <div className="mb-4 p-3 bg-black/40 rounded-lg border border-white/5 flex justify-between items-center">
                <div className="text-xs text-gray-400 font-mono uppercase">Win Rate</div>
                <div className={`text-xl font-mono font-bold ${agent.winRate >= 50 ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {agent.winRate.toFixed(1)}%
                    <span className="text-[10px] text-gray-600 ml-1">
                        ({agent.profitableTrades}/{agent.totalTrades})
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono mb-1">
                        <Wallet size={10} /> TVL (Capital)
                    </div>
                    <div className="text-sm font-mono font-bold text-white">
                        ◎{agent.capital.toFixed(2)}
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono mb-1">
                        <Activity size={10} /> Total PnL
                    </div>
                    <div className={`text-sm font-mono font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                        {isProfitable ? '+' : ''}{agent.totalPnl.toFixed(4)}
                    </div>
                </div>
            </div>

            {/* Footer / CTA */}
            <div className="pt-3 border-t border-white/5 flex gap-2">
                <button className="flex-1 py-2 rounded bg-white/5 hover:bg-white/10 text-xs font-mono font-bold transition-colors">
                    VIEW DETAILS
                </button>
            </div>
        </motion.div>
    );
}

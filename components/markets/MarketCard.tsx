'use client';

import { Market } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BadgeAlert, BrainCircuit } from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function MarketCard({ market }: { market: Market }) {
    const router = useRouter();
    const isVolatile = Math.abs(market.change24h) > 5;
    const isCortexActive = !!market.cortexSignal;

    const handleQuickTrade = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/markets/${market.ticker}?action=trade`);
    };

    return (
        <motion.div
            layout
            onClick={() => router.push(`/markets/${market.ticker}`)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`glass-panel p-5 relative group cursor-pointer overflow-hidden border transition-colors ${market.category === 'POLITICS' ? 'hover:border-blue-500/30' :
                market.category === 'CRYPTO' ? 'hover:border-orange-500/30' :
                    'hover:border-purple-500/30'
                }`}
        >
            {/* Glow Effect on Hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none bg-gradient-to-tr ${market.category === 'POLITICS' ? 'from-blue-500 to-cyan-500' :
                market.category === 'CRYPTO' ? 'from-orange-500 to-yellow-500' :
                    'from-purple-500 to-pink-500'
                }`} />

            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-gray-400 tracking-wider mb-1 px-1.5 py-0.5 rounded border border-white/5 w-fit bg-black/20">
                        {market.category}
                    </span>
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 min-h-[44px]">
                        {market.title}
                    </h3>
                </div>
                {isCortexActive && (
                    <div className="animate-pulse" title={`Cortex Signal: ${market.cortexSignal}`}>
                        <BrainCircuit size={18} className={market.cortexSignal === 'BULLISH' ? 'text-green-400' : market.cortexSignal === 'BEARISH' ? 'text-red-400' : 'text-gray-400'} />
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
                <div>
                    <div className="text-gray-500 text-xs mb-1">Probability</div>
                    <div className="text-2xl font-mono font-bold tracking-tight">
                        {market.probability}%
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-gray-500 text-xs mb-1">Volume</div>
                    <div className="text-white font-mono">{market.volume}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4 relative z-10">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${market.probability}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full ${market.probability > 80 ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' :
                        market.probability < 20 ? 'bg-red-400 shadow-[0_0_10px_#f87171]' :
                            'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'
                        }`}
                />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-xs relative z-10">
                <div className={`flex items-center gap-1 font-mono ${market.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {market.change24h >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(market.change24h)}% (24h)
                </div>

                <button
                    onClick={handleQuickTrade}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black font-bold px-3 py-1 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0"
                >
                    TRADE
                </button>
            </div>
        </motion.div>
    );
}

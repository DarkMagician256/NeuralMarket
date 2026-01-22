'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { Market } from '@/app/actions/getMarkets';

interface Props {
    market: Market;
}

export default function MarketPredictionCard({ market }: Props) {
    // Handle both old format (yesPrice as decimal) and new format (probability as percentage)
    const yesPrice = market.yesPrice ?? market.probability / 100;
    const noPrice = market.noPrice ?? (100 - market.probability) / 100;

    return (
        <Link href={`/markets/${market.ticker}`} className="block h-full">
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all group h-full flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${market.category === 'CRYPTO' ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' :
                                market.category === 'POLITICS' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                                    market.category === 'ECONOMICS' ? 'text-green-400 border-green-500/30 bg-green-500/10' :
                                        market.category === 'SCIENCE' ? 'text-purple-400 border-purple-500/30 bg-purple-500/10' :
                                            'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
                            }`}>
                            {market.category}
                        </span>
                        {market.expiration && (
                            <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                                <Clock size={10} /> {market.expiration.split('T')[0]}
                            </span>
                        )}
                    </div>
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-2 min-h-[2.5rem]">
                        {market.title}
                    </h3>
                </div>

                {/* Trading Area */}
                <div className="p-4 space-y-4 flex-1 flex flex-col justify-end">
                    {/* Prices */}
                    <div className="flex gap-2">
                        <button className="flex-1 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 rounded-lg p-2 transition-colors group/yes relative overflow-hidden">
                            <div className="text-[10px] text-green-500 font-mono font-bold mb-0.5 uppercase">Yes</div>
                            <div className="text-lg font-bold text-white tracking-tight">
                                {yesPrice.toFixed(2)} <span className="text-[10px] font-bold text-purple-400">SOL</span>
                            </div>
                            {/* Fill bar */}
                            <div className="absolute bottom-0 left-0 h-1 bg-green-500" style={{ width: `${yesPrice * 100}%` }} />
                        </button>
                        <button className="flex-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg p-2 transition-colors group/no relative overflow-hidden">
                            <div className="text-[10px] text-red-500 font-mono font-bold mb-0.5 uppercase">No</div>
                            <div className="text-lg font-bold text-white tracking-tight">
                                {noPrice.toFixed(2)} <span className="text-[10px] font-bold text-purple-400">SOL</span>
                            </div>
                            {/* Fill bar */}
                            <div className="absolute bottom-0 left-0 h-1 bg-red-500" style={{ width: `${noPrice * 100}%` }} />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                            <BarChart3 size={12} /> Vol: {market.volume}
                        </div>
                        {market.cortexSignal && (
                            <div className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${market.cortexSignal === 'BULLISH' ? 'text-green-400 bg-green-500/10' :
                                    market.cortexSignal === 'BEARISH' ? 'text-red-400 bg-red-500/10' :
                                        'text-gray-400 bg-white/5'
                                }`}>
                                {market.cortexSignal}
                            </div>
                        )}
                        <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono group-hover:text-cyan-300 transition-colors">
                            Trade <TrendingUp size={10} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

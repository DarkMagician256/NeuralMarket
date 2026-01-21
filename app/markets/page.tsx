'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import MarketPredictionCard from '@/components/markets/MarketPredictionCard';
import TestIntentButton from '@/components/debug/TestIntentButton';
import { KALSHI_MARKETS } from '@/lib/kalshiData';
import { TrendingUp, Globe, Clock, ArrowRight } from 'lucide-react';

export default function MarketsPage() {
    return (
        <div className="min-h-screen pb-16 md:pb-20 pt-24 md:pt-28 px-3 sm:px-4 md:px-8">
            <div className="container mx-auto max-w-7xl">

                {/* Header Section - Responsive */}
                <div className="flex flex-col gap-6 md:gap-8 mb-8 md:mb-12 border-b border-white/10 pb-6 md:pb-8">
                    {/* Title & Description */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap items-center gap-3 md:gap-4 mb-2 md:mb-3"
                        >
                            <div className="p-2 md:p-3 bg-green-500/10 rounded-xl">
                                <TrendingUp className="text-green-400" size={24} />
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white">
                                PREDICTION MARKETS
                            </h1>
                            <div className="ml-2 opacity-0 hover:opacity-100 transition-opacity hidden lg:block">
                                <TestIntentButton />
                            </div>
                        </motion.div>
                        <p className="text-gray-400 font-mono text-xs sm:text-sm max-w-2xl leading-relaxed">
                            Access live event contracts powered by Kalshi and DFlow.
                            Deploy your Neural Agents to analyze outcomes and execute trades on
                            real-world events, from economics to politics.
                        </p>
                    </div>

                    {/* Partner Integrations - Responsive */}
                    <div className="flex flex-col items-start sm:items-end gap-2">
                        <span className="text-[9px] sm:text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                            Official Data & Execution
                        </span>
                        <div className="flex items-center gap-3 sm:gap-5 bg-white/5 px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/5 backdrop-blur-sm flex-wrap justify-center">
                            <div className="relative h-3 sm:h-4 w-12 sm:w-16 opacity-80 hover:opacity-100 transition-opacity">
                                <Image src="/logos/solana.png" alt="Solana" fill className="object-contain" />
                            </div>
                            <div className="h-2 sm:h-3 w-px bg-white/10" />
                            <div className="relative h-3 sm:h-4 w-12 sm:w-16 opacity-80 hover:opacity-100 transition-opacity">
                                <Image src="/logos/jupiter.png" alt="Jupiter" fill className="object-contain" />
                            </div>
                            <div className="h-2 sm:h-3 w-px bg-white/10" />
                            <div className="relative h-4 sm:h-5 w-14 sm:w-20 opacity-80 hover:opacity-100 transition-opacity">
                                <Image src="/logos/kalshi.png" alt="Kalshi" fill className="object-contain" />
                            </div>
                            <div className="h-2 sm:h-3 w-px bg-white/10" />
                            <div className="relative h-5 sm:h-6 w-12 sm:w-16 opacity-80 hover:opacity-100 transition-opacity">
                                <Image src="/logos/shipyard.png" alt="Shipyard" fill className="object-contain" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Market Stats - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
                    <div className="glass-panel p-3 md:p-4 flex items-center gap-3 md:gap-4">
                        <div className="p-1.5 md:p-2 bg-blue-500/20 rounded-lg text-blue-400"><Globe size={18} /></div>
                        <div>
                            <div className="text-[10px] md:text-xs text-gray-500 font-mono uppercase">Active Markets</div>
                            <div className="text-lg md:text-xl font-bold text-white">{KALSHI_MARKETS.length} Live Events</div>
                        </div>
                    </div>
                    <div className="glass-panel p-3 md:p-4 flex items-center gap-3 md:gap-4">
                        <div className="p-1.5 md:p-2 bg-purple-500/20 rounded-lg text-purple-400"><Clock size={18} /></div>
                        <div>
                            <div className="text-[10px] md:text-xs text-gray-500 font-mono uppercase">24h Volume</div>
                            <div className="text-lg md:text-xl font-bold text-white">$4.2M</div>
                        </div>
                    </div>
                    <div className="glass-panel p-3 md:p-4 flex items-center gap-3 md:gap-4 group cursor-pointer hover:border-cyan-500/30 transition-colors">
                        <div className="p-1.5 md:p-2 bg-cyan-500/20 rounded-lg text-cyan-400"><ArrowRight size={18} /></div>
                        <div>
                            <div className="text-[10px] md:text-xs text-cyan-400 font-mono uppercase">New Requests</div>
                            <div className="text-sm md:text-base font-bold text-white group-hover:text-cyan-400 transition-colors">Propose New Market</div>
                        </div>
                    </div>
                </div>

                {/* Markets Grid - Responsive */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                >
                    {KALSHI_MARKETS.map((market, index) => (
                        <div key={market.ticker} className="hover:scale-[1.01] transition-transform duration-300">
                            <MarketPredictionCard market={market} />
                        </div>
                    ))}
                </motion.div>

                <div className="mt-8 md:mt-12 text-center">
                    <p className="text-[10px] md:text-xs text-gray-600 font-mono">
                        Data provided by Kalshi API v2. Execution via DFlow/Jupiter.
                    </p>
                </div>
            </div>
        </div>
    );
}

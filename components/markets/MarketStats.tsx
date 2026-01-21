'use client';

import { useMarketData } from '@/hooks/useMarketData';
import { ArrowRight } from 'lucide-react';

export default function MarketStats() {
    const { markets } = useMarketData();

    // Parse volume "$1.2M" -> 1.2
    const getVol = (v: string) => parseFloat(v.replace(/[$M,]/g, '')) || 0;

    const topVolume = [...markets].sort((a: any, b: any) =>
        getVol(b.volume) - getVol(a.volume)
    ).slice(0, 5);

    return (
        <div className="space-y-6 sticky top-24">
            {/* Top Volume Widget */}
            <div className="glass-panel p-5">
                <h3 className="text-sm font-bold text-gray-400 tracking-widest mb-4 border-b border-white/5 pb-2">
                    HIGHEST VOLUME
                </h3>
                <div className="space-y-3">
                    {topVolume.map((m, i) => (
                        <div key={m.id} className="flex justify-between items-center group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-600 font-mono text-xs">0{i + 1}</span>
                                <span className="text-sm font-bold group-hover:text-cyan-400 transition-colors truncate max-w-[120px]">
                                    {m.ticker}
                                </span>
                            </div>
                            <span className="text-xs font-mono text-gray-300 bg-white/5 px-2 py-0.5 rounded">
                                {m.volume}
                            </span>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 py-2 text-xs font-bold text-center text-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors flex justify-center items-center gap-1">
                    VIEW LEADERBOARD <ArrowRight size={12} />
                </button>
            </div>

            {/* Neural Insight Widget */}
            <div className="glass-panel p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-full" />

                <h3 className="text-sm font-bold text-gray-400 tracking-widest mb-2">
                    NEURAL INSIGHT
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-3">
                    Market overflow detected in <span className="text-orange-400">Crypto Sector</span>.
                    Arbitrage opportunities identified on 3 distinct protocols.
                </p>
                <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse" />
            </div>
        </div>
    );
}

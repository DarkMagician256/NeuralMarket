'use client';

import { Market } from '@/lib/mockData';
import { ArrowLeft, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

export default function MarketHeader({ market }: { market: Market }) {
    const isPositive = market.change24h >= 0;

    return (
        <div className="glass-panel p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden">
            <div className="w-full md:w-auto">
                <Link href="/markets" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-3 text-[10px] md:text-sm font-mono tracking-wider">
                    <ArrowLeft size={14} /> BACK TO DISCOVERY
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 overflow-hidden">
                    <h1 className="text-lg sm:text-xl md:text-3xl font-black tracking-tight break-all leading-tight">
                        {market.ticker}
                    </h1>
                    <div className="flex">
                        <span className="text-[10px] md:text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300 border border-white/5 whitespace-nowrap">
                            {market.category}
                        </span>
                    </div>
                </div>
                <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed">
                    {market.title}
                </p>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 md:gap-8 w-full md:w-auto border-t border-white/5 pt-4 md:pt-0 md:border-0">
                <div className="text-left md:text-right">
                    <div className="text-[10px] md:text-xs text-gray-500 font-mono tracking-widest uppercase mb-1">Current Price</div>
                    <div className="text-xl md:text-3xl font-mono font-bold text-white tabular-nums leading-none">
                        ${(market.probability / 100).toFixed(2)} USDC
                    </div>
                </div>

                <div className="text-left md:text-right">
                    <div className="text-[10px] md:text-xs text-gray-500 font-mono tracking-widest uppercase mb-1">24h Change</div>
                    <div className={`text-lg md:text-xl font-mono font-bold tabular-nums leading-none ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{market.change24h}%
                    </div>
                </div>

                <div className="hidden lg:block text-right">
                    <div className="text-xs text-gray-500 font-mono tracking-widest uppercase flex items-center justify-end gap-1 mb-1">
                        <Activity size={12} /> Volatility
                    </div>
                    <div className="text-xl font-mono font-bold text-yellow-500 tabular-nums leading-none">
                        MED
                    </div>
                </div>
            </div>
        </div>
    );
}

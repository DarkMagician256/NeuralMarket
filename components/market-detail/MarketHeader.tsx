'use client';

import { Market } from '@/lib/mockData';
import { ArrowLeft, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

export default function MarketHeader({ market }: { market: Market }) {
    const isPositive = market.change24h >= 0;

    return (
        <div className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <Link href="/markets" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-2 text-sm font-mono">
                    <ArrowLeft size={14} /> BACK TO DISCOVERY
                </Link>
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black tracking-tight">{market.ticker}</h1>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300 border border-white/5">
                        {market.category}
                    </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{market.title}</p>
            </div>

            <div className="flex items-center gap-8">
                <div className="text-right">
                    <div className="text-xs text-gray-500 font-mono tracking-widest uppercase">Current Price</div>
                    <div className="text-3xl font-mono font-bold text-white tabular-nums">
                        {(market.probability / 100).toFixed(2)} SOL
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xs text-gray-500 font-mono tracking-widest uppercase">24h Change</div>
                    <div className={`text-xl font-mono font-bold tabular-nums ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{market.change24h}%
                    </div>
                </div>

                <div className="hidden lg:block text-right">
                    <div className="text-xs text-gray-500 font-mono tracking-widest uppercase flex items-center justify-end gap-1">
                        <Activity size={12} /> Volatility
                    </div>
                    <div className="text-xl font-mono font-bold text-yellow-500 tabular-nums">
                        MED
                    </div>
                </div>
            </div>
        </div>
    );
}

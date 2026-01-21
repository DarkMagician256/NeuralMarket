'use client';

import { topMovers } from '@/lib/mockData';
import { motion } from 'framer-motion';

export default function MarketTicker() {
    return (
        <div className="w-full bg-black/40 border-y border-white/5 backdrop-blur-md overflow-hidden h-10 flex items-center">
            <div className="flex gap-12 animate-scroll whitespace-nowrap px-4 font-mono text-xs tracking-widest text-gray-400">
                {/* Duplicated for infinite scroll illusion */}
                {[...topMovers, ...topMovers, ...topMovers].map((mover, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="font-bold text-white">{mover.ticker}</span>
                        <span className={mover.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                            {mover.change}
                        </span>
                        {mover.change.startsWith('+') ? '▲' : '▼'}
                    </div>
                ))}
            </div>
        </div>
    );
}

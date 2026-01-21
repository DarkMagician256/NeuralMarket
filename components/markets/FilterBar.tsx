'use client';

import { MarketCategory, marketCategories } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface FilterBarProps {
    selected: MarketCategory | 'ALL';
    onSelect: (c: MarketCategory | 'ALL') => void;
    searchQuery: string;
    onSearch: (q: string) => void;
}

export default function FilterBar({ selected, onSelect, searchQuery, onSearch }: FilterBarProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4 sticky top-20 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5 rounded-2xl md:rounded-full px-6 mb-8">

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
                <button
                    onClick={() => onSelect('ALL')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest transition-all ${selected === 'ALL' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                >
                    ALL
                </button>
                {marketCategories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => onSelect(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest transition-all ${selected === cat ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative group w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={14} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Find market protocol..."
                    className="w-full bg-black/40 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-600"
                />
            </div>
        </div>
    );
}

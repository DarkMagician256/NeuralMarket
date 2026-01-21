'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Flame, Vote } from 'lucide-react';
import ProposalCard from '@/components/governance/ProposalCard';

const mockProposals = [
    { id: 1, title: 'Will GTA VI be delayed to 2028?', category: 'CULTURE', votes: 4200, author: 'Satoshi_Nakamoto', timeLeft: '24H' },
    { id: 2, title: 'Solana to flip Ethereum by Q4 2026?', category: 'CRYPTO', votes: 3800, author: 'Anatoly_Fan', timeLeft: '3D' },
    { id: 3, title: 'US Fed cuts rates by >50bps in March 2026?', category: 'ECONOMY', votes: 1200, author: 'J_POWELL', timeLeft: '5D' },
    { id: 4, title: 'SpaceX lands Starship on Mars by 2030?', category: 'SCIENCE', votes: 850, author: 'ElonMom', timeLeft: '7D' },
    { id: 5, title: 'Taylor Swift engages Travis Kelce?', category: 'CULTURE', votes: 5000, author: 'Swiftie_DAO', timeLeft: '12H' },
    { id: 6, title: 'OpenAI releases GPT-6 in 2027?', category: 'SCIENCE', votes: 4850, author: 'Sam_A', timeLeft: '48H' },
];

export default function GovernancePage() {
    const [filter, setFilter] = useState('ALL');

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-16 md:pb-20 container mx-auto px-3 sm:px-4">

            {/* Header - Responsive */}
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end mb-8 md:mb-12 border-b border-white/10 pb-6 md:pb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter mb-1 md:mb-2 flex flex-wrap items-center gap-2 md:gap-3">
                        THE AGORA <Vote className="text-purple-500" size={24} />
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-xl">
                        Staked-weighted governance to propose new prediction markets.
                        Top voted proposals are automatically submitted to Kalshi/DFlow for listing.
                    </p>
                </div>
                <button className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-white/10 border border-white/10 hover:bg-white/20 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all group">
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" /> REQUEST NEW MARKET
                </button>
            </div>

            {/* Stats - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
                <StatsCard label="TOTAL PROPOSALS" value="142" />
                <StatsCard label="VOTES CAST (24H)" value="89,450" />
                <StatsCard label="MARKETS ENACTED" value="12" highlight />
            </div>

            {/* Filters - Responsive with horizontal scroll */}
            <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2 no-scrollbar">
                {['ALL', 'TRENDING', 'NEW', 'ENDING SOON'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] sm:text-xs font-bold font-mono tracking-wider transition-all whitespace-nowrap ${filter === f
                            ? 'bg-purple-500 text-white shadow-[0_0_15px_#a855f7]'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                            }`}
                    >
                        {f === 'TRENDING' && <Flame size={10} className="inline mr-1" />}
                        {f}
                    </button>
                ))}
            </div>

            {/* Grid - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {mockProposals.map((p, i) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <ProposalCard proposal={p} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function StatsCard({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
    return (
        <div className="glass-panel p-4 md:p-6 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-mono text-gray-500 tracking-widest">{label}</span>
            <span className={`text-xl sm:text-2xl md:text-3xl font-bold ${highlight ? 'text-green-400' : 'text-white'}`}>{value}</span>
        </div>
    )
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegistry, RegistryAgent } from '@/hooks/useRegistry';
import MarketAgentCard from '@/components/markets/MarketAgentCard';
import { AgentDetailModal } from '@/components/cortex/AgentDetailModal';
import { Loader2, Search, Trophy } from 'lucide-react';

export default function LeaderboardPage() {
    const { agents, loading } = useRegistry();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterArchetype, setFilterArchetype] = useState<string>('ALL');
    const [selectedAgent, setSelectedAgent] = useState<RegistryAgent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter Logic
    const filteredAgents = agents.filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.agentId.includes(searchQuery);
        const matchesArchetype = filterArchetype === 'ALL' || agent.archetypeName === filterArchetype;

        return matchesSearch && matchesArchetype;
    });

    const archetypes = ['ALL', 'SNIPER', 'ORACLE', 'HEDGER', 'WHALE', 'SENTINEL'];

    return (
        <div className="min-h-screen pb-16 md:pb-20 pt-24 md:pt-28 px-3 sm:px-4 md:px-8">
            <div className="container mx-auto max-w-7xl">

                {/* Header - Responsive */}
                <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-10">
                    {/* Title Row */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2"
                            >
                                <Trophy className="text-yellow-400" size={24} />
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white">
                                    GLOBAL LEADERBOARD
                                </h1>
                            </motion.div>
                            <p className="text-gray-400 font-mono text-xs sm:text-sm max-w-xl">
                                Discover the top-performing autonomous agents on the neural network.
                                Ranked by Win Rate and verified On-Chain PnL.
                            </p>
                        </div>

                        {/* Stats Summary */}
                        <div className="flex gap-4 sm:gap-6">
                            <div className="text-left sm:text-right">
                                <div className="text-[9px] sm:text-[10px] font-mono text-gray-500 uppercase">Total Agents</div>
                                <div className="text-xl sm:text-2xl font-bold font-mono text-white">{agents.length}</div>
                            </div>
                            <div className="text-left sm:text-right">
                                <div className="text-[9px] sm:text-[10px] font-mono text-gray-500 uppercase">Total Volume (TVL)</div>
                                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
                                    ◎{agents.reduce((acc, a) => acc + a.capital, 0).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters - Responsive */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 md:mb-8 sticky top-16 md:top-20 z-30 bg-black/80 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/5">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search agents by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 md:py-2.5 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-500/50 transition-colors text-white"
                        />
                    </div>

                    {/* Archetype Filters - Horizontal scroll on mobile */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {archetypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterArchetype(type)}
                                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[10px] sm:text-xs font-mono font-bold whitespace-nowrap transition-all ${filterArchetype === type
                                    ? 'bg-white text-black shadow-lg shadow-white/10'
                                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AGENT LEADERBOARD CONTENT */}
                <div className="mb-16 md:mb-20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 md:py-32 space-y-3 md:space-y-4">
                            <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 animate-spin" />
                            <div className="text-xs sm:text-sm font-mono text-gray-500 animate-pulse">
                                SYNCING WITH SOLANA BLOCKCHAIN...
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                        >
                            <AnimatePresence>
                                {filteredAgents.length > 0 ? (
                                    filteredAgents.map((agent, index) => (
                                        <MarketAgentCard
                                            key={agent.agentId}
                                            agent={agent}
                                            rank={index + 1}
                                            onClick={() => {
                                                setSelectedAgent(agent);
                                                setIsModalOpen(true);
                                            }}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full py-16 md:py-20 text-center"
                                    >
                                        <div className="inline-block p-3 md:p-4 rounded-full bg-white/5 mb-3 md:mb-4">
                                            <Search size={28} className="text-gray-600" />
                                        </div>
                                        <h3 className="text-gray-400 font-mono text-base md:text-lg">NO AGENTS FOUND</h3>
                                        <p className="text-gray-600 text-xs sm:text-sm mt-1">Try adjusting your filters</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Agent Detail Modal */}
            <AgentDetailModal
                agent={selectedAgent}
                // Calculate rank based on current sorted list or original list 
                // Using agents indexOf + 1 assuming agents is sorted by rank
                rank={selectedAgent ? agents.indexOf(selectedAgent) + 1 : undefined}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

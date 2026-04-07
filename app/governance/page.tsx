'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Flame, Vote, Loader2, Wallet } from 'lucide-react';
import ProposalCard from '@/components/governance/ProposalCard';
import { useGovernance } from '@/hooks/useGovernance';
import { useWallet } from '@solana/wallet-adapter-react';
import AccessDeniedModal from '@/components/ui/AccessDeniedModal';

export default function GovernancePage() {
    const { proposals, loading, vote } = useGovernance();
    const { publicKey } = useWallet();
    const [filter, setFilter] = useState('ALL');
    const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false);

    // Filter Logic
    const filteredProposals = proposals.filter(p => {
        if (filter === 'ALL') return true;
        if (filter === 'TRENDING') return p.votes > 3000;
        if (filter === 'NEW') return true; // Could filter by created_at
        if (filter === 'ENDING SOON') return ['12H', '24H', '48H'].includes(p.time_left);
        return true;
    });

    // Stats calculations
    const totalVotes = proposals.reduce((acc, p) => acc + p.votes, 0);
    const topProposal = proposals.reduce((max, p) => p.votes > max.votes ? p : max, proposals[0]);

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-16 md:pb-20 container mx-auto px-3 sm:px-4">

            {/* Header - Responsive */}
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end mb-8 md:mb-12 border-b border-white/10 pb-6 md:pb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter mb-1 md:mb-2 flex flex-wrap items-center gap-2 md:gap-3">
                        THE AGORA <Vote className="text-purple-500" size={24} />
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-xl">
                        Stake-weighted governance facilitated by the <strong className="text-purple-400">Neural Council</strong>.
                        Top-voted proposals are automatically submitted to Kalshi/DFlow for listing via decentralized pipelines.
                    </p>
                    {!publicKey && (
                        <div className="mt-3 flex items-center gap-2 text-yellow-500/80 text-xs bg-yellow-500/10 border border-yellow-500/20 px-3 py-2 rounded-lg">
                            <Wallet size={14} />
                            Connect wallet to vote on proposals
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setIsRestrictedModalOpen(true)}
                    className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-white/10 border border-white/10 hover:bg-white/20 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all group"
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" /> REQUEST NEW MARKET
                </button>
            </div>

            {/* Stats - Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
                <StatsCard label="TOTAL PROPOSALS" value={proposals.length.toString()} />
                <StatsCard label="VOTES CAST (TOTAL)" value={totalVotes.toLocaleString()} />
                <StatsCard label="TOP PROPOSAL VOTES" value={topProposal?.votes.toLocaleString() || '0'} highlight />
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

            {/* Loading State */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <div className="text-sm font-mono text-gray-500">LOADING PROPOSALS...</div>
                </div>
            ) : (
                /* Grid - Responsive */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredProposals.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <ProposalCard
                                proposal={p}
                                onVote={() => vote(p.id)}
                                canVote={!!publicKey}
                            />
                        </motion.div>
                    ))}
                </div>
            )}

            <AccessDeniedModal
                isOpen={isRestrictedModalOpen}
                onClose={() => setIsRestrictedModalOpen(false)}
                title="COUNCIL ACCESS ONLY"
                message="Submitting new governance proposals requires a Neural Council Membership NFT and active reputation stake. Please go to DAO Dashboard to qualify."
            />
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

'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, MessageSquare, Clock } from 'lucide-react';

interface Proposal {
    id: number;
    title: string;
    category: string;
    votes: number; // Token weighted
    author: string;
    timeLeft: string;
}

export default function ProposalCard({ proposal }: { proposal: Proposal }) {
    const percentComplete = Math.min(100, (proposal.votes / 5000) * 100); // Assume 5000 is threshold

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-panel p-6 relative overflow-hidden group"
        >
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded bg-cyan-900/10">
                    {proposal.category}
                </span>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Clock size={12} /> {proposal.timeLeft}
                </div>
            </div>

            <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-glow transition-all">{proposal.title}</h3>

            <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-700 to-gray-900" />
                by {proposal.author}
            </div>

            {/* Progress Bar */}
            <div className="mb-2 flex justify-between text-xs font-mono">
                <span className="text-gray-400">{proposal.votes.toLocaleString()} VP</span>
                <span className="text-gray-500">Threshold: 5,000</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentComplete}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_10px_#06b6d4]"
                />
            </div>

            <div className="flex gap-4">
                <button className="flex-1 py-2 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 rounded-lg flex items-center justify-center gap-2 transition-all font-bold text-sm">
                    <ThumbsUp size={16} /> VOTE
                </button>
                <button className="px-4 py-2 bg-transparent hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all flex items-center gap-2 text-gray-400 hover:text-white">
                    <MessageSquare size={16} />
                </button>
            </div>
        </motion.div>
    );
}

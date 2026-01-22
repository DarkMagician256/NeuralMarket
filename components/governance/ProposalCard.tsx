'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MessageSquare, Clock, Check, Loader2 } from 'lucide-react';
import type { Proposal } from '@/hooks/useGovernance';

interface ProposalCardProps {
    proposal: Proposal;
    onVote: () => Promise<{ success: boolean; error?: string }>;
    canVote: boolean;
}

export default function ProposalCard({ proposal, onVote, canVote }: ProposalCardProps) {
    const [isVoting, setIsVoting] = useState(false);
    const [voteError, setVoteError] = useState<string | null>(null);
    const [localVotes, setLocalVotes] = useState(proposal.votes);
    const [hasVoted, setHasVoted] = useState(proposal.hasVoted || false);

    const handleVote = async () => {
        if (hasVoted || !canVote || isVoting) return;

        setIsVoting(true);
        setVoteError(null);

        const result = await onVote();

        if (result.success) {
            setHasVoted(true);
            setLocalVotes(prev => prev + 100);
        } else {
            setVoteError(result.error || 'Vote failed');
            // Clear error after 3 seconds
            setTimeout(() => setVoteError(null), 3000);
        }

        setIsVoting(false);
    };

    const percentComplete = Math.min(100, (localVotes / 5000) * 100);

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
                    <Clock size={12} /> {proposal.time_left}
                </div>
            </div>

            <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-glow transition-all">{proposal.title}</h3>

            <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-700 to-gray-900" />
                by {proposal.author}
            </div>

            {/* Progress Bar */}
            <div className="mb-2 flex justify-between text-xs font-mono">
                <span className="text-gray-400">{localVotes.toLocaleString()} VP</span>
                <span className="text-gray-500">Threshold: 5,000</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentComplete}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_10px_#06b6d4]"
                />
            </div>

            {/* Error message */}
            {voteError && (
                <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded">
                    {voteError}
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={handleVote}
                    disabled={hasVoted || !canVote || isVoting}
                    className={`flex-1 py-2 border rounded-lg flex items-center justify-center gap-2 transition-all font-bold text-sm ${hasVoted
                            ? 'bg-green-500/20 border-green-500 text-green-500 cursor-default'
                            : !canVote
                                ? 'bg-white/5 border-white/10 text-gray-600 cursor-not-allowed'
                                : 'bg-white/5 hover:bg-cyan-500/20 border-white/10 hover:border-cyan-500/50 cursor-pointer'
                        }`}
                >
                    {isVoting ? (
                        <>
                            <Loader2 size={16} className="animate-spin" /> VOTING...
                        </>
                    ) : hasVoted ? (
                        <>
                            <Check size={16} /> VOTED
                        </>
                    ) : (
                        <>
                            <ThumbsUp size={16} /> VOTE
                        </>
                    )}
                </button>
                <button className="px-4 py-2 bg-transparent hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all flex items-center gap-2 text-gray-400 hover:text-white">
                    <MessageSquare size={16} />
                </button>
            </div>
        </motion.div>
    );
}

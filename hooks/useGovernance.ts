'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useWallet } from '@solana/wallet-adapter-react';

export interface Proposal {
    id: number;
    title: string;
    category: string;
    author: string;
    votes: number;
    time_left: string;
    created_at: string;
    hasVoted?: boolean;
}

export function useGovernance() {
    const { publicKey } = useWallet();
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProposals = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch all proposals
            const { data: proposalsData, error: proposalsError } = await supabase
                .from('proposals')
                .select('*')
                .order('votes', { ascending: false });

            if (proposalsError) throw proposalsError;

            let proposalsWithVoteStatus = proposalsData || [];

            // If wallet connected, check which proposals user has voted on
            if (publicKey) {
                const walletAddress = publicKey.toBase58();
                const { data: votesData } = await supabase
                    .from('proposal_votes')
                    .select('proposal_id')
                    .eq('wallet_address', walletAddress);

                const votedProposalIds = new Set(votesData?.map(v => v.proposal_id) || []);

                proposalsWithVoteStatus = proposalsData?.map(p => ({
                    ...p,
                    hasVoted: votedProposalIds.has(p.id)
                })) || [];
            }

            setProposals(proposalsWithVoteStatus);
        } catch (e: any) {
            console.error('Failed to fetch proposals:', e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [publicKey]);

    const vote = useCallback(async (proposalId: number): Promise<{ success: boolean; error?: string }> => {
        if (!publicKey) {
            return { success: false, error: 'Connect wallet to vote' };
        }

        const walletAddress = publicKey.toBase58();

        try {
            // Check if already voted
            const { data: existingVote } = await supabase
                .from('proposal_votes')
                .select('id')
                .eq('proposal_id', proposalId)
                .eq('wallet_address', walletAddress)
                .single();

            if (existingVote) {
                return { success: false, error: 'Already voted on this proposal' };
            }

            // Record the vote
            const { error: voteError } = await supabase
                .from('proposal_votes')
                .insert({
                    proposal_id: proposalId,
                    wallet_address: walletAddress
                });

            if (voteError) throw voteError;

            // Increment vote count on proposal
            const { error: updateError } = await supabase
                .from('proposals')
                .update({ votes: proposals.find(p => p.id === proposalId)!.votes + 100 })
                .eq('id', proposalId);

            if (updateError) throw updateError;

            // Update local state
            setProposals(prev => prev.map(p =>
                p.id === proposalId
                    ? { ...p, votes: p.votes + 100, hasVoted: true }
                    : p
            ));

            return { success: true };
        } catch (e: any) {
            console.error('Vote failed:', e);
            return { success: false, error: e.message };
        }
    }, [publicKey, proposals]);

    useEffect(() => {
        fetchProposals();

        // Real-time subscription for vote updates
        const channel = supabase
            .channel('governance-votes')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'proposals' },
                (payload) => {
                    setProposals(prev => prev.map(p =>
                        p.id === payload.new.id
                            ? { ...p, votes: payload.new.votes }
                            : p
                    ));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchProposals]);

    return { proposals, loading, error, vote, refresh: fetchProposals };
}

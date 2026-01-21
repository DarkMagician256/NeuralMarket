"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface AgentThought {
    id: string;
    agent_id: string;
    thought_content: string;
    thought_type: 'ANALYSIS' | 'DECISION' | 'EXECUTION' | 'ERROR' | 'SOCIAL' | 'TRADE_COMPLETE';
    metadata: any;
    created_at: string;
}

export const useAgentStream = (initialThoughts: AgentThought[] = []) => {
    const [thoughts, setThoughts] = useState<AgentThought[]>(initialThoughts);

    useEffect(() => {
        // 1. Fetch recent history (Snapshot)
        const fetchHistory = async () => {
            const { data } = await supabase
                .from('agent_thoughts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (data) {
                setThoughts(data as AgentThought[]);
            }
        };

        fetchHistory();

        // 2. Subscribe to real-time updates
        const channel = supabase
            .channel('agent_thoughts_realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'agent_thoughts',
                },
                (payload) => {
                    const newThought = payload.new as AgentThought;
                    setThoughts((prev) => [newThought, ...prev].slice(0, 7));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { thoughts };
};

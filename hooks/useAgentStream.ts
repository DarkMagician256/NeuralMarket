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
            console.log("⚡ [HOOK] Fetching agent history...");
            const { data, error } = await supabase
                .from('agent_thoughts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) {
                console.error("❌ [HOOK] Error fetching history:", error.message || error);
            }

            if (data) {
                console.log("✅ [HOOK] History loaded:", data.length, "items");
                setThoughts(data as AgentThought[]);
            }
        };

        fetchHistory();

        // 2. Subscribe to real-time updates
        console.log("📡 [HOOK] Subscribing to Realtime channel...");
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
                    console.log("🔔 [HOOK] Realtime Event!", payload);
                    const newThought = payload.new as AgentThought;
                    setThoughts((prev) => [newThought, ...prev].slice(0, 7));
                }
            )
            .subscribe((status) => {
                console.log("📶 [HOOK] Subscription Status:", status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { thoughts };
};

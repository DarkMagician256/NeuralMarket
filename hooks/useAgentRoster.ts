import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface AgentTelemetry {
    agent_id: string;
    last_heartbeat: string;
    status: string;
    wallet_balance: number;
    memory_usage: number;
    cpu_usage?: number;
    role?: string;
}

export const useAgentRoster = () => {
    const [agents, setAgents] = useState<AgentTelemetry[]>([]);

    useEffect(() => {
        // Fetch initial state
        const fetchInitial = async () => {
            const { data } = await supabase
                .from('system_telemetry')
                .select('*')
                .order('agent_id');

            if (data) setAgents(data as AgentTelemetry[]);
        };

        fetchInitial();

        // Subscribe to updates
        const channel = supabase
            .channel('roster_realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'system_telemetry',
                },
                (payload) => {
                    const updatedAgent = payload.new as AgentTelemetry;
                    setAgents((prev) => {
                        const index = prev.findIndex(a => a.agent_id === updatedAgent.agent_id);
                        if (index >= 0) {
                            const newAgents = [...prev];
                            newAgents[index] = updatedAgent;
                            return newAgents;
                        } else {
                            return [...prev, updatedAgent];
                        }
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { agents };
};

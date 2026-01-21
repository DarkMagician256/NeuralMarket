import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface TelemetryData {
    agent_id: string;
    last_heartbeat: string;
    status: string;
    wallet_balance: number;
    memory_usage: number;
    cpu_usage?: number;
}

export const useTelemetry = () => {
    const [data, setData] = useState<TelemetryData | null>(null);

    useEffect(() => {
        // Fetch initial state
        const fetchInitial = async () => {
            const { data: initial } = await supabase
                .from('system_telemetry')
                .select('*')
                .eq('agent_id', 'oraculo-sentient-v2')
                .single();

            if (initial) setData(initial);
        };

        fetchInitial();

        // Subscribe to updates
        const channel = supabase
            .channel('telemetry_realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'system_telemetry',
                },
                (payload) => {
                    setData(payload.new as TelemetryData);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { telemetry: data };
};

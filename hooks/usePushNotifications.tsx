'use client';

import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
// @ts-ignore
import { toast } from 'sonner';

// Removed manual init to use shared client

export interface AgentNotification {
    id: string;
    agentId: string;
    type: 'TRADE' | 'WHALE_ALERT' | 'ALPHA_SIGNAL' | 'EXECUTION' | 'STABILITY';
    content: string;
    timestamp: Date;
}

const notificationStyles: Record<string, { icon: string; color: string; bg: string }> = {
    'WHALE_ALERT': { icon: '🐋', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    'ALPHA': { icon: '🔮', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    'EXECUTION': { icon: '⚡', color: 'text-red-400', bg: 'bg-red-500/10' },
    'STABILITY': { icon: '⚖️', color: 'text-green-400', bg: 'bg-green-500/10' },
    'FARMING': { icon: '🌾', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    'ANALYSIS': { icon: '📊', color: 'text-blue-400', bg: 'bg-blue-500/10' },
};

export function usePushNotifications(enabled: boolean = true) {
    const showNotification = useCallback((notification: {
        agent_id: string;
        thought_type: string;
        thought_content: string;
    }) => {
        const style = notificationStyles[notification.thought_type] || notificationStyles['ANALYSIS'];

        // Check for high-priority notifications
        const isWhaleAlert = notification.thought_type === 'WHALE_ALERT' || notification.thought_content.includes('🐋');
        const isAlphaSignal = notification.thought_type === 'ALPHA' || notification.thought_content.includes('🔮');
        const isExecution = notification.thought_type === 'EXECUTION' || notification.thought_content.includes('⚡');

        if (isWhaleAlert || isAlphaSignal || isExecution) {
            toast(
                <div className="font-mono" >
                    <div className="flex items-center gap-2 mb-1" >
                        <span className={`text-lg ${style.color}`}> {style.icon} </span>
                        < span className={`text-[10px] ${style.bg} ${style.color} px-2 py-0.5 rounded uppercase`
                        }>
                            {notification.thought_type}
                        </span>
                    </div>
                    < div className="text-sm text-white leading-relaxed" >
                        {notification.thought_content}
                    </div>
                    < div className="text-[9px] text-gray-500 mt-2" >
                        Agent: {notification.agent_id}
                    </div>
                </div>,
                {
                    duration: isWhaleAlert ? 8000 : 5000,
                    className: `${style.bg} border border-white/10`,
                }
            );
        }
    }, []);

    useEffect(() => {
        if (!enabled) return;

        // Subscribe to real-time agent thoughts
        const channel = supabase
            .channel('push-notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'agent_thoughts',
                },
                (payload) => {
                    const newThought = payload.new as any;
                    showNotification(newThought);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [enabled, showNotification]);

    return { showNotification };
}

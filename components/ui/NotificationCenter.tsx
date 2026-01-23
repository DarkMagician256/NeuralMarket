'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';

import { useAgentStream, AgentThought } from '@/hooks/useAgentStream';

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const { thoughts } = useAgentStream();

    interface Notification {
        id: string;
        type: string;
        title: string;
        msg: string;
        time: string;
    }

    // Optimize parsing: only re-calculate when thoughts change
    const notifications = useMemo<Notification[]>(() => {
        return thoughts.slice(0, 20).map((t) => {
            let message = t.thought_content;
            let type = 'AGENT';
            let formattedTitle: string = t.thought_type;

            if (t.thought_type === 'TRADE_COMPLETE') {
                type = 'SUCCESS';
                try {
                    const trade = JSON.parse(t.thought_content);
                    // Simplify message for quick reading
                    message = `${trade.type} ${trade.amount} ${trade.ticker} @ $${trade.price}`;
                    formattedTitle = "TRADE EXECUTED";
                } catch (e) {
                    message = "Trade Data Error";
                }
            } else if (t.thought_type === 'EXECUTION') {
                type = 'SUCCESS';
            } else if (t.thought_type === 'ERROR') {
                type = 'WARNING';
            }

            return {
                id: t.id,
                type,
                title: formattedTitle,
                msg: message,
                time: new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            };
        });
    }, [thoughts]);

    const [mounted, setMounted] = useState(false);

    // Hydration fix for Portal: Use useEffect to ensure it only runs on client after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    const drawerContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#0A0A0A] border-l border-white/10 shadow-2xl z-[9999] p-6 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2 tracking-wider">
                                <Bell size={18} className="text-cyan-400" /> SYNAPSE LOGS
                            </h2>
                            <button onClick={() => setIsOpen(false)} className="hover:text-red-400 transition-colors p-1 bg-white/5 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map(n => (
                                    <NotificationItem key={n.id} n={n} />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-500 space-y-2 opacity-50">
                                    <BrainCircuit size={32} className="animate-pulse" />
                                    <span className="text-xs font-mono">WAITING FOR NEURAL SIGNALS...</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    // Only render Portal on client
    if (!mounted) return (
        <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-full hover:bg-white/10 relative transition-colors"
            aria-label="Open Logs"
        >
            <Bell size={20} className="text-gray-400 hover:text-white" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
        </button>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 relative transition-colors"
                aria-label="Open Logs"
            >
                <Bell size={20} className="text-gray-400 hover:text-white" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
            </button>

            {createPortal(drawerContent, document.body)}
        </>
    );
}

// Extracted Component for performance
const NotificationItem = ({ n }: { n: any }) => (
    <div className={`p-3 rounded-lg border bg-white/5 relative overflow-hidden group transition-all ${n.type === 'SUCCESS' ? 'border-green-500/20 hover:border-green-500/50' :
        n.type === 'AGENT' ? 'border-purple-500/20 hover:border-purple-500/50' :
            'border-yellow-500/20 hover:border-yellow-500/50'
        }`}>
        {/* Glow Effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-r transition-opacity duration-500 ${n.type === 'SUCCESS' ? 'from-green-500 to-transparent' :
            n.type === 'AGENT' ? 'from-purple-500 to-transparent' :
                'from-yellow-500 to-transparent'
            }`} />

        <div className="flex justify-between mb-1 relative z-10 items-center">
            <div className={`flex items-center gap-2 text-[10px] font-bold tracking-wider ${n.type === 'SUCCESS' ? 'text-green-400' :
                n.type === 'AGENT' ? 'text-purple-400' :
                    'text-yellow-400'
                }`}>
                {n.type === 'SUCCESS' && <CheckCircle size={10} />}
                {n.type === 'AGENT' && <BrainCircuit size={10} />}
                {n.type === 'WARNING' && <AlertTriangle size={10} />}
                {n.title}
            </div>
            <span className="text-[9px] text-gray-600 font-mono">{n.time}</span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed relative z-10 font-mono break-words">{n.msg}</p>
    </div>
);

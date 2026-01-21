'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';

import { useAgentStream, AgentThought } from '@/hooks/useAgentStream';

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const { thoughts } = useAgentStream();

    // Map thoughts to notifications format if needed, or use directly
    // filtering for high-value alerts only
    const notifications = thoughts.slice(0, 50).map((t) => {
        let message = t.thought_content;
        let type = 'AGENT';

        if (t.thought_type === 'TRADE_COMPLETE') {
            type = 'SUCCESS';
            try {
                const trade = JSON.parse(t.thought_content);
                const colorClass = trade.type === 'BUY' ? 'text-green-400' : 'text-red-400';
                // Create a rich message element or just a formatted string. 
                // Since 'msg' is rendered inside a <p>, string is safer for now unless we change rendering.
                message = `${trade.type} ${trade.amount} of ${trade.ticker} @ $${trade.price}`;
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
            title: t.thought_type,
            msg: message,
            time: new Date(t.created_at).toLocaleTimeString()
        };
    });

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-full hover:bg-white/10 relative transition-colors"
            >
                <Bell size={20} className="text-gray-400 hover:text-white" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#0A0A0A] border-l border-white/10 shadow-2xl z-[70] p-6 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Bell size={20} /> SYNAPSE LOGS
                                </h2>
                                <button onClick={() => setIsOpen(false)} className="hover:text-red-400 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4">
                                {notifications.map(n => (
                                    <div key={n.id} className={`p-4 rounded-lg border bg-white/5 relative overflow-hidden group ${n.type === 'SUCCESS' ? 'border-green-500/30 hover:border-green-500/60' :
                                        n.type === 'AGENT' ? 'border-purple-500/30 hover:border-purple-500/60' :
                                            'border-yellow-500/30 hover:border-yellow-500/60'
                                        }`}>
                                        {/* Glow Effect */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r transition-opacity ${n.type === 'SUCCESS' ? 'from-green-500 to-transparent' :
                                            n.type === 'AGENT' ? 'from-purple-500 to-transparent' :
                                                'from-yellow-500 to-transparent'
                                            }`} />

                                        <div className="flex justify-between mb-1 relative z-10">
                                            <div className={`flex items-center gap-2 text-xs font-bold ${n.type === 'SUCCESS' ? 'text-green-400' :
                                                n.type === 'AGENT' ? 'text-purple-400' :
                                                    'text-yellow-400'
                                                }`}>
                                                {n.type === 'SUCCESS' && <CheckCircle size={12} />}
                                                {n.type === 'AGENT' && <BrainCircuit size={12} />}
                                                {n.type === 'WARNING' && <AlertTriangle size={12} />}
                                                {n.title}
                                            </div>
                                            <span className="text-[10px] text-gray-500">{n.time}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed relative z-10">{n.msg}</p>
                                    </div>
                                ))}
                            </div>


                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

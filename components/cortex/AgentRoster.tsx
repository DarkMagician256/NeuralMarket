'use client';

import { useAgentRoster } from '@/hooks/useAgentRoster';
import { motion } from 'framer-motion';
import { Bot, Zap, Clock, Activity } from 'lucide-react';

export default function AgentRoster() {
    const { agents } = useAgentRoster();

    // Sort agents to keep order stable
    const sortedAgents = [...agents].sort((a, b) => a.agent_id.localeCompare(b.agent_id));

    return (
        <div className="glass-panel p-5 h-full overflow-hidden flex flex-col">
            <h3 className="text-gray-400 font-mono text-xs tracking-widest mb-4 flex items-center gap-2">
                <Bot size={14} /> ACTIVE NODES (SWARM)
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar lg:max-h-full">
                {sortedAgents.map(agent => (
                    <motion.div
                        key={agent.agent_id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 5 }}
                        className={`p-4 rounded border-l-4 bg-white/5 hover:bg-white/10 transition-all cursor-pointer group shadow-lg ${agent.role === 'MACRO' ? 'border-blue-500' :
                            agent.role === 'CRYPTO' ? 'border-purple-500' :
                                agent.role === 'ARBITRAGE' ? 'border-green-500' : 'border-yellow-500'
                            }`}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-mono text-sm font-black text-gray-200 group-hover:text-white uppercase tracking-tighter">{agent.agent_id}</span>
                            <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] ${agent.status === 'EXECUTING' ? 'bg-green-500 animate-pulse' :
                                agent.status === 'SCANNING' ? 'bg-cyan-500 animate-pulse' : 'bg-gray-600'
                                }`} />
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-[10px] text-gray-500 font-mono">
                            <div className="flex flex-col">
                                <span className="opacity-40 mb-1">STATUS</span>
                                <span className={agent.status === 'EXECUTING' ? 'text-green-400 font-bold' : 'text-gray-300'}>{agent.status}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="opacity-40 mb-1">CONF</span>
                                <span className="text-gray-300 font-bold">
                                    {agent.status === 'EXECUTING' ? (90 + Math.floor((agent.wallet_balance % 1) * 9)) : (60 + Math.floor((agent.wallet_balance % 1) * 30))}%
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="opacity-40 mb-1">7D PNL</span>
                                <span className={`font-bold ${(agent.wallet_balance - 100) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {(agent.wallet_balance - 100) > 0 ? '+' : ''}{(agent.wallet_balance - 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {sortedAgents.length === 0 && (
                    <div className="text-center text-gray-500 mt-10 animate-pulse">CONNECTING TO HIVE...</div>
                )}
            </div>
        </div>
    );
}

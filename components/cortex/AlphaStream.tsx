'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStream, AgentThought } from '@/hooks/useAgentStream';
import { useLanguage } from '@/context/LanguageContext';

export default function AlphaStream({ armed }: { armed: boolean }) {
    const { t } = useLanguage();
    const { thoughts } = useAgentStream();
    
    const getLogStyle = (type: string) => {
        switch (type) {
            case 'EXECUTION':
            case 'DECISION':
                return 'text-green-400 font-bold bg-green-400/10 px-1 rounded';
            case 'ERROR':
                return 'text-red-400 font-bold';
            case 'ANALYSIS':
                return 'text-cyan-400';
            case 'SOCIAL':
                return 'text-purple-400';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className="glass-panel p-5 h-full flex flex-col overflow-hidden font-mono text-xs">
            <h3 className="text-gray-400 font-mono text-xs tracking-widest mb-4 border-b border-white/5 pb-2 flex justify-between items-center uppercase">
                <span>ALPHA STREAM v2.0</span>
                {armed && <span className="text-[10px] text-green-500 animate-pulse">● {t('live')}</span>}
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {thoughts.map((log: AgentThought) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-3 border-b border-white/5 pb-2 items-start"
                        >
                            <span className="text-gray-600 w-16 shrink-0">
                                {new Date(log.created_at).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            <span className={`w-14 text-center text-[10px] shrink-0 self-start mt-0.5 ${getLogStyle(log.thought_type)}`}>
                                {log.thought_type.substring(0, 4)}
                            </span>
                            <span className="text-gray-300 flex-1 wrap-break-word leading-tight">
                                {log.thought_content.split(/(Signature: [A-Za-z0-9]+)/g).map((part, i) => {
                                    if (part.startsWith('Signature: ')) {
                                        const sig = part.replace('Signature: ', '').trim();
                                        return (
                                            <a
                                                key={i}
                                                href={`https://explorer.solana.com/tx/${sig}?cluster=devnet`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 underline decoration-dotted ml-1"
                                            >
                                                {sig.substring(0, 8)}...
                                            </a>
                                        );
                                    }
                                    return <span key={i}>{part}</span>;
                                })}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {!armed && <div className="text-center text-gray-600 mt-10 uppercase">{t('system_initializing')}</div>}
                {armed && thoughts.length === 0 && <div className="text-center text-gray-600 mt-10 uppercase">{t('waiting_feed')}</div>}
            </div>
        </div>
    );
}

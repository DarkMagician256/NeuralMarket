'use client';

import { useState } from 'react';
import { useMyAgents, OnChainAgent } from '@/hooks/useMyAgents';
import { useAgentActions } from '@/hooks/useAgentActions';
import { useAgentHistory } from '@/hooks/useAgentHistory';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Zap, Shield, Brain, ExternalLink, Loader2, Plus, Power, TrendingUp, X, Play, Pause, Waves, Scale, Clock, History, Activity as ChartIcon, Activity } from 'lucide-react';
import Link from 'next/link';
// @ts-ignore
import { toast } from 'sonner';
import PerformanceChart from './PerformanceChart';
import TradeExecutionModal from '@/components/cortex/TradeExecutionModal';
import StakingModal from '@/components/cortex/StakingModal';
import { useLanguage } from '@/context/LanguageContext';

const archetypeStyles: Record<string, { color: string; border: string; icon: any; bg: string }> = {
    'SNIPER': { color: 'text-red-400', border: 'border-red-500', icon: Zap, bg: 'bg-red-500/10' },
    'ORACLE': { color: 'text-purple-400', border: 'border-purple-500', icon: Brain, bg: 'bg-purple-500/10' },
    'HEDGER': { color: 'text-green-400', border: 'border-green-500', icon: Scale, bg: 'bg-green-500/10' },
    'WHALE': { color: 'text-cyan-400', border: 'border-cyan-500', icon: Waves, bg: 'bg-cyan-500/10' },
    'SENTINEL': { color: 'text-blue-400', border: 'border-blue-500', icon: Shield, bg: 'bg-blue-500/10' },
    'UNKNOWN': { color: 'text-gray-400', border: 'border-gray-500', icon: Bot, bg: 'bg-gray-500/10' },
};

function AgentHistoryList({ pda }: { pda: string }) {
    const { t } = useLanguage();
    const { history, loading } = useAgentHistory(pda);

    if (loading) return <div className="text-[10px] text-gray-500 animate-pulse py-2 font-mono uppercase">{t('fetching_logs')}</div>;
    if (history.length === 0) return <div className="text-[10px] text-gray-600 py-2 font-mono uppercase">{t('no_recent_activity')}</div>;

    return (
        <div className="space-y-1 mt-2 max-h-32 overflow-y-auto pr-1 flex flex-col gap-1">
            {history.map((sig, i) => (
                <div key={sig.signature} className="flex justify-between items-center text-[9px] font-mono bg-black/40 p-1.5 rounded border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex flex-col">
                        <span className="text-gray-400">TX: {sig.signature.slice(0, 8)}...</span>
                        <span className="text-[8px] opacity-30">{sig.blockTime ? new Date(sig.blockTime * 1000).toLocaleTimeString() : t('connecting') + '...'}</span>
                    </div>
                    <a
                        href={`https://explorer.solana.com/tx/${sig.signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400/60 hover:text-cyan-400"
                    >
                        <ExternalLink size={10} />
                    </a>
                </div>
            ))}
        </div>
    );
}

export default function MyAgentsPanel() {
    const { t } = useLanguage();
    const { agents, loading, error, refresh } = useMyAgents();
    const { deactivateAgent, reactivateAgent, recordTrade, isConnected } = useAgentActions();
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<Record<string, 'stats' | 'history' | 'chart'>>({});

    // NEW: Selected Agent for Trading
    const [selectedAgentForTrade, setSelectedAgentForTrade] = useState<OnChainAgent | null>(null);
    const [selectedAgentForStaking, setSelectedAgentForStaking] = useState<OnChainAgent | null>(null);

    const toggleView = (agentId: string, mode: 'stats' | 'history' | 'chart') => {
        setViewMode(prev => ({
            ...prev,
            [agentId]: prev[agentId] === mode ? 'stats' : mode
        }));
    };

    const handleDeactivate = async (agent: OnChainAgent) => {
        if (actionLoading) return;

        const confirmed = window.confirm(t('confirm_deactivate').replace('{name}', agent.name));
        if (!confirmed) return;

        setActionLoading(agent.agentId);
        const toastId = toast.loading(t('deactivating'));

        try {
            const result = await deactivateAgent(agent.agentId);
            toast.dismiss(toastId);

            if (result.success) {
                toast.success(
                    <div>
                        <div>{t('agent_deactivated')} ⏸️</div>
                        <a
                            href={`https://explorer.solana.com/tx/${result.txHash}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 underline text-xs"
                        >
                            {t('view_tx')} →
                        </a>
                    </div>
                );
                refresh();
            } else {
                toast.error(`${t('error')}: ${result.error}`);
            }
        } catch (error: any) {
            toast.dismiss(toastId);
            toast.error(`${t('error')}: ${error.message}`);
        }

        setActionLoading(null);
    };

    const openStakingModal = (agent: OnChainAgent) => {
        if (!isConnected) {
            toast.error(t('connect_wallet_action'));
            return;
        }
        setSelectedAgentForStaking(agent);
    };

    // Modified to open Modal instead of immediate simulation
    const openTradeModal = (agent: OnChainAgent) => {
        if (!isConnected) {
            toast.error(t('connect_wallet_action'));
            return;
        }
        setSelectedAgentForTrade(agent);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
            <span className="ml-2 text-gray-400 text-sm font-mono uppercase">{t('syncing')}</span>
        </div>
    );

    if (error) return (
        <div className="text-center text-red-400 text-sm font-mono p-4 uppercase">
            {t('error')}: {error}
        </div>
    );

    if (agents.length === 0) return (
        <div className="text-center py-10">
            <Bot size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-500 text-sm font-mono mb-4 uppercase">{t('no_agents_deployed')}</p>
            <Link
                href="/agents/create"
                className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-4 py-2 rounded transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] uppercase"
            >
                <Zap size={16} /> {t('create_first')}
            </Link>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-700">
            {/* Modal Injection */}
            {selectedAgentForTrade && (
                <TradeExecutionModal
                    isOpen={!!selectedAgentForTrade}
                    onClose={() => setSelectedAgentForTrade(null)}
                    agent={selectedAgentForTrade}
                    onSuccess={() => {
                        refresh(); // Refresh agents list to update stats (if needed)
                    }}
                />
            )}

            {/* Staking Modal Injection */}
            {selectedAgentForStaking && (
                <StakingModal
                    isOpen={!!selectedAgentForStaking}
                    onClose={() => setSelectedAgentForStaking(null)}
                    agent={selectedAgentForStaking}
                    onSuccess={() => { refresh(); }}
                />
            )}

            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-xl font-bold tracking-tighter flex items-center gap-2 uppercase">
                        <Brain className="text-cyan-400" />
                        {t('my_agents')}
                    </h2>
                    <p className="text-gray-500 font-mono text-xs mt-1 uppercase">
                        {t('manage_swarms')}
                    </p>
                </div>
                <Link href="/agents/create">
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono transition-all flex items-center gap-2 uppercase">
                        + {t('deploy_agent')}
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent, index) => {
                    const style = archetypeStyles[agent.archetypeName] || archetypeStyles['UNKNOWN'];
                    const Icon = style.icon;
                    const winRate = agent.totalTrades > 0
                        ? ((agent.profitableTrades / agent.totalTrades) * 100).toFixed(1)
                        : '0.0';
                    const isLoading = actionLoading === agent.agentId;
                    const currentView = viewMode[agent.agentId] || 'stats';

                    return (
                        <motion.div
                            key={agent.pubkey}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 rounded-lg border-l-4 ${style.border} ${style.bg} hover:bg-white/10 transition-all relative group flex flex-col min-h-[160px]`}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded ${style.bg}`}>
                                        <Icon size={16} className={style.color} />
                                    </div>
                                    <div>
                                        <span className="font-mono text-sm font-black text-gray-200 uppercase tracking-tighter block">
                                            {agent.name}
                                        </span>
                                        <span className={`text-[10px] font-mono ${style.color}`}>
                                            {agent.archetypeName}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => toggleView(agent.agentId, 'chart')}
                                        className={`p-1.5 rounded transition-all ${currentView === 'chart' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                                        title={t('performance')}
                                    >
                                        <ChartIcon size={12} />
                                    </button>
                                    <button
                                        onClick={() => toggleView(agent.agentId, 'history')}
                                        className={`p-1.5 rounded transition-all ${currentView === 'history' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                                        title={t('recent_onchain')}
                                    >
                                        <History size={12} />
                                    </button>
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${agent.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {agent.status === 'Active' ? t('active') : t('offline')}
                                    </span>
                                    <a
                                        href={`https://explorer.solana.com/address/${agent.pubkey}?cluster=devnet`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-cyan-400 transition-colors p-1"
                                    >
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>

                            {/* Main Context: Stats, History, or Chart */}
                            <div className="flex-1">
                                {currentView === 'stats' && (
                                    <>
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-4 gap-2 text-[10px] text-gray-500 font-mono mb-4">
                                            <div className="flex flex-col">
                                                <span className="opacity-40 mb-1 tracking-tighter text-[8px] uppercase">{t('capital')}</span>
                                                <span className="text-cyan-400 font-bold">◎{agent.capital.toFixed(2)}</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="opacity-40 mb-1 tracking-tighter text-[8px] uppercase">{t('trades')}</span>
                                                <span className="text-gray-300 font-bold">{agent.totalTrades}</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="opacity-40 mb-1 tracking-tighter text-[8px] uppercase">{t('win_rate')}</span>
                                                <span className={`font-bold ${Number(winRate) >= 50 ? 'text-green-400' : Number(winRate) > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                                    {winRate}%
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="opacity-40 mb-1 tracking-tighter text-[8px] uppercase">{t('total_pnl')}</span>
                                                <span className={`font-bold ${agent.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {agent.totalPnl >= 0 ? '+' : ''}{agent.totalPnl.toFixed(4)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Meta Stats */}
                                        <div className="flex justify-between items-center text-[8px] font-mono text-gray-600 mb-3 border-t border-white/5 pt-1 uppercase">
                                            <span>ID: {agent.agentId.slice(-8)}</span>
                                            <span>{t('risk')}: {agent.riskLevel}% | {t('leverage_short')}: {agent.leverage}x</span>
                                        </div>
                                    </>
                                )}

                                {currentView === 'history' && (
                                    <div className="animate-in fade-in slide-in-from-top-1 duration-300 border-t border-white/5 pt-2 mb-3 px-2">
                                        <div className="flex items-center gap-1 text-[9px] font-mono text-gray-400 mb-1 uppercase">
                                            <Clock size={10} /> {t('recent_onchain')}
                                        </div>
                                        <AgentHistoryList pda={agent.pubkey} />
                                    </div>
                                )}

                                {currentView === 'chart' && (
                                    <div className="animate-in fade-in slide-in-from-top-1 duration-300 border-t border-white/5 pt-2 mb-3 -mx-2 bg-black/20 pb-2">
                                        <PerformanceChart agent={agent} />
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-1.5 pt-2 border-t border-white/5">
                                {agent.status === 'Active' && (
                                    <>
                                        <button
                                            onClick={() => openTradeModal(agent)}
                                            disabled={isLoading || !isConnected}
                                            className="flex-1 flex items-center justify-center gap-1 text-[9px] font-mono bg-green-500/20 hover:bg-green-500/30 text-green-400 px-2 py-1.5 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed group border border-green-500/20 uppercase"
                                            title={t('execute_trade')}
                                        >
                                            <Activity size={10} className="group-hover:animate-pulse" />
                                            {t('trade_action')}
                                        </button>
                                        <button
                                            onClick={() => openStakingModal(agent)}
                                            disabled={isLoading || !isConnected}
                                            className="flex-1 flex items-center justify-center gap-1 text-[9px] font-mono bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 px-2 py-1.5 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-amber-500/20 uppercase"
                                            title={t('manage_liquidity')}
                                        >
                                            <TrendingUp size={10} />
                                            {t('deposit')}
                                        </button>
                                        <button
                                            onClick={() => handleDeactivate(agent)}
                                            disabled={isLoading || !isConnected}
                                            className="w-8 flex items-center justify-center text-[9px] font-mono bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/20 uppercase"
                                            title={t('stop_agent')}
                                        >
                                            {isLoading ? <Loader2 size={10} className="animate-spin" /> : <Power size={10} />}
                                        </button>
                                    </>
                                )}
                                {agent.status === 'Inactive' && (
                                    <button
                                        onClick={async () => {
                                            if (actionLoading) return;
                                            setActionLoading(agent.agentId);
                                            const toastId = toast.loading(t('reactivating'));
                                            try {
                                                const result = await reactivateAgent(agent.agentId);
                                                toast.dismiss(toastId);
                                                if (result.success) {
                                                    toast.success(
                                                        <div>
                                                            <div>{t('agent_reactivated')} ▶️</div>
                                                            <a
                                                                href={`https://explorer.solana.com/tx/${result.txHash}?cluster=devnet`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-cyan-400 underline text-xs"
                                                            >
                                                                {t('view_tx')} →
                                                            </a>
                                                        </div>
                                                    );
                                                    refresh();
                                                } else {
                                                    toast.error(`${t('error')}: ${result.error}`);
                                                }
                                            } catch (error: any) {
                                                toast.dismiss(toastId);
                                                toast.error(`${t('error')}: ${error.message}`);
                                            }
                                            setActionLoading(null);
                                        }}
                                        disabled={isLoading || !isConnected}
                                        className="flex-1 flex items-center justify-center gap-1 text-[10px] font-mono bg-green-500/20 hover:bg-green-500/40 text-green-400 px-2 py-1.5 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                                    >
                                        {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                                        {t('reactivate')}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

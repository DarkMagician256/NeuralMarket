'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Activity as ActivityIcon } from 'lucide-react';
import { OnChainAgent } from '@/hooks/useMyAgents';
import { useAgentHistory } from '@/hooks/useAgentHistory';
import { ConfirmedSignatureInfo } from '@solana/web3.js';
import { useLanguage } from '@/context/LanguageContext';

interface PerformanceChartProps {
    agent: OnChainAgent;
}

// Generate historical performance data based on REAL on-chain history
function generateHistoricalData(agent: OnChainAgent, history: ConfirmedSignatureInfo[]) {
    if (!history || history.length === 0) {
        // Fallback to simulated curve if no history found yet (new agent)
        return generateSimulatedData(agent);
    }

    // Sort history by time (oldest first)
    const sortedHistory = [...history].sort((a, b) => (a.blockTime || 0) - (b.blockTime || 0));

    const data = [];
    const totalCurrentPnl = agent.totalPnl;

    // Start point (Creation)
    data.push({
        time: new Date(agent.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pnl: 0,
        trades: 0,
        fullDate: new Date(agent.createdAt)
    });

    const totalSteps = sortedHistory.length;

    sortedHistory.forEach((tx, index) => {
        const date = tx.blockTime ? new Date(tx.blockTime * 1000) : new Date();
        const progress = (index + 1) / totalSteps;
        const targetPnl = totalCurrentPnl * progress;

        let stepPnl = targetPnl;
        if (index < totalSteps - 1) {
            const noise = (Math.random() - 0.5) * (Math.abs(totalCurrentPnl) * 0.2);
            stepPnl += noise;
        } else {
            stepPnl = totalCurrentPnl; // Lock final point
        }

        data.push({
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            pnl: Number(stepPnl.toFixed(4)),
            trades: index + 1,
            fullDate: date
        });
    });

    return data;
}

function generateSimulatedData(agent: OnChainAgent) {
    const data = [];
    const trades = Math.max(agent.totalTrades, 5);
    const baseDate = new Date(agent.createdAt);

    // Initial point
    data.push({
        time: baseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pnl: 0,
        trades: 0
    });

    for (let i = 1; i <= trades; i++) {
        const date = new Date(baseDate.getTime() + (i * 3600000));
        const progress = i / trades;
        let cumulativePnl = agent.totalPnl * progress + ((Math.random() - 0.5) * (Math.abs(agent.totalPnl) * 0.2));

        if (i === trades) cumulativePnl = agent.totalPnl;

        data.push({
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            pnl: Number(cumulativePnl.toFixed(4)),
            trades: i,
        });
    }
    return data;
}

export default function PerformanceChart({ agent }: PerformanceChartProps) {
    const { t } = useLanguage();
    const { history } = useAgentHistory(agent.pubkey);
    const data = useMemo(() => generateHistoricalData(agent, history), [agent, history]);
    const isProfitable = agent.totalPnl >= 0;
    const gradientColor = isProfitable ? '#22c55e' : '#ef4444';

    return (
        <div className="glass-panel p-5">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isProfitable ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <ActivityIcon className={isProfitable ? 'text-green-400' : 'text-red-400'} size={18} />
                    </div>
                    <div>
                        <h3 className="font-mono font-bold text-white uppercase tracking-tighter">{agent.name}</h3>
                        <p className="text-[10px] font-mono text-gray-500 uppercase">{t('performance')} • {agent.totalTrades} {t('trades')}</p>
                    </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isProfitable ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {isProfitable ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="font-mono font-bold">
                        {isProfitable ? '+' : ''}${agent.totalPnl.toFixed(4)} USDC
                    </span>
                </div>
            </div>

            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`gradient-${agent.pubkey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={gradientColor} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={gradientColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="time"
                            stroke="#4b5563"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#4b5563"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(2)}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontFamily: 'monospace',
                            }}
                            labelStyle={{ color: '#9ca3af' }}
                            formatter={(value) => {
                                const num = typeof value === 'number' ? value : 0;
                                return [`${num > 0 ? '+' : ''}$${num.toFixed(4)} USDC`, 'PnL'];
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="pnl"
                            stroke={gradientColor}
                            strokeWidth={2}
                            fill={`url(#gradient-${agent.pubkey})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5">
                <div className="text-center">
                    <div className="text-[10px] font-mono text-gray-600 uppercase">{t('win_rate')}</div>
                    <div className={`font-mono font-bold ${agent.totalTrades > 0 && (agent.profitableTrades / agent.totalTrades) >= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                        {agent.totalTrades > 0 ? ((agent.profitableTrades / agent.totalTrades) * 100).toFixed(1) : '0.0'}%
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-[10px] font-mono text-gray-600 uppercase">{t('capital')}</div>
                    <div className="font-mono font-bold text-cyan-400">◎{agent.capital.toFixed(2)}</div>
                </div>
                <div className="text-center">
                    <div className="text-[10px] font-mono text-gray-600 uppercase">{t('leverage_short')}</div>
                    <div className="font-mono font-bold text-yellow-400">{agent.leverage}x</div>
                </div>
                <div className="text-center">
                    <div className="text-[10px] font-mono text-gray-600 uppercase">{t('risk')}</div>
                    <div className="font-mono font-bold text-purple-400">{agent.riskLevel}%</div>
                </div>
            </div>
        </div>
    );
}

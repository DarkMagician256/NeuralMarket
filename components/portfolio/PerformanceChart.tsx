'use client';

import { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/lib/supabase';
import { TrendingUp, Loader2 } from 'lucide-react';

interface Trade {
    created_at: string;
    amount: number;
    outcome: string;
}

interface ChartDataPoint {
    date: string;
    value: number;
    trades: number;
}

export default function PerformanceChart() {
    const { publicKey } = useWallet();
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!publicKey) {
            setLoading(false);
            return;
        }

        const fetchTrades = async () => {
            const { data, error } = await supabase
                .from('trades')
                .select('created_at, amount, outcome')
                .eq('wallet_address', publicKey.toBase58())
                .order('created_at', { ascending: true });

            if (data && !error) {
                setTrades(data);
            }
            setLoading(false);
        };

        fetchTrades();
    }, [publicKey]);

    // Calculate cumulative PnL chart data from real trades
    const chartData = useMemo<ChartDataPoint[]>(() => {
        if (trades.length === 0) {
            // Generate placeholder data for empty state
            return Array.from({ length: 7 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                return {
                    date: date.toLocaleDateString('en-CA'),
                    value: 0,
                    trades: 0
                };
            });
        }

        // Group trades by date and calculate cumulative value
        const tradesByDate = trades.reduce((acc, trade) => {
            const date = new Date(trade.created_at).toLocaleDateString('en-CA');
            if (!acc[date]) {
                acc[date] = { totalAmount: 0, count: 0 };
            }
            // YES = profit assumption, NO = loss assumption (simplified for demo)
            const pnlMultiplier = trade.outcome === 'YES' ? 1 : -0.5;
            acc[date].totalAmount += trade.amount * pnlMultiplier;
            acc[date].count += 1;
            return acc;
        }, {} as Record<string, { totalAmount: number; count: number }>);

        // Convert to chart data with cumulative values
        let cumulative = 0;
        return Object.entries(tradesByDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, data]) => {
                cumulative += data.totalAmount;
                return {
                    date: date.slice(5), // MM-DD format
                    value: Number(cumulative.toFixed(2)),
                    trades: data.count
                };
            });
    }, [trades]);

    const totalPnL = chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
    const isPositive = totalPnL >= 0;

    if (!publicKey) {
        return (
            <div className="glass-panel p-6 h-[300px] md:h-[400px] w-full flex items-center justify-center">
                <p className="text-gray-500 font-mono text-sm">CONNECT WALLET TO VIEW PERFORMANCE</p>
            </div>
        );
    }

    return (
        <div className="glass-panel p-4 md:p-6 h-[300px] md:h-[400px] w-full relative">
            {/* Header */}
            <div className="absolute top-3 md:top-4 left-4 md:left-6 z-10 flex items-center gap-3">
                <TrendingUp className={isPositive ? 'text-green-500' : 'text-red-500'} size={18} />
                <div>
                    <h3 className="text-gray-400 text-[10px] md:text-xs font-mono uppercase">Cumulative PnL</h3>
                    <span className={`text-lg md:text-xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}${totalPnL.toFixed(2)} USDC
                    </span>
                </div>
            </div>

            {/* Trade Count Badge */}
            <div className="absolute top-3 md:top-4 right-4 md:right-6 z-10">
                <span className="text-[10px] md:text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
                    {trades.length} TRADES
                </span>
            </div>

            {loading ? (
                <div className="h-full flex items-center justify-center">
                    <Loader2 className="animate-spin text-cyan-500" size={32} />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 50, right: 10, left: 10, bottom: 10 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="date"
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(5, 5, 10, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                padding: '8px 12px'
                            }}
                            labelStyle={{ color: '#fff', fontFamily: 'monospace', fontSize: '11px' }}
                            itemStyle={{ color: isPositive ? '#22c55e' : '#ef4444' }}
                            formatter={(value) => [`$${Number(value ?? 0).toFixed(2)} USDC`, 'PnL']}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={isPositive ? "#22c55e" : "#ef4444"}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            isAnimationActive={true}
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

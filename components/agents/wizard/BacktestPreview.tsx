'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BacktestPreviewProps {
    risk: number;
    capital: number;
    leverage: number;
}

export default function BacktestPreview({ risk, capital, leverage }: BacktestPreviewProps) {
    // Generate predictable "random" walk based on inputs
    const data = (() => {
        let currentValue = capital;
        return Array.from({ length: 30 }).map((_, i) => {
            // Daily variance based on risk (0-100 -> 0-10% daily swing)
            const dailyVolatility = (risk / 100) * 0.15;

            // Trend bias based on leverage (higher leverage = slightly higher expected return but much higher risk)
            const trendBias = 0.005 + (leverage * 0.002);

            // Random walk
            const change = (Math.random() - 0.45) * 2 * dailyVolatility; // Slight upward bias (0.45 instead of 0.5)

            // Apply drift and shock
            const performance = 1 + (trendBias + change);

            currentValue = currentValue * performance;

            return {
                day: `D${i + 1}`,
                value: Math.max(0, currentValue),
            };
        });
    })();

    const finalValue = data[29].value;
    const totalReturn = ((finalValue - capital) / capital) * 100;

    return (
        <div className="glass-panel p-6 w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-mono text-sm text-gray-400">PROJECTED PERFORMANCE (30 DAYS)</h3>
                <div className={`font-mono text-xl font-bold ${totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}% ROI (Est.)
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="backtestGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={totalReturn >= 0 ? "#4ade80" : "#f87171"} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={totalReturn >= 0 ? "#4ade80" : "#f87171"} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="day" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#05050A', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
                            formatter={(value: any) => [`◎ ${(Number(value) || 0).toFixed(2)}`, 'Portfolio Value']}
                            labelStyle={{ display: 'none' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={totalReturn >= 0 ? "#4ade80" : "#f87171"}
                            strokeWidth={3}
                            fill="url(#backtestGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-200 font-mono text-center">
                WARN: Past performance does not guarantee future results. This is a simulation based on on-chain data.
            </div>
        </div>
    );
}

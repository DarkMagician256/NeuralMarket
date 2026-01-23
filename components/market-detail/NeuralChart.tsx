'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, ReferenceLine } from 'recharts';
import { generateHistory } from '@/lib/mockData';
import { useMemo } from 'react';

export default function NeuralChart({ ticker }: { ticker: string }) {
    const data = useMemo(() => generateHistory(ticker), [ticker]);

    // Determine trend color based on last price vs start
    const start = data[0].price;
    const end = data[data.length - 1].price;
    const isBullish = end >= start;
    const color = isBullish ? '#00FF94' : '#FF0055'; // Neural colors

    return (
        <div className="glass-panel p-6 h-[500px] w-full relative group">
            <div className="absolute top-4 left-6 z-10 flex gap-4 max-w-[80%] overflow-hidden">
                <h3 className="text-gray-400 text-[10px] md:text-xs font-mono tracking-widest truncate">
                    NEURAL_CHART_V2.0 // {ticker}
                </h3>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(5, 5, 10, 0.9)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            fontFamily: 'monospace'
                        }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ stroke: '#fff', strokeWidth: 1, strokeDasharray: '4 4' }}
                        labelStyle={{ display: 'none' }}
                    />

                    <ReferenceLine y={50} stroke="#333" strokeDasharray="3 3" />

                    <Area
                        type="step"
                        dataKey="price"
                        stroke={color}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#chartGradient)"
                        isAnimationActive={true}
                        filter="url(#glow)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { portfolioChartData } from '@/lib/mockData';

export default function PerformanceChart() {
    return (
        <div className="glass-panel p-6 h-[400px] w-full relative">
            <div className="absolute top-4 left-6 z-10">
                <h3 className="text-gray-400 text-xs font-mono">PERFORMANCE_OVERLAY_V1</h3>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioChartData}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(5, 5, 10, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        isAnimationActive={true}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

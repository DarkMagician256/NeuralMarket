'use client';

import { useState, useEffect } from 'react';
import { BrainCircuit } from 'lucide-react';

const mockStream = [
    "Connecting to neural subsytem...",
    "Scanning social sentiment for TICKER...",
    "Analysis: BULLISH divergence detected on 4h timeframe.",
    "Whale Alert: Wallet 8x...F2 bought 50k YES shares.",
    "Kalshi API: Volume spike +145% in last hour.",
    "Recommendation: STRONG BUY > 45¢ entry."
];

export default function CortexTerminal({ ticker }: { ticker: string }) {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        let delay = 0;
        mockStream.forEach((line, i) => {
            delay += 1500 + Math.random() * 1000;
            setTimeout(() => {
                setLines(prev => [...prev, line.replace('TICKER', ticker)]);
            }, delay);
        });
    }, [ticker]);

    return (
        <div className="glass-panel p-5 font-mono text-xs h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <BrainCircuit size={100} />
            </div>

            <div className="flex items-center gap-2 mb-4 text-cyan-400 border-b border-white/5 pb-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                <span className="font-bold tracking-widest">CORTEX LIVE INSIGHT</span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto z-10">
                {lines.map((line, i) => (
                    <div key={i} className="text-gray-300">
                        <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                        <span className="typing-effect">{line}</span>
                    </div>
                ))}
                <div className="animate-pulse text-cyan-500">_</div>
            </div>
        </div>
    );
}

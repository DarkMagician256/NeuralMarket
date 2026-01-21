'use client';

import { cortexLogs } from '@/lib/mockData';
import { BrainCircuit } from 'lucide-react';

export default function CortexMonitor() {
    return (
        <div className="glass-panel p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <BrainCircuit className="text-pink-500 animate-pulse" size={24} />
                <h3 className="font-bold tracking-wider">CORTEX ACTIVITY</h3>
            </div>

            <div className="flex-1 font-mono text-xs space-y-3 overflow-hidden">
                {cortexLogs.map((log, i) => (
                    <div key={i} className="flex gap-2 opacity-80 hover:opacity-100 transition-opacity">
                        <span className="text-gray-500">[{log.time}]</span>
                        <span className="text-cyan-300 font-bold">{log.agent}:</span>
                        <span className={log.type === 'warning' ? 'text-red-300' : log.type === 'success' ? 'text-green-300' : 'text-gray-300'}>
                            {log.message}
                        </span>
                    </div>
                ))}
                <div className="animate-pulse text-cyan-500/50">_</div>
            </div>
        </div>
    );
}

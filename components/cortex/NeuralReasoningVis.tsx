'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAgentStream } from '@/hooks/useAgentStream';

// Create a visual network of nodes
export default function NeuralReasoningVis({ armed }: { armed: boolean }) {
    const [activeLinks, setActiveLinks] = useState<{ from: number, to: number }[]>([]);
    const [nodes, setNodes] = useState<{ id: number, x: number, y: number }[]>([]);

    useEffect(() => {
        setNodes(Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100
        })));
    }, []);

    // Connect to real agent thoughts
    const { thoughts } = useAgentStream();

    // Trigger visualization on new thought
    useEffect(() => {
        if (!armed || thoughts.length === 0) return;

        // When a new thought arrives (thoughts[0] changes), activate random neural path
        const from = Math.floor(Math.random() * nodes.length);
        const to = Math.trunc(Math.random() * nodes.length);

        if (from !== to) {
            setActiveLinks(prev => [...prev.slice(-5), { from, to }]);
        }
    }, [thoughts, armed, nodes.length]);

    return (
        <div className="glass-panel relative w-full h-full min-h-[300px] overflow-hidden bg-black/40">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

            {/* Nodes */}
            {nodes.map(node => (
                <motion.div
                    key={node.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: armed ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: node.id * 0.1 }}
                    className="absolute w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_15px_#22d3ee] z-20"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                />
            ))}

            {/* Dynamic Links (SVG Overlay) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {activeLinks.map((link, i) => {
                    const start = nodes[link.from];
                    const end = nodes[link.to];
                    return (
                        <motion.line
                            key={`${link.from}-${link.to}-${i}`}
                            x1={`${start.x}%`}
                            y1={`${start.y}%`}
                            x2={`${end.x}%`}
                            y2={`${end.y}%`}
                            stroke="rgba(6,182,212,0.5)"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        />
                    );
                })}
            </svg>

            {/* Center Brain Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: armed ? 1 : 0.5 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-center"
                >
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter">
                        NEURAL<br />CORE
                    </div>
                    {armed && <div className="text-xs font-mono text-cyan-400 mt-2 bg-black/50 px-2 py-1 rounded">PROCESSING 14GB/s</div>}
                </motion.div>
            </div>
        </div>
    );
}

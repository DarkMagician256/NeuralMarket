'use client';

import { motion } from 'framer-motion';
import { Building2, BrainCircuit, Zap, Coins } from 'lucide-react';

const features = [
    {
        title: "Institutional Liquidity",
        desc: "Integrated with DFlow and Kalshi for deep order books.",
        icon: <Building2 className="text-cyan-400" size={32} />,
        gradient: "from-cyan-900/20 to-transparent"
    },
    {
        title: "Cortex Intelligence",
        desc: "AI agents analyze social sentiment and news in real-time.",
        icon: <BrainCircuit className="text-purple-400" size={32} />,
        gradient: "from-purple-900/20 to-transparent"
    },
    {
        title: "Instant Settlement",
        desc: "Solana speed. 400ms trades. Zero counterparty risk.",
        icon: <Zap className="text-yellow-400" size={32} />,
        gradient: "from-yellow-900/20 to-transparent"
    },
    {
        title: "Builder Yield",
        desc: "Earn passive yield on volume driven via your unique code.",
        icon: <Coins className="text-green-400" size={32} />,
        gradient: "from-green-900/20 to-transparent"
    }
];

export default function BentoGrid() {
    return (
        <div className="container mx-auto px-4 py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`glass-panel p-8 relative overflow-hidden group perspective-1000`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                        <div className="relative z-10">
                            <div className="mb-6 p-3 bg-white/5 rounded-2xl w-fit group-hover:bg-white/10 transition-colors">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-glow transition-all">{f.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

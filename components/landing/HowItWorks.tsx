'use client';

import { motion } from 'framer-motion';
import { Wallet, Cpu, TrendingUp, ShieldCheck } from 'lucide-react';

const steps = [
    {
        icon: <Wallet size={24} className="text-cyan-400" />,
        title: "CONNECT IDENTITY",
        desc: "Link your Solana wallet to establish your verifiable on-chain identity within the Neural Network."
    },
    {
        icon: <Cpu size={24} className="text-purple-400" />,
        title: "ACTIVATE SWARM",
        desc: "Deploy autonomous AI agents (Whale Watcher, Sniper, Sentiment) to analyze Kalshi markets 24/7."
    },
    {
        icon: <TrendingUp size={24} className="text-green-400" />,
        title: "EXECUTE & EARN",
        desc: "Agents execute trades instantly via DFlow. Track PnL on your dashboard and climb the global leaderboard."
    },
    {
        icon: <ShieldCheck size={24} className="text-yellow-400" />,
        title: "GOVERNANCE",
        desc: "Stake earnings to gain voting power in the Neural Council and propose new prediction markets."
    }
];

export default function HowItWorks() {
    return (
        <section className="py-20 md:py-32 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16 md:mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black tracking-tighter mb-4"
                    >
                        PROTOCOL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">WORKFLOW</span>
                    </motion.h2>
                    <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
                        From connection to execution, the Neural Market operates on a trustless, automated infrastructure.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            {/* Connector Line (Desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-cyan-500/20 to-transparent z-0" />
                            )}

                            {/* Connector Line (Mobile) */}
                            {index < steps.length - 1 && (
                                <div className="lg:hidden absolute left-8 top-16 h-full w-[2px] bg-gradient-to-b from-cyan-500/20 to-transparent z-0" />
                            )}

                            <div className="relative z-10 flex flex-col items-center text-center">
                                {/* Hexagon Icon Wrapper */}
                                <div className="w-16 h-16 mb-6 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-[#0a0a0f] border border-white/10 rotate-45 rounded-xl group-hover:border-cyan-500/50 group-hover:rotate-90 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]" />
                                    <div className="absolute inset-0 bg-cyan-500/5 rotate-45 rounded-xl animate-pulse" />
                                    <div className="relative z-10 transform transition-transform group-hover:scale-110">
                                        {step.icon}
                                    </div>
                                    <div className="absolute -right-2 -top-2 bg-black border border-white/20 text-[10px] font-mono w-6 h-6 flex items-center justify-center rounded-full text-gray-500">
                                        {index + 1}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold font-mono tracking-wide mb-3 group-hover:text-cyan-400 transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                    {step.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

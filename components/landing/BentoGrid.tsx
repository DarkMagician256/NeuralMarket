'use client';

import { motion } from 'framer-motion';
import { Building2, BrainCircuit, Zap, Users, ShieldCheck, LineChart } from 'lucide-react';

export default function BentoGrid() {
    return (
        <section className="container mx-auto px-4 py-16 md:py-32">
            <div className="text-center mb-12 md:mb-24">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
                    SYSTEM <span className="text-cyan-400">ARCHITECTURE</span>
                </h2>
                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[300px]">

                {/* 1. Large Feature - SWARM INTELLIGENCE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="md:col-span-2 glass-panel p-6 md:p-8 relative overflow-hidden group flex flex-col justify-end min-h-[300px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-transparent z-0 opacity-60 transition-opacity group-hover:opacity-80" />
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:scale-110 duration-700">
                        <BrainCircuit size={180} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 md:p-3 bg-purple-500/20 rounded-xl backdrop-blur-md border border-purple-500/30">
                                <BrainCircuit className="text-purple-400" size={24} />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] md:text-xs font-mono text-purple-300">CORE ENGINE</span>
                        </div>
                        <h3 className="text-2xl md:text-4xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">Neural Swarm Intelligence</h3>
                        <p className="text-gray-400 max-w-lg text-sm md:text-base leading-relaxed">
                            A decentralized network of specialized AI agents (Sniper, Whale Watcher, Macro Analyst) that form a consensus swarm to predict market outcomes with higher accuracy.
                        </p>
                    </div>
                </motion.div>

                {/* 2. Vertical Feature - SOLANA SPEED */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="md:row-span-2 glass-panel p-6 md:p-8 relative overflow-hidden group flex flex-col min-h-[350px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-green-900/30 via-black to-black z-0" />
                    <div className="absolute -right-10 -top-10 w-64 h-64 bg-green-500/20 rounded-full blur-3xl group-hover:bg-green-500/30 transition-all duration-700" />

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="p-2 md:p-3 bg-green-500/20 rounded-xl w-fit mb-6 border border-green-500/30">
                            <Zap className="text-green-400" size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Instant Execution</h3>
                        <p className="text-gray-400 text-sm mb-8 flex-grow">
                            Powered by Solana's high-throughput blockchain.
                        </p>

                        <div className="space-y-4 font-mono text-xs md:text-sm">
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-gray-500">LATENCY</span>
                                <span className="text-green-400 font-bold">~400ms</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-gray-500">TPS</span>
                                <span className="text-green-400 font-bold">65,000+</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-gray-500">COST</span>
                                <span className="text-green-400 font-bold">~$0.00025</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <div className="flex items-center gap-2 text-green-400 animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-green-400" />
                                <span className="uppercase text-xs font-bold tracking-widest">Network Active</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Standard Feature - KALSHI MARKETS */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-6 md:p-8 relative overflow-hidden group flex flex-col justify-between min-h-[250px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/30 to-black z-0" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-2 md:p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                                <Building2 className="text-cyan-400" size={24} />
                            </div>
                            <div className="px-2 py-1 bg-white/10 rounded text-[10px] uppercase font-mono tracking-wider">Oracle Data</div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2">Kalshi Integration</h3>
                        <p className="text-gray-400 text-sm">
                            Direct feed from Kalshi, the first CFTC-regulated exchange for event contracts.
                        </p>
                    </div>
                </motion.div>

                {/* 4. Standard Feature - DFLOW LIQUIDITY */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-6 md:p-8 relative overflow-hidden group flex flex-col justify-between min-h-[250px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/30 to-black z-0" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-2 md:p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                                <LineChart className="text-blue-400" size={24} />
                            </div>
                            <div className="px-2 py-1 bg-white/10 rounded text-[10px] uppercase font-mono tracking-wider">Order Flow</div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2">Deep Liquidity</h3>
                        <p className="text-gray-400 text-sm">
                            Aggregated liquidity via DFlow ensures minimal slippage for large volume trades.
                        </p>
                    </div>
                </motion.div>

                {/* 5. Horizontal Feature - GOVERNANCE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="md:col-span-2 glass-panel p-6 md:p-8 relative overflow-hidden group flex items-center opacity-70 hover:opacity-100 transition-opacity min-h-[200px]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/10 via-black to-transparent z-0" />

                    <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center w-full">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 md:p-3 bg-white/5 rounded-xl border border-white/10 grayscale">
                                    <ShieldCheck className="text-gray-400" size={24} />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-mono text-gray-400">COMING SOON</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-300">Community Governance</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                The Neural Council will vote on new market listings and protocol parameters.
                            </p>

                            <div className="flex gap-4 opacity-50">
                                <div className="text-xs text-gray-600 flex items-center font-mono">
                                    [SYSTEM_LOCKED]
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:flex justify-center opacity-30">
                            <Users size={120} className="text-gray-500" />
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

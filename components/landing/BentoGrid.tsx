'use client';

import { motion } from 'framer-motion';
import { Building2, BrainCircuit, Zap, Users, ShieldCheck, LineChart, Repeat, Terminal, Layout } from 'lucide-react';

export default function BentoGrid() {
    return (
        <section className="container mx-auto px-4 py-16 md:py-32">
            <div className="text-center mb-12 md:mb-24">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
                    SYSTEM <span className="text-cyan-400">ARCHITECTURE</span>
                </h2>
                <div className="h-1 w-24 mx-auto bg-linear-to-r from-cyan-500 to-purple-600 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[300px]">

                {/* 1. Large Feature - SWARM INTELLIGENCE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="md:col-span-2 glass-panel p-6 md:p-8 relative overflow-hidden group flex flex-col justify-end min-h-[300px]"
                >
                    <div className="absolute inset-0 bg-linear-to-br from-purple-900/40 via-black to-transparent z-0 opacity-60 transition-opacity group-hover:opacity-80" />
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:scale-110 duration-700">
                        <BrainCircuit size={180} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 md:p-3 bg-purple-500/20 rounded-xl backdrop-blur-md border border-purple-500/30">
                                <BrainCircuit className="text-purple-400" size={24} />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] md:text-xs font-mono text-purple-300">ELIZA OS • HYBRID CORE</span>
                        </div>
                        <h3 className="text-2xl md:text-4xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">Neural Swarm Intelligence</h3>
                        <p className="text-gray-400 max-w-lg text-sm md:text-base leading-relaxed">
                            A decentralized network of specialized AI agents running on <strong>ElizaOS</strong>. Powered by <strong className="text-cyan-400">DeepSeek R1</strong> & <strong>mxbai-embed</strong> for local privacy, or <strong>OpenAI</strong> for cloud scalability.
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
                    <div className="absolute inset-0 bg-linear-to-b from-green-900/30 via-black to-black z-0" />
                    <div className="absolute -right-10 -top-10 w-64 h-64 bg-green-500/20 rounded-full blur-3xl group-hover:bg-green-500/30 transition-all duration-700" />

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="p-2 md:p-3 bg-green-500/20 rounded-xl w-fit mb-6 border border-green-500/30">
                            <Zap className="text-green-400" size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Instant Execution</h3>
                        <p className="text-gray-400 text-sm mb-8 grow">
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
                    <div className="absolute inset-0 bg-linear-to-tr from-cyan-900/30 to-black z-0" />

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
                    <div className="absolute inset-0 bg-linear-to-bl from-blue-900/30 to-black z-0" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-2 md:p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                                <LineChart className="text-blue-400" size={24} />
                            </div>
                            <div className="px-2 py-1 bg-blue-500/10 rounded text-[10px] uppercase font-mono tracking-wider text-blue-400 border border-blue-500/20">DFlow Partner</div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2">DFlow Liquidity</h3>
                        <p className="text-gray-400 text-sm">
                            Aggregated liquidity via DFlow ensures minimal slippage using advanced order routing.
                        </p>
                    </div>
                </motion.div>

                {/* 5. Standard Feature - NON-CUSTODIAL VAULT */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-panel p-6 md:p-8 relative overflow-hidden group flex flex-col justify-between min-h-[250px]"
                >
                    <div className="absolute inset-0 bg-linear-to-br from-yellow-900/20 via-black to-black z-0" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-2 md:p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                                <ShieldCheck className="text-yellow-400" size={24} />
                            </div>
                            <div className="px-2 py-1 bg-yellow-500/10 rounded text-[10px] uppercase font-mono tracking-wider text-yellow-400 border border-yellow-500/20">Non-Custodial</div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2">NeuralVault</h3>
                        <p className="text-gray-400 text-sm">
                            Anchor-based USDC vault on Solana. Set BPS risk limits on-chain. 0.5% license fee auto-collected per trade.
                        </p>
                    </div>
                </motion.div>

                {/* 6. Large Feature - JUPITER SWAP */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="md:col-span-2 glass-panel p-6 md:p-8 relative overflow-hidden group flex items-center min-h-[250px]"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-orange-900/20 via-black to-green-900/20 z-0 opacity-50 group-hover:opacity-80 transition-opacity" />

                    {/* Jupiter Logo Abstract */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-black/50 to-transparent z-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
                        <Repeat size={120} className="text-orange-400 rotate-45" />
                    </div>

                    <div className="relative z-10 w-full md:w-2/3">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 md:p-3 bg-linear-to-br from-orange-500/20 to-green-500/20 rounded-xl border border-white/10">
                                <Repeat className="text-orange-400" size={24} />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] md:text-xs font-mono text-orange-300">NATIVE SWAPS</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">Jupiter Integrated</h3>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                            Seamlessly swap SOL, USDC, or BONK directly within the execution interface. Powered by Jupiter V6 API for best price routing.
                        </p>

                        <div className="flex gap-2">
                            {['SOL', 'USDC', 'BONK', 'WIF'].map(token => (
                                <div key={token} className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-gray-400">
                                    {token}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* 7. Full Width - MPP x402 PROTOCOL */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="md:col-span-3 glass-panel p-6 md:p-10 relative overflow-hidden group min-h-[200px] flex flex-col md:flex-row items-center gap-8 md:gap-16 border-white/5"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-teal-500/5 via-transparent to-blue-500/5 z-0" />

                    {/* MPP x402 Module */}
                    <div className="relative z-10 flex-1 w-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
                                <Zap size={24} className="text-teal-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white tracking-widest uppercase italic border-b border-white/10 pb-1 mb-1">MPP x402 Gateway</h4>
                                <span className="text-[9px] font-mono text-teal-500 tracking-widest uppercase bg-teal-500/10 px-2 py-0.5 rounded">LIVE · B2B M2M</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm font-mono leading-relaxed">
                            Machine-to-Machine API monetization. Each prediction call costs <strong className="text-teal-400">0.05 USDC</strong> enforced via HTTP 402 + HMAC-SHA256 Solana signature verification.
                        </p>
                    </div>

                    <div className="hidden md:block w-px h-24 bg-white/10" />

                    {/* Multi-LLM Module */}
                    <div className="relative z-10 flex-1 w-full">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <BrainCircuit size={24} className="text-purple-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white tracking-widest uppercase italic border-b border-white/10 pb-1 mb-1">Multi-LLM Orchestrator</h4>
                                <span className="text-[9px] font-mono text-purple-500 tracking-widest uppercase bg-purple-500/10 px-2 py-0.5 rounded">3-TIER · ZERO HALLUCINATIONS</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm font-mono leading-relaxed">
                            DeepSeek R1 (local) → Claude 3.5 Sonnet (structure) → OpenAI o1 (risk validation). Hard BPS limits enforced on-chain before any capital is deployed.
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

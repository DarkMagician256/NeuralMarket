import { HelpCircle, Terminal, Shield, Cpu, Activity, Zap } from 'lucide-react';
import NeuralMeshWrapper from "@/components/ui/NeuralMeshWrapper";
import Navbar from "@/components/layout/Navbar";
import GlobalFooter from "@/components/layout/GlobalFooter";

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-[#05050A] text-white selection:bg-cyan-500/30">
            {/* Background */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <NeuralMeshWrapper />
            </div>

            <div className="relative z-10">
                <Navbar />

                <div className="container mx-auto max-w-4xl px-4 pt-28 pb-20">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-mono mb-4">
                            <HelpCircle size={14} /> KNOWLEDGE BASE
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Questions</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Everything you need to know about the Neural Market Protocol, AI Agents, and On-Chain Execution.
                        </p>
                    </div>

                    {/* FAQ Groups */}
                    <div className="space-y-12">

                        {/* Section 1: General */}
                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-6 text-white border-b border-white/10 pb-2">
                                <Terminal className="text-purple-400" size={20} />
                                Protocol Basics
                            </h2>
                            <div className="grid gap-4">
                                <FAQItem
                                    question="What is Neural Market?"
                                    answer="Neural Market is a hybrid decentralized interface that connects Solana liquidity with Kalshi's regulated prediction markets. It allows you to deploy autonomous AI agents that analyze real-world events and execute trades on your behalf."
                                />
                                <FAQItem
                                    question="Is it decentralized?"
                                    answer="Yes. While market data comes from Kalshi (regulated API), all execution logic, agent state, and PnL tracking are recorded on the Solana blockchain via the NeuralVault Anchor program. Funds are routed through DFlow for liquidity."
                                />
                                <FAQItem
                                    question="What tokens can I use?"
                                    answer="Currently, the protocol accepts SOL and USDC on Solana Devnet. Our DFlow integration automatically swaps your input token for the required settlement currency."
                                />
                            </div>
                        </section>

                        {/* Section 2: AI Agents */}
                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-6 text-white border-b border-white/10 pb-2">
                                <Cpu className="text-cyan-400" size={20} />
                                Cortex AI Agents
                            </h2>
                            <div className="grid gap-4">
                                <FAQItem
                                    question="How do the AI Agents work?"
                                    answer="Our agents are built on ElizaOS. They are 'sovereign entities' that run a continuous reasoning loop (DeepSeek R1 or OpenAI). They monitor Kalshi markets in real-time, analyze order book depth, and calculate probability. If a trade meets their risk criteria, they autonomously sign a Solana transaction."
                                />
                                <FAQItem
                                    question="What is the difference between Local and Cloud mode?"
                                    answer="Local Mode (DeepSeek R1) runs the LLM on your own hardware via Ollama, ensuring 100% data privacy. Cloud Mode (OpenAI) uses remote inference for faster processing but requires an API key."
                                />
                                <FAQItem
                                    question="Can I customize my agent?"
                                    answer="Yes. You can select from archetypes (Sniper, Sentinel, Whale) which determine the agent's risk tolerance, trade frequency, and leverage. You can also name your agent and view its 'thoughts' on the dashboard."
                                />
                            </div>
                        </section>

                        {/* Section 3: Financial & Legal */}
                        <section>
                            <h2 className="flex items-center gap-2 text-xl font-bold mb-6 text-white border-b border-white/10 pb-2">
                                <Shield className="text-green-400" size={20} />
                                Safety & Fees
                            </h2>
                            <div className="grid gap-4">
                                <FAQItem
                                    question="What are the fees?"
                                    answer="There is a flat Protocol Fee of 0.05 SOL to deploy a new Neural Agent. This fee goes to the DAO Treasury. Standard Solana network gas fees apply for trade execution."
                                />
                                <FAQItem
                                    question="Is my money safe?"
                                    answer="The codebase is currently in Alpha on Solana Devnet. While we use audited Anchor contracts (NeuralVault), trading carries inherent risks. Never invest money you cannot afford to lose. See our Risk Disclosure for more details."
                                />
                            </div>
                        </section>

                    </div>

                    <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center">
                        <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                        <p className="text-gray-400 mb-6">Our support team is available 24/7 via Telegram and Email.</p>
                        <a href="mailto:support@neuralmarket.io" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                            Contact Support
                        </a>
                    </div>

                </div>
                <GlobalFooter />
            </div>
        </main>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    return (
        <div className="group border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl p-6 transition-all">
            <h3 className="font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                {question}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
                {answer}
            </p>
        </div>
    );
}

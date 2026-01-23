import { BookOpen, LifeBuoy, Zap, MessageSquare, FileText, Server } from 'lucide-react';
import NeuralMeshWrapper from "@/components/ui/NeuralMeshWrapper";
import Navbar from "@/components/layout/Navbar";
import GlobalFooter from "@/components/layout/GlobalFooter";
import Link from 'next/link';

export default function HelpCenterPage() {
    return (
        <main className="min-h-screen bg-[#05050A] text-white selection:bg-cyan-500/30">
            {/* Background */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <NeuralMeshWrapper />
            </div>

            <div className="relative z-10">
                <Navbar />

                {/* Hero Search */}
                <div className="bg-gradient-to-b from-cyan-900/10 to-transparent pt-32 pb-20 border-b border-white/5">
                    <div className="container mx-auto max-w-4xl px-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-mono mb-6">
                            <LifeBuoy size={14} /> SUPPORT CENTER
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                            How can running a <span className="text-cyan-400">Neural Agent</span> help you?
                        </h1>

                        {/* Fake Search Bar for Visuals */}
                        <div className="max-w-xl mx-auto relative group">
                            <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                            <input
                                type="text"
                                placeholder="Search for 'How to deposit', 'DeepSeek config'..."
                                className="relative w-full bg-black/60 border border-white/10 focus:border-cyan-500/50 rounded-full py-4 px-6 text-white outline-none backdrop-blur-md transition-all placeholder:text-gray-600 font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto max-w-6xl px-4 py-16">
                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                        <HelpCard
                            icon={<Zap className="text-yellow-400" />}
                            title="Getting Started"
                            description="Learn how to connect your wallet, fund your account with SOL, and deploy your first agent."
                            link="/help/getting-started"
                        />
                        <HelpCard
                            icon={<Server className="text-cyan-400" />}
                            title="Agent Configuration"
                            description="Deep dive into ElizaOS settings. Configure local inference (Ollama) vs Cloud models."
                            link="/help/agents"
                        />
                        <HelpCard
                            icon={<FileText className="text-green-400" />}
                            title="Smart Contracts"
                            description="Understanding the NeuralVault program, protocol fees, and on-chain verification."
                            link="/help/contracts"
                        />
                    </div>

                    {/* Tutorial Section */}
                    <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-8 md:p-12 mb-16">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6">
                                <h2 className="text-3xl font-bold">New to Neural Market?</h2>
                                <p className="text-gray-400 leading-relaxed">
                                    Our platform can be intimidating at first. It combines advanced AI with decentralized finance.
                                    We have prepared a comprehensive documentation that explains every single component of the architecture.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <DocLink title="Architecture Overview: Frontend, Agent & Anchor" />
                                    <DocLink title="How to install DeepSeek R1 for Local Mode" />
                                    <DocLink title="Understanding DFlow Liquidity Routing" />
                                    <DocLink title="Builder Code & Monetization Explained" />
                                </div>
                            </div>
                            <div className="flex-1 w-full relative h-[300px] border border-white/10 rounded-xl overflow-hidden bg-black">
                                {/* Placeholder for a tutorial video or diagram */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-mono text-xs flex-col gap-4">
                                    <BookOpen size={48} className="opacity-20" />
                                    <span>INTERACTIVE ARCHITECTURE DIAGRAM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-4">Can't find what you're looking for?</h3>
                        <div className="flex justify-center gap-4">
                            <a href="mailto:support@neuralmarket.io" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-colors">
                                <MessageSquare size={18} /> Chat with Support
                            </a>
                            <a href="https://github.com/Eras256/NeuralMarket" target="_blank" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-colors">
                                <FileText size={18} /> View Documentation
                            </a>
                        </div>
                    </div>

                </div>
                <GlobalFooter />
            </div>
        </main>
    );
}

function HelpCard({ icon, title, description, link }: any) {
    return (
        <Link href="#" className="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/20 transition-all cursor-pointer">
            <div className="mb-6 p-4 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </Link>
    );
}

function DocLink({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            <span className="text-sm text-gray-300 group-hover:text-white font-mono">{title}</span>
        </div>
    );
}

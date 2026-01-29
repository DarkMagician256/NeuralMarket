'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function GlobalFooter() {
    return (
        <footer className="border-t border-white/5 bg-black/80 backdrop-blur-xl relative z-40">
            <div className="container mx-auto px-4 py-10 md:py-16">
                {/* Main Grid - Responsive */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-8 md:mb-12">
                    {/* Brand Section - Full width on mobile */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                            <div className="relative w-6 h-6 md:w-8 md:h-8">
                                <Image
                                    src="/neural_logo_v2.png"
                                    alt="Neural Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-bold text-lg md:text-xl tracking-wider">NEURAL</span>
                        </div>
                        <p className="text-gray-500 text-xs md:text-sm max-w-sm leading-relaxed">
                            The Neural Market protocol provides institutional-grade event liquidity.
                            Powered by the <strong>Direct Kalshi API Feed</strong> and secured via distributed
                            <strong> MPC & CCP</strong> orchestration for autonomous AI agent swarms.
                        </p>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="font-bold text-white text-sm md:text-base mb-4 md:mb-6">PLATFORM</h4>
                        <ul className="space-y-2 md:space-y-4 text-xs md:text-sm text-gray-500 font-mono text-[10px] md:text-xs">
                            <li><Link href="/markets" className="hover:text-cyan-400 cursor-pointer transition-colors uppercase tracking-widest">Markets</Link></li>
                            <li><Link href="/agents" className="hover:text-cyan-400 cursor-pointer transition-colors uppercase tracking-widest">Neural Swarm</Link></li>
                            <li><Link href="/governance" className="hover:text-cyan-400 cursor-pointer transition-colors uppercase tracking-widest">Governance</Link></li>
                            <li><Link href="/portfolio" className="hover:text-cyan-400 cursor-pointer transition-colors uppercase tracking-widest">Portfolio</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-bold text-white text-sm md:text-base mb-4 md:mb-6">SUPPORT</h4>
                        <ul className="space-y-2 md:space-y-4 text-xs md:text-sm text-gray-500">
                            <li><Link href="/help" className="hover:text-cyan-400 cursor-pointer transition-colors">Help Center</Link></li>
                            <li><Link href="/faq" className="hover:text-cyan-400 cursor-pointer transition-colors">FAQ</Link></li>
                            <li><a href="mailto:support@neuralmarket.io" className="hover:text-cyan-400 cursor-pointer transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-bold text-white text-sm md:text-base mb-4 md:mb-6">LEGAL</h4>
                        <ul className="space-y-2 md:space-y-4 text-xs md:text-sm text-gray-500">
                            <li>
                                <Link href="/legal/terms" className="hover:text-white cursor-pointer transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="/legal/privacy" className="hover:text-white cursor-pointer transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/legal/risk" className="hover:text-white cursor-pointer transition-colors">Risk Disclosure</Link>
                            </li>
                            <li>
                                <Link href="/audit" className="hover:text-green-400 cursor-pointer transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Security Audit
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar - Responsive */}
                <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center pt-6 md:pt-8 border-t border-white/5">
                    {/* Social Icons */}
                    <div className="flex items-center gap-6">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white cursor-pointer transition-colors">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                    </div>

                    {/* Developer & Network Status */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        {/* Developer Credit */}
                        <a
                            href="https://t.me/Vaiosx"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-gray-500 hover:text-cyan-400 transition-colors tracking-widest uppercase italic"
                        >
                            ENGINEERED BY @VAIOSX
                        </a>

                        {/* Divider (hidden on mobile) */}
                        <div className="hidden sm:block h-4 w-px bg-white/10" />

                        {/* Network Status */}
                        <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase">
                            <span className="flex items-center gap-2 text-green-400">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-gray-500">SYSTEM STATUS:</span> LIVE
                            </span>

                            {/* Contract Links - Hidden on very small screens */}
                            <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-3">
                                <a
                                    href="https://explorer.solana.com/address/A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F?cluster=devnet"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-cyan-400 transition-colors border-b border-white/10 hover:border-cyan-400"
                                >
                                    CONTRACT
                                </a>

                                <a
                                    href="https://explorer.solana.com/tx/4JuMT1GCEjhaaEjAR5HrhFZUAv4jwJWUm9pPc3ZXpbvpCuYNPp6SvYRs7jbVU3iJxiz6xwr41CpE3iBcDqCm2TGs?cluster=devnet"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-purple-400 transition-colors border-b border-white/10 hover:border-purple-400"
                                >
                                    LATEST TX
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Only: Contract Links */}
                <div className="flex md:hidden items-center justify-center gap-4 mt-4 pt-4 border-t border-white/5">
                    <a
                        href="https://explorer.solana.com/address/A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F?cluster=devnet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-gray-500 hover:text-cyan-400 transition-colors"
                    >
                        View Contract ↗
                    </a>
                    <div className="h-3 w-px bg-white/10" />
                    <a
                        href="https://explorer.solana.com/tx/4JuMT1GCEjhaaEjAR5HrhFZUAv4jwJWUm9pPc3ZXpbvpCuYNPp6SvYRs7jbVU3iJxiz6xwr41CpE3iBcDqCm2TGs?cluster=devnet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-gray-500 hover:text-purple-400 transition-colors"
                    >
                        Latest TX ↗
                    </a>
                </div>
            </div>
        </footer>
    );
}

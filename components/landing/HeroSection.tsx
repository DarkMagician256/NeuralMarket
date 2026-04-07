'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import LiveBotStatus from '@/components/ui/LiveBotStatus';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
    const { t, locale } = useLanguage();

    // Chinese headline needs special handling for the break
    const isZH = locale === 'zh';

    return (
        <div className="relative min-h-screen flex flex-col justify-center pb-20 md:pb-40 items-center text-center overflow-hidden z-20 pt-20 md:pt-0">

            {/* Mesh Background Override for brighter load */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#05050A]/50 to-[#05050A]" />

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 max-w-5xl px-4 sm:px-6 flex flex-col items-center"
            >
                {/* Logo - Responsive sizing */}
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 mb-4 md:mb-6 animate-float">
                    <Image
                        src="/neural_logo_v2.png"
                        alt="Neural Core"
                        fill
                        className="object-contain drop-shadow-[0_0_30px_rgba(6,182,212,0.6)]"
                    />
                </div>

                {/* Main Headline - Responsive font sizes */}
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-3 md:mb-4 leading-[1.1]">
                    {isZH ? "机构级 AI" : t('hero_headline').split('.')[0]}
                    <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-600 animate-pulse uppercase">
                        {isZH ? "预测 · 链上执行" : t('hero_headline').split('.')[1]}
                    </span>
                </h1>

                {/* Subtitle - Responsive */}
                <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-4 md:mb-6 max-w-2xl mx-auto font-mono px-2">
                    {t('hero_subtitle')}
                </p>

                {/* Live Bot Status Indicator */}
                <div className="mb-6 md:mb-8">
                    <LiveBotStatus />
                </div>

                {/* LOGOS SECTION - Responsive & Matching Markets Page */}
                <div className="flex flex-col items-center gap-2 mb-8 md:mb-14 w-full">
                    <span className="text-[9px] sm:text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                        Official Data & Execution
                    </span>
                    <div className="flex items-center gap-3 sm:gap-5 bg-white/5 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-white/5 backdrop-blur-sm shadow-xl shadow-black/50 flex-wrap justify-center">
                        <div className="relative h-4 sm:h-5 w-16 sm:w-20 opacity-80 hover:opacity-100 transition-opacity">
                            <Image src="/logos/solana.png" alt="Solana" fill className="object-contain" />
                        </div>
                        <div className="h-3 sm:h-4 w-px bg-white/10" />
                        <div className="relative h-5 sm:h-6 w-10 sm:w-14 opacity-80 hover:opacity-100 transition-opacity">
                            <Image src="/logos/dflow_v2.png" alt="DFlow" fill className="object-contain" />
                        </div>
                        <div className="h-3 sm:h-4 w-px bg-white/10" />
                        <div className="relative h-4 sm:h-5 w-16 sm:w-20 opacity-80 hover:opacity-100 transition-opacity">
                            <Image src="/logos/jupiter.png" alt="Jupiter" fill className="object-contain" />
                        </div>

                        <div className="h-3 sm:h-4 w-px bg-white/10" />
                        <div className="relative h-6 sm:h-7 w-16 sm:w-20 opacity-80 hover:opacity-100 transition-opacity">
                            <Image src="/logos/shipyard.png" alt="Shipyard" fill className="object-contain" />
                        </div>
                    </div>
                </div>

                {/* CTA Buttons - Responsive */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 w-full px-4 sm:px-0">
                    <Link href="/markets" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-cyan-500 text-black font-bold text-sm sm:text-base md:text-lg rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2">
                            {t('hero_cta1')} <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                        </button>
                    </Link>
                    <Link href="/agents" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold text-sm sm:text-base md:text-lg rounded-full hover:scale-105 hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2">
                            🧠 {t('hero_cta2')}
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

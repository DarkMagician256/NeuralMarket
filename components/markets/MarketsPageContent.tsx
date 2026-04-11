'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, Globe, Clock, ArrowRight, Zap } from 'lucide-react';
import MarketsGrid from '@/components/markets/MarketsGrid';
import { useLanguage } from '@/context/LanguageContext';
import { Market } from '@/app/actions/getMarkets';

interface MarketsPageContentProps {
    markets: Market[];
    totalVolume: number;
}

export default function MarketsPageContent({ markets, totalVolume }: MarketsPageContentProps) {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen pb-16 md:pb-20 pt-24 md:pt-28 px-3 sm:px-4 md:px-8">
            <div className="container mx-auto max-w-7xl">

                {/* Header Section */}
                <div className="flex flex-col gap-6 md:gap-8 mb-8 md:mb-12 border-b border-white/10 pb-6 md:pb-8">
                    <div>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 md:mb-4">
                            <div className="p-2 md:p-3 bg-green-500/10 rounded-xl shrink-0">
                                <TrendingUp className="text-green-400" size={20} />
                            </div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-white uppercase italic leading-tight">
                                {t('markets_title')}
                            </h1>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] md:text-[10px] font-mono tracking-widest md:tracking-[0.2em] text-gray-400 whitespace-nowrap">
                                <Globe size={10} className="text-cyan-400 animate-spin-slow" /> DIRECT KALSHI API FEED
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 rounded-full text-green-400 text-[10px] md:text-xs font-mono animate-pulse">
                                <Zap size={10} /> LIVE
                            </div>
                        </div>
                        <p className="text-gray-400 font-mono text-[10px] sm:text-xs md:text-sm max-w-2xl leading-relaxed">
                            {t('markets_subtitle')}
                        </p>
                    </div>

                    {/* Partner Integrations */}
                    <div className="flex flex-col items-start sm:items-end gap-2">
                        <span className="text-[9px] sm:text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                            Official Data & Execution
                        </span>
                        <div className="flex items-center gap-3 sm:gap-5 bg-white/5 px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/5 backdrop-blur-sm flex-wrap justify-center">
                            <div className="relative h-3 sm:h-4 w-12 sm:w-16 opacity-80 hover:opacity-100 transition-opacity">
                                <Image src="/logos/solana.png" alt="Solana" fill className="object-contain" />
                            </div>
                            <div className="h-2 sm:h-3 w-px bg-white/10" />
                            <div className="relative h-4 sm:h-5 w-8 sm:w-10 opacity-80 hover:opacity-100 transition-opacity">
                                <Image src="/logos/dflow_v2.png" alt="DFlow" fill className="object-contain" />
                            </div>
                            <div className="h-2 sm:h-3 w-px bg-white/10" />
                            <div className="relative h-3 sm:h-4 w-12 sm:w-16 opacity-80 hover:opacity-100 transition-opacity">
                                <Image src="/logos/jupiter.png" alt="Jupiter" fill className="object-contain" />
                            </div>


                        </div>
                    </div>
                </div>

                {/* Market Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
                    <div className="glass-panel p-3 md:p-4 flex items-center gap-3 md:gap-4">
                        <div className="p-1.5 md:p-2 bg-blue-500/20 rounded-lg text-blue-400"><Globe size={18} /></div>
                        <div>
                            <div className="text-[10px] md:text-xs text-gray-500 font-mono uppercase">{t('markets_stat_active')}</div>
                            <div className="text-lg md:text-xl font-bold text-white">{markets.length} Live Events</div>
                        </div>
                    </div>
                    <div className="glass-panel p-3 md:p-4 flex items-center gap-3 md:gap-4">
                        <div className="p-1.5 md:p-2 bg-purple-500/20 rounded-lg text-purple-400"><Clock size={18} /></div>
                        <div>
                            <div className="text-[10px] md:text-xs text-gray-500 font-mono uppercase">{t('markets_stat_vol')}</div>
                            <div className="text-lg md:text-xl font-bold text-white">
                                {totalVolume >= 1000000
                                    ? `$${(totalVolume / 1000000).toFixed(1)}M`
                                    : totalVolume >= 1000
                                        ? `$${(totalVolume / 1000).toFixed(0)}K`
                                        : `$${totalVolume.toFixed(0)}`}
                            </div>
                        </div>
                    </div>

                    {/* Safety and Security Info */}
                    <div className="glass-panel p-3 md:p-4 flex items-center gap-3 md:gap-4 border-white/5 hover:border-green-500/20 transition-colors">
                        <div className="p-1.5 md:p-2 bg-green-500/20 rounded-lg text-green-400"><TrendingUp size={18} /></div>
                        <div>
                            <div className="text-[10px] md:text-xs text-green-400 font-mono uppercase">Safety Verified</div>
                            <div className="text-sm md:text-base font-bold text-white uppercase italic">Institutional Standards</div>
                        </div>
                    </div>
                </div>

                {/* Client-side Grid with Pagination */}
                <MarketsGrid initialMarkets={markets} />

                <div className="mt-8 md:mt-12 text-center space-y-2">
                    <p className="text-[10px] md:text-xs text-gray-600 font-mono">
                        Data provided by Kalshi API v2. Execution via DFlow/Jupiter. 
                    </p>
                    <p className="text-[9px] md:text-[10px] text-gray-700 font-mono italic">
                        NeuralMarket is a Software-Only Provider. All trades are non-custodial and require user-signed transactions on Solana.
                    </p>
                </div>
            </div>
        </div>
    );
}

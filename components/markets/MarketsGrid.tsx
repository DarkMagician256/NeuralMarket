'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Loader2 } from 'lucide-react';
import MarketPredictionCard from '@/components/markets/MarketPredictionCard';
import type { Market } from '@/app/actions/getMarkets';

interface MarketsGridProps {
    initialMarkets: Market[];
}

const ITEMS_PER_PAGE = 12;

export default function MarketsGrid({ initialMarkets }: MarketsGridProps) {
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const displayedMarkets = initialMarkets.slice(0, displayCount);
    const hasMore = displayCount < initialMarkets.length;

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        // Simulate a small loading delay for better UX feeling
        setTimeout(() => {
            setDisplayCount(prev => prev + ITEMS_PER_PAGE);
            setIsLoadingMore(false);
        }, 500);
    };

    return (
        <div className="flex flex-col items-center">
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
                <AnimatePresence mode="popLayout">
                    {displayedMarkets.map((market, index) => (
                        <motion.div
                            key={market.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: (index % ITEMS_PER_PAGE) * 0.05 }}
                            className="hover:scale-[1.01] transition-transform duration-300"
                        >
                            <MarketPredictionCard market={market} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {initialMarkets.length === 0 && (
                <div className="text-center py-20 w-full">
                    <p className="text-gray-500 font-mono">Loading markets from Kalshi...</p>
                </div>
            )}

            {/* Load More Button */}
            {hasMore && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-12"
                >
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="group relative px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 rounded-full font-mono text-sm tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoadingMore ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-cyan-400" />
                                LOADING...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-300 group-hover:text-cyan-400">
                                LOAD MORE MARKETS
                                <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
                            </div>
                        )}

                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                    </button>

                    <div className="text-center mt-4 text-[10px] text-gray-600 font-mono">
                        SHOWING {displayedMarkets.length} OF {initialMarkets.length} MARKETS
                    </div>
                </motion.div>
            )}
        </div>
    );
}

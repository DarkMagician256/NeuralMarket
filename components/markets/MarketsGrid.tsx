'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Loader2, Search, Filter, ArrowUpDown } from 'lucide-react';
import MarketPredictionCard from '@/components/markets/MarketPredictionCard';
import type { Market } from '@/app/actions/getMarkets';

interface MarketsGridProps {
    initialMarkets: Market[];
}

const ITEMS_PER_PAGE = 12;
const CATEGORIES = ['ALL', 'CRYPTO', 'ECONOMICS', 'POLITICS', 'SCIENCE', 'CULTURE'];

export default function MarketsGrid({ initialMarkets }: MarketsGridProps) {
    const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [sortBy, setSortBy] = useState<'volume' | 'newest'>('volume');

    // Filtering Logic
    const filteredMarkets = useMemo(() => {
        let result = initialMarkets.filter(market => {
            const matchesSearch =
                market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                market.ticker.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = activeCategory === 'ALL' || market.category === activeCategory;

            return matchesSearch && matchesCategory;
        });

        // Sorting
        if (sortBy === 'volume') {
            result.sort((a, b) => {
                const volA = parseFloat(a.volume.replace(/[$,KM]/g, '')) * (a.volume.includes('M') ? 1000000 : a.volume.includes('K') ? 1000 : 1);
                const volB = parseFloat(b.volume.replace(/[$,KM]/g, '')) * (b.volume.includes('M') ? 1000000 : b.volume.includes('K') ? 1000 : 1);
                return volB - volA;
            });
        }

        return result;
    }, [initialMarkets, searchQuery, activeCategory, sortBy]);

    const displayedMarkets = filteredMarkets.slice(0, displayCount);
    const hasMore = displayCount < filteredMarkets.length;

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setDisplayCount(prev => prev + ITEMS_PER_PAGE);
            setIsLoadingMore(false);
        }, 500);
    };

    return (
        <div className="flex flex-col items-center w-full">

            {/* Filter Bar */}
            <div className="w-full mb-10 space-y-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

                    {/* Search Bar */}
                    <div className="relative w-full lg:max-w-md group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="SEARCH BY TICKER OR EVENT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-mono focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-600 uppercase tracking-wider"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden sm:block">Sort By</span>
                        <div className="relative flex-1 lg:flex-none">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full lg:w-48 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-[10px] font-mono appearance-none focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer pr-10 text-white tracking-widest uppercase"
                            >
                                <option value="volume">HIGHEST VOLUME</option>
                                <option value="newest">NEWEST LISTED</option>
                            </select>
                            <ArrowUpDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-white/5">
                    <Filter size={14} className="text-gray-500 mr-2 flex-shrink-0" />
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveCategory(cat);
                                setDisplayCount(ITEMS_PER_PAGE);
                            }}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-widest transition-all flex-shrink-0 whitespace-nowrap border ${activeCategory === cat
                                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                    : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full min-h-[400px]">
                <AnimatePresence mode="popLayout" initial={false}>
                    {displayedMarkets.map((market, index) => (
                        <motion.div
                            key={market.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="hover:scale-[1.01] transition-transform duration-300"
                        >
                            <MarketPredictionCard market={market} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {displayedMarkets.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-32 w-full flex flex-col items-center gap-4"
                >
                    <div className="p-4 bg-white/5 rounded-full text-gray-700">
                        <Search size={48} strokeWidth={1} />
                    </div>
                    <p className="text-gray-500 font-mono text-sm max-w-xs uppercase tracking-tighter">No matches found for your current filters.</p>
                    <button
                        onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}
                        className="text-cyan-400 text-xs font-mono hover:underline tracking-widest"
                    >
                        CLEAR ALL FILTERS
                    </button>
                </motion.div>
            )}

            {/* Load More Button */}
            {hasMore && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-12 flex flex-col items-center gap-6"
                >
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="group relative px-10 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 rounded-full font-mono text-xs tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                    >
                        {isLoadingMore ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-cyan-400" />
                                ANALYZING...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-300 group-hover:text-cyan-400">
                                REVEAL MORE
                                <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
                            </div>
                        )}

                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                    </button>

                    <div className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">
                        REVEALED {displayedMarkets.length} OF {filteredMarkets.length} // TOTAL {initialMarkets.length}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

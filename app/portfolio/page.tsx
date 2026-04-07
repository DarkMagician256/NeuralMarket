'use client';

import { motion } from 'framer-motion';
import PortfolioHeader from '@/components/portfolio/PortfolioHeader';
import PerformanceChart from '@/components/portfolio/PerformanceChart';
import PositionsGrid from '@/components/portfolio/PositionsGrid';
import CortexMonitor from '@/components/portfolio/CortexMonitor';

export default function PortfolioPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen py-6 md:py-10 space-y-6 md:space-y-8 px-2 sm:px-0"
        >
            {/* Layout Grid - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {/* Left Column: Stats & Chart (3/4 width on desktop) */}
                <div className="lg:col-span-3 space-y-4 md:space-y-6 lg:space-y-8">
                    <div className="mb-4">
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic">Neural Performance Dashboard</h1>
                        <p className="text-gray-500 font-mono text-xs mt-1">
                            Real-time monitoring of <strong className="text-cyan-400">NeuralVault</strong> activity. All trades are executed via non-custodial smart contracts on Solana.
                        </p>
                    </div>
                    <PortfolioHeader />
                    <PerformanceChart />
                </div>

                {/* Right Column: AI Monitor (1/4 width on desktop, full on mobile) */}
                <div className="lg:col-span-1">
                    <CortexMonitor />
                </div>
            </div>

            {/* Bottom Section: Active Positions */}
            <div className="pt-6 md:pt-8 border-t border-white/5">
                <PositionsGrid />
            </div>
        </motion.div>
    );
}

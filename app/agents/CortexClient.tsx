"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Power } from 'lucide-react';
import AgentRoster from '@/components/cortex/AgentRoster';
import MyAgentsPanel from '@/components/cortex/MyAgentsPanel';
import NeuralReasoningVis from '@/components/cortex/NeuralReasoningVis';
import TelemetryPanel from '@/components/cortex/TelemetryPanel';
import AlphaStream from '@/components/cortex/AlphaStream';
import GlobalActivity from '@/components/cortex/GlobalActivity';
import Leaderboard from '@/components/cortex/Leaderboard';
import Link from 'next/link';
import { useNeuralVault } from '@/hooks/useNeuralVault';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export default function CortexClient({ initialThoughts }: { initialThoughts: any[] }) {
    const [isArmed, setIsArmed] = useState(false);

    // Enable push notifications when system is armed
    usePushNotifications(isArmed);

    const toggleSystem = () => {
        setIsArmed(!isArmed);
    };

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-8 md:pb-12 px-2 sm:px-4 md:px-6 flex flex-col bg-black text-white">
            {/* Header Section - Responsive */}
            <div className="flex flex-col gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter flex flex-wrap items-center gap-2">
                        CORTEX <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">SWARM INTELLIGENCE</span>
                    </h1>
                    <p className="text-gray-500 font-mono text-[10px] sm:text-xs md:text-sm mt-1 uppercase tracking-widest">
                        Autonomous Quant Fund Management System v4.2
                    </p>
                </div>

                {/* Action Buttons - Stack on mobile */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={toggleSystem}
                        className={`flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm transition-all border ${isArmed
                            ? 'bg-red-500/20 text-red-500 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                            : 'bg-green-500/20 text-green-500 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                            }`}
                    >
                        <Power size={16} />
                        {isArmed ? 'DEACTIVATE' : 'ACTIVATE SYSTEM'}
                    </button>

                    <Link href="/agents/create" className="w-full sm:w-auto">
                        <button
                            className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm transition-all bg-cyan-500 text-black border border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] md:hover:scale-105"
                        >
                            INITIALIZE SWARM
                        </button>
                    </Link>
                </div>
            </div>

            {/* HERO STATS - REAL DEVNET DATA */}
            <HeroStats />

            {/* MY DEPLOYED AGENTS - ON-CHAIN */}
            <div className="mb-6 md:mb-8">
                <MyAgentsPanel />
            </div>

            {/* Main Grid - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 pb-8 md:pb-12">
                {/* Left Panel: Swarm Active Nodes */}
                <div className="lg:col-span-3 h-[400px] lg:h-auto overflow-hidden">
                    <AgentRoster />
                </div>

                {/* Center Panel: Telemetry & Core */}
                <div className="lg:col-span-6 flex flex-col gap-4 md:gap-6 min-h-0">
                    <div className="flex-none">
                        <TelemetryPanel armed={isArmed} />
                    </div>
                    <div className="flex-1 min-h-[300px] md:min-h-[400px]">
                        <NeuralReasoningVis armed={isArmed} />
                    </div>
                </div>

                {/* Right Panel: Alpha Stream */}
                <div className="lg:col-span-3 h-[400px] lg:h-auto overflow-hidden">
                    <AlphaStream armed={isArmed} />
                </div>
            </div>

            {/* GLOBAL SYNC FEED - ALL PROGRAM ACTIVITY */}
            <GlobalActivity />

            {/* LEADERBOARD - TOP PERFORMING AGENTS */}
            <div className="mt-6 md:mt-8">
                <Leaderboard />
            </div>
        </div>
    );
}

function HeroStats() {
    const { balance, stats } = useNeuralVault();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Balance Card */}
            <div className="glass-panel p-4 sm:p-6 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-gray-500 font-mono text-[10px] sm:text-xs tracking-widest mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    LIVE WALLET BALANCE (DEVNET)
                </h3>
                <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white font-mono mt-1 sm:mt-2">
                    {balance !== null ? (
                        <>
                            {balance.toFixed(4)} <span className="text-lg sm:text-xl md:text-2xl text-gray-500">SOL</span>
                        </>
                    ) : (
                        <span className="text-lg sm:text-xl md:text-2xl text-gray-600 animate-pulse">CONNECTING...</span>
                    )}
                </div>
                <div className="font-mono text-[9px] sm:text-[10px] text-gray-600 mt-1 sm:mt-2 truncate">
                    ADDR: {stats ? stats.user.toString() : "SCANNING ADDRESS..."}
                </div>
            </div>

            {/* Performance Card */}
            <div className="glass-panel p-4 sm:p-6 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-gray-500 font-mono text-[10px] sm:text-xs tracking-widest mb-1">
                    VAULT PERFORMANCE (ON-CHAIN)
                </h3>
                <div className="flex items-end gap-2 sm:gap-4 mt-1 sm:mt-2">
                    <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-green-400 font-mono">
                        +{stats ? ((stats.correctPredictions.toNumber() / Math.max(stats.predictionsCount.toNumber(), 1)) * 100).toFixed(1) : "0.0"}%
                    </div>
                    <div className="text-xs sm:text-sm font-mono text-gray-400 mb-1 sm:mb-2">
                        ACCURACY
                    </div>
                </div>
                <div className="font-mono text-[9px] sm:text-[10px] text-gray-600 mt-1 sm:mt-2">
                    BASED ON {stats ? stats.predictionsCount.toString() : "0"} VERIFIED PREDICTIONS
                </div>
            </div>
        </div>
    );
}

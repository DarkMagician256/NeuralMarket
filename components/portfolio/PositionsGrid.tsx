'use client';

import { motion } from 'framer-motion';
import { useKalshiPortfolio } from '@/hooks/useKalshiPortfolio';
import { useWallet } from '@solana/wallet-adapter-react';
import { TrendingUp, TrendingDown, Target, BarChart3, Loader2 } from 'lucide-react';

export default function PositionsGrid() {
    const { publicKey } = useWallet();
    const { positions, isLoading } = useKalshiPortfolio();

    if (!publicKey) {
        return (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/2 overflow-hidden relative">
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/50 pointer-events-none" />
                <p className="text-gray-500 font-mono text-sm tracking-widest relative z-10">CONNECT WALLET TO SYNC KALSHI POSITIONS</p>
            </div>
        );
    }

    if (isLoading && positions.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-4 border border-white/5 rounded-2xl bg-white/2">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Scanning Kalshi Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-3 italic uppercase">
                    <span className="w-1.5 h-6 bg-cyan-400"></span>
                    Live Kalshi Exposures
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Live Sync</span>
                </div>
            </div>

            {positions.length === 0 ? (
                <div className="py-24 text-center border border-white/5 rounded-3xl bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center gap-4">
                    <div className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-700">
                        <BarChart3 size={40} strokeWidth={1} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-gray-400 font-mono text-sm font-bold uppercase tracking-widest">No Active Positions Found</p>
                        <p className="text-gray-600 text-xs max-w-xs mx-auto">Your automated agents currently have zero exposure on the Kalshi liquidity layer.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {positions.map((pos) => {
                        const side = pos.yes_count > 0 ? 'YES' : 'NO';
                        const count = pos.yes_count > 0 ? pos.yes_count : pos.no_count;
                        const pnl = parseFloat(pos.unrealized_pnl_dollars || '0');
                        const isProfit = pnl >= 0;

                        return (
                            <motion.div
                                key={pos.ticker}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -4 }}
                                className="glass-panel p-6 relative overflow-hidden group border-white/10 hover:border-cyan-500/50 transition-all duration-300"
                            >
                                {/* PnL Gradient Background */}
                                <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 pointer-events-none rounded-full transition-colors ${isProfit ? 'bg-green-500' : 'bg-red-500'}`} />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1 max-w-[70%]">
                                        <div className="text-[10px] text-cyan-400 font-mono font-bold tracking-widest uppercase">{pos.ticker}</div>
                                        <h4 className="text-white font-black text-sm tracking-tight leading-tight line-clamp-2 uppercase italic">{pos.market_title}</h4>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg font-black text-xs tracking-widest flex items-center gap-1.5 ${side === 'YES' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                        <Target size={12} /> {side}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-1">
                                        <div className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Exposure</div>
                                        <div className="text-lg font-black text-white italic tracking-tight">${pos.market_exposure_dollars}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">PnL (Unrealized)</div>
                                        <div className={`text-lg font-black italic tracking-tight flex items-center gap-1.5 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                                            {isProfit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                            ${pnl.toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                    <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                                        <strong className="text-white">{count}</strong> Contracts Held
                                    </div>
                                    <div className="text-[9px] text-gray-600 font-mono uppercase tracking-widest italic animate-pulse">
                                        Managed by NeuralVault
                                    </div>
                                </div>

                                {/* Quick Sell Overlay */}
                                <div className="absolute inset-0 bg-red-600/90 backdrop-blur-md flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer z-20">
                                    <div className="scale-75 group-hover:scale-100 transition-transform duration-300 flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 border border-white/30">
                                            <TrendingDown className="text-white" size={24} />
                                        </div>
                                        <span className="font-black text-white tracking-widest text-lg italic uppercase">Exit Position</span>
                                        <span className="text-[10px] text-white/70 font-mono uppercase tracking-[0.2em] mt-1">Execute Liquidation</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}


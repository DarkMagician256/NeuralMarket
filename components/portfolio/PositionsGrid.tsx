import { motion } from 'framer-motion';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useWallet } from '@solana/wallet-adapter-react';

export default function PositionsGrid() {
    const { publicKey } = useWallet();
    const { trades, isLoading } = usePortfolio();

    // If not connected, we can show a placeholder or empty state
    const displayTrades = trades.length > 0 ? trades : [];

    if (!publicKey) {
        return (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
                <p className="text-gray-500 font-mono">CONNECT WALLET TO VIEW LIVE POSITIONS</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                ACTIVE POSITIONS {isLoading && <span className="text-xs text-gray-500 animate-pulse">(SYNCING...)</span>}
            </h3>

            {displayTrades.length === 0 ? (
                <div className="py-12 text-center text-gray-600 font-mono bg-white/5 rounded-2xl">
                    NO ACTIVE TRADES ON DFLOW
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayTrades.map((pos) => (
                        <motion.div
                            key={pos.id}
                            whileHover={{ scale: 1.02 }}
                            className="glass-panel p-5 relative overflow-hidden group hover:border-red-500/30 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="font-mono font-bold text-lg">{pos.ticker}</span>
                                <span className="text-sm font-bold px-2 py-1 rounded bg-white/5 text-green-400">
                                    LIVE
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-gray-500 text-xs">Side</div>
                                    <div className={pos.outcome === 'YES' ? 'text-green-400' : 'text-red-400'}>{pos.outcome}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-xs">Size</div>
                                    <div className="text-white">${pos.amount}</div>
                                </div>
                            </div>

                            <div className="mt-4 text-[10px] text-gray-600 font-mono truncate">
                                TX: {pos.signature}
                            </div>

                            {/* Quick Sell Overlay */}
                            <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="font-black text-white tracking-widest text-lg">CLOSE POSITION</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

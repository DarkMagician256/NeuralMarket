'use client';

import { useState, useEffect } from 'react';
import { Scan, ExternalLink, ShieldCheck } from 'lucide-react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { supabase } from '@/lib/supabase';
import { useKalshiPortfolio } from '@/hooks/useKalshiPortfolio';

export default function PortfolioHeader() {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const { balance: kalshiBal, isLoading: loadingKalshi } = useKalshiPortfolio();
    const [balance, setBalance] = useState<number | null>(null);
    const [stats, setStats] = useState({ total: 0, wins: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!publicKey) {
            setLoading(false);
            return;
        }

        // Fetch real SOL balance
        const fetchBalance = async () => {
            try {
                const bal = await connection.getBalance(publicKey);
                setBalance(bal / 1_000_000_000);
            } catch (e) {
                console.error("Failed to fetch balance:", e);
            }
        };

        // Fetch trade stats from Supabase (real data)
        const fetchTradeStats = async () => {
            try {
                const { data, error } = await supabase
                    .from('trades')
                    .select('outcome')
                    .eq('wallet_address', publicKey.toBase58());

                if (data && !error) {
                    const total = data.length;
                    const wins = data.filter(t => t.outcome === 'YES').length;
                    setStats({ total, wins });
                }
            } catch (e) {
                console.error("Failed to fetch trade stats:", e);
            }
            setLoading(false);
        };

        fetchBalance();
        fetchTradeStats();

        const interval = setInterval(fetchBalance, 10000);
        return () => clearInterval(interval);
    }, [publicKey, connection]);

    const accuracy = stats.total > 0 ? (stats.wins / stats.total) * 100 : 0;
    const isPositive = accuracy >= 50;
    const walletAddress = publicKey?.toBase58() || 'NOT CONNECTED';
    const shortAddress = walletAddress.length > 20
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : walletAddress;

    return (
        <div className="glass-panel p-6 md:p-8 relative overflow-hidden group">
            {/* Scanning Effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/50 shadow-[0_0_15px_#22d3ee] animate-scan" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                <div className="flex flex-col gap-6 md:gap-8">
                    {/* SOL Balance */}
                    <div>
                        <h2 className="text-gray-400 text-xs sm:text-sm font-mono tracking-widest mb-1 flex items-center gap-2">
                            <Scan size={14} /> SOLANA BALANCE
                        </h2>
                        <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight tabular-nums transition-all">
                            {balance !== null ? `${balance.toFixed(4)} SOL` : 'CONNECTING...'}
                        </div>
                    </div>

                    {/* Kalshi Balance (USDC) - THIS IS THE RELEVANT PART FOR THE GRANT */}
                    <div>
                        <h2 className="text-cyan-400 text-xs sm:text-sm font-mono tracking-widest mb-1 flex items-center gap-2 uppercase">
                            <ShieldCheck size={14} className="text-cyan-400" /> KALSHI PLATFORM BALANCE
                        </h2>
                        <div className="text-3xl sm:text-4xl md:text-5xl font-black text-cyan-400 tracking-tight tabular-nums transition-all drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                            {loadingKalshi ? 'SYNCING...' : `$${kalshiBal.balance.toFixed(2)} USDC`}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-widest">
                            {loadingKalshi ? '---' : `Potential Payout: $${kalshiBal.payout.toFixed(2)}`}
                        </div>
                    </div>

                    <div className="text-[10px] sm:text-xs text-cyan-500/70 font-mono mt-1 flex items-center gap-2 flex-wrap">
                        <span className="break-all">{shortAddress}</span>
                        {publicKey && (
                            <a
                                href={`https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/10 px-2 py-0.5 rounded hover:bg-white/20 transition-colors flex items-center gap-1"
                            >
                                <ExternalLink size={10} /> EXPLORER
                            </a>
                        )}
                    </div>
                </div>

                <div className="text-left md:text-right flex flex-col items-start md:items-end">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/10 mb-3 md:mb-4 bg-linear-to-br from-cyan-500/20 to-purple-500/20 shadow-[0_0_15px_#22d3ee22]">
                        <img
                            src={`https://api.dicebear.com/9.x/bottts/svg?seed=NeuralBot&backgroundColor=1d1d1d`}
                            alt="Agent Avatar"
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm font-mono tracking-widest mb-1 uppercase">Success Rate</div>
                    <div className={`text-3xl sm:text-4xl font-bold flex items-center gap-2 ${isPositive ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'text-yellow-400'}`}>
                        {loading ? '...' : `${accuracy.toFixed(1)}%`}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 font-mono mt-1">
                        BASED ON {stats.total} KALSHI TRADES
                    </div>
                </div>
            </div>
        </div>
    );
}


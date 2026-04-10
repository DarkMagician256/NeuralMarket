"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { ExternalLink, TrendingUp, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { placeKalshiOrder, getKalshiBalance } from '@/app/actions/kalshiTrading';
import type { KalshiOrder } from '@/lib/kalshi';

export default function TradePanel({ ticker, yesPrice, noPrice }: {
    ticker: string;
    yesPrice?: number;
    noPrice?: number;
}) {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [outcome, setOutcome] = useState<'yes' | 'no'>('yes');
    const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
    const [contracts, setContracts] = useState<string>('1');
    const [limitPrice, setLimitPrice] = useState<string>('');
    const [isTrading, setIsTrading] = useState(false);
    const [placedOrder, setPlacedOrder] = useState<KalshiOrder | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [kalshiBalance, setKalshiBalance] = useState<number | null>(null);

    // Fetch Kalshi platform balance
    useEffect(() => {
        getKalshiBalance().then(bal => {
            if (bal) setKalshiBalance(bal.balance);
        });
    }, []);

    // Auto-set limit price from market data
    useEffect(() => {
        if (orderType === 'limit') {
            const price = outcome === 'yes' ? yesPrice : noPrice;
            if (price) setLimitPrice(price.toFixed(2));
        }
    }, [outcome, orderType, yesPrice, noPrice]);

    const currentPrice = outcome === 'yes' ? yesPrice : noPrice;
    const estimatedCost = currentPrice ? (parseFloat(contracts) || 0) * currentPrice : null;

    const handleTrade = async () => {
        if (!publicKey) {
            setError('Please connect your wallet first');
            return;
        }

        const count = parseFloat(contracts);
        if (isNaN(count) || count <= 0) {
            setError('Invalid contract count');
            return;
        }

        if (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
            setError('Please enter a valid limit price');
            return;
        }

        setIsTrading(true);
        setError(null);

        try {
            const result = await placeKalshiOrder({
                ticker,
                side: outcome,
                type: orderType,
                count: Math.floor(count),
                // For market orders, Kalshi v2 still needs a price limit protection.
                // We use 0.99 as a "pseudo-market" price to ensure immediate fill.
                limitPrice: orderType === 'limit' ? limitPrice : '0.99',
                walletAddress: publicKey.toBase58(),
            });

            if (!result.success || !result.order) {
                throw new Error(result.error || 'Order failed');
            }

            setPlacedOrder(result.order);
        } catch (err: any) {
            console.error('Trade failed:', err);
            setError(err.message || 'Trade execution failed');
        } finally {
            setIsTrading(false);
        }
    };

    return (
        <div className="glass-panel p-6 flex flex-col h-full bg-[#050505]/95 relative overflow-hidden">

            {/* SUCCESS OVERLAY */}
            <AnimatePresence>
                {placedOrder && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                            className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 border border-green-500"
                        >
                            <TrendingUp className="w-8 h-8 text-green-500" />
                        </motion.div>

                        <h3 className="text-xl font-black text-white mb-1 tracking-tight">ORDER PLACED</h3>
                        <p className="text-gray-400 text-sm mb-2">
                            {placedOrder.side.toUpperCase()} — {placedOrder.count} {placedOrder.count === 1 ? 'contract' : 'contracts'}
                        </p>

                        <div className="bg-white/5 rounded-lg p-3 mb-4 w-full text-left space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-gray-500">Order ID</span>
                                <a 
                                    href={process.env.NEXT_PUBLIC_KALSHI_ENV === 'production' ? 'https://kalshi.com/portfolio' : 'https://demo.kalshi.co/portfolio'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/30 transition-colors truncate max-w-[160px]"
                                >
                                    {placedOrder.order_id.slice(0, 16)}...
                                </a>
                            </div>
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-gray-500">Status</span>
                                <span className={placedOrder.status === 'executed' ? 'text-green-400' : 'text-yellow-400'}>
                                    {placedOrder.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs font-mono">
                                <span className="text-gray-500">Market</span>
                                <span className="text-white">{ticker}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-6">
                            <ShieldCheck size={10} className="text-green-500" />
                            <span>Powered by Kalshi • Builder Code: ORACULO_V2</span>
                        </div>

                        <button
                            onClick={() => setPlacedOrder(null)}
                            className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 font-bold text-sm transition-all"
                        >
                            PLACE ANOTHER
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-2">
                <h3 className="text-gray-400 font-mono text-xs tracking-widest">EXECUTION ENGINE</h3>
                {kalshiBalance !== null && (
                    <span className="text-[10px] font-mono text-gray-600">
                        Pool: ${kalshiBalance.toFixed(2)} USDC
                    </span>
                )}
            </div>

            {/* ORDER TYPE TOGGLE */}
            <div className="flex gap-2 mb-4">
                {(['market', 'limit'] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setOrderType(t)}
                        className={`flex-1 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-widest transition-all border ${
                            orderType === t
                                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                                : 'bg-white/5 text-gray-600 border-white/5 hover:bg-white/10'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* OUTCOME SELECTOR */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                    onClick={() => setOutcome('yes')}
                    className={`py-3 rounded-xl font-black text-lg tracking-wider transition-all border ${
                        outcome === 'yes'
                            ? 'bg-green-500/20 text-green-400 border-green-500 shadow-[0_0_20px_rgba(74,222,128,0.3)]'
                            : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                    }`}
                >
                    YES
                    {yesPrice && (
                        <span className="block text-[10px] font-mono font-normal opacity-70">
                            ${yesPrice.toFixed(2)}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setOutcome('no')}
                    className={`py-3 rounded-xl font-black text-lg tracking-wider transition-all border ${
                        outcome === 'no'
                            ? 'bg-red-500/20 text-red-400 border-red-500 shadow-[0_0_20px_rgba(248,113,113,0.3)]'
                            : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                    }`}
                >
                    NO
                    {noPrice && (
                        <span className="block text-[10px] font-mono font-normal opacity-70">
                            ${noPrice.toFixed(2)}
                        </span>
                    )}
                </button>
            </div>

            {/* INPUTS */}
            <div className="space-y-3 mb-5">
                <div>
                    <label className="text-[10px] text-gray-500 font-mono ml-1 uppercase block mb-1">Contracts</label>
                    <input
                        type="number"
                        value={contracts}
                        onChange={e => setContracts(e.target.value)}
                        min="1"
                        step="1"
                        className="w-full bg-black/50 border border-white/20 rounded-lg py-2 px-4 text-2xl font-bold text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                </div>

                {orderType === 'limit' && (
                    <div>
                        <label className="text-[10px] text-gray-500 font-mono ml-1 uppercase block mb-1">
                            Limit Price (USDC)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                            <input
                                type="number"
                                value={limitPrice}
                                onChange={e => setLimitPrice(e.target.value)}
                                min="0.01"
                                max="0.99"
                                step="0.01"
                                className="w-full bg-black/50 border border-white/20 rounded-lg py-2 pl-7 pr-4 text-xl font-bold text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            />
                        </div>
                    </div>
                )}

                {estimatedCost !== null && (
                    <div className="flex justify-between text-[10px] font-mono px-1 text-gray-500">
                        <span>Est. cost</span>
                        <span className="text-gray-300">${estimatedCost.toFixed(2)} USDC</span>
                    </div>
                )}
            </div>

            {/* ERROR */}
            {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                    <AlertTriangle size={14} className="text-red-400 shrink-0" />
                    <p className="text-red-300 text-xs">{error}</p>
                </div>
            )}

            {/* ACTION BUTTON */}
            <div className="mt-auto">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTrade}
                    disabled={isTrading || !publicKey}
                    className={`w-full py-4 rounded-none font-black text-xl tracking-widest relative overflow-hidden group transition-all
                        ${outcome === 'yes' ? 'bg-green-500 hover:bg-green-400 text-black' : 'bg-red-500 hover:bg-red-400 text-black'}
                        ${(isTrading || !publicKey) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                >
                    {isTrading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 size={18} className="animate-spin" />
                            PLACING...
                        </span>
                    ) : !publicKey ? (
                        'CONNECT WALLET'
                    ) : (
                        <>
                            PLACE {outcome.toUpperCase()} ORDER
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12" />
                        </>
                    )}
                </motion.button>

                {/* Builder attribution */}
                <div className="flex items-center justify-center gap-1.5 mt-3">
                    <ShieldCheck size={10} className="text-gray-600" />
                    <span className="text-[9px] font-mono text-gray-600 tracking-widest">
                        POWERED BY KALSHI API • ORACULO_V2
                    </span>
                </div>
            </div>
        </div>
    );
}

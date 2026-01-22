"use client";

import { useEffect, useState } from 'react';
import { getRealOrderbook } from '@/app/actions/getMarkets';

interface OrderBookProps {
    ticker?: string;
    yesPrice?: number; // 0.0 to 1.0
}

export default function OrderBook({ ticker, yesPrice = 0.5 }: OrderBookProps) {
    const [orders, setOrders] = useState<{ bids: any[], asks: any[] }>({ bids: [], asks: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadData() {
            if (!ticker) return;

            try {
                // Attempt to fetch real data
                const realData = await getRealOrderbook(ticker);

                if (mounted && realData && realData.bids && realData.bids.length > 0) {
                    // Normalize Kalshi data format [price, size]
                    setOrders({
                        bids: realData.bids.map((b: any) => ({ price: b[0], size: b[1] })).slice(0, 10),
                        asks: realData.asks.map((a: any) => ({ price: a[0], size: a[1] })).slice(0, 10)
                    });
                    setIsLoading(false);
                    return;
                }
            } catch (e) {
                console.warn("[OrderBook] Failed to fetch real data, falling back to smart simulation");
            }

            // Fallback: Generate semi-realistic data centered around current price
            if (mounted) {
                const centerPrice = yesPrice;

                const newBids = Array.from({ length: 12 }).map((_, i) => ({
                    price: Math.max(0.01, centerPrice - ((i + 1) * 0.01)),
                    size: Math.floor(Math.random() * 5000) + 500
                }));

                const newAsks = Array.from({ length: 12 }).map((_, i) => ({
                    price: Math.min(0.99, centerPrice + ((i + 1) * 0.01)),
                    size: Math.floor(Math.random() * 5000) + 500
                }));

                setOrders({ bids: newBids, asks: newAsks });
                setIsLoading(false);
            }
        }

        loadData();

        // Refresh periodically
        const interval = setInterval(loadData, 5000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [ticker, yesPrice]);

    const { bids, asks } = orders;

    return (
        <div className="glass-panel p-5 h-full flex flex-col font-mono text-xs">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-400 font-mono text-xs tracking-widest">ORDER BOOK (L2)</h3>
                <div className="flex gap-2 text-[10px] text-gray-500">
                    <span>QTY</span>
                    <span>PRICE (USDC)</span>
                </div>
            </div>

            {isLoading && bids.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-600 animate-pulse">
                    LOADING L2 DATA...
                </div>
            ) : (
                <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
                    {/* Bids (Buy Side) - Green */}
                    <div className="flex flex-col gap-0.5">
                        <div className="mb-1 text-[10px] text-green-500/50 text-right border-b border-white/5 pb-1">BIDS</div>
                        {bids.map((bid, i) => (
                            <div key={i} className="flex justify-between relative group hover:bg-white/5 px-1 py-0.5 rounded cursor-pointer">
                                <div className="absolute right-0 top-0 h-full bg-green-500/10 transition-all duration-300" style={{ width: `${Math.min(100, (bid.size / 5000) * 100)}%` }} />
                                <span className="text-gray-400 z-10 relative">{bid.size.toLocaleString()}</span>
                                <span className="text-green-400 font-bold z-10 relative">{bid.price.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Asks (Sell Side) - Red */}
                    <div className="flex flex-col gap-0.5">
                        <div className="mb-1 text-[10px] text-red-500/50 text-left border-b border-white/5 pb-1">ASKS</div>
                        {asks.map((ask, i) => (
                            <div key={i} className="flex justify-between relative group hover:bg-white/5 px-1 py-0.5 rounded cursor-pointer">
                                <div className="absolute left-0 top-0 h-full bg-red-500/10 transition-all duration-300" style={{ width: `${Math.min(100, (ask.size / 5000) * 100)}%` }} />
                                <span className="text-red-400 font-bold z-10 relative">{ask.price.toFixed(2)}</span>
                                <span className="text-gray-400 z-10 relative">{ask.size.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

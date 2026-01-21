"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function OrderBook() {
    const [orders, setOrders] = useState<{ bids: any[], asks: any[] }>({ bids: [], asks: [] });

    useEffect(() => {
        // Generate random data only on client mount to avoid hydration mismatch
        const newBids = Array.from({ length: 10 }).map((_, i) => ({ price: (40 - i) / 100, size: Math.random() * 5000 }));
        const newAsks = Array.from({ length: 10 }).map((_, i) => ({ price: (42 + i) / 100, size: Math.random() * 5000 }));
        setOrders({ bids: newBids, asks: newAsks });
    }, []);

    const { bids, asks } = orders;

    return (
        <div className="glass-panel p-5 h-full flex flex-col font-mono text-xs">
            <h3 className="text-gray-400 font-mono text-xs tracking-widest mb-4">ORDER BOOK (L2)</h3>

            <div className="flex-1 grid grid-cols-2 gap-4">
                {/* Bids */}
                <div className="flex flex-col gap-0.5">
                    {bids.map((bid, i) => (
                        <div key={i} className="flex justify-between relative group">
                            <div className="absolute right-0 top-0 h-full bg-green-500/10 transition-all duration-300" style={{ width: `${(bid.size / 5000) * 100}%` }} />
                            <span className="text-gray-400 z-10">{bid.size.toFixed(0)}</span>
                            <span className="text-green-400 font-bold z-10">{bid.price.toFixed(2)} SOL</span>
                        </div>
                    ))}
                </div>

                {/* Asks */}
                <div className="flex flex-col gap-0.5">
                    {asks.map((ask, i) => (
                        <div key={i} className="flex justify-between relative group">
                            <div className="absolute left-0 top-0 h-full bg-red-500/10 transition-all duration-300" style={{ width: `${(ask.size / 5000) * 100}%` }} />
                            <span className="text-red-400 font-bold z-10">{ask.price.toFixed(2)} SOL</span>
                            <span className="text-gray-400 z-10">{ask.size.toFixed(0)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

'use client';

import useSWR from 'swr';

export default function LiveTicker() {
    const { data: movers, error } = useSWR(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=solana,render-token,helium,jupiter-exchange-solana,bonk,dogwifhat,pyth-network&order=market_cap_desc&sparkline=false&price_change_percentage=24h',
        fetcher,
        { refreshInterval: 30000 }
    );

    // Default fallback while loading or if rate-limited
    const displayData = movers || [
        { symbol: 'SOL', price_change_percentage_24h: 0, total_volume: 0 },
        { symbol: 'JUP', price_change_percentage_24h: 0, total_volume: 0 },
        { symbol: 'RNDR', price_change_percentage_24h: 0, total_volume: 0 },
        { symbol: 'PYTH', price_change_percentage_24h: 0, total_volume: 0 },
    ];

    return (
        <div className="w-full bg-black border-y border-white/10 py-3 overflow-hidden relative z-30">
            <div className="flex animate-ticker hover:pause">
                {/* First Set */}
                <div className="flex gap-16 pr-16 items-center">
                    {displayData.map((m: any, i: number) => (
                        <div key={`set1-${i}`} className="flex items-center gap-2 text-sm font-mono shrink-0">
                            <span className="font-bold text-white uppercase">{m.symbol}</span>
                            <span className={m.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                                {m.price_change_percentage_24h?.toFixed(2)}%
                            </span>
                            <span className="text-gray-500 text-xs">
                                ${(m.total_volume / 1000000).toFixed(1)}M Vol
                            </span>
                        </div>
                    ))}
                </div>

                {/* Second Set (Duplicate for smooth loop) */}
                <div className="flex gap-16 pr-16 items-center">
                    {displayData.map((m: any, i: number) => (
                        <div key={`set2-${i}`} className="flex items-center gap-2 text-sm font-mono shrink-0">
                            <span className="font-bold text-white uppercase">{m.symbol}</span>
                            <span className={m.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                                {m.price_change_percentage_24h?.toFixed(2)}%
                            </span>
                            <span className="text-gray-500 text-xs">
                                ${(m.total_volume / 1000000).toFixed(1)}M Vol
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

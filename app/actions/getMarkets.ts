"use server";

// This action runs only on the server, keeping API keys safe
export async function getLiveMarkets() {
    try {
        // In a real prod app, we'd fetch from Kalshi/DFlow APIs here
        // const response = await fetch('https://api.kalshi.com/v2/events', {
        //   headers: { 'Authorization': process.env.KALSHI_API_KEY! }
        // });

        // For the hackathon demo, we return structured live-simulated data 
        // that mimics the Kalshi SDK response but from our "Source of Truth"

        // Fetch Real-time data from CoinGecko
        const res = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,render-token,fetch-ai,pepe,bonk,chainlink,jupiter-exchange-solana&order=market_cap_desc&sparkline=false&price_change_percentage=24h',
            { next: { revalidate: 30 } } // Cache for 30s
        );

        if (!res.ok) throw new Error('Failed to fetch from CG');

        const coins = await res.json();

        // Transform into "Prediction Markets"
        return coins.map((coin: any) => {
            const isBullish = coin.price_change_percentage_24h > 0;
            const probability = Math.min(95, Math.max(5, 50 + (coin.price_change_percentage_24h * 2)));

            let category = 'CRYPTO';
            if (['render-token', 'fetch-ai'].includes(coin.id)) category = 'SCIENCE';
            if (['pepe', 'bonk'].includes(coin.id)) category = 'CULTURE';
            if (['bitcoin', 'ethereum'].includes(coin.id)) category = 'ECONOMY';

            return {
                id: `live_${coin.id}`,
                ticker: `${coin.symbol.toUpperCase()}-PRED`,
                title: `Will ${coin.name} close Green today?`,
                category,
                probability: Math.floor(probability),
                volume: `$${(coin.total_volume / 1000000).toFixed(1)}M`,
                change24h: coin.price_change_percentage_24h,
                cortexSignal: isBullish ? 'BULLISH' : 'BEARISH'
            };
        });
    } catch (error) {
        console.error("Error fetching live markets:", error);
        return [];
    }
}

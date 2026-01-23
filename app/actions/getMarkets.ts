"use server";

import { kalshiClient, KalshiMarket } from '@/lib/kalshi';
import { KALSHI_MARKETS } from '@/lib/kalshiData';

export interface Market {
    id: string;
    ticker: string;
    title: string;
    category: string;
    probability: number;
    volume: string;
    change24h: number;
    cortexSignal?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    yesPrice?: number;
    noPrice?: number;
    expiration?: string;
}

/**
 * Fetch live markets from Kalshi API
 * Falls back to mock data if API fails
 */
export async function getLiveMarkets(): Promise<Market[]> {
    try {
        // console.log('[Kalshi] Fetching live markets...');

        // Try to fetch real Kalshi markets (increased limit to 100)
        const kalshiMarkets = await kalshiClient.getMarkets(100, 'open');

        if (kalshiMarkets && kalshiMarkets.length > 0) {
            // console.log(`[Kalshi] Fetched ${kalshiMarkets.length} live markets`);

            return kalshiMarkets.map((market: KalshiMarket) => {
                // Kalshi returns prices in cents (1-99).
                // Use last_price first for general "value", then ask (buy price), then bid. 
                // Using bid (sell price) alone causes "0%" display if no one is buying.
                const priceValue = market.last_price || market.yes_ask || market.yes_bid || 50;
                const probability = priceValue;

                // Determine signal based on recent activity
                let cortexSignal: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
                if (probability > 60) cortexSignal = 'BULLISH';
                else if (probability < 40) cortexSignal = 'BEARISH';

                // Format volume
                const volumeNum = market.volume_24h || market.volume || 0;
                const volumeStr = volumeNum >= 1000000
                    ? `$${(volumeNum / 1000000).toFixed(1)}M`
                    : volumeNum >= 1000
                        ? `$${(volumeNum / 1000).toFixed(0)}K`
                        : `$${volumeNum}`;

                return {
                    id: market.ticker,
                    ticker: market.ticker,
                    title: market.title || market.subtitle || market.ticker,
                    category: mapCategory(market.category),
                    probability,
                    volume: volumeStr,
                    change24h: 0, // Would need historical data
                    cortexSignal,
                    // For the "Price" display, show the 'Ask' (Buy) price if available, otherwise Last
                    yesPrice: (market.yes_ask || market.last_price || market.yes_bid || 50) / 100,
                    noPrice: (market.no_ask || (100 - (market.last_price || 50)) || market.no_bid || 50) / 100,
                    expiration: market.expiration_time
                };
            });
        }

        throw new Error('No markets returned from API');

    } catch (error) {
        console.error('[Kalshi] API error, using fallback data:', error);

        // Fallback to mock data
        return KALSHI_MARKETS.map(market => ({
            id: market.ticker,
            ticker: market.ticker,
            title: market.title,
            category: market.category,
            probability: Math.round(market.yesPrice * 100),
            volume: `$${(market.volume / 1000000).toFixed(1)}M`,
            change24h: 0,
            cortexSignal: market.yesPrice > 0.6 ? 'BULLISH' as const :
                market.yesPrice < 0.4 ? 'BEARISH' as const : 'NEUTRAL' as const,
            yesPrice: market.yesPrice,
            noPrice: market.noPrice,
            expiration: market.expiration
        }));
    }
}

/**
 * Fetch single market details
 */
export async function getMarketDetails(ticker: string): Promise<Market | null> {
    try {
        const market = await kalshiClient.getMarket(ticker);

        if (market) {
            const yesPriceCents = market.yes_bid ?? market.last_price ?? 50;
            return {
                id: market.ticker,
                ticker: market.ticker,
                title: market.title || market.ticker,
                category: mapCategory(market.category),
                probability: yesPriceCents,
                volume: `$${((market.volume_24h || 0) / 1000000).toFixed(1)}M`,
                change24h: 0,
                yesPrice: (market.yes_bid !== undefined && market.yes_bid !== null) ? market.yes_bid / 100 : undefined,
                noPrice: (market.no_bid !== undefined && market.no_bid !== null) ? market.no_bid / 100 : undefined,
                expiration: market.expiration_time
            };
        }

        // Fallback to mock
        const mockMarket = KALSHI_MARKETS.find(m => m.ticker === ticker);
        if (mockMarket) {
            return {
                id: mockMarket.ticker,
                ticker: mockMarket.ticker,
                title: mockMarket.title,
                category: mockMarket.category,
                probability: Math.round(mockMarket.yesPrice * 100),
                volume: `$${(mockMarket.volume / 1000000).toFixed(1)}M`,
                change24h: 0,
                yesPrice: mockMarket.yesPrice,
                noPrice: mockMarket.noPrice,
                expiration: mockMarket.expiration
            };
        }

        return null;
    } catch (error) {
        console.error('[Kalshi] Error fetching market details:', error);
        return null;
    }
}

/**
 * Get Real Orderbook Data
 */
export async function getRealOrderbook(ticker: string) {
    try {
        const orderbook = await kalshiClient.getOrderbook(ticker);
        if (orderbook && orderbook.orderbook) {
            return {
                bids: orderbook.orderbook.yes || [],
                asks: orderbook.orderbook.no || [] // Note: Structure depends on API response
            };
        }
        return null;
    } catch (e) {
        console.error("Error fetching real orderbook:", e);
        return null;
    }
}


/**
 * Map Kalshi categories to our categories
 */
function mapCategory(category?: string): string {
    if (!category) return 'POLITICS';

    const categoryMap: Record<string, string> = {
        'Politics': 'POLITICS',
        'Economics': 'ECONOMICS',
        'Crypto': 'CRYPTO',
        'Finance': 'ECONOMICS',
        'Tech': 'SCIENCE',
        'Science': 'SCIENCE',
        'Sports': 'CULTURE',
        'Entertainment': 'CULTURE',
        'Culture': 'CULTURE'
    };

    return categoryMap[category] || category.toUpperCase();
}

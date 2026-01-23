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
        // Fetch diverse events to ensure a perfect mix of categories
        const kalshiEvents = await kalshiClient.getEvents(150);

        if (kalshiEvents && kalshiEvents.length > 0) {
            const buckets: Record<string, any[]> = {
                CRYPTO: [],
                ECONOMICS: [],
                POLITICS: [],
                SCIENCE: [],
                CULTURE: [],
                OTHER: []
            };

            kalshiEvents.forEach(event => {
                if (event.markets && event.markets.length > 0) {
                    const eventMarkets = event.markets.map(market => {
                        const priceValue = market.last_price || market.yes_ask || market.yes_bid || 50;
                        const probability = priceValue;

                        let cortexSignal: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
                        if (probability > 60) cortexSignal = 'BULLISH';
                        else if (probability < 40) cortexSignal = 'BEARISH';

                        const volumeTotal = market.volume || 0;
                        const volume24h = market.volume_24h || 0;
                        const bestVolume = Math.max(volumeTotal, volume24h);

                        const volumeStr = bestVolume >= 1000000
                            ? `$${(bestVolume / 1000000).toFixed(1)}M`
                            : bestVolume >= 1000
                                ? `$${(bestVolume / 1000).toFixed(0)}K`
                                : `$${bestVolume}`;

                        return {
                            id: market.ticker,
                            ticker: market.ticker,
                            title: market.title || event.title || market.ticker,
                            category: mapCategory(event.category || market.category, market.title, market.ticker),
                            probability,
                            volume: volumeStr,
                            rawVolume: bestVolume,
                            change24h: 0,
                            cortexSignal,
                            yesPrice: (market.yes_ask || market.last_price || market.yes_bid || 50) / 100,
                            noPrice: (market.no_ask || (100 - (market.last_price || 50)) || market.no_bid || 50) / 100,
                            expiration: market.expiration_time
                        };
                    });

                    // Group primary market from each event into buckets
                    eventMarkets.sort((a, b) => b.rawVolume - a.rawVolume);
                    if (eventMarkets.length > 0) {
                        const m = eventMarkets[0];
                        const cat = buckets[m.category] ? m.category : 'OTHER';
                        buckets[cat].push(m);

                        // Add a secondary market if available to fill slots
                        if (eventMarkets.length > 1) {
                            buckets[cat].push(eventMarkets[1]);
                        }
                    }
                }
            });

            const selectedSet = new Set<string>();
            const result: any[] = [];
            const categoriesToEnsure = ['CRYPTO', 'ECONOMICS', 'POLITICS', 'SCIENCE', 'CULTURE'];
            const targetTotal = 100;
            const targetPerCategory = 20;

            // 1. Force equal distribution using buckets
            categoriesToEnsure.forEach(cat => {
                buckets[cat].sort((a, b) => b.rawVolume - a.rawVolume);
                buckets[cat].slice(0, targetPerCategory).forEach(m => {
                    if (!selectedSet.has(m.id)) {
                        selectedSet.add(m.id);
                        result.push(m);
                    }
                });
            });

            // 2. Fill until 100 with the overall best remaining markets
            const allPossible = Object.values(buckets).flat()
                .filter(m => !selectedSet.has(m.id))
                .sort((a, b) => b.rawVolume - a.rawVolume);

            for (const m of allPossible) {
                if (result.length >= targetTotal) break;
                selectedSet.add(m.id);
                result.push(m);
            }

            // 3. Shuffle (Fisher-Yates) for random categorical mix
            for (let i = result.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [result[i], result[j]] = [result[j], result[i]];
            }

            return result;
        }

        throw new Error('No events returned from API');
    } catch (error) {
        console.error('[Kalshi] API error, using fallback data:', error);

        // Fallback or Mock
        return KALSHI_MARKETS.map(market => ({
            id: market.ticker,
            ticker: market.ticker,
            title: market.title,
            category: market.category,
            probability: Math.round(market.yesPrice * 100),
            volume: `$${(market.volume / 1000000).toFixed(1)}M`,
            rawVolume: market.volume,
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
                category: mapCategory(market.category, market.title, market.ticker),
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
function mapCategory(category?: string, title?: string, ticker?: string): string {
    const rawCategory = category || '';
    const rawTitle = title || '';
    const rawTicker = ticker || '';
    const text = (rawCategory + ' ' + rawTitle + ' ' + rawTicker).toLowerCase();

    // Word boundary helper to avoid partial matches like "Kenneth" -> "eth"
    const has = (keywords: string[]) => keywords.some(word => {
        // Use a more flexible check for fragments like "ai" or "eth" but keep word boundaries for others
        if (word.length <= 3) {
            return new RegExp(`\\b${word}\\b`, 'i').test(text);
        }
        return text.includes(word.toLowerCase());
    });

    // 1. CRYPTO
    if (has(['crypto', 'btc', 'eth', 'sol', 'bitcoin', 'ethereum', 'solana', 'doge', 'xrp', 'binance', 'coinbase', 'block', 'chain', 'defi', 'nft'])) {
        return 'CRYPTO';
    }

    // 2. POLITICS
    if (has(['politic', 'election', 'trump', 'biden', 'harris', 'president', 'senate', 'congress', 'democrat', 'republican', 'cabinet', 'white house', 'supreme court', 'scotus', 'bill', 'legislation', 'vote', 'governor', 'mayor'])) {
        return 'POLITICS';
    }

    // 3. ECONOMICS
    if (has(['fed', 'rate', 'gdp', 'cpi', 'inflation', 'interest', 'recession', 'unemployment', 'yield', 'econom', 'financ', 'market cap', 'stock', 's&p', 'nasdaq', 'dow', 'index', 'payroll', 'housing', 'retail', 'pce'])) {
        return 'ECONOMICS';
    }

    // 4. SCIENCE & TECH
    if (has(['science', 'tech', 'ai', 'space', 'nasa', 'spacex', 'medical', 'fda', 'health', 'vaccine', 'climate', 'temperature', 'degree', 'storm', 'hurricane', 'weather', 'volcano'])) {
        return 'SCIENCE';
    }

    // 5. CULTURE (Sports & Ent)
    if (has(['nba', 'nfl', 'mlb', 'soccer', 'points', 'win', 'game', 'player', 'team', 'touchdown', 'score', 'basketball', 'football', 'betting', 'grammy', 'oscar', 'movie', 'box office'])) {
        return 'CULTURE';
    }

    // Fallback to the raw category from Kalshi if available, otherwise OTHER
    if (rawCategory && rawCategory.trim().length > 0) {
        return rawCategory.toUpperCase().replace(/_/g, ' ');
    }

    return 'OTHER';
}

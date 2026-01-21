export interface KalshiMarket {
    ticker: string;
    title: string;
    category: 'ECONOMICS' | 'POLITICS' | 'CRYPTO' | 'CULTURE';
    yesPrice: number;
    noPrice: number;
    volume: number;
    expiration: string;
    image?: string;
}

export const KALSHI_MARKETS: KalshiMarket[] = [
    {
        ticker: 'FED-MAR-26',
        title: 'Fed to cut interest rates in March 2026?',
        category: 'ECONOMICS',
        yesPrice: 0.12,
        noPrice: 0.88,
        volume: 1250000,
        expiration: '2026-03-20',
    },
    {
        ticker: 'BTC-250K-2026',
        title: 'Bitcoin to hit $250k before 2027?',
        category: 'CRYPTO',
        yesPrice: 0.45,
        noPrice: 0.55,
        volume: 3400000,
        expiration: '2026-12-31',
    },
    {
        ticker: 'US-GDP-Q1',
        title: 'US GDP Growth > 2.5% in Q1 2026?',
        category: 'ECONOMICS',
        yesPrice: 0.60,
        noPrice: 0.40,
        volume: 890000,
        expiration: '2026-04-25',
    },
    {
        ticker: 'TIKTOK-BAN',
        title: 'TikTok banned in US by June 2026?',
        category: 'POLITICS',
        yesPrice: 0.28,
        noPrice: 0.72,
        volume: 2100000,
        expiration: '2026-06-30',
    },
    {
        ticker: 'SOL-ETF-MAY',
        title: 'Solana ETF Approved by May 2026?',
        category: 'CRYPTO',
        yesPrice: 0.85,
        noPrice: 0.15,
        volume: 5600000,
        expiration: '2026-05-31',
    },
    {
        ticker: 'TAYLOR-SWIFT',
        title: 'Taylor Swift to endorse a candidate?',
        category: 'CULTURE',
        yesPrice: 0.33,
        noPrice: 0.67,
        volume: 450000,
        expiration: '2026-11-05',
    }
];

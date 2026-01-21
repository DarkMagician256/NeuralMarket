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
        ticker: 'FED-MAR-24',
        title: 'Fed to cut interest rates in March 2024?',
        category: 'ECONOMICS',
        yesPrice: 0.12,
        noPrice: 0.88,
        volume: 1250000,
        expiration: '2024-03-20',
    },
    {
        ticker: 'BTC-100K-2024',
        title: 'Bitcoin to hit $100k before 2025?',
        category: 'CRYPTO',
        yesPrice: 0.45,
        noPrice: 0.55,
        volume: 3400000,
        expiration: '2024-12-31',
    },
    {
        ticker: 'US-GDP-Q1',
        title: 'US GDP Growth > 2.5% in Q1 2024?',
        category: 'ECONOMICS',
        yesPrice: 0.60,
        noPrice: 0.40,
        volume: 890000,
        expiration: '2024-04-25',
    },
    {
        ticker: 'TIKTOK-BAN',
        title: 'TikTok banned in US by June 2024?',
        category: 'POLITICS',
        yesPrice: 0.28,
        noPrice: 0.72,
        volume: 2100000,
        expiration: '2024-06-30',
    },
    {
        ticker: 'ETH-ETF-MAY',
        title: 'Ethereum ETF Approved by May 2024?',
        category: 'CRYPTO',
        yesPrice: 0.75,
        noPrice: 0.25,
        volume: 5600000,
        expiration: '2024-05-31',
    },
    {
        ticker: 'TAYLOR-SWIFT',
        title: 'Taylor Swift to endorse a candidate?',
        category: 'CULTURE',
        yesPrice: 0.33,
        noPrice: 0.67,
        volume: 450000,
        expiration: '2024-11-05',
    }
];

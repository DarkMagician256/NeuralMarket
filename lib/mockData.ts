export const portfolioChartData = Array.from({ length: 24 }).map((_, i) => ({
    time: `${i}:00`,
    value: 1000 + Math.random() * 500 + (i * 50), // Volatile upward trend
}));

// --- MARKET DISCOVERY DATA ---

export const activePositions = [
    {
        id: "pos_1",
        ticker: "TRUMP2028-YES",
        entryPrice: 0.45,
        currentPrice: 0.62,
        amount: 1000,
        pnl: 170, // (0.62 - 0.45) * 1000
        pnlPercent: 37.7
    },
    {
        id: "pos_2",
        ticker: "BTC-100K-NO",
        entryPrice: 0.20,
        currentPrice: 0.15,
        amount: 5000,
        pnl: -250,
        pnlPercent: -25.0
    },
    {
        id: "pos_3",
        ticker: "AGI-2026-YES",
        entryPrice: 0.10,
        currentPrice: 0.12,
        amount: 10000,
        pnl: 200,
        pnlPercent: 20.0
    }
];

export const cortexLogs = [
    { time: "14:02:33", agent: "AGENT-01", message: "Analyzing Fed Minutes...", type: "info" },
    { time: "14:02:35", agent: "AGENT-01", message: "Sentiment Bearish. Score: 0.32", type: "warning" },
    { time: "14:03:01", agent: "ARBITRAGE", message: "Spread detected on SOL-1000", type: "success" },
    { time: "14:03:12", agent: "SYSTEM", message: "Latency check: 12ms", type: "info" },
];

export type MarketCategory = 'CRYPTO' | 'POLITICS' | 'ECONOMY' | 'SCIENCE' | 'CULTURE';

export interface Market {
    id: string;
    ticker: string;
    title: string;
    category: MarketCategory;
    probability: number;
    volume: string;
    cortexSignal?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    change24h: number;
}

export const generateHistory = (ticker: string) => {
    let price = 50;
    return Array.from({ length: 100 }, (_, i) => {
        const change = (Math.random() - 0.5) * 5; // Swing between -2.5 and +2.5
        price = Math.max(1, Math.min(99, price + change));
        return {
            time: `${i}`,
            price: Number(price.toFixed(2)),
            ma: Number((price + (Math.random() * 2)).toFixed(2)) // Fake moving average
        };
    });
};

export const marketCategories: MarketCategory[] = ['CRYPTO', 'POLITICS', 'ECONOMY', 'SCIENCE', 'CULTURE'];

export const markets: Market[] = [
    { id: 'm1', ticker: 'BTC-250K', title: 'Bitcoin > $250k by 2027?', category: 'CRYPTO', probability: 42, volume: '$12.5M', cortexSignal: 'BULLISH', change24h: 5.2 },
    { id: 'm2', ticker: 'TRUMP-2028', title: 'Donald Trump wins 2028 Election?', category: 'POLITICS', probability: 45, volume: '$45.2M', change24h: -1.2 },
    { id: 'm3', ticker: 'FED-RATE-CUT', title: 'Fed cuts rates in March 2026?', category: 'ECONOMY', probability: 85, volume: '$8.1M', cortexSignal: 'BEARISH', change24h: 0.5 },
    { id: 'm4', ticker: 'AGI-2027', title: 'AGI achieved by Q4 2027?', category: 'SCIENCE', probability: 12, volume: '$3.4M', change24h: 2.1 },
    { id: 'm5', ticker: 'GTA6-GOTY', title: 'GTA VI wins GOTY 2026?', category: 'CULTURE', probability: 65, volume: '$1.2M', change24h: -0.5 },
    { id: 'm6', ticker: 'SOL-FLIP-ETH', title: 'Solana flips Ethereum Market Cap?', category: 'CRYPTO', probability: 35, volume: '$9.8M', cortexSignal: 'BULLISH', change24h: 8.4 },
    { id: 'm7', ticker: 'MARS-LANDING', title: 'Humans land on Mars before 2030?', category: 'SCIENCE', probability: 8, volume: '$500k', change24h: 0.0 },
    { id: 'm8', ticker: 'RECESSION-2027', title: 'US Recession declared in 2027?', category: 'ECONOMY', probability: 45, volume: '$15.2M', change24h: 3.2 },
    { id: 'm9', ticker: 'TAYLOR-SPLIT', title: 'Taylor Swift & Travis Kelce split?', category: 'CULTURE', probability: 22, volume: '$4.5M', cortexSignal: 'NEUTRAL', change24h: -4.1 },
    { id: 'm10', ticker: 'SOL-ETF-STAKE', title: 'SOL ETF enables staking rewards?', category: 'CRYPTO', probability: 67, volume: '$2.1M', change24h: 1.1 },
    { id: 'm11', ticker: 'CHINA-TAIWAN', title: 'Conflict in Taiwan Strait 2026?', category: 'POLITICS', probability: 15, volume: '$22.1M', change24h: 0.2 },
    { id: 'm12', ticker: 'CANCER-CURE', title: 'FDA approves universal cancer vax?', category: 'SCIENCE', probability: 3, volume: '$800k', change24h: 0.1 },
    { id: 'm13', ticker: 'OIL-120', title: 'Crude Oil > $120/barrel?', category: 'ECONOMY', probability: 38, volume: '$6.7M', cortexSignal: 'BULLISH', change24h: 4.5 },
    { id: 'm14', ticker: 'AVENGERS-BOP', title: 'Avengers: Secret Wars > $3B Box Office?', category: 'CULTURE', probability: 55, volume: '$1.8M', change24h: -2.3 },
    { id: 'm15', ticker: 'X-BANKRUPT', title: 'X (Twitter) files for bankruptcy?', category: 'ECONOMY', probability: 10, volume: '$5.5M', cortexSignal: 'BEARISH', change24h: 1.5 },
    { id: 'm16', ticker: 'UK-REJOIN-EU', title: 'UK referendum to rejoin EU by 2028?', category: 'POLITICS', probability: 25, volume: '$11.2M', change24h: 0.1 },
    { id: 'm17', ticker: 'NLP-TURING', title: 'AI model passes rigorous Turing Test?', category: 'SCIENCE', probability: 60, volume: '$7.8M', cortexSignal: 'BULLISH', change24h: 6.7 },
    { id: 'm18', ticker: 'NFL-SUPERBOWL', title: 'Chiefs win Super Bowl LXI?', category: 'CULTURE', probability: 28, volume: '$25.4M', change24h: 5.5 },
    { id: 'm19', ticker: 'US-DEBT-DEFAULT', title: 'US defaults on sovereign debt?', category: 'ECONOMY', probability: 1, volume: '$40.1M', change24h: 0.0 },
    { id: 'm20', ticker: 'LINK-ATH', title: 'Chainlink breaks ATH in 2027?', category: 'CRYPTO', probability: 52, volume: '$3.9M', cortexSignal: 'BULLISH', change24h: 12.1 },
];

export const topMovers = [
    { ticker: 'LINK-ATH', change: '+12.1%' },
    { ticker: 'SOL-FLIP-ETH', change: '+8.4%' },
    { ticker: 'NLP-TURING', change: '+6.7%' },
    { ticker: 'TAYLOR-SPLIT', change: '-4.1%' },
    { ticker: 'OSCARS-BOP', change: '-2.3%' },
];

export interface Agent {
    id: string;
    name: string;
    role: 'MACRO' | 'CRYPTO' | 'SENTIMENT' | 'ARBITRAGE';
    status: 'SCANNING' | 'EXECUTING' | 'IDLE' | 'OFFLINE';
    pnl: number;
    latency: number;
    confidence: number;
}

export const agents: Agent[] = [
    { id: 'a1', name: 'MACRO-01', role: 'MACRO', status: 'SCANNING', pnl: 4.2, latency: 124, confidence: 85 },
    { id: 'a2', name: 'ARB-BOT-X', role: 'ARBITRAGE', status: 'EXECUTING', pnl: 12.8, latency: 45, confidence: 99 },
    { id: 'a3', name: 'SENTIMENT-V3', role: 'SENTIMENT', status: 'IDLE', pnl: -1.5, latency: 200, confidence: 60 },
    { id: 'a4', name: 'CRYPTO-LENS', role: 'CRYPTO', status: 'SCANNING', pnl: 8.4, latency: 89, confidence: 92 },
    { id: 'a5', name: 'NEWS-FEEDER', role: 'SENTIMENT', status: 'SCANNING', pnl: 0.0, latency: 150, confidence: 78 }
];

// --- LEADERBOARD DATA ---

export const leaderboardData = Array.from({ length: 50 }).map((_, i) => ({
    rank: i + 1,
    id: `trader_${i}`,
    wallet: `8x...${Math.random().toString(16).substr(2, 4).toUpperCase()}`,
    pnl: (Math.random() * 500) - (i * 5), // Higher rank = higher PnL
    winRate: Math.max(30, 95 - i),
    vol: Math.floor(Math.random() * 10) + 1, // in Millions
    cortexScore: Math.floor(Math.random() * 100)
}));

// --- TRANSACTION HISTORY ---

export interface Transaction {
    id: string;
    date: string;
    ticker: string;
    type: 'BUY' | 'SELL';
    amount: number;
    price: number;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

// Deterministic mock data for hydration stability
export const transactionHistory: Transaction[] = [
    { id: 'tx_1', date: '2026-01-20', ticker: 'BTC-100K', type: 'BUY', amount: 3500, price: 0.42, status: 'COMPLETED' },
    { id: 'tx_2', date: '2026-01-19', ticker: 'TRUMP-2028', type: 'SELL', amount: 1200, price: 0.61, status: 'COMPLETED' },
    { id: 'tx_3', date: '2026-01-18', ticker: 'AGI-2025', type: 'BUY', amount: 5000, price: 0.12, status: 'PENDING' },
    { id: 'tx_4', date: '2026-01-15', ticker: 'FED-RATE-CUT', type: 'BUY', amount: 10000, price: 0.85, status: 'COMPLETED' },
    { id: 'tx_5', date: '2026-01-12', ticker: 'SOL-FLIP-ETH', type: 'SELL', amount: 800, price: 0.18, status: 'FAILED' },
    { id: 'tx_6', date: '2026-01-10', ticker: 'GTA6-DELAY', type: 'BUY', amount: 250, price: 0.33, status: 'COMPLETED' },
    { id: 'tx_7', date: '2026-01-08', ticker: 'BTC-100K', type: 'SELL', amount: 2000, price: 0.45, status: 'COMPLETED' },
    { id: 'tx_8', date: '2026-01-05', ticker: 'TRUMP-2028', type: 'BUY', amount: 1500, price: 0.58, status: 'COMPLETED' },
];

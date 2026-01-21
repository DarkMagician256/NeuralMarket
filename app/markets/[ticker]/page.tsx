import { markets, generateHistory } from '@/lib/mockData';
import MarketHeader from '@/components/market-detail/MarketHeader';
import NeuralChart from '@/components/market-detail/NeuralChart';
import TradePanel from '@/components/market-detail/TradePanel';
import CortexTerminal from '@/components/market-detail/CortexTerminal';
import OrderBook from '@/components/market-detail/OrderBook';

export default async function MarketPage({ params }: { params: Promise<{ ticker: string }> }) {
    const { ticker } = await params;

    // Find market data (or default if not found)
    const market = markets.find(m => m.ticker === ticker) || {
        ...markets[0],
        ticker: ticker,
        title: `Prediction Market: ${ticker}`,
        change24h: 0
    };

    return (
        <div className="min-h-screen pb-20 space-y-6">
            {/* 1. Header Section */}
            <MarketHeader market={market} />

            {/* 2. Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[800px]">

                {/* Chart Area (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex-1 min-h-[400px] lg:min-h-[500px]">
                        <NeuralChart ticker={ticker} />
                    </div>

                    {/* Bottom Modules */}
                    <div className="h-auto lg:h-[250px] grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CortexTerminal ticker={ticker} />
                        <OrderBook />
                    </div>
                </div>

                {/* Trade Panel (4 cols) */}
                <div className="lg:col-span-4 h-auto lg:h-full">
                    <TradePanel ticker={ticker} />
                </div>
            </div>
        </div>
    );
}

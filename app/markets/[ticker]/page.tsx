import { getMarketDetails } from '@/app/actions/getMarkets';
import MarketHeader from '@/components/market-detail/MarketHeader';
import NeuralChart from '@/components/market-detail/NeuralChart';
import TradePanel from '@/components/market-detail/TradePanel';
import CortexTerminal from '@/components/market-detail/CortexTerminal';
import OrderBook from '@/components/market-detail/OrderBook';
import { KYCGate } from '@/components/compliance/KYCGate';

export default async function MarketPage({ params }: { params: Promise<{ ticker: string }> }) {
    const { ticker } = await params;

    // Fetch live market data
    const marketDetails = await getMarketDetails(ticker);

    const market = marketDetails || {
        id: ticker,
        ticker: ticker,
        title: `Market Not Found: ${ticker}`,
        category: 'UNKNOWN',
        probability: 50,
        volume: '$0',
        change24h: 0,
        yesPrice: 0.50,
        noPrice: 0.50
    };

    return (
        <div className="min-h-screen pb-20 space-y-6 px-4 md:px-0">
            {/* 1. Header */}
            {/* @ts-ignore */}
            <MarketHeader market={market} />

            {/* 2. Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[800px]">

                {/* Chart Area (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="flex-1 min-h-[400px] lg:min-h-[500px]">
                        <NeuralChart ticker={ticker} />
                    </div>

                    <div className="h-auto lg:h-[250px] grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CortexTerminal ticker={ticker} />
                        <OrderBook ticker={ticker} yesPrice={market.yesPrice} />
                    </div>
                </div>

                {/* Trade Panel (4 cols) — gated behind DFlow Proof KYC */}
                <div className="lg:col-span-4 h-auto lg:h-full">
                    <KYCGate>
                        <TradePanel
                            ticker={ticker}
                            yesPrice={market.yesPrice}
                            noPrice={market.noPrice}
                        />
                    </KYCGate>
                </div>
            </div>
        </div>
    );
}

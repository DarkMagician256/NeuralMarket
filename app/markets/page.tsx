import { getLiveMarkets } from '@/app/actions/getMarkets';
import MarketsPageContent from '@/components/markets/MarketsPageContent';

export const revalidate = 30; // Revalidate every 30 seconds

export default async function MarketsPage() {
    // Fetch real Kalshi markets on the server (now fetching 100)
    const markets = await getLiveMarkets();

    // Calculate stats
    const totalVolume = markets.reduce((acc, m) => {
        let vol = parseFloat(m.volume.replace(/[$,KM]/g, '')) || 0;
        if (m.volume.includes('M')) vol *= 1000000;
        else if (m.volume.includes('K')) vol *= 1000;
        return acc + vol;
    }, 0);

    return <MarketsPageContent markets={markets} totalVolume={totalVolume} />;
}

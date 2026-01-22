import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-300 font-sans">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8 font-mono">Last Updated: January 21, 2026</p>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-bold text-white mb-4">1. Data Collection Philosophy</h2>
                    <p>
                        NeuralMarket is designed to minimize data collection. As an on-chain interface, we rely primarily on public blockchain data. However, to provide features like "Agent Telemetry" and "Leaderboards," limited data collection is necessary.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">2. Blockchain Data (Public)</h2>
                    <p>
                        Please be aware that your transactions on the Solana blockchain are public, immutable, and permanent.
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Wallet Addresses:</strong> Your wallet address is visible on-chain regarding trade interaction.</li>
                        <li><strong>Trade History:</strong> All trades executed via `NeuralVault` are permanently recorded on the Solana ledger.</li>
                    </ul>
                    <p className="mt-2 text-yellow-500/80 text-sm">
                        NeuralMarket cannot "delete" your transaction history from the blockchain, as we do not control the distributed ledger.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">3. Off-Chain Data (Supabase)</h2>
                    <p>
                        We use limited off-chain storage for specific features:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Agent Thoughts:</strong> When running an AI Agent, its internal reasoning logs (telemetry) are streamed to our database to display on the dashboard.</li>
                        <li><strong>User Settings:</strong> Non-critical preferences (theme, notification settings) may be stored locally or in our database linked to your public key.</li>
                        <li><strong>Ephemeral Logs:</strong> We do not store IP addresses for trading activity permanently.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">4. Third-Party Sharing</h2>
                    <p>
                        We do not sell your data. However, interacting with integrated services implies data sharing:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Kalshi:</strong> If you connect a Kalshi account, your trading data is subject to Kalshi's privacy policy.</li>
                        <li><strong>RPC Providers:</strong> We use Helius/Triton for RPC nodes. They may see your IP address when you broadcast a transaction.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">5. Rights & Contact</h2>
                    <p>
                        Under GDPR and CCPA, you have rights regarding your personal data. To request data deletion (for off-chain data only), please contact: <span className="text-cyan-400 font-mono">legal@neuralmarket.io</span>.
                    </p>
                </section>
            </div>
        </div>
    );
}

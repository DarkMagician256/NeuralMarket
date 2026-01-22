import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function RiskDisclosure() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-300 font-sans">
            <div className="flex items-center gap-4 mb-6 text-red-500">
                <AlertTriangle size={40} />
                <h1 className="text-3xl md:text-4xl font-bold text-white">Risk Disclosure</h1>
            </div>
            <p className="text-sm text-gray-500 mb-8 font-mono">Last Updated: January 21, 2026</p>

            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl mb-8">
                <p className="font-bold text-red-200">
                    CRITICAL WARNING: CRYPTOCURRENCY TRADING AND EVENT MARKETS INVOLVE A SUBSTANTIAL RISK OF LOSS AND ARE NOT SUITABLE FOR EVERY INVESTOR. YOU COULD LOSE ALL OF YOUR INVESTED CAPITAL.
                </p>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-bold text-white mb-4">1. Smart Contract Risks</h2>
                    <p>
                        NeuralMarket utilizes the `NeuralVault` smart contract on the Solana blockchain. While we perform internal audits, smart contracts are experimental software. Bugs, hacks, or exploits could result in the irreversible loss of funds.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">2. Prediction Market Volatility</h2>
                    <p>
                        Binary options and event contracts are "all-or-nothing" instruments. If an event outcome resolves against your position, the value of that position becomes zero ($0). Volatility can be extreme as events approach resolution deadlines.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">3. AI & Automation Risks</h2>
                    <p>
                        Agents powered by ElizaOS are probabilistic tools, not clairvoyant entities.
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Hallucinations:</strong> AI models may generate convincing but factually incorrect analysis.</li>
                        <li><strong>Execution Errors:</strong> Automated bots may fail to execute trades during periods of high network congestion.</li>
                        <li><strong>Algorithm Drift:</strong> Market conditions may render a previously profitable strategy userless.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">4. Solana Network Risks</h2>
                    <p>
                        The Solana blockchain may experience "beta" performance issues, including congestion, dropped transactions, or RPC node failures. These infrastructure issues may prevent you from closing a position before market resolution.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">5. Regulatory Status</h2>
                    <p>
                        While Kalshi is CFTC-regulated, crypto-assets used to bridge to Kalshi (like USDC/SOL) carry their own regulatory uncertainties. Changes in laws or regulations in your jurisdiction could adversely affect your ability to use this Platform.
                    </p>
                </section>
            </div>
        </div>
    );
}

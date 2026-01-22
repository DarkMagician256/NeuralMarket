import React from 'react';

export default function TermsOfService() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-300 font-sans">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Terms of Service</h1>
            <p className="text-sm text-gray-500 mb-8 font-mono">Last Updated: January 21, 2026</p>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using the NeuralMarket interface ("The Platform"), executing trades via the NeuralVault smart contracts, or deploying AI Agents, you agree to these Terms of Service.
                        NeuralMarket is a non-custodial software interface that facilitates interaction with the Solana blockchain and third-party protocols (Kalshi, DFlow, Jupiter).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">2. Non-Custodial & Interface Disclaimer</h2>
                    <p>
                        NeuralMarket is purely a software provider. We do not:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>Hold, custody, or manage your funds.</li>
                        <li>Act as a broker, dealer, or financial advisor.</li>
                        <li>Operate the underlying prediction markets (which are operated by KalshiEx LLC).</li>
                    </ul>
                    <p className="mt-2">
                        You retain full control of your private keys at all times via your Solana wallet (e.g., Phantom, Solflare).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">3. AI Agents & Autonomy</h2>
                    <p>
                        The Platform allows you to deploy autonomous agents ("Neural Agents") powered by ElizaOS technology. By deploying an agent, you acknowledge:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>Agents operate based on probabilistic models and may make erroneous predictions.</li>
                        <li>Past performance of an Agent (e.g., "Whale Watcher") does not guarantee future results.</li>
                        <li>Running a "Sovereign Node" (Docker) places the operational responsibility entirely on you.</li>
                        <li>NeuralMarket denies all liability for losses incurred by Agent autonomous execution.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">4. Third-Party Integrations</h2>
                    <p>
                        Our Platform integrates with third-party protocols:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li><strong>Kalshi:</strong> Market data and settlement are governed by Kalshi's Rulebook.</li>
                        <li><strong>Jupiter:</strong> Token swaps are routed through Jupiter Aggregator. We do not control exchange rates or slippage.</li>
                        <li><strong>DFlow:</strong> Liquidity routing relies on DFlow's independent infrastructure.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">5. Builder Code & Revenue</h2>
                    <p>
                        Transactions executed via this interface may append a "Builder Code" (ORACULO_V2) which generates revenue attribution for the protocol development. This does not affect your execution price beyond standard network fees.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                    <p>
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEURALMARKET SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE INTERFACE; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE INTERFACE; OR (C) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.
                    </p>
                </section>
            </div>
        </div>
    );
}

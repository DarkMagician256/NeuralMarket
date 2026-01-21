
import React from 'react';

export default function RiskDisclosure() {
    return (
        <article className="prose prose-invert prose-red max-w-none">
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2">RISK DISCLOSURE</h1>
            <p className="text-gray-500 font-mono text-sm mb-8 uppercase tracking-widest">Last Updated: January 20, 2026</p>

            <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-lg mb-8">
                <h2 className="text-red-400 font-bold text-lg mb-2">CRITICAL WARNING</h2>
                <p className="text-gray-300 text-sm">
                    Trading cryptocurrency, prediction markets, and using AI automation involves a substantial risk of loss and is not suitable for every investor. You could lose all of your deposited funds.
                </p>
            </div>

            <div className="space-y-8 text-justify">
                <section>
                    <h3 className="text-xl font-bold text-white mb-3">1. AI MODEL RISK</h3>
                    <p>
                        Neural Market relies on probabilistic Artificial Intelligence models ("Cortex Agents").
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Hallucinations:</strong> AI models can produce false, misleading, or nonsensical outputs ("hallucinations"). An agent might execute a trade based on a "false positive" signal.</li>
                        <li><strong>Market Adaptation:</strong> Past performance of the AI models in backtesting or simulation does not guarantee future results. Market conditions can change rapidly, rendering models obsolete.</li>
                        <li><strong>Black Box Nature:</strong> The decision-making process of neural networks is opaque. It may not always be possible to determine why an agent took a specific action.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-3">2. SMART CONTRACT RISK</h3>
                    <p>
                        The Protocol operates on smart contracts running on the Solana Blockchain. While we strive for security:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Bugs & Exploits:</strong> Code vulnerabilities could be exploited by malicious actors, leading to the theft of funds locked in the protocol.</li>
                        <li><strong>Composability Risk:</strong> Interactions with other DeFi protocols (e.g., DEXs, Oracles) introduce additional points of failure.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-3">3. MARKET & LIQUIDITY RISK</h3>
                    <p>
                        Assets traded on Neural Market are subject to extreme volatility.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Slippage:</strong> Low liquidity environments can result in significant slippage, meaning you execute trades at a worse price than expected.</li>
                        <li><strong>Flash Crashes:</strong> Automated liquidations and high-frequency trading can cause rapid price collapses in seconds.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-3">4. REGULATORY RISK</h3>
                    <p>
                        The regulatory landscape for cryptocurrencies, AI, and prediction markets is evolving. New regulations or enforcement actions could impact the functionality of The Protocol or restrict your ability to access it.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-3">5. USER RESPONSIBILITY</h3>
                    <p>
                        You acknowledge that you are solely responsible for securing your wallet, managing your private keys, and verifying the parameters of any AI agent you deploy. Neural Market developers assume no responsibility for user error.
                    </p>
                </section>
            </div>
        </article>
    );
}

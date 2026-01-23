import React from 'react';

export default function RiskPage() {
    return (
        <div className="space-y-8 text-gray-300">
            <div className="border-b border-red-500/20 pb-6">
                <h1 className="text-3xl font-bold text-red-500 mb-2">CRITICAL RISK DISCLOSURE</h1>
                <p className="text-sm text-gray-500">Last Updated: January 23, 2026</p>
                <p className="text-sm text-gray-500">Mandatory reading before operating.</p>
            </div>

            <section className="bg-red-900/10 border border-red-500/30 p-6 rounded-lg space-y-4">
                <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span> RISK OF TOTAL LOSS
                </h2>
                <p>
                    Trading crypto-assets, derivatives, and prediction markets carries <strong>EXTREME</strong> risk.
                    You could lose the entirety of the funds (SOL/USDC) deposited in your agents or wallets.
                    <strong>Never trade with money you cannot afford to lose.</strong>
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">1. SMART CONTRACT RISKS</h2>
                <p>
                    NeuralVault is experimental software. Although internally audited, it may contain unforeseen "bugs" or vulnerabilities resulting in fund loss.
                    By using the protocol, you agree that NeuralMarket S.A.P.I. de C.V. is not liable for failures in the Solana Blockchain code, Anchor Framework, or third-party programs (Jupiter, DFlow).
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">2. REGULATORY RISKS (MEXICO)</h2>
                <p>
                    The legal framework for Virtual Assets is constantly evolving. Changes in the Fintech Law, provisions from Banco de México (Banxico), or the FIU (UIF) could affect service availability.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">3. PREDICTION MARKET RISKS (KALSHI)</h2>
                <p>
                    Prediction markets are binary and volatile. Event resolution depends on external Oracles.
                    Disputes in Oracle resolution (e.g., "Who won the election?") are outside NeuralMarket's control.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">4. AUTONOMOUS AGENTS RISKS (AI & HARDWARE)</h2>
                <ul className="list-disc pl-5 mt-2 text-sm space-y-2">
                    <li>
                        <strong>Probabilistic Nature:</strong> Artificial Intelligence models (DeepSeek R1, GPT-4) are probabilistic, not deterministic. An Agent may "hallucinate" confident but incorrect market predictions.
                    </li>
                    <li>
                        <strong>Local Hardware Failure:</strong> When running in <strong>Local Mode</strong>, the Agent's uptime depends entirely on your hardware. Power outages, internet disconnections, or "Sleep Mode" on your PC will stop the Agent from managing positions, potentially leading to liquidation losses.
                    </li>
                    <li>
                        <strong>Execution Latency:</strong> Local models may suffer from inference latency compared to HFT (High-Frequency Trading) bots, resulting in slippage.
                    </li>
                </ul>
            </section>

            {/* SEPARATOR */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-12 opacity-50"></div>

            {/* SECTION 2: INTERNATIONAL REGULATORY WARNINGS */}
            <section className="space-y-6 bg-black/20 p-6 rounded-xl border border-white/5">
                <h2 className="text-xl font-semibold text-orange-500 flex items-center gap-2">
                    <span className="text-2xl">🌐</span> INTERNATIONAL REGULATORY WARNINGS
                </h2>

                <div className="grid grid-cols-1 gap-4 text-sm text-gray-400">
                    <div className="bg-orange-900/10 border border-orange-500/20 p-4 rounded">
                        <strong className="text-orange-300 block mb-2">Lack of Protection in Foreign Jurisdictions</strong>
                        <p>
                            If you access NeuralMarket from outside Mexico, you likely DO NOT benefit from the protections of your local financial regulator (e.g., FCA in UK, SEC in USA, ASIC in Australia).
                            Smart Contract transactions are irreversible and usually uninsured.
                        </p>
                    </div>

                    <div>
                        <strong className="text-white block mb-1">USA Residents:</strong>
                        <p>
                            NeuralMarket is an interface layer. While Kalshi markets are regulated by the CFTC, the NeuralVault autonomous agent layer is an experimental protocol not registered with the CFTC or SEC.
                            <strong>U.S. users operate at their own risk regarding the use of unhosted wallets and AI agents.</strong>
                        </p>
                    </div>

                    <div>
                        <strong className="text-white block mb-1">UK Residents:</strong>
                        <p>
                            The Financial Conduct Authority (FCA) has banned the sale of crypto-derivatives to retail consumers.
                            <strong>This service is not intended for UK retail clients.</strong>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

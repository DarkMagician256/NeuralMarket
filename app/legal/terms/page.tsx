
import React from 'react';

export default function TermsOfService() {
    return (
        <article className="prose prose-invert prose-cyan max-w-none">
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2">TERMS OF SERVICE</h1>
            <p className="text-gray-500 font-mono text-sm mb-8 uppercase tracking-widest">Last Updated: January 20, 2026</p>

            <div className="space-y-8 text-justify">
                <section>
                    <h3 className="text-xl font-bold text-white mb-3">1. ACCEPTANCE OF TERMS</h3>
                    <p>
                        By accessing, interfacing with, or utilizing the Neural Market protocol ("The Protocol"), including its Artificial Intelligence agents ("Cortex AI") and smart contracts on the Solana Blockchain, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. The Protocol is a decentralized, non-custodial software interface. If you do not agree, you must immediately discontinue use.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-3">2. NATURE OF THE PROTOCOL</h3>
                    <p>
                        Neural Market is an experimental technology stack comprising:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Non-Custodial Interface:</strong> We do not hold, control, or have access to your private keys or digital assets. You retain full control and responsibility for your Solana wallet.</li>
                        <li><strong>AI Autonomy:</strong> The "Cortex Agents" are autonomous software scripts intended for analysis and automated execution. They operate based on probabilistic models and may make erroneous predictions or trades. <strong>You accept full liability for any actions triggered by the agents you activate.</strong></li>
                        <li><strong>On-Chain Execution:</strong> All transactions are executed directly on the Solana Blockchain. Once verified, transactions are irreversible.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-3">3. NO FINANCIAL ADVICE</h3>
                    <p>
                        The data, signals, and autonomous actions provided by Neural Market and its AI agents are for informational and utility purposes only. <strong>Nothing in this interface constitutes financial, investment, legal, or tax advice.</strong> You are solely responsible for your investment decisions. The use of high-frequency trading tools involves significant risk of loss.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-3">4. RISKS & LIABILITY DISCLAIMER</h3>
                    <p>
                        THE PROTOCOL IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED.
                    </p>
                    <p className="mt-2">
                        We shall not be liable for any damages arising from:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Smart contract vulnerabilities, bugs, or exploits.</li>
                        <li>Failure, hallucination, or erratic behavior of AI Agents.</li>
                        <li>Network failures, latency, or congestion on the Solana Blockchain.</li>
                        <li>Loss of private keys or unauthorized access to your wallet.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-3">5. USER REPRESENTATIONS</h3>
                    <p>
                        By using The Protocol, you represent that:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>You are of legal age and capacity to enter into this agreement.</li>
                        <li>You are not a citizen or resident of any jurisdiction where decentralized prediction markets or AI trading are prohibited (Restricted Jurisdictions).</li>
                        <li>You understand the technical risks associated with blockchain technology and AI.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-3">6. GOVERNING LAW & DISPUTE RESOLUTION</h3>
                    <p>
                        Given the decentralized nature of The Protocol, these Terms shall be governed by the laws of the decentralised web principles where applicable, or default to the laws of Panama for corporate disputes. Any dispute arising under these Terms shall be resolved through binding arbitration.
                    </p>
                </section>
            </div>
        </article>
    );
}

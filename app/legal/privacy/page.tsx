
import React from 'react';

export default function PrivacyPolicy() {
    return (
        <article className="prose prose-invert prose-cyan max-w-none">
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2">PRIVACY POLICY</h1>
            <p className="text-gray-500 font-mono text-sm mb-8 uppercase tracking-widest">Last Updated: January 20, 2026</p>

            <div className="space-y-8 text-justify">
                <section>
                    <h3 className="text-xl font-bold text-white mb-3">1. DECENTRALIZATION & DATA MINIMIZATION</h3>
                    <p>
                        Neural Market is built on principles of privacy and decentralization. We do not maintain user accounts, passwords, or collect traditional personal identification information (PII) such as names, addresses, or phone numbers.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-3">2. DATA WE COLLECT</h3>
                    <p>
                        When you interact with The Protocol, we may collect or process:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Public Blockchain Data:</strong> Your wallet address (Public Key) and transaction history are publicly available on the Solana Blockchain. This information is immutable and transparent.</li>
                        <li><strong>Telemetry Data:</strong> We may unintentionally collect anonymous telemetry data regarding interface usage (e.g., session duration, error logs) to improve system stability. This data is not linked to your identity.</li>
                        <li><strong>Local Service Storage:</strong> Your browser may store local configuration settings for the AI Agents. This data remains on your device.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-3">3. HOW WE USE YOUR DATA</h3>
                    <p>
                        Since we do not collect PII, our use of data is limited to:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Facilitating the connection between your wallet and the Solana Blockchain.</li>
                        <li>Executed trading commands initiated by your configured AI Agents.</li>
                        <li>Displaying your portfolio performance and history on the interface.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-3">4. THIRD-PARTY SERVICES</h3>
                    <p>
                        The Protocol may integrate with third-party services such as RPC nodes (e.g., Helius, Triton) or data providers. These services may collect your IP address or request metadata. We encourage you to review their respective privacy policies. We are not responsible for the privacy practices of third-party nodes.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-white mb-3">5. ON-CHAIN PRIVACY WARNING</h3>
                    <p className="p-4 bg-yellow-500/10 border-l-4 border-yellow-500 text-gray-300">
                        <strong>IMPORTANT:</strong> Transactions on the Solana Blockchain are public and permanent. Anyone can view the transactions associated with your wallet address. Do not use this liquidity protocol for transactions you wish to keep private.
                    </p>
                </section>
            </div>
        </article>
    );
}

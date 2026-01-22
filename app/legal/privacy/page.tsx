import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="space-y-8 text-gray-300">
            <div className="border-b border-white/10 pb-6">
                <h1 className="text-3xl font-bold text-white mb-2">PRIVACY POLICY</h1>
                <p className="text-sm text-gray-500">In compliance with the Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP - Mexico).</p>
                <p className="text-sm text-gray-500">Fast Controller: NeuralMarket S.A.P.I. de C.V. (In Incorporation)</p>
            </div>

            {/* SECTION 1: MEXICAN PRIVACY STANDARD */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">1. IDENTITY AND DOMICILE (MEXICO)</h2>
                <p>
                    NeuralMarket, domiciled specifically for legal notifications in Mexico City, Mexico, is responsible for the processing of your personal data,
                    committing to safeguard it according to principles of legality, consent, information, and responsibility.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">2. DATA WE COLLECT (AND PUBLIC DATA)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-white/10 p-4 rounded">
                        <h3 className="font-bold text-white mb-2">Off-Chain Data (Private)</h3>
                        <p className="text-sm">Technical telemetry, UI preferences, and error logs stored on our secure servers (Supabase).</p>
                    </div>
                    <div className="border border-white/10 p-4 rounded bg-white/5">
                        <h3 className="font-bold text-white mb-2">On-Chain Data (Public)</h3>
                        <p className="text-sm">
                            Your Public Wallet Address, transaction history, balances, and Agent metadata.
                            <br /><br />
                            <span className="text-yellow-500 text-xs">LEGAL NOTE: Information recorded on the Solana Blockchain is public, immutable, and decentralized. NeuralMarket technically CANNOT edit, delete, or anonymize this data once mined.</span>
                        </p>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">3. PURPOSE OF PROCESSING</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>To provide access to the market visualization interface.</li>
                    <li>To execute technical instructions for Agent creation (Software License).</li>
                    <li>To comply with legal obligations and fraud prevention.</li>
                </ul>
                <p><strong>We do not sell your data to third parties.</strong></p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">4. ARCO RIGHTS (For Mexican Residents)</h2>
                <p>
                    You have the right to Access, Rectify, Cancel, or Oppose (ARCO) the processing of your <strong>Off-Chain</strong> personal data.
                    To exercise these rights, send a request to <code>legal@neuralmarket.xyz</code>.
                    <br />
                    <em>Note: ARCO rights are not applicable to immutable information recorded on the Blockchain.</em>
                </p>
            </section>

            {/* SEPARATOR */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-12 opacity-50"></div>

            {/* SECTION 2: INTERNATIONAL PRIVACY ADDENDUM */}
            <section className="space-y-6 bg-black/20 p-6 rounded-xl border border-white/5">
                <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                    <span className="text-2xl">🛡️</span> INTERNATIONAL PRIVACY ADDENDUM (GDPR / CCPA)
                </h2>

                <div className="space-y-4 text-sm text-gray-400">
                    <div>
                        <strong className="text-white block mb-1">European Union (GDPR Notice):</strong>
                        <p>
                            For users in the EEA, we operate as a Data Controller. The legal basis for processing your Wallet Address is the "Performance of a Contract" (executing your Agent deployment).
                            Please note that the "Right to Erasure" (Right to be Forgotten) <strong>cannot technically be applied</strong> to data committed to the Solana Blockchain, as it is immutable technology.
                        </p>
                    </div>

                    <div>
                        <strong className="text-white block mb-1">California, USA (CCPA/CPRA Notice):</strong>
                        <p>
                            We do not "sell" your personal information as defined by the CCPA.
                            Residents of California may request a disclosure of the categories of information collected by contacting our Legal Department.
                        </p>
                    </div>

                    <div>
                        <strong className="text-white block mb-1">Cross-Border Transfer:</strong>
                        <p>
                            Your data may be processed in servers located in the United States or Mexico. By using the service, you consent to this international transfer.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

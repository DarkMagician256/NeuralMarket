import React from 'react';

export default function TermsPage() {
    return (
        <div className="space-y-8 text-gray-300">
            <div className="border-b border-white/10 pb-6">
                <h1 className="text-3xl font-bold text-white mb-2">TERMS OF SERVICE</h1>
                <p className="text-sm text-gray-500">Last Updated: January 21, 2026</p>
                <p className="text-sm text-gray-500">Jurisdiction: Mexico City, Mexico (Primary)</p>
            </div>

            {/* SECTION 1: MEXICAN LEGAL FRAMEWORK (PRIMARY) */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">1. NATURE OF SERVICE & ACCEPTANCE (MEXICO)</h2>
                <p>
                    Welcome to <strong>NeuralMarket</strong>. By accessing or using our interface, you agree to these Terms and Conditions.
                </p>
                <div className="bg-blue-900/10 border-l-4 border-blue-500 p-4 rounded-r">
                    <p className="font-semibold text-blue-200">NON-FINANCIAL NATURE DISCLAIMER:</p>
                    <p className="text-sm mt-2">
                        NeuralMarket operates exclusively as a <strong>Technology Service Provider (SaaS)</strong> under the Commercial Code of Mexico.
                        <strong>We are NOT a regulated Financial Technology Institution (ITF)</strong>, nor an Electronic Payment Fund Institution (IFPE) under the Mexican Fintech Law, as we:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                        <li>Do NOT take custody of user funds or Virtual Assets at any time.</li>
                        <li>Do NOT solicit funds from the general public.</li>
                        <li>Do NOT offer guaranteed investment advice.</li>
                    </ul>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">2. PROTOCOL FEES & LICENSING</h2>
                <p>
                    The use of the "NeuralVault" infrastructure incurs a software licensing cost.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>
                        <strong>Deployment License:</strong> You acknowledge that the payment of <strong>0.05 SOL (Solana)</strong> upon Agent creation constitutes a
                        <strong>Perpetual, Non-Refundable Software Use License</strong>. This payment is NOT a deposit, investment, or security bond.
                    </li>
                    <li>
                        <strong>Tax Nature:</strong> For tax purposes in Mexico, this payment is considered a digital service alienation.
                    </li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">3. VIRTUAL ASSETS & RISKS (MEXICAN FINTECH LAW)</h2>
                <p>
                    Pursuant to Article 30 of the Mexican Fintech Law and Banco de México provisions:
                </p>
                <p className="font-mono text-sm bg-black/30 p-3 rounded border border-white/5">
                    "Virtual Assets (cryptocurrencies) are NOT legal tender in Mexico and are not backed by the Federal Government or Banco de México."
                </p>
                <p>
                    You assume all operational, technological, and financial risks derived from using the Solana network and DeFi protocols (Jupiter, Kalshi, DFlow).
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">4. AUTONOMOUS AGENT LIABILITY (AI)</h2>
                <p>
                    "Agents" deployed via NeuralMarket are automation tools executed by the user.
                    NeuralMarket provides the code ("the tool"), but <strong>DOES NOT manage or control</strong> the Agent's decisions once deployed.
                    The user is the sole owner and responsible party for operations executed by their Agent.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-white">5. ANTI-MONEY LAUNDERING (AML/KYC)</h2>
                <p>
                    Although NeuralMarket is a non-custodial interface, we adhere to international standards and observe the
                    Mexican Federal Law for the Prevention and Identification of Operations with Illicit Resources (LFPIORPI).
                    We reserve the right to block IP addresses or wallets sanctioned by OFAC or Mexican authorities.
                </p>
            </section>

            {/* SEPARATOR */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-12 opacity-50"></div>

            {/* SECTION 2: INTERNATIONAL REGULATORY ADDENDUM */}
            <section className="space-y-6 bg-black/20 p-6 rounded-xl border border-white/5">
                <h2 className="text-xl font-semibold text-yellow-500 flex items-center gap-2">
                    <span className="text-2xl">🌍</span> INTERNATIONAL REGULATORY ADDENDUM (2026)
                </h2>
                <p className="text-sm italic text-gray-400">
                    To comply with global financial regulations and the policies of our partners (Kalshi, DFlow), access to NeuralMarket is restricted in certain jurisdictions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PROHIBITED */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-red-500 text-sm border-b border-red-500/20 pb-2">❌ PROHIBITED JURISDICTIONS (Hard Block)</h3>
                        <p className="text-xs text-gray-400">
                            Access is strictly forbidden. Any attempt to circumvent these blocks via VPN is a violation of Terms.
                        </p>
                        <ul className="list-disc pl-4 text-xs space-y-1 text-gray-300">
                            <li><strong>Mainland China (PRC):</strong> Due to the comprehensive 2025/2026 ban on Virtual Asset trading and mining.</li>
                            <li><strong>Russia:</strong> Due to international sanctions and cross-border payment restrictions.</li>
                            <li><strong>Sanctioned Nations:</strong> North Korea, Iran, Syria, Cuba, Crimea Region.</li>
                        </ul>
                    </div>

                    {/* RESTRICTED */}
                    <div className="space-y-3">
                        <h3 className="font-bold text-orange-500 text-sm border-b border-orange-500/20 pb-2">⚠️ RESTRICTED ACCESS (Conditioned)</h3>
                        <p className="text-xs text-gray-400">
                            Services may be limited to specific user categories (e.g., Professional Investors).
                        </p>
                        <ul className="list-disc pl-4 text-xs space-y-1 text-gray-300">
                            <li><strong>United Kingdom (UK):</strong> Retail access to crypto derivatives is restricted by the FCA. Service available to Professional Clients only.</li>
                            <li><strong>United States (USA):</strong> Usage subject to state-level regulations regarding prediction markets. Users in contested states (Nevada, Maryland) must refrain from participation.</li>
                            <li><strong>Canada (Ontario):</strong> Dependent on OSC compliance.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-yellow-900/10 border border-yellow-500/20 p-3 rounded text-xs text-yellow-200/80">
                    <strong>Note to Global Users:</strong> NeuralMarket does not actively solicit clients in the aforementioned jurisdictions. The user certifies that they are not accessing the platform from a prohibited location.
                </div>
            </section>

            <div className="mt-12 pt-8 border-t border-white/10 text-xs text-center text-gray-600">
                <p>All Rights Reserved © 2026 NeuralMarket S.A.P.I. de C.V. (In Incorporation).</p>
                <p>Av. Paseo de la Reforma, Mexico City, CDMX, Mexico.</p>
            </div>
        </div>
    );
}

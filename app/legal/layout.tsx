export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-gray-300">
            <div className="w-full bg-gradient-to-b from-black/50 to-transparent border-b border-white/5 py-12 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-widest mb-4">LEGAL CENTER</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Institutional-grade transparency for the NeuralMarket protocol.
                        These documents govern your use of our non-custodial interface.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="bg-[#05050A] border border-white/10 rounded-2xl p-6 md:p-12 shadow-2xl">
                    {children}
                </div>
            </div>
        </div>
    );
}

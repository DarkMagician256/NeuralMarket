'use client';

import { motion } from 'framer-motion';
import { ShieldX, Globe, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function GeoBlockedContent() {
    const params = useSearchParams();
    const country = params.get('country') || 'your region';

    return (
        <div className="min-h-screen bg-[#05050A] flex items-center justify-center p-6">
            {/* Background grid */}
            <div className="fixed inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-lg w-full text-center"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.2 }}
                    className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center"
                >
                    <ShieldX size={48} className="text-red-400" />
                </motion.div>

                {/* Title */}
                <h1 className="text-3xl font-black text-white tracking-tighter mb-3 uppercase">
                    Access Restricted
                </h1>

                <div className="flex items-center justify-center gap-2 mb-6">
                    <Globe size={14} className="text-gray-500" />
                    <span className="text-gray-500 font-mono text-sm uppercase tracking-widest">
                        {country.toUpperCase()}
                    </span>
                </div>

                {/* Message */}
                <div className="glass-panel p-6 mb-8 text-left space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                        NeuralMarket&apos;s onchain prediction trading is not available in your jurisdiction pursuant to the{' '}
                        <span className="text-cyan-400">Kalshi Member Agreement</span> and applicable regulations.
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Onchain predictions powered by Kalshi markets are not available to U.S. persons or
                        others subject to trading restrictions. This restriction is enforced at the platform level.
                    </p>
                    <div className="border-t border-white/5 pt-4">
                        <a
                            href="https://where.kalshi.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors"
                        >
                            CHECK ELIGIBLE JURISDICTIONS <ExternalLink size={12} />
                        </a>
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-gray-600 font-mono text-xs">
                    If you believe this is an error, please ensure your VPN is disabled.
                </p>

                <div className="mt-8">
                    <Link href="/" className="text-gray-500 hover:text-white text-xs font-mono transition-colors">
                        ← RETURN TO HOME
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function GeoBlockedPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#05050A]" />}>
            <GeoBlockedContent />
        </Suspense>
    );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Trophy, Vote, Menu, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationCenter from '@/components/ui/NotificationCenter';
import { User } from 'lucide-react';
import Image from 'next/image';

const WalletMultiButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
    { ssr: false }
);

const navLinks = [
    { href: '/markets', label: 'MARKETS', hoverColor: 'hover:text-cyan-400' },
    { href: '/leaderboard', label: 'LEADERBOARD', hoverColor: 'hover:text-yellow-400' },
    { href: '/agents', label: 'CORTEX AI', hoverColor: 'hover:text-cyan-400' },
    { href: '/portfolio', label: 'PORTFOLIO', hoverColor: 'hover:text-cyan-400' },
    { href: '/governance', label: 'GOVERNANCE', hoverColor: 'hover:text-purple-400' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    React.useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-3 md:py-4' : 'bg-transparent py-4 md:py-6'}`}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Brand */}
                    <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
                        <div className="relative w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform duration-300">
                            <Image
                                src="/neural_logo_v2.png"
                                alt="Neural Market Logo"
                                fill
                                className="object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                            />
                        </div>
                        <span className="font-bold text-lg md:text-xl tracking-wider group-hover:text-glow transition-all">NEURAL</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium ${link.hoverColor} transition-colors ${pathname === link.href ? 'text-cyan-400' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Launch Terminal - Hidden on mobile */}
                        <Link href="/markets" className="hidden md:block">
                            <button className="px-4 md:px-5 py-2 text-xs font-bold bg-white text-black rounded-full hover:bg-cyan-400 hover:scale-105 transition-all">
                                LAUNCH TERMINAL
                            </button>
                        </Link>

                        {/* System Utils - Simplified on mobile */}
                        <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-2 md:pl-4">
                            <NotificationCenter />
                            <Link href="/profile" className="relative group" title="Profile">
                                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px] group-hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all">
                                    <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
                                        <Image
                                            src={`https://api.dicebear.com/9.x/bottts/svg?seed=NeuralBot&backgroundColor=1d1d1d`}
                                            alt="User Avatar"
                                            fill
                                            className="object-cover hover:scale-110 transition-transform"
                                        />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 border-2 border-black rounded-full"></div>
                            </Link>
                        </div>

                        {/* Wallet - Smaller on mobile */}
                        <div className="wallet-adapter-custom scale-75 md:scale-90">
                            <WalletMultiButton />
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Mobile Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[280px] max-w-[80vw] bg-[#0a0a0f] border-l border-white/10 z-50 lg:hidden overflow-y-auto"
                        >
                            <div className="p-6 pt-20">
                                {/* Nav Links */}
                                <nav className="space-y-2">
                                    {navLinks.map((link, index) => (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${pathname === link.href
                                                        ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-400'
                                                        : 'hover:bg-white/5 text-gray-300'
                                                    }`}
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                {/* Mobile Actions */}
                                <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                                    <Link href="/markets" className="block">
                                        <button className="w-full px-4 py-3 text-sm font-bold bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-all">
                                            LAUNCH TERMINAL
                                        </button>
                                    </Link>

                                    {/* Mobile Profile Link */}
                                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px]">
                                            <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
                                                <Image
                                                    src={`https://api.dicebear.com/9.x/bottts/svg?seed=NeuralBot&backgroundColor=1d1d1d`}
                                                    alt="User Avatar"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">My Profile</div>
                                            <div className="text-xs text-gray-500">View your stats</div>
                                        </div>
                                    </Link>
                                </div>

                                {/* Network Status */}
                                <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        SOLANA DEVNET: LIVE
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function NavPill({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <Link href={href}>
            <button className={`px-4 py-2 rounded-full flex items-center space-x-2 text-sm transition-all ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {icon}
                <span>{label}</span>
            </button>
        </Link>
    )
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Trophy, Vote, Menu, X, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationCenter from '@/components/ui/NotificationCenter';
import LanguageSelector from '@/components/layout/LanguageSelector';
import { User, Globe, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const WalletMultiButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
    { ssr: false }
);

import { useWallet } from '@solana/wallet-adapter-react';

export default function Navbar() {
    const { t } = useLanguage();
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: t('home'), hoverColor: 'hover:text-cyan-400' },
        { href: '/markets', label: t('markets'), hoverColor: 'hover:text-cyan-400' },
        { href: '/leaderboard', label: t('ai_agents'), hoverColor: 'hover:text-yellow-400' },
        { href: '/agents', label: t('swarm_ai'), hoverColor: 'hover:text-cyan-400' },
        { href: '/portfolio', label: t('portfolio'), hoverColor: 'hover:text-cyan-400' },
    ];

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

    const { publicKey } = useWallet();

    // Generate avatar seed from wallet address or use default
    const avatarSeed = publicKey ? publicKey.toBase58() : 'NeuralGuest';

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-2 md:py-3' : 'bg-transparent py-4 md:py-5'}`}
            >
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4">
                    {/* Brand */}
                    <Link href="/" className="flex items-center space-x-2 md:space-x-3 group shrink-0">
                        <div className="relative w-8 h-8 md:w-9 md:h-9 group-hover:scale-110 transition-transform duration-300">
                            <Image
                                src="/neural_logo_v2.png"
                                alt="Neural Market Logo"
                                fill
                                className="object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                                priority
                            />
                        </div>
                        <span className="font-black text-base md:text-lg tracking-tighter group-hover:text-glow transition-all hidden sm:block">NEURAL</span>
                    </Link>

                    {/* Desktop Navigation - Improved Spacing and Font Size */}
                    <div className="hidden xl:flex items-center space-x-1 md:space-x-2 bg-white/5 border border-white/5 rounded-full px-2 py-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight transition-all uppercase whitespace-nowrap ${pathname === link.href 
                                    ? 'bg-white/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                                    : `text-gray-400 ${link.hoverColor} hover:bg-white/5`}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        {/* Terminal Button - Adaptive Size */}
                        <Link href="/markets" className="hidden lg:block">
                            <button className="px-3 md:px-4 py-2 text-[10px] md:text-[11px] font-black tracking-tighter bg-white text-black rounded-full hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] uppercase">
                                {t('launch_terminal')}
                            </button>
                        </Link>

                        {/* Language Selector */}
                        <LanguageSelector />

                        {/* System Utils - Simplified on mobile */}
                        <div className="flex items-center gap-2 border-l border-white/10 pl-2 lg:pl-3">
                            <div className="hidden sm:block">
                                <NotificationCenter />
                            </div>
                            
                            <Link href="/profile" className="relative group shrink-0" title="Profile">
                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-500 to-purple-600 p-px group-hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all">
                                    <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
                                        <Image
                                            src={`https://api.dicebear.com/9.x/bottts/svg?seed=${avatarSeed}&backgroundColor=1d1d1d`}
                                            alt="User Avatar"
                                            fill
                                            className="object-cover hover:scale-110 transition-transform"
                                        />
                                    </div>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></div>
                            </Link>
                            
                            {/* Wallet - Smaller on mobile */}
                            <div className="wallet-adapter-custom scale-75 md:scale-90 origin-right">
                                <WalletMultiButton />
                            </div>
                        </div>

                        {/* Mobile Menu Toggle - Only shows when XL navigation is hidden */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="xl:hidden p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
                            className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 xl:hidden"
                        />

                        {/* Mobile Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-[#0a0a0f] border-l border-white/10 z-100 xl:hidden overflow-y-auto flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
                        >
                            {/* Close Button Inside Panel */}
                            <div className="absolute top-6 right-6">
                                <button 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-full bg-white/5 border border-white/10"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 pt-24 flex-1">
                                <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
                                    <div className="relative w-10 h-10">
                                        <Image src="/neural_logo_v2.png" alt="Logo" fill className="object-contain" />
                                    </div>
                                    <div>
                                        <div className="font-black tracking-tighter text-lg leading-none">NEURAL</div>
                                        <div className="text-[10px] font-mono text-cyan-400 uppercase">Institutional AI</div>
                                    </div>
                                </div>

                                {/* Nav Links */}
                                <nav className="space-y-4">
                                    {navLinks.map((link, index) => (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                className={`flex items-center justify-between px-5 py-4 rounded-xl text-xs font-bold tracking-widest transition-all uppercase ${pathname === link.href
                                                    ? 'bg-linear-to-r from-cyan-500/20 to-transparent text-cyan-400 border-l-2 border-cyan-400'
                                                    : 'hover:bg-white/5 text-gray-400'
                                                    }`}
                                            >
                                                {link.label}
                                                <ChevronRight size={14} className={pathname === link.href ? 'text-cyan-400' : 'text-gray-700'} />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                {/* Mobile Actions */}
                                <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
                                    <Link href="/markets" className="block">
                                        <button className="w-full px-4 py-4 text-xs font-black tracking-widest bg-white text-black rounded-xl hover:bg-cyan-400 hover:scale-102 transition-all uppercase shadow-lg shadow-white/5">
                                            {t('launch_terminal')}
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Footer Area Mobile */}
                            <div className="p-8 bg-black/40 border-t border-white/5 mt-auto">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full border border-white/10 p-1">
                                        <Image
                                            src={`https://api.dicebear.com/9.x/bottts/svg?seed=${avatarSeed}&backgroundColor=1d1d1d`}
                                            alt="User Avatar"
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] font-mono text-gray-500 uppercase">Connected User</div>
                                        <div className="text-xs font-bold text-white truncate">{publicKey ? publicKey.toBase58().slice(0, 8) + '...' + publicKey.toBase58().slice(-8) : 'Guest Wallet'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-mono text-green-500 bg-green-500/5 px-3 py-2 rounded border border-green-500/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    SOLANA DEVNET • OPERATIONAL
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

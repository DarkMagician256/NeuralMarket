'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Lock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AccessDeniedModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export default function AccessDeniedModal({
    isOpen,
    onClose,
    title,
    message
}: AccessDeniedModalProps) {
    const { t } = useLanguage();
    
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-md h-fit z-101 p-4"
                    >
                        <div className="relative bg-[#0a0a0f] border border-red-500/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]">

                            {/* Animated Scan Line */}
                            <motion.div
                                initial={{ top: "-100%" }}
                                animate={{ top: "200%" }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 w-full h-32 bg-linear-to-b from-transparent via-red-500/5 to-transparent pointer-events-none"
                            />

                            {/* Header */}
                            <div className="bg-red-500/10 p-4 border-b border-red-500/20 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/20 rounded-lg">
                                        <ShieldAlert className="text-red-500" size={20} />
                                    </div>
                                    <h3 className="font-bold font-mono tracking-wider text-red-500 uppercase">
                                        {title || "RESTRICTED ACCESS"}
                                    </h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-black border border-red-500/20 flex items-center justify-center mb-2">
                                        <Lock size={32} className="text-red-500/50" />
                                    </div>

                                    <p className="text-gray-300 text-sm leading-relaxed uppercase">
                                        {message || "This action requires upgraded clearance level."}
                                    </p>

                                    <div className="w-full bg-red-950/30 border border-red-900/50 rounded p-3 text-xs font-mono text-red-400 mt-2 uppercase">
                                        ERROR_CODE: PERMISSION_DENIED_0x403
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-black/50 border-t border-white/5 flex justify-center">
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold font-mono tracking-widest rounded-lg transition-all shadow-lg shadow-red-900/20 active:scale-95 text-xs sm:text-sm uppercase"
                                >
                                    {t('acknowledge')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

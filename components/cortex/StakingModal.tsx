'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Wallet, Shield, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAgentActions } from '@/hooks/useAgentActions';
import { OnChainAgent } from '@/hooks/useMyAgents';
// @ts-ignore
import { toast } from 'sonner';

interface StakingModalProps {
    isOpen: boolean;
    onClose: () => void;
    agent: OnChainAgent;
    onSuccess: () => void;
}

export default function StakingModal({ isOpen, onClose, agent, onSuccess }: StakingModalProps) {
    const { depositCapital } = useAgentActions();
    const [amount, setAmount] = useState<string>('0.1');
    const [isStaking, setIsStaking] = useState(false);

    const handleStake = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setIsStaking(true);
        const toastId = toast.loading('Initiating Vault Deposit...');

        try {
            const result = await depositCapital(agent.agentId, Number(amount));

            if (result.success) {
                toast.dismiss(toastId);
                toast.success(
                    <div className="font-mono">
                        <div className="font-bold text-green-400">Vault Deposit Successful! 🏦</div>
                        <div className="text-[10px] text-gray-400 mt-1">
                            Staked {amount} SOL into Agent Vault.
                            <br />TVL Updated.
                        </div>
                        <a
                            href={`https://explorer.solana.com/tx/${result.txHash}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline text-[10px] mt-1 block"
                        >
                            Verify Deposit →
                        </a>
                    </div>,
                    { duration: 8000 }
                );
                onSuccess();
                onClose();
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            console.error(error);
            toast.dismiss(toastId);
            toast.error(error.message || 'Deposit Failed');
        } finally {
            setIsStaking(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
                        <div className="flex items-center gap-2">
                            <Lock className="text-amber-400" size={18} />
                            <h3 className="font-mono font-bold text-white">VAULT DEPOSIT</h3>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Agent Info */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-white/10">
                                <span className="text-lg">🏦</span>
                            </div>
                            <div className="min-w-0">
                                <div className="font-mono font-bold text-sm text-white truncate">Staking for {agent.name}</div>
                                <div className="text-[10px] font-mono text-amber-400 truncate">INCREASE AGENT CAPITAL (TVL)</div>
                            </div>
                        </div>

                        {/* Input */}
                        <div>
                            <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase mb-1">
                                <span>Deposit Amount</span>
                                <span>Balance: -- SOL</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 pr-16 text-white font-mono focus:outline-none focus:border-amber-500/50 transition-colors text-lg font-bold"
                                    step="0.1"
                                    min="0.01"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-500">SOL</span>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg space-y-2">
                            <div className="flex items-start gap-2">
                                <Shield className="text-amber-500 shrink-0 mt-0.5" size={14} />
                                <p className="text-[10px] text-amber-500/80 leading-relaxed font-mono">
                                    Funds are deposited directly into the Agent's On-Chain Vault. The agent will use this capital for "Live Execution" trades.
                                </p>
                            </div>
                        </div>

                        {/* Button */}
                        <button
                            onClick={handleStake}
                            disabled={isStaking}
                            className="w-full py-4 rounded-lg font-bold font-mono text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:scale-[1.02] shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95 text-black"
                        >
                            {isStaking ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    DEPOSITING...
                                </>
                            ) : (
                                <>
                                    <TrendingUp size={18} />
                                    DEPOSIT {amount} SOL
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

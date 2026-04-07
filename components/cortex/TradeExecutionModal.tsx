'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Zap, Wallet, ArrowRight, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useJupiterSwap, TOKENS } from '@/hooks/useJupiterSwap';
import { useAgentActions } from '@/hooks/useAgentActions';
import { OnChainAgent } from '@/hooks/useMyAgents';
// @ts-ignore
import { toast } from 'sonner';

interface TradeExecutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    agent: OnChainAgent;
    onSuccess: () => void;
}

export default function TradeExecutionModal({ isOpen, onClose, agent, onSuccess }: TradeExecutionModalProps) {
    const { getQuote, executeSwap, loading: swapLoading } = useJupiterSwap();
    const { recordTrade } = useAgentActions();

    const [amount, setAmount] = useState<string>('0.01');
    const [mode, setMode] = useState<'SIMULATION' | 'REAL'>('SIMULATION');
    const [quote, setQuote] = useState<any>(null);
    const [isExecuting, setIsExecuting] = useState(false);

    // Fetch quote when amount changes in Real mode
    useEffect(() => {
        if (mode === 'REAL' && Number(amount) > 0) {
            const fetchQuote = async () => {
                const lamports = Math.floor(Number(amount) * 1_000_000_000);
                const q = await getQuote(TOKENS.SOL, TOKENS.USDC, lamports);
                setQuote(q);
            };
            const debounce = setTimeout(fetchQuote, 500);
            return () => clearTimeout(debounce);
        } else {
            setQuote(null);
        }
    }, [amount, mode, getQuote]);

    const handleExecute = async () => {
        setIsExecuting(true);

        try {
            if (mode === 'SIMULATION') {
                // --- ARQUETIPO-SPECIFIC SIMULATION LOGIC ---
                let winProb = 0.5;
                let profitFactor = 0.1; // 10% gain default

                if (agent.archetypeName === 'WHALE') {
                    winProb = 0.70; // High win rate
                    profitFactor = 0.35; // Big moves
                } else if (agent.archetypeName === 'SNIPER') {
                    winProb = 0.40; // Low win rate
                    profitFactor = 0.80; // Huge gains when winning
                } else if (agent.archetypeName === 'HEDGER') {
                    winProb = 0.90; // Very high win rate
                    profitFactor = 0.05; // Tiny gains
                }

                const isProfitable = Math.random() < winProb;

                // Randomize return slightly
                const variance = 0.5 + Math.random(); // 0.5x to 1.5x
                const pnl = isProfitable
                    ? Number(amount) * profitFactor * variance
                    : -Number(amount) * (profitFactor / 2) * variance; // Losses are usually cut smaller

                const result = await recordTrade(
                    agent.agentId,
                    Number(amount),
                    isProfitable,
                    pnl
                );

                if (result.success) {
                    // RICH FEEDBACK TOAST
                    toast.success(
                        <div className="font-mono min-w-[200px]">
                            <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                                <span className="text-xl">{isProfitable ? '🚀' : '🥀'}</span>
                                <div>
                                    <div className={`font-black text-sm ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                                        {isProfitable ? 'TRADE WIN' : 'TRADE LOSS'}
                                    </div>
                                    <div className="text-[10px] text-gray-500">SIMULATION RECORDED</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <div>
                                    <div className="text-[9px] text-gray-500 uppercase">Input</div>
                                    <div className="font-bold text-white">${amount} USDC</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] text-gray-500 uppercase">PnL Result</div>
                                    <div className={`font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                                        {pnl > 0 ? '+' : ''}${pnl.toFixed(4)} USDC
                                    </div>
                                </div>
                            </div>

                            <a
                                href={`https://explorer.solana.com/tx/${result.txHash}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-white/5 hover:bg-white/10 py-1.5 rounded text-[10px] text-cyan-400 transition-colors mt-1"
                            >
                                VERIFY ON-CHAIN SKILL →
                            </a>
                        </div>,
                        { duration: 8000 }
                    );
                    onSuccess();
                    onClose();
                } else {
                    throw new Error(result.error);
                }
            } else {
                // ... REAL SWAP (Jupiter) ...
                if (!quote) return;

                // Import PublicKey dynamically or assume it's available via closure if imported
                const { PublicKey } = await import('@solana/web3.js');
                const agentPubkey = new PublicKey(agent.pubkey);
                const lamports = Math.floor(Number(amount) * 1_000_000_000);

                // Execute Real Trade (Funding Agent)
                const result = await executeSwap(TOKENS.SOL, TOKENS.USDC, lamports, 50, agentPubkey);

                if (result.success) {
                    // IF Real Swap Success -> Record it on Neural Vault to build reputation
                    // We simulate the PnL result for the "Trading Log" even if the capital was moved
                    // This rewards the user for risking real capital

                    const isProfitable = Math.random() > 0.4; // Slightly favorable for real risk-takers
                    const pnl = isProfitable
                        ? Number(amount) * 0.15
                        : -Number(amount) * 0.05;

                    await recordTrade(
                        agent.agentId,
                        Number(amount),
                        isProfitable,
                        pnl
                    );

                    toast.success("Real Trade Executed & Reputation Recorded! 🚀");
                    onSuccess();
                    onClose();
                } else {
                    throw new Error(result.error);
                }
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Execution Failed');
        } finally {
            setIsExecuting(false);
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
                onClick={onClose} // Retrieve background click to close
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5 shrink-0">
                        <div className="flex items-center gap-2">
                            <Activity className="text-cyan-400" size={18} />
                            <h3 className="font-mono font-bold text-white text-sm md:text-base">EXECUTE TRADE AGENT</h3>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar">
                        {/* Agent Info */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-linear-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                                <span className="text-lg">🤖</span>
                            </div>
                            <div className="min-w-0">
                                <div className="font-mono font-bold text-sm text-white truncate">{agent.name}</div>
                                <div className="text-[10px] font-mono text-cyan-400 truncate">{agent.archetypeName} ARCHETYPE</div>
                            </div>
                        </div>

                        {/* Mode Selector */}
                        <div className="grid grid-cols-2 gap-2 p-1 bg-black/50 rounded-lg border border-white/10 shrink-0">
                            <button
                                onClick={() => setMode('SIMULATION')}
                                className={`py-2 px-2 md:px-4 rounded text-[10px] md:text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 md:gap-2 ${mode === 'SIMULATION'
                                    ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                <ShieldCheck size={14} className="shrink-0" />
                                <span className="truncate">PAPER TRADE</span>
                            </button>
                            <button
                                onClick={() => setMode('REAL')}
                                className={`py-2 px-2 md:px-4 rounded text-[10px] md:text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 md:gap-2 ${mode === 'REAL'
                                    ? 'bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                <Zap size={14} className="shrink-0" />
                                <span className="truncate">LIVE EXECUTION</span>
                            </button>
                        </div>

                        {/* Input Area */}
                        <div>
                            <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Trade Amount (USDC)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 pr-16 text-white font-mono focus:outline-none focus:border-cyan-500/50 transition-colors text-sm md:text-base"
                                    step="0.01"
                                    min="0.001"
                                    inputMode="decimal"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-500">USDC</span>
                            </div>
                        </div>

                        {/* Jupiter Quote Info (Only Real Mode) */}
                        <AnimatePresence>
                            {mode === 'REAL' && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden space-y-2"
                                >
                                    <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-2">
                                        <div className="flex justify-between items-center text-xs font-mono">
                                            <span className="text-gray-500">Route</span>
                                            <span className="text-green-400 flex items-center gap-1">Jupiter V6 <Zap size={10} /></span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-mono">
                                            <span className="text-gray-500">Receive (Est.)</span>
                                            <span className="text-white font-bold">
                                                {quote ? (Number(quote.outAmount) / 1_000_000).toFixed(2) : '-.--'} USDC
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-mono">
                                            <span className="text-gray-500">Price Impact</span>
                                            <span className={`font-bold ${quote?.priceImpactPct > 0.5 ? 'text-red-400' : 'text-green-400'}`}>
                                                {quote ? `${Number(quote.priceImpactPct).toFixed(2)}%` : '0.00%'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Warning for Real Mode */}
                                    <div className="flex items-start gap-2 p-3 rounded bg-yellow-500/5 border border-yellow-500/10">
                                        <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={14} />
                                        <p className="text-[10px] text-yellow-500/80 leading-relaxed font-mono">
                                            WARNING: This is a REAL transaction on Solana Devnet. Use Devnet SOL.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer / Action */}
                    <div className="p-4 md:p-6 border-t border-white/10 bg-black/20 shrink-0">
                        <button
                            onClick={handleExecute}
                            disabled={isExecuting || (mode === 'REAL' && !quote)}
                            className={`w-full py-3 md:py-4 rounded-lg font-bold font-mono text-xs md:text-sm transition-all flex items-center justify-center gap-2 ${mode === 'REAL'
                                ? 'bg-linear-to-r from-green-500 to-emerald-600 hover:scale-[1.02] shadow-lg shadow-green-500/20'
                                : 'bg-linear-to-r from-purple-500 to-indigo-600 hover:scale-[1.02] shadow-lg shadow-purple-500/20'
                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-95`}
                        >
                            {isExecuting ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    {mode === 'REAL' ? 'EXECUTING...' : 'RECORDING...'}
                                </>
                            ) : (
                                <>
                                    {mode === 'REAL' ? <Wallet size={18} /> : <Activity size={18} />}
                                    {mode === 'REAL' ? `SWAP $${amount} USDC` : 'LOG SIGNAL'}
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

'use client';

import { Zap, DollarSign, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface StrategyConfigProps {
    risk: number;
    setRisk: (val: number) => void;
    capital: number;
    setCapital: (val: number) => void;
    leverage: number;
    setLeverage: (val: number) => void;
}

export default function StrategyConfig({ risk, setRisk, capital, setCapital, leverage, setLeverage }: StrategyConfigProps) {
    const { t } = useLanguage();

    return (
        <div className="space-y-8 max-w-2xl mx-auto">

            {/* Risk Slider */}
            <div className="glass-panel p-6">
                <div className="flex justify-between mb-4">
                    <label className="flex items-center gap-2 font-mono text-sm text-gray-300 uppercase">
                        <ShieldAlert size={16} className="text-rose-400" /> {t('risk_tolerance')}
                    </label>
                    <span className={`font-bold font-mono uppercase ${risk > 70 ? 'text-red-500' : risk > 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {risk > 70 ? t('degen') : risk > 40 ? t('aggressive') : t('conservative')}
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={risk}
                    onChange={(e) => setRisk(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-2">
                    <span className="uppercase">{t('safe')}</span>
                    <span className="uppercase">{t('yolo')}</span>
                </div>
            </div>

            {/* Capital & Leverage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6">
                    <label className="flex items-center gap-2 font-mono text-sm text-gray-300 mb-4 uppercase">
                        <DollarSign size={16} className="text-green-400" /> {t('capital')} (SOL)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={capital}
                            onChange={(e) => setCapital(Number(e.target.value))}
                            className="w-full bg-black/50 border border-white/10 rounded-lg py-3 px-4 text-xl font-mono focus:border-cyan-500 outline-none transition-colors text-right"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">◎</span>
                    </div>
                </div>

                <div className="glass-panel p-6">
                    <label className="flex items-center gap-2 font-mono text-sm text-gray-300 mb-4 uppercase">
                        <Zap size={16} className="text-yellow-400" /> {t('leverage')}
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 5, 10, 20].map((lev) => (
                            <button
                                key={lev}
                                onClick={() => setLeverage(lev)}
                                className={`py-3 rounded-lg font-bold font-mono transition-all ${leverage === lev
                                    ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500'
                                    : 'bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10'
                                    }`}
                            >
                                {lev}x
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';
import { Target, Brain, Scale, Waves } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ArchetypeSelect({ selected, onSelect }: { selected: string, onSelect: (id: string) => void }) {
    const { t } = useLanguage();

    const archetypes = [
        {
            id: 'sniper',
            name: t('sniper_title'),
            desc: t('sniper_desc'),
            icon: Target,
            color: 'text-red-400',
            border: 'border-red-500/50',
            gradient: 'from-red-500/20 to-transparent'
        },
        {
            id: 'oracle',
            name: t('oracle_title'),
            desc: t('oracle_desc'),
            icon: Brain,
            color: 'text-purple-400',
            border: 'border-purple-500/50',
            gradient: 'from-purple-500/20 to-transparent'
        },
        {
            id: 'hedger',
            name: t('hedger_title'),
            desc: t('hedger_desc'),
            icon: Scale,
            color: 'text-green-400',
            border: 'border-green-500/50',
            gradient: 'from-green-500/20 to-transparent'
        },
        {
            id: 'whale',
            name: t('whale_title'),
            desc: t('whale_desc'),
            icon: Waves,
            color: 'text-cyan-400',
            border: 'border-cyan-500/50',
            gradient: 'from-cyan-500/20 to-transparent'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {archetypes.map((type) => (
                <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(type.id)}
                    className={`glass-panel p-6 cursor-pointer relative overflow-hidden transition-all duration-300 ${selected === type.id ? `bg-white/10 ${type.border} border shadow-[0_0_30px_rgba(0,0,0,0.5)]` : 'opacity-60 hover:opacity-100 border-white/5'
                        }`}
                >
                    <div className={`absolute inset-0 bg-linear-to-br ${type.gradient} opacity-0 ${selected === type.id ? 'opacity-100' : 'group-hover:opacity-50'} transition-opacity`} />

                    <div className="relative z-10 flex flex-col items-center text-center gap-4">
                        <div className={`p-4 rounded-full bg-black/50 ${type.color}`}>
                            <type.icon size={32} />
                        </div>
                        <div>
                            <h3 className={`font-bold text-lg mb-2 ${type.color}`}>{type.name}</h3>
                            <p className="text-sm text-gray-400 font-mono leading-relaxed">{type.desc}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

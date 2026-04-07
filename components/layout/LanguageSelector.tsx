"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="text-[10px] font-bold font-mono tracking-widest text-gray-400 group-hover:text-white uppercase hidden md:inline">
          {currentLang.code}
        </span>
        <ChevronDown size={12} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-40 glass-panel z-50 overflow-hidden shadow-2xl border-white/10"
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code as any);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono transition-colors ${
                    locale === lang.code 
                      ? 'bg-cyan-500/10 text-cyan-400' 
                      : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                  {locale === lang.code && <Check size={12} className="text-cyan-400" />}
                </button>
              ))}
            </div>
            
            {/* AI Node Status for the selector */}
            <div className="px-4 py-2 bg-white/5 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-[8px] text-gray-500 font-mono uppercase tracking-[0.2em]">Neural Translator Active</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

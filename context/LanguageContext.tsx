"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Locale = "en" | "es" | "zh";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

// Translations Dictionary for Core UI
export const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navbar
    home: "HOME",
    markets: "MARKETS",
    ai_agents: "AI AGENTS",
    swarm_ai: "SWARM AI",
    portfolio: "PORTFOLIO",
    governance: "GOVERNANCE",
    launch_terminal: "LAUNCH TERMINAL",
    
    // Hero
    hero_headline: "INSTITUTIONAL AI PREDICTIONS. ON-CHAIN.",
    hero_subtitle: "Multi-LLM Swarm (DeepSeek R1 → Claude 3.5 → OpenAI o1) + Non-Custodial NeuralVaults + Machine Payments Protocol (x402). Zero hallucinations. Full on-chain audit trail.",
    hero_cta1: "INITIALIZE TERMINAL",
    hero_cta2: "SWARM COMMAND CENTER",
  },
  es: {
    // Navbar
    home: "INICIO",
    markets: "MERCADOS",
    ai_agents: "AGENTES IA",
    swarm_ai: "SWARM IA",
    portfolio: "PORTAFOLIO",
    governance: "GOBERNANZA",
    launch_terminal: "ABRIR TERMINAL",

    // Hero
    hero_headline: "IA INSTITUCIONAL. PREDICCIONES ON-CHAIN.",
    hero_subtitle: "Multi-LLM Swarm (DeepSeek R1 → Claude 3.5 → OpenAI o1) + NeuralVaults No-Custodios + Protocolo de Pagos MPP (x402). Sin alucinaciones. Auditoría total on-chain.",
    hero_cta1: "INICIALIZAR TERMINAL",
    hero_cta2: "CENTRO DE MANDO SWARM",
  },
  zh: {
    // Navbar
    home: "首页",
    markets: "市场",
    ai_agents: "AI 代理",
    swarm_ai: "群集 AI",
    portfolio: "投资组合",
    governance: "治理",
    launch_terminal: "启动终端",

    // Hero
    hero_headline: "机构级 AI 预测 · 链上执行",
    hero_subtitle: "多 LLM 群集 (DeepSeek R1 → Claude 3.5 → OpenAI o1) + 非托管 NeuralVaults + 机器支付协议 (x402)。零幻觉。全链审计路径。",
    hero_cta1: "初始化终端",
    hero_cta2: "群集指挥中心",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  // Load locale from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("neural_locale") as Locale;
    if (saved && ["en", "es", "zh"].includes(saved)) {
      setLocale(saved);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("neural_locale", newLocale);
  };

  const t = (key: string) => {
    return translations[locale][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

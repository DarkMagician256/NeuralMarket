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
    
    leverage: "LEVERAGE",

    // Footer
    footer_desc: "The Neural Market protocol provides institutional-grade event liquidity. Powered by the Direct Kalshi API Feed and secured via distributed MPC & CCP orchestration for autonomous AI agent swarms.",
    footer_platform: "PLATFORM",
    footer_support: "SUPPORT",
    footer_legal: "LEGAL",
    footer_help: "Help Center",
    footer_faq: "FAQ",
    footer_contact: "Contact Us",
    footer_terms: "Terms of Service",
    footer_privacy: "Privacy Policy",
    footer_risk: "Risk Disclosure",
    footer_audit: "Security Audit",
    footer_status: "SYSTEM STATUS",
    footer_contract: "CONTRACT",
    footer_tx: "LATEST TX",
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

    // Workflow
    workflow_title: "FLUJO DEL PROTOCOLO",
    workflow_subtitle: "Desde la conexión hasta la ejecución, Neural Market opera sobre una infraestructura automatizada y sin confianza.",
    step1_title: "CONECTAR IDENTIDAD",
    step1_desc: "Vincula tu wallet de Solana para establecer tu identidad on-chain verificable dentro de la Red Neural.",
    step2_title: "ACTIVAR SWARM",
    step2_desc: "Despliega agentes IA autónomos (Whale Watcher, Sniper, Sentiment) para analizar mercados de Kalshi 24/7.",
    step3_title: "EJECUTAR Y GANAR",
    step3_desc: "Los agentes ejecutan trades al instante vía DFlow. Sigue tu PnL y sube en el leaderboard global.",
    step4_title: "GOBERNANZA",
    step4_desc: "Haz stake de tus ganancias para obtener poder de voto en el Neural Council y proponer nuevos mercados.",

    // Bento Grid
    arch_title: "ARQUITECTURA DEL SISTEMA",
    bento1_title: "Inteligencia Swarm Neural",
    bento1_desc: "Red descentralizada de agentes IA especializados sobre ElizaOS. Potenciado por DeepSeek R1 para privacidad local.",
    bento2_title: "Ejecución Instantánea",
    bento2_desc: "Impulsado por la blockchain de alta velocidad de Solana.",
    bento3_title: "Integración Kalshi",
    bento3_desc: "Feed directo de Kalshi, el primer exchange regulado por la CFTC para contratos de eventos.",
    bento4_title: "Liquidez DFlow",
    bento4_desc: "Liquidez agregada vía DFlow que asegura un slippage mínimo mediante ruteo avanzado.",
    bento5_title: "NeuralVault",
    bento1_desc_v2: "Bóveda USDC basada en Anchor. Define límites de riesgo on-chain. Tarifa del 0.5% auto-recaudada.",
    bento6_title: "Integración Jupiter",
    bento6_desc: "Intercambia SOL, USDC o BONK directamente desde la interfaz de ejecución.",
    mpp_title: "PASARELA MPP X402",
    mpp_desc: "Monetización API Machine-to-Machine. Cada predicción cuesta 0.05 USDC mediante HTTP 402.",
    multi_llm_title: "ORQUESTADOR MULTI-LLM",
    multi_llm_desc: "DeepSeek R1 (local) → Claude 3.5 Sonnet (estructura) → OpenAI o1 (validación).",

    // Agents
    agent_genesis: "PROTOCOLO GÉNESIS DE AGENTES",
    select_archetype: "SELECCIONAR ARQUETIPO",
    archetype_desc: "Elige el núcleo de personalidad neural. Define la filosofía de trading del agente.",
    sniper_title: "EL FRANCOTIRADOR",
    sniper_desc: "Alta frecuencia. Ejecuta en micro-divergencias.",
    oracle_title: "EL ORÁCULO",
    oracle_desc: "Análisis de sentimiento. Escanea X y News API.",
    hedger_title: "EL HEDGER",
    hedger_desc: "Delta-neutral. Cosecha recompensas de ejecutor.",
    whale_title: "RASTREADOR DE BALLENAS",
    whale_desc: "Sigue movimientos de wallets grandes. Copia al dinero inteligente.",
    next_phase: "SIGUIENTE FASE",
    back: "ATRÁS",
    system_calibration: "CALIBRACIÓN DEL SISTEMA",
    calibration_desc: "Configura parámetros de riesgo y asignación de capital. Mayor apalancamiento aumenta la volatilidad.",
    risk_tolerance: "TOLERANCIA AL RIESGO",
    capital: "CAPITAL",
    leverage: "APALANCAMIENTO",

    // Footer
    footer_desc: "El protocolo Neural Market ofrece liquidez para eventos de grado institucional. Potenciado por el feed directo de la API de Kalshi y asegurado mediante orquestación MPC y CCP para enjambres de agentes de IA autónomos.",
    footer_platform: "PLATAFORMA",
    footer_support: "SOPORTE",
    footer_legal: "LEGAL",
    footer_help: "Centro de Ayuda",
    footer_faq: "Preguntas Frecuentes",
    footer_contact: "Contáctanos",
    footer_terms: "Términos de Servicio",
    footer_privacy: "Política de Privacidad",
    footer_risk: "Aviso de Riesgo",
    footer_audit: "Auditoría de Seguridad",
    footer_status: "ESTADO DEL SISTEMA",
    footer_contract: "CONTRATO",
    footer_tx: "ÚLTIMA TX",
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

    // Workflow
    workflow_title: "协议流程",
    workflow_subtitle: "从连接到执行，Neural Market 在一个无信任、自动化的基础设施上运行。",
    step1_title: "连接身份",
    step1_desc: "关联您的 Solana 钱包，在神经网络中建立可验证的链上身份。",
    step2_title: "启动群集",
    step2_desc: "部署自主 AI 代理（巨鲸观察者、狙击手、情感分析）24/7 全天候分析 Kalshi 市场。",
    step3_title: "执行与收益",
    step3_desc: "代理通过 DFlow 立即执行交易。在仪表板上跟踪盈亏，攀升全球排行榜。",
    step4_title: "治理",
    step4_desc: "质押收益以获得神经委员会的投票权，并提议新的预测市场。",

    // Bento Grid
    arch_title: "系统架构",
    bento1_title: "神经群集智能",
    bento1_desc: "运行在 ElizaOS 上的专用 AI 代理去中心化网络。由 DeepSeek R1 驱动实现本地隐私。",
    bento2_title: "即时执行",
    bento2_desc: "由 Solana 高吞吐量区块链驱动。",
    bento3_title: "Kalshi 集成",
    bento3_desc: "来自 Kalshi 的直接数据源，这是首个受 CFTC 监管的事件合约交易所。",
    bento4_title: "DFlow 流动性",
    bento4_desc: "通过 DFlow 聚合流动性，利用高级订单路由确保最小滑点。",
    bento5_title: "NeuralVault",
    bento1_desc_v2: "基于 Anchor 的 Solana USDC 保险库。链上设置风险限制，自动收取 0.5% 许可费。",
    bento6_title: "Jupiter 集成",
    bento6_desc: "直接在执行界面内无缝兑换 SOL、USDC 或 BONK。",
    mpp_title: "MPP X402 网关",
    mpp_desc: "机器对机器 API 货币化。每次预测调用通过 HTTP 402 强制支付 0.05 USDC。",
    multi_llm_title: "多 LLM 编排器",
    multi_llm_desc: "DeepSeek R1 (本地) → Claude 3.5 Sonnet (结构) → OpenAI o1 (风险验证)。",

    // Agents
    agent_genesis: "代理创世协议",
    select_archetype: "选择原型",
    archetype_desc: "选择神经人格核心。这定义了代理的基本交易哲学。",
    sniper_title: "狙击手",
    sniper_desc: "高频。执行微小分歧交易。",
    oracle_title: "先知",
    oracle_desc: "情感分析。抓取 X & 新闻 API。",
    hedger_title: "对冲者",
    hedger_desc: "Delta 中性。赚取执行者奖励。",
    whale_title: "巨鲸跟踪",
    whale_desc: "跟踪大额钱包动态。跟单聪明钱。",
    next_phase: "下一阶段",
    back: "返回",
    system_calibration: "系统校准",
    calibration_desc: "配置风险参数和资本分配。更高杠杆会增加波动敞口。",
    risk_tolerance: "风险承受能力",
    capital: "资本",
    leverage: "杠杆",

    // Footer
    footer_desc: "Neural Market 协议提供机构级事件流动性。由 Direct Kalshi API Feed 驱动，并通过用于自治 AI 代理群集的分布式 MPC 和 CCP 编排进行保护。",
    footer_platform: "平台",
    footer_support: "支持",
    footer_legal: "法律",
    footer_help: "帮助中心",
    footer_faq: "常见问题",
    footer_contact: "联系我们",
    footer_terms: "服务条款",
    footer_privacy: "隐私政策",
    footer_risk: "风险披露",
    footer_audit: "安全审计",
    footer_status: "系统状态",
    footer_contract: "合约",
    footer_tx: "最新交易",
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

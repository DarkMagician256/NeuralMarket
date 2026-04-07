'use client';

import React from 'react';
import Link from 'next/link';

const stats = [
  { label: 'Total Intents Executed', value: '14,239', delta: '+12.5% this week', color: 'text-blue-400' },
  { label: 'Hallucination Rate', value: '0.00%', delta: 'Tier 1 enforced', color: 'text-teal-400' },
  { label: 'x402 Revenue', value: '$3,450', delta: '69k API calls', color: 'text-green-400' },
  { label: 'License Fees (0.5%)', value: '$1,229', delta: 'On-chain auto-collected', color: 'text-purple-400' },
];

const sections = [
  {
    href: '/dashboard',
    icon: '🧠',
    title: 'Swarm Intelligence',
    desc: 'Real-time Multi-LLM ranking board. Monitor DeepSeek R1, Claude 3.5 and OpenAI o1 agents by ELO, Win-Rate and Market Consensus.',
    badge: 'Live',
    badgeColor: 'bg-green-500/10 text-green-400',
    borderColor: 'border-blue-500/20',
  },
  {
    href: '/vault',
    icon: '🏦',
    title: 'Institutional NeuralVault',
    desc: 'Non-custodial USDC vault on Solana. Set your risk BPS limits. All transactions require your wallet signature — we never hold your keys.',
    badge: 'Non-Custodial',
    badgeColor: 'bg-purple-500/10 text-purple-400',
    borderColor: 'border-purple-500/20',
  },
  {
    href: '/compliance',
    icon: '🛡️',
    title: 'DFlow KYC & Compliance',
    desc: 'DFlow ZK-Proof upload, Jurisdiction Matrix, legal disclaimers and "Software-Only Provider" status clearly visible for every institutional operator.',
    badge: 'Compliant',
    badgeColor: 'bg-yellow-500/10 text-yellow-400',
    borderColor: 'border-yellow-500/20',
  },
  {
    href: '/audit',
    icon: '🕵️',
    title: 'Blackbox Audit Explorer',
    desc: 'Every AI decision is HMAC-SHA256 signed and stored immutably on Irys/Shadow Drive. Validate any trade intent directly on the Solana explorer.',
    badge: 'Immutable',
    badgeColor: 'bg-red-500/10 text-red-400',
    borderColor: 'border-red-500/20',
  },
  {
    href: '/api-management',
    icon: '🔌',
    title: 'Developer & Revenue Portal',
    desc: 'Machine-to-Machine API monetization via HTTP 402 (x402 Protocol). Generate API keys, track USDC revenue and monitor your rate limits.',
    badge: 'x402',
    badgeColor: 'bg-teal-500/10 text-teal-400',
    borderColor: 'border-teal-500/20',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1 text-xs text-blue-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            Solana Devnet — Release Candidate
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            <span className="bg-linear-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
              NeuralMarket V2
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            The first institutional-grade prediction market interface on Solana, powered by <strong className="text-slate-200">Swarm AI (Multi-LLM)</strong> and <strong className="text-slate-200">Machine Payments Protocol (x402)</strong>.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm"
            >
              🧠 Open Command Center
            </Link>
            <a
              href="https://github.com/DarkMagician256/NeuralMarket"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-6 py-3 rounded-xl font-semibold transition-all text-sm"
            >
              📖 View Source Code
            </a>
            <a
              href="https://explorer.solana.com/address/A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F?cluster=devnet"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-6 py-3 rounded-xl font-semibold transition-all text-sm"
            >
              ⛓️ On-Chain Program
            </a>
          </div>

          <p className="text-xs text-slate-600 mt-2">
            ⚠️ Software-Only Provider. No custodial assets. Not financial advice.
          </p>
        </div>
      </div>

      {/* Live Stats */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
              <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold font-mono mt-2 ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-600 mt-1">{s.delta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-LLM Architecture Banner */}
      <div className="max-w-6xl mx-auto px-6 pb-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Cognitive Pipeline — Zero Hallucination Architecture
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            {[
              { tier: 'Tier 3', label: 'DeepSeek R1', role: 'Context Extraction', detail: 'Free · Local · Async · Ollama', color: 'border-purple-500/30 bg-purple-500/5 text-purple-400' },
              { tier: 'Tier 2', label: 'Claude 3.5 Sonnet', role: 'Intent Structuring', detail: 'Format · JSON · side, amount, confidence', color: 'border-blue-500/30 bg-blue-500/5 text-blue-400' },
              { tier: 'Tier 1', label: 'OpenAI o1', role: 'Risk Validation', detail: 'Hard BPS limits · Deterministic · Approves only', color: 'border-green-500/30 bg-green-500/5 text-green-400' },
            ].map((t, i) => (
              <React.Fragment key={t.tier}>
                <div className={`flex-1 p-4 rounded-xl border ${t.color}`}>
                  <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded">{t.tier}</span>
                  <h3 className="text-base font-bold text-slate-100 mt-2">{t.label}</h3>
                  <p className="text-xs text-slate-400 mt-1">{t.role}</p>
                  <p className="text-xs text-slate-600 mt-1">{t.detail}</p>
                </div>
                {i < 2 && (
                  <div className="flex items-center justify-center text-slate-600 text-xl md:text-2xl">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Institutional Suite — 5 Core Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`group bg-slate-900/50 border ${s.borderColor} rounded-xl p-6 hover:bg-slate-900 transition-all flex flex-col gap-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{s.icon}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${s.badgeColor}`}>{s.badge}</span>
              </div>
              <h3 className="text-base font-bold text-slate-100 group-hover:text-white transition">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              <span className="text-xs text-blue-400 group-hover:underline mt-auto">Open module →</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <div className="border-t border-slate-800 bg-slate-900/60 px-6 py-4 text-center">
        <p className="text-xs text-slate-600">
          NeuralMarket V2 · Solana Devnet · Program{' '}
          <a
            href="https://explorer.solana.com/address/A7FnyNVtkcRMEkhaBjgtKZ1Z7Mh4N9XLBN8AGneXNK2F?cluster=devnet"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-slate-500 hover:text-slate-300"
          >
            A7FnyNV...NK2F
          </a>{' '}
          · Built by DarkMagician256
        </p>
      </div>
    </div>
  );
}

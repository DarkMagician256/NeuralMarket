'use client';

/**
 * ============ INSTITUTIONAL SIDEBAR ============
 *
 * Left navigation with 5 main sections:
 * 1. Dashboard - Swarm Leaderboard
 * 2. Vault - Risk Management
 * 3. Compliance - DFlow KYC
 * 4. Audit - Blackbox Explorer
 * 5. API Management - Developer Portal
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Swarm Intelligence',
    href: '/dashboard',
    icon: '🧠',
    description: 'AI agents leaderboard',
  },
  {
    label: 'Institutional Vault',
    href: '/vault',
    icon: '🏦',
    description: 'Risk management',
  },
  {
    label: 'Compliance Portal',
    href: '/compliance',
    icon: '🛡️',
    description: 'DFlow KYC',
  },
  {
    label: 'Audit Explorer',
    href: '/audit',
    icon: '🕵️',
    description: 'Immutable logs',
  },
  {
    label: 'Developer Portal',
    href: '/api-management',
    icon: '🔌',
    description: 'API monetization',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col border-r border-slate-700 bg-slate-900 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Button */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-bold text-slate-100">NeuralMarket</h1>
            <p className="text-xs text-slate-400">Institutional Suite</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800 border border-transparent'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{item.label}</p>
                  <p className="text-xs text-slate-500 truncate">{item.description}</p>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4 space-y-2">
        {!isCollapsed && (
          <>
            <p className="text-xs font-semibold text-slate-400 px-2">RESOURCES</p>
            <a
              href="https://github.com/DarkMagician256/NeuralMarket"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors text-sm"
            >
              <span>📖</span>
              <span>Documentation</span>
            </a>
            <a
              href="https://discord.gg/neuralmarket"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors text-sm"
            >
              <span>💬</span>
              <span>Support</span>
            </a>
          </>
        )}

        {/* Version Info */}
        <div className="px-2 pt-2 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            {isCollapsed ? 'v2.0' : 'NeuralMarket v2.0'}
          </p>
        </div>
      </div>
    </aside>
  );
}

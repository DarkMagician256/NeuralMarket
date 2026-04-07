/**
 * ============ NEURALMARKET V2: INSTITUTIONAL DASHBOARD LAYOUT ============
 *
 * Root layout for Next.js 16 App Router
 * Integrates Solana Wallet Adapter, Dark Theme, and Institutional UI
 *
 * Sections:
 * 1. /dashboard - Swarm Leaderboard & Copy-Trading
 * 2. /vault - Institutional NeuralVault (Funds & Risk)
 * 3. /compliance - DFlow KYC & Compliance
 * 4. /audit - Blackbox Audit Explorer (Irys)
 * 5. /api-management - Developer & Revenue Portal
 */

import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Providers from './providers';
import Navbar from '@/components/navigation/Navbar';
import Sidebar from '@/components/navigation/Sidebar';

export const metadata: Metadata = {
  title: 'NeuralMarket V2 | Institutional Dashboard',
  description:
    'AI-powered prediction market oracle. Non-custodial USDC vaults. Kalshi DFlow integration.',
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: 'NeuralMarket V2 | Institutional Dashboard',
    description: 'Multi-LLM oracle + institutional risk management',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#0f172a" />
        <style>{`
          /* Dark mode (default) */
          :root {
            color-scheme: dark;
            --background: 15, 23, 42;        /* slate-900 */
            --foreground: 226, 232, 240;     /* slate-100 */
            --accent: 59, 130, 246;          /* blue-500 */
            --success: 34, 197, 94;          /* green-500 */
            --warning: 249, 115, 22;         /* orange-500 */
            --error: 239, 68, 68;            /* red-500 */
            --border: 30, 41, 59;            /* slate-800 */
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html {
            scroll-behavior: smooth;
          }

          body {
            background: rgb(var(--background));
            color: rgb(var(--foreground));
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            overflow-x: hidden;
          }

          /* Scrollbar styling */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgb(var(--background));
          }

          ::-webkit-scrollbar-thumb {
            background: rgb(var(--border));
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgb(var(--accent));
          }
        `}</style>
      </head>
      <body className="dark bg-slate-900 text-slate-100">
        <Providers>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top Navigation Bar */}
              <Navbar />

              {/* Page Content */}
              <main className="flex-1 overflow-auto bg-slate-950">
                <div className="h-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

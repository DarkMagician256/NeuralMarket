'use client';

/**
 * ============ 1. SWARM LEADERBOARD & COPY-TRADING ============
 *
 * Command center showing:
 * - Top Sentient Agents ranking (ELO, Win-Rate)
 * - Kalshi Social API insights (Top traders consensus)
 * - Copy-trading signals
 */

import { Suspense } from 'react';
import SwarmLeaderboard from '@/components/dashboard/SwarmLeaderboard';
import AgentStats from '@/components/dashboard/AgentStats';
import SocialAPIInsights from '@/components/dashboard/SocialAPIInsights';
import LoadingCard from '@/components/ui/LoadingCard';

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-100">
          🧠 Swarm Intelligence Command Center
        </h1>
        <p className="text-slate-400">
          Real-time monitoring of AI agents, market consensus, and copy-trading signals
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Leaderboard (2 columns) */}
        <div className="xl:col-span-2">
          <Suspense fallback={<LoadingCard />}>
            <SwarmLeaderboard />
          </Suspense>
        </div>

        {/* Agent Stats Sidebar */}
        <div className="space-y-6">
          <Suspense fallback={<LoadingCard />}>
            <AgentStats />
          </Suspense>
        </div>
      </div>

      {/* Social API Insights */}
      <Suspense fallback={<LoadingCard />}>
        <SocialAPIInsights />
      </Suspense>
    </div>
  );
}

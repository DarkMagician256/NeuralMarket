'use client';

/**
 * ============ 5. DEVELOPER & REVENUE PORTAL ============
 *
 * B2B API management dashboard:
 * - API key generation (nrm_ins_...)
 * - Real-time x402 Protocol earnings tracking
 * - Machine-to-Machine monetization metrics
 * - Rate limiting & quota management
 */

import { Suspense } from 'react';
import APIKeyManager from '@/components/api-management/APIKeyManager';
import RevenueChart from '@/components/api-management/RevenueChart';
import RateLimitDashboard from '@/components/api-management/RateLimitDashboard';
import DocumentationPanel from '@/components/api-management/DocumentationPanel';
import LoadingCard from '@/components/ui/LoadingCard';

export default function APIManagementPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-100">
          🔌 Developer & Revenue Portal
        </h1>
        <p className="text-slate-400">
          Machine-to-Machine API monetization via x402 Protocol
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* API Key Manager (2 columns) */}
        <div className="xl:col-span-2 space-y-6">
          <Suspense fallback={<LoadingCard height="h-64" />}>
            <APIKeyManager />
          </Suspense>

          <Suspense fallback={<LoadingCard height="h-96" />}>
            <RevenueChart />
          </Suspense>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Suspense fallback={<LoadingCard height="h-48" />}>
            <RateLimitDashboard />
          </Suspense>

          <Suspense fallback={<LoadingCard height="h-64" />}>
            <DocumentationPanel />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

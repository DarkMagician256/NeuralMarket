'use client';

/**
 * ============ 4. BLACKBOX AUDIT EXPLORER ============
 *
 * Immutable compliance view:
 * - Sortable data table of Kalshi predictions
 * - Irys/Shadow Drive integration for reasoning logs
 * - Solana Tx Hash verification of protocol fees
 * - Modal for detailed trade reasoning
 */

import { Suspense } from 'react';
import BlackBoxDataTable from '@/components/audit/BlackBoxDataTable';
import AuditStats from '@/components/audit/AuditStats';
import ComplianceReport from '@/components/audit/ComplianceReport';
import LoadingCard from '@/components/ui/LoadingCard';

export default function AuditPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-100">
          🕵️ Blackbox Audit Explorer
        </h1>
        <p className="text-slate-400">
          Immutable trade reasoning logs verified on-chain via Solana
        </p>
      </div>

      {/* Stats Overview */}
      <Suspense fallback={<LoadingCard height="h-32" />}>
        <AuditStats />
      </Suspense>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Data Table (3 columns) */}
        <div className="xl:col-span-3">
          <Suspense fallback={<LoadingCard height="h-96" />}>
            <BlackBoxDataTable />
          </Suspense>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Suspense fallback={<LoadingCard height="h-96" />}>
            <ComplianceReport />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

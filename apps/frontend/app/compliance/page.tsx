'use client';

/**
 * ============ 3. DFLOW KYC & COMPLIANCE PORTAL ============
 *
 * Gated workflow for institutional compliance:
 * - DFlow Proof verification
 * - Jurisdiction checks
 * - Legal disclaimers (no US persons)
 * - "Delegate to Sentinel" unlock
 */

import { Suspense } from 'react';
import DFlowKYCPortal from '@/components/compliance/DFlowKYCPortal';
import ComplianceStatus from '@/components/compliance/ComplianceStatus';
import JurisdictionMatrix from '@/components/compliance/JurisdictionMatrix';
import LegalDisclaimers from '@/components/compliance/LegalDisclaimers';
import LoadingCard from '@/components/ui/LoadingCard';

export default function CompliancePage() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-100">
          🛡️ DFlow KYC & Compliance
        </h1>
        <p className="text-slate-400">
          Verify institutional credentials and governance prerequisites
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* KYC Portal (2 columns) */}
        <div className="xl:col-span-2">
          <Suspense fallback={<LoadingCard height="h-96" />}>
            <DFlowKYCPortal />
          </Suspense>
        </div>

        {/* Status & Metrics */}
        <div className="space-y-6">
          <Suspense fallback={<LoadingCard height="h-48" />}>
            <ComplianceStatus />
          </Suspense>
        </div>
      </div>

      {/* Jurisdiction & Legal */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Suspense fallback={<LoadingCard height="h-64" />}>
          <JurisdictionMatrix />
        </Suspense>

        <Suspense fallback={<LoadingCard height="h-64" />}>
          <LegalDisclaimers />
        </Suspense>
      </div>
    </div>
  );
}

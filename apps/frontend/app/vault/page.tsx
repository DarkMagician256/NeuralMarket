'use client';

/**
 * ============ 2. INSTITUTIONAL NEURALVAULT ============
 *
 * Risk management control panel for hedge funds:
 * - Deposit/withdraw Devnet USDC
 * - Yield strategy toggle (USDC vs Kamino sUSDC)
 * - Risk slider (max_position_size_bps)
 * - Non-custodial emphasis
 */

import { Suspense } from 'react';
import NeuralVaultPanel from '@/components/vault/NeuralVaultPanel';
import VaultMetrics from '@/components/vault/VaultMetrics';
import YieldStrategy from '@/components/vault/YieldStrategy';
import PositionMonitor from '@/components/vault/PositionMonitor';
import LoadingCard from '@/components/ui/LoadingCard';

export default function VaultPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-100">
          🏦 Institutional NeuralVault
        </h1>
        <p className="text-slate-400">
          Non-custodial USDC vault with institutional risk controls
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-400">Connected • Ready to Trade</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Vault Control Panel (2 columns) */}
        <div className="xl:col-span-2 space-y-6">
          <Suspense fallback={<LoadingCard height="h-96" />}>
            <NeuralVaultPanel />
          </Suspense>

          <Suspense fallback={<LoadingCard height="h-64" />}>
            <PositionMonitor />
          </Suspense>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Suspense fallback={<LoadingCard height="h-48" />}>
            <VaultMetrics />
          </Suspense>

          <Suspense fallback={<LoadingCard height="h-64" />}>
            <YieldStrategy />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

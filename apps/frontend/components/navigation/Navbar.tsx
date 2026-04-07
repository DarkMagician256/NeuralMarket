'use client';

/**
 * ============ INSTITUTIONAL NAVBAR ============
 *
 * Top navigation bar with:
 * - Logo & branding
 * - Wallet connection status
 * - Network indicator
 * - Quick actions
 */

import React from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { shortenAddress } from '@/lib/utils';

export default function Navbar() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();

  return (
    <nav className="h-16 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left Side: Logo & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">NM</span>
          </div>
          <div>
            <p className="text-xs text-slate-400">NeuralMarket V2</p>
            <p className="text-sm font-semibold text-slate-100">Institutional Dashboard</p>
          </div>
        </div>
      </div>

      {/* Right Side: Status & Actions */}
      <div className="flex items-center gap-4">
        {/* Network Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-slate-300">
            Devnet {connection.rpcEndpoint.includes('helius') ? '(Helius)' : '(Public)'}
          </span>
        </div>

        {/* Wallet Status */}
        {connected && publicKey && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs font-mono text-green-400">
              {shortenAddress(publicKey.toString())}
            </span>
          </div>
        )}

        {/* Wallet Adapter Button */}
        <WalletMultiButton />
      </div>
    </nav>
  );
}

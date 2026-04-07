'use client';

/**
 * ============ CONTEXT & PROVIDER SETUP ============
 *
 * Wraps the app with:
 * - Solana Wallet Adapter (WalletAdapterNetwork.Devnet)
 * - Institutional context (vaultState, complianceState)
 * - Toast notifications
 * - Theme context (dark mode)
 */

import React, { ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Require styles
require('@solana/wallet-adapter-react-ui/styles.css');

export default function Providers({ children }: { children: ReactNode }) {
  // Configure Solana Devnet
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    clusterApiUrl('devnet');

  // Configure wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

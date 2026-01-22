'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

import '@solana/wallet-adapter-react-ui/styles.css';

// Import centralized constants
const SOLANA_CLUSTER = (process.env.NEXT_PUBLIC_SOLANA_CLUSTER || 'devnet') as 'devnet' | 'mainnet-beta' | 'testnet';

// Map cluster name to WalletAdapterNetwork
const networkMap: Record<string, WalletAdapterNetwork> = {
    'devnet': WalletAdapterNetwork.Devnet,
    'testnet': WalletAdapterNetwork.Testnet,
    'mainnet-beta': WalletAdapterNetwork.Mainnet,
};

export default function SolanaProvider({ children }: { children: React.ReactNode }) {
    // Use environment-configured network
    const network = networkMap[SOLANA_CLUSTER] || WalletAdapterNetwork.Devnet;

    // Use custom RPC endpoint if provided (Helius recommended for production)
    const endpoint = useMemo(() => {
        // Priority: Helius > Custom RPC > Default cluster URL
        if (process.env.NEXT_PUBLIC_HELIUS_RPC) {
            return process.env.NEXT_PUBLIC_HELIUS_RPC;
        }
        if (process.env.NEXT_PUBLIC_RPC_URL) {
            return process.env.NEXT_PUBLIC_RPC_URL;
        }
        // Fallback to cluster API URL
        const clusterUrls: Record<WalletAdapterNetwork, string> = {
            [WalletAdapterNetwork.Devnet]: 'https://api.devnet.solana.com',
            [WalletAdapterNetwork.Testnet]: 'https://api.testnet.solana.com',
            [WalletAdapterNetwork.Mainnet]: 'https://api.mainnet-beta.solana.com',
        };
        return clusterUrls[network];
    }, [network]);

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

"use client";

import useSWR from 'swr';
import { getKalshiPositions, getKalshiBalance, getKalshiOrders } from '@/app/actions/kalshiTrading';
import { useWallet } from '@solana/wallet-adapter-react';

export const useKalshiPortfolio = () => {
    const { publicKey, connected } = useWallet();
    const walletAddress = publicKey?.toBase58();

    // Fetch Kalshi platform data (Server Actions)
    const { data: positions, isLoading: loadingPositions, mutate: mutatePositions } = useSWR(
        connected ? ['kalshi-positions', walletAddress] : null,
        () => getKalshiPositions(),
        { refreshInterval: 10000 }
    );

    const { data: balance, isLoading: loadingBalance, mutate: mutateBalance } = useSWR(
        connected ? ['kalshi-balance', walletAddress] : null,
        () => getKalshiBalance(),
        { refreshInterval: 10000 }
    );

    const { data: orders, isLoading: loadingOrders, mutate: mutateOrders } = useSWR(
        connected ? ['kalshi-orders', walletAddress] : null,
        () => getKalshiOrders({ status: 'resting' }),
        { refreshInterval: 10000 }
    );

    return {
        positions: positions || [],
        balance: balance || { balance: 0, payout: 0 },
        orders: orders || [],
        isLoading: loadingPositions || loadingBalance || loadingOrders,
        refresh: () => {
            mutatePositions();
            mutateBalance();
            mutateOrders();
        }
    };
};

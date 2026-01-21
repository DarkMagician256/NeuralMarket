"use client";

import useSWR from 'swr';
import { getUserTrades } from '@/app/actions/getTrades';
import { useWallet } from '@solana/wallet-adapter-react';

export const usePortfolio = () => {
    const { publicKey } = useWallet();
    const walletAddress = publicKey?.toBase58();

    const { data, error, isLoading, mutate } = useSWR(
        walletAddress ? ['trades', walletAddress] : null,
        ([, address]) => getUserTrades(address),
        {
            refreshInterval: 5000,
            revalidateOnFocus: true
        }
    );

    return {
        trades: data || [],
        isLoading,
        isError: error,
        refresh: mutate
    };
};

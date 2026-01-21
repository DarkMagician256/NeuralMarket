"use client";

import useSWR from 'swr';
import { getLiveMarkets } from '@/app/actions/getMarkets';

export const useMarketData = () => {
    const { data, error, isLoading, mutate } = useSWR('live-markets', getLiveMarkets, {
        refreshInterval: 10000, // Refresh every 10 seconds
        revalidateOnFocus: true
    });

    return {
        markets: data || [],
        isLoading,
        isError: error,
        refresh: mutate
    };
};

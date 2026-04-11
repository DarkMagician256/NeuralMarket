"use server";

import { supabase } from '@/lib/supabase';

export async function getUserTrades(walletAddress: string) {
    try {
        const { data, error } = await supabase
            .from('trades')
            .select('*')
            .eq('wallet_address', walletAddress)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching user trades:", error);
            return [];
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching user trades:", err);
        return [];
    }
}

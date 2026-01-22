"use server";

import { createClient } from '@supabase/supabase-js';

export async function getUserTrades(walletAddress: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return [];

    const supabase = createClient(supabaseUrl, supabaseKey);

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
}

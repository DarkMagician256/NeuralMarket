import CortexClient from './CortexClient';
import { createClient } from '@supabase/supabase-js';

// Server-side fetching for initial state
export const dynamic = 'force-dynamic'; // Prevent static gen failure on Vercel

export default async function CortexPage() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Robust check to avoid crash if envs are missing
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
        console.warn('⚠️ CortexPage: Missing Supabase envs, rendering empty state.');
        return <CortexClient initialThoughts={[]} />;
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Fetch initial thoughts for SSR
        const { data: initialThoughts } = await supabase
            .from('agent_thoughts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        return <CortexClient initialThoughts={initialThoughts || []} />;
    } catch (error) {
        console.error('Error in CortexPage SSR:', error);
        return <CortexClient initialThoughts={[]} />;
    }
}

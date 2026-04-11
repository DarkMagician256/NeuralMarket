import CortexClient from './CortexClient';
import { supabase } from '@/lib/supabase';

// Server-side fetching for initial state
export const dynamic = 'force-dynamic'; // Prevent static gen failure on Vercel

export default async function CortexPage() {
    try {
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

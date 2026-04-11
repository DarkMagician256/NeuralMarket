import { createClient } from '@supabase/supabase-js';

// Fallback to a syntactically valid URL if env var is missing to prevent build crashes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('⚠️ Supabase environment variables missing. Using fallback for build compatibility.');
}

// On server, use service key if available for full access
// On client, only anon key is available
const supabaseKey = (typeof window === 'undefined' ? process.env.SUPABASE_SERVICE_KEY : null) || supabaseAnonKey;

// Client-side singleton (also used on server)
export const supabase = createClient(supabaseUrl, supabaseKey);

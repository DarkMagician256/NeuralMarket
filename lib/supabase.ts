import { createClient } from '@supabase/supabase-js';

// Fallback to a syntactically valid URL if env var is missing to prevent build crashes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('⚠️ Supabase environment variables missing. Using fallback for build compatibility.');
}

// Client-side singleton
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

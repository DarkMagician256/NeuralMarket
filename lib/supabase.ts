import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) {
    console.warn('⚠️ Supabase environment variables are missing or default! Real-time features will be limited.');
}

// Client-side singleton - using placeholders if missing to prevent boot crash
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

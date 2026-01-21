const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const SUPABASE_URL = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = envConfig.SUPABASE_SERVICE_KEY; // Must use Service Key for table creation

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("❌ Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SQL_SCHEMA = `
  -- Thoughts Table (Real-time Stream)
  CREATE TABLE IF NOT EXISTS public.agent_thoughts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id TEXT NOT NULL,
    thought_content TEXT NOT NULL,
    thought_type TEXT DEFAULT 'ANALYSIS',
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
  );

  -- Predictions Table (Performance Tracking)
  CREATE TABLE IF NOT EXISTS public.market_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id TEXT NOT NULL,
    market_ticker TEXT NOT NULL,
    prediction_side TEXT,
    confidence_level FLOAT,
    proof_link TEXT,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
  );

  -- Telemetry Table (System Health)
  CREATE TABLE IF NOT EXISTS public.system_telemetry (
    agent_id TEXT PRIMARY KEY,
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'OFFLINE',
    wallet_balance FLOAT DEFAULT 0.0,
    memory_usage FLOAT DEFAULT 0.0,
    cpu_usage FLOAT DEFAULT 0.0
  );

  -- Trades Table (Portfolio)
  CREATE TABLE IF NOT EXISTS public.trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_address TEXT NOT NULL, -- Renamed from 'user' to avoid reserved keyword conflict
    ticker TEXT NOT NULL,
    outcome TEXT NOT NULL,
    amount FLOAT NOT NULL,
    signature TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Enable Realtime
  ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_thoughts;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.system_telemetry;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.trades;
`;

async function setupDatabase() {
    console.log("🚀 Initializing Supabase Schema...");

    // NOTE: Supabase JS client cannot run raw SQL directly on the standard API unless using RPC function.
    // This script assumes the user has an SQL runner or we use pg library.
    // Since we are limited, we will log the SQL instructions for the user if direct execution fails,
    // OR we can try to use standard table creation via API if possible (Supabase API doesn't support Create Table).

    console.log("\n⚠️ IMPORTANT: Supabase Client cannot create tables directly via JS SDK.");
    console.log("👉 Please copy and paste the following SQL into your Supabase SQL Editor:\n");
    console.log(SQL_SCHEMA);
    console.log("\n✅ Once executed in Supabase, your backend will be ready.");
}

setupDatabase();

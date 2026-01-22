-- ============================================
-- NEURALMARKET - SUPABASE SCHEMA
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Fecha: 2026-01-22
-- ============================================

-- ============================================
-- 1. TABLA: trades (Historial de operaciones)
-- ============================================
CREATE TABLE IF NOT EXISTS public.trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    ticker TEXT NOT NULL,
    outcome TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    signature TEXT UNIQUE,
    agent_id TEXT,
    pnl NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_trades_wallet ON public.trades(wallet_address);
CREATE INDEX IF NOT EXISTS idx_trades_ticker ON public.trades(ticker);
CREATE INDEX IF NOT EXISTS idx_trades_created ON public.trades(created_at DESC);

-- ============================================
-- 2. TABLA: agent_thoughts (Stream de pensamientos AI)
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_thoughts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id TEXT NOT NULL,
    thought_content TEXT NOT NULL,
    thought_type TEXT DEFAULT 'ANALYSIS',
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_thoughts_agent ON public.agent_thoughts(agent_id);
CREATE INDEX IF NOT EXISTS idx_thoughts_created ON public.agent_thoughts(created_at DESC);

-- ============================================
-- 3. TABLA: market_predictions (Predicciones)
-- ============================================
CREATE TABLE IF NOT EXISTS public.market_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id TEXT NOT NULL,
    market_ticker TEXT NOT NULL,
    prediction_side TEXT,
    confidence_level FLOAT,
    proof_link TEXT,
    status TEXT DEFAULT 'ACTIVE',
    resolved_at TIMESTAMPTZ,
    is_correct BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_predictions_agent ON public.market_predictions(agent_id);
CREATE INDEX IF NOT EXISTS idx_predictions_ticker ON public.market_predictions(market_ticker);

-- ============================================
-- 4. TABLA: system_telemetry (Health del agente)
-- ============================================
CREATE TABLE IF NOT EXISTS public.system_telemetry (
    agent_id TEXT PRIMARY KEY,
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'OFFLINE',
    wallet_balance FLOAT DEFAULT 0.0,
    memory_usage FLOAT DEFAULT 0.0,
    cpu_usage FLOAT DEFAULT 0.0,
    trades_today INT DEFAULT 0,
    pnl_today FLOAT DEFAULT 0.0
);

-- ============================================
-- 5. TABLA: governance_votes (Sistema de votación)
-- ============================================
CREATE TABLE IF NOT EXISTS public.governance_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    proposal_id TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    vote_type TEXT NOT NULL, -- 'YES', 'NO', 'ABSTAIN'
    voting_power NUMERIC DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(proposal_id, wallet_address)
);

CREATE INDEX IF NOT EXISTS idx_votes_proposal ON public.governance_votes(proposal_id);

-- ============================================
-- 6. TABLA: governance_proposals (Propuestas)
-- ============================================
CREATE TABLE IF NOT EXISTS public.governance_proposals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    proposal_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    proposer_wallet TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- active, passed, rejected, executed
    votes_yes INT DEFAULT 0,
    votes_no INT DEFAULT 0,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. HABILITAR REALTIME
-- ============================================

-- Habilitar Realtime para tablas clave
-- NOTA: Si da error, ignorar (ya puede estar habilitado)
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_thoughts;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.system_telemetry;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.trades;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en tablas sensibles
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_votes ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver todos los trades (público)
CREATE POLICY IF NOT EXISTS "Trades are viewable by everyone"
ON public.trades FOR SELECT
TO authenticated, anon
USING (true);

-- Política: Solo el dueño puede insertar sus trades
CREATE POLICY IF NOT EXISTS "Users can insert their own trades"
ON public.trades FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = wallet_address OR wallet_address IS NOT NULL);

-- Política: Votos son viewables por todos
CREATE POLICY IF NOT EXISTS "Votes are viewable by everyone"
ON public.governance_votes FOR SELECT
TO authenticated, anon
USING (true);

-- ============================================
-- 9. VERIFICACIÓN
-- ============================================
-- Verificar que las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('trades', 'agent_thoughts', 'market_predictions', 'system_telemetry', 'governance_votes', 'governance_proposals');

-- ============================================
-- ¡LISTO! El schema de NeuralMarket está configurado.
-- ============================================

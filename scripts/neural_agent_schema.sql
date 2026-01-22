-- ============================================
-- NEURAL AGENT - SUPABASE SCHEMA
-- Additional tables for ElizaOS Neural Agent persistence
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================

-- ============================================
-- 1. TABLA: agent_accounts (Agent user accounts)
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    avatar_url TEXT,
    details JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_accounts_id ON public.agent_accounts(id);

-- ============================================
-- 2. TABLA: agent_memories (ElizaOS memories)
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    agent_id UUID,
    room_id UUID NOT NULL,
    content JSONB NOT NULL,
    embedding FLOAT8[],
    unique_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_memories_room ON public.agent_memories(room_id);
CREATE INDEX IF NOT EXISTS idx_agent_memories_user ON public.agent_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_memories_created ON public.agent_memories(created_at DESC);

-- ============================================
-- 3. TABLA: agent_goals (Agent goals/objectives)
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    room_id UUID,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'IN_PROGRESS',
    objectives JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_goals_room ON public.agent_goals(room_id);
CREATE INDEX IF NOT EXISTS idx_agent_goals_status ON public.agent_goals(status);

-- ============================================
-- 4. TABLA: agent_rooms (Conversation rooms)
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. TABLA: agent_logs (Agent activity logs)
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    room_id UUID,
    type TEXT NOT NULL,
    body JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_agent_logs_room ON public.agent_logs(room_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_type ON public.agent_logs(type);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created ON public.agent_logs(created_at DESC);

-- ============================================
-- 6. TABLA: agent_relationships (User relationships)
-- ============================================
CREATE TABLE IF NOT EXISTS public.agent_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a UUID NOT NULL,
    user_b UUID NOT NULL,
    relationship_type TEXT DEFAULT 'CONNECTED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_a, user_b)
);

-- ============================================
-- 7. HABILITAR REALTIME PARA AGENT TABLES
-- ============================================
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_memories;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_logs;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ============================================
-- 8. ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.agent_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_goals ENABLE ROW LEVEL SECURITY;

-- Policies for service-level access (Neural Agent uses service key)
CREATE POLICY IF NOT EXISTS "Service can access all memories"
ON public.agent_memories FOR ALL
TO service_role
USING (true);

CREATE POLICY IF NOT EXISTS "Service can access all logs"
ON public.agent_logs FOR ALL
TO service_role
USING (true);

CREATE POLICY IF NOT EXISTS "Service can access all goals"
ON public.agent_goals FOR ALL
TO service_role
USING (true);

-- ============================================
-- 9. VERIFICATION
-- ============================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'agent_%';

-- ============================================
-- COMPLETE! Neural Agent database is ready.
-- ============================================

-- ============================================
-- ELIZAOS AGENT RUNTIME TABLES
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Fecha: 2026-01-23
-- SOLO LAS TABLAS NUEVAS REQUERIDAS PARA RAILWAY
-- ============================================

-- NOTA: Si pgvector no está habilitado, la tabla agent_memories 
-- dará error. Puedes omitir la columna 'embedding' o habilitar pgvector.

-- Agent Accounts
CREATE TABLE IF NOT EXISTS public.agent_accounts (
    id UUID PRIMARY KEY,
    name TEXT,
    username TEXT,
    email TEXT,
    avatar_url TEXT,
    details JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_accounts_username ON public.agent_accounts(username);

-- Agent Memories (sin vector si pgvector no está disponible)
CREATE TABLE IF NOT EXISTS public.agent_memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    agent_id UUID,
    room_id UUID,
    content JSONB DEFAULT '{}'::JSONB,
    embedding TEXT,  -- Usar TEXT si pgvector no está habilitado
    unique_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_memories_room ON public.agent_memories(room_id);
CREATE INDEX IF NOT EXISTS idx_agent_memories_agent ON public.agent_memories(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_memories_created ON public.agent_memories(created_at DESC);

-- Agent Rooms
CREATE TABLE IF NOT EXISTS public.agent_rooms (
    id UUID PRIMARY KEY,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Participants (TABLA CRÍTICA - Esta era la que faltaba)
CREATE TABLE IF NOT EXISTS public.agent_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    room_id UUID NOT NULL,
    last_message_read UUID,
    user_state TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, room_id)
);

CREATE INDEX IF NOT EXISTS idx_agent_participants_user ON public.agent_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_participants_room ON public.agent_participants(room_id);

-- Agent Goals
CREATE TABLE IF NOT EXISTS public.agent_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID,
    user_id UUID,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'IN_PROGRESS',
    objectives JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_goals_room ON public.agent_goals(room_id);
CREATE INDEX IF NOT EXISTS idx_agent_goals_status ON public.agent_goals(status);

-- Agent Logs
CREATE TABLE IF NOT EXISTS public.agent_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    room_id UUID,
    type TEXT NOT NULL,
    body JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_logs_room ON public.agent_logs(room_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_type ON public.agent_logs(type);

-- Agent Relationships
CREATE TABLE IF NOT EXISTS public.agent_relationships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_a UUID NOT NULL,
    user_b UUID NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_a, user_b)
);

CREATE INDEX IF NOT EXISTS idx_agent_relationships_users ON public.agent_relationships(user_a, user_b);

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'agent_%';

-- ¡LISTO! Ahora puedes redesplegar en Railway.

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- TABLE: knowledge_base
-- Purpose: Store all knowledge documents with embeddings for vector search
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(1536), -- OpenAI text-embedding-3-small produces 1536-dim vectors
  metadata JSONB DEFAULT '{}',
  persona_tags TEXT[] DEFAULT '{}', -- ['supplier', 'distributor', 'sales', 'marketing', 'operations', 'compliance']
  pain_point_tags TEXT[] DEFAULT '{}', -- ['pain_1', 'pain_2', ..., 'pain_6']
  source_type VARCHAR(50), -- 'research-doc' | 'web' | 'case-study' | 'feature-doc'
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast retrieval
CREATE INDEX IF NOT EXISTS idx_kb_embedding ON public.knowledge_base USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_kb_persona_tags ON public.knowledge_base USING gin (persona_tags);
CREATE INDEX IF NOT EXISTS idx_kb_pain_point_tags ON public.knowledge_base USING gin (pain_point_tags);
CREATE INDEX IF NOT EXISTS idx_kb_source_type ON public.knowledge_base(source_type);

-- ============================================================================
-- TABLE: user_personas
-- Purpose: Store multi-dimensional persona scores for each user/session
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE,
  session_id VARCHAR(255) UNIQUE NOT NULL,

  -- Dimension 1: User Type Scores (0.0 - 1.0)
  supplier_score DECIMAL(3,2) DEFAULT 0.0,
  distributor_score DECIMAL(3,2) DEFAULT 0.0,

  -- Dimension 2: Supplier Size (if supplier) (0.0 - 1.0)
  craft_score DECIMAL(3,2) DEFAULT 0.0,
  mid_sized_score DECIMAL(3,2) DEFAULT 0.0,
  large_score DECIMAL(3,2) DEFAULT 0.0,

  -- Dimension 3: Functional Focus Areas (0.0 - 1.0)
  sales_focus_score DECIMAL(3,2) DEFAULT 0.0,
  marketing_focus_score DECIMAL(3,2) DEFAULT 0.0,
  operations_focus_score DECIMAL(3,2) DEFAULT 0.0,
  compliance_focus_score DECIMAL(3,2) DEFAULT 0.0,

  -- Detected Pain Points
  pain_points_detected TEXT[] DEFAULT '{}', -- ['pain_1', 'pain_2', ...]
  pain_points_confidence JSONB DEFAULT '{}', -- { "pain_1": 0.85, "pain_2": 0.62, ... }

  -- Metadata
  overall_confidence DECIMAL(3,2) DEFAULT 0.0,
  total_interactions INTEGER DEFAULT 0,
  questions_asked TEXT[] DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT NOW(),

  -- Explicit Overrides (user-confirmed)
  user_confirmed_type VARCHAR(50),
  user_confirmed_size VARCHAR(50),

  -- Data Connection Status
  data_connected BOOLEAN DEFAULT FALSE,
  data_sources JSONB DEFAULT '{}', -- { "depletions": true, "field_activity": false, ... }

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_up_session_id ON public.user_personas(session_id);
CREATE INDEX IF NOT EXISTS idx_up_user_id ON public.user_personas(user_id);
CREATE INDEX IF NOT EXISTS idx_up_created_at ON public.user_personas(created_at);

-- ============================================================================
-- TABLE: conversation_history
-- Purpose: Store all messages and context snapshots for each conversation
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.conversation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL,
  user_id UUID,

  message_role VARCHAR(20) NOT NULL, -- 'user' | 'assistant'
  message_content TEXT NOT NULL,

  -- Context snapshot at time of message
  persona_snapshot JSONB, -- Full PersonaScores at this moment
  pain_points_inferred TEXT[],

  -- UI Generated (if assistant message)
  ui_specification JSONB,
  generation_mode VARCHAR(50), -- 'fresh' | 'returning' | 'data-connected'
  estimated_read_time VARCHAR(20), -- e.g., "5 min read"

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ch_session_messages ON public.conversation_history(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ch_user_id ON public.conversation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ch_generation_mode ON public.conversation_history(generation_mode);

-- ============================================================================
-- TABLE: persona_signals
-- Purpose: Track individual signals that contribute to persona scores (audit trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.persona_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL,

  signal_type VARCHAR(50), -- 'keyword_match' | 'self_identification' | 'navigation_behavior' | 'utc_params'
  signal_text TEXT,
  signal_strength VARCHAR(20), -- 'strong' | 'moderate' | 'weak'

  score_updates JSONB, -- { "supplier_score": +0.3, "pain_1": +0.2, ... }
  pain_points_inferred TEXT[],

  confidence_before DECIMAL(3,2),
  confidence_after DECIMAL(3,2),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ps_session_id ON public.persona_signals(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ps_signal_type ON public.persona_signals(signal_type);

-- ============================================================================
-- TABLE: generated_brochures
-- Purpose: Store personalized brochures generated for returning users
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.generated_brochures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL,
  user_id UUID,

  brochure_content JSONB NOT NULL, -- Full brochure structure with sections
  persona_context JSONB NOT NULL, -- PersonaScores used to generate this
  questions_analyzed TEXT[],
  pain_points_addressed TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gb_session_id ON public.generated_brochures(session_id);
CREATE INDEX IF NOT EXISTS idx_gb_user_id ON public.generated_brochures(user_id);

-- ============================================================================
-- FUNCTION: match_documents
-- Purpose: Vector similarity search on knowledge base
-- ============================================================================
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5,
  filter_personas text[] DEFAULT '{}'
)
RETURNS TABLE(
  id uuid,
  content text,
  metadata jsonb,
  similarity float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.content,
    kb.metadata,
    1 - (kb.embedding <=> query_embedding) as similarity
  FROM public.knowledge_base kb
  WHERE (
    filter_personas = '{}'
    OR kb.persona_tags && filter_personas
  )
  AND (1 - (kb.embedding <=> query_embedding)) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================================================
-- FUNCTION: hybrid_search
-- Purpose: Combined vector search + full-text search for better results
-- ============================================================================
CREATE OR REPLACE FUNCTION hybrid_search(
  query_text text,
  query_embedding vector(1536),
  filter_personas text[] DEFAULT '{}',
  match_count int DEFAULT 10
)
RETURNS TABLE(
  id uuid,
  content text,
  metadata jsonb,
  vector_similarity float,
  text_relevance float,
  combined_score float
) LANGUAGE plpgsql AS $$
DECLARE
  v_weight float := 0.6;
  t_weight float := 0.4;
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.content,
    kb.metadata,
    (1 - (kb.embedding <=> query_embedding))::float as vector_similarity,
    ts_rank(
      to_tsvector('english', kb.content),
      plainto_tsquery('english', query_text)
    )::float as text_relevance,
    (
      v_weight * (1 - (kb.embedding <=> query_embedding))
      + t_weight * ts_rank(
        to_tsvector('english', kb.content),
        plainto_tsquery('english', query_text)
      )
    )::float as combined_score
  FROM public.knowledge_base kb
  WHERE (
    filter_personas = '{}'
    OR kb.persona_tags && filter_personas
  )
  AND (
    kb.embedding <=> query_embedding < 1.5
    OR to_tsvector('english', kb.content) @@ plainto_tsquery('english', query_text)
  )
  ORDER BY combined_score DESC
  LIMIT match_count;
END;
$$;

-- ============================================================================
-- FUNCTION: update_persona_updated_at
-- Purpose: Trigger to update last_updated timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_personas_updated_at
  BEFORE UPDATE ON public.user_personas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- RLS (Row Level Security) Policies
-- Enable RLS on tables
-- ============================================================================
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_brochures ENABLE ROW LEVEL SECURITY;

-- Allow public read access to knowledge_base (no auth needed for AI queries)
CREATE POLICY "knowledge_base_read_public" ON public.knowledge_base
  FOR SELECT USING (true);

-- Allow service role to write to knowledge_base
CREATE POLICY "knowledge_base_write_service_role" ON public.knowledge_base
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "knowledge_base_update_service_role" ON public.knowledge_base
  FOR UPDATE USING (auth.role() = 'service_role');

-- User persona policies - users can only see their own
CREATE POLICY "user_personas_select_own" ON public.user_personas
  FOR SELECT USING (
    auth.uid() = user_id
    OR session_id IS NOT NULL
  );

CREATE POLICY "user_personas_insert_own" ON public.user_personas
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR auth.role() = 'service_role'
  );

CREATE POLICY "user_personas_update_own" ON public.user_personas
  FOR UPDATE USING (
    auth.uid() = user_id
    OR auth.role() = 'service_role'
  );

-- Conversation history - users can only see their own
CREATE POLICY "conversation_history_select_own" ON public.conversation_history
  FOR SELECT USING (
    auth.uid() = user_id
    OR auth.role() = 'service_role'
  );

CREATE POLICY "conversation_history_insert_own" ON public.conversation_history
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR auth.role() = 'service_role'
  );

-- Persona signals - service role only
CREATE POLICY "persona_signals_service_role" ON public.persona_signals
  FOR ALL USING (auth.role() = 'service_role');

-- Generated brochures - users can only see their own
CREATE POLICY "generated_brochures_select_own" ON public.generated_brochures
  FOR SELECT USING (
    auth.uid() = user_id
    OR auth.role() = 'service_role'
  );

CREATE POLICY "generated_brochures_insert_own" ON public.generated_brochures
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR auth.role() = 'service_role'
  );

-- ============================================================================
-- Sample Data for Testing (optional - comment out for production)
-- ============================================================================
-- Note: In production, populate via admin panel or data import script
-- INSERT INTO public.knowledge_base (content, metadata, persona_tags, pain_point_tags, source_type, source_url)
-- VALUES (
--   'Sample content about execution blind spot...',
--   '{"category": "pain_1", "region": "US"}',
--   ARRAY['supplier', 'sales', 'marketing'],
--   ARRAY['pain_1'],
--   'research-doc',
--   'https://example.com/research'
-- );

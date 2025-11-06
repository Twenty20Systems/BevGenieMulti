-- Performance Indexes for Core Tables
-- Adds indexes to optimize query performance

-- User Personas Indexes
CREATE INDEX IF NOT EXISTS idx_personas_session
  ON user_personas(session_id);

CREATE INDEX IF NOT EXISTS idx_personas_updated
  ON user_personas(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_personas_type
  ON user_personas(persona_type)
  WHERE persona_type IS NOT NULL;

-- Conversation History Indexes
CREATE INDEX IF NOT EXISTS idx_conversation_session
  ON conversation_history(session_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversation_created
  ON conversation_history(created_at DESC);

-- Persona Signals Indexes
CREATE INDEX IF NOT EXISTS idx_signals_session
  ON persona_signals(session_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_signals_type
  ON persona_signals(signal_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_signals_confidence
  ON persona_signals(confidence_score DESC)
  WHERE confidence_score IS NOT NULL;

-- Knowledge Base Indexes
-- Vector similarity search index (IVFFlat for approximate nearest neighbor)
CREATE INDEX IF NOT EXISTS idx_kb_embedding
  ON knowledge_base
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Text search index for hybrid search
CREATE INDEX IF NOT EXISTS idx_kb_content_search
  ON knowledge_base
  USING gin(to_tsvector('english', content));

-- Persona and pain point tags indexes
CREATE INDEX IF NOT EXISTS idx_kb_persona_tags
  ON knowledge_base USING gin(persona_tags);

CREATE INDEX IF NOT EXISTS idx_kb_pain_point_tags
  ON knowledge_base USING gin(pain_point_tags);

CREATE INDEX IF NOT EXISTS idx_kb_created
  ON knowledge_base(created_at DESC);

-- Generated Brochures Indexes
CREATE INDEX IF NOT EXISTS idx_brochures_session
  ON generated_brochures(session_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_brochures_format
  ON generated_brochures(format);

-- Add index comments
COMMENT ON INDEX idx_kb_embedding IS 'Vector similarity search index for knowledge base embeddings';
COMMENT ON INDEX idx_kb_content_search IS 'Full-text search index for knowledge base content';
COMMENT ON INDEX idx_conversation_session IS 'Composite index for efficient conversation history retrieval by session';

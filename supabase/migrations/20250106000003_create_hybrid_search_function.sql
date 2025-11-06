-- Hybrid Search Function for Knowledge Base
-- Combines vector similarity search (60%) with text search (40%)

CREATE OR REPLACE FUNCTION hybrid_search(
  query_text TEXT,
  query_embedding vector(1536),
  filter_personas TEXT[] DEFAULT '{}',
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  persona_tags TEXT[],
  pain_point_tags TEXT[],
  source TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH vector_search AS (
    SELECT
      kb.id,
      kb.content,
      kb.metadata,
      kb.persona_tags,
      kb.pain_point_tags,
      kb.source,
      1 - (kb.embedding <=> query_embedding) AS vector_similarity
    FROM knowledge_base kb
    WHERE
      (filter_personas = '{}' OR kb.persona_tags && filter_personas)
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count * 2  -- Get more candidates for ranking
  ),
  text_search AS (
    SELECT
      kb.id,
      ts_rank(to_tsvector('english', kb.content), plainto_tsquery('english', query_text)) AS text_similarity
    FROM knowledge_base kb
    WHERE
      (filter_personas = '{}' OR kb.persona_tags && filter_personas)
      AND to_tsvector('english', kb.content) @@ plainto_tsquery('english', query_text)
  )
  SELECT
    vs.id,
    vs.content,
    vs.metadata,
    vs.persona_tags,
    vs.pain_point_tags,
    vs.source,
    -- Hybrid score: 60% vector + 40% text (normalized)
    (0.6 * vs.vector_similarity + 0.4 * COALESCE(ts.text_similarity / NULLIF((SELECT MAX(text_similarity) FROM text_search), 0), 0)) AS similarity
  FROM vector_search vs
  LEFT JOIN text_search ts ON vs.id = ts.id
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- Add function comment
COMMENT ON FUNCTION hybrid_search IS 'Performs hybrid search combining vector similarity (60%) and text search (40%) on knowledge base';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION hybrid_search TO authenticated;
GRANT EXECUTE ON FUNCTION hybrid_search TO anon;

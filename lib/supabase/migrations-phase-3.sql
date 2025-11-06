/**
 * BevGenie Phase 3: Dynamic Page Generation
 *
 * Adds support for storing and tracking generated pages
 * Tables: generated_pages, page_analytics
 */

-- Create generated_pages table
CREATE TABLE IF NOT EXISTS generated_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Core page information
  session_id UUID NOT NULL REFERENCES user_personas(session_id) ON DELETE CASCADE,
  page_type VARCHAR(50) NOT NULL, -- solution_brief, feature_showcase, case_study, comparison, implementation_roadmap, roi_calculator

  -- Page specification (JSON)
  page_spec JSONB NOT NULL, -- Full BevGeniePage specification

  -- Generation metadata
  intent VARCHAR(50) NOT NULL, -- The detected user intent
  intent_confidence FLOAT NOT NULL DEFAULT 0.0, -- 0-1 confidence score

  -- Context
  user_message TEXT, -- The user message that triggered generation
  conversation_length INTEGER DEFAULT 0, -- Number of messages at time of generation

  -- Persona at time of generation (snapshot)
  persona_snapshot JSONB, -- Persona scores for personalization tracking

  -- Quality metrics
  validation_passed BOOLEAN DEFAULT true,
  generation_time_ms INTEGER, -- How long it took to generate (milliseconds)

  -- Engagement
  was_viewed BOOLEAN DEFAULT false,
  viewed_at TIMESTAMP,

  -- CTA tracking
  cta_clicks INTEGER DEFAULT 0,
  last_cta_click TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE -- When page cache expires
);

-- Create page_analytics table for tracking engagement
CREATE TABLE IF NOT EXISTS page_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Reference to generated page
  page_id UUID NOT NULL REFERENCES generated_pages(id) ON DELETE CASCADE,

  -- Event type
  event_type VARCHAR(50) NOT NULL, -- 'viewed', 'cta_clicked', 'shared', 'downloaded'
  event_data JSONB, -- Event-specific data (e.g., which button clicked)

  -- User context
  session_id UUID,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX idx_generated_pages_session_id ON generated_pages(session_id);
CREATE INDEX idx_generated_pages_page_type ON generated_pages(page_type);
CREATE INDEX idx_generated_pages_intent ON generated_pages(intent);
CREATE INDEX idx_generated_pages_created_at ON generated_pages(created_at DESC);
CREATE INDEX idx_generated_pages_expires_at ON generated_pages(expires_at);

CREATE INDEX idx_page_analytics_page_id ON page_analytics(page_id);
CREATE INDEX idx_page_analytics_event_type ON page_analytics(event_type);
CREATE INDEX idx_page_analytics_session_id ON page_analytics(session_id);
CREATE INDEX idx_page_analytics_created_at ON page_analytics(created_at DESC);

-- Enable RLS on generated_pages
ALTER TABLE generated_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own generated pages
CREATE POLICY "Users can view their own generated pages"
  ON generated_pages FOR SELECT
  USING (
    session_id IN (
      SELECT session_id FROM user_personas
      WHERE session_id = auth.uid() OR auth.uid() IS NULL
    )
  );

-- RLS Policy: Users can only insert pages for their own session
CREATE POLICY "Users can insert pages for their own session"
  ON generated_pages FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT session_id FROM user_personas
      WHERE session_id = auth.uid() OR auth.uid() IS NULL
    )
  );

-- RLS Policy: Users can update their own page analytics
CREATE POLICY "Users can view their own page analytics"
  ON page_analytics FOR SELECT
  USING (
    page_id IN (
      SELECT id FROM generated_pages
      WHERE session_id = auth.uid() OR auth.uid() IS NULL
    )
  );

-- RLS Policy: Users can insert analytics for their pages
CREATE POLICY "Users can insert analytics for their pages"
  ON page_analytics FOR INSERT
  WITH CHECK (
    page_id IN (
      SELECT id FROM generated_pages
      WHERE session_id = auth.uid() OR auth.uid() IS NULL
    )
  );

-- Create function to clean up expired pages
CREATE OR REPLACE FUNCTION clean_expired_pages()
RETURNS void AS $$
BEGIN
  DELETE FROM generated_pages
  WHERE expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP;

  DELETE FROM page_analytics
  WHERE page_id IN (
    SELECT id FROM generated_pages
    WHERE expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to record page analytics event
CREATE OR REPLACE FUNCTION record_page_event(
  p_page_id UUID,
  p_event_type VARCHAR,
  p_event_data JSONB DEFAULT NULL,
  p_session_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_analytics_id UUID;
BEGIN
  -- Insert analytics event
  INSERT INTO page_analytics (page_id, event_type, event_data, session_id)
  VALUES (p_page_id, p_event_type, p_event_data, p_session_id)
  RETURNING id INTO v_analytics_id;

  -- Update page tracking based on event type
  IF p_event_type = 'viewed' THEN
    UPDATE generated_pages
    SET was_viewed = true, viewed_at = CURRENT_TIMESTAMP
    WHERE id = p_page_id AND was_viewed = false;
  ELSIF p_event_type = 'cta_clicked' THEN
    UPDATE generated_pages
    SET cta_clicks = cta_clicks + 1, last_cta_click = CURRENT_TIMESTAMP
    WHERE id = p_page_id;
  END IF;

  RETURN v_analytics_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get page generation statistics
CREATE OR REPLACE FUNCTION get_page_generation_stats(
  p_session_id UUID DEFAULT NULL,
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
  page_type VARCHAR,
  total_generated INTEGER,
  avg_generation_time_ms FLOAT,
  viewed_count INTEGER,
  view_rate FLOAT,
  total_cta_clicks INTEGER,
  avg_cta_clicks FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    gp.page_type,
    COUNT(gp.id)::INTEGER as total_generated,
    AVG(gp.generation_time_ms) as avg_generation_time_ms,
    COUNT(CASE WHEN gp.was_viewed THEN 1 END)::INTEGER as viewed_count,
    (COUNT(CASE WHEN gp.was_viewed THEN 1 END)::FLOAT / COUNT(gp.id)) as view_rate,
    SUM(gp.cta_clicks)::INTEGER as total_cta_clicks,
    AVG(gp.cta_clicks) as avg_cta_clicks
  FROM generated_pages gp
  WHERE (p_session_id IS NULL OR gp.session_id = p_session_id)
    AND gp.created_at >= CURRENT_TIMESTAMP - (p_days || ' days')::INTERVAL
  GROUP BY gp.page_type;
END;
$$ LANGUAGE plpgsql;

-- Create function to get intent statistics
CREATE OR REPLACE FUNCTION get_intent_statistics(
  p_session_id UUID DEFAULT NULL,
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
  intent VARCHAR,
  count INTEGER,
  avg_confidence FLOAT,
  pages_generated INTEGER,
  generation_rate FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    gp.intent,
    COUNT(*)::INTEGER as count,
    AVG(gp.intent_confidence) as avg_confidence,
    COUNT(CASE WHEN gp.page_spec IS NOT NULL THEN 1 END)::INTEGER as pages_generated,
    (COUNT(CASE WHEN gp.page_spec IS NOT NULL THEN 1 END)::FLOAT / COUNT(*)) as generation_rate
  FROM generated_pages gp
  WHERE (p_session_id IS NULL OR gp.session_id = p_session_id)
    AND gp.created_at >= CURRENT_TIMESTAMP - (p_days || ' days')::INTERVAL
  GROUP BY gp.intent
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_generated_pages_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generated_pages_updated_at_trigger
BEFORE UPDATE ON generated_pages
FOR EACH ROW
EXECUTE FUNCTION update_generated_pages_timestamp();

-- Add comment explaining the tables
COMMENT ON TABLE generated_pages IS 'Stores generated page specifications and metadata. Used for caching, analytics, and personalization.';
COMMENT ON TABLE page_analytics IS 'Tracks engagement metrics for generated pages (views, CTA clicks, shares, downloads).';
COMMENT ON COLUMN generated_pages.page_spec IS 'Full JSON specification of the generated page (BevGeniePage type).';
COMMENT ON COLUMN generated_pages.persona_snapshot IS 'Persona scores at time of generation for tracking how personalization worked.';
COMMENT ON COLUMN page_analytics.event_data IS 'Event-specific data as JSON (e.g. {\"button_text\": \"Schedule Demo\", \"button_index\": 0})';

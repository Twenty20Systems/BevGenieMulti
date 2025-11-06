-- Core BevGenie Tables Migration
-- Creates tables for user personas, conversations, signals, and knowledge base

-- 1. User Personas Table
CREATE TABLE IF NOT EXISTS user_personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL,
  persona_type TEXT,
  pain_points_detected TEXT[] DEFAULT '{}',
  sales_focus_score FLOAT DEFAULT 0,
  marketing_focus_score FLOAT DEFAULT 0,
  compliance_focus_score FLOAT DEFAULT 0,
  operations_focus_score FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_session_persona UNIQUE (session_id)
);

-- 2. Conversation History Table
CREATE TABLE IF NOT EXISTS conversation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL,
  user_message TEXT NOT NULL,
  assistant_message TEXT,
  page_generated JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Persona Signals Table
CREATE TABLE IF NOT EXISTS persona_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL,
  signal_type TEXT NOT NULL,
  signal_text TEXT,
  confidence_score FLOAT,
  evidence TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Knowledge Base Table
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  persona_tags TEXT[],
  pain_point_tags TEXT[],
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Generated Brochures Table (for PPT/PDF generation)
CREATE TABLE IF NOT EXISTS generated_brochures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  format TEXT CHECK (format IN ('pdf', 'pptx')),
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE user_personas IS 'Stores user persona data including focus scores and pain points';
COMMENT ON TABLE conversation_history IS 'Stores conversation history between user and AI';
COMMENT ON TABLE persona_signals IS 'Stores detected persona signals from user interactions';
COMMENT ON TABLE knowledge_base IS 'Stores knowledge base documents with vector embeddings for semantic search';
COMMENT ON TABLE generated_brochures IS 'Stores generated PDF/PPTX brochures';

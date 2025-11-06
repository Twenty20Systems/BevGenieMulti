-- Add user_id columns to link sessions with authenticated users
-- This migration allows tracking user activity across sessions

-- Add user_id to user_personas
ALTER TABLE user_personas
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_personas_user_id ON user_personas(user_id);

-- Add user_id to conversation_history
ALTER TABLE conversation_history
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_conversation_user_id ON conversation_history(user_id);

-- Add user_id to generated_brochures
ALTER TABLE generated_brochures
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_brochures_user_id ON generated_brochures(user_id);

-- Add user_id to persona_signals
ALTER TABLE persona_signals
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_signals_user_id ON persona_signals(user_id);

-- Add comments
COMMENT ON COLUMN user_personas.user_id IS 'Links persona data to authenticated user (optional, for logged-in users)';
COMMENT ON COLUMN conversation_history.user_id IS 'Links conversation to authenticated user (optional, for logged-in users)';
COMMENT ON COLUMN generated_brochures.user_id IS 'Links brochure to authenticated user (optional, for logged-in users)';
COMMENT ON COLUMN persona_signals.user_id IS 'Links signal to authenticated user (optional, for logged-in users)';

-- Note: user_id is nullable to support both anonymous (session-only) and authenticated users
-- Anonymous users: Only session_id is set
-- Authenticated users: Both user_id and session_id are set

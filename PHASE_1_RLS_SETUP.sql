-- ============================================================================
-- PHASE 1.1: RLS POLICY SETUP FOR BEVGENIE
-- ============================================================================
--
-- This script creates Row-Level Security (RLS) policies for BevGenie
-- Database: tliopsxaceedcyzjcwak (Supabase project)
-- Created: 2025-10-29
-- Purpose: Limit BevGenie app access to only published content & analytics
--
-- SECURITY GOAL:
-- If BevGenie is compromised, attacker can only:
-- ✅ READ: Published knowledge documents
-- ✅ READ: Active prompt templates
-- ✅ WRITE: Analytics (usage tracking)
-- ❌ CANNOT: Delete any data
-- ❌ CANNOT: Modify any data
-- ❌ CANNOT: Access unpublished content
-- ============================================================================

-- Step 1: Create Database Roles
-- ============================================================================

-- Create bevgenie_role for the customer-facing BevGenie application
CREATE ROLE bevgenie_role NOLOGIN;

-- Create admin_role for future ManagementSystem access
CREATE ROLE admin_role NOLOGIN;

-- Grant basic permissions to both roles
GRANT USAGE ON SCHEMA public TO bevgenie_role, admin_role;

-- ============================================================================
-- Step 2: Enable RLS on All Relevant Tables
-- ============================================================================

-- Enable RLS on content tables
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;

-- Enable RLS on session/analytics tables
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE persona_signals ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Step 3: Create RLS Policies for BevGenie Role (RESTRICTED ACCESS)
-- ============================================================================

-- Policy 1: BevGenie can READ published knowledge_documents only
CREATE POLICY "bevgenie_read_knowledge_documents" ON knowledge_documents
  FOR SELECT
  TO bevgenie_role
  USING (is_published = true);

-- Policy 2: BevGenie can READ active prompt_templates only
CREATE POLICY "bevgenie_read_prompt_templates" ON prompt_templates
  FOR SELECT
  TO bevgenie_role
  USING (is_active = true);

-- Policy 3: BevGenie can WRITE to knowledge_usage_analytics (for tracking)
CREATE POLICY "bevgenie_write_analytics" ON knowledge_usage_analytics
  FOR INSERT
  TO bevgenie_role
  WITH CHECK (true);

-- Policy 4: BevGenie can READ user_sessions
CREATE POLICY "bevgenie_read_own_sessions" ON user_sessions
  FOR SELECT
  TO bevgenie_role
  USING (true);

-- Policy 5: BevGenie can WRITE user_sessions (new sessions)
CREATE POLICY "bevgenie_write_own_sessions" ON user_sessions
  FOR INSERT
  TO bevgenie_role
  WITH CHECK (true);

-- Policy 6: BevGenie can WRITE conversation_messages
CREATE POLICY "bevgenie_write_messages" ON conversation_messages
  FOR INSERT
  TO bevgenie_role
  WITH CHECK (true);

-- Policy 7: BevGenie can READ conversation_messages
CREATE POLICY "bevgenie_read_messages" ON conversation_messages
  FOR SELECT
  TO bevgenie_role
  USING (true);

-- Policy 8: BevGenie can WRITE user_personas
CREATE POLICY "bevgenie_write_personas" ON user_personas
  FOR INSERT
  TO bevgenie_role
  WITH CHECK (true);

-- Policy 9: BevGenie can WRITE persona_signals
CREATE POLICY "bevgenie_write_signals" ON persona_signals
  FOR INSERT
  TO bevgenie_role
  WITH CHECK (true);

-- Policy 10: BLOCK BevGenie from DELETE on knowledge_documents
CREATE POLICY "bevgenie_no_delete_docs" ON knowledge_documents
  FOR DELETE
  TO bevgenie_role
  USING (false);

-- Policy 11: BLOCK BevGenie from UPDATE on knowledge_documents
CREATE POLICY "bevgenie_no_update_docs" ON knowledge_documents
  FOR UPDATE
  TO bevgenie_role
  USING (false);

-- Policy 12: BLOCK BevGenie from DELETE on prompt_templates
CREATE POLICY "bevgenie_no_delete_prompts" ON prompt_templates
  FOR DELETE
  TO bevgenie_role
  USING (false);

-- Policy 13: BLOCK BevGenie from UPDATE on prompt_templates
CREATE POLICY "bevgenie_no_update_prompts" ON prompt_templates
  FOR UPDATE
  TO bevgenie_role
  USING (false);

-- ============================================================================
-- Step 4: Create RLS Policies for Admin Role (FULL ACCESS)
-- ============================================================================

-- Admin gets full read/write/delete access to knowledge_documents
CREATE POLICY "admin_full_access_docs" ON knowledge_documents
  FOR ALL
  TO admin_role
  USING (true);

-- Admin gets full read/write/delete access to prompt_templates
CREATE POLICY "admin_full_access_prompts" ON prompt_templates
  FOR ALL
  TO admin_role
  USING (true);

-- Admin gets full read/write/delete access to user_sessions
CREATE POLICY "admin_full_access_sessions" ON user_sessions
  FOR ALL
  TO admin_role
  USING (true);

-- Admin gets full read/write/delete access to conversation_messages
CREATE POLICY "admin_full_access_messages" ON conversation_messages
  FOR ALL
  TO admin_role
  USING (true);

-- Admin gets full read/write/delete access to analytics
CREATE POLICY "admin_full_access_analytics" ON knowledge_usage_analytics
  FOR ALL
  TO admin_role
  USING (true);

-- Admin gets full read/write/delete access to personas
CREATE POLICY "admin_full_access_personas" ON user_personas
  FOR ALL
  TO admin_role
  USING (true);

-- Admin gets full read/write/delete access to signals
CREATE POLICY "admin_full_access_signals" ON persona_signals
  FOR ALL
  TO admin_role
  USING (true);

-- ============================================================================
-- Step 5: Grant Permissions to Roles
-- ============================================================================

-- Grant SELECT permission to bevgenie_role on content tables
GRANT SELECT ON knowledge_documents TO bevgenie_role;
GRANT SELECT ON prompt_templates TO bevgenie_role;

-- Grant INSERT permission to bevgenie_role on analytics/session tables
GRANT INSERT ON knowledge_usage_analytics TO bevgenie_role;
GRANT INSERT, SELECT ON user_sessions TO bevgenie_role;
GRANT INSERT, SELECT ON conversation_messages TO bevgenie_role;
GRANT INSERT, SELECT ON user_personas TO bevgenie_role;
GRANT INSERT, SELECT ON persona_signals TO bevgenie_role;

-- Grant ALL permissions to admin_role on all tables
GRANT ALL ON knowledge_documents TO admin_role;
GRANT ALL ON prompt_templates TO admin_role;
GRANT ALL ON user_sessions TO admin_role;
GRANT ALL ON conversation_messages TO admin_role;
GRANT ALL ON knowledge_usage_analytics TO admin_role;
GRANT ALL ON user_personas TO admin_role;
GRANT ALL ON persona_signals TO admin_role;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
--
-- After running this script, verify the setup with these queries:
--
-- 1. Check roles exist:
--    SELECT * FROM pg_roles WHERE rolname IN ('bevgenie_role', 'admin_role');
--
-- 2. Check RLS is enabled:
--    SELECT tablename, rowsecurity FROM pg_tables
--    WHERE schemaname='public' AND tablename IN (
--      'knowledge_documents', 'prompt_templates', 'user_sessions',
--      'conversation_messages', 'knowledge_usage_analytics',
--      'user_personas', 'persona_signals'
--    );
--
-- 3. Check policies exist:
--    SELECT schemaname, tablename, policyname, cmd
--    FROM pg_policies WHERE tablename IN (
--      'knowledge_documents', 'prompt_templates', 'user_sessions',
--      'conversation_messages', 'knowledge_usage_analytics',
--      'user_personas', 'persona_signals'
--    );
--
-- ============================================================================
-- TESTING THE POLICIES
-- ============================================================================
--
-- To test that policies work correctly:
--
-- 1. Create a service key associated with bevgenie_role
-- 2. Create a service key associated with admin_role
-- 3. With bevgenie_role key:
--    - Try: SELECT * FROM knowledge_documents;  ← Should return published only
--    - Try: SELECT * FROM prompt_templates;     ← Should return active only
--    - Try: INSERT INTO knowledge_usage_analytics (...); ← Should work
--    - Try: DELETE FROM knowledge_documents; ← Should be blocked (0 rows)
-- 4. With admin_role key:
--    - Try: SELECT * FROM knowledge_documents;  ← Should return ALL
--    - Try: DELETE FROM knowledge_documents; ← Should work
--
-- ============================================================================

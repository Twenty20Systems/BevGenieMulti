import { supabase, supabaseAdmin } from './client';
import type { Database } from './client';

export type UserPersona = Database['public']['Tables']['user_personas']['Row'];
export type ConversationMessage = Database['public']['Tables']['conversation_history']['Row'];
export type KnowledgeBaseDoc = Database['public']['Tables']['knowledge_base']['Row'];
export type PersonaSignal = Database['public']['Tables']['persona_signals']['Row'];
export type GeneratedBrochure = Database['public']['Tables']['generated_brochures']['Row'];

/**
 * Get or create user persona for a session
 */
export async function getUserPersona(sessionId: string): Promise<UserPersona | null> {
  const { data, error } = await supabase
    .from('user_personas')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user persona:', error);
    return null;
  }

  return data || null;
}

/**
 * Create a new user persona record
 */
export async function createUserPersona(
  sessionId: string,
  userId?: string
): Promise<UserPersona | null> {
  const { data, error } = await supabase
    .from('user_personas')
    .insert({
      session_id: sessionId,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user persona:', error);
    return null;
  }

  return data;
}

/**
 * Update user persona scores and metadata
 */
export async function updateUserPersona(
  sessionId: string,
  updates: Database['public']['Tables']['user_personas']['Update']
): Promise<UserPersona | null> {
  const { data, error } = await supabase
    .from('user_personas')
    .update({
      ...updates,
      last_updated: new Date().toISOString(),
    })
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user persona:', error);
    return null;
  }

  return data;
}

/**
 * Add a message to conversation history
 */
export async function addConversationMessage(
  sessionId: string,
  message: Database['public']['Tables']['conversation_history']['Insert']
): Promise<ConversationMessage | null> {
  const { data, error } = await supabase
    .from('conversation_history')
    .insert({
      session_id: sessionId,
      ...message,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding conversation message:', error);
    return null;
  }

  return data;
}

/**
 * Get conversation history for a session
 */
export async function getConversationHistory(sessionId: string): Promise<ConversationMessage[]> {
  const { data, error } = await supabase
    .from('conversation_history')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching conversation history:', error);
    return [];
  }

  return data || [];
}

/**
 * Search knowledge base with hybrid search (vector + text)
 * Note: Requires admin client to execute functions
 */
export async function hybridSearchKnowledgeBase(
  queryText: string,
  embedding: number[],
  personaTags?: string[],
  matchCount: number = 10
): Promise<any[]> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { data, error } = await supabaseAdmin.rpc('hybrid_search', {
    query_text: queryText,
    query_embedding: embedding,
    filter_personas: personaTags || [],
    match_count: matchCount,
  });

  if (error) {
    console.error('Error searching knowledge base:', error);
    return [];
  }

  return data || [];
}

/**
 * Search knowledge base with vector similarity only
 */
export async function vectorSearchKnowledgeBase(
  embedding: number[],
  personaTags?: string[],
  matchThreshold: number = 0.5,
  matchCount: number = 5
): Promise<any[]> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { data, error } = await supabaseAdmin.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
    filter_personas: personaTags || [],
  });

  if (error) {
    console.error('Error in vector search:', error);
    return [];
  }

  return data || [];
}

/**
 * Add a persona signal (for audit trail)
 */
export async function addPersonaSignal(
  sessionId: string,
  signal: Database['public']['Tables']['persona_signals']['Insert']
): Promise<PersonaSignal | null> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { data, error } = await supabaseAdmin
    .from('persona_signals')
    .insert({
      session_id: sessionId,
      ...signal,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding persona signal:', error);
    return null;
  }

  return data;
}

/**
 * Store a generated brochure
 */
export async function saveBrochure(
  sessionId: string,
  brochure: Database['public']['Tables']['generated_brochures']['Insert']
): Promise<GeneratedBrochure | null> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { data, error } = await supabaseAdmin
    .from('generated_brochures')
    .insert({
      session_id: sessionId,
      ...brochure,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving brochure:', error);
    return null;
  }

  return data;
}

/**
 * Get the most recent brochure for a session
 */
export async function getLatestBrochure(sessionId: string): Promise<GeneratedBrochure | null> {
  const { data, error } = await supabase
    .from('generated_brochures')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching brochure:', error);
    return null;
  }

  return data || null;
}

/**
 * Add knowledge base documents (admin only)
 */
export async function addKnowledgeBaseDocs(
  docs: Database['public']['Tables']['knowledge_base']['Insert'][]
): Promise<KnowledgeBaseDoc[] | null> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  const { data, error } = await supabaseAdmin
    .from('knowledge_base')
    .insert(docs)
    .select();

  if (error) {
    console.error('Error adding knowledge base documents:', error);
    return null;
  }

  return data;
}

/**
 * Delete a session's data (GDPR compliance)
 */
export async function deleteSessionData(sessionId: string): Promise<boolean> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured');
  }

  try {
    // Delete in order of foreign key dependencies
    await supabaseAdmin.from('generated_brochures').delete().eq('session_id', sessionId);
    await supabaseAdmin.from('persona_signals').delete().eq('session_id', sessionId);
    await supabaseAdmin.from('conversation_history').delete().eq('session_id', sessionId);
    await supabaseAdmin.from('user_personas').delete().eq('session_id', sessionId);

    return true;
  } catch (error) {
    console.error('Error deleting session data:', error);
    return false;
  }
}

/**
 * Get all sessions older than X days (for cleanup)
 */
export async function getOldSessions(daysOld: number = 30): Promise<UserPersona[]> {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('user_personas')
    .select('*')
    .lt('created_at', cutoffDate)
    .is('user_id', null); // Only anonymous sessions

  if (error) {
    console.error('Error fetching old sessions:', error);
    return [];
  }

  return data || [];
}

/**
 * Data Access Layer Wrapper for Queries
 *
 * This module bridges the old query functions with the new repository pattern.
 * It provides a migration path from direct Supabase calls to the centralized DAL.
 *
 * Old imports from 'lib/supabase/queries' are gradually migrated to use this wrapper.
 * This ensures backward compatibility while allowing for incremental refactoring.
 */

import { supabase, supabaseAdmin } from './client';
import { RepositoryFactory } from '@/lib/repositories/repository-factory';

// Initialize the DAL with the appropriate client
// Using admin client since queries module previously used supabaseAdmin
const dal = RepositoryFactory.create(supabaseAdmin || supabase);

/**
 * Wrapper function for getting user persona
 * Delegates to DataRepository
 */
export async function getUserPersona(sessionId: string) {
  try {
    return await dal.data.getUserPersona(sessionId);
  } catch (error) {
    console.error('Error fetching user persona:', error);
    return null;
  }
}

/**
 * Wrapper function for creating user persona
 * Delegates to DataRepository
 */
export async function createUserPersona(sessionId: string, userId?: string) {
  try {
    return await dal.data.createUserPersona({
      session_id: sessionId,
      user_id: userId,
    });
  } catch (error) {
    console.error('Error creating user persona:', error);
    return null;
  }
}

/**
 * Wrapper function for updating user persona
 * Delegates to DataRepository
 */
export async function updateUserPersona(sessionId: string, updates: any) {
  try {
    return await dal.data.updateUserPersona(sessionId, updates);
  } catch (error) {
    console.error('Error updating user persona:', error);
    return null;
  }
}

/**
 * Wrapper function for adding conversation message
 * Delegates to DataRepository
 */
export async function addConversationMessage(sessionId: string, message: any) {
  try {
    return await dal.data.addConversationMessage({
      session_id: sessionId,
      ...message,
    });
  } catch (error) {
    console.error('Error adding conversation message:', error);
    return null;
  }
}

/**
 * Wrapper function for getting conversation history
 * Delegates to DataRepository
 */
export async function getConversationHistory(sessionId: string) {
  try {
    return await dal.data.getConversationHistory(sessionId);
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return [];
  }
}

/**
 * Wrapper function for hybrid search knowledge base
 * Delegates to KnowledgeRepository
 */
export async function hybridSearchKnowledgeBase(
  queryText: string,
  embedding: number[],
  personaTags?: string[],
  matchCount: number = 10
) {
  try {
    const results = await dal.knowledge.hybridSearchKnowledgeBase(
      queryText,
      embedding,
      {
        personaTags,
        limit: matchCount,
      }
    );
    return results || [];
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    return [];
  }
}

/**
 * Wrapper function for vector search knowledge base
 * Delegates to KnowledgeRepository
 */
export async function vectorSearchKnowledgeBase(
  embedding: number[],
  personaTags?: string[],
  matchThreshold: number = 0.5,
  matchCount: number = 5
) {
  try {
    const results = await dal.knowledge.vectorSearchKnowledgeBase(
      embedding,
      {
        personaTags,
        similarity_threshold: matchThreshold,
        limit: matchCount,
      }
    );
    return results || [];
  } catch (error) {
    console.error('Error in vector search:', error);
    return [];
  }
}

/**
 * Wrapper function for recording persona signal
 * Delegates to DataRepository
 */
export async function addPersonaSignal(sessionId: string, signal: any) {
  try {
    return await dal.data.recordPersonaSignal({
      session_id: sessionId,
      ...signal,
    });
  } catch (error) {
    console.error('Error adding persona signal:', error);
    return null;
  }
}

/**
 * Wrapper function for saving brochure
 * Delegates to PageRepository
 */
export async function saveBrochure(sessionId: string, brochure: any) {
  try {
    return await dal.page.saveBrochure({
      session_id: sessionId,
      brochure_content: brochure.brochure_content || brochure,
      persona_context: brochure.persona_context || {},
    });
  } catch (error) {
    console.error('Error saving brochure:', error);
    return null;
  }
}

/**
 * Wrapper function for getting latest brochure
 * Delegates to PageRepository
 */
export async function getLatestBrochure(sessionId: string) {
  try {
    return await dal.page.getLatestBrochure(sessionId);
  } catch (error) {
    console.error('Error fetching brochure:', error);
    return null;
  }
}

/**
 * Wrapper function for adding knowledge base documents
 * Delegates to KnowledgeRepository
 */
export async function addKnowledgeBaseDocs(docs: any[]) {
  try {
    await dal.knowledge.addKnowledgeDocuments(docs);
    return docs;
  } catch (error) {
    console.error('Error adding knowledge base documents:', error);
    return null;
  }
}

/**
 * Wrapper function for deleting session data
 * Delegates to DataRepository
 */
export async function deleteSessionData(sessionId: string) {
  try {
    await dal.data.deleteSessionData(sessionId);
    return true;
  } catch (error) {
    console.error('Error deleting session data:', error);
    return false;
  }
}

/**
 * Wrapper function for getting old sessions
 * Delegates to DataRepository
 */
export async function getOldSessions(daysOld: number = 30) {
  try {
    return await dal.data.getOldSessions(daysOld);
  } catch (error) {
    console.error('Error fetching old sessions:', error);
    return [];
  }
}

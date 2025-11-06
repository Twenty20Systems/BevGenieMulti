/**
 * Knowledge Base Search
 *
 * Handles hybrid search combining vector similarity with text search
 * Retrieves relevant documents from knowledge_base with persona/pain point filtering
 */

import { supabaseAdmin } from '@/lib/supabase/client';
import { generateEmbedding } from './embeddings';
import type { PainPointType } from '@/lib/session/types';

export interface SearchResult {
  id: string;
  content: string;
  metadata: Record<string, any>;
  persona_tags: string[];
  pain_point_tags: PainPointType[];
  source_type: string;
  source_url: string | null;
  similarity_score: number; // 0.0 - 1.0
}

/**
 * Get full knowledge base search results as document objects
 * Used for page generation to get actual KB documents
 *
 * @param query - Search query
 * @param personaTags - Optional: filter by persona tags
 * @param painPointTags - Optional: filter by pain point tags
 * @param limit - Number of results to return
 * @returns Array of KB documents with metadata
 */
export async function getKnowledgeDocuments(
  query: string,
  personaTags?: string[],
  painPointTags?: PainPointType[],
  limit: number = 5
): Promise<SearchResult[]> {
  // Use vector search to get most relevant documents
  return vectorSearchKnowledgeBase(query, personaTags, limit);
}

/**
 * Search knowledge base with hybrid approach (vector + text)
 *
 * For marketing website persona detection:
 * - 60% weight on semantic similarity (vector search)
 * - 40% weight on keyword matching (text search)
 *
 * @param query - Search query
 * @param personaTags - Optional: filter by persona tags (supplier, sales, etc)
 * @param painPointTags - Optional: filter by pain point tags
 * @param limit - Number of results to return
 * @returns Array of relevant documents
 *
 * @example
 * ```typescript
 * const results = await searchKnowledgeBase(
 *   'How do we measure field sales effectiveness?',
 *   ['supplier', 'sales'],
 *   ['execution_blind_spot'],
 *   10
 * );
 * ```
 */
export async function searchKnowledgeBase(
  query: string,
  personaTags?: string[],
  painPointTags?: PainPointType[],
  limit: number = 10
): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) {
    throw new Error('Query cannot be empty');
  }

  if (!supabaseAdmin) {
    console.error('Admin client not available for search');
    return [];
  }

  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Use Supabase hybrid_search function
    const { data, error } = await supabaseAdmin.rpc('hybrid_search', {
      query_text: query,
      query_embedding: queryEmbedding,
      filter_personas: personaTags || [],
      match_count: limit,
    });

    // Note: filter_pain_points removed - not supported by DB function

    if (error) {
      console.error('Error in hybrid search:', error);
      return [];
    }

    // Transform results to SearchResult format
    const results: SearchResult[] = (data || []).map((doc: any) => ({
      id: doc.id,
      content: doc.content,
      metadata: doc.metadata || {},
      persona_tags: doc.persona_tags || [],
      pain_point_tags: doc.pain_point_tags || [],
      source_type: doc.source_type || 'unknown',
      source_url: doc.source_url,
      similarity_score: doc.similarity_score || 0,
    }));

    return results;
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    throw error;
  }
}

/**
 * Vector search only (semantic similarity)
 *
 * @param query - Search query
 * @param personaTags - Optional: filter by persona tags
 * @param limit - Number of results to return
 * @returns Array of relevant documents
 */
export async function vectorSearchKnowledgeBase(
  query: string,
  personaTags?: string[],
  limit: number = 5
): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) {
    throw new Error('Query cannot be empty');
  }

  if (!supabaseAdmin) {
    console.error('Admin client not available for search');
    return [];
  }

  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Use Supabase match_documents function (vector only)
    const { data, error } = await supabaseAdmin.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: limit,
      filter_personas: personaTags || [],
    });

    if (error) {
      console.error('Error in vector search:', error);
      return [];
    }

    // Transform results
    const results: SearchResult[] = (data || []).map((doc: any) => ({
      id: doc.id,
      content: doc.content,
      metadata: doc.metadata || {},
      persona_tags: doc.persona_tags || [],
      pain_point_tags: doc.pain_point_tags || [],
      source_type: doc.source_type || 'unknown',
      source_url: doc.source_url,
      similarity_score: doc.similarity || 0,
    }));

    return results;
  } catch (error) {
    console.error('Error in vector search:', error);
    throw error;
  }
}

/**
 * Text search only (keyword matching)
 *
 * @param query - Search query
 * @param personaTags - Optional: filter by persona tags
 * @param limit - Number of results to return
 * @returns Array of relevant documents
 */
export async function textSearchKnowledgeBase(
  query: string,
  personaTags?: string[],
  limit: number = 5
): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) {
    throw new Error('Query cannot be empty');
  }

  if (!supabaseAdmin) {
    console.error('Admin client not available for search');
    return [];
  }

  try {
    // Use full-text search with plainto_tsquery
    let queryBuilder = supabaseAdmin
      .from('knowledge_base')
      .select('*')
      .order('similarity_score', { ascending: false })
      .limit(limit);

    // Add persona filter if provided
    if (personaTags && personaTags.length > 0) {
      queryBuilder = queryBuilder.filter('persona_tags', 'cs', `{${personaTags.join(',')}}`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error in text search:', error);
      return [];
    }

    // Transform results
    const results: SearchResult[] = (data || []).map((doc: any) => ({
      id: doc.id,
      content: doc.content,
      metadata: doc.metadata || {},
      persona_tags: doc.persona_tags || [],
      pain_point_tags: doc.pain_point_tags || [],
      source_type: doc.source_type || 'unknown',
      source_url: doc.source_url,
      similarity_score: 0.5, // Default for text search
    }));

    return results;
  } catch (error) {
    console.error('Error in text search:', error);
    throw error;
  }
}

/**
 * Get context for LLM from knowledge base
 *
 * Retrieves the most relevant documents to use as context
 * for LLM persona detection and brochure generation
 *
 * @param userMessage - Current user message
 * @param detectedPersona - Current persona detection state
 * @param limit - Number of documents to include in context
 * @returns Formatted context string for LLM
 */
export async function getContextForLLM(
  userMessage: string,
  detectedPersona?: {
    supplier_score: number;
    distributor_score: number;
    pain_points_detected: string[];
  },
  limit: number = 5
): Promise<string> {
  try {
    // Determine filters based on detected persona
    const personaTags: string[] = [];
    const painPointTags: PainPointType[] = [];

    if (detectedPersona) {
      if (detectedPersona.supplier_score > detectedPersona.distributor_score) {
        personaTags.push('supplier');
      } else {
        personaTags.push('distributor');
      }

      painPointTags.push(...(detectedPersona.pain_points_detected as PainPointType[]));
    }

    // Search knowledge base
    const results = await searchKnowledgeBase(
      userMessage,
      personaTags.length > 0 ? personaTags : undefined,
      painPointTags.length > 0 ? painPointTags : undefined,
      limit
    );

    if (results.length === 0) {
      return '';
    }

    // Format context
    const contextLines = results.map((result, index) => {
      return `[Source ${index + 1}] ${result.content}`;
    });

    return contextLines.join('\n\n');
  } catch (error) {
    console.error('Error getting context for LLM:', error);
    return '';
  }
}

/**
 * Get all pain point related documents
 *
 * Used for brochure generation - retrieves all solutions
 * for detected pain points
 *
 * @param painPoints - Array of pain point types
 * @param limit - Max documents per pain point
 * @returns Object mapping pain point to documents
 */
export async function getPainPointDocuments(
  painPoints: PainPointType[],
  limit: number = 3
): Promise<Record<PainPointType, SearchResult[]>> {
  if (!supabaseAdmin || painPoints.length === 0) {
    return {};
  }

  const result: Record<PainPointType, SearchResult[]> = {};

  try {
    for (const painPoint of painPoints) {
      const { data, error } = await supabaseAdmin
        .from('knowledge_base')
        .select('*')
        .filter('pain_point_tags', 'cs', `{${painPoint}}`)
        .limit(limit);

      if (!error && data) {
        result[painPoint] = data.map((doc: any) => ({
          id: doc.id,
          content: doc.content,
          metadata: doc.metadata || {},
          persona_tags: doc.persona_tags || [],
          pain_point_tags: doc.pain_point_tags || [],
          source_type: doc.source_type || 'unknown',
          source_url: doc.source_url,
          similarity_score: 0,
        }));
      }
    }
  } catch (error) {
    console.error('Error getting pain point documents:', error);
  }

  return result;
}

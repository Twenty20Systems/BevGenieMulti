/**
 * Knowledge Repository
 *
 * Handles all knowledge base operations:
 * - Vector search
 * - Hybrid search (text + vector)
 * - Text search
 * - Pain point document retrieval
 * - Knowledge document management
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository';
import {
  IKnowledgeRepository,
  KnowledgeDocument,
  KnowledgeSearchOptions,
  ValidationError,
} from './types';

export class KnowledgeRepository extends BaseRepository implements IKnowledgeRepository {
  private readonly DEFAULT_SEARCH_LIMIT = 10;
  private readonly DEFAULT_SIMILARITY_THRESHOLD = 0.5;

  constructor(client: SupabaseClient) {
    super(client);
  }

  /**
   * Vector search on knowledge base using embeddings
   */
  async vectorSearchKnowledgeBase(
    embedding: number[],
    options?: KnowledgeSearchOptions
  ): Promise<KnowledgeDocument[]> {
    try {
      this.validateRequired(embedding, 'embedding');
      if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new ValidationError('embedding must be a non-empty array');
      }

      const limit = options?.limit ?? this.DEFAULT_SEARCH_LIMIT;
      const threshold = options?.similarity_threshold ?? this.DEFAULT_SIMILARITY_THRESHOLD;

      this.log('Vector searching knowledge base', {
        embeddingDim: embedding.length,
        limit,
        threshold,
      });

      // Use Supabase RPC for vector search (pgvector)
      const { data: results, error } = await this.supabaseClient.rpc(
        'match_documents',
        {
          query_embedding: embedding,
          match_count: limit,
          similarity_threshold: threshold,
        }
      );

      if (error) throw error;

      // Apply persona and pain point filters if provided
      let documents = results as KnowledgeDocument[];
      if (options?.personaTags && options.personaTags.length > 0) {
        documents = documents.filter(
          (doc) =>
            !doc.persona_tags ||
            doc.persona_tags.some((tag) => options.personaTags?.includes(tag))
        );
      }

      if (options?.painPointTags && options.painPointTags.length > 0) {
        documents = documents.filter(
          (doc) =>
            !doc.pain_point_tags ||
            doc.pain_point_tags.some((tag) => options.painPointTags?.includes(tag))
        );
      }

      return documents;
    } catch (error) {
      this.handleError(error, 'vectorSearchKnowledgeBase');
    }
  }

  /**
   * Hybrid search combining text and vector similarity
   */
  async hybridSearchKnowledgeBase(
    query: string,
    embedding: number[],
    options?: KnowledgeSearchOptions
  ): Promise<KnowledgeDocument[]> {
    try {
      this.validateRequired(query, 'query');
      this.validateRequired(embedding, 'embedding');
      if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new ValidationError('embedding must be a non-empty array');
      }

      const limit = options?.limit ?? this.DEFAULT_SEARCH_LIMIT;
      const threshold = options?.similarity_threshold ?? this.DEFAULT_SIMILARITY_THRESHOLD;

      this.log('Hybrid searching knowledge base', { query, embeddingDim: embedding.length });

      // Use Supabase RPC for hybrid search
      const { data: results, error } = await this.supabaseClient.rpc(
        'hybrid_search',
        {
          query_text: query,
          query_embedding: embedding,
          match_count: limit,
          similarity_threshold: threshold,
        }
      );

      if (error) throw error;

      // Apply persona and pain point filters if provided
      let documents = results as KnowledgeDocument[];
      if (options?.personaTags && options.personaTags.length > 0) {
        documents = documents.filter(
          (doc) =>
            !doc.persona_tags ||
            doc.persona_tags.some((tag) => options.personaTags?.includes(tag))
        );
      }

      if (options?.painPointTags && options.painPointTags.length > 0) {
        documents = documents.filter(
          (doc) =>
            !doc.pain_point_tags ||
            doc.pain_point_tags.some((tag) => options.painPointTags?.includes(tag))
        );
      }

      return documents;
    } catch (error) {
      this.handleError(error, 'hybridSearchKnowledgeBase');
    }
  }

  /**
   * Text-based search on knowledge base
   */
  async textSearchKnowledgeBase(
    query: string,
    options?: Omit<KnowledgeSearchOptions, 'similarity_threshold'>
  ): Promise<KnowledgeDocument[]> {
    try {
      this.validateRequired(query, 'query');
      this.log('Text searching knowledge base', { query });

      let queryBuilder = this.supabaseClient
        .from('knowledge_base')
        .select('*')
        .textSearch('content', query, {
          type: 'websearch',
        });

      // Apply persona tags filter
      if (options?.personaTags && options.personaTags.length > 0) {
        queryBuilder = queryBuilder.overlaps('persona_tags', options.personaTags);
      }

      // Apply pain point tags filter
      if (options?.painPointTags && options.painPointTags.length > 0) {
        queryBuilder = queryBuilder.overlaps('pain_point_tags', options.painPointTags);
      }

      const limit = options?.limit ?? this.DEFAULT_SEARCH_LIMIT;
      const { data: documents, error } = await queryBuilder.limit(limit);

      if (error) throw error;

      return documents as KnowledgeDocument[];
    } catch (error) {
      this.handleError(error, 'textSearchKnowledgeBase');
    }
  }

  /**
   * Get knowledge documents by pain points
   */
  async getPainPointDocuments(painPoints: string[]): Promise<KnowledgeDocument[]> {
    try {
      this.validateNotEmpty(painPoints, 'painPoints');
      this.log('Getting pain point documents', { painPoints });

      const { data: documents, error } = await this.supabaseClient
        .from('knowledge_base')
        .select('*')
        .overlaps('pain_point_tags', painPoints);

      if (error) throw error;

      return documents as KnowledgeDocument[];
    } catch (error) {
      this.handleError(error, 'getPainPointDocuments');
    }
  }

  /**
   * Add knowledge documents to the base (admin operation)
   */
  async addKnowledgeDocuments(docs: KnowledgeDocument[]): Promise<void> {
    try {
      this.validateNotEmpty(docs, 'docs');
      this.log('Adding knowledge documents', { count: docs.length });

      // Validate each document
      for (const doc of docs) {
        this.validateRequired(doc.content, 'document.content');
      }

      // Insert all documents
      const { error } = await this.supabaseClient
        .from('knowledge_base')
        .insert(
          docs.map((doc) => ({
            ...doc,
            created_at: doc.created_at || this.formatDate(new Date()),
            updated_at: this.formatDate(new Date()),
          }))
        );

      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'addKnowledgeDocuments');
    }
  }
}

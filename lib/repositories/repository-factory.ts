/**
 * Repository Factory
 *
 * Centralized factory for creating and managing repository instances.
 * Implements the factory pattern for dependency injection.
 *
 * Usage:
 * ```typescript
 * const dal = RepositoryFactory.create(supabaseClient);
 * const persona = await dal.data.getUserPersona(sessionId);
 * const docs = await dal.knowledge.vectorSearchKnowledgeBase(embedding);
 * ```
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { DataRepository } from './data.repository';
import { KnowledgeRepository } from './knowledge.repository';
import { PageRepository } from './page.repository';
import {
  IDataRepository,
  IKnowledgeRepository,
  IPageRepository,
} from './types';

/**
 * Data Access Layer facade combining all repositories
 */
export interface IDataAccessLayer {
  data: IDataRepository;
  knowledge: IKnowledgeRepository;
  page: IPageRepository;
}

/**
 * Repository Factory - Creates and manages repository instances
 */
export class RepositoryFactory {
  private static instance: IDataAccessLayer | null = null;
  private static client: SupabaseClient | null = null;

  /**
   * Create or retrieve a Data Access Layer instance
   * Uses singleton pattern to ensure consistent client across repositories
   *
   * @param client Supabase client instance
   * @returns IDataAccessLayer with all repositories
   */
  static create(client: SupabaseClient): IDataAccessLayer {
    // If we already have an instance with the same client, return it
    if (this.instance && this.client === client) {
      return this.instance;
    }

    // Create new instance with provided client
    this.client = client;
    this.instance = {
      data: new DataRepository(client),
      knowledge: new KnowledgeRepository(client),
      page: new PageRepository(client),
    };

    return this.instance;
  }

  /**
   * Create a fresh instance (useful for testing or isolation)
   *
   * @param client Supabase client instance
   * @returns New IDataAccessLayer instance
   */
  static createFresh(client: SupabaseClient): IDataAccessLayer {
    return {
      data: new DataRepository(client),
      knowledge: new KnowledgeRepository(client),
      page: new PageRepository(client),
    };
  }

  /**
   * Reset the singleton instance (useful for testing or client changes)
   */
  static reset(): void {
    this.instance = null;
    this.client = null;
  }

  /**
   * Get the current instance without creating a new one
   * Returns null if no instance has been created yet
   *
   * @returns Current IDataAccessLayer instance or null
   */
  static getInstance(): IDataAccessLayer | null {
    return this.instance;
  }

  /**
   * Check if a singleton instance already exists
   *
   * @returns true if instance exists, false otherwise
   */
  static hasInstance(): boolean {
    return this.instance !== null;
  }
}

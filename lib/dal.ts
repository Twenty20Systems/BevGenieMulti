/**
 * Data Access Layer (DAL) Entry Point
 *
 * Provides easy access to the repository pattern throughout the application.
 * Use this module instead of importing individual repositories.
 *
 * @example
 * ```typescript
 * // In any file
 * import { dal } from '@/lib/dal';
 *
 * // Get user persona
 * const persona = await dal.data.getUserPersona(sessionId);
 *
 * // Search knowledge base
 * const docs = await dal.knowledge.vectorSearchKnowledgeBase(embedding);
 *
 * // Save generated page
 * await dal.page.saveGeneratedPage(pageSpec);
 * ```
 */

import { supabase, supabaseAdmin } from '@/lib/supabase/client';
import { RepositoryFactory, type IDataAccessLayer } from '@/lib/repositories';

let dalInstance: IDataAccessLayer | null = null;

/**
 * Get or initialize the DAL instance
 * Uses singleton pattern to ensure consistent client across all repositories
 */
export function getDAL(): IDataAccessLayer {
  if (!dalInstance) {
    // Use admin client for write operations, fallback to regular client
    const client = supabaseAdmin || supabase;
    dalInstance = RepositoryFactory.create(client);
  }
  return dalInstance;
}

/**
 * Reset the DAL instance (useful for testing or client changes)
 */
export function resetDAL(): void {
  dalInstance = null;
  RepositoryFactory.reset();
}

/**
 * Export a pre-initialized DAL instance for convenient imports
 * This is the recommended way to access the DAL
 */
export const dal = {
  get data() {
    return getDAL().data;
  },
  get knowledge() {
    return getDAL().knowledge;
  },
  get page() {
    return getDAL().page;
  },
};

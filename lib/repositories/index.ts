/**
 * Repositories Barrel Export
 *
 * Central export point for all repository-related code.
 * Makes imports cleaner: from '@/lib/repositories' instead of '@/lib/repositories/X'
 */

// Export repositories
export { BaseRepository } from './base.repository';
export { DataRepository } from './data.repository';
export { KnowledgeRepository } from './knowledge.repository';
export { PageRepository } from './page.repository';

// Export factory
export { RepositoryFactory, type IDataAccessLayer } from './repository-factory';

// Export types and interfaces
export type {
  // User Persona types
  UserPersona,
  PersonaCreateInput,
  PersonaUpdateInput,
  // Conversation types
  ConversationMessage,
  MessageCreateInput,
  // Persona Signal types
  PersonaSignal,
  SignalCreateInput,
  // Knowledge Document types
  KnowledgeDocument,
  KnowledgeSearchOptions,
  // Generated Page & Brochure types
  GeneratedBrochure,
  BrochureCreateInput,
  // Repository interfaces
  IDataRepository,
  IKnowledgeRepository,
  IPageRepository,
} from './types';

// Export error classes
export {
  RepositoryError,
  NotFoundError,
  ValidationError,
  AuthorizationError,
} from './types';

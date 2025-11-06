/**
 * Repository Type Definitions
 *
 * Centralized type definitions for all Data Access Layer repositories
 * Ensures type consistency across all database operations
 */

// ============================================================================
// User Persona Types
// ============================================================================

export interface UserPersona {
  id: string;
  user_id?: string;
  session_id: string;
  supplier_score: number;
  distributor_score: number;
  craft_score: number;
  mid_sized_score: number;
  large_score: number;
  sales_focus_score: number;
  marketing_focus_score: number;
  operations_focus_score: number;
  compliance_focus_score: number;
  pain_points_detected: string[];
  pain_points_confidence: Record<string, number>;
  overall_confidence: number;
  total_interactions: number;
  questions_asked: string[];
  last_updated: string;
  user_confirmed_type?: string;
  user_confirmed_size?: string;
  data_connected: boolean;
  data_sources: Record<string, unknown>;
  created_at: string;
}

export interface PersonaCreateInput {
  session_id: string;
  supplier_score?: number;
  distributor_score?: number;
  craft_score?: number;
  mid_sized_score?: number;
  large_score?: number;
  sales_focus_score?: number;
  marketing_focus_score?: number;
  operations_focus_score?: number;
  compliance_focus_score?: number;
  pain_points_detected?: string[];
  pain_points_confidence?: Record<string, number>;
  overall_confidence?: number;
  user_confirmed_type?: string;
  user_confirmed_size?: string;
}

export interface PersonaUpdateInput {
  supplier_score?: number;
  distributor_score?: number;
  craft_score?: number;
  mid_sized_score?: number;
  large_score?: number;
  sales_focus_score?: number;
  marketing_focus_score?: number;
  operations_focus_score?: number;
  compliance_focus_score?: number;
  pain_points_detected?: string[];
  pain_points_confidence?: Record<string, number>;
  overall_confidence?: number;
  total_interactions?: number;
  questions_asked?: string[];
  user_confirmed_type?: string;
  user_confirmed_size?: string;
  data_connected?: boolean;
  data_sources?: Record<string, unknown>;
}

// ============================================================================
// Conversation & Message Types
// ============================================================================

export interface ConversationMessage {
  id: string;
  session_id: string;
  user_id?: string;
  message_role: 'user' | 'assistant';
  message_content: string;
  persona_snapshot?: Record<string, unknown>;
  pain_points_inferred?: string[];
  ui_specification?: Record<string, unknown>;
  generation_mode?: string;
  estimated_read_time?: string;
  created_at: string;
}

export interface MessageCreateInput {
  session_id: string;
  user_id?: string;
  message_role: 'user' | 'assistant';
  message_content: string;
  persona_snapshot?: Record<string, unknown>;
  pain_points_inferred?: string[];
  ui_specification?: Record<string, unknown>;
  generation_mode?: string;
  estimated_read_time?: string;
}

// ============================================================================
// Persona Signal Types
// ============================================================================

export interface PersonaSignal {
  id: string;
  session_id: string;
  signal_type?: string;
  signal_text?: string;
  signal_strength?: string;
  score_updates?: Record<string, number>;
  pain_points_inferred?: string[];
  confidence_before?: number;
  confidence_after?: number;
  created_at: string;
}

export interface SignalCreateInput {
  session_id: string;
  signal_type?: string;
  signal_text?: string;
  signal_strength?: string;
  score_updates?: Record<string, number>;
  pain_points_inferred?: string[];
  confidence_before?: number;
  confidence_after?: number;
}

// ============================================================================
// Knowledge Base Types
// ============================================================================

export interface KnowledgeDocument {
  id: string;
  content: string;
  embedding?: number[];
  metadata?: Record<string, unknown>;
  persona_tags?: string[];
  pain_point_tags?: string[];
  source_type?: string;
  source_url?: string;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeSearchOptions {
  personaTags?: string[];
  painPointTags?: string[];
  limit?: number;
  similarity_threshold?: number;
}

// ============================================================================
// Generated Page & Brochure Types
// ============================================================================

export interface GeneratedBrochure {
  id: string;
  session_id: string;
  user_id?: string;
  brochure_content: Record<string, unknown>;
  persona_context: Record<string, unknown>;
  questions_analyzed?: string[];
  pain_points_addressed?: string[];
  created_at: string;
}

export interface BrochureCreateInput {
  session_id: string;
  user_id?: string;
  brochure_content: Record<string, unknown>;
  persona_context: Record<string, unknown>;
  questions_analyzed?: string[];
  pain_points_addressed?: string[];
}

// ============================================================================
// Repository Interfaces
// ============================================================================

/**
 * Data Repository Interface
 * Handles user personas, conversations, and signals
 */
export interface IDataRepository {
  // Persona operations
  getUserPersona(sessionId: string): Promise<UserPersona | null>;
  createUserPersona(data: PersonaCreateInput): Promise<UserPersona>;
  updateUserPersona(sessionId: string, updates: PersonaUpdateInput): Promise<UserPersona>;
  deleteUserPersona(sessionId: string): Promise<void>;

  // Conversation operations
  addConversationMessage(data: MessageCreateInput): Promise<ConversationMessage>;
  getConversationHistory(sessionId: string): Promise<ConversationMessage[]>;
  deleteConversationHistory(sessionId: string): Promise<void>;

  // Persona signal operations
  recordPersonaSignal(data: SignalCreateInput): Promise<PersonaSignal>;
  getPersonaSignals(sessionId: string): Promise<PersonaSignal[]>;

  // Session cleanup
  deleteSessionData(sessionId: string): Promise<void>;
  getOldSessions(daysOld: number): Promise<UserPersona[]>;
}

/**
 * Knowledge Repository Interface
 * Handles knowledge base searches and content
 */
export interface IKnowledgeRepository {
  // Vector search
  vectorSearchKnowledgeBase(
    embedding: number[],
    options?: KnowledgeSearchOptions
  ): Promise<KnowledgeDocument[]>;

  // Hybrid search (text + vector)
  hybridSearchKnowledgeBase(
    query: string,
    embedding: number[],
    options?: KnowledgeSearchOptions
  ): Promise<KnowledgeDocument[]>;

  // Text search
  textSearchKnowledgeBase(
    query: string,
    options?: Omit<KnowledgeSearchOptions, 'similarity_threshold'>
  ): Promise<KnowledgeDocument[]>;

  // Get documents by pain point
  getPainPointDocuments(painPoints: string[]): Promise<KnowledgeDocument[]>;

  // Add knowledge documents (admin only)
  addKnowledgeDocuments(docs: KnowledgeDocument[]): Promise<void>;
}

/**
 * Page Repository Interface
 * Handles generated pages and brochures
 */
export interface IPageRepository {
  // Page operations
  saveGeneratedPage(pageSpec: Record<string, unknown>): Promise<Record<string, unknown>>;
  getGeneratedPage(pageId: string): Promise<Record<string, unknown> | null>;
  getRecentPages(sessionId: string, limit?: number): Promise<Record<string, unknown>[]>;
  getMostViewedPages(sessionId: string, limit?: number): Promise<Record<string, unknown>[]>;

  // Analytics
  recordPageEvent(pageId: string, eventType: string): Promise<void>;
  getPageAnalytics(pageId: string): Promise<Record<string, unknown>>;
  getPageGenerationStats(sessionId: string, days?: number): Promise<Record<string, unknown>>;

  // Brochure operations
  saveBrochure(data: BrochureCreateInput): Promise<GeneratedBrochure>;
  getLatestBrochure(sessionId: string): Promise<GeneratedBrochure | null>;

  // Cleanup
  cleanupExpiredPages(): Promise<void>;
  isPageValid(pageId: string): Promise<boolean>;
}

// ============================================================================
// Error Types
// ============================================================================

export class RepositoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export class NotFoundError extends RepositoryError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends RepositoryError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class AuthorizationError extends RepositoryError {
  constructor(message: string) {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

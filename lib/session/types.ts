/**
 * Session Management Types
 *
 * Defines all TypeScript interfaces for iron-session integration
 * Used across the application for session persistence and persona tracking
 */

/**
 * Pain Points Configuration
 * Maps each of the 6 pain points with their detection criteria
 */
export type PainPointType =
  | 'execution_blind_spot'
  | 'market_assessment'
  | 'sales_effectiveness'
  | 'market_positioning'
  | 'operational_challenge'
  | 'regulatory_compliance';

export interface PainPointDetails {
  id: PainPointType;
  label: string;
  description: string;
  signals: string[];
  solutions: string[];
}

/**
 * Persona Detection Vectors: 4 Key Dimensions
 *
 * Vector 1: Functional Role - User's primary business function
 * Vector 2: Org Type - Supplier vs Retailer
 * Vector 3: Org Size - Small (S), Medium (M), Large (L)
 * Vector 4: Product Focus - Beer, Spirits, Wine
 */
export interface PersonaDetectionVectors {
  // Vector 1: Functional Role (Sales, Marketing)
  functional_role: 'sales' | 'marketing' | null;
  functional_role_confidence: number; // 0-100
  functional_role_history: string[]; // Simplified: just store role names (max 5)

  // Vector 2: Org Type (Supplier, Retailer)
  org_type: 'supplier' | 'retailer' | null;
  org_type_confidence: number; // 0-100
  org_type_history: string[]; // Simplified: just store type names (max 5)

  // Vector 3: Org Size (S, M, L)
  org_size: 'S' | 'M' | 'L' | null;
  org_size_confidence: number; // 0-100
  org_size_history: string[]; // Simplified: just store size names (max 5)

  // Vector 4: Product Focus (Beer, Spirits, Wine)
  product_focus: 'beer' | 'spirits' | 'wine' | null;
  product_focus_confidence: number; // 0-100
  product_focus_history: string[]; // Simplified: just store product names (max 5)

  // Last Updated
  vectors_updated_at: number; // Unix timestamp
}

/**
 * Persona Scores: Multi-dimensional User Classification
 *
 * Dimension 1: User Type (Supplier vs Distributor)
 * Dimension 2: Supplier Size (Craft, Mid-sized, Large)
 * Dimension 3: Functional Focus (Sales, Marketing, Operations, Compliance)
 */
export interface PersonaScores {
  // ==================== NEW: Detection Vectors ====================
  detection_vectors: PersonaDetectionVectors;

  // Dimension 1: User Type
  supplier_score: number; // 0.0 - 1.0
  distributor_score: number; // 0.0 - 1.0

  // Dimension 2: Supplier Size (only populated if supplier_score is high)
  craft_score: number; // 0.0 - 1.0
  mid_sized_score: number; // 0.0 - 1.0
  large_score: number; // 0.0 - 1.0

  // Dimension 3: Functional Focus
  sales_focus_score: number; // 0.0 - 1.0
  marketing_focus_score: number; // 0.0 - 1.0
  operations_focus_score: number; // 0.0 - 1.0
  compliance_focus_score: number; // 0.0 - 1.0

  // Confidence and Pain Points
  pain_points_detected: PainPointType[];
  pain_points_confidence: Record<PainPointType, number>; // Confidence for each detected pain point
  overall_confidence: number; // 0.0 - 1.0
  total_interactions: number; // Number of messages/signals processed
}

/**
 * Session Data: Persisted User Context
 *
 * This is what gets stored in the iron-session cookie
 * Updated on every user interaction
 */
export interface SessionData {
  // Session Identification
  sessionId: string; // Unique UUID for this session
  userId?: string; // Optional: populated after authentication
  createdAt: number; // Unix timestamp
  lastActivityAt: number; // Unix timestamp

  // Persona Detection State
  persona: PersonaScores;

  // Interaction History
  messageCount: number; // Total messages in this session
  lastMessage?: string; // Last user message (for context)
  lastMessageAt?: number; // Unix timestamp of last message

  // UI State
  currentMode: 'fresh' | 'returning' | 'data_connected';
  lastGeneratedBrochureId?: string;
  lastBrochureGeneratedAt?: number;

  // Feature Flags
  hasCompletedOnboarding: boolean;
  hasBrochure: boolean;
  isDataConnected: boolean;

  // Metadata
  userAgent?: string;
  ipAddress?: string;
  locale?: string;
}

/**
 * Minimal Session for Type Safety
 * Used by iron-session for type inference
 */
export interface IronSessionData {
  user?: SessionData;
}

/**
 * API Request/Response Types for Session Operations
 */
export interface SessionCreateRequest {
  userAgent?: string;
  ipAddress?: string;
  locale?: string;
}

export interface SessionUpdateRequest {
  persona?: Partial<PersonaScores>;
  currentMode?: 'fresh' | 'returning' | 'data_connected';
  messageCount?: number;
  lastMessage?: string;
  hasCompletedOnboarding?: boolean;
  hasBrochure?: boolean;
  isDataConnected?: boolean;
}

export interface PersonaSignalRequest {
  signal_type: string;
  signal_text: string;
  signal_strength: 'weak' | 'medium' | 'strong';
  pain_points_inferred?: PainPointType[];
  confidence?: number;
}

/**
 * Utility type for extracting persona dimension values
 */
export type PersonaDimension = {
  dimension: 'user_type' | 'supplier_size' | 'functional_focus';
  scores: Record<string, number>;
  recommendedValue?: string; // Which value has highest score
};

/**
 * Constants for Persona Detection
 */
export const PAIN_POINTS: Record<PainPointType, PainPointDetails> = {
  execution_blind_spot: {
    id: 'execution_blind_spot',
    label: 'Execution Blind Spot',
    description: 'Cannot measure effectiveness of field sales and marketing execution',
    signals: ['ROI proof', 'field activities', 'execution tracking', 'measurement gap'],
    solutions: ['execution tracking', 'ROI measurement', 'field analytics'],
  },
  market_assessment: {
    id: 'market_assessment',
    label: 'Market Assessment',
    description: 'Difficulty assessing market needs and customer requirements',
    signals: ['market research', 'customer feedback', 'market needs', 'assessment'],
    solutions: ['market research tools', 'feedback collection', 'customer insights'],
  },
  sales_effectiveness: {
    id: 'sales_effectiveness',
    label: 'Sales Effectiveness',
    description: 'Cannot optimize sales processes and team performance',
    signals: ['sales training', 'sales optimization', 'performance', 'effectiveness'],
    solutions: ['sales enablement', 'training programs', 'sales coaching'],
  },
  market_positioning: {
    id: 'market_positioning',
    label: 'Market Positioning',
    description: 'Struggle to position product effectively in market',
    signals: ['positioning', 'market differentiation', 'competitor analysis', 'messaging'],
    solutions: ['positioning strategy', 'brand messaging', 'competitive analysis'],
  },
  operational_challenge: {
    id: 'operational_challenge',
    label: 'Operational Challenge',
    description: 'Internal operational inefficiencies and process gaps',
    signals: ['operations', 'efficiency', 'process improvement', 'workflow'],
    solutions: ['process optimization', 'workflow automation', 'operational tools'],
  },
  regulatory_compliance: {
    id: 'regulatory_compliance',
    label: 'Regulatory Compliance',
    description: 'Meeting regulatory requirements and compliance standards',
    signals: ['compliance', 'regulatory', 'standards', 'legal requirements'],
    solutions: ['compliance tools', 'regulatory guidance', 'audit support'],
  },
};

/**
 * Default Detection Vectors
 */
export const DEFAULT_DETECTION_VECTORS: PersonaDetectionVectors = {
  functional_role: null,
  functional_role_confidence: 0,
  functional_role_history: [],
  org_type: null,
  org_type_confidence: 0,
  org_type_history: [],
  org_size: null,
  org_size_confidence: 0,
  org_size_history: [],
  product_focus: null,
  product_focus_confidence: 0,
  product_focus_history: [],
  vectors_updated_at: 0,
};

/**
 * Default Persona Scores (neutral state)
 */
export const DEFAULT_PERSONA_SCORES: PersonaScores = {
  detection_vectors: DEFAULT_DETECTION_VECTORS,
  supplier_score: 0.5,
  distributor_score: 0.5,
  craft_score: 0.33,
  mid_sized_score: 0.33,
  large_score: 0.33,
  sales_focus_score: 0.25,
  marketing_focus_score: 0.25,
  operations_focus_score: 0.25,
  compliance_focus_score: 0.25,
  pain_points_detected: [],
  pain_points_confidence: {},
  overall_confidence: 0,
  total_interactions: 0,
};

/**
 * Default Session Data (fresh session)
 */
export const DEFAULT_SESSION_DATA: SessionData = {
  sessionId: '', // Will be set on creation
  createdAt: 0, // Will be set on creation
  lastActivityAt: 0, // Will be set on creation
  persona: DEFAULT_PERSONA_SCORES,
  messageCount: 0,
  currentMode: 'fresh',
  hasCompletedOnboarding: false,
  hasBrochure: false,
  isDataConnected: false,
};

/**
 * Session Validation Constants
 */
export const SESSION_CONFIG = {
  COOKIE_NAME: 'bevgenie-session',
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
  IDLE_TIMEOUT: 24 * 60 * 60, // 24 hours of inactivity = logout
  MIN_CONFIDENCE_THRESHOLD: 0.3, // Minimum confidence to consider persona detected
  INTERACTION_WEIGHT: 0.1, // How much each interaction increases total_interactions
};

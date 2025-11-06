/**
 * Persona Detection Logic
 *
 * Analyzes user messages to detect:
 * 1. User Type (Supplier vs Distributor)
 * 2. Supplier Size (Craft, Mid-sized, Large)
 * 3. Functional Focus (Sales, Marketing, Operations, Compliance)
 * 4. Pain Points (6 categories)
 *
 * Uses keyword matching and signal strength scoring
 */

import type { PersonaScores, PainPointType } from '@/lib/session/types';
import { PAIN_POINTS } from '@/lib/session/types';
import { detectVectorSignals, updateDetectionVectors } from '@/lib/ai/vector-detection';

/**
 * Signal detection result
 */
export interface DetectedSignal {
  type: 'user_type' | 'company_size' | 'functional_focus' | 'pain_point';
  category: string;
  strength: 'weak' | 'medium' | 'strong';
  confidence: number; // 0.0 - 1.0
  evidence: string; // Supporting text from message
}

/**
 * Main persona detection function
 *
 * Analyzes a user message and returns detected signals
 * These signals are accumulated over time to build persona profile
 *
 * @param message - User message to analyze
 * @param currentPersona - Current persona state (for context)
 * @param interactionContext - Navigation/interaction context for 4-vector detection
 * @returns Array of detected signals
 *
 * @example
 * ```typescript
 * const signals = detectPersonaSignals(
 *   'We have trouble proving ROI for our field activities',
 *   currentPersona,
 *   { source: 'hero_cta_click', text: 'ROI Tracking' }
 * );
 * ```
 */
export function detectPersonaSignals(
  message: string,
  currentPersona?: PersonaScores,
  interactionContext?: any
): DetectedSignal[] {
  const signals: DetectedSignal[] = [];
  const lowerMessage = message.toLowerCase();

  // Detect user type (Supplier vs Distributor)
  const userTypeSignals = detectUserType(lowerMessage);
  signals.push(...userTypeSignals);

  // Detect company size (if supplier)
  const sizeSignals = detectCompanySize(lowerMessage);
  signals.push(...sizeSignals);

  // Detect functional focus
  const focusSignals = detectFunctionalFocus(lowerMessage);
  signals.push(...focusSignals);

  // Detect pain points
  const painPointSignals = detectPainPoints(lowerMessage);
  signals.push(...painPointSignals);

  return signals;
}

/**
 * Detect and update the 4 key persona detection vectors
 * Based on both message content and navigation interactions
 *
 * @param message - User message
 * @param currentPersona - Current persona scores (for vector updates)
 * @param interactionContext - Navigation/interaction context
 * @returns Updated persona scores with vectors updated
 */
export function detectAndUpdateVectors(
  message: string,
  currentPersona: PersonaScores,
  interactionContext?: any
): PersonaScores {
  // Detect vector signals from message and interaction
  const vectorSignals = detectVectorSignals(message, interactionContext);

  // Update detection vectors based on signals
  const updatedVectors = updateDetectionVectors(currentPersona.detection_vectors, vectorSignals);

  // Return persona with updated vectors
  return {
    ...currentPersona,
    detection_vectors: updatedVectors,
  };
}

/**
 * Detect user type signals
 *
 * Keywords indicating:
 * - Supplier: "field sales", "territory", "producer", "brand", "product"
 * - Distributor: "resell", "wholesale", "retail", "channel", "account"
 */
function detectUserType(message: string): DetectedSignal[] {
  const signals: DetectedSignal[] = [];

  // Supplier keywords
  const supplierKeywords = [
    'field sales',
    'field team',
    'territory',
    'producer',
    'manufacture',
    'brand',
    'my product',
    'our product',
    'production',
    'craft',
    'estate',
    'vineyard',
  ];

  // Distributor keywords
  const distributorKeywords = [
    'resell',
    'wholesale',
    'retail',
    'channel',
    'account',
    'on-premise',
    'bar',
    'restaurant',
    'retailer',
    'customers',
    'distributor',
    'portfolio',
    'sell through',
  ];

  // Check for supplier signals
  const supplierMatches = supplierKeywords.filter((kw) => message.includes(kw));
  if (supplierMatches.length > 0) {
    signals.push({
      type: 'user_type',
      category: 'supplier',
      strength: supplierMatches.length >= 2 ? 'strong' : 'medium',
      confidence: Math.min(0.9, supplierMatches.length * 0.2),
      evidence: supplierMatches[0],
    });
  }

  // Check for distributor signals
  const distributorMatches = distributorKeywords.filter((kw) => message.includes(kw));
  if (distributorMatches.length > 0) {
    signals.push({
      type: 'user_type',
      category: 'distributor',
      strength: distributorMatches.length >= 2 ? 'strong' : 'medium',
      confidence: Math.min(0.9, distributorMatches.length * 0.2),
      evidence: distributorMatches[0],
    });
  }

  return signals;
}

/**
 * Detect company size signals
 *
 * Keywords indicating:
 * - Craft: "small", "family", "artisan", "independent", "boutique"
 * - Mid-sized: "growing", "expanding", "100+", "multi-state"
 * - Large: "enterprise", "national", "multi-national", "largest", "major"
 */
function detectCompanySize(message: string): DetectedSignal[] {
  const signals: DetectedSignal[] = [];

  // Craft brewery keywords
  const craftKeywords = [
    'small',
    'family',
    'artisan',
    'independent',
    'boutique',
    'craft',
    'local',
    'micro',
    'startup',
    'founded',
  ];

  // Mid-sized keywords
  const midSizedKeywords = [
    'growing',
    'expanding',
    '100',
    'multi-state',
    'regional',
    'established',
    'scale',
  ];

  // Large company keywords
  const largeKeywords = [
    'enterprise',
    'national',
    'multi-national',
    'largest',
    'major',
    'global',
    'thousand',
    'public',
  ];

  // Check craft signals
  const craftMatches = craftKeywords.filter((kw) => message.includes(kw));
  if (craftMatches.length > 0) {
    signals.push({
      type: 'company_size',
      category: 'craft',
      strength: craftMatches.length >= 2 ? 'strong' : 'medium',
      confidence: Math.min(0.8, craftMatches.length * 0.15),
      evidence: craftMatches[0],
    });
  }

  // Check mid-sized signals
  const midSizedMatches = midSizedKeywords.filter((kw) => message.includes(kw));
  if (midSizedMatches.length > 0) {
    signals.push({
      type: 'company_size',
      category: 'mid_sized',
      strength: midSizedMatches.length >= 2 ? 'strong' : 'medium',
      confidence: Math.min(0.8, midSizedMatches.length * 0.15),
      evidence: midSizedMatches[0],
    });
  }

  // Check large company signals
  const largeMatches = largeKeywords.filter((kw) => message.includes(kw));
  if (largeMatches.length > 0) {
    signals.push({
      type: 'company_size',
      category: 'large',
      strength: largeMatches.length >= 2 ? 'strong' : 'medium',
      confidence: Math.min(0.8, largeMatches.length * 0.15),
      evidence: largeMatches[0],
    });
  }

  return signals;
}

/**
 * Detect functional focus signals
 *
 * Keywords indicating:
 * - Sales: "sales", "territory", "revenue", "close", "deal", "customer"
 * - Marketing: "brand", "marketing", "campaign", "social", "awareness"
 * - Operations: "process", "efficiency", "workflow", "logistics", "supply"
 * - Compliance: "compliance", "regulatory", "legal", "audit", "standards"
 */
function detectFunctionalFocus(message: string): DetectedSignal[] {
  const signals: DetectedSignal[] = [];

  const salesKeywords = [
    'sales',
    'revenue',
    'close',
    'deal',
    'customer',
    'pitch',
    'win',
    'territory',
    'quota',
  ];

  const marketingKeywords = [
    'brand',
    'marketing',
    'campaign',
    'social',
    'awareness',
    'messaging',
    'positioning',
    'market',
  ];

  const operationsKeywords = [
    'process',
    'efficiency',
    'workflow',
    'logistics',
    'supply',
    'operation',
    'cost',
    'optimize',
  ];

  const complianceKeywords = [
    'compliance',
    'regulatory',
    'legal',
    'audit',
    'standards',
    'requirement',
    'license',
  ];

  // Sales focus
  const salesMatches = salesKeywords.filter((kw) => message.includes(kw));
  if (salesMatches.length > 0) {
    signals.push({
      type: 'functional_focus',
      category: 'sales',
      strength: salesMatches.length >= 2 ? 'strong' : 'medium',
      confidence: Math.min(0.85, salesMatches.length * 0.15),
      evidence: salesMatches[0],
    });
  }

  // Marketing focus
  const marketingMatches = marketingKeywords.filter((kw) => message.includes(kw));
  if (marketingMatches.length > 0) {
    signals.push({
      type: 'functional_focus',
      category: 'marketing',
      strength: marketingMatches.length >= 2 ? 'strong' : 'medium',
      confidence: Math.min(0.85, marketingMatches.length * 0.15),
      evidence: marketingMatches[0],
    });
  }

  // Operations focus
  const operationsMatches = operationsKeywords.filter((kw) => message.includes(kw));
  if (operationsMatches.length > 0) {
    signals.push({
      type: 'functional_focus',
      category: 'operations',
      strength: operationsMatches.length >= 2 ? 'strong' : 'medium',
      confidence: Math.min(0.85, operationsMatches.length * 0.15),
      evidence: operationsMatches[0],
    });
  }

  // Compliance focus
  const complianceMatches = complianceKeywords.filter((kw) => message.includes(kw));
  if (complianceMatches.length > 0) {
    signals.push({
      type: 'functional_focus',
      category: 'compliance',
      strength: complianceMatches.length >= 2 ? 'strong' : 'medium',
      confidence: Math.min(0.85, complianceMatches.length * 0.15),
      evidence: complianceMatches[0],
    });
  }

  return signals;
}

/**
 * Detect pain point signals
 *
 * Analyzes message for signals indicating one of 6 pain points:
 * 1. Execution Blind Spot - ROI tracking, field effectiveness
 * 2. Market Assessment - Market research, customer understanding
 * 3. Sales Effectiveness - Sales process, team performance
 * 4. Market Positioning - Product positioning, differentiation
 * 5. Operational Challenge - Process efficiency, workflow
 * 6. Regulatory Compliance - Compliance requirements, standards
 */
function detectPainPoints(message: string): DetectedSignal[] {
  const signals: DetectedSignal[] = [];

  // Execution Blind Spot signals
  if (
    message.includes('roi') ||
    message.includes('prove') ||
    message.includes('measure') ||
    message.includes('effectiveness') ||
    message.includes('field') ||
    message.includes('track')
  ) {
    signals.push({
      type: 'pain_point',
      category: 'execution_blind_spot',
      strength: 'medium',
      confidence: 0.7,
      evidence: 'ROI/measurement related keywords detected',
    });
  }

  // Market Assessment signals
  if (
    message.includes('market') ||
    message.includes('research') ||
    message.includes('customer') ||
    message.includes('understand') ||
    message.includes('feedback')
  ) {
    signals.push({
      type: 'pain_point',
      category: 'market_assessment',
      strength: 'medium',
      confidence: 0.65,
      evidence: 'Market research related keywords detected',
    });
  }

  // Sales Effectiveness signals
  if (
    message.includes('sales') ||
    message.includes('train') ||
    message.includes('performance') ||
    message.includes('enablement') ||
    message.includes('optimize')
  ) {
    signals.push({
      type: 'pain_point',
      category: 'sales_effectiveness',
      strength: 'medium',
      confidence: 0.72,
      evidence: 'Sales optimization related keywords detected',
    });
  }

  // Market Positioning signals
  if (
    message.includes('position') ||
    message.includes('differentiate') ||
    message.includes('competitor') ||
    message.includes('brand') ||
    message.includes('messaging')
  ) {
    signals.push({
      type: 'pain_point',
      category: 'market_positioning',
      strength: 'medium',
      confidence: 0.68,
      evidence: 'Positioning related keywords detected',
    });
  }

  // Operational Challenge signals
  if (
    message.includes('process') ||
    message.includes('efficiency') ||
    message.includes('workflow') ||
    message.includes('operation') ||
    message.includes('bottleneck')
  ) {
    signals.push({
      type: 'pain_point',
      category: 'operational_challenge',
      strength: 'medium',
      confidence: 0.70,
      evidence: 'Operations related keywords detected',
    });
  }

  // Regulatory Compliance signals
  if (
    message.includes('compliance') ||
    message.includes('regulatory') ||
    message.includes('legal') ||
    message.includes('standard') ||
    message.includes('requirement')
  ) {
    signals.push({
      type: 'pain_point',
      category: 'regulatory_compliance',
      strength: 'strong',
      confidence: 0.85,
      evidence: 'Compliance related keywords detected',
    });
  }

  return signals;
}

/**
 * Update persona scores based on detected signals
 *
 * This function accumulates signal confidence into persona scores
 * Scores are incremented but capped at 1.0
 *
 * @param currentPersona - Current persona state
 * @param signals - Newly detected signals
 * @returns Updated persona scores
 */
export function updatePersonaWithSignals(
  currentPersona: PersonaScores,
  signals: DetectedSignal[]
): PersonaScores {
  const updated = { ...currentPersona };

  // Weight for signal strength
  const strengthWeights = {
    weak: 0.1,
    medium: 0.2,
    strong: 0.3,
  };

  for (const signal of signals) {
    const weight = strengthWeights[signal.strength] * signal.confidence;

    switch (signal.type) {
      case 'user_type':
        if (signal.category === 'supplier') {
          updated.supplier_score = Math.min(
            1.0,
            updated.supplier_score + weight
          );
        } else if (signal.category === 'distributor') {
          updated.distributor_score = Math.min(
            1.0,
            updated.distributor_score + weight
          );
        }
        break;

      case 'company_size':
        if (signal.category === 'craft') {
          updated.craft_score = Math.min(1.0, updated.craft_score + weight);
        } else if (signal.category === 'mid_sized') {
          updated.mid_sized_score = Math.min(1.0, updated.mid_sized_score + weight);
        } else if (signal.category === 'large') {
          updated.large_score = Math.min(1.0, updated.large_score + weight);
        }
        break;

      case 'functional_focus':
        if (signal.category === 'sales') {
          updated.sales_focus_score = Math.min(1.0, updated.sales_focus_score + weight);
        } else if (signal.category === 'marketing') {
          updated.marketing_focus_score = Math.min(1.0, updated.marketing_focus_score + weight);
        } else if (signal.category === 'operations') {
          updated.operations_focus_score = Math.min(1.0, updated.operations_focus_score + weight);
        } else if (signal.category === 'compliance') {
          updated.compliance_focus_score = Math.min(1.0, updated.compliance_focus_score + weight);
        }
        break;

      case 'pain_point':
        const painPoint = signal.category as PainPointType;
        if (!updated.pain_points_detected.includes(painPoint)) {
          updated.pain_points_detected.push(painPoint);
        }
        updated.pain_points_confidence[painPoint] = Math.min(
          1.0,
          (updated.pain_points_confidence[painPoint] || 0) + weight
        );
        break;
    }
  }

  return updated;
}

/**
 * Get primary persona classification
 *
 * Determines:
 * - User Type (supplier or distributor)
 * - Company Size (craft, mid-sized, large)
 * - Primary Functional Focus (sales, marketing, operations, compliance)
 *
 * @param persona - Current persona scores
 * @returns Object with primary classifications
 */
export function getPrimaryPersonaClass(persona: PersonaScores) {
  return {
    userType:
      persona.supplier_score > persona.distributor_score ? 'supplier' : 'distributor',
    supplierSize:
      persona.craft_score > persona.mid_sized_score &&
      persona.craft_score > persona.large_score
        ? 'craft'
        : persona.mid_sized_score > persona.large_score
          ? 'mid_sized'
          : 'large',
    primaryFocus:
      persona.sales_focus_score > persona.marketing_focus_score &&
      persona.sales_focus_score > persona.operations_focus_score &&
      persona.sales_focus_score > persona.compliance_focus_score
        ? 'sales'
        : persona.marketing_focus_score > persona.operations_focus_score &&
            persona.marketing_focus_score > persona.compliance_focus_score
          ? 'marketing'
          : persona.operations_focus_score > persona.compliance_focus_score
            ? 'operations'
            : 'compliance',
    topPainPoints: persona.pain_points_detected
      .sort((a, b) => (persona.pain_points_confidence[b] || 0) - (persona.pain_points_confidence[a] || 0))
      .slice(0, 3),
  };
}

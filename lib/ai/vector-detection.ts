/**
 * Persona Detection Vectors - 4 Key Dimensions
 *
 * Detects and continuously updates 4 core personas based on:
 * 1. Functional Role: Sales vs Marketing
 * 2. Org Type: Supplier vs Retailer
 * 3. Org Size: Small (S), Medium (M), Large (L)
 * 4. Product Focus: Beer, Spirits, Wine
 *
 * These vectors are updated on every user interaction (questions + navigation clicks)
 */

import type { PersonaDetectionVectors, PersonaScores } from '@/lib/session/types';

export interface VectorDetectionSignal {
  vector: 'functional_role' | 'org_type' | 'org_size' | 'product_focus';
  value: string;
  confidence: number; // 0.0 - 1.0
  evidence: string; // What triggered this detection
  source: 'message' | 'navigation'; // Where the signal came from
}

/**
 * Detect all 4 vectors from user message and interaction context
 * @param message User message/question
 * @param interactionContext Navigation context (what they clicked on)
 * @returns Detected signals for all vectors
 */
export function detectVectorSignals(
  message: string,
  interactionContext?: any
): VectorDetectionSignal[] {
  const signals: VectorDetectionSignal[] = [];

  const lowerMessage = message.toLowerCase();

  // Detect from message
  signals.push(...detectFunctionalRole(lowerMessage, 'message'));
  signals.push(...detectOrgType(lowerMessage, 'message'));
  signals.push(...detectOrgSize(lowerMessage, 'message'));
  signals.push(...detectProductFocus(lowerMessage, 'message'));

  // Detect from navigation context (what user clicked on)
  if (interactionContext) {
    signals.push(...detectFunctionalRole(interactionContext, 'navigation'));
    signals.push(...detectOrgType(interactionContext, 'navigation'));
    signals.push(...detectOrgSize(interactionContext, 'navigation'));
    signals.push(...detectProductFocus(interactionContext, 'navigation'));
  }

  return signals;
}

/**
 * Vector 1: Detect Functional Role (Sales vs Marketing)
 */
function detectFunctionalRole(
  context: string,
  source: 'message' | 'navigation'
): VectorDetectionSignal[] {
  const signals: VectorDetectionSignal[] = [];
  const text = typeof context === 'string' ? context.toLowerCase() : '';

  // Sales keywords and signals
  const salesKeywords = [
    'sales',
    'revenue',
    'quota',
    'close',
    'territory',
    'deal',
    'pipeline',
    'forecast',
    'customer acquisition',
    'sell through',
    'territory analysis',
    'field sales',
    'sales performance',
    'deal closure',
  ];

  // Marketing keywords and signals
  const marketingKeywords = [
    'marketing',
    'brand',
    'awareness',
    'campaign',
    'positioning',
    'messaging',
    'market research',
    'customer insight',
    'market assessment',
    'brand differentiation',
    'market positioning',
    'brand management',
    'competitor analysis',
  ];

  // Check sales signals
  const salesMatches = salesKeywords.filter((kw) => text.includes(kw));
  if (salesMatches.length > 0) {
    signals.push({
      vector: 'functional_role',
      value: 'sales',
      confidence: Math.min(0.95, 0.3 + salesMatches.length * 0.1),
      evidence: `Sales keywords detected: ${salesMatches[0]}`,
      source,
    });
  }

  // Check marketing signals
  const marketingMatches = marketingKeywords.filter((kw) => text.includes(kw));
  if (marketingMatches.length > 0) {
    signals.push({
      vector: 'functional_role',
      value: 'marketing',
      confidence: Math.min(0.95, 0.3 + marketingMatches.length * 0.1),
      evidence: `Marketing keywords detected: ${marketingMatches[0]}`,
      source,
    });
  }

  return signals;
}

/**
 * Vector 2: Detect Org Type (Supplier vs Retailer)
 */
function detectOrgType(
  context: string,
  source: 'message' | 'navigation'
): VectorDetectionSignal[] {
  const signals: VectorDetectionSignal[] = [];
  const text = typeof context === 'string' ? context.toLowerCase() : '';

  // Supplier keywords (producers, manufacturers)
  const supplierKeywords = [
    'supplier',
    'producer',
    'manufacturer',
    'brand',
    'vineyard',
    'brewery',
    'distillery',
    'production',
    'field team',
    'our product',
    'our brand',
    'product launch',
    'market entry',
    'territory management',
    'brand management',
  ];

  // Retailer keywords (distributors, resellers)
  const retailerKeywords = [
    'retailer',
    'distributor',
    'reseller',
    'wholesale',
    'on-premise',
    'retail',
    'sell through',
    'channel',
    'customer account',
    'retail partner',
    'portfolio management',
    'retail execution',
    'retailer performance',
  ];

  // Check supplier signals
  const supplierMatches = supplierKeywords.filter((kw) => text.includes(kw));
  if (supplierMatches.length > 0) {
    signals.push({
      vector: 'org_type',
      value: 'supplier',
      confidence: Math.min(0.95, 0.3 + supplierMatches.length * 0.12),
      evidence: `Supplier keywords detected: ${supplierMatches[0]}`,
      source,
    });
  }

  // Check retailer signals
  const retailerMatches = retailerKeywords.filter((kw) => text.includes(kw));
  if (retailerMatches.length > 0) {
    signals.push({
      vector: 'org_type',
      value: 'retailer',
      confidence: Math.min(0.95, 0.3 + retailerMatches.length * 0.12),
      evidence: `Retailer keywords detected: ${retailerMatches[0]}`,
      source,
    });
  }

  return signals;
}

/**
 * Vector 3: Detect Org Size (S, M, L)
 */
function detectOrgSize(
  context: string,
  source: 'message' | 'navigation'
): VectorDetectionSignal[] {
  const signals: VectorDetectionSignal[] = [];
  const text = typeof context === 'string' ? context.toLowerCase() : '';

  // Small company keywords
  const smallKeywords = [
    'small',
    'startup',
    'family',
    'independent',
    'local',
    'boutique',
    'craft',
    'microbrewery',
    'micro-producer',
    'artisan',
    'founded',
    'founder-led',
    'niche',
  ];

  // Medium company keywords
  const mediumKeywords = [
    'mid-sized',
    'regional',
    'established',
    'growing',
    'expanding',
    '100+',
    'multi-state',
    'distributed',
    'scale',
    'scaling',
    'emerging',
  ];

  // Large company keywords
  const largeKeywords = [
    'large',
    'enterprise',
    'national',
    'multinational',
    'global',
    'fortune',
    'public company',
    'major',
    'largest',
    'thousands',
    'multi-national',
    'international',
  ];

  // Check small signals
  const smallMatches = smallKeywords.filter((kw) => text.includes(kw));
  if (smallMatches.length > 0) {
    signals.push({
      vector: 'org_size',
      value: 'S',
      confidence: Math.min(0.95, 0.25 + smallMatches.length * 0.12),
      evidence: `Small company signals: ${smallMatches[0]}`,
      source,
    });
  }

  // Check medium signals
  const mediumMatches = mediumKeywords.filter((kw) => text.includes(kw));
  if (mediumMatches.length > 0) {
    signals.push({
      vector: 'org_size',
      value: 'M',
      confidence: Math.min(0.95, 0.25 + mediumMatches.length * 0.12),
      evidence: `Medium company signals: ${mediumMatches[0]}`,
      source,
    });
  }

  // Check large signals
  const largeMatches = largeKeywords.filter((kw) => text.includes(kw));
  if (largeMatches.length > 0) {
    signals.push({
      vector: 'org_size',
      value: 'L',
      confidence: Math.min(0.95, 0.25 + largeMatches.length * 0.12),
      evidence: `Large company signals: ${largeMatches[0]}`,
      source,
    });
  }

  return signals;
}

/**
 * Vector 4: Detect Product Focus (Beer, Spirits, Wine)
 */
function detectProductFocus(
  context: string,
  source: 'message' | 'navigation'
): VectorDetectionSignal[] {
  const signals: VectorDetectionSignal[] = [];
  const text = typeof context === 'string' ? context.toLowerCase() : '';

  // Beer keywords
  const beerKeywords = [
    'beer',
    'brewery',
    'breweries',
    'brewpub',
    'ale',
    'lager',
    'hops',
    'craft beer',
    'microbrewery',
    'beer distributor',
    'beer sales',
  ];

  // Spirits keywords (including wine spirits)
  const spiritsKeywords = [
    'spirit',
    'spirits',
    'whiskey',
    'vodka',
    'gin',
    'rum',
    'tequila',
    'liquor',
    'distillery',
    'distilled',
    'bourbon',
    'brandy',
  ];

  // Wine keywords
  const wineKeywords = [
    'wine',
    'winery',
    'wineries',
    'vineyard',
    'vineyards',
    'vintner',
    'red wine',
    'white wine',
    'vintage',
    'wine sales',
    'wine distributor',
  ];

  // Check beer signals
  const beerMatches = beerKeywords.filter((kw) => text.includes(kw));
  if (beerMatches.length > 0) {
    signals.push({
      vector: 'product_focus',
      value: 'beer',
      confidence: Math.min(0.95, 0.4 + beerMatches.length * 0.1),
      evidence: `Beer keywords detected: ${beerMatches[0]}`,
      source,
    });
  }

  // Check spirits signals
  const spiritsMatches = spiritsKeywords.filter((kw) => text.includes(kw));
  if (spiritsMatches.length > 0) {
    signals.push({
      vector: 'product_focus',
      value: 'spirits',
      confidence: Math.min(0.95, 0.4 + spiritsMatches.length * 0.1),
      evidence: `Spirits keywords detected: ${spiritsMatches[0]}`,
      source,
    });
  }

  // Check wine signals
  const wineMatches = wineKeywords.filter((kw) => text.includes(kw));
  if (wineMatches.length > 0) {
    signals.push({
      vector: 'product_focus',
      value: 'wine',
      confidence: Math.min(0.95, 0.4 + wineMatches.length * 0.1),
      evidence: `Wine keywords detected: ${wineMatches[0]}`,
      source,
    });
  }

  return signals;
}

/**
 * Update detection vectors based on signals
 * Maintains history of all detections and updates current values
 */
export function updateDetectionVectors(
  currentVectors: PersonaDetectionVectors,
  signals: VectorDetectionSignal[]
): PersonaDetectionVectors {
  const updated = { ...currentVectors };
  const now = Date.now();

  // Ensure all history arrays are initialized
  if (!updated.functional_role_history) updated.functional_role_history = [];
  if (!updated.org_type_history) updated.org_type_history = [];
  if (!updated.org_size_history) updated.org_size_history = [];
  if (!updated.product_focus_history) updated.product_focus_history = [];

  // Group signals by vector type
  const signalsByVector = signals.reduce(
    (acc, signal) => {
      if (!acc[signal.vector]) acc[signal.vector] = [];
      acc[signal.vector].push(signal);
      return acc;
    },
    {} as Record<string, VectorDetectionSignal[]>
  );

  // Update each vector
  for (const [vectorName, vectorSignals] of Object.entries(signalsByVector)) {
    // Sort by confidence (highest first)
    const sorted = vectorSignals.sort((a, b) => b.confidence - a.confidence);
    const topSignal = sorted[0];

    // Calculate weighted confidence
    const avgConfidence = vectorSignals.reduce((sum, s) => sum + s.confidence, 0) / vectorSignals.length;

    switch (vectorName) {
      case 'functional_role': {
        // Find the highest confidence value
        const grouped = vectorSignals.reduce(
          (acc, s) => {
            if (!acc[s.value]) acc[s.value] = [];
            acc[s.value].push(s);
            return acc;
          },
          {} as Record<string, VectorDetectionSignal[]>
        );

        // Pick the value with highest total confidence
        let maxValue = 'sales';
        let maxConfidence = 0;
        for (const [value, valueSigs] of Object.entries(grouped)) {
          const totalConf = valueSigs.reduce((sum, s) => sum + s.confidence, 0);
          if (totalConf > maxConfidence) {
            maxConfidence = totalConf;
            maxValue = value as any;
          }
        }

        updated.functional_role = maxValue as any;
        updated.functional_role_confidence = Math.min(1.0, updated.functional_role_confidence + avgConfidence * 0.15);
        updated.functional_role_history.push(maxValue);
        // Keep only last 5 entries to reduce cookie size
        if (updated.functional_role_history.length > 5) {
          updated.functional_role_history.shift();
        }
        break;
      }

      case 'org_type': {
        const grouped = vectorSignals.reduce(
          (acc, s) => {
            if (!acc[s.value]) acc[s.value] = [];
            acc[s.value].push(s);
            return acc;
          },
          {} as Record<string, VectorDetectionSignal[]>
        );

        let maxValue = 'supplier';
        let maxConfidence = 0;
        for (const [value, valueSigs] of Object.entries(grouped)) {
          const totalConf = valueSigs.reduce((sum, s) => sum + s.confidence, 0);
          if (totalConf > maxConfidence) {
            maxConfidence = totalConf;
            maxValue = value as any;
          }
        }

        updated.org_type = maxValue as any;
        updated.org_type_confidence = Math.min(1.0, updated.org_type_confidence + avgConfidence * 0.15);
        updated.org_type_history.push(maxValue);
        // Keep only last 5 entries to reduce cookie size
        if (updated.org_type_history.length > 5) {
          updated.org_type_history.shift();
        }
        break;
      }

      case 'org_size': {
        const grouped = vectorSignals.reduce(
          (acc, s) => {
            if (!acc[s.value]) acc[s.value] = [];
            acc[s.value].push(s);
            return acc;
          },
          {} as Record<string, VectorDetectionSignal[]>
        );

        let maxValue = 'M';
        let maxConfidence = 0;
        for (const [value, valueSigs] of Object.entries(grouped)) {
          const totalConf = valueSigs.reduce((sum, s) => sum + s.confidence, 0);
          if (totalConf > maxConfidence) {
            maxConfidence = totalConf;
            maxValue = value as any;
          }
        }

        updated.org_size = maxValue as any;
        updated.org_size_confidence = Math.min(1.0, updated.org_size_confidence + avgConfidence * 0.15);
        updated.org_size_history.push(maxValue);
        // Keep only last 5 entries to reduce cookie size
        if (updated.org_size_history.length > 5) {
          updated.org_size_history.shift();
        }
        break;
      }

      case 'product_focus': {
        const grouped = vectorSignals.reduce(
          (acc, s) => {
            if (!acc[s.value]) acc[s.value] = [];
            acc[s.value].push(s);
            return acc;
          },
          {} as Record<string, VectorDetectionSignal[]>
        );

        let maxValue = 'beer';
        let maxConfidence = 0;
        for (const [value, valueSigs] of Object.entries(grouped)) {
          const totalConf = valueSigs.reduce((sum, s) => sum + s.confidence, 0);
          if (totalConf > maxConfidence) {
            maxConfidence = totalConf;
            maxValue = value as any;
          }
        }

        updated.product_focus = maxValue as any;
        updated.product_focus_confidence = Math.min(1.0, updated.product_focus_confidence + avgConfidence * 0.15);
        updated.product_focus_history.push(maxValue);
        // Keep only last 5 entries to reduce cookie size
        if (updated.product_focus_history.length > 5) {
          updated.product_focus_history.shift();
        }
        break;
      }
    }
  }

  updated.vectors_updated_at = now;
  return updated;
}

/**
 * Get current persona vector classification
 * Shows the determined persona on all 4 vectors with confidence scores
 */
export function getCurrentVectorClassification(vectors: PersonaDetectionVectors) {
  return {
    functional_role: {
      value: vectors.functional_role,
      confidence: vectors.functional_role_confidence,
      detectionCount: vectors.functional_role_history.length,
    },
    org_type: {
      value: vectors.org_type,
      confidence: vectors.org_type_confidence,
      detectionCount: vectors.org_type_history.length,
    },
    org_size: {
      value: vectors.org_size,
      confidence: vectors.org_size_confidence,
      detectionCount: vectors.org_size_history.length,
    },
    product_focus: {
      value: vectors.product_focus,
      confidence: vectors.product_focus_confidence,
      detectionCount: vectors.product_focus_history.length,
    },
    all_vectors_identified: Boolean(
      vectors.functional_role &&
        vectors.org_type &&
        vectors.org_size &&
        vectors.product_focus
    ),
  };
}

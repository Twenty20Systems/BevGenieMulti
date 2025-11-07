/**
 * Intent-Based Layout Strategy System
 * Maps each user intent to optimal page layout configuration
 */

export type UserIntent =
  | 'product_inquiry'    // "What is BevGenie?"
  | 'feature_question'   // "What features does it have?"
  | 'comparison'         // "BevGenie vs competitors?"
  | 'stats_roi'          // "What results can I expect?"
  | 'implementation'     // "How do I get started?"
  | 'use_case'          // "Can BevGenie help with X?"
  | 'off_topic';        // Unrelated questions

export interface IntentLayoutStrategy {
  intent: UserIntent;
  layoutMode: 'balanced' | 'feature_focused' | 'metrics_dominant' | 'process_focused' | 'solution_focused' | 'redirect_focused';
  sections: Array<{
    type: string;
    heightPercent: number;
    contentFocus: string;
  }>;
  contentDensity: 'compact' | 'balanced' | 'spacious';
  primarySection: number; // Which section should dominate
  strategy: string; // Human-readable explanation
}

/**
 * Master mapping of intents to layout strategies
 */
export const INTENT_LAYOUT_STRATEGIES: Record<UserIntent, IntentLayoutStrategy> = {
  product_inquiry: {
    intent: 'product_inquiry',
    layoutMode: 'balanced',
    sections: [
      { type: 'hero', heightPercent: 35, contentFocus: 'brand_value_proposition' },
      { type: 'feature_grid', heightPercent: 50, contentFocus: 'core_capabilities' },
      { type: 'cta', heightPercent: 15, contentFocus: 'conversion_focused' }
    ],
    contentDensity: 'balanced',
    primarySection: 0,
    strategy: 'Hero-dominated brand introduction with core capabilities showcase'
  },

  feature_question: {
    intent: 'feature_question',
    layoutMode: 'feature_focused',
    sections: [
      { type: 'hero', heightPercent: 25, contentFocus: 'feature_category_intro' },
      { type: 'feature_grid', heightPercent: 60, contentFocus: 'detailed_features_with_benefits' },
      { type: 'cta', heightPercent: 15, contentFocus: 'conversion_focused' }
    ],
    contentDensity: 'balanced',
    primarySection: 1,
    strategy: 'Quick intro then comprehensive feature showcase'
  },

  comparison: {
    intent: 'comparison',
    layoutMode: 'balanced',
    sections: [
      { type: 'hero', heightPercent: 20, contentFocus: 'differentiation_headline' },
      { type: 'comparison_table', heightPercent: 35, contentFocus: 'feature_by_feature_comparison' },
      { type: 'metrics', heightPercent: 30, contentFocus: 'competitive_advantage_stats' },
      { type: 'cta', heightPercent: 15, contentFocus: 'conversion_focused' }
    ],
    contentDensity: 'balanced',
    primarySection: 1,
    strategy: 'Competitive differentiation with proof points'
  },

  stats_roi: {
    intent: 'stats_roi',
    layoutMode: 'metrics_dominant',
    sections: [
      { type: 'hero', heightPercent: 30, contentFocus: 'results_promise' },
      { type: 'metrics', heightPercent: 55, contentFocus: 'roi_stats_with_context' },
      { type: 'cta', heightPercent: 15, contentFocus: 'conversion_focused' }
    ],
    contentDensity: 'spacious',
    primarySection: 1,
    strategy: 'Results-focused with prominent metrics and ROI data'
  },

  implementation: {
    intent: 'implementation',
    layoutMode: 'process_focused',
    sections: [
      { type: 'hero', heightPercent: 25, contentFocus: 'ease_of_start' },
      { type: 'steps', heightPercent: 60, contentFocus: 'implementation_roadmap' },
      { type: 'cta', heightPercent: 15, contentFocus: 'conversion_focused' }
    ],
    contentDensity: 'balanced',
    primarySection: 1,
    strategy: 'Clear implementation process with actionable steps'
  },

  use_case: {
    intent: 'use_case',
    layoutMode: 'solution_focused',
    sections: [
      { type: 'hero', heightPercent: 35, contentFocus: 'use_case_validation' },
      { type: 'feature_grid', heightPercent: 50, contentFocus: 'relevant_capabilities' },
      { type: 'cta', heightPercent: 15, contentFocus: 'conversion_focused' }
    ],
    contentDensity: 'balanced',
    primarySection: 0,
    strategy: 'Direct use case validation with relevant solutions'
  },

  off_topic: {
    intent: 'off_topic',
    layoutMode: 'redirect_focused',
    sections: [
      { type: 'hero', heightPercent: 40, contentFocus: 'polite_redirect_with_suggestions' },
      { type: 'feature_grid', heightPercent: 45, contentFocus: 'what_i_can_help_with' },
      { type: 'cta', heightPercent: 15, contentFocus: 'conversion_focused' }
    ],
    contentDensity: 'spacious',
    primarySection: 0,
    strategy: 'Graceful redirect to relevant BevGenie capabilities'
  }
};

/**
 * Get layout strategy for a given intent
 */
export function getLayoutStrategyForIntent(intent: UserIntent): IntentLayoutStrategy {
  return INTENT_LAYOUT_STRATEGIES[intent];
}

/**
 * Content guidelines per intent
 */
export const CONTENT_GUIDELINES: Record<UserIntent, {
  headline: { min: number; max: number; tone: string };
  subheadline: { min: number; max: number; tone: string };
  maxFeatures: number;
  featureDescriptionLength: { min: number; max: number };
  examples: string[];
}> = {
  product_inquiry: {
    headline: { min: 40, max: 70, tone: 'Bold, value-focused' },
    subheadline: { min: 80, max: 150, tone: 'Clear benefit statement' },
    maxFeatures: 3,
    featureDescriptionLength: { min: 60, max: 120 },
    examples: [
      'Transform Market Data Into Revenue Growth',
      'AI-Powered Intelligence for Beverage Brands'
    ]
  },

  feature_question: {
    headline: { min: 30, max: 60, tone: 'Capability-focused' },
    subheadline: { min: 60, max: 120, tone: 'Technical clarity' },
    maxFeatures: 3,
    featureDescriptionLength: { min: 80, max: 150 },
    examples: [
      'Powerful Features for Market Intelligence',
      'Everything You Need to Outpace Competition'
    ]
  },

  comparison: {
    headline: { min: 35, max: 65, tone: 'Differentiating' },
    subheadline: { min: 70, max: 130, tone: 'Competitive advantage' },
    maxFeatures: 0, // Uses comparison table instead
    featureDescriptionLength: { min: 0, max: 0 },
    examples: [
      'Why Leading Brands Choose BevGenie',
      'BevGenie vs Traditional Market Research'
    ]
  },

  stats_roi: {
    headline: { min: 40, max: 70, tone: 'Results-oriented' },
    subheadline: { min: 80, max: 140, tone: 'Credible, data-driven' },
    maxFeatures: 0, // Uses metrics instead
    featureDescriptionLength: { min: 0, max: 0 },
    examples: [
      'Real Results from Real Beverage Brands',
      'Proven ROI Across the Industry'
    ]
  },

  implementation: {
    headline: { min: 30, max: 60, tone: 'Action-oriented, simple' },
    subheadline: { min: 60, max: 120, tone: 'Reassuring, clear timeline' },
    maxFeatures: 0, // Uses steps instead
    featureDescriptionLength: { min: 0, max: 0 },
    examples: [
      'Get Started in 3 Simple Steps',
      'Launch Your Intelligence Platform Fast'
    ]
  },

  use_case: {
    headline: { min: 40, max: 70, tone: 'Validating, specific' },
    subheadline: { min: 80, max: 140, tone: 'Problem → Solution' },
    maxFeatures: 3,
    featureDescriptionLength: { min: 70, max: 130 },
    examples: [
      'Yes! Here\'s How BevGenie Solves That',
      'Designed Specifically for Your Challenge'
    ]
  },

  off_topic: {
    headline: { min: 35, max: 65, tone: 'Friendly, redirecting' },
    subheadline: { min: 80, max: 150, tone: 'Helpful, suggestive' },
    maxFeatures: 3,
    featureDescriptionLength: { min: 60, max: 120 },
    examples: [
      'I Focus on Beverage Market Intelligence',
      'Let Me Show You What I Can Help With'
    ]
  }
};

/**
 * Map intent to page type
 */
export function mapIntentToPageType(intent: UserIntent): string {
  const mapping: Record<UserIntent, string> = {
    'product_inquiry': 'solution_brief',
    'feature_question': 'feature_showcase',
    'comparison': 'comparison',
    'stats_roi': 'roi_calculator',
    'implementation': 'implementation_roadmap',
    'use_case': 'solution_brief',
    'off_topic': 'solution_brief'
  };
  return mapping[intent];
}

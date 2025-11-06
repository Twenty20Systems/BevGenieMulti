/**
 * Intent Classification System
 *
 * Analyzes user messages to detect conversation intent and determine
 * if a dynamic page should be generated, and which page type is most appropriate.
 */

export type PageGenerationIntent =
  | 'general_question'
  | 'pain_point_inquiry'
  | 'feature_question'
  | 'success_story_inquiry'
  | 'competitive_inquiry'
  | 'implementation_question'
  | 'roi_inquiry'
  | 'no_page';

export interface IntentAnalysis {
  intent: PageGenerationIntent;
  confidence: number; // 0-1
  shouldGeneratePage: boolean;
  suggestedPageType?: string;
  reasoning: string;
}

/**
 * Keywords for each intent type
 * Used to classify user messages and determine if page generation is appropriate
 */
const INTENT_KEYWORDS = {
  pain_point_inquiry: {
    keywords: [
      'problem',
      'challenge',
      'struggle',
      'difficult',
      'issue',
      'pain',
      'concern',
      'worried',
      'concern',
      'how do you help',
      'help us',
      'solution',
      'solve',
      'address',
      'overcome',
      'manage',
      'handle',
      'reduce',
      'minimize',
      'improve',
      'better way',
      'losing',
      'costing us',
      'inefficient',
    ],
    weight: 1.0,
    pageType: 'solution_brief',
  },
  feature_question: {
    keywords: [
      'feature',
      'capability',
      'can you',
      'how does',
      'does it',
      'support',
      'available',
      'offer',
      'provide',
      'include',
      'what about',
      'functionality',
      'function',
      'ability',
      'tools',
      'built-in',
      'customizable',
      'flexible',
    ],
    weight: 0.9,
    pageType: 'feature_showcase',
  },
  success_story_inquiry: {
    keywords: [
      'case study',
      'success',
      'story',
      'example',
      'worked',
      'implemented',
      'customer',
      'company',
      'business',
      'prove',
      'proof',
      'result',
      'outcome',
      'achieved',
      'accomplished',
      'similar',
      'like us',
      'show me',
      'demonstrated',
    ],
    weight: 0.95,
    pageType: 'case_study',
  },
  competitive_inquiry: {
    keywords: [
      'compared to',
      'versus',
      'vs',
      'how do you compare',
      'alternative',
      'competitor',
      'different',
      'unique',
      'why you',
      'why not',
      'better than',
      'advantage',
      'superiority',
      'edge',
      'distinction',
      'compete',
      'market',
      'other options',
      'solution out there',
    ],
    weight: 0.85,
    pageType: 'comparison',
  },
  implementation_question: {
    keywords: [
      'implement',
      'rollout',
      'deploy',
      'launch',
      'integration',
      'onboard',
      'setup',
      'install',
      'configure',
      'time',
      'timeline',
      'how long',
      'process',
      'steps',
      'phase',
      'getting started',
      'started',
      'begin',
      'start',
      'ready',
    ],
    weight: 0.8,
    pageType: 'implementation_roadmap',
  },
  roi_inquiry: {
    keywords: [
      'roi',
      'return on investment',
      'payback',
      'cost',
      'investment',
      'price',
      'value',
      'worth',
      'budget',
      'afford',
      'expensive',
      'pricing',
      'save',
      'revenue',
      'profit',
      'calculate',
      'projection',
      'forecast',
      'justify',
      'business case',
    ],
    weight: 0.85,
    pageType: 'roi_calculator',
  },
};

/**
 * Conversation context indicators
 * Help determine if page generation is appropriate based on conversation state
 */
const CONTEXT_SIGNALS = {
  firstMessage: 1.2, // Boost confidence for first message in conversation
  followUp: 0.95, // Neutral for follow-up questions
  deepDive: 0.8, // Lower confidence for very detailed questions
  multipleTopics: 0.7, // Lower confidence when multiple topics mixed
};

/**
 * Analyze a user message to detect intent and determine if page generation is needed
 *
 * @param message - User message to analyze
 * @param conversationLength - Number of messages in conversation so far
 * @param currentPersona - Current detected persona for personalization
 * @returns IntentAnalysis with detected intent and page generation recommendation
 */
export function classifyMessageIntent(
  message: string,
  conversationLength: number = 0,
  currentPersona?: {
    sales_focus_score?: number;
    marketing_focus_score?: number;
    compliance_focus_score?: number;
  }
): IntentAnalysis {
  const lowercaseMessage = message.toLowerCase();
  const wordCount = message.split(/\s+/).length;

  // Score each intent based on keyword matches
  const intentScores: Record<PageGenerationIntent, number> = {
    general_question: 0,
    pain_point_inquiry: 0,
    feature_question: 0,
    success_story_inquiry: 0,
    competitive_inquiry: 0,
    implementation_question: 0,
    roi_inquiry: 0,
    no_page: 0,
  };

  // Calculate scores based on keyword matches
  Object.entries(INTENT_KEYWORDS).forEach(([intent, config]) => {
    const matches = config.keywords.filter((keyword) =>
      lowercaseMessage.includes(keyword)
    ).length;

    if (matches > 0) {
      const keywordDensity = matches / config.keywords.length;
      intentScores[intent as PageGenerationIntent] = keywordDensity * config.weight;
    }
  });

  // Adjust scores based on conversation context
  const contextMultiplier =
    conversationLength === 0
      ? CONTEXT_SIGNALS.firstMessage
      : conversationLength < 3
        ? CONTEXT_SIGNALS.followUp
        : CONTEXT_SIGNALS.deepDive;

  // Apply context multiplier to all scores
  Object.keys(intentScores).forEach((intent) => {
    intentScores[intent as PageGenerationIntent] *= contextMultiplier;
  });

  // Boost scores based on persona focus if available
  if (currentPersona) {
    if (
      currentPersona.sales_focus_score &&
      currentPersona.sales_focus_score > 0.6
    ) {
      intentScores.pain_point_inquiry *= 1.1;
      intentScores.roi_inquiry *= 1.15;
    }
    if (
      currentPersona.marketing_focus_score &&
      currentPersona.marketing_focus_score > 0.6
    ) {
      intentScores.feature_question *= 1.1;
      intentScores.success_story_inquiry *= 1.15;
    }
    if (
      currentPersona.compliance_focus_score &&
      currentPersona.compliance_focus_score > 0.6
    ) {
      intentScores.implementation_question *= 1.1;
    }
  }

  // Find the highest scoring intent
  let maxScore = 0;
  let detectedIntent: PageGenerationIntent = 'general_question';

  Object.entries(intentScores).forEach(([intent, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedIntent = intent as PageGenerationIntent;
    }
  });

  // Determine if page should be generated
  // Only generate page if confidence is high enough and intent is not general_question
  const shouldGeneratePage =
    maxScore > 0.3 && detectedIntent !== 'general_question';

  // Map intent to page type
  const pageTypeMap: Record<string, string> = {
    pain_point_inquiry: 'solution_brief',
    feature_question: 'feature_showcase',
    success_story_inquiry: 'case_study',
    competitive_inquiry: 'comparison',
    implementation_question: 'implementation_roadmap',
    roi_inquiry: 'roi_calculator',
  };

  return {
    intent: detectedIntent,
    confidence: Math.min(maxScore, 1.0),
    shouldGeneratePage,
    suggestedPageType: shouldGeneratePage ? pageTypeMap[detectedIntent] : undefined,
    reasoning: generateReasoningText(
      detectedIntent,
      maxScore,
      Object.entries(intentScores)
        .filter(([, score]) => score > 0.1)
        .map(([intent]) => intent)
    ),
  };
}

/**
 * Generate human-readable reasoning for the detected intent
 */
function generateReasoningText(
  intent: PageGenerationIntent,
  confidence: number,
  allDetectedIntents: string[]
): string {
  const confidenceLevel =
    confidence > 0.7 ? 'high' : confidence > 0.4 ? 'medium' : 'low';
  const intentDescriptions: Record<string, string> = {
    general_question: 'general information request',
    pain_point_inquiry: 'pain point or challenge discussion',
    feature_question: 'specific feature or capability question',
    success_story_inquiry: 'request for proof or customer success examples',
    competitive_inquiry: 'competitive comparison question',
    implementation_question: 'implementation or getting started question',
    roi_inquiry: 'ROI, cost, or value discussion',
  };

  return `Detected ${confidenceLevel} confidence in "${intentDescriptions[intent]}" (${(confidence * 100).toFixed(0)}%)`;
}

/**
 * Determine the best page type for a conversation flow
 * Helps recommend page type when multiple intents are detected
 */
export function determinePageType(
  intents: IntentAnalysis[]
): string | undefined {
  // Filter intents that should generate pages
  const pageIntents = intents.filter((i) => i.shouldGeneratePage);

  if (pageIntents.length === 0) {
    return undefined;
  }

  // Sort by confidence and return the highest confidence page type
  const sorted = pageIntents.sort((a, b) => b.confidence - a.confidence);
  return sorted[0].suggestedPageType;
}

/**
 * Validate that the message is appropriate for page generation
 * Checks for quality signals that indicate a genuine inquiry
 */
export function isQualityInquiry(message: string): boolean {
  // Must be at least a few words
  if (message.split(/\s+/).length < 3) {
    return false;
  }

  // Must not be just a greeting or common phrases
  const shortGreetings = ['hi', 'hello', 'hey', 'thanks', 'ok', 'yes', 'no'];
  const messageLower = message.toLowerCase().trim();

  if (shortGreetings.includes(messageLower)) {
    return false;
  }

  // Must contain some substantive content (not all punctuation or emoji)
  const substantiveChars = message.replace(/[^a-zA-Z0-9\s]/g, '');
  if (substantiveChars.length < 5) {
    return false;
  }

  return true;
}

/**
 * Get page generation metrics for analytics
 * Useful for understanding which types of inquiries generate pages most frequently
 */
export interface PageGenerationMetrics {
  totalIntents: number;
  pagesGenerated: number;
  generationRate: number;
  topIntent: PageGenerationIntent;
  topPageType: string | undefined;
}

export function calculatePageGenerationMetrics(
  analyses: IntentAnalysis[]
): PageGenerationMetrics {
  const generated = analyses.filter((a) => a.shouldGeneratePage).length;
  const intents = analyses.map((a) => a.intent);
  const pageTypes = analyses.filter((a) => a.shouldGeneratePage).map((a) => a.suggestedPageType);

  // Find most common intent
  const intentCounts = intents.reduce(
    (acc, intent) => {
      acc[intent] = (acc[intent] || 0) + 1;
      return acc;
    },
    {} as Record<PageGenerationIntent, number>
  );

  const topIntent = (
    Object.entries(intentCounts).sort(([, a], [, b]) => b - a)[0] || []
  )[0] as PageGenerationIntent;

  // Find most common page type
  const pageTypeCounts = pageTypes.reduce(
    (acc, type) => {
      if (type) acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topPageType = (
    Object.entries(pageTypeCounts).sort(([, a], [, b]) => b - a)[0] || []
  )[0];

  return {
    totalIntents: analyses.length,
    pagesGenerated: generated,
    generationRate: analyses.length > 0 ? generated / analyses.length : 0,
    topIntent: topIntent || 'general_question',
    topPageType,
  };
}

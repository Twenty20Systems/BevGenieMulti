/**
 * Page Generation Engine
 *
 * Uses Claude to generate page specifications based on:
 * - User intent and message
 * - Current persona profile
 * - Knowledge base context
 * - BevGenie page type definitions
 *
 * Ensures generated pages are high-quality by:
 * - Providing clear prompts with page type templates
 * - Validating output against spec schema
 * - Retrying with adjusted prompts on failure
 * - Gracefully degrading to text response if generation fails
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  BevGeniePage,
  PageType,
  PAGE_TYPE_TEMPLATES,
  validatePageSpec,
} from './page-specs';
import { PersonaScores } from '@/lib/session/types';

const client = new Anthropic();

export interface KBDocument {
  id: string;
  content: string;
  source_type?: string;
  source_url?: string;
  persona_tags?: string[];
  pain_point_tags?: string[];
  similarity_score?: number;
}

export interface PageGenerationRequest {
  userMessage: string;
  pageType: PageType;
  persona?: PersonaScores;
  knowledgeContext?: string[];
  knowledgeDocuments?: KBDocument[];
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  personaDescription?: string;
  pageContext?: any; // Context from user interactions (button clicks, navigation)
  interactionSource?: string; // Source of interaction (hero_cta_click, cta_click, learn_more, etc.)
}

export interface PageGenerationResponse {
  success: boolean;
  page?: BevGeniePage;
  error?: string;
  retryCount?: number;
  generationTime?: number;
}

/**
 * Generate a page specification using templates + AI
 * MUCH FASTER: Uses pre-built templates, AI fills content only
 * Falls back to full generation if template-based fails
 */
export async function generatePageSpec(
  request: PageGenerationRequest
): Promise<PageGenerationResponse> {
  const startTime = Date.now();

  // Try template-based generation first (5-8s)
  try {
    const { generateFromTemplate } = await import('./template-engine');

    console.log('[PageGen] Using template-based generation (fast path)');
    const result = await generateFromTemplate(
      request.userMessage,
      request.pageType,
      request.persona || {} as any,
      request.knowledgeDocuments
    );

    if (result.success && result.filledPage) {
      // Validate generated page
      const validationErrors = validatePageSpec(result.filledPage);
      if (validationErrors.length === 0) {
        console.log(`[PageGen] ✅ Template generation successful in ${result.generationTime}ms`);
        return {
          success: true,
          page: result.filledPage,
          retryCount: 0,
          generationTime: Date.now() - startTime,
        };
      } else {
        console.warn('[PageGen] Template validation failed:', validationErrors);
        // Fall through to full generation
      }
    }
  } catch (error) {
    console.warn('[PageGen] Template generation failed, falling back to full generation:', error);
    // Fall through to full generation
  }

  // Fallback: Full generation (slower, 20-25s)
  console.log('[PageGen] Using full generation (slow path - fallback)');
  let retryCount = 0;
  const maxRetries = 2;

  while (retryCount <= maxRetries) {
    try {
      const page = await attemptPageGeneration(request, retryCount);

      // Validate the generated page
      const validationErrors = validatePageSpec(page);
      if (validationErrors.length === 0) {
        return {
          success: true,
          page,
          retryCount,
          generationTime: Date.now() - startTime,
        };
      }

      // If validation fails and we have retries left, try again with feedback
      if (retryCount < maxRetries) {
        retryCount++;
        // Adjust request for retry with validation feedback
        request = {
          ...request,
          userMessage: `${request.userMessage}\n\n[Previous attempt had validation issues: ${validationErrors.join(', ')}. Please regenerate with these corrections.]`,
        };
        continue;
      }

      // All retries exhausted
      return {
        success: false,
        error: `Validation failed after ${maxRetries} retries: ${validationErrors.join(', ')}`,
        retryCount,
        generationTime: Date.now() - startTime,
      };
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        continue;
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error during page generation',
        retryCount,
        generationTime: Date.now() - startTime,
      };
    }
  }

  return {
    success: false,
    error: 'Max retries exceeded',
    retryCount,
    generationTime: Date.now() - startTime,
  };
}

/**
 * Internal function to attempt page generation with Claude
 */
async function attemptPageGeneration(
  request: PageGenerationRequest,
  retryCount: number
): Promise<BevGeniePage> {
  const systemPrompt = buildSystemPrompt(request, retryCount);
  const userPrompt = buildUserPrompt(request);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929', // Switched from Opus-4 for 3-5x faster generation
    max_tokens: 2500, // Reduced from 4000 for faster generation
    system: [
      {
        type: 'text',
        text: systemPrompt,
        cache_control: { type: 'ephemeral' }, // Cache system prompt for 50-90% speed boost
      }
    ],
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  // Extract the text response
  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  // Parse the JSON from the response
  let pageSpec: BevGeniePage;
  try {
    // Try to extract JSON from the response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    pageSpec = JSON.parse(jsonMatch[0]) as BevGeniePage;
  } catch (error) {
    throw new Error(`Failed to parse page specification: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return pageSpec;
}

/**
 * Build the system prompt for page generation
 * Provides context about page types, structure, and requirements
 */
function buildSystemPrompt(
  request: PageGenerationRequest,
  retryCount: number
): string {
  const template = PAGE_TYPE_TEMPLATES[request.pageType];
  const retryNote =
    retryCount > 0
      ? `\n\nNote: This is retry attempt ${retryCount}. Please pay careful attention to the schema requirements and ensure all fields are present and valid.`
      : '';

  return `You are an expert B2B SaaS marketing page generator specializing in the beverage industry. You create professional, detailed, and personalized pages for BevGenie - a beverage industry intelligence platform.

Your task is to generate a professional ${request.pageType} page specification that will be rendered as a full-featured React website component.

Page Type: ${request.pageType}
${template}

⚠️⚠️⚠️ CRITICAL: USE SINGLE-SCREEN FORMAT ⚠️⚠️⚠️

ALL pages MUST use the single_screen section format. This is the ONLY acceptable format.
The single_screen format provides a complete, modern answer in exactly one screen (100vh, non-scrollable).

Your "sections" array MUST contain EXACTLY ONE object with type: "single_screen"

CRITICAL REQUIREMENTS:
1. ⚠️ MANDATORY: Your "sections" array MUST contain EXACTLY ONE object with type: "single_screen"
2. Output ONLY valid JSON that matches the BevGeniePage schema
3. Do NOT include markdown formatting, code blocks, or explanations - output JSON only
4. Ensure all required fields are present and complete
5. Follow the character limits specified in validation rules
6. Create DETAILED, SPECIFIC, and PROFESSIONAL content for the beverage industry
7. Include concrete metrics, data points, and industry-specific insights from the knowledge base
8. Make headlines compelling and subheadlines supporting - not redundant
9. Create action-oriented CTAs with clear business value
10. Structure content to flow logically from problem → insight → solution → action
11. Use professional B2B SaaS language appropriate for C-suite executives and department heads

⚠️ CONTENT GENERATION REQUIREMENTS - COMPREHENSIVE & INFORMATIVE:

Your single-screen sections MUST answer the user's query COMPLETELY within one viewport.
Each section is INFORMATION-RICH with specific, actionable insights.

SINGLE-SCREEN SECTION FORMAT:
{
  "type": "single_screen",
  "headline": "Clear, Benefit-Driven Title (20-80 chars max)" - Focus on the VALUE, not feature name
  "subtitle": "Specific Context (15-60 chars max)" - MUST be specific to user's query. Examples: "Velocity Analysis for Beer Brands" or "Market Expansion Strategy". NEVER use: "Solution Brief", "BevGenie Solution", or generic terms.

  "insights": [
    {
      "text": "DETAILED insight (50-250 chars). 2-3 sentences max. Example: 'Velocity Shift Detection: Our AI identifies 15-30% more sales opportunities by analyzing campaign velocity shifts across your distribution network that traditional analytics miss.'"
    },
    {
      "text": "ACTIONABLE insight (50-250 chars). 2-3 sentences max. Example: 'Market Pattern Recognition: Intelligent algorithms recognize emerging patterns in real-time, allowing you to capitalize on opportunities 3-4 weeks faster than competitors.'"
    },
    {
      "text": "OUTCOME-focused insight (50-250 chars). 2-3 sentences max. Example: 'Automated Revenue Strategies: AI converts market data into specific sales actions, increasing conversion rates by 2.5x on average.'"
    },
    {
      "text": "FOURTH insight connecting to their business (optional). 50-250 chars max. 2-3 sentences."
    }
  ],

  "stats": [
    {
      "value": "15-30%" (max 15 chars - keep it SHORT),
      "label": "More Sales Opportunities" (max 40 chars),
      "description": "Than traditional methods" (optional, max 50 chars)
    },
    {
      "value": "3-4 wks" (max 15 chars),
      "label": "Faster Market Response" (max 40 chars),
      "description": "Before competitors" (optional)
    },
    {
      "value": "2.5x" (max 15 chars),
      "label": "Conversion Rate Boost" (max 40 chars),
      "description": "Average improvement" (optional)
    }
  ],

  "visualContent": {
    "type": "case_study" OR "highlight_box" OR "example",
    "title": "Real-World Impact" (max 50 chars),
    "content": "DETAILED narrative (100-400 chars max, 3-5 sentences). For case_study: tell a specific story with company type, challenge, solution, and outcome. For highlight_box: explain the mechanism in detail. For example: show a concrete scenario.",
    "highlight": "KEY RESULT with numbers (20-200 chars). Example: '$2.3M additional revenue in Q4 by targeting 12 previously overlooked accounts'"
  },

  "howItWorks": [
    "Connect your campaign and sales data seamlessly" (20-100 chars per step),
    "AI analyzes velocity patterns across all markets",
    "Receive prioritized opportunity alerts weekly",
    "Get specific account recommendations with reasoning",
    "Track ROI on every acted opportunity"
  ] (3-5 specific, actionable steps, EACH 20-100 chars),

  "ctas": [
    {
      "text": "Schedule Opportunity Analysis" (5-40 chars max),
      "type": "primary",
      "action": "form",
      "submissionType": "demo"
    },
    {
      "text": "View Case Studies" (5-40 chars max),
      "type": "secondary",
      "action": "new_section",
      "context": { "topic": "success_stories", "related_to": "headline" }
    },
    {
      "text": "Explore [Related Topic]" (5-40 chars max),
      "type": "secondary",
      "action": "new_section",
      "context": { "topic": "..." }
    }
  ] (Always provide 2-3 CTAs with diverse actions)
}

CRITICAL CONTENT RULES:
1. ⚠️ FITS ON ONE SCREEN - All content MUST fit in 100vh without scrolling. Keep text concise! Respect character limits!
2. ANSWER THE QUESTION FULLY - Don't be vague. Provide specific mechanisms, numbers, and outcomes
3. BE CONCRETE - Use real industry data, specific percentages, timeframes, dollar amounts
4. SHOW VALUE - Every insight must connect to business impact (revenue, time, efficiency)
5. USE BEVERAGE INDUSTRY CONTEXT - Reference specific categories (spirits, beer, wine), distributor challenges, market dynamics
6. MAKE IT SCANNABLE - Each insight is self-contained, stats are large and clear
7. PROVIDE NEXT ACTIONS - 2-3 different CTAs for different user intents (demo, learn more, explore related)
8. ⚠️ RESPECT CHAR LIMITS - Going over character limits will cause UI overflow and break the page!

DESIGN SYSTEM:
Brand Colors: Copper (#AA6C39), Cyan (#00C8FF), Navy (#0A1930)
Typography: Headlines (text-5xl-7xl), Body (text-xl)
Components: Modern cards, gradients, hover effects, animations
Spacing: Generous padding (py-20), large icons (w-16), dramatic CTAs

CONTENT: Use beverage industry context, real metrics from KB, personalized to query. Include 4-5 sections: hero, features/benefits, metrics, CTA.

SCHEMA: type="${request.pageType}", title (50-100), description (150-250), sections array.
Section types: hero, feature_grid, comparison_table, cta, faq, metrics, steps.
NOTE: Do NOT use testimonial sections - BevGenie is a new product.

ICONS: Use Feather icons (lucide-react) - emojis or simple icon names like: TrendingUp, BarChart, Users, Zap, Target, CheckCircle, ArrowRight, etc.

STYLING: Gradient backgrounds, large headlines, copper/cyan colors, hover effects, animations, generous spacing.

Respond with ONLY the JSON page specification, nothing else.${retryNote}`;
}

/**
 * Build the user prompt for page generation
 * Includes specific context from the conversation and knowledge base
 */
function buildUserPrompt(request: PageGenerationRequest): string {
  const contextParts: string[] = [];

  contextParts.push(`CONTEXT:`);
  contextParts.push(`User's Question/Topic: "${request.userMessage}"`);

  // Add page interaction context if available
  if (request.pageContext) {
    contextParts.push(`\nUser Interaction Context:`);
    contextParts.push(`- Interaction Type: ${request.interactionSource || 'direct_question'}`);
    if (request.pageContext.originalQuery) {
      contextParts.push(`- Original Query: "${request.pageContext.originalQuery}"`);
    }
    if (request.pageContext.context) {
      contextParts.push(`- User Clicked On: "${request.pageContext.context}"`);
    }
    contextParts.push(`\nNote: The user is refining their query by clicking on specific page elements.`);
    contextParts.push(`Generate deeper, more specific content based on what they clicked on.`);
  }

  // Add persona context if available
  if (request.personaDescription) {
    contextParts.push(`\nUser Profile/Persona:${request.personaDescription}`);
  }

  // Add knowledge documents as internal context for LLM (not visible to end user)
  if (request.knowledgeDocuments && request.knowledgeDocuments.length > 0) {
    contextParts.push(`\n====== KB CONTEXT ======`);
    contextParts.push(`Use these industry insights to personalize your page:\n`);
    // Limit to top 3 docs and truncate to 200 chars each for speed
    request.knowledgeDocuments.slice(0, 3).forEach((doc, idx) => {
      const relevancePercent = Math.round((doc.similarity_score || 0) * 100);
      const truncatedContent = doc.content.substring(0, 200);
      contextParts.push(`[${idx + 1}] ${relevancePercent}%: ${truncatedContent}...\n`);
    });
    contextParts.push(`====== END KB ======\n`);
  }

  // Add knowledge context - reduced for speed
  if (request.knowledgeContext && request.knowledgeContext.length > 0) {
    contextParts.push(`\nINDUSTRY INSIGHTS:`);
    request.knowledgeContext.slice(0, 3).forEach((context, idx) => {
      // Truncate to 150 chars
      contextParts.push(`${idx + 1}. ${context.substring(0, 150)}...`);
    });
  }

  // Add conversation history - last 2 messages only
  if (request.conversationHistory && request.conversationHistory.length > 1) {
    const recent = request.conversationHistory.slice(-2).map((m) =>
      `${m.role}: ${m.content.substring(0, 100)}...`
    );
    contextParts.push(`\nRECENT: ${recent.join(' | ')}`);
  }

  contextParts.push(`\n\nTASK: Generate ${request.pageType} page using KB insights. 4-5 sections, beverage-specific, data-driven. Output ONLY JSON.`);

  return contextParts.join('\n');
}

/**
 * Determine if a page has likely been generated before
 * Useful for caching to avoid regenerating identical pages
 */
export function getPageCacheKey(
  userMessage: string,
  pageType: PageType,
  personaHash?: string
): string {
  const messageHash = hashString(userMessage.substring(0, 100));
  const persona = personaHash || 'default';
  return `page_${pageType}_${messageHash}_${persona}`;
}

/**
 * Simple hash function for creating cache keys
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Process a batch of user messages to generate pages for each
 * Useful for analyzing conversation patterns
 */
export async function generatePagesBatch(
  requests: PageGenerationRequest[]
): Promise<PageGenerationResponse[]> {
  return Promise.all(requests.map((req) => generatePageSpec(req)));
}

/**
 * Get a fallback text-only response if page generation fails
 * Ensures graceful degradation
 */
export function getFallbackPageContent(pageType: PageType, userMessage: string): string {
  const fallbacks: Record<PageType, string> = {
    solution_brief: "I understand your challenge. Our solution is designed to address these specific pain points in the beverage industry. Let me know if you would like more details about how we can help.",
    feature_showcase: "Great question! These features are core to our platform and help teams work more efficiently. Would you like me to walk through any specific capability in more detail?",
    case_study: "We have helped many beverage companies achieve significant results. Each implementation is tailored to their unique needs. Would you like to discuss a similar scenario?",
    comparison: "We stand out by focusing specifically on the beverage industry with purpose-built features. Let me know which aspects matter most to you, and I can provide a detailed comparison.",
    implementation_roadmap: "Most implementations follow a structured process that we can customize to your timeline. We ensure a smooth launch with proper planning and support every step of the way.",
    roi_calculator: "The financial impact depends on your specific situation. Factors like team size, current processes, and your goals all play a role. Let us discuss your scenario to build a more accurate projection.",
  };

  return fallbacks[pageType];
}

/**
 * Enhance a page specification with additional context
 * Used to personalize generated pages
 */
export function enhancePageWithContext(
  page: BevGeniePage,
  persona?: PersonaScores
): BevGeniePage {
  if (!persona) {
    return page;
  }

  // Add persona metadata if not already present
  if ('persona' in page && typeof page.persona === 'string') {
    const personaLabel = determinePrimaryPersona(persona);
    page.persona = personaLabel;
  }

  // Enhance CTA buttons based on persona focus
  if (persona.sales_focus_score > 0.7) {
    // For sales-focused users, emphasize demo/trial CTAs
    // This would require modifying the sections array
  }

  if (persona.compliance_focus_score > 0.7) {
    // For compliance-focused users, emphasize security/compliance
  }

  return page;
}

/**
 * Determine the primary persona classification
 */
function determinePrimaryPersona(persona: PersonaScores): string {
  const classifications: string[] = [];

  if (persona.supplier_score > 0.7) classifications.push('supplier');
  if (persona.distributor_score > 0.7) classifications.push('distributor');
  if (persona.craft_score > 0.7) classifications.push('craft');
  if (persona.mid_sized_score > 0.7) classifications.push('mid_sized');
  if (persona.large_score > 0.7) classifications.push('large');

  if (persona.sales_focus_score > 0.7) classifications.push('sales_focus');
  if (persona.marketing_focus_score > 0.7) classifications.push('marketing_focus');
  if (persona.compliance_focus_score > 0.7) classifications.push('compliance_focus');

  return classifications.join('_');
}

/**
 * Generate multiple page variants for A/B testing
 * Creates 2-3 variations with different messaging
 */
export async function generatePageVariants(
  baseRequest: PageGenerationRequest,
  variantCount: number = 2
): Promise<PageGenerationResponse[]> {
  const variants: PageGenerationRequest[] = [];

  for (let i = 0; i < variantCount; i++) {
    const variant = {
      ...baseRequest,
      userMessage: `${baseRequest.userMessage} (Variant ${i + 1}: Try a different approach to messaging)`,
    };
    variants.push(variant);
  }

  return generatePagesBatch(variants);
}

/**
 * Estimate the generation time for a page
 * Useful for setting expectations and managing timeouts
 */
export function estimateGenerationTime(pageType: PageType): number {
  // Rough estimates in milliseconds
  const estimates: Record<PageType, number> = {
    solution_brief: 3000,
    feature_showcase: 4000,
    case_study: 5000,
    comparison: 4500,
    implementation_roadmap: 4000,
    roi_calculator: 3500,
  };

  return estimates[pageType];
}

/**
 * Template Engine - Fast Page Generation
 *
 * Selects optimal template and fills with AI-generated content
 * Much faster than full page generation (5-8s vs 22-26s)
 */

import Anthropic from '@anthropic-ai/sdk';
import { getTemplatesForType, extractPlaceholders, TemplateVariant } from './page-templates';
import { PersonaScores } from '@/lib/session/types';
import type { KBDocument } from './page-generator';
import { getKnowledgeDocuments } from './knowledge-search';

const client = new Anthropic();

export interface TemplateSelectionResult {
  template: TemplateVariant;
  confidence: number;
  reasoning: string;
}

export interface ContentFillResult {
  success: boolean;
  filledPage: any;
  error?: string;
  generationTime: number;
}

/**
 * Select best template based on user query and intent
 * ⚡ OPTIMIZED: Uses Claude Haiku (5x faster, 10x cheaper than Sonnet)
 */
export async function selectTemplate(
  userMessage: string,
  pageType: string,
  persona: PersonaScores,
  knowledgeDocuments?: KBDocument[]
): Promise<TemplateSelectionResult> {
  const startTime = Date.now();
  const templates = getTemplatesForType(pageType);

  // Build template selection prompt
  const templateOptions = templates.map((t, idx) =>
    `${idx + 1}. ${t.name} (ID: ${t.id})
   Description: ${t.description}
   Best for queries about: ${t.bestFor.join(', ')}`
  ).join('\n\n');

  const prompt = `Select the best template for this user query:

Query: "${userMessage}"

User Context:
${persona.pain_points_detected.length > 0 ? `- Pain points: ${persona.pain_points_detected.join(', ')}` : ''}
${persona.sales_focus_score > 0.5 ? '- Sales-focused user' : ''}
${persona.marketing_focus_score > 0.5 ? '- Marketing-focused user' : ''}
${persona.compliance_focus_score > 0.5 ? '- Compliance-focused user' : ''}

Available Templates:
${templateOptions}

Respond with ONLY the template ID (e.g., "solution_brief_roi_tracking") and a one-sentence reason.
Format: TEMPLATE_ID | Reason`;

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-20250514', // ⚡ Haiku: 5x faster, 10x cheaper than Sonnet
      max_tokens: 50, // Reduced from 100 - even smaller for classification
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      // Fallback to first template
      return {
        template: templates[0],
        confidence: 0.5,
        reasoning: 'Default selection (AI response failed)',
      };
    }

    const responseText = textContent.text;
    const [templateId, ...reasonParts] = responseText.split('|').map(s => s.trim());
    const reasoning = reasonParts.join('|');

    // Find selected template
    const selectedTemplate = templates.find(t => t.id === templateId) || templates[0];

    console.log(`[Template] ⚡ Selected: ${selectedTemplate.name} in ${Date.now() - startTime}ms (Haiku)`);

    return {
      template: selectedTemplate,
      confidence: 0.9,
      reasoning: reasoning || 'Best match for query intent',
    };
  } catch (error) {
    console.error('[Template] Selection error:', error);
    // Fallback to keyword matching
    return selectTemplateByKeywords(userMessage, templates);
  }
}

/**
 * Fallback: Select template by keyword matching
 */
function selectTemplateByKeywords(
  userMessage: string,
  templates: TemplateVariant[]
): TemplateSelectionResult {
  const messageLower = userMessage.toLowerCase();
  let bestMatch = templates[0];
  let bestScore = 0;

  templates.forEach(template => {
    const score = template.bestFor.filter(keyword =>
      messageLower.includes(keyword.toLowerCase())
    ).length;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = template;
    }
  });

  return {
    template: bestMatch,
    confidence: bestScore > 0 ? 0.7 : 0.5,
    reasoning: `Keyword matching (${bestScore} matches)`,
  };
}

/**
 * Fill template with AI-generated content
 * Uses focused prompt for faster generation
 */
export async function fillTemplateContent(
  template: TemplateVariant,
  userMessage: string,
  persona: PersonaScores,
  knowledgeDocuments?: KBDocument[]
): Promise<ContentFillResult> {
  const startTime = Date.now();
  const placeholders = extractPlaceholders(template);

  // Build KB context summary with MORE context
  const kbSummary = knowledgeDocuments
    ?.slice(0, 5)  // Use more documents (was 2)
    .map(doc => doc.content.substring(0, 300))  // Longer excerpts (was 150)
    .join('\n---\n') || '';

  // Enhanced prompt for diverse, detailed content with UI guidelines
  const prompt = `Fill these content placeholders for a beverage industry solution page with DIVERSE, SPECIFIC content:

User Query: "${userMessage}"
Template: ${template.name}
User Focus: ${persona.pain_points_detected.join(', ') || 'general'}

Knowledge Base Context:
${kbSummary}

Required placeholders to fill:
${placeholders.map(p => `- {{${p}}}`).join('\n')}

CRITICAL Instructions:
1. Generate UNIQUE, VARIED content for each placeholder - NO REPETITION
2. Use SPECIFIC beverage industry data: brands, distributors, metrics, regions
3. Reference real beverage concepts: depletions, on-premise, off-premise, DSD, SKUs
4. Include CONCRETE numbers and percentages where appropriate
5. Make insights ACTIONABLE with clear next steps
6. Vary language and structure across different placeholders
7. Use data from KB context when available
8. Each stat should have DIFFERENT metrics (don't repeat "increase sales" 3 times)
9. Keep descriptions detailed but scannable (2-3 sentences max)

HEADLINE GUIDELINES:
- Keep headlines punchy and benefit-driven (max 8 words)
- Make subtitles concise and specific (1-2 lines)
- Use powerful action verbs (Identify, Uncover, Transform, Maximize)

STAT GUIDELINES:
- Use varied metrics: percentages, dollar amounts, time savings, counts
- Make stat labels specific and different from each other
- Keep descriptions brief (1 line max)

CTA GUIDELINES:
- Make CTAs specific and benefit-driven (not generic)
- Examples: "See Hidden Revenue Opportunities", "Identify Whitespace in 5 Minutes"
- Avoid: "Learn More", "Get Started" (too generic)

Example GOOD response with VARIETY:
{
  "stat1_value": "47%",
  "stat1_label": "Faster SKU Velocity Detection",
  "stat2_value": "$2.3M",
  "stat2_label": "Average Annual ROI",
  "stat3_value": "18 Days",
  "stat3_label": "Reduced Time-to-Market"
}

Example BAD response (too repetitive):
{
  "stat1_label": "Increase Sales",
  "stat2_label": "Boost Revenue",  ❌ Too similar!
  "stat3_label": "Improve Sales"   ❌ Too similar!
}

Respond with ONLY a JSON object:
{
  "placeholder_name": "filled value",
  ...
}`;

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2500, // Increased for more detailed content (was 1500)
      system: [
        {
          type: 'text',
          text: 'You are an expert beverage industry content generator. Create DIVERSE, SPECIFIC, non-repetitive content. Each piece of content must be unique. Output only valid JSON.',
          cache_control: { type: 'ephemeral' },
        }
      ],
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Extract JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const contentMap = JSON.parse(jsonMatch[0]);

    // Fill template with generated content
    const filledPage = fillPlaceholders(template, contentMap);

    console.log(`[Template] Content filled in ${Date.now() - startTime}ms`);

    return {
      success: true,
      filledPage,
      generationTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error('[Template] Content fill error:', error);
    return {
      success: false,
      filledPage: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      generationTime: Date.now() - startTime,
    };
  }
}

/**
 * Fill template with AI-generated content using STREAMING
 * ⚡ Provides instant feedback to users as content generates
 *
 * @param template - Template to fill
 * @param userMessage - User's query
 * @param persona - User persona
 * @param knowledgeDocuments - KB context
 * @param onChunk - Callback for each chunk of content (partial updates)
 * @returns Final filled content
 */
export async function fillTemplateContentStreaming(
  template: TemplateVariant,
  userMessage: string,
  persona: PersonaScores,
  knowledgeDocuments?: KBDocument[],
  onChunk?: (partialPage: any, accumulated: string) => void
): Promise<ContentFillResult> {
  const startTime = Date.now();
  const placeholders = extractPlaceholders(template);

  // Build KB context summary
  const kbSummary = knowledgeDocuments
    ?.slice(0, 3)  // Reduced from 5 for faster processing
    .map(doc => doc.content.substring(0, 200))  // Reduced from 300
    .join('\n---\n') || '';

  // Shorter prompt for faster streaming with UI guidelines
  const prompt = `Fill content placeholders for beverage industry solution page with UNIQUE, SPECIFIC content:

User Query: "${userMessage}"
Template: ${template.name}
Focus: ${persona.pain_points_detected.join(', ') || 'general'}

KB Context:
${kbSummary}

Placeholders: ${placeholders.slice(0, 15).join(', ')}

Rules:
1. UNIQUE content for each placeholder
2. SPECIFIC beverage industry data
3. CONCRETE numbers and percentages
4. NO REPETITION
5. Headlines: Punchy, max 8 words, benefit-driven
6. Subtitles: Concise, 1-2 lines, specific
7. Stats: Varied metrics (%, $, days, counts)
8. CTAs: Specific benefits (not "Learn More")

Output ONLY JSON:
{
  "placeholder_name": "value",
  ...
}`;

  try {
    let accumulated = '';
    let lastValidJson: any = null;

    // Start streaming
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000, // Reduced from 2500
      system: [
        {
          type: 'text',
          text: 'Expert beverage content generator. Output concise, specific JSON. NO explanations.',
          cache_control: { type: 'ephemeral' },
        }
      ],
      messages: [{ role: 'user', content: prompt }],
    });

    // Process stream chunks
    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        accumulated += chunk.delta.text;

        // Try parsing partial JSON
        try {
          // Extract JSON if it's embedded in text
          const jsonMatch = accumulated.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const partialContent = JSON.parse(jsonMatch[0]);
            lastValidJson = partialContent;

            // Send partial update to callback
            if (onChunk) {
              try {
                const partialPage = fillPlaceholders(template, partialContent);
                onChunk(partialPage, accumulated);
              } catch (e) {
                // Ignore parsing errors for partial content
              }
            }
          }
        } catch {
          // Not valid JSON yet, continue accumulating
        }
      }
    }

    // Final processing
    const jsonMatch = accumulated.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const contentMap = JSON.parse(jsonMatch[0]);
    const filledPage = fillPlaceholders(template, contentMap);

    console.log(`[Template] Content streamed in ${Date.now() - startTime}ms`);

    return {
      success: true,
      filledPage,
      generationTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error('[Template] Streaming error:', error);
    return {
      success: false,
      filledPage: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      generationTime: Date.now() - startTime,
    };
  }
}

/**
 * Replace placeholders in template with actual content
 */
function fillPlaceholders(template: TemplateVariant, contentMap: Record<string, string>): any {
  const templateStr = JSON.stringify(template);
  let filledStr = templateStr;

  // Replace all {{placeholder}} with actual values
  Object.entries(contentMap).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    // Escape special chars in value for JSON
    const escapedValue = JSON.stringify(value).slice(1, -1);
    filledStr = filledStr.split(placeholder).join(escapedValue);
  });

  // Remove any remaining unfilled placeholders
  filledStr = filledStr.replace(/\{\{[^}]+\}\}/g, '[Content]');

  const filled = JSON.parse(filledStr);

  // FIX: Convert insights from string[] to Array<{ text: string }>
  if (filled.structure?.sections) {
    filled.structure.sections = filled.structure.sections.map((section: any) => {
      if (section.insights && Array.isArray(section.insights)) {
        section.insights = section.insights.map((insight: any) => {
          // If insight is already an object with text property, keep it
          if (typeof insight === 'object' && insight.text) {
            return insight;
          }
          // If insight is a string, wrap it in an object
          if (typeof insight === 'string') {
            return { text: insight };
          }
          // Fallback
          return { text: String(insight) };
        });
      }
      return section;
    });
  }

  // Convert to BevGeniePage format
  return {
    type: 'solution_brief',
    title: filled.structure.sections[0].headline,
    description: filled.structure.sections[0].subtitle,
    sections: filled.structure.sections,
  };
}

/**
 * Main entry point: Select template and fill content
 * Much faster than full generation!
 * ⚡ OPTIMIZED: Runs template selection and KB search in parallel
 */
export async function generateFromTemplate(
  userMessage: string,
  pageType: string,
  persona: PersonaScores,
  knowledgeDocuments?: KBDocument[]
): Promise<ContentFillResult> {
  const totalStart = Date.now();

  // ⚡ OPTIMIZATION: Run template selection and KB search in parallel
  const [selection, kbDocs] = await Promise.all([
    selectTemplate(userMessage, pageType, persona, knowledgeDocuments),
    knowledgeDocuments
      ? Promise.resolve(knowledgeDocuments)
      : getKnowledgeDocuments(userMessage, [], [], 3).catch(err => {
          console.error('[Template] KB search error:', err);
          return []; // Fallback to empty array on error
        })
  ]);

  console.log(`[Template] Selected: ${selection.template.name} - ${selection.reasoning}`);
  console.log(`[Template] KB docs retrieved: ${kbDocs.length}`);

  // Step 2: Fill content with KB docs
  const result = await fillTemplateContent(
    selection.template,
    userMessage,
    persona,
    kbDocs
  );

  const totalTime = Date.now() - totalStart;
  console.log(`[Template] Total generation: ${totalTime}ms (⚡ parallelized)`);

  return {
    ...result,
    generationTime: totalTime,
  };
}

/**
 * Streaming version: Select template and fill content with real-time updates
 * ⚡ OPTIMIZED: Parallel operations + streaming for instant user feedback
 *
 * @param userMessage - User's query
 * @param pageType - Type of page to generate
 * @param persona - User persona
 * @param knowledgeDocuments - Optional KB documents (if not provided, will fetch in parallel)
 * @param onChunk - Callback for streaming updates
 * @returns Final filled content
 */
export async function generateFromTemplateStreaming(
  userMessage: string,
  pageType: string,
  persona: PersonaScores,
  knowledgeDocuments?: KBDocument[],
  onChunk?: (partialPage: any, accumulated: string) => void
): Promise<ContentFillResult> {
  const totalStart = Date.now();

  // ⚡ OPTIMIZATION: Run template selection and KB search in parallel
  const [selection, kbDocs] = await Promise.all([
    selectTemplate(userMessage, pageType, persona, knowledgeDocuments),
    knowledgeDocuments
      ? Promise.resolve(knowledgeDocuments)
      : getKnowledgeDocuments(userMessage, [], [], 3).catch(err => {
          console.error('[Template] KB search error:', err);
          return [];
        })
  ]);

  console.log(`[Template] Selected: ${selection.template.name} - ${selection.reasoning}`);
  console.log(`[Template] KB docs retrieved: ${kbDocs.length}`);

  // Step 2: Stream content generation with KB docs
  const result = await fillTemplateContentStreaming(
    selection.template,
    userMessage,
    persona,
    kbDocs,
    onChunk
  );

  const totalTime = Date.now() - totalStart;
  console.log(`[Template] Total streaming generation: ${totalTime}ms (⚡ parallelized + streaming)`);

  return {
    ...result,
    generationTime: totalTime,
  };
}

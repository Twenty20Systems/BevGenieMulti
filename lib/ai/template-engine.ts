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
 * Uses lightweight AI call (Sonnet 4.5, 500 tokens)
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
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 100, // Very small - just need template ID
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

    console.log(`[Template] Selected: ${selectedTemplate.name} in ${Date.now() - startTime}ms`);

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

  // Enhanced prompt for diverse, detailed content
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
 */
export async function generateFromTemplate(
  userMessage: string,
  pageType: string,
  persona: PersonaScores,
  knowledgeDocuments?: KBDocument[]
): Promise<ContentFillResult> {
  const totalStart = Date.now();

  // Step 1: Select template (1-2s)
  const selection = await selectTemplate(userMessage, pageType, persona, knowledgeDocuments);
  console.log(`[Template] Selected: ${selection.template.name} - ${selection.reasoning}`);

  // Step 2: Fill content (4-6s)
  const result = await fillTemplateContent(
    selection.template,
    userMessage,
    persona,
    knowledgeDocuments
  );

  const totalTime = Date.now() - totalStart;
  console.log(`[Template] Total generation: ${totalTime}ms`);

  return {
    ...result,
    generationTime: totalTime,
  };
}

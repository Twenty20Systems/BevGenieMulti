/**
 * AI Orchestrator
 *
 * Coordinates all AI operations:
 * - Chat message processing
 * - Persona detection
 * - Knowledge base search
 * - LLM prompting
 * - Response generation
 *
 * This is the main orchestration layer that brings together
 * embeddings, persona detection, knowledge search, and LLM prompting
 */

import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat';

import type { PersonaScores, PainPointType } from '@/lib/session/types';
import { detectPersonaSignals, updatePersonaWithSignals, getPrimaryPersonaClass } from './persona-detection';
import { searchKnowledgeBase, getContextForLLM, getPainPointDocuments } from './knowledge-search';
import { getPersonalizedSystemPrompt, formatKnowledgeContext, PAIN_POINT_PROMPTS } from './prompts/system';
import { recordPersonaSignal, updatePersona, addConversationMessage } from '@/lib/session/session';
import { classifyMessageIntent } from './intent-classification';
import { generatePageSpec } from './page-generator';
import type { BevGeniePage } from './page-specs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatRequest {
  message: string;
  sessionId: string;
  persona: PersonaScores;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface ChatResponse {
  message: string;
  personaUpdated: Partial<PersonaScores>;
  signalsDetected: string[];
  knowledgeUsed: number;
  generationMode: 'fresh' | 'returning' | 'data_connected';
  generatedPage?: {
    page: BevGeniePage;
    intent: string;
    intentConfidence: number;
  };
}

/**
 * Process a chat message end-to-end
 *
 * This is the main entry point for processing user messages in the chat
 *
 * @param request - Chat request with message, session, and context
 * @returns Chat response with AI message and updates
 *
 * @example
 * ```typescript
 * const response = await processChat({
 *   message: 'How can you help our sales team?',
 *   sessionId: 'session-123',
 *   persona: currentPersona,
 *   conversationHistory: [...],
 * });
 * ```
 */
export async function processChat(request: ChatRequest): Promise<ChatResponse> {
  const { message, sessionId, persona, conversationHistory } = request;

  // Step 1: Detect signals from user message
  const signals = detectPersonaSignals(message, persona);

  // Step 2: Update persona with new signals
  let updatedPersona = persona;
  const signalDescriptions: string[] = [];

  for (const signal of signals) {
    signalDescriptions.push(`${signal.type}/${signal.category}: ${signal.strength}`);

    // Record signal to database
    try {
      await recordPersonaSignal(
        signal.type === 'pain_point' ? 'pain_point_mention' : signal.type,
        signal.evidence,
        signal.strength,
        signal.type === 'pain_point' ? ([signal.category] as PainPointType[]) : undefined,
        {}
      );
    } catch (error) {
      console.error('Error recording signal:', error);
    }
  }

  // Apply signal updates to persona
  updatedPersona = updatePersonaWithSignals(persona, signals);

  // Step 3: Search knowledge base for context
  const knowledgeContext = await getContextForLLM(message, updatedPersona, 5);

  // Step 4: Build system prompt with persona context
  const systemPrompt = getPersonalizedSystemPrompt(
    updatedPersona,
    knowledgeContext ? `\n## Background Context:\n${knowledgeContext}` : ''
  );

  // Step 5: Add pain point specific guidance if needed
  let enhancedSystemPrompt = systemPrompt;
  if (updatedPersona.pain_points_detected.length > 0) {
    const topPainPoint = updatedPersona.pain_points_detected[0];
    if (PAIN_POINT_PROMPTS[topPainPoint]) {
      enhancedSystemPrompt += `\n\n${PAIN_POINT_PROMPTS[topPainPoint]}`;
    }
  }

  // Step 6: Call LLM for response
  const messages: ChatCompletionMessageParam[] = [
    ...conversationHistory.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: message,
    },
  ];

  let aiResponse = '';

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: enhancedSystemPrompt,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    aiResponse = completion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    aiResponse =
      "I apologize, but I'm having trouble processing your message. Could you try again?";
  }

  // Step 7: Save to conversation history
  try {
    await addConversationMessage('user', message, 'fresh');
    await addConversationMessage('assistant', aiResponse, 'fresh');
  } catch (error) {
    console.error('Error saving conversation:', error);
  }

  // Step 8: Determine generation mode
  const generationMode = determineGenerationMode(updatedPersona, conversationHistory.length);

  // Step 9: ALWAYS attempt dynamic page generation for every message
  // Generate pages for every question - this is the core Phase 3 feature
  let generatedPage: ChatResponse['generatedPage'];
  try {
    const intentAnalysis = classifyMessageIntent(
      message,
      conversationHistory.length,
      updatedPersona
    );

    // ALWAYS generate a page - determine best page type from intent
    let pageType = intentAnalysis.suggestedPageType;

    // If no specific page type detected, use default based on persona
    if (!pageType) {
      if (updatedPersona.sales_focus_score > 0.5) {
        pageType = 'solution_brief';
      } else if (updatedPersona.marketing_focus_score > 0.5) {
        pageType = 'feature_showcase';
      } else {
        pageType = 'solution_brief'; // Default
      }
    }

    // Get knowledge context for page generation
    const pageKnowledgeContext = knowledgeContext ?
      knowledgeContext.split('\n').filter((line) => line.trim().length > 0) :
      [];

    console.log(`[Page Generation] Intent: ${intentAnalysis.intent}, Type: ${pageType}, Confidence: ${intentAnalysis.confidence}`);

    // Generate the page specification - always attempt this
    const pageGenResult = await generatePageSpec({
      userMessage: message,
      pageType: pageType as any,
      persona: updatedPersona,
      knowledgeContext: pageKnowledgeContext,
      conversationHistory: conversationHistory.slice(-3), // Last 3 messages for context
      personaDescription: getPersonaDescription(updatedPersona),
    });

    if (pageGenResult.success && pageGenResult.page) {
      console.log(`[Page Generation] SUCCESS - Page generated in ${pageGenResult.generationTime}ms`);
      generatedPage = {
        page: pageGenResult.page,
        intent: intentAnalysis.intent,
        intentConfidence: intentAnalysis.confidence,
      };
    } else {
      console.log(`[Page Generation] FAILED - ${pageGenResult.error}`);
    }
  } catch (error) {
    console.error('Error generating dynamic page:', error);
    // Gracefully degrade - page generation failure doesn't stop chat
  }

  return {
    message: aiResponse,
    personaUpdated: updatedPersona,
    signalsDetected: signalDescriptions,
    knowledgeUsed: knowledgeContext ? knowledgeContext.split('\n').length : 0,
    generationMode,
    generatedPage,
  };
}

/**
 * Determine UI generation mode based on conversation state
 *
 * - 'fresh': First time/early conversation, basic UI
 * - 'returning': Persona detected with confidence > 0.5, personalized UI
 * - 'data_connected': User has provided specific data, advanced UI
 *
 * @param persona - Current persona state
 * @param messageCount - Number of messages in conversation
 * @returns Generation mode
 */
function determineGenerationMode(
  persona: PersonaScores,
  messageCount: number
): 'fresh' | 'returning' | 'data_connected' {
  // Data connected mode if specific data provided
  if (messageCount > 5 && persona.pain_points_detected.length >= 2) {
    return 'data_connected';
  }

  // Returning mode if good persona confidence
  if (persona.overall_confidence > 0.5 && messageCount > 2) {
    return 'returning';
  }

  // Fresh mode by default
  return 'fresh';
}

/**
 * Generate a brochure for the current persona
 *
 * Creates a customized brochure based on detected persona
 * and pain points
 *
 * @param persona - Detected persona
 * @param conversationMessages - Conversation history for context
 * @returns Formatted brochure content
 */
export async function generateBrochure(
  persona: PersonaScores,
  conversationMessages: string[]
): Promise<{
  title: string;
  sections: Array<{ heading: string; content: string }>;
  painPointsAddressed: PainPointType[];
}> {
  const personaClass = getPrimaryPersonaClass(persona);

  // Get pain point documents
  const painPointDocs = await getPainPointDocuments(
    personaClass.topPainPoints,
    3
  );

  // Build brochure sections
  const sections: Array<{ heading: string; content: string }> = [];

  // Title
  let title = 'Your Personalized BevGenie Solution';
  if (personaClass.userType === 'supplier') {
    title += ' for Beverage Producers';
  } else {
    title += ' for Distributors';
  }

  // Add sections for each pain point
  for (const painPoint of personaClass.topPainPoints) {
    const docs = painPointDocs[painPoint] || [];
    const content = docs.map((doc) => doc.content).join('\n\n');

    sections.push({
      heading: painPoint.replace(/_/g, ' ').toUpperCase(),
      content: content || `Solutions for ${painPoint.replace(/_/g, ' ')}`,
    });
  }

  // If no pain points detected, add generic sections
  if (sections.length === 0) {
    sections.push({
      heading: 'How We Can Help',
      content: `Based on your profile as a ${personaClass.userType} focused on ${personaClass.primaryFocus}, we offer solutions tailored to your industry challenges.`,
    });

    if (personaClass.userType === 'supplier') {
      sections.push({
        heading: 'For Beverage Producers',
        content: 'We help producers like you optimize sales effectiveness, measure field ROI, and position your brand in competitive markets.',
      });
    }
  }

  return {
    title,
    sections,
    painPointsAddressed: personaClass.topPainPoints,
  };
}

/**
 * Get conversation summary for context
 *
 * Summarizes recent conversation for use in prompts
 *
 * @param messages - Conversation history
 * @param maxMessages - Number of recent messages to include
 * @returns Formatted conversation summary
 */
export function getConversationSummary(
  messages: Array<{ role: string; content: string }>,
  maxMessages: number = 5
): string {
  const recent = messages.slice(-maxMessages);

  return recent
    .map((msg) => {
      const speaker = msg.role === 'user' ? 'You' : 'Assistant';
      return `${speaker}: ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`;
    })
    .join('\n');
}

/**
 * Validate OpenAI configuration
 *
 * Checks that required environment variables are set
 *
 * @throws Error if configuration is invalid
 */
export function validateAIConfiguration(): void {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  if (process.env.OPENAI_API_KEY.length < 20) {
    throw new Error('OPENAI_API_KEY appears to be invalid');
  }
}

/**
 * Get AI usage statistics
 *
 * Returns stats about API usage (for monitoring)
 *
 * @returns Usage statistics object
 */
export function getAIUsageStats(): {
  modelsSupported: string[];
  embeddingModel: string;
  chatModel: string;
  features: string[];
} {
  return {
    modelsSupported: ['text-embedding-3-small', 'gpt-4o'],
    embeddingModel: 'text-embedding-3-small',
    chatModel: 'gpt-4o',
    features: [
      'Persona detection',
      'Knowledge search',
      'Context-aware responses',
      'Pain point identification',
      'Brochure generation',
      'Dynamic page generation',
    ],
  };
}

/**
 * Generate human-readable persona description for page generation context
 *
 * Creates a natural language description of the detected persona
 * to help the page generator tailor content appropriately
 *
 * @param persona - Detected persona scores
 * @returns Formatted persona description
 */
function getPersonaDescription(persona: PersonaScores): string {
  const descriptions: string[] = [];

  // Company type
  if (persona.supplier_score > 0.6) {
    descriptions.push('as a beverage producer/supplier');
  }
  if (persona.distributor_score > 0.6) {
    descriptions.push('as a distributor');
  }

  // Company size
  if (persona.craft_score > 0.6) {
    descriptions.push('in the craft beverage segment');
  }
  if (persona.mid_sized_score > 0.6) {
    descriptions.push('as a mid-sized company');
  }
  if (persona.large_score > 0.6) {
    descriptions.push('as an enterprise');
  }

  // Focus area
  if (persona.sales_focus_score > 0.6) {
    descriptions.push('with a focus on sales effectiveness');
  }
  if (persona.marketing_focus_score > 0.6) {
    descriptions.push('prioritizing marketing and brand positioning');
  }
  if (persona.operations_focus_score > 0.6) {
    descriptions.push('focused on operational efficiency');
  }
  if (persona.compliance_focus_score > 0.6) {
    descriptions.push('concerned with compliance and regulations');
  }

  // Pain points
  let painPointText = '';
  if (persona.pain_points_detected.length > 0) {
    painPointText = `Their key challenges include ${persona.pain_points_detected.slice(0, 2).join(' and ')}.`;
  }

  const personaText = descriptions.length > 0 ?
    `The user is ${descriptions.join(', ')}.` :
    'The user is a beverage industry professional.';

  return `${personaText} ${painPointText}`;
}

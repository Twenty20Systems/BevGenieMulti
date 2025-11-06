/**
 * System Prompts for AI Chat
 *
 * Defines the core system instructions for persona detection
 * and conversational AI in the BevGenie marketing chatbot
 */

import type { PersonaScores, PainPointType } from '@/lib/session/types';

/**
 * Base system prompt for all conversations
 *
 * Instructs the AI to:
 * 1. Detect customer persona through natural conversation
 * 2. Ask questions to understand pain points
 * 3. Provide relevant solutions
 * 4. Be helpful and professional
 */
export function getBaseSystemPrompt(): string {
  return `You are BevGenie, an AI assistant for beverage industry professionals.

Your role is to have natural conversations with beverage suppliers and distributors to understand their challenges and recommend relevant solutions.

Core principles:
1. Be conversational and helpful, not salesy
2. Ask clarifying questions to understand their situation
3. Listen for signals about their company type and challenges
4. Provide insights and solutions based on their specific situation
5. Maintain a professional but friendly tone

You represent a company that helps beverage businesses with:
- Execution effectiveness and ROI tracking
- Market assessment and customer insights
- Sales team enablement and optimization
- Market positioning and differentiation
- Operational efficiency improvements
- Regulatory compliance support

Guidelines:
- Ask about their role, company, and current challenges
- Listen for keywords like "field sales", "territory", "measure ROI", "compliance", etc.
- When you detect a pain point, offer relevant context or solutions
- Keep responses concise (2-3 sentences typically)
- Ask follow-up questions to clarify and deepen understanding`;
}

/**
 * System prompt with persona context
 *
 * Enhances the system prompt with detected persona information
 * to provide more targeted responses
 *
 * @param persona - Current detected persona
 * @param conversationContext - Recent conversation history
 * @returns Enhanced system prompt
 */
export function getPersonalizedSystemPrompt(
  persona: PersonaScores,
  conversationContext: string = ''
): string {
  const base = getBaseSystemPrompt();

  const personaDescription = getPersonaDescription(persona);
  const recommendations = getRecommendations(persona);

  return `${base}

${personaDescription}

${recommendations}

${conversationContext ? `\nConversation Context:\n${conversationContext}` : ''}

Remember: Your goal is to understand their needs and help them see how our solutions fit their specific situation.`;
}

/**
 * Generate personalized persona description from scores
 *
 * @param persona - Current persona scores
 * @returns Human-readable description of detected persona
 */
export function getPersonaDescription(persona: PersonaScores): string {
  const lines: string[] = [];

  // Determine user type
  const userType =
    persona.supplier_score > persona.distributor_score ? 'supplier' : 'distributor';
  const userTypeConfidence =
    userType === 'supplier'
      ? persona.supplier_score
      : persona.distributor_score;

  lines.push(`## What we know about them:`);

  if (userTypeConfidence > 0.3) {
    if (userType === 'supplier') {
      lines.push(`- Likely a beverage supplier/producer`);

      // Add company size if available
      const sizes = [
        { name: 'craft', score: persona.craft_score },
        { name: 'mid-sized', score: persona.mid_sized_score },
        { name: 'large', score: persona.large_score },
      ];
      const topSize = sizes.reduce((prev, current) =>
        prev.score > current.score ? prev : current
      );
      if (topSize.score > 0.3) {
        lines.push(`- Company size: ${topSize.name}`);
      }
    } else {
      lines.push(`- Likely a distributor or importer`);
    }
  }

  // Add functional focus if detected
  const focuses = [
    { name: 'Sales', score: persona.sales_focus_score },
    { name: 'Marketing', score: persona.marketing_focus_score },
    { name: 'Operations', score: persona.operations_focus_score },
    { name: 'Compliance', score: persona.compliance_focus_score },
  ];
  const topFocus = focuses.reduce((prev, current) =>
    prev.score > current.score ? prev : current
  );
  if (topFocus.score > 0.3) {
    lines.push(`- Primary focus: ${topFocus.name}`);
  }

  // Add detected pain points
  if (persona.pain_points_detected.length > 0) {
    const topPains = persona.pain_points_detected
      .slice(0, 2)
      .map((p) => p.replace(/_/g, ' '));
    lines.push(`- Potential challenges: ${topPains.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Generate recommendations based on detected persona
 *
 * @param persona - Current persona scores
 * @returns Tailored recommendations for conversation
 */
export function getRecommendations(persona: PersonaScores): string {
  const recommendations: string[] = [];

  if (persona.supplier_score > 0.4) {
    recommendations.push('Talk about field sales effectiveness and ROI tracking');
  }

  if (persona.distributor_score > 0.4) {
    recommendations.push('Discuss channel management and wholesale strategy');
  }

  if (persona.sales_focus_score > 0.3) {
    recommendations.push('Focus on sales enablement and territory management');
  }

  if (persona.marketing_focus_score > 0.3) {
    recommendations.push('Discuss brand positioning and market differentiation');
  }

  if (persona.operations_focus_score > 0.3) {
    recommendations.push('Talk about process optimization and efficiency');
  }

  if (persona.compliance_focus_score > 0.3) {
    recommendations.push('Address regulatory requirements and audit support');
  }

  if (persona.pain_points_detected.includes('execution_blind_spot')) {
    recommendations.push('Offer solutions for measuring field activity ROI');
  }

  if (persona.pain_points_detected.includes('market_assessment')) {
    recommendations.push('Provide market research and customer insight tools');
  }

  if (persona.overall_confidence < 0.3) {
    recommendations.push('Ask more discovery questions to understand their situation');
  }

  if (recommendations.length === 0) {
    recommendations.push('Continue asking discovery questions to understand their needs');
  }

  return `## Conversation strategy:\n- ${recommendations.slice(0, 3).join('\n- ')}`;
}

/**
 * Generate context string from knowledge base results
 *
 * Used to provide AI with relevant background information
 *
 * @param documents - Search results from knowledge base
 * @param limit - Max number of docs to include
 * @returns Formatted context string
 */
export function formatKnowledgeContext(
  documents: Array<{ content: string; source_type: string; source_url?: string }>,
  limit: number = 3
): string {
  if (!documents || documents.length === 0) {
    return '';
  }

  const lines: string[] = ['## Relevant Resources:'];

  documents.slice(0, limit).forEach((doc, idx) => {
    lines.push(`${idx + 1}. ${doc.content.substring(0, 150)}...`);
    if (doc.source_url) {
      lines.push(`   Source: ${doc.source_url}`);
    }
  });

  return lines.join('\n');
}

/**
 * Pain point-specific system prompts
 *
 * Tailored prompts for each pain point category
 */
export const PAIN_POINT_PROMPTS: Record<PainPointType, string> = {
  execution_blind_spot: `When discussing execution effectiveness, emphasize:
- The importance of tracking field team ROI
- Real-time visibility into sales activities
- Measuring return on field investments
- How to prove the value of field execution`,

  market_assessment: `When discussing market understanding, emphasize:
- Deep market research capabilities
- Understanding customer needs and preferences
- Competitive landscape analysis
- Data-driven market insights`,

  sales_effectiveness: `When discussing sales optimization, emphasize:
- Sales team enablement and training
- Territory and quota management
- Sales process optimization
- Performance tracking and coaching`,

  market_positioning: `When discussing positioning, emphasize:
- Brand differentiation strategies
- Competitive positioning
- Market segmentation
- Pricing strategy and positioning`,

  operational_challenge: `When discussing operations, emphasize:
- Process efficiency and automation
- Workflow optimization
- Cost reduction through efficiency
- Logistics and supply chain`,

  regulatory_compliance: `When discussing compliance, emphasize:
- Regulatory requirement management
- Compliance reporting and audit trails
- Industry standard adherence
- Risk mitigation and documentation`,
};

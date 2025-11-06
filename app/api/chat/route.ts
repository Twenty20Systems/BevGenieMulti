/**
 * Chat API Endpoint
 *
 * POST /api/chat
 *
 * Handles incoming chat messages and returns AI responses
 * Manages session state and persona detection
 */

import { NextRequest, NextResponse } from 'next/server';

import { getSession, updatePersona, addConversationMessage, getConversationHistory } from '@/lib/session/session';
import { processChat } from '@/lib/ai/orchestrator';
import { validateAIConfiguration } from '@/lib/ai/orchestrator';

/**
 * POST /api/chat
 *
 * Request body:
 * ```json
 * {
 *   "message": "How can you help our sales team?"
 * }
 * ```
 *
 * Response:
 * ```json
 * {
 *   "success": true,
 *   "message": "AI response text...",
 *   "session": {
 *     "sessionId": "uuid",
 *     "persona": { ... },
 *     "messageCount": 2
 *   },
 *   "signals": ["user_type/supplier", "pain_point/sales_effectiveness"],
 *   "generationMode": "fresh"
 * }
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    // Validate AI configuration
    validateAIConfiguration();

    // Parse request body
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    // Get or create session
    const session = await getSession();

    if (!session.user) {
      return NextResponse.json(
        { error: 'Failed to initialize session' },
        { status: 500 }
      );
    }

    // Get conversation history
    const conversationHistory = await getConversationHistory();

    // Prepare chat request
    const chatRequest = {
      message: message.trim(),
      sessionId: session.user.sessionId,
      persona: session.user.persona,
      conversationHistory: conversationHistory.map((msg: any) => ({
        role: msg.message_role,
        content: msg.message_content,
      })),
    };

    // Process chat with AI orchestrator
    const chatResponse = await processChat(chatRequest);

    // Update persona in session
    await updatePersona(chatResponse.personaUpdated);

    console.log(`[Chat API] Generated page: ${!!chatResponse.generatedPage}`);
    if (chatResponse.generatedPage) {
      console.log(`[Chat API] Page type: ${chatResponse.generatedPage.intent}, Confidence: ${chatResponse.generatedPage.intentConfidence}`);
    }

    // Return response
    const response: any = {
      success: true,
      message: chatResponse.message,
      session: {
        sessionId: session.user.sessionId,
        persona: chatResponse.personaUpdated,
        messageCount: session.user.messageCount + 1,
      },
      signals: chatResponse.signalsDetected,
      generationMode: chatResponse.generationMode,
      knowledgeDocuments: chatResponse.knowledgeUsed,
    };

    // Include generated page if one was created - ALWAYS try to include
    if (chatResponse.generatedPage) {
      console.log(`[Chat API] Including page in response`);
      response.generatedPage = chatResponse.generatedPage;
    } else {
      console.log(`[Chat API] No page to include - page generation may have failed`);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in chat API:', error);

    // Differentiate between known errors and unexpected errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process chat message', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat
 *
 * Returns current chat session info (for debugging/UI)
 *
 * Response:
 * ```json
 * {
 *   "sessionId": "uuid",
 *   "messageCount": 0,
 *   "persona": { ... },
 *   "messages": []
 * }
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.user) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 404 }
      );
    }

    const conversationHistory = await getConversationHistory();

    return NextResponse.json({
      sessionId: session.user.sessionId,
      messageCount: session.user.messageCount,
      persona: session.user.persona,
      currentMode: session.user.currentMode,
      messages: conversationHistory.map((msg: any) => ({
        role: msg.message_role,
        content: msg.message_content,
        createdAt: msg.created_at,
      })),
      hasPersonaDetected: session.user.persona.overall_confidence > 0.3,
    });
  } catch (error) {
    console.error('Error in GET /api/chat:', error);

    return NextResponse.json(
      { error: 'Failed to retrieve chat session' },
      { status: 500 }
    );
  }
}

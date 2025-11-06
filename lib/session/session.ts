/**
 * Session Utilities & Helpers
 *
 * Provides high-level functions for session management:
 * - Getting/setting session data
 * - Updating persona scores
 * - Recording persona signals
 * - Session cleanup
 *
 * Used in API routes and middleware
 */

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

import { supabaseAdmin } from '@/lib/supabase/client';
import { sessionConfig } from './config';
import {
  IronSessionData,
  SessionData,
  PersonaScores,
  PainPointType,
  SESSION_CONFIG,
  DEFAULT_PERSONA_SCORES,
} from './types';

/**
 * Get or create session from request cookies
 *
 * This is the primary entry point for session access in API routes
 *
 * @returns IronSessionData object with session data
 *
 * @example
 * ```typescript
 * const session = await getSession();
 * console.log(session.user?.sessionId);
 * ```
 */
export async function getSession(): Promise<IronSessionData> {
  const cookieStore = await cookies();
  const session = await getIronSession<IronSessionData>(cookieStore, sessionConfig);

  // If no existing session, create a new one
  if (!session.user) {
    session.user = {
      sessionId: uuidv4(),
      createdAt: Date.now(),
      lastActivityAt: Date.now(),
      persona: { ...DEFAULT_PERSONA_SCORES },
      messageCount: 0,
      currentMode: 'fresh',
      hasCompletedOnboarding: false,
      hasBrochure: false,
      isDataConnected: false,
    };

    // Save to database immediately
    await saveSessionToDatabase(session.user);

    await session.save();
  }

  // Update last activity
  session.user.lastActivityAt = Date.now();
  await session.save();

  return session;
}

/**
 * Save session data to database for persistence and analytics
 *
 * @param sessionData - Session data to persist
 */
async function saveSessionToDatabase(sessionData: SessionData): Promise<void> {
  if (!supabaseAdmin) {
    console.error('Admin client not available');
    return;
  }

  try {
    const { error } = await supabaseAdmin
      .from('user_personas')
      .upsert(
        {
          session_id: sessionData.sessionId,
          user_id: sessionData.userId,
          supplier_score: sessionData.persona.supplier_score,
          distributor_score: sessionData.persona.distributor_score,
          craft_score: sessionData.persona.craft_score,
          mid_sized_score: sessionData.persona.mid_sized_score,
          large_score: sessionData.persona.large_score,
          sales_focus_score: sessionData.persona.sales_focus_score,
          marketing_focus_score: sessionData.persona.marketing_focus_score,
          operations_focus_score: sessionData.persona.operations_focus_score,
          compliance_focus_score: sessionData.persona.compliance_focus_score,
          pain_points_detected: sessionData.persona.pain_points_detected,
          pain_points_confidence: sessionData.persona.pain_points_confidence,
          overall_confidence: sessionData.persona.overall_confidence,
          total_interactions: sessionData.persona.total_interactions,
        },
        { onConflict: 'session_id' }
      );

    if (error) {
      console.error('Error saving session to database:', error);
    }
  } catch (err) {
    console.error('Error in saveSessionToDatabase:', err);
  }
}

/**
 * Update persona scores for the current session
 *
 * Merges new scores with existing ones, preserving untouched dimensions
 *
 * @param updates - Partial PersonaScores to update
 *
 * @example
 * ```typescript
 * const session = await getSession();
 * await updatePersona({
 *   supplier_score: 0.8,
 *   pain_points_detected: ['execution_blind_spot'],
 * });
 * ```
 */
export async function updatePersona(
  updates: Partial<PersonaScores>
): Promise<PersonaScores> {
  const session = await getSession();

  if (!session.user) {
    throw new Error('Session not initialized');
  }

  // Merge updates with existing persona
  session.user.persona = {
    ...session.user.persona,
    ...updates,
  };

  // Recalculate overall confidence
  if (session.user.persona.pain_points_detected.length > 0) {
    const confidences = Object.values(session.user.persona.pain_points_confidence);
    session.user.persona.overall_confidence =
      confidences.length > 0
        ? confidences.reduce((a, b) => a + b, 0) / confidences.length
        : 0;
  }

  // Increment interaction count
  session.user.persona.total_interactions += 1;
  session.user.messageCount += 1;
  session.user.lastActivityAt = Date.now();

  await session.save();
  await saveSessionToDatabase(session.user);

  return session.user.persona;
}

/**
 * Record a persona detection signal
 *
 * Signals are individual markers that contribute to persona detection
 * Examples: user mentions "ROI", user asks about "field activities", etc.
 *
 * @param signalType - Type of signal (e.g., "pain_point_mention", "persona_indicator")
 * @param signalText - Text content of the signal
 * @param signalStrength - Strength of the signal (weak, medium, strong)
 * @param painPointsInferred - Pain points this signal indicates
 * @param scoreUpdates - Partial PersonaScores to apply based on this signal
 *
 * @example
 * ```typescript
 * await recordPersonaSignal(
 *   'pain_point_mention',
 *   'We can\'t prove ROI from our field activities',
 *   'strong',
 *   ['execution_blind_spot'],
 *   { supplier_score: 0.85, sales_focus_score: 0.75 }
 * );
 * ```
 */
export async function recordPersonaSignal(
  signalType: string,
  signalText: string,
  signalStrength: 'weak' | 'medium' | 'strong',
  painPointsInferred?: PainPointType[],
  scoreUpdates?: Partial<PersonaScores>
): Promise<void> {
  const session = await getSession();

  if (!session.user) {
    throw new Error('Session not initialized');
  }

  if (!supabaseAdmin) {
    console.error('Admin client not available');
    return;
  }

  const strengthWeights = {
    weak: 0.3,
    medium: 0.6,
    strong: 1.0,
  };

  const confidenceBoost = strengthWeights[signalStrength];

  // Get current scores before update
  const confidenceBefore = session.user.persona.overall_confidence;

  // Apply score updates
  if (scoreUpdates) {
    await updatePersona(scoreUpdates);
  }

  // Update pain point confidence scores
  if (painPointsInferred && painPointsInferred.length > 0) {
    const updatedConfidence = { ...session.user.persona.pain_points_confidence };

    for (const painPoint of painPointsInferred) {
      const currentConfidence = updatedConfidence[painPoint] || 0;
      updatedConfidence[painPoint] = Math.min(1.0, currentConfidence + confidenceBoost * 0.1);
    }

    // Add any new pain points
    const allPainPoints = [
      ...new Set([
        ...session.user.persona.pain_points_detected,
        ...(painPointsInferred || []),
      ]),
    ];

    await updatePersona({
      pain_points_detected: allPainPoints as PainPointType[],
      pain_points_confidence: updatedConfidence,
    });
  }

  // Reload session to get updated confidence
  const updatedSession = await getSession();
  const confidenceAfter = updatedSession.user?.persona.overall_confidence || 0;

  // Record signal to database
  try {
    const { error } = await supabaseAdmin.from('persona_signals').insert({
      session_id: session.user.sessionId,
      signal_type: signalType,
      signal_text: signalText,
      signal_strength: signalStrength,
      score_updates: scoreUpdates || {},
      pain_points_inferred: painPointsInferred || [],
      confidence_before: confidenceBefore,
      confidence_after: confidenceAfter,
    });

    if (error) {
      console.error('Error recording persona signal:', error);
    }
  } catch (err) {
    console.error('Error in recordPersonaSignal:', err);
  }
}

/**
 * Record multiple persona signals in a single batch operation
 * Much faster than calling recordPersonaSignal in a loop
 */
export async function recordPersonaSignalsBatch(
  signals: Array<{
    type: string;
    evidence: string;
    strength: 'weak' | 'medium' | 'strong';
    category?: string;
  }>
): Promise<void> {
  if (signals.length === 0) return;

  const session = await getSession();
  if (!session.user || !supabaseAdmin) {
    console.error('Session or Supabase admin not available');
    return;
  }

  const strengthWeights = { weak: 0.3, medium: 0.6, strong: 1.0 };
  const confidenceBefore = session.user.persona.overall_confidence;

  // Collect all pain points from signals
  const allPainPoints = new Set(session.user.persona.pain_points_detected);
  const updatedConfidence = { ...session.user.persona.pain_points_confidence };

  signals.forEach(signal => {
    if (signal.type === 'pain_point' && signal.category) {
      allPainPoints.add(signal.category as PainPointType);
      const confidenceBoost = strengthWeights[signal.strength] * 0.1;
      const currentConfidence = updatedConfidence[signal.category as PainPointType] || 0;
      updatedConfidence[signal.category as PainPointType] = Math.min(1.0, currentConfidence + confidenceBoost);
    }
  });

  // Update persona once with all changes
  if (allPainPoints.size > session.user.persona.pain_points_detected.length) {
    await updatePersona({
      pain_points_detected: Array.from(allPainPoints) as PainPointType[],
      pain_points_confidence: updatedConfidence,
    });
  }

  // Get updated confidence
  const updatedSession = await getSession();
  const confidenceAfter = updatedSession.user?.persona.overall_confidence || 0;

  // Batch insert all signals
  const rows = signals.map(signal => ({
    session_id: session.user.sessionId,
    signal_type: signal.type === 'pain_point' ? 'pain_point_mention' : signal.type,
    signal_text: signal.evidence,
    signal_strength: signal.strength,
    score_updates: {},
    pain_points_inferred: signal.type === 'pain_point' && signal.category ? [signal.category] : [],
    confidence_before: confidenceBefore,
    confidence_after: confidenceAfter,
  }));

  try {
    const { error } = await supabaseAdmin.from('persona_signals').insert(rows);
    if (error) {
      console.error('Error batch recording persona signals:', error);
    }
  } catch (err) {
    console.error('Error in recordPersonaSignalsBatch:', err);
  }
}

/**
 * Get all conversation messages for the current session
 *
 * @returns Array of conversation messages
 */
export async function getConversationHistory(): Promise<any[]> {
  const session = await getSession();

  if (!session.user) {
    throw new Error('Session not initialized');
  }

  if (!supabaseAdmin) {
    return [];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('conversation_history')
      .select('*')
      .eq('session_id', session.user.sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getConversationHistory:', err);
    return [];
  }
}

/**
 * Add a message to conversation history
 *
 * @param role - "user" or "assistant"
 * @param content - Message content
 * @param generationMode - UI generation mode (fresh, returning, data_connected)
 * @param uiSpecification - UI generation output (JSON)
 */
export async function addConversationMessage(
  role: 'user' | 'assistant',
  content: string,
  generationMode: 'fresh' | 'returning' | 'data_connected' = 'fresh',
  uiSpecification?: any
): Promise<void> {
  const session = await getSession();

  if (!session.user) {
    throw new Error('Session not initialized');
  }

  if (!supabaseAdmin) {
    console.error('Admin client not available');
    return;
  }

  try {
    const { error } = await supabaseAdmin.from('conversation_history').insert({
      session_id: session.user.sessionId,
      user_id: session.user.userId,
      message_role: role,
      message_content: content,
      persona_snapshot: session.user.persona,
      generation_mode: generationMode,
      ui_specification: uiSpecification || {},
    });

    if (error) {
      console.error('Error adding conversation message:', error);
    } else {
      // Update last message (truncate to 50 chars to reduce cookie size)
      session.user.lastMessage = content.substring(0, 50);
      session.user.lastMessageAt = Date.now();
      session.user.messageCount += 1;
      await session.save();
    }
  } catch (err) {
    console.error('Error in addConversationMessage:', err);
  }
}

/**
 * Add multiple messages to conversation history in a single batch operation
 * Much faster than calling addConversationMessage multiple times
 */
export async function addConversationMessagesBatch(
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    generationMode?: 'fresh' | 'returning' | 'data_connected';
    uiSpecification?: any;
  }>
): Promise<void> {
  if (messages.length === 0) return;

  const session = await getSession();
  if (!session.user || !supabaseAdmin) {
    console.error('Session or Supabase admin not available');
    return;
  }

  try {
    // Batch insert all messages
    const rows = messages.map(msg => ({
      session_id: session.user.sessionId,
      user_id: session.user.userId,
      message_role: msg.role,
      message_content: msg.content,
      persona_snapshot: session.user.persona,
      generation_mode: msg.generationMode || 'fresh',
      ui_specification: msg.uiSpecification || {},
    }));

    const { error } = await supabaseAdmin.from('conversation_history').insert(rows);

    if (error) {
      console.error('Error batch adding conversation messages:', error);
    } else {
      // Update session with last message
      const lastMessage = messages[messages.length - 1];
      session.user.lastMessage = lastMessage.content.substring(0, 50);
      session.user.lastMessageAt = Date.now();
      session.user.messageCount += messages.length;
      await session.save();
    }
  } catch (err) {
    console.error('Error in addConversationMessagesBatch:', err);
  }
}

/**
 * Save a generated brochure to the session
 *
 * @param brochureContent - Full brochure content (JSON)
 * @param painPointsAddressed - Array of pain points addressed in brochure
 * @param questionsAnalyzed - Array of user questions that drove the brochure
 */
export async function saveBrochure(
  brochureContent: any,
  painPointsAddressed: PainPointType[] = [],
  questionsAnalyzed: string[] = []
): Promise<string> {
  const session = await getSession();

  if (!session.user) {
    throw new Error('Session not initialized');
  }

  if (!supabaseAdmin) {
    throw new Error('Admin client not available');
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('generated_brochures')
      .insert({
        session_id: session.user.sessionId,
        user_id: session.user.userId,
        brochure_content: brochureContent,
        persona_context: session.user.persona,
        questions_analyzed: questionsAnalyzed,
        pain_points_addressed: painPointsAddressed,
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    // Update session
    session.user.hasBrochure = true;
    session.user.lastGeneratedBrochureId = data.id;
    session.user.lastBrochureGeneratedAt = Date.now();
    session.user.currentMode = 'returning';
    await session.save();

    return data.id;
  } catch (err) {
    console.error('Error in saveBrochure:', err);
    throw err;
  }
}

/**
 * Get the latest brochure for the current session
 *
 * @returns Brochure object or null if no brochure exists
 */
export async function getLatestBrochure(): Promise<any | null> {
  const session = await getSession();

  if (!session.user || !session.user.lastGeneratedBrochureId) {
    return null;
  }

  if (!supabaseAdmin) {
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('generated_brochures')
      .select('*')
      .eq('id', session.user.lastGeneratedBrochureId)
      .single();

    if (error) {
      console.error('Error fetching brochure:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getLatestBrochure:', err);
    return null;
  }
}

/**
 * Clear the session (logout)
 *
 * Removes session cookie
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  const session = await getIronSession<IronSessionData>(cookieStore, sessionConfig);
  session.destroy();
}

/**
 * Get session debug info (development only)
 *
 * @returns Debug information about current session
 */
export async function getSessionDebugInfo(): Promise<any> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Debug info only available in development mode');
  }

  const session = await getSession();

  return {
    sessionId: session.user?.sessionId,
    createdAt: session.user?.createdAt,
    lastActivityAt: session.user?.lastActivityAt,
    persona: session.user?.persona,
    messageCount: session.user?.messageCount,
    currentMode: session.user?.currentMode,
    hasBrochure: session.user?.hasBrochure,
    isDataConnected: session.user?.isDataConnected,
  };
}

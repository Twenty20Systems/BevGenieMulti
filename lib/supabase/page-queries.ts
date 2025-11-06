/**
 * Generated Pages Query Functions
 *
 * Functions for storing and retrieving generated page data from Supabase
 */

import { supabase, supabaseAdmin } from './client';
import type { BevGeniePage } from '@/lib/ai/page-specs';
import type { PersonaScores } from '@/lib/session/types';

/**
 * Store a generated page specification
 */
export async function saveGeneratedPage({
  sessionId,
  pageType,
  pageSpec,
  intent,
  intentConfidence,
  userMessage,
  conversationLength,
  personaSnapshot,
  generationTimeMs,
  expiresAt,
}: {
  sessionId: string;
  pageType: string;
  pageSpec: BevGeniePage;
  intent: string;
  intentConfidence: number;
  userMessage: string;
  conversationLength: number;
  personaSnapshot?: PersonaScores;
  generationTimeMs?: number;
  expiresAt?: Date;
}): Promise<{ id: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('generated_pages')
      .insert([
        {
          session_id: sessionId,
          page_type: pageType,
          page_spec: pageSpec,
          intent,
          intent_confidence: intentConfidence,
          user_message: userMessage,
          conversation_length: conversationLength,
          persona_snapshot: personaSnapshot || null,
          generation_time_ms: generationTimeMs || null,
          expires_at: expiresAt ? expiresAt.toISOString() : null,
        },
      ])
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return { id: data.id };
  } catch (error) {
    console.error('Error saving generated page:', error);
    throw error;
  }
}

/**
 * Retrieve a generated page by ID
 */
export async function getGeneratedPage(pageId: string): Promise<BevGeniePage | null> {
  try {
    const { data, error } = await supabase
      .from('generated_pages')
      .select('page_spec')
      .eq('id', pageId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw error;
    }

    return data?.page_spec || null;
  } catch (error) {
    console.error('Error retrieving generated page:', error);
    throw error;
  }
}

/**
 * Get recent generated pages for a session
 */
export async function getRecentPages(
  sessionId: string,
  limit: number = 10
): Promise<Array<{
  id: string;
  pageType: string;
  intent: string;
  intentConfidence: number;
  wasViewed: boolean;
  ctaClicks: number;
  createdAt: string;
}>> {
  try {
    const { data, error } = await supabase
      .from('generated_pages')
      .select(
        'id, page_type, intent, intent_confidence, was_viewed, cta_clicks, created_at'
      )
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return (data || []).map((page: any) => ({
      id: page.id,
      pageType: page.page_type,
      intent: page.intent,
      intentConfidence: page.intent_confidence,
      wasViewed: page.was_viewed,
      ctaClicks: page.cta_clicks,
      createdAt: page.created_at,
    }));
  } catch (error) {
    console.error('Error retrieving recent pages:', error);
    throw error;
  }
}

/**
 * Record a page analytics event (view, CTA click, share, etc.)
 */
export async function recordPageEvent(
  pageId: string,
  eventType: 'viewed' | 'cta_clicked' | 'shared' | 'downloaded',
  eventData?: Record<string, any>,
  sessionId?: string
): Promise<{ id: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .rpc('record_page_event', {
        p_page_id: pageId,
        p_event_type: eventType,
        p_event_data: eventData || null,
        p_session_id: sessionId || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { id: data };
  } catch (error) {
    console.error('Error recording page event:', error);
    throw error;
  }
}

/**
 * Get page analytics for a specific page
 */
export async function getPageAnalytics(pageId: string): Promise<{
  totalEvents: number;
  views: number;
  ctaClicks: number;
  shares: number;
  downloads: number;
  lastEvent?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('page_analytics')
      .select('event_type, created_at')
      .eq('page_id', pageId);

    if (error) {
      throw error;
    }

    const events = data || [];

    return {
      totalEvents: events.length,
      views: events.filter((e: any) => e.event_type === 'viewed').length,
      ctaClicks: events.filter((e: any) => e.event_type === 'cta_clicked').length,
      shares: events.filter((e: any) => e.event_type === 'shared').length,
      downloads: events.filter((e: any) => e.event_type === 'downloaded').length,
      lastEvent: events.length > 0 ? events[events.length - 1].created_at : undefined,
    };
  } catch (error) {
    console.error('Error retrieving page analytics:', error);
    throw error;
  }
}

/**
 * Get page generation statistics
 */
export async function getPageGenerationStats(
  sessionId?: string,
  days: number = 7
): Promise<
  Array<{
    pageType: string;
    totalGenerated: number;
    avgGenerationTimeMs: number;
    viewedCount: number;
    viewRate: number;
    totalCtaClicks: number;
    avgCtaClicks: number;
  }>
> {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_page_generation_stats', {
      p_session_id: sessionId || null,
      p_days: days,
    });

    if (error) {
      throw error;
    }

    return (data || []).map((stat: any) => ({
      pageType: stat.page_type,
      totalGenerated: stat.total_generated,
      avgGenerationTimeMs: stat.avg_generation_time_ms || 0,
      viewedCount: stat.viewed_count || 0,
      viewRate: stat.view_rate || 0,
      totalCtaClicks: stat.total_cta_clicks || 0,
      avgCtaClicks: stat.avg_cta_clicks || 0,
    }));
  } catch (error) {
    console.error('Error retrieving page generation stats:', error);
    throw error;
  }
}

/**
 * Get intent-based statistics
 */
export async function getIntentStatistics(
  sessionId?: string,
  days: number = 7
): Promise<
  Array<{
    intent: string;
    count: number;
    avgConfidence: number;
    pagesGenerated: number;
    generationRate: number;
  }>
> {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_intent_statistics', {
      p_session_id: sessionId || null,
      p_days: days,
    });

    if (error) {
      throw error;
    }

    return (data || []).map((stat: any) => ({
      intent: stat.intent,
      count: stat.count,
      avgConfidence: stat.avg_confidence || 0,
      pagesGenerated: stat.pages_generated || 0,
      generationRate: stat.generation_rate || 0,
    }));
  } catch (error) {
    console.error('Error retrieving intent statistics:', error);
    throw error;
  }
}

/**
 * Delete expired pages and their analytics
 */
export async function cleanupExpiredPages(): Promise<{ deletedCount: number }> {
  try {
    const { data, error } = await supabaseAdmin.rpc('clean_expired_pages');

    if (error) {
      throw error;
    }

    // Get the count of deleted pages
    const { count } = await supabaseAdmin
      .from('generated_pages')
      .select('*', { count: 'exact', head: true })
      .is('expires_at', true);

    return { deletedCount: count || 0 };
  } catch (error) {
    console.error('Error cleaning up expired pages:', error);
    throw error;
  }
}

/**
 * Check if a page exists and is still valid
 */
export async function isPageValid(pageId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('generated_pages')
      .select('id, expires_at')
      .eq('id', pageId)
      .single();

    if (error) {
      return false;
    }

    if (!data) {
      return false;
    }

    // Check if page has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking page validity:', error);
    return false;
  }
}

/**
 * Get the most viewed pages for a session
 */
export async function getMostViewedPages(
  sessionId: string,
  limit: number = 5
): Promise<Array<{
  id: string;
  pageType: string;
  intent: string;
  views: number;
  ctaClicks: number;
}>> {
  try {
    const { data, error } = await supabase
      .from('generated_pages')
      .select('id, page_type, intent, cta_clicks')
      .eq('session_id', sessionId)
      .eq('was_viewed', true)
      .order('cta_clicks', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return (data || []).map((page: any) => ({
      id: page.id,
      pageType: page.page_type,
      intent: page.intent,
      views: 1, // Simplified; real count would require separate query
      ctaClicks: page.cta_clicks,
    }));
  } catch (error) {
    console.error('Error retrieving most viewed pages:', error);
    throw error;
  }
}

/**
 * Get average page generation time by type
 */
export async function getAverageGenerationTime(
  pageType?: string
): Promise<number> {
  try {
    let query = supabase
      .from('generated_pages')
      .select('generation_time_ms');

    if (pageType) {
      query = query.eq('page_type', pageType);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const times = (data || [])
      .map((p: any) => p.generation_time_ms)
      .filter((t: number | null) => t !== null);

    if (times.length === 0) {
      return 0;
    }

    return times.reduce((a: number, b: number) => a + b, 0) / times.length;
  } catch (error) {
    console.error('Error calculating average generation time:', error);
    return 0;
  }
}

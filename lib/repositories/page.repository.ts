/**
 * Page Repository
 *
 * Handles all operations related to:
 * - Generated page storage and retrieval
 * - Page analytics tracking
 * - Brochure management
 * - Performance metrics collection
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository';
import {
  IPageRepository,
  GeneratedBrochure,
  BrochureCreateInput,
  ValidationError,
} from './types';

export class PageRepository extends BaseRepository implements IPageRepository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  /**
   * Save a generated page specification
   */
  async saveGeneratedPage(pageSpec: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      this.validateRequired(pageSpec, 'pageSpec');
      if (!pageSpec.session_id) {
        throw new ValidationError('pageSpec.session_id is required');
      }
      if (!pageSpec.page_type) {
        throw new ValidationError('pageSpec.page_type is required');
      }

      this.log('Saving generated page', {
        pageType: pageSpec.page_type,
        sessionId: pageSpec.session_id,
      });

      const { data, error } = await this.supabaseClient
        .from('generated_pages')
        .insert([
          {
            session_id: pageSpec.session_id,
            page_type: pageSpec.page_type,
            page_spec: pageSpec.page_spec || pageSpec,
            intent: pageSpec.intent || null,
            intent_confidence: pageSpec.intent_confidence || null,
            user_message: pageSpec.user_message || null,
            conversation_length: pageSpec.conversation_length || null,
            persona_snapshot: pageSpec.persona_snapshot || null,
            generation_time_ms: pageSpec.generation_time_ms || null,
            expires_at: pageSpec.expires_at || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return data as Record<string, unknown>;
    } catch (error) {
      this.handleError(error, 'saveGeneratedPage');
    }
  }

  /**
   * Retrieve a generated page by ID
   */
  async getGeneratedPage(pageId: string): Promise<Record<string, unknown> | null> {
    try {
      this.validateRequired(pageId, 'pageId');
      this.log('Getting generated page', { pageId });

      const { data, error } = await this.supabaseClient
        .from('generated_pages')
        .select('*')
        .eq('id', pageId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        throw error;
      }

      return data as Record<string, unknown>;
    } catch (error) {
      this.handleError(error, 'getGeneratedPage');
    }
  }

  /**
   * Get recent generated pages for a session
   */
  async getRecentPages(
    sessionId: string,
    limit: number = 10
  ): Promise<Record<string, unknown>[]> {
    try {
      this.validateRequired(sessionId, 'sessionId');
      this.log('Getting recent pages', { sessionId, limit });

      const { data, error } = await this.supabaseClient
        .from('generated_pages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []) as Record<string, unknown>[];
    } catch (error) {
      this.handleError(error, 'getRecentPages');
    }
  }

  /**
   * Get the most viewed pages for a session
   */
  async getMostViewedPages(
    sessionId: string,
    limit: number = 5
  ): Promise<Record<string, unknown>[]> {
    try {
      this.validateRequired(sessionId, 'sessionId');
      this.log('Getting most viewed pages', { sessionId, limit });

      const { data, error } = await this.supabaseClient
        .from('generated_pages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('was_viewed', true)
        .order('cta_clicks', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []) as Record<string, unknown>[];
    } catch (error) {
      this.handleError(error, 'getMostViewedPages');
    }
  }

  /**
   * Record a page analytics event
   */
  async recordPageEvent(pageId: string, eventType: string): Promise<void> {
    try {
      this.validateRequired(pageId, 'pageId');
      this.validateRequired(eventType, 'eventType');
      this.log('Recording page event', { pageId, eventType });

      // Use RPC to record event
      const { error } = await this.supabaseClient.rpc('record_page_event', {
        p_page_id: pageId,
        p_event_type: eventType,
        p_event_data: null,
        p_session_id: null,
      });

      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'recordPageEvent');
    }
  }

  /**
   * Get page analytics for a specific page
   */
  async getPageAnalytics(pageId: string): Promise<Record<string, unknown>> {
    try {
      this.validateRequired(pageId, 'pageId');
      this.log('Getting page analytics', { pageId });

      const { data, error } = await this.supabaseClient
        .from('page_analytics')
        .select('event_type, created_at')
        .eq('page_id', pageId);

      if (error) throw error;

      const events = data || [];

      return {
        pageId,
        totalEvents: events.length,
        views: events.filter((e: any) => e.event_type === 'viewed').length,
        ctaClicks: events.filter((e: any) => e.event_type === 'cta_clicked').length,
        shares: events.filter((e: any) => e.event_type === 'shared').length,
        downloads: events.filter((e: any) => e.event_type === 'downloaded').length,
        lastEvent: events.length > 0 ? events[events.length - 1].created_at : undefined,
      };
    } catch (error) {
      this.handleError(error, 'getPageAnalytics');
    }
  }

  /**
   * Get page generation statistics
   */
  async getPageGenerationStats(
    sessionId: string,
    days: number = 7
  ): Promise<Record<string, unknown>> {
    try {
      this.validateRequired(sessionId, 'sessionId');
      this.log('Getting page generation stats', { sessionId, days });

      const { data, error } = await this.supabaseClient.rpc('get_page_generation_stats', {
        p_session_id: sessionId,
        p_days: days,
      });

      if (error) throw error;

      return {
        sessionId,
        days,
        stats: data || [],
        generatedAt: this.formatDate(new Date()),
      };
    } catch (error) {
      this.handleError(error, 'getPageGenerationStats');
    }
  }

  /**
   * Save a brochure (generated content package)
   */
  async saveBrochure(data: BrochureCreateInput): Promise<GeneratedBrochure> {
    try {
      this.validateRequired(data.session_id, 'session_id');
      this.validateRequired(data.brochure_content, 'brochure_content');
      this.validateRequired(data.persona_context, 'persona_context');
      this.log('Saving brochure', { sessionId: data.session_id });

      const { data: brochure, error } = await this.supabaseClient
        .from('generated_brochures')
        .insert([
          {
            session_id: data.session_id,
            user_id: data.user_id || null,
            brochure_content: data.brochure_content,
            persona_context: data.persona_context,
            questions_analyzed: data.questions_analyzed || [],
            pain_points_addressed: data.pain_points_addressed || [],
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return brochure as GeneratedBrochure;
    } catch (error) {
      this.handleError(error, 'saveBrochure');
    }
  }

  /**
   * Get the latest brochure for a session
   */
  async getLatestBrochure(sessionId: string): Promise<GeneratedBrochure | null> {
    try {
      this.validateRequired(sessionId, 'sessionId');
      this.log('Getting latest brochure', { sessionId });

      const { data, error } = await this.supabaseClient
        .from('generated_brochures')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        throw error;
      }

      return data as GeneratedBrochure;
    } catch (error) {
      this.handleError(error, 'getLatestBrochure');
    }
  }

  /**
   * Clean up expired pages
   */
  async cleanupExpiredPages(): Promise<void> {
    try {
      this.log('Cleaning up expired pages');

      // Use RPC to clean expired pages
      const { error } = await this.supabaseClient.rpc('clean_expired_pages');

      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'cleanupExpiredPages');
    }
  }

  /**
   * Check if a page is still valid
   */
  async isPageValid(pageId: string): Promise<boolean> {
    try {
      this.validateRequired(pageId, 'pageId');
      this.log('Checking page validity', { pageId });

      const { data, error } = await this.supabaseClient
        .from('generated_pages')
        .select('id, expires_at')
        .eq('id', pageId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return false;
        }
        throw error;
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
      this.handleError(error, 'isPageValid');
    }
  }
}

/**
 * Data Repository
 *
 * Handles all operations related to:
 * - User Personas
 * - Conversation History
 * - Persona Signals
 * - Session Management
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseRepository } from './base.repository';
import {
  IDataRepository,
  UserPersona,
  PersonaCreateInput,
  PersonaUpdateInput,
  ConversationMessage,
  MessageCreateInput,
  PersonaSignal,
  SignalCreateInput,
  NotFoundError,
  ValidationError,
} from './types';

export class DataRepository extends BaseRepository implements IDataRepository {
  constructor(client: SupabaseClient) {
    super(client);
  }

  /**
   * Get user persona by session ID
   */
  async getUserPersona(sessionId: string): Promise<UserPersona | null> {
    try {
      this.validateRequired(sessionId, 'sessionId');
      this.log('Getting user persona', { sessionId });

      const { data, error } = await this.supabaseClient
        .from('user_personas')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        throw error;
      }

      return data as UserPersona;
    } catch (error) {
      this.handleError(error, 'getUserPersona');
    }
  }

  /**
   * Create a new user persona
   */
  async createUserPersona(data: PersonaCreateInput): Promise<UserPersona> {
    try {
      this.validateRequired(data.session_id, 'session_id');
      this.log('Creating user persona', data);

      const { data: persona, error } = await this.supabaseClient
        .from('user_personas')
        .insert([
          {
            ...data,
            supplier_score: data.supplier_score ?? 0.0,
            distributor_score: data.distributor_score ?? 0.0,
            craft_score: data.craft_score ?? 0.0,
            mid_sized_score: data.mid_sized_score ?? 0.0,
            large_score: data.large_score ?? 0.0,
            sales_focus_score: data.sales_focus_score ?? 0.0,
            marketing_focus_score: data.marketing_focus_score ?? 0.0,
            operations_focus_score: data.operations_focus_score ?? 0.0,
            compliance_focus_score: data.compliance_focus_score ?? 0.0,
            overall_confidence: data.overall_confidence ?? 0.0,
            total_interactions: 0,
            data_connected: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return persona as UserPersona;
    } catch (error) {
      this.handleError(error, 'createUserPersona');
    }
  }

  /**
   * Update user persona by session ID
   */
  async updateUserPersona(
    sessionId: string,
    updates: PersonaUpdateInput
  ): Promise<UserPersona> {
    try {
      this.validateRequired(sessionId, 'sessionId');
      this.log('Updating user persona', { sessionId, updates });

      const { data: persona, error } = await this.supabaseClient
        .from('user_personas')
        .update({
          ...updates,
          last_updated: this.formatDate(new Date()),
        })
        .eq('session_id', sessionId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new NotFoundError(`Persona not found for session: ${sessionId}`);
        }
        throw error;
      }

      return persona as UserPersona;
    } catch (error) {
      this.handleError(error, 'updateUserPersona');
    }
  }

  /**
   * Delete user persona by session ID
   */
  async deleteUserPersona(sessionId: string): Promise<void> {
    try {
      this.validateRequired(sessionId, 'sessionId');
      this.log('Deleting user persona', { sessionId });

      const { error } = await this.supabaseClient
        .from('user_personas')
        .delete()
        .eq('session_id', sessionId);

      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'deleteUserPersona');
    }
  }

  /**
   * Add conversation message
   */
  async addConversationMessage(data: MessageCreateInput): Promise<ConversationMessage> {
    try {
      this.validateRequired(data.session_id, 'session_id');
      this.validateRequired(data.message_role, 'message_role');
      this.validateRequired(data.message_content, 'message_content');
      this.log('Adding conversation message', data);

      const { data: message, error } = await this.supabaseClient
        .from('conversation_history')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      return message as ConversationMessage;
    } catch (error) {
      this.handleError(error, 'addConversationMessage');
    }
  }

  /**
   * Get conversation history for a session
   */
  async getConversationHistory(sessionId: string): Promise<ConversationMessage[]> {
    try {
      this.validateRequired(sessionId, 'sessionId');
      this.log('Getting conversation history', { sessionId });

      const { data: messages, error } = await this.supabaseClient
        .from('conversation_history')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return messages as ConversationMessage[];
    } catch (error) {
      this.handleError(error, 'getConversationHistory');
    }
  }

  /**
   * Delete conversation history for a session (GDPR compliance)
   */
  async deleteConversationHistory(sessionId: string): Promise<void> {
    try {
      this.validateRequired(sessionId, 'sessionId');
      this.log('Deleting conversation history', { sessionId });

      const { error } = await this.supabaseClient
        .from('conversation_history')
        .delete()
        .eq('session_id', sessionId);

      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'deleteConversationHistory');
    }
  }

  /**
   * Record a persona signal
   */
  async recordPersonaSignal(data: SignalCreateInput): Promise<PersonaSignal> {
    try {
      this.validateRequired(data.session_id, 'session_id');
      this.log('Recording persona signal', data);

      const { data: signal, error } = await this.supabaseClient
        .from('persona_signals')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      return signal as PersonaSignal;
    } catch (error) {
      this.handleError(error, 'recordPersonaSignal');
    }
  }

  /**
   * Get all persona signals for a session
   */
  async getPersonaSignals(sessionId: string): Promise<PersonaSignal[]> {
    try {
      this.validateRequired(sessionId, 'sessionId');
      this.log('Getting persona signals', { sessionId });

      const { data: signals, error } = await this.supabaseClient
        .from('persona_signals')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return signals as PersonaSignal[];
    } catch (error) {
      this.handleError(error, 'getPersonaSignals');
    }
  }

  /**
   * Delete all session data (GDPR compliance)
   */
  async deleteSessionData(sessionId: string): Promise<void> {
    try {
      this.validateRequired(sessionId, 'sessionId');
      this.log('Deleting all session data', { sessionId });

      // Delete in order of dependencies (foreign keys)
      const operations = [
        this.supabaseClient.from('persona_signals').delete().eq('session_id', sessionId),
        this.supabaseClient.from('conversation_history').delete().eq('session_id', sessionId),
        this.supabaseClient.from('generated_brochures').delete().eq('session_id', sessionId),
        this.supabaseClient.from('user_personas').delete().eq('session_id', sessionId),
      ];

      for (const operation of operations) {
        const { error } = await operation;
        if (error) throw error;
      }
    } catch (error) {
      this.handleError(error, 'deleteSessionData');
    }
  }

  /**
   * Get old sessions for cleanup (anonymous sessions older than N days)
   */
  async getOldSessions(daysOld: number): Promise<UserPersona[]> {
    try {
      this.validateRequired(daysOld, 'daysOld');
      if (daysOld < 1) {
        throw new ValidationError('daysOld must be at least 1');
      }
      this.log('Getting old sessions', { daysOld });

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const { data: sessions, error } = await this.supabaseClient
        .from('user_personas')
        .select('*')
        .is('user_id', null) // Anonymous sessions only
        .lt('created_at', cutoffDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      return sessions as UserPersona[];
    } catch (error) {
      this.handleError(error, 'getOldSessions');
    }
  }
}

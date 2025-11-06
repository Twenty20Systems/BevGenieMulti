import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Phase 1.2: Support both SUPABASE_ADMIN_KEY and SUPABASE_SERVICE_ROLE_KEY
const supabaseServiceKey = process.env.SUPABASE_ADMIN_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Client for use in browser and server actions (limited permissions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for use in server routes only (full permissions)
// Use this for operations that bypass RLS
// Supports both SUPABASE_ADMIN_KEY (Phase 1.2) and SUPABASE_SERVICE_ROLE_KEY (legacy)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export type Database = {
  public: {
    Tables: {
      knowledge_base: {
        Row: {
          id: string;
          content: string;
          embedding: number[] | null;
          metadata: Record<string, any>;
          persona_tags: string[];
          pain_point_tags: string[];
          source_type: string | null;
          source_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          embedding?: number[] | null;
          metadata?: Record<string, any>;
          persona_tags?: string[];
          pain_point_tags?: string[];
          source_type?: string | null;
          source_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          embedding?: number[] | null;
          metadata?: Record<string, any>;
          persona_tags?: string[];
          pain_point_tags?: string[];
          source_type?: string | null;
          source_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_personas: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string;
          supplier_score: number;
          distributor_score: number;
          craft_score: number;
          mid_sized_score: number;
          large_score: number;
          sales_focus_score: number;
          marketing_focus_score: number;
          operations_focus_score: number;
          compliance_focus_score: number;
          pain_points_detected: string[];
          pain_points_confidence: Record<string, number>;
          overall_confidence: number;
          total_interactions: number;
          questions_asked: string[];
          last_updated: string;
          user_confirmed_type: string | null;
          user_confirmed_size: string | null;
          data_connected: boolean;
          data_sources: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id: string;
          supplier_score?: number;
          distributor_score?: number;
          craft_score?: number;
          mid_sized_score?: number;
          large_score?: number;
          sales_focus_score?: number;
          marketing_focus_score?: number;
          operations_focus_score?: number;
          compliance_focus_score?: number;
          pain_points_detected?: string[];
          pain_points_confidence?: Record<string, number>;
          overall_confidence?: number;
          total_interactions?: number;
          questions_asked?: string[];
          last_updated?: string;
          user_confirmed_type?: string | null;
          user_confirmed_size?: string | null;
          data_connected?: boolean;
          data_sources?: Record<string, any>;
          created_at?: string;
        };
        Update: {
          supplier_score?: number;
          distributor_score?: number;
          craft_score?: number;
          mid_sized_score?: number;
          large_score?: number;
          sales_focus_score?: number;
          marketing_focus_score?: number;
          operations_focus_score?: number;
          compliance_focus_score?: number;
          pain_points_detected?: string[];
          pain_points_confidence?: Record<string, number>;
          overall_confidence?: number;
          total_interactions?: number;
          questions_asked?: string[];
          last_updated?: string;
          user_confirmed_type?: string | null;
          user_confirmed_size?: string | null;
          data_connected?: boolean;
          data_sources?: Record<string, any>;
        };
      };
      conversation_history: {
        Row: {
          id: string;
          session_id: string;
          user_id: string | null;
          message_role: string;
          message_content: string;
          persona_snapshot: Record<string, any> | null;
          pain_points_inferred: string[] | null;
          ui_specification: Record<string, any> | null;
          generation_mode: string | null;
          estimated_read_time: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id?: string | null;
          message_role: string;
          message_content: string;
          persona_snapshot?: Record<string, any> | null;
          pain_points_inferred?: string[] | null;
          ui_specification?: Record<string, any> | null;
          generation_mode?: string | null;
          estimated_read_time?: string | null;
          created_at?: string;
        };
      };
      persona_signals: {
        Row: {
          id: string;
          session_id: string;
          signal_type: string | null;
          signal_text: string | null;
          signal_strength: string | null;
          score_updates: Record<string, any> | null;
          pain_points_inferred: string[] | null;
          confidence_before: number | null;
          confidence_after: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          signal_type?: string | null;
          signal_text?: string | null;
          signal_strength?: string | null;
          score_updates?: Record<string, any> | null;
          pain_points_inferred?: string[] | null;
          confidence_before?: number | null;
          confidence_after?: number | null;
          created_at?: string;
        };
      };
      generated_brochures: {
        Row: {
          id: string;
          session_id: string;
          user_id: string | null;
          brochure_content: Record<string, any>;
          persona_context: Record<string, any>;
          questions_analyzed: string[];
          pain_points_addressed: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id?: string | null;
          brochure_content: Record<string, any>;
          persona_context: Record<string, any>;
          questions_analyzed?: string[];
          pain_points_addressed?: string[];
          created_at?: string;
        };
      };
    };
  };
};

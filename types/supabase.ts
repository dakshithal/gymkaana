/**
 * Supabase database types for Gymkaana.
 * Run `supabase gen types typescript` after migrations for full types.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Minimal Supabase types aligned with your existing schema.
 * For full typing, prefer `supabase gen types typescript`.
 */
export interface Database {
  public: {
    Tables: {
      body_parts: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          body_part_id: string | null;
          instructions: string | null;
          is_custom: boolean | null;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          body_part_id?: string | null;
          instructions?: string | null;
          is_custom?: boolean | null;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          body_part_id?: string | null;
          instructions?: string | null;
          is_custom?: boolean | null;
          user_id?: string | null;
        };
      };
      programs: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string | null;
        };
      };
      program_schedule: {
        Row: {
          id: string;
          program_id: string | null;
          user_id: string;
          day_of_week: number;
        };
        Insert: {
          id?: string;
          program_id?: string | null;
          user_id: string;
          day_of_week: number;
        };
        Update: {
          id?: string;
          program_id?: string | null;
          user_id?: string;
          day_of_week?: number;
        };
      };
      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          program_id: string | null;
          started_at: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          program_id?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          program_id?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
        };
      };
      set_logs: {
        Row: {
          id: string;
          session_id: string | null;
          exercise_id: string;
          set_number: number;
          weight: number | null;
          reps: number | null;
          rest_time_seconds: number | null;
          notes: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          session_id?: string | null;
          exercise_id: string;
          set_number: number;
          weight?: number | null;
          reps?: number | null;
          rest_time_seconds?: number | null;
          notes?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string | null;
          exercise_id?: string;
          set_number?: number;
          weight?: number | null;
          reps?: number | null;
          rest_time_seconds?: number | null;
          notes?: string | null;
          completed_at?: string | null;
        };
      };
    };
  };
}

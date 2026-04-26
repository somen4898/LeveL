// Placeholder — regenerate with: npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts
// For now, define the schema types manually matching the TRD.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          timezone: string;
          day_close_time: string;
          active_run_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          timezone?: string;
          day_close_time?: string;
          active_run_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      runs: {
        Row: {
          id: string;
          user_id: string;
          status: "onboarding" | "active" | "archived";
          start_date: string | null;
          end_date: string | null;
          current_level: number;
          level_streak: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status: "onboarding" | "active" | "archived";
          start_date?: string | null;
          end_date?: string | null;
          current_level?: number;
          level_streak?: number;
        };
        Update: Partial<Database["public"]["Tables"]["runs"]["Insert"]>;
      };
      cores: {
        Row: {
          id: string;
          run_id: string;
          user_id: string;
          kind: "eating" | "gym" | "coding";
          schedule_days: number[];
          is_locked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          user_id: string;
          kind: "eating" | "gym" | "coding";
          schedule_days: number[];
          is_locked?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["cores"]["Insert"]>;
      };
      subtasks: {
        Row: {
          id: string;
          core_id: string;
          user_id: string;
          label: string;
          measurement: "binary" | "numeric";
          target_numeric: number | null;
          unit: string | null;
          position: number;
          active_from_level: number;
          active_until_level: number | null;
        };
        Insert: {
          id?: string;
          core_id: string;
          user_id: string;
          label: string;
          measurement: "binary" | "numeric";
          target_numeric?: number | null;
          unit?: string | null;
          position?: number;
          active_from_level?: number;
          active_until_level?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["subtasks"]["Insert"]>;
      };
      optionals: {
        Row: {
          id: string;
          run_id: string;
          user_id: string;
          label: string;
          measurement: "binary" | "numeric";
          target_numeric: number | null;
          unit: string | null;
          unlocked_at_level: number;
          consecutive_skip_count: number;
          is_locked_in_today: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          user_id: string;
          label: string;
          measurement: "binary" | "numeric";
          target_numeric?: number | null;
          unit?: string | null;
          unlocked_at_level: number;
          consecutive_skip_count?: number;
          is_locked_in_today?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["optionals"]["Insert"]>;
      };
      rewards: {
        Row: {
          id: string;
          run_id: string;
          user_id: string;
          scheduled_day: number;
          tier: "small" | "big";
          name: string;
          price_amount: number | null;
          price_currency: string | null;
          image_url: string | null;
          motivation_note: string | null;
          status: "locked" | "qualifying" | "claimable" | "claimed";
          claimed_at: string | null;
        };
        Insert: {
          id?: string;
          run_id: string;
          user_id: string;
          scheduled_day: number;
          tier: "small" | "big";
          name: string;
          price_amount?: number | null;
          price_currency?: string | null;
          image_url?: string | null;
          motivation_note?: string | null;
          status?: "locked" | "qualifying" | "claimable" | "claimed";
        };
        Update: Partial<Database["public"]["Tables"]["rewards"]["Insert"]>;
      };
      level_catalogue: {
        Row: {
          id: string;
          run_id: string;
          user_id: string;
          level_number: number;
          effect_kind: "TIGHTEN" | "UNLOCK";
          description: string;
          target_subtask_id: string | null;
          delta_numeric: number | null;
          new_optional_label: string | null;
          new_optional_measurement: string | null;
          new_optional_target_numeric: number | null;
          new_optional_unit: string | null;
        };
        Insert: {
          id?: string;
          run_id: string;
          user_id: string;
          level_number: number;
          effect_kind: "TIGHTEN" | "UNLOCK";
          description: string;
          target_subtask_id?: string | null;
          delta_numeric?: number | null;
          new_optional_label?: string | null;
          new_optional_measurement?: string | null;
          new_optional_target_numeric?: number | null;
          new_optional_unit?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["level_catalogue"]["Insert"]
        >;
      };
      level_history: {
        Row: {
          id: string;
          run_id: string;
          user_id: string;
          level_number: number;
          catalogue_id: string;
          achieved_on: string;
          achieved_at: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          user_id: string;
          level_number: number;
          catalogue_id: string;
          achieved_on: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["level_history"]["Insert"]
        >;
      };
      daily_logs: {
        Row: {
          id: string;
          run_id: string;
          user_id: string;
          log_date: string;
          day_index: number;
          status: "in_progress" | "qualified" | "failed";
          closed_at: string | null;
          cores_complete_count: number;
          cores_required_count: number;
          optional_skips_with_reason: number;
          optional_skips_without_reason: number;
        };
        Insert: {
          id?: string;
          run_id: string;
          user_id: string;
          log_date: string;
          day_index: number;
          status?: "in_progress" | "qualified" | "failed";
          cores_complete_count?: number;
          cores_required_count?: number;
          optional_skips_with_reason?: number;
          optional_skips_without_reason?: number;
        };
        Update: Partial<Database["public"]["Tables"]["daily_logs"]["Insert"]>;
      };
      task_completions: {
        Row: {
          id: string;
          daily_log_id: string;
          user_id: string;
          task_kind: "subtask" | "optional";
          subtask_id: string | null;
          optional_id: string | null;
          completed: boolean;
          numeric_value: number | null;
          note: string | null;
          logged_at: string;
        };
        Insert: {
          id?: string;
          daily_log_id: string;
          user_id: string;
          task_kind: "subtask" | "optional";
          subtask_id?: string | null;
          optional_id?: string | null;
          completed?: boolean;
          numeric_value?: number | null;
          note?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["task_completions"]["Insert"]
        >;
      };
      reasoning_entries: {
        Row: {
          id: string;
          daily_log_id: string;
          user_id: string;
          optional_id: string;
          reason_text: string;
          tag: "sick" | "tired" | "busy" | "other" | null;
          logged_at: string;
          is_immutable: boolean;
        };
        Insert: {
          id?: string;
          daily_log_id: string;
          user_id: string;
          optional_id: string;
          reason_text: string;
          tag?: "sick" | "tired" | "busy" | "other" | null;
          is_immutable?: boolean;
        };
        Update: Partial<
          Database["public"]["Tables"]["reasoning_entries"]["Insert"]
        >;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

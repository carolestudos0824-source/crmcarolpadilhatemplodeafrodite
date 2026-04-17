export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      beta_feedback: {
        Row: {
          created_at: string
          id: string
          message: string
          page: string | null
          rating: number | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          page?: string | null
          rating?: number | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          page?: string | null
          rating?: number | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      cms_arcanos: {
        Row: {
          amor: string | null
          aprofundamento: string | null
          arquetipos: string | null
          astrologia: string | null
          cabala: string | null
          citacao: string | null
          created_at: string
          created_by: string | null
          elemento: string | null
          espiritualidade: string | null
          essencia: string | null
          id: string
          image_url: string | null
          jornada: string | null
          keywords: string[]
          luz: string | null
          naipe: Database["public"]["Enums"]["arcano_naipe"] | null
          name: string
          number: number
          numeral: string | null
          numerologia: string | null
          pratica: string | null
          quiz_id: string | null
          revisao_rapida: string | null
          simbolos_centrais: string | null
          sombra: string | null
          status: Database["public"]["Enums"]["module_status"]
          subtitle: string | null
          tags: string[]
          tier: Database["public"]["Enums"]["module_tier"]
          trabalho: string | null
          type: Database["public"]["Enums"]["arcano_type"]
          updated_at: string
          validated: boolean
          voz_do_arcano: string | null
        }
        Insert: {
          amor?: string | null
          aprofundamento?: string | null
          arquetipos?: string | null
          astrologia?: string | null
          cabala?: string | null
          citacao?: string | null
          created_at?: string
          created_by?: string | null
          elemento?: string | null
          espiritualidade?: string | null
          essencia?: string | null
          id?: string
          image_url?: string | null
          jornada?: string | null
          keywords?: string[]
          luz?: string | null
          naipe?: Database["public"]["Enums"]["arcano_naipe"] | null
          name: string
          number: number
          numeral?: string | null
          numerologia?: string | null
          pratica?: string | null
          quiz_id?: string | null
          revisao_rapida?: string | null
          simbolos_centrais?: string | null
          sombra?: string | null
          status?: Database["public"]["Enums"]["module_status"]
          subtitle?: string | null
          tags?: string[]
          tier?: Database["public"]["Enums"]["module_tier"]
          trabalho?: string | null
          type: Database["public"]["Enums"]["arcano_type"]
          updated_at?: string
          validated?: boolean
          voz_do_arcano?: string | null
        }
        Update: {
          amor?: string | null
          aprofundamento?: string | null
          arquetipos?: string | null
          astrologia?: string | null
          cabala?: string | null
          citacao?: string | null
          created_at?: string
          created_by?: string | null
          elemento?: string | null
          espiritualidade?: string | null
          essencia?: string | null
          id?: string
          image_url?: string | null
          jornada?: string | null
          keywords?: string[]
          luz?: string | null
          naipe?: Database["public"]["Enums"]["arcano_naipe"] | null
          name?: string
          number?: number
          numeral?: string | null
          numerologia?: string | null
          pratica?: string | null
          quiz_id?: string | null
          revisao_rapida?: string | null
          simbolos_centrais?: string | null
          sombra?: string | null
          status?: Database["public"]["Enums"]["module_status"]
          subtitle?: string | null
          tags?: string[]
          tier?: Database["public"]["Enums"]["module_tier"]
          trabalho?: string | null
          type?: Database["public"]["Enums"]["arcano_type"]
          updated_at?: string
          validated?: boolean
          voz_do_arcano?: string | null
        }
        Relationships: []
      }
      cms_module_lessons: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          module_id: string
          order_index: number
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          module_id: string
          order_index?: number
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          module_id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_module_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "cms_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_modules: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          editorial_description: string | null
          icon: string | null
          id: string
          name: string
          order_index: number
          route_prefix: string | null
          short_description: string | null
          slug: string
          status: Database["public"]["Enums"]["module_status"]
          theme_color: string | null
          tier: Database["public"]["Enums"]["module_tier"]
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          editorial_description?: string | null
          icon?: string | null
          id?: string
          name: string
          order_index?: number
          route_prefix?: string | null
          short_description?: string | null
          slug: string
          status?: Database["public"]["Enums"]["module_status"]
          theme_color?: string | null
          tier?: Database["public"]["Enums"]["module_tier"]
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          editorial_description?: string | null
          icon?: string | null
          id?: string
          name?: string
          order_index?: number
          route_prefix?: string | null
          short_description?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["module_status"]
          theme_color?: string | null
          tier?: Database["public"]["Enums"]["module_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      daily_challenge_completions: {
        Row: {
          challenge_date: string
          challenge_id: string
          created_at: string
          id: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          challenge_date?: string
          challenge_id: string
          created_at?: string
          id?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          challenge_date?: string
          challenge_id?: string
          created_at?: string
          id?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      gift_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          current_uses: number
          duration_days: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          current_uses?: number
          duration_days?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number
          duration_days?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
        }
        Relationships: []
      }
      gift_redemptions: {
        Row: {
          gift_code_id: string
          id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          gift_code_id: string
          id?: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          gift_code_id?: string
          id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_redemptions_gift_code_id_fkey"
            columns: ["gift_code_id"]
            isOneToOne: false
            referencedRelation: "gift_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_beta_tester: boolean
          is_premium: boolean
          premium_source: string | null
          premium_until: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_beta_tester?: boolean
          is_premium?: boolean
          premium_source?: string | null
          premium_until?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_beta_tester?: boolean
          is_premium?: boolean
          premium_source?: string | null
          premium_until?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          question_index: number
          quiz_id: string
          selected_answer: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          question_index: number
          quiz_id: string
          selected_answer: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          question_index?: number
          quiz_id?: string
          selected_answer?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      user_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_name: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_name: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_name?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_exercises: string[]
          completed_lessons: string[]
          completed_modules: string[]
          completed_quizzes: string[]
          created_at: string
          id: string
          last_active: string
          level: number
          onboarding_completed: boolean
          streak: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          completed_exercises?: string[]
          completed_lessons?: string[]
          completed_modules?: string[]
          completed_quizzes?: string[]
          created_at?: string
          id?: string
          last_active?: string
          level?: number
          onboarding_completed?: boolean
          streak?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          completed_exercises?: string[]
          completed_lessons?: string[]
          completed_modules?: string[]
          completed_quizzes?: string[]
          created_at?: string
          id?: string
          last_active?: string
          level?: number
          onboarding_completed?: boolean
          streak?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      redeem_gift_code: {
        Args: { _code: string; _user_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      arcano_naipe: "copas" | "ouros" | "espadas" | "paus"
      arcano_type: "maior" | "menor"
      module_status: "empty" | "partial" | "draft" | "published"
      module_tier: "free" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      arcano_naipe: ["copas", "ouros", "espadas", "paus"],
      arcano_type: ["maior", "menor"],
      module_status: ["empty", "partial", "draft", "published"],
      module_tier: ["free", "premium"],
    },
  },
} as const

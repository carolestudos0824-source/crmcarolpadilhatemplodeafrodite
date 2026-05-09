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
      admin_audit_log: {
        Row: {
          action: string
          admin_email: string | null
          admin_id: string
          created_at: string
          details: Json
          id: string
          target_id: string | null
          target_label: string | null
          target_type: string
        }
        Insert: {
          action: string
          admin_email?: string | null
          admin_id: string
          created_at?: string
          details?: Json
          id?: string
          target_id?: string | null
          target_label?: string | null
          target_type: string
        }
        Update: {
          action?: string
          admin_email?: string | null
          admin_id?: string
          created_at?: string
          details?: Json
          id?: string
          target_id?: string | null
          target_label?: string | null
          target_type?: string
        }
        Relationships: []
      }
      atendimentos: {
        Row: {
          cartas: Json | null
          cliente_id: string
          created_at: string
          data: string
          id: string
          leitura_gerada: string | null
          magia_indicada: string | null
          observacoes: string | null
          relato: string | null
          situacao: string | null
          texto_whatsapp: string | null
          user_id: string
          valor_cobrado: number | null
        }
        Insert: {
          cartas?: Json | null
          cliente_id: string
          created_at?: string
          data?: string
          id?: string
          leitura_gerada?: string | null
          magia_indicada?: string | null
          observacoes?: string | null
          relato?: string | null
          situacao?: string | null
          texto_whatsapp?: string | null
          user_id: string
          valor_cobrado?: number | null
        }
        Update: {
          cartas?: Json | null
          cliente_id?: string
          created_at?: string
          data?: string
          id?: string
          leitura_gerada?: string | null
          magia_indicada?: string | null
          observacoes?: string | null
          relato?: string | null
          situacao?: string | null
          texto_whatsapp?: string | null
          user_id?: string
          valor_cobrado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "atendimentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      beta_feedback: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          message: string
          page: string | null
          rating: number | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["feedback_status"]
          type: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message: string
          page?: string | null
          rating?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
          type: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message?: string
          page?: string | null
          rating?: number | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["feedback_status"]
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          cidade: string | null
          created_at: string
          data_nascimento: string | null
          data_nascimento_envolvido: string | null
          id: string
          instagram: string | null
          nome: string | null
          nome_envolvido: string | null
          observacoes_privadas: string | null
          origem: string | null
          proximo_retorno: string | null
          situacao_principal: string | null
          status_comercial: string | null
          status_relacao: string | null
          tags: string[] | null
          temperatura: string | null
          ultimo_atendimento: string | null
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          data_nascimento?: string | null
          data_nascimento_envolvido?: string | null
          id?: string
          instagram?: string | null
          nome?: string | null
          nome_envolvido?: string | null
          observacoes_privadas?: string | null
          origem?: string | null
          proximo_retorno?: string | null
          situacao_principal?: string | null
          status_comercial?: string | null
          status_relacao?: string | null
          tags?: string[] | null
          temperatura?: string | null
          ultimo_atendimento?: string | null
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          cidade?: string | null
          created_at?: string
          data_nascimento?: string | null
          data_nascimento_envolvido?: string | null
          id?: string
          instagram?: string | null
          nome?: string | null
          nome_envolvido?: string | null
          observacoes_privadas?: string | null
          origem?: string | null
          proximo_retorno?: string | null
          situacao_principal?: string | null
          status_comercial?: string | null
          status_relacao?: string | null
          tags?: string[] | null
          temperatura?: string | null
          ultimo_atendimento?: string | null
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
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
      magias: {
        Row: {
          created_at: string
          id: string
          intensidade: string | null
          nome: string
          objetivo: string | null
          orientacao: string | null
          quando_indicar: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          intensidade?: string | null
          nome: string
          objetivo?: string | null
          orientacao?: string | null
          quando_indicar?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          intensidade?: string | null
          nome?: string
          objetivo?: string | null
          orientacao?: string | null
          quando_indicar?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          is_beta_tester: boolean
          is_premium: boolean
          onboarding_goal: string | null
          onboarding_level: string | null
          premium_source: string | null
          premium_until: string | null
          stripe_customer_id: string | null
          student_name: string | null
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
          onboarding_goal?: string | null
          onboarding_level?: string | null
          premium_source?: string | null
          premium_until?: string | null
          stripe_customer_id?: string | null
          student_name?: string | null
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
          onboarding_goal?: string | null
          onboarding_level?: string | null
          premium_source?: string | null
          premium_until?: string | null
          stripe_customer_id?: string | null
          student_name?: string | null
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
      subscription_events: {
        Row: {
          amount_cents: number | null
          created_at: string
          currency: string | null
          event_type: Database["public"]["Enums"]["subscription_event_type"]
          id: string
          occurred_at: string
          plan_code: string | null
          provider: Database["public"]["Enums"]["billing_provider"]
          provider_customer_id: string | null
          provider_event_id: string | null
          provider_subscription_id: string | null
          raw_payload: Json
          user_id: string | null
        }
        Insert: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          event_type: Database["public"]["Enums"]["subscription_event_type"]
          id?: string
          occurred_at?: string
          plan_code?: string | null
          provider: Database["public"]["Enums"]["billing_provider"]
          provider_customer_id?: string | null
          provider_event_id?: string | null
          provider_subscription_id?: string | null
          raw_payload?: Json
          user_id?: string | null
        }
        Update: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          event_type?: Database["public"]["Enums"]["subscription_event_type"]
          id?: string
          occurred_at?: string
          plan_code?: string | null
          provider?: Database["public"]["Enums"]["billing_provider"]
          provider_customer_id?: string | null
          provider_event_id?: string | null
          provider_subscription_id?: string | null
          raw_payload?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      tarot_content: {
        Row: {
          arcana_type: string
          astrology: string | null
          created_at: string | null
          direct_meaning: string
          element: string | null
          id: string
          image_url: string | null
          kabalistic_number: number | null
          keywords: string[]
          name: string
          number: number
          phrases: Json | null
          reverse_meaning: string
          situations: string[] | null
          suit: string | null
        }
        Insert: {
          arcana_type: string
          astrology?: string | null
          created_at?: string | null
          direct_meaning: string
          element?: string | null
          id: string
          image_url?: string | null
          kabalistic_number?: number | null
          keywords: string[]
          name: string
          number: number
          phrases?: Json | null
          reverse_meaning: string
          situations?: string[] | null
          suit?: string | null
        }
        Update: {
          arcana_type?: string
          astrology?: string | null
          created_at?: string | null
          direct_meaning?: string
          element?: string | null
          id?: string
          image_url?: string | null
          kabalistic_number?: number | null
          keywords?: string[]
          name?: string
          number?: number
          phrases?: Json | null
          reverse_meaning?: string
          situations?: string[] | null
          suit?: string | null
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
          badges: Json
          certificates_earned: Json
          completed_exercises: string[]
          completed_lessons: string[]
          completed_modules: string[]
          completed_quizzes: string[]
          created_at: string
          current_module: string
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
          badges?: Json
          certificates_earned?: Json
          completed_exercises?: string[]
          completed_lessons?: string[]
          completed_modules?: string[]
          completed_quizzes?: string[]
          created_at?: string
          current_module?: string
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
          badges?: Json
          certificates_earned?: Json
          completed_exercises?: string[]
          completed_lessons?: string[]
          completed_modules?: string[]
          completed_quizzes?: string[]
          created_at?: string
          current_module?: string
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
      apply_arcano_backfill: { Args: { _payload: Json }; Returns: Json }
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
      billing_provider: "stripe" | "paddle" | "revenuecat" | "manual"
      feedback_status: "aberto" | "em_andamento" | "resolvido"
      module_status: "empty" | "partial" | "draft" | "published"
      module_tier: "free" | "premium"
      quiz_difficulty: "easy" | "medium" | "hard"
      subscription_event_type:
        | "checkout_completed"
        | "subscription_created"
        | "subscription_renewed"
        | "subscription_cancelled"
        | "subscription_expired"
        | "payment_succeeded"
        | "payment_failed"
        | "refund_issued"
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
      billing_provider: ["stripe", "paddle", "revenuecat", "manual"],
      feedback_status: ["aberto", "em_andamento", "resolvido"],
      module_status: ["empty", "partial", "draft", "published"],
      module_tier: ["free", "premium"],
      quiz_difficulty: ["easy", "medium", "hard"],
      subscription_event_type: [
        "checkout_completed",
        "subscription_created",
        "subscription_renewed",
        "subscription_cancelled",
        "subscription_expired",
        "payment_succeeded",
        "payment_failed",
        "refund_issued",
      ],
    },
  },
} as const

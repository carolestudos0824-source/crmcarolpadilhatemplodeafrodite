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
      admin_users: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_conversations: {
        Row: {
          created_at: string
          id: string
          project_id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_app_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json
          module_key: string | null
          project_id: string
          role: string
          step_key: string | null
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json
          module_key?: string | null
          project_id: string
          role: string
          step_key?: string | null
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          module_key?: string | null
          project_id?: string
          role?: string
          step_key?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "agent_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_app_projects"
            referencedColumns: ["id"]
          },
        ]
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
      gift_code_redemption_attempts: {
        Row: {
          code_hash: string
          created_at: string
          id: string
          metadata: Json
          outcome: string
          user_id: string
        }
        Insert: {
          code_hash: string
          created_at?: string
          id?: string
          metadata?: Json
          outcome: string
          user_id: string
        }
        Update: {
          code_hash?: string
          created_at?: string
          id?: string
          metadata?: Json
          outcome?: string
          user_id?: string
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
      manual_sales: {
        Row: {
          access_granted_at: string | null
          access_revoked_at: string | null
          access_source: string
          access_status: string
          admin_notes: string | null
          amount: number
          buyer_email: string
          buyer_name: string | null
          created_at: string
          created_by: string | null
          currency: string
          id: string
          payment_method: string | null
          payment_reference: string | null
          payment_status: string
          product_name: string
          updated_at: string
        }
        Insert: {
          access_granted_at?: string | null
          access_revoked_at?: string | null
          access_source?: string
          access_status?: string
          admin_notes?: string | null
          amount?: number
          buyer_email: string
          buyer_name?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          product_name?: string
          updated_at?: string
        }
        Update: {
          access_granted_at?: string | null
          access_revoked_at?: string | null
          access_source?: string
          access_status?: string
          admin_notes?: string | null
          amount?: number
          buyer_email?: string
          buyer_name?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          product_name?: string
          updated_at?: string
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
      project_contexts: {
        Row: {
          context_json: Json
          id: string
          project_id: string
          summary: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context_json?: Json
          id?: string
          project_id: string
          summary?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context_json?: Json
          id?: string
          project_id?: string
          summary?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_contexts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "user_app_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_outputs: {
        Row: {
          approved: boolean
          content: string
          created_at: string
          id: string
          module_key: string
          project_id: string
          step_key: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          approved?: boolean
          content: string
          created_at?: string
          id?: string
          module_key: string
          project_id: string
          step_key?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          approved?: boolean
          content?: string
          created_at?: string
          id?: string
          module_key?: string
          project_id?: string
          step_key?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_outputs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_app_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_improvement_logs: {
        Row: {
          created_at: string
          id: string
          input_length: number
          mode: string
          module_id: string | null
          module_title: string | null
          output_length: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_length?: number
          mode: string
          module_id?: string | null
          module_title?: string | null
          output_length?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          input_length?: number
          mode?: string
          module_id?: string | null
          module_title?: string | null
          output_length?: number
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
      saved_prompts: {
        Row: {
          content: string
          created_at: string
          id: string
          source_module: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          source_module?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          source_module?: string | null
          title?: string | null
          user_id?: string
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
      support_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
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
      user_access: {
        Row: {
          created_at: string
          email: string
          has_access: boolean
          id: string
          source: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          has_access?: boolean
          id?: string
          source?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          has_access?: boolean
          id?: string
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      user_app_project_prompts: {
        Row: {
          created_at: string
          id: string
          module_id: string | null
          module_title: string | null
          project_id: string
          prompt_text: string
          prompt_type: string
          source: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          module_id?: string | null
          module_title?: string | null
          project_id: string
          prompt_text: string
          prompt_type: string
          source: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          module_id?: string | null
          module_title?: string | null
          project_id?: string
          prompt_text?: string
          prompt_type?: string
          source?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_app_project_prompts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "user_app_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_app_projects: {
        Row: {
          app_description: string | null
          app_name: string
          archived_at: string | null
          completed_module_ids: string[]
          created_at: string
          current_module_id: string | null
          id: string
          last_opened_at: string | null
          logo_path: string | null
          logo_updated_at: string | null
          main_promise: string | null
          main_user_action: string | null
          needs_admin: boolean
          needs_checkout: boolean
          needs_database: boolean
          needs_login: boolean
          needs_paid_area: boolean
          notes: string | null
          pricing_model: string | null
          problem_solved: string | null
          product_or_service: string | null
          status: string
          target_audience: string | null
          updated_at: string
          user_id: string
          visual_style: string | null
        }
        Insert: {
          app_description?: string | null
          app_name: string
          archived_at?: string | null
          completed_module_ids?: string[]
          created_at?: string
          current_module_id?: string | null
          id?: string
          last_opened_at?: string | null
          logo_path?: string | null
          logo_updated_at?: string | null
          main_promise?: string | null
          main_user_action?: string | null
          needs_admin?: boolean
          needs_checkout?: boolean
          needs_database?: boolean
          needs_login?: boolean
          needs_paid_area?: boolean
          notes?: string | null
          pricing_model?: string | null
          problem_solved?: string | null
          product_or_service?: string | null
          status?: string
          target_audience?: string | null
          updated_at?: string
          user_id: string
          visual_style?: string | null
        }
        Update: {
          app_description?: string | null
          app_name?: string
          archived_at?: string | null
          completed_module_ids?: string[]
          created_at?: string
          current_module_id?: string | null
          id?: string
          last_opened_at?: string | null
          logo_path?: string | null
          logo_updated_at?: string | null
          main_promise?: string | null
          main_user_action?: string | null
          needs_admin?: boolean
          needs_checkout?: boolean
          needs_database?: boolean
          needs_login?: boolean
          needs_paid_area?: boolean
          notes?: string | null
          pricing_model?: string | null
          problem_solved?: string | null
          product_or_service?: string | null
          status?: string
          target_audience?: string | null
          updated_at?: string
          user_id?: string
          visual_style?: string | null
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
      user_progress_state: {
        Row: {
          active_module: string | null
          checklist: Json
          commands_done: Json
          modules_done: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          active_module?: string | null
          checklist?: Json
          commands_done?: Json
          modules_done?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          active_module?: string | null
          checklist?: Json
          commands_done?: Json
          modules_done?: Json
          updated_at?: string
          user_id?: string
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
      admin_create_gift_code: {
        Args: {
          _code: string
          _duration_days: number
          _expires_at?: string
          _is_active?: boolean
          _max_uses: number
        }
        Returns: Json
      }
      admin_create_manual_sale: {
        Args: {
          _admin_notes?: string
          _amount?: number
          _buyer_email: string
          _buyer_name?: string
          _payment_method?: string
          _payment_reference?: string
          _payment_status?: string
        }
        Returns: Json
      }
      admin_get_manual_sale: { Args: { _sale_id: string }; Returns: Json }
      admin_grant_access_from_sale: {
        Args: { _sale_id: string }
        Returns: Json
      }
      admin_list_access_logs: {
        Args: { _limit?: number }
        Returns: {
          action: string
          admin_email: string
          admin_id: string
          created_at: string
          id: string
          new_has_access: boolean
          note: string
          previous_has_access: boolean
          source: string
          target_email: string
        }[]
      }
      admin_list_admin_audit_logs: {
        Args: { _limit?: number }
        Returns: {
          action: string
          admin_email: string
          admin_id: string
          created_at: string
          details: Json
          id: string
          target_id: string
          target_label: string
          target_type: string
        }[]
      }
      admin_list_buyers: {
        Args: { _limit?: number }
        Returns: {
          access_created_at: string
          display_name: string
          email: string
          has_access: boolean
          is_admin: boolean
          source: string
          user_created_at: string
          user_id: string
        }[]
      }
      admin_list_buyers_overview: {
        Args: {
          _access_filter?: string
          _before_email?: string
          _before_sort_at?: string
          _limit?: number
          _payment_status?: string
          _period_days?: number
          _search?: string
          _source?: string
        }
        Returns: {
          access_source: string
          access_updated_at: string
          buyer_name: string
          cancelled_count: number
          email: string
          has_access: boolean
          last_access_status: string
          last_payment_status: string
          last_sale_at: string
          last_sale_id: string
          origin: string
          paid_confirmed_count: number
          pending_count: number
          refunded_count: number
          sales_count: number
          sort_at: string
          total_paid_confirmed: number
          user_created_at: string
          user_id: string
        }[]
      }
      admin_list_manual_sales: {
        Args: {
          _access_status?: string
          _before_created_at?: string
          _before_id?: string
          _limit?: number
          _payment_status?: string
          _search?: string
        }
        Returns: {
          access_granted_at: string
          access_revoked_at: string
          access_source: string
          access_status: string
          admin_notes: string
          amount: number
          buyer_email: string
          buyer_name: string
          created_at: string
          currency: string
          id: string
          payment_method: string
          payment_reference: string
          payment_status: string
          product_name: string
          updated_at: string
        }[]
      }
      admin_lookup_user: {
        Args: { _email: string }
        Returns: {
          access_created_at: string
          access_exists: boolean
          email: string
          has_access: boolean
          source: string
          user_id: string
        }[]
      }
      admin_revoke_access_from_sale: {
        Args: { _sale_id: string }
        Returns: Json
      }
      admin_set_access: {
        Args: { _has_access: boolean; _user_id: string }
        Returns: Json
      }
      admin_set_gift_code_active: {
        Args: { _code_id: string; _is_active: boolean }
        Returns: Json
      }
      admin_update_manual_sale: {
        Args: {
          _admin_notes?: string
          _amount?: number
          _buyer_name?: string
          _payment_method?: string
          _payment_reference?: string
          _payment_status?: string
          _sale_id: string
        }
        Returns: Json
      }
      apply_arcano_backfill: { Args: { _payload: Json }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { _user_id: string }; Returns: boolean }
      redeem_gift_code: {
        Args: { _code: string; _user_id?: string }
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

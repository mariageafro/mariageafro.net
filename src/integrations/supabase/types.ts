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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      abonnements: {
        Row: {
          actif: boolean
          created_at: string
          date_debut: string
          date_fin: string | null
          id: string
          prestataire_id: string
          prix: number | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          type: Database["public"]["Enums"]["subscription_type"]
          updated_at: string
        }
        Insert: {
          actif?: boolean
          created_at?: string
          date_debut?: string
          date_fin?: string | null
          id?: string
          prestataire_id: string
          prix?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
        }
        Update: {
          actif?: boolean
          created_at?: string
          date_debut?: string
          date_fin?: string | null
          id?: string
          prestataire_id?: string
          prix?: number | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "abonnements_prestataire_id_fkey"
            columns: ["prestataire_id"]
            isOneToOne: false
            referencedRelation: "prestataires"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      avis: {
        Row: {
          approved: boolean
          client_id: string
          commentaire: string | null
          created_at: string
          id: string
          note: number
          prestataire_id: string
          updated_at: string
        }
        Insert: {
          approved?: boolean
          client_id: string
          commentaire?: string | null
          created_at?: string
          id?: string
          note: number
          prestataire_id: string
          updated_at?: string
        }
        Update: {
          approved?: boolean
          client_id?: string
          commentaire?: string | null
          created_at?: string
          id?: string
          note?: number
          prestataire_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "avis_prestataire_id_fkey"
            columns: ["prestataire_id"]
            isOneToOne: false
            referencedRelation: "prestataires"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          created_at: string
          flag_emoji: string | null
          id: string
          name: string
          priority: number | null
        }
        Insert: {
          code: string
          created_at?: string
          flag_emoji?: string | null
          id?: string
          name: string
          priority?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          flag_emoji?: string | null
          id?: string
          name?: string
          priority?: number | null
        }
        Relationships: []
      }
      cultural_recommendations_cache: {
        Row: {
          cache_key: string
          created_at: string
          expires_at: string
          id: string
          recommendations: Json
          user_id: string
        }
        Insert: {
          cache_key: string
          created_at?: string
          expires_at?: string
          id?: string
          recommendations: Json
          user_id: string
        }
        Update: {
          cache_key?: string
          created_at?: string
          expires_at?: string
          id?: string
          recommendations?: Json
          user_id?: string
        }
        Relationships: []
      }
      day_of_timeline: {
        Row: {
          created_at: string
          event_date: string | null
          id: string
          is_public: boolean | null
          share_code: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_date?: string | null
          id?: string
          is_public?: boolean | null
          share_code?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_date?: string | null
          id?: string
          is_public?: boolean | null
          share_code?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      day_of_timeline_items: {
        Row: {
          address: string | null
          created_at: string
          end_time: string | null
          google_maps_link: string | null
          id: string
          notes: string | null
          responsible_person: string | null
          sort_order: number | null
          start_time: string
          timeline_id: string
          title: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          end_time?: string | null
          google_maps_link?: string | null
          id?: string
          notes?: string | null
          responsible_person?: string | null
          sort_order?: number | null
          start_time: string
          timeline_id: string
          title: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          end_time?: string | null
          google_maps_link?: string | null
          id?: string
          notes?: string | null
          responsible_person?: string | null
          sort_order?: number | null
          start_time?: string
          timeline_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "day_of_timeline_items_timeline_id_fkey"
            columns: ["timeline_id"]
            isOneToOne: false
            referencedRelation: "day_of_timeline"
            referencedColumns: ["id"]
          },
        ]
      }
      medias: {
        Row: {
          created_at: string
          id: string
          ordre: number | null
          prestataire_id: string
          titre: string | null
          type: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          ordre?: number | null
          prestataire_id: string
          titre?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          ordre?: number | null
          prestataire_id?: string
          titre?: string | null
          type?: Database["public"]["Enums"]["media_type"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "medias_prestataire_id_fkey"
            columns: ["prestataire_id"]
            isOneToOne: false
            referencedRelation: "prestataires"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: string | null
          content_en: string | null
          content_fr: string | null
          created_at: string
          hero_image_url: string | null
          id: string
          slug: string
          title: string
          title_en: string | null
          title_fr: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          content_en?: string | null
          content_fr?: string | null
          created_at?: string
          hero_image_url?: string | null
          id?: string
          slug: string
          title: string
          title_en?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          content_en?: string | null
          content_fr?: string | null
          created_at?: string
          hero_image_url?: string | null
          id?: string
          slug?: string
          title?: string
          title_en?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      planning_tasks: {
        Row: {
          auto_generated: boolean | null
          category: string | null
          created_at: string
          description: string | null
          done: boolean | null
          due_date: string | null
          id: string
          linked_vendor_id: string | null
          priority: string | null
          sort_order: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_generated?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          done?: boolean | null
          due_date?: string | null
          id?: string
          linked_vendor_id?: string | null
          priority?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_generated?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          done?: boolean | null
          due_date?: string | null
          id?: string
          linked_vendor_id?: string | null
          priority?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prestataire_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          instagram: string | null
          prestataire_id: string
          site_web: string | null
          telephone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          instagram?: string | null
          prestataire_id: string
          site_web?: string | null
          telephone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          instagram?: string | null
          prestataire_id?: string
          site_web?: string | null
          telephone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prestataire_contacts_prestataire_id_fkey"
            columns: ["prestataire_id"]
            isOneToOne: true
            referencedRelation: "prestataires"
            referencedColumns: ["id"]
          },
        ]
      }
      prestataires: {
        Row: {
          badge_type: string | null
          caribbean_origins: string[] | null
          caribbean_styles: string[] | null
          categorie_id: string | null
          country_id: string | null
          created_at: string
          description: string | null
          description_en: string | null
          description_fr: string | null
          free_until: string | null
          id: string
          import_batch: string | null
          is_featured: boolean | null
          is_lifetime_featured: boolean | null
          langues: string[] | null
          lat: number | null
          lng: number | null
          nom_entreprise: string
          origine_culturelle: string | null
          pays: string | null
          photo_url: string | null
          priority_score: number | null
          score_ranking: number | null
          slug: string
          sous_categorie: string | null
          statut: Database["public"]["Enums"]["prestataire_statut"]
          updated_at: string
          user_id: string
          verified: boolean
          ville: string | null
        }
        Insert: {
          badge_type?: string | null
          caribbean_origins?: string[] | null
          caribbean_styles?: string[] | null
          categorie_id?: string | null
          country_id?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_fr?: string | null
          free_until?: string | null
          id?: string
          import_batch?: string | null
          is_featured?: boolean | null
          is_lifetime_featured?: boolean | null
          langues?: string[] | null
          lat?: number | null
          lng?: number | null
          nom_entreprise: string
          origine_culturelle?: string | null
          pays?: string | null
          photo_url?: string | null
          priority_score?: number | null
          score_ranking?: number | null
          slug: string
          sous_categorie?: string | null
          statut?: Database["public"]["Enums"]["prestataire_statut"]
          updated_at?: string
          user_id: string
          verified?: boolean
          ville?: string | null
        }
        Update: {
          badge_type?: string | null
          caribbean_origins?: string[] | null
          caribbean_styles?: string[] | null
          categorie_id?: string | null
          country_id?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_fr?: string | null
          free_until?: string | null
          id?: string
          import_batch?: string | null
          is_featured?: boolean | null
          is_lifetime_featured?: boolean | null
          langues?: string[] | null
          lat?: number | null
          lng?: number | null
          nom_entreprise?: string
          origine_culturelle?: string | null
          pays?: string | null
          photo_url?: string | null
          priority_score?: number | null
          score_ranking?: number | null
          slug?: string
          sous_categorie?: string | null
          statut?: Database["public"]["Enums"]["prestataire_statut"]
          updated_at?: string
          user_id?: string
          verified?: boolean
          ville?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prestataires_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prestataires_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rsvp_events: {
        Row: {
          created_at: string
          deadline: string | null
          event_date: string | null
          event_location: string | null
          id: string
          title: string
          updated_at: string
          user_id: string
          welcome_message: string | null
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          event_date?: string | null
          event_location?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id: string
          welcome_message?: string | null
        }
        Update: {
          created_at?: string
          deadline?: string | null
          event_date?: string | null
          event_location?: string | null
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
          welcome_message?: string | null
        }
        Relationships: []
      }
      rsvp_guests: {
        Row: {
          companions: Json | null
          created_at: string
          dietary_restrictions: string | null
          email: string | null
          event_id: string
          first_name: string
          group_name: string | null
          guest_message: string | null
          id: string
          last_name: string | null
          max_companions: number
          phone: string | null
          responded_at: string | null
          status: string
          token: string
          updated_at: string
        }
        Insert: {
          companions?: Json | null
          created_at?: string
          dietary_restrictions?: string | null
          email?: string | null
          event_id: string
          first_name: string
          group_name?: string | null
          guest_message?: string | null
          id?: string
          last_name?: string | null
          max_companions?: number
          phone?: string | null
          responded_at?: string | null
          status?: string
          token?: string
          updated_at?: string
        }
        Update: {
          companions?: Json | null
          created_at?: string
          dietary_restrictions?: string | null
          email?: string | null
          event_id?: string
          first_name?: string
          group_name?: string | null
          guest_message?: string | null
          id?: string
          last_name?: string | null
          max_companions?: number
          phone?: string | null
          responded_at?: string | null
          status?: string
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvp_guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "rsvp_events"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_categories: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_tool_items: {
        Row: {
          amount: number | null
          created_at: string
          date: string | null
          done: boolean
          id: string
          meta: Json | null
          title: string
          tool_slug: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          date?: string | null
          done?: boolean
          id?: string
          meta?: Json | null
          title: string
          tool_slug: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          date?: string | null
          done?: boolean
          id?: string
          meta?: Json | null
          title?: string
          tool_slug?: string
          user_id?: string
        }
        Relationships: []
      }
      user_tools: {
        Row: {
          data: Json | null
          id: string
          tool_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          data?: Json | null
          id?: string
          tool_slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          data?: Json | null
          id?: string
          tool_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_wedding_profile: {
        Row: {
          city: string | null
          country: string | null
          couple_display_name: string | null
          couple_quote: string | null
          created_at: string
          estimated_budget: number | null
          guest_count: number | null
          id: string
          is_afro_wedding: boolean | null
          onboarding_completed: boolean | null
          origin_partner_one: string | null
          origin_partner_two: string | null
          partner_one_first_name: string
          partner_one_last_name: string | null
          partner_two_first_name: string
          partner_two_last_name: string | null
          updated_at: string
          user_id: string
          wedding_date: string | null
          wedding_style: string | null
          wedding_type: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          couple_display_name?: string | null
          couple_quote?: string | null
          created_at?: string
          estimated_budget?: number | null
          guest_count?: number | null
          id?: string
          is_afro_wedding?: boolean | null
          onboarding_completed?: boolean | null
          origin_partner_one?: string | null
          origin_partner_two?: string | null
          partner_one_first_name: string
          partner_one_last_name?: string | null
          partner_two_first_name: string
          partner_two_last_name?: string | null
          updated_at?: string
          user_id: string
          wedding_date?: string | null
          wedding_style?: string | null
          wedding_type?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          couple_display_name?: string | null
          couple_quote?: string | null
          created_at?: string
          estimated_budget?: number | null
          guest_count?: number | null
          id?: string
          is_afro_wedding?: boolean | null
          onboarding_completed?: boolean | null
          origin_partner_one?: string | null
          origin_partner_two?: string | null
          partner_one_first_name?: string
          partner_one_last_name?: string | null
          partner_two_first_name?: string
          partner_two_last_name?: string | null
          updated_at?: string
          user_id?: string
          wedding_date?: string | null
          wedding_style?: string | null
          wedding_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_approve_review: {
        Args: { _approved: boolean; _review_id: string }
        Returns: undefined
      }
      admin_import_prestataire: {
        Args: {
          _badge_type?: string
          _categorie_id?: string
          _description?: string
          _description_en?: string
          _description_fr?: string
          _email?: string
          _free_until?: string
          _import_batch?: string
          _instagram?: string
          _is_featured?: boolean
          _is_lifetime_featured?: boolean
          _nom_entreprise: string
          _pays?: string
          _photo_url?: string
          _priority_score?: number
          _site_web?: string
          _statut?: Database["public"]["Enums"]["prestataire_statut"]
          _telephone?: string
          _ville?: string
          _whatsapp?: string
        }
        Returns: string
      }
      admin_update_prestataire: {
        Args: { _prestataire_id: string; _updates: Json }
        Returns: undefined
      }
      calculate_ranking_score: {
        Args: { _prestataire_id: string }
        Returns: number
      }
      can_upload_media: {
        Args: {
          _media_type: Database["public"]["Enums"]["media_type"]
          _prestataire_id: string
        }
        Returns: boolean
      }
      downgrade_expired_ambassadors: { Args: never; Returns: undefined }
      generate_planning_tasks: {
        Args: { _user_id: string }
        Returns: undefined
      }
      get_prestataire_id_for_user: {
        Args: { _user_id: string }
        Returns: string
      }
      get_subscription_type: {
        Args: { _prestataire_id: string }
        Returns: Database["public"]["Enums"]["subscription_type"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      owns_prestataire: {
        Args: { _prestataire_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "client" | "prestataire"
      media_type: "photo" | "video"
      prestataire_statut: "actif" | "suspendu" | "en_attente" | "draft"
      subscription_type: "gratuit" | "pro" | "premium" | "elite"
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
      app_role: ["admin", "client", "prestataire"],
      media_type: ["photo", "video"],
      prestataire_statut: ["actif", "suspendu", "en_attente", "draft"],
      subscription_type: ["gratuit", "pro", "premium", "elite"],
    },
  },
} as const

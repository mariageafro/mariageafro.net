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
      prestataires: {
        Row: {
          caribbean_origins: string[] | null
          caribbean_styles: string[] | null
          categorie_id: string | null
          country_id: string | null
          created_at: string
          description: string | null
          id: string
          instagram: string | null
          langues: string[] | null
          lat: number | null
          lng: number | null
          nom_entreprise: string
          origine_culturelle: string | null
          pays: string | null
          score_ranking: number | null
          site_web: string | null
          slug: string
          sous_categorie: string | null
          statut: Database["public"]["Enums"]["prestataire_statut"]
          telephone: string | null
          updated_at: string
          user_id: string
          verified: boolean
          ville: string | null
          whatsapp: string | null
        }
        Insert: {
          caribbean_origins?: string[] | null
          caribbean_styles?: string[] | null
          categorie_id?: string | null
          country_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instagram?: string | null
          langues?: string[] | null
          lat?: number | null
          lng?: number | null
          nom_entreprise: string
          origine_culturelle?: string | null
          pays?: string | null
          score_ranking?: number | null
          site_web?: string | null
          slug: string
          sous_categorie?: string | null
          statut?: Database["public"]["Enums"]["prestataire_statut"]
          telephone?: string | null
          updated_at?: string
          user_id: string
          verified?: boolean
          ville?: string | null
          whatsapp?: string | null
        }
        Update: {
          caribbean_origins?: string[] | null
          caribbean_styles?: string[] | null
          categorie_id?: string | null
          country_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          instagram?: string | null
          langues?: string[] | null
          lat?: number | null
          lng?: number | null
          nom_entreprise?: string
          origine_culturelle?: string | null
          pays?: string | null
          score_ranking?: number | null
          site_web?: string | null
          slug?: string
          sous_categorie?: string | null
          statut?: Database["public"]["Enums"]["prestataire_statut"]
          telephone?: string | null
          updated_at?: string
          user_id?: string
          verified?: boolean
          ville?: string | null
          whatsapp?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_approve_review: {
        Args: { _approved: boolean; _review_id: string }
        Returns: undefined
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
      prestataire_statut: "actif" | "suspendu" | "en_attente"
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
      prestataire_statut: ["actif", "suspendu", "en_attente"],
      subscription_type: ["gratuit", "pro", "premium", "elite"],
    },
  },
} as const

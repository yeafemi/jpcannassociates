export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          phone: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          phone?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          phone?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      site_collections: {
        Row: {
          collection_key: string;
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          is_published: boolean;
          item_key: string;
          link_label: string | null;
          link_url: string | null;
          metadata: Json;
          page_key: string | null;
          sort_order: number;
          subtitle: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          collection_key: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_published?: boolean;
          item_key: string;
          link_label?: string | null;
          link_url?: string | null;
          metadata?: Json;
          page_key?: string | null;
          sort_order?: number;
          subtitle?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          collection_key?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_published?: boolean;
          item_key?: string;
          link_label?: string | null;
          link_url?: string | null;
          metadata?: Json;
          page_key?: string | null;
          sort_order?: number;
          subtitle?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_pages: {
        Row: {
          content: Json;
          created_at: string;
          hero_description: string | null;
          hero_eyebrow: string | null;
          hero_image_url: string | null;
          hero_title: string | null;
          id: string;
          is_published: boolean;
          page_key: string;
          page_name: string;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          updated_at: string;
        };
        Insert: {
          content?: Json;
          created_at?: string;
          hero_description?: string | null;
          hero_eyebrow?: string | null;
          hero_image_url?: string | null;
          hero_title?: string | null;
          id?: string;
          is_published?: boolean;
          page_key: string;
          page_name: string;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          updated_at?: string;
        };
        Update: {
          content?: Json;
          created_at?: string;
          hero_description?: string | null;
          hero_eyebrow?: string | null;
          hero_image_url?: string | null;
          hero_title?: string | null;
          id?: string;
          is_published?: boolean;
          page_key?: string;
          page_name?: string;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          address_line_1: string | null;
          address_line_2: string | null;
          city: string | null;
          company_name: string;
          country: string | null;
          created_at: string;
          footer_text: string | null;
          id: string;
          logo_url: string | null;
          map_embed_url: string | null;
          primary_email: string | null;
          primary_phone: string | null;
          secondary_email: string | null;
          secondary_phone: string | null;
          social_links: Json;
          tagline: string | null;
          updated_at: string;
          whatsapp_url: string | null;
        };
        Insert: {
          address_line_1?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          company_name: string;
          country?: string | null;
          created_at?: string;
          footer_text?: string | null;
          id?: string;
          logo_url?: string | null;
          map_embed_url?: string | null;
          primary_email?: string | null;
          primary_phone?: string | null;
          secondary_email?: string | null;
          secondary_phone?: string | null;
          social_links?: Json;
          tagline?: string | null;
          updated_at?: string;
          whatsapp_url?: string | null;
        };
        Update: {
          address_line_1?: string | null;
          address_line_2?: string | null;
          city?: string | null;
          company_name?: string;
          country?: string | null;
          created_at?: string;
          footer_text?: string | null;
          id?: string;
          logo_url?: string | null;
          map_embed_url?: string | null;
          primary_email?: string | null;
          primary_phone?: string | null;
          secondary_email?: string | null;
          secondary_phone?: string | null;
          social_links?: Json;
          tagline?: string | null;
          updated_at?: string;
          whatsapp_url?: string | null;
        };
        Relationships: [];
      };
      training_outline_leads: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          organization: string;
          telephone: string;
          training_id: string | null;
          training_slug: string | null;
          training_title: string;
          user_agent: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          organization: string;
          telephone: string;
          training_id?: string | null;
          training_slug?: string | null;
          training_title: string;
          user_agent?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          organization?: string;
          telephone?: string;
          training_id?: string | null;
          training_slug?: string | null;
          training_title?: string;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "training_outline_leads_training_id_fkey";
            columns: ["training_id"];
            isOneToOne: false;
            referencedRelation: "site_collections";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          action_type: string;
          created_at: string;
          details: Json;
          id: string;
          resource_name: string | null;
          resource_type: string;
          user_id: string;
        };
        Insert: {
          action_type: string;
          created_at?: string;
          details?: Json;
          id?: string;
          resource_name?: string | null;
          resource_type: string;
          user_id: string;
        };
        Update: {
          action_type?: string;
          created_at?: string;
          details?: Json;
          id?: string;
          resource_name?: string | null;
          resource_type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          message: string;
          organisation: string | null;
          subject: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          message: string;
          organisation?: string | null;
          subject: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          message?: string;
          organisation?: string | null;
          subject?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      audit_logs_with_users: {
        Row: {
          action_type: string;
          created_at: string;
          details: Json;
          id: string;
          resource_name: string | null;
          resource_type: string;
          user_id: string;
          user_name: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "editor";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const;

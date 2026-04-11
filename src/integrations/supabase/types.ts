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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      gallery_images: {
        Row: {
          category: string
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          org_id: string
          title: string | null
        }
        Insert: {
          category: string
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          org_id?: string
          title?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          org_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_media: {
        Row: {
          created_at: string
          device: string
          id: string
          is_active: boolean
          media_type: string
          media_url: string
          org_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          device: string
          id?: string
          is_active?: boolean
          media_type?: string
          media_url: string
          org_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          device?: string
          id?: string
          is_active?: boolean
          media_type?: string
          media_url?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          invoice_id: string
          org_id: string
          quantity: number
          total: number
          unit: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          invoice_id: string
          org_id?: string
          quantity?: number
          total?: number
          unit?: string
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          invoice_id?: string
          org_id?: string
          quantity?: number
          total?: number
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_settings: {
        Row: {
          accent_color: string | null
          company_address: string | null
          company_email: string | null
          company_name: string | null
          company_phone: string | null
          created_at: string
          default_notes: string | null
          footer_text: string | null
          id: string
          logo_url: string | null
          org_id: string
          tagline: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          accent_color?: string | null
          company_address?: string | null
          company_email?: string | null
          company_name?: string | null
          company_phone?: string | null
          created_at?: string
          default_notes?: string | null
          footer_text?: string | null
          id?: string
          logo_url?: string | null
          org_id?: string
          tagline?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          accent_color?: string | null
          company_address?: string | null
          company_email?: string | null
          company_name?: string | null
          company_phone?: string | null
          created_at?: string
          default_notes?: string | null
          footer_text?: string | null
          id?: string
          logo_url?: string | null
          org_id?: string
          tagline?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_address: string | null
          client_email: string | null
          client_name: string | null
          created_at: string
          due_date: string | null
          id: string
          invoice_number: string
          notes: string | null
          org_id: string
          project_id: string
          status: string
        }
        Insert: {
          amount?: number
          client_address?: string | null
          client_email?: string | null
          client_name?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          org_id?: string
          project_id: string
          status?: string
        }
        Update: {
          amount?: number
          client_address?: string | null
          client_email?: string | null
          client_name?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          org_id?: string
          project_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      labor_payroll: {
        Row: {
          created_at: string
          daily_rate: number
          days_worked: number
          id: string
          notes: string | null
          org_id: string
          project_id: string
          total_cost: number
          work_date: string | null
          worker_name: string
        }
        Insert: {
          created_at?: string
          daily_rate?: number
          days_worked?: number
          id?: string
          notes?: string | null
          org_id?: string
          project_id: string
          total_cost?: number
          work_date?: string | null
          worker_name?: string
        }
        Update: {
          created_at?: string
          daily_rate?: number
          days_worked?: number
          id?: string
          notes?: string | null
          org_id?: string
          project_id?: string
          total_cost?: number
          work_date?: string | null
          worker_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "labor_payroll_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labor_payroll_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          internal_notes: string | null
          message: string | null
          name: string
          org_id: string
          phone: string | null
          referral_code: string | null
          service: string | null
          source: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          name: string
          org_id: string
          phone?: string | null
          referral_code?: string | null
          service?: string | null
          source?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          name?: string
          org_id?: string
          phone?: string | null
          referral_code?: string | null
          service?: string | null
          source?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      material_costs: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          org_id: string
          project_id: string
          purchased_at: string | null
          receipt_url: string | null
          vendor: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          org_id?: string
          project_id: string
          purchased_at?: string | null
          receipt_url?: string | null
          vendor?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          org_id?: string
          project_id?: string
          purchased_at?: string | null
          receipt_url?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_costs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_costs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      measurements: {
        Row: {
          created_at: string
          extras_value: number | null
          handrail_ft: number | null
          id: string
          notes: string | null
          org_id: string
          project_id: string
          sqft: number | null
          stairs_count: number | null
          total_value: number | null
        }
        Insert: {
          created_at?: string
          extras_value?: number | null
          handrail_ft?: number | null
          id?: string
          notes?: string | null
          org_id?: string
          project_id: string
          sqft?: number | null
          stairs_count?: number | null
          total_value?: number | null
        }
        Update: {
          created_at?: string
          extras_value?: number | null
          handrail_ft?: number | null
          id?: string
          notes?: string | null
          org_id?: string
          project_id?: string
          sqft?: number | null
          stairs_count?: number | null
          total_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measurements_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "measurements_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          plan: string | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          plan?: string | null
          slug: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          plan?: string | null
          slug?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          company_name: string
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          last_contacted_at: string | null
          next_action_date: string | null
          next_action_note: string | null
          notes: string | null
          org_id: string
          partner_type: string
          phone: string | null
          photo_url: string | null
          service_zone: string | null
          status: string
          total_converted: number
          total_referrals: number
          updated_at: string
        }
        Insert: {
          company_name: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contacted_at?: string | null
          next_action_date?: string | null
          next_action_note?: string | null
          notes?: string | null
          org_id: string
          partner_type?: string
          phone?: string | null
          photo_url?: string | null
          service_zone?: string | null
          status?: string
          total_converted?: number
          total_referrals?: number
          updated_at?: string
        }
        Update: {
          company_name?: string
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contacted_at?: string | null
          next_action_date?: string | null
          next_action_note?: string | null
          notes?: string | null
          org_id?: string
          partner_type?: string
          phone?: string | null
          photo_url?: string | null
          service_zone?: string | null
          status?: string
          total_converted?: number
          total_referrals?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partners_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          method: string | null
          notes: string | null
          org_id: string
          payment_date: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id: string
          method?: string | null
          notes?: string | null
          org_id?: string
          payment_date?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          method?: string | null
          notes?: string | null
          org_id?: string
          payment_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          org_id: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          org_id?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          org_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          address: string | null
          completed_date: string | null
          created_at: string
          id: string
          lead_id: string | null
          notes: string | null
          org_id: string
          scheduled_date: string | null
          status: string
          title: string
          total_value: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          completed_date?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          org_id?: string
          scheduled_date?: string | null
          status?: string
          title: string
          total_value?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          completed_date?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          notes?: string | null
          org_id?: string
          scheduled_date?: string | null
          status?: string
          title?: string
          total_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          active: boolean | null
          code: string
          commission_pct: number | null
          created_at: string | null
          id: string
          org_id: string
          referrer_name: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          commission_pct?: number | null
          created_at?: string | null
          id?: string
          org_id: string
          referrer_name?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          commission_pct?: number | null
          created_at?: string | null
          id?: string
          org_id?: string
          referrer_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string
          display_order: number
          icon_name: string
          id: string
          image_url: string | null
          is_active: boolean
          link_url: string | null
          org_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          display_order?: number
          icon_name?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string | null
          org_id?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          icon_name?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string | null
          org_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_org_id: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

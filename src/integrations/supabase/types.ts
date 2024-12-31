export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          business_name: string
          city: string | null
          contact_name: string
          country: string | null
          created_at: string
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          business_name: string
          city?: string | null
          contact_name: string
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          business_name?: string
          city?: string | null
          contact_name?: string
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          due_date: string
          id: string
          invoice_number: string
          is_recurring: boolean | null
          last_generated_date: string | null
          line_items: Json | null
          notes: string | null
          paid_date: string | null
          recurring_end_date: string | null
          recurring_interval: string | null
          recurring_start_date: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          client_id: string
          created_at?: string
          due_date: string
          id?: string
          invoice_number: string
          is_recurring?: boolean | null
          last_generated_date?: string | null
          line_items?: Json | null
          notes?: string | null
          paid_date?: string | null
          recurring_end_date?: string | null
          recurring_interval?: string | null
          recurring_start_date?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          due_date?: string
          id?: string
          invoice_number?: string
          is_recurring?: boolean | null
          last_generated_date?: string | null
          line_items?: Json | null
          notes?: string | null
          paid_date?: string | null
          recurring_end_date?: string | null
          recurring_interval?: string | null
          recurring_start_date?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string | null
          created_at: string
          display_order: number
          due_date: string | null
          id: string
          image: string | null
          industry: string | null
          is_active: boolean
          is_portfolio: boolean
          name: string | null
          notes: string | null
          start_date: string
          status: string
          team_members: string | null
          updated_at: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          display_order?: number
          due_date?: string | null
          id?: string
          image?: string | null
          industry?: string | null
          is_active?: boolean
          is_portfolio?: boolean
          name?: string | null
          notes?: string | null
          start_date: string
          status: string
          team_members?: string | null
          updated_at?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          display_order?: number
          due_date?: string | null
          id?: string
          image?: string | null
          industry?: string | null
          is_active?: boolean
          is_portfolio?: boolean
          name?: string | null
          notes?: string | null
          start_date?: string
          status?: string
          team_members?: string | null
          updated_at?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          due_date: string | null
          id: string
          project_id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          due_date?: string | null
          id?: string
          project_id: string
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          due_date?: string | null
          id?: string
          project_id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_private: {
        Row: {
          approved: boolean
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          approved?: boolean
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          approved?: boolean
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      user_public: {
        Row: {
          created_at: string
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

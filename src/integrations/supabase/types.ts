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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      conversion_waitlist: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credit_packs: {
        Row: {
          active: boolean
          dsc_amount: number
          id: string
          name: string
          price_cents: number
          sort: number
        }
        Insert: {
          active?: boolean
          dsc_amount: number
          id: string
          name: string
          price_cents: number
          sort?: number
        }
        Update: {
          active?: boolean
          dsc_amount?: number
          id?: string
          name?: string
          price_cents?: number
          sort?: number
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          enabled: boolean
          key: string
          updated_at: string
        }
        Insert: {
          enabled?: boolean
          key: string
          updated_at?: string
        }
        Update: {
          enabled?: boolean
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      founding_waitlist: {
        Row: {
          audience_size: string | null
          created_at: string
          email: string
          id: string
          phone: string | null
          role: string
        }
        Insert: {
          audience_size?: string | null
          created_at?: string
          email: string
          id?: string
          phone?: string | null
          role?: string
        }
        Update: {
          audience_size?: string | null
          created_at?: string
          email?: string
          id?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          amount: number
          bucket: Database["public"]["Enums"]["credit_bucket"]
          created_at: string
          direction: Database["public"]["Enums"]["ledger_direction"]
          id: string
          system_account: string | null
          transaction_id: string
          user_id: string | null
        }
        Insert: {
          amount: number
          bucket: Database["public"]["Enums"]["credit_bucket"]
          created_at?: string
          direction: Database["public"]["Enums"]["ledger_direction"]
          id?: string
          system_account?: string | null
          transaction_id: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          bucket?: Database["public"]["Enums"]["credit_bucket"]
          created_at?: string
          direction?: Database["public"]["Enums"]["ledger_direction"]
          id?: string
          system_account?: string | null
          transaction_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          dsc_amount: number
          id: string
          pack_id: string | null
          status: string
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          dsc_amount: number
          id?: string
          pack_id?: string | null
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          dsc_amount?: number
          id?: string
          pack_id?: string | null
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "credit_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_events: {
        Row: {
          created_at: string
          id: string
          type: string
        }
        Insert: {
          created_at?: string
          id: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          idempotency_key: string
          type: Database["public"]["Enums"]["txn_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          idempotency_key: string
          type: Database["public"]["Enums"]["txn_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          idempotency_key?: string
          type?: Database["public"]["Enums"]["txn_type"]
        }
        Relationships: []
      }
    }
    Views: {
      my_balances: {
        Row: {
          balance: number | null
          bucket: Database["public"]["Enums"]["credit_bucket"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      founding_counts: { Args: never; Returns: Json }
      post_transfer: {
        Args: {
          _amount: number
          _bucket: Database["public"]["Enums"]["credit_bucket"]
          _desc: string
          _from_system: string
          _from_user: string
          _key: string
          _to_system: string
          _to_user: string
          _type: Database["public"]["Enums"]["txn_type"]
        }
        Returns: string
      }
    }
    Enums: {
      credit_bucket: "promotional" | "restricted" | "convertible"
      ledger_direction: "debit" | "credit"
      txn_type:
        | "signup_bonus"
        | "purchase"
        | "refund"
        | "trade_debit"
        | "trade_credit"
        | "market_settlement"
        | "campaign_payment"
        | "management_payment"
        | "platform_fee"
        | "admin_adjustment"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      credit_bucket: ["promotional", "restricted", "convertible"],
      ledger_direction: ["debit", "credit"],
      txn_type: [
        "signup_bonus",
        "purchase",
        "refund",
        "trade_debit",
        "trade_credit",
        "market_settlement",
        "campaign_payment",
        "management_payment",
        "platform_fee",
        "admin_adjustment",
      ],
    },
  },
} as const

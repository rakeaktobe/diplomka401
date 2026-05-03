export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          address: string | null
          balance: number
          role: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          balance?: number
          role?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          balance?: number
          role?: string
        }
      }
      tariffs: {
        Row: {
          id: string
          name: string
          speed_mbps: number
          price: number
          description: string | null
          category: string
        }
        Insert: {
          id?: string
          name: string
          speed_mbps: number
          price: number
          description?: string | null
          category: string
        }
        Update: {
          id?: string
          name?: string
          speed_mbps?: number
          price?: number
          description?: string | null
          category?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tariff_id: string
          status: string
          next_billing_date: string | null
        }
        Insert: {
          id?: string
          user_id: string
          tariff_id: string
          status: string
          next_billing_date?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          tariff_id?: string
          status?: string
          next_billing_date?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          status?: string
          created_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          user_id: string
          subject: string
          description: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          description: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          description?: string
          status?: string
          created_at?: string
        }
      }
      network_status: {
        Row: {
          id: string
          region: string
          status: string
          updated_at: string
        }
        Insert: {
          id?: string
          region: string
          status: string
          updated_at?: string
        }
        Update: {
          id?: string
          region?: string
          status?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      subscribe_to_tariff: {
        Args: {
          p_user_id: string
          p_tariff_id: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

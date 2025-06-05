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
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          stripe_customer_id: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          stripe_customer_id?: string | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          status: string
          price_id: string | null
          quantity: number | null
          cancel_at_period_end: boolean | null
          cancel_at: string | null
          canceled_at: string | null
          current_period_start: string
          current_period_end: string
          created: string
          ended_at: string | null
          trial_start: string | null
          trial_end: string | null
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          status: string
          price_id?: string | null
          quantity?: number | null
          cancel_at_period_end?: boolean | null
          cancel_at?: string | null
          canceled_at?: string | null
          current_period_start: string
          current_period_end: string
          created: string
          ended_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string
          status?: string
          price_id?: string | null
          quantity?: number | null
          cancel_at_period_end?: boolean | null
          cancel_at?: string | null
          canceled_at?: string | null
          current_period_start?: string
          current_period_end?: string
          created?: string
          ended_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

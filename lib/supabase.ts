import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          points?: number
          created_at?: string
          updated_at?: string
        }
      }
      gifts: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string | null
          price_range: string
          affiliate_url: string
          occasion: string
          recipient: string
          interests: string[]
          submitted_by: string
          upvotes: number
          downvotes: number
          total_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url?: string | null
          price_range: string
          affiliate_url: string
          occasion: string
          recipient: string
          interests?: string[]
          submitted_by: string
          upvotes?: number
          downvotes?: number
          total_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string | null
          price_range?: string
          affiliate_url?: string
          occasion?: string
          recipient?: string
          interests?: string[]
          submitted_by?: string
          upvotes?: number
          downvotes?: number
          total_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          gift_id: string
          user_id: string
          vote_type: "up" | "down"
          created_at: string
        }
        Insert: {
          id?: string
          gift_id: string
          user_id: string
          vote_type: "up" | "down"
          created_at?: string
        }
        Update: {
          id?: string
          gift_id?: string
          user_id?: string
          vote_type?: "up" | "down"
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          gift_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          gift_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          gift_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

import { createClient } from '@supabase/supabase-js'

// Use the Supabase credentials directly since they're public keys
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dwbetxanfumneukrqodd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YmV0eGFuZnVtbmV1a3Jxb2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDI2MzYsImV4cCI6MjA2ODM3ODYzNn0.CO3oIID2omAwuex2qE_dXbOYbtA_v9bC38VQizuXVJc'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          avatar: string | null
          role: 'artist' | 'listener' | 'developer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar?: string | null
          role?: 'artist' | 'listener' | 'developer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar?: string | null
          role?: 'artist' | 'listener' | 'developer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      artist_profiles: {
        Row: {
          id: string
          user_id: string
          artist_name: string
          email: string
          profile_photo: string
          banner_photo: string
          bio: string
          genre: string[]
          location: string
          social_links: Record<string, string>
          career_highlights: any[]
          musical_style: string
          influences: string
          is_verified: boolean
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
          approved_at: string | null
          approved_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          artist_name: string
          email: string
          profile_photo?: string
          banner_photo?: string
          bio?: string
          genre?: string[]
          location?: string
          social_links?: Record<string, string>
          career_highlights?: any[]
          musical_style?: string
          influences?: string
          is_verified?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
          approved_at?: string | null
          approved_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          artist_name?: string
          email?: string
          profile_photo?: string
          banner_photo?: string
          bio?: string
          genre?: string[]
          location?: string
          social_links?: Record<string, string>
          career_highlights?: any[]
          musical_style?: string
          influences?: string
          is_verified?: boolean
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
          approved_at?: string | null
          approved_by?: string | null
        }
      }
      follow_relationships: {
        Row: {
          id: string
          follower_id: string
          artist_id: string
          followed_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          artist_id: string
          followed_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          artist_id?: string
          followed_at?: string
        }
      }
      investments: {
        Row: {
          id: string
          user_id: string
          project_id: string
          amount: number
          date: string
          investment_date: string
          status: 'pending' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          amount: number
          date?: string
          investment_date?: string
          status?: 'pending' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          amount?: number
          date?: string
          investment_date?: string
          status?: 'pending' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          artist_id: string
          title: string
          description: string
          detailed_description: string
          banner_image: string
          project_type: 'album' | 'single' | 'ep' | 'mixtape'
          genre: string[]
          funding_goal: number
          min_investment: number
          max_investment: number
          expected_roi: number
          project_duration: string
          deadline: string
          status: 'draft' | 'active' | 'funded' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          title: string
          description: string
          detailed_description?: string
          banner_image?: string
          project_type?: 'album' | 'single' | 'ep' | 'mixtape'
          genre?: string[]
          funding_goal: number
          min_investment: number
          max_investment: number
          expected_roi: number
          project_duration: string
          deadline: string
          status?: 'draft' | 'active' | 'funded' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          title?: string
          description?: string
          detailed_description?: string
          banner_image?: string
          project_type?: 'album' | 'single' | 'ep' | 'mixtape'
          genre?: string[]
          funding_goal?: number
          min_investment?: number
          max_investment?: number
          expected_roi?: number
          project_duration?: string
          deadline?: string
          status?: 'draft' | 'active' | 'funded' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

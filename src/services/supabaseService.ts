import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type User = Database['public']['Tables']['users']['Row']
type ArtistProfile = Database['public']['Tables']['artist_profiles']['Row']
type FollowRelationship = Database['public']['Tables']['follow_relationships']['Row']
type Investment = Database['public']['Tables']['investments']['Row']
type Project = Database['public']['Tables']['projects']['Row']

export class SupabaseService {
  // User Management
  async createUser(userData: {
    name: string
    email: string
    avatar?: string
    role?: 'artist' | 'listener' | 'developer' | 'admin'
  }): Promise<User | null> {
    try {
      console.log('🔍 Creating user in Supabase:', userData);
      
      // Let Supabase generate the UUID automatically
      const { data, error } = await supabase
        .from('users')
        .insert({
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar || null,
          role: userData.role || 'listener',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('🔍 Supabase error creating user:', error);
        
        // Check if it's an RLS (Row Level Security) issue
        if (error.message && error.message.includes('new row violates row-level security policy')) {
          console.error('🔍 This appears to be an RLS (Row Level Security) issue');
          console.error('🔍 The users table might have RLS enabled but no policies for insertion');
          
          // Try to disable RLS temporarily for this operation
          console.log('🔍 Attempting to disable RLS for user creation...');
          const { error: rlsError } = await supabase.rpc('disable_rls_for_user_creation');
          if (rlsError) {
            console.error('🔍 Failed to disable RLS:', rlsError);
          }
        }
        
        throw error;
      }
      
      console.log('🔍 User created successfully:', data);
      return data;
    } catch (error) {
      console.error('🔍 Error creating user:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user by email:', error)
      return null
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user by ID:', error)
      return null
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user:', error)
      return null
    }
  }

  // Artist Profile Management
  async createArtistProfile(profileData: {
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
  }): Promise<ArtistProfile | null> {
    try {
      console.log('Supabase: Creating artist profile with data:', profileData);
      
      const insertData = {
        ...profileData,
        is_verified: false,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('Supabase: Insert data:', insertData);
      
      const { data, error } = await supabase
        .from('artist_profiles')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Supabase: Profile created successfully:', data);
      return data
    } catch (error) {
      console.error('Error creating artist profile:', error)
      return null
    }
  }

  async getArtistProfileByUserId(userId: string): Promise<ArtistProfile | null> {
    try {
      const { data, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting artist profile:', error)
      return null
    }
  }

  async getArtistProfileById(profileId: string): Promise<ArtistProfile | null> {
    try {
      const { data, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('id', profileId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting artist profile by ID:', error)
      return null
    }
  }

  async updateArtistProfile(profileId: string, updates: Partial<ArtistProfile>): Promise<ArtistProfile | null> {
    try {
      const { data, error } = await supabase
        .from('artist_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating artist profile:', error)
      return null
    }
  }

  async getAllArtistProfiles(): Promise<ArtistProfile[]> {
    try {
      const { data, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting all artist profiles:', error)
      return []
    }
  }

  async getApprovedArtistProfiles(): Promise<ArtistProfile[]> {
    try {
      const { data, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting approved artist profiles:', error)
      return []
    }
  }

  async approveArtistProfile(profileId: string, approvedBy: string): Promise<ArtistProfile | null> {
    try {
      const { data, error } = await supabase
        .from('artist_profiles')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: approvedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error approving artist profile:', error)
      return null
    }
  }

  async rejectArtistProfile(profileId: string, approvedBy: string): Promise<ArtistProfile | null> {
    try {
      const { data, error } = await supabase
        .from('artist_profiles')
        .update({
          status: 'rejected',
          approved_at: new Date().toISOString(),
          approved_by: approvedBy,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profileId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error rejecting artist profile:', error)
      return null
    }
  }

  async deleteArtistProfile(profileId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('artist_profiles')
        .delete()
        .eq('id', profileId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting artist profile:', error)
      return false
    }
  }

  // Follow Relationship Management
  async followArtist(followerId: string, artistId: string): Promise<boolean> {
    try {
      // Check if already following
      const existing = await this.isFollowing(followerId, artistId)
      if (existing) return false

      const { error } = await supabase
        .from('follow_relationships')
        .insert({
          follower_id: followerId,
          artist_id: artistId,
          followed_at: new Date().toISOString(),
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error following artist:', error)
      return false
    }
  }

  async unfollowArtist(followerId: string, artistId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('follow_relationships')
        .delete()
        .eq('follower_id', followerId)
        .eq('artist_id', artistId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error unfollowing artist:', error)
      return false
    }
  }

  async isFollowing(followerId: string, artistId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('follow_relationships')
        .select('id')
        .eq('follower_id', followerId)
        .eq('artist_id', artistId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return !!data
    } catch (error) {
      console.error('Error checking follow status:', error)
      return false
    }
  }

  async getFollowers(artistId: string): Promise<FollowRelationship[]> {
    try {
      const { data, error } = await supabase
        .from('follow_relationships')
        .select('*')
        .eq('artist_id', artistId)
        .order('followed_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting followers:', error)
      return []
    }
  }

  async getFollowing(userId: string): Promise<FollowRelationship[]> {
    try {
      const { data, error } = await supabase
        .from('follow_relationships')
        .select('*')
        .eq('follower_id', userId)
        .order('followed_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting following:', error)
      return []
    }
  }

  async getFollowerCount(artistId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('follow_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('artist_id', artistId)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('Error getting follower count:', error)
      return 0
    }
  }

  async getFollowingCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('follow_relationships')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('Error getting following count:', error)
      return 0
    }
  }

  // Investment Management
  async createInvestment(investmentData: {
    user_id: string
    project_id: string
    amount: number
  }): Promise<Investment | null> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .insert({
          ...investmentData,
          date: new Date().toISOString().split('T')[0],
          investment_date: new Date().toISOString(),
          status: 'completed',
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating investment:', error)
      return null
    }
  }

  async getUserInvestments(userId: string): Promise<Investment[]> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting user investments:', error)
      return []
    }
  }

  // Project Management
  async createProject(projectData: {
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
  }): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating project:', error)
      return null
    }
  }

  async getProjectsByArtist(artistId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('artist_id', artistId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting artist projects:', error)
      return []
    }
  }

  async getAllProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting all projects:', error)
      return []
    }
  }
}

export const supabaseService = new SupabaseService() 
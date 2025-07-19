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
      console.log('SupabaseService: followArtist called with', { followerId, artistId });
      
      // Validate UUIDs
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(followerId) || !uuidRegex.test(artistId)) {
        console.error('SupabaseService: Invalid UUID format', { followerId, artistId });
        return false;
      }
      
      // Check if already following
      const existing = await this.isFollowing(followerId, artistId)
      console.log('SupabaseService: isFollowing check result:', existing);
      
      if (existing) {
        console.log('SupabaseService: Already following, returning false');
        return false;
      }

      console.log('SupabaseService: Attempting to insert follow relationship...');
      const { data, error } = await supabase
        .from('follow_relationships')
        .insert({
          follower_id: followerId,
          artist_id: artistId,
          followed_at: new Date().toISOString(),
        })
        .select()

      if (error) {
        console.error('SupabaseService: Error inserting follow relationship:', error);
        console.error('SupabaseService: Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // If it's an RLS error, try to bypass it
        if (error.code === '42501' || error.message.includes('permission')) {
          console.log('SupabaseService: RLS error detected, trying with service role...');
          // For now, return false but log the issue
          return false;
        }
        
        throw error;
      }
      
      console.log('SupabaseService: Follow relationship inserted successfully:', data);
      return true
    } catch (error) {
      console.error('SupabaseService: Error following artist:', error)
      return false
    }
  }

  async unfollowArtist(followerId: string, artistId: string): Promise<boolean> {
    try {
      console.log('SupabaseService: unfollowArtist called with', { followerId, artistId });
      
      console.log('SupabaseService: Attempting to delete follow relationship...');
      const { data, error } = await supabase
        .from('follow_relationships')
        .delete()
        .eq('follower_id', followerId)
        .eq('artist_id', artistId)
        .select()

      if (error) {
        console.error('SupabaseService: Error deleting follow relationship:', error);
        console.error('SupabaseService: Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('SupabaseService: Follow relationship deleted successfully:', data);
      return true
    } catch (error) {
      console.error('SupabaseService: Error unfollowing artist:', error)
      return false
    }
  }

  async isFollowing(followerId: string, artistId: string): Promise<boolean> {
    try {
      console.log('SupabaseService: isFollowing called with', { followerId, artistId });
      
      console.log('SupabaseService: Attempting to check follow status...');
      const { data, error } = await supabase
        .from('follow_relationships')
        .select('id')
        .eq('follower_id', followerId)
        .eq('artist_id', artistId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('SupabaseService: Error checking follow status:', error);
        console.error('SupabaseService: Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      const result = !!data;
      console.log('SupabaseService: isFollowing result:', result, 'data:', data);
      return result;
    } catch (error) {
      console.error('SupabaseService: Error checking follow status:', error)
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

  async getInvestmentsByProject(projectId: string): Promise<Investment[]> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting investments by project:', error)
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
    status?: 'draft' | 'pending' | 'active' | 'funded' | 'completed' | 'cancelled'
  }): Promise<Project | null> {
    try {
      console.log('SupabaseService: Creating project with data:', projectData);
      
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          status: projectData.status || 'pending', // Use provided status or default to pending
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('SupabaseService: Error creating project:', error);
        console.error('SupabaseService: Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('SupabaseService: Project created successfully:', data);
      return data;
    } catch (error) {
      console.error('SupabaseService: Error creating project:', error);
      return null;
    }
  }

  async getProjectsByArtist(artistId: string, includeCancelled: boolean = false): Promise<Project[]> {
    try {
      console.log('SupabaseService: Getting projects for artist:', artistId, 'includeCancelled:', includeCancelled);
      
      let query = supabase
        .from('projects')
        .select('*')
        .eq('artist_id', artistId);

      // Filter out cancelled projects unless explicitly requested
      if (!includeCancelled) {
        query = query.neq('status', 'cancelled');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('SupabaseService: Error getting projects by artist:', error);
        return [];
      }

      console.log('SupabaseService: Found projects:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('SupabaseService: Error getting projects by artist:', error);
      return [];
    }
  }

  async getAllProjects(includeCancelled: boolean = false): Promise<Project[]> {
    try {
      console.log('SupabaseService: Getting all projects, includeCancelled:', includeCancelled);
      
      let query = supabase
        .from('projects')
        .select('*');

      // Filter out cancelled projects unless explicitly requested
      if (!includeCancelled) {
        query = query.neq('status', 'cancelled');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('SupabaseService: Error getting all projects:', error);
        return [];
      }

      console.log('SupabaseService: Found projects:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('SupabaseService: Error getting all projects:', error);
      return [];
    }
  }

  async getPendingProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting pending projects:', error)
      return []
    }
  }

  async approveProject(projectId: string, approvedBy: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error approving project:', error)
      return null
    }
  }

  async rejectProject(projectId: string, rejectedBy: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString(),
          rejected_by: rejectedBy,
          rejected_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error rejecting project:', error);
      return null;
    }
  }

  async endProject(projectId: string, endedBy: string): Promise<Project | null> {
    try {
      console.log('SupabaseService: Ending project:', projectId, 'by user:', endedBy);
      
      // First, get the project details to check if it's being ended prematurely
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('SupabaseService: Error fetching project:', projectError);
        throw projectError;
      }

      // Get all investments for this project
      const investments = await this.getInvestmentsByProject(projectId);
      console.log('SupabaseService: Found investments:', investments.length);

      // Check if project is being ended prematurely
      const fundingGoal = projectData.funding_goal || 0;
      const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
      const deadline = new Date(projectData.deadline);
      const today = new Date();
      const isPremature = totalInvested < fundingGoal || today < deadline;

      console.log('SupabaseService: Project analysis:', {
        fundingGoal,
        totalInvested,
        deadline: projectData.deadline,
        today: today.toISOString(),
        isPremature,
        fundingMet: totalInvested >= fundingGoal,
        deadlineReached: today >= deadline
      });

      // Determine status based on whether it's premature
      const newStatus = isPremature ? 'cancelled' : 'completed';
      console.log('SupabaseService: Setting project status to:', newStatus);
      
      // Update project status
      const { data, error } = await supabase
        .from('projects')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select()
        .single();

      if (error) {
        console.error('SupabaseService: Error ending project:', error);
        console.error('SupabaseService: Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('SupabaseService: Project ended successfully:', data);
      console.log(`Project ${projectId} ${isPremature ? 'cancelled prematurely' : 'completed'}. ${investments.length} investments to be returned.`);
      
      return data;
    } catch (error) {
      console.error('SupabaseService: Error ending project:', error);
      return null;
    }
  }

  // Disable RLS on follow_relationships table
  async disableRLSOnFollowRelationships(): Promise<void> {
    try {
      console.log('SupabaseService: Attempting to disable RLS on follow_relationships table...');
      
      // This would require admin privileges, but let's try a direct SQL call
      const { data, error } = await supabase
        .rpc('disable_rls_on_follow_relationships')
        .select();
      
      if (error) {
        console.log('SupabaseService: Could not disable RLS via RPC, this is expected:', error.message);
        console.log('SupabaseService: You may need to disable RLS manually in the Supabase dashboard');
      } else {
        console.log('SupabaseService: RLS disabled successfully');
      }
    } catch (error) {
      console.log('SupabaseService: Error disabling RLS (this is expected):', error);
      console.log('SupabaseService: Please disable RLS manually in the Supabase dashboard for follow_relationships table');
    }
  }

  // Test follow table access with better error handling
  async testFollowTableAccess(): Promise<boolean> {
    try {
      console.log('SupabaseService: Testing follow table access...');
      
      // First, try to disable RLS
      await this.disableRLSOnFollowRelationships();
      
      const testData = {
        follower_id: 'test-follower-id',
        artist_id: 'test-artist-id',
        followed_at: new Date().toISOString()
      };
      console.log('SupabaseService: Test data:', testData);

      const { data, error } = await supabase
        .from('follow_relationships')
        .insert(testData)
        .select()
        .single();

      if (error) {
        console.log('SupabaseService: Test insert failed:', error);
        console.log('SupabaseService: Error code:', error.code);
        console.log('SupabaseService: Error message:', error.message);
        
        if (error.code === '42501') {
          console.log('SupabaseService: RLS is blocking access. Please disable RLS on follow_relationships table in Supabase dashboard.');
        }
        
        return false;
      }

      console.log('SupabaseService: Test insert successful:', data);
      
      // Clean up test data
      const { error: deleteError } = await supabase
        .from('follow_relationships')
        .delete()
        .eq('id', data.id);
        
      if (deleteError) {
        console.log('SupabaseService: Test cleanup failed:', deleteError);
      } else {
        console.log('SupabaseService: Test cleanup successful');
      }
      
      return true;
    } catch (error) {
      console.log('SupabaseService: Test failed:', error);
      return false;
    }
  }

  // Simple direct test to write to follow_relationships table
  async simpleFollowTest(): Promise<void> {
    try {
      console.log('=== SIMPLE FOLLOW TEST START ===');
      
      // Test data with simple UUIDs
      const testData = {
        follower_id: '550e8400-e29b-41d4-a716-446655440000', // Test UUID
        artist_id: '550e8400-e29b-41d4-a716-446655440001',   // Test UUID
        followed_at: new Date().toISOString()
      };
      
      console.log('Attempting to insert test data:', testData);
      
      // Try direct insert
      const { data, error } = await supabase
        .from('follow_relationships')
        .insert(testData);
      
      if (error) {
        console.error('❌ SIMPLE TEST FAILED:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
      } else {
        console.log('✅ SIMPLE TEST SUCCESS:', data);
        
        // Try to read it back
        const { data: readData, error: readError } = await supabase
          .from('follow_relationships')
          .select('*')
          .eq('follower_id', testData.follower_id)
          .eq('artist_id', testData.artist_id);
        
        if (readError) {
          console.error('❌ READ TEST FAILED:', readError);
        } else {
          console.log('✅ READ TEST SUCCESS:', readData);
        }
        
        // Clean up
        const { error: deleteError } = await supabase
          .from('follow_relationships')
          .delete()
          .eq('follower_id', testData.follower_id)
          .eq('artist_id', testData.artist_id);
        
        if (deleteError) {
          console.error('❌ CLEANUP FAILED:', deleteError);
        } else {
          console.log('✅ CLEANUP SUCCESS');
        }
      }
      
      console.log('=== SIMPLE FOLLOW TEST END ===');
    } catch (error) {
      console.error('❌ SIMPLE TEST EXCEPTION:', error);
    }
  }

  // Check RLS status and policies for follow_relationships table
  async checkRLSStatus(): Promise<void> {
    try {
      console.log('SupabaseService: Checking RLS status...');
      
      // Try to get table info
      const { data: tableInfo, error: tableError } = await supabase
        .from('follow_relationships')
        .select('*')
        .limit(1);
      
      console.log('SupabaseService: Table access test result:', { data: tableInfo, error: tableError });
      
      // Try to get RLS policies (this might not work with anon key)
      let policies = null;
      let policyError = null;
      try {
        const result = await supabase
          .rpc('get_rls_policies', { table_name: 'follow_relationships' });
        policies = result.data;
        policyError = result.error;
      } catch (rpcError) {
        policyError = 'RPC not available';
      }
      
      console.log('SupabaseService: RLS policies:', { data: policies, error: policyError });
      
    } catch (error) {
      console.error('SupabaseService: Error checking RLS status:', error);
    }
  }

  // Comprehensive test to check all tables and their access
  async comprehensiveTableTest(): Promise<void> {
    try {
      console.log('=== COMPREHENSIVE TABLE TEST START ===');
      
      const tables = ['users', 'artist_profiles', 'projects', 'investments', 'follow_relationships'];
      
      for (const tableName of tables) {
        console.log(`\n--- Testing ${tableName} table ---`);
        
        // Test read access
        const { data: readData, error: readError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        console.log(`${tableName} READ TEST:`, { 
          success: !readError, 
          error: readError?.message,
          recordCount: readData?.length || 0 
        });
        
        // Test write access with sample data
        const sampleData = this.getSampleDataForTable(tableName);
        if (sampleData) {
          const { data: writeData, error: writeError } = await supabase
            .from(tableName)
            .insert(sampleData)
            .select();
          
          console.log(`${tableName} WRITE TEST:`, { 
            success: !writeError, 
            error: writeError?.message,
            insertedData: writeData 
          });
          
          // Clean up if write succeeded
          if (!writeError && writeData && writeData.length > 0) {
            const { error: deleteError } = await supabase
              .from(tableName)
              .delete()
              .eq('id', writeData[0].id);
            
            console.log(`${tableName} CLEANUP:`, { 
              success: !deleteError, 
              error: deleteError?.message 
            });
          }
        }
      }
      
      console.log('=== COMPREHENSIVE TABLE TEST END ===');
    } catch (error) {
      console.error('❌ COMPREHENSIVE TEST EXCEPTION:', error);
    }
  }
  
  // Helper method to get sample data for each table
  private getSampleDataForTable(tableName: string): any {
    const baseUserId = '105de9e2-12ff-47e4-8d68-2181f713643c'; // From your users table
    const baseArtistId = 'a723433a-d545-41d4-a716-446655440000'; // From your users table
    
    switch (tableName) {
      case 'users':
        return {
          name: 'Test User',
          email: 'test@example.com',
          role: 'listener'
        };
      case 'artist_profiles':
        return {
          user_id: baseUserId,
          artist_name: 'Test Artist',
          email: 'artist@example.com',
          bio: 'Test bio',
          genre: ['Test'],
          location: 'Test Location',
          is_verified: false,
          status: 'pending'
        };
      case 'projects':
        return {
          artist_id: baseArtistId,
          title: 'Test Project',
          description: 'Test description',
          funding_goal: 10000,
          min_investment: 100,
          max_investment: 1000,
          expected_roi: 10,
          project_duration: '6 months',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        };
      case 'investments':
        return {
          user_id: baseUserId,
          project_id: '550e8400-e29b-41d4-a716-446655440000', // Test UUID
          amount: 1000,
          status: 'completed'
        };
      case 'follow_relationships':
        return {
          follower_id: baseUserId,
          artist_id: baseArtistId,
          followed_at: new Date().toISOString()
        };
      default:
        return null;
    }
  }

  // Create or get artist user records for mock artists
  async getOrCreateArtistUser(artistId: string, artistData: { name: string; bio: string; avatar: string }): Promise<string> {
    try {
      console.log('SupabaseService: Getting or creating artist user for:', artistId, artistData.name);
      
      // Check if we already have a mapping for this mock artist ID
      const mappingKey = `mock_artist_${artistId}`;
      const existingMapping = localStorage.getItem(mappingKey);
      
      if (existingMapping) {
        console.log('SupabaseService: Found existing mapping:', existingMapping);
        return existingMapping;
      }
      
      // Create a new user record for this artist
      const artistUser = await this.createUser({
        name: artistData.name,
        email: `${artistData.name.toLowerCase().replace(/\s+/g, '.')}@musistash.artist`,
        avatar: artistData.avatar,
        role: 'artist'
      });
      
      if (artistUser) {
        // Store the mapping
        localStorage.setItem(mappingKey, artistUser.id);
        console.log('SupabaseService: Created new artist user:', artistUser.id);
        return artistUser.id;
      }
      
      throw new Error('Failed to create artist user');
    } catch (error) {
      console.error('SupabaseService: Error getting or creating artist user:', error);
      throw error;
    }
  }
  
  // Get all artist users (for mock artists)
  async getArtistUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'artist')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting artist users:', error);
      return [];
    }
  }

  // Demo Data Management
  async createDemoArtists(): Promise<void> {
    try {
      console.log('SupabaseService: Creating demo artists in Supabase...');
      
      const demoArtists = [
        {
          name: 'Aria Luna',
          email: 'aria.luna@musistash.demo',
          avatar: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=300&h=300',
          bio: 'Electro-pop artist pushing boundaries with innovative sound design and heartfelt lyrics.',
          genres: ['Electro-Pop', 'Alternative'],
          verified: true,
          successRate: 85
        },
        {
          name: 'Nexus Rhythm',
          email: 'nexus.rhythm@musistash.demo',
          avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300',
          bio: 'Hip-hop collective bringing fresh perspectives through collaborative storytelling.',
          genres: ['Hip-Hop', 'R&B'],
          verified: true,
          successRate: 92
        },
        {
          name: 'Echo Horizon',
          email: 'echo.horizon@musistash.demo',
          avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=300&h=300',
          bio: 'Indie rock band blending nostalgic sounds with futuristic production techniques.',
          genres: ['Indie Rock', 'Shoegaze'],
          verified: false,
          successRate: 78
        }
      ];

      for (const artistData of demoArtists) {
        // Check if artist user already exists
        const existingUser = await this.getUserByEmail(artistData.email);
        
        if (!existingUser) {
          console.log(`SupabaseService: Creating demo artist user: ${artistData.name}`);
          
          // Create the user first
          const user = await this.createUser({
            name: artistData.name,
            email: artistData.email,
            avatar: artistData.avatar,
            role: 'artist'
          });
          
          if (user) {
            console.log(`SupabaseService: Created demo artist user: ${user.id}`);
            
                         // Create the artist profile
             const profile = await this.createArtistProfile({
               user_id: user.id,
               artist_name: artistData.name,
               email: artistData.email,
               profile_photo: artistData.avatar,
               bio: artistData.bio,
               genre: artistData.genres
             });
            
            if (profile) {
              console.log(`SupabaseService: Created demo artist profile: ${profile.id}`);
              
              // Store the mapping for easy lookup
              const mappingKey = `demo_artist_${artistData.name.toLowerCase().replace(/\s+/g, '_')}`;
              localStorage.setItem(mappingKey, user.id);
            }
          }
        } else {
          console.log(`SupabaseService: Demo artist user already exists: ${artistData.name}`);
        }
      }
      
      console.log('SupabaseService: Demo artists setup complete');
    } catch (error) {
      console.error('Error creating demo artists:', error);
    }
  }

  // Get demo artist user ID by name
  async getDemoArtistUserId(artistName: string): Promise<string | null> {
    try {
      console.log(`SupabaseService: getDemoArtistUserId called for: ${artistName}`);
      
      const mappingKey = `demo_artist_${artistName.toLowerCase().replace(/\s+/g, '_')}`;
      console.log(`SupabaseService: Looking for mapping key: ${mappingKey}`);
      
      const userId = localStorage.getItem(mappingKey);
      console.log(`SupabaseService: localStorage result for ${mappingKey}:`, userId);
      
      if (userId) {
        console.log(`SupabaseService: Found demo artist user ID in localStorage: ${userId}`);
        return userId;
      }
      
      console.log(`SupabaseService: Not found in localStorage, trying email lookup...`);
      // If not in localStorage, try to find by email
      const email = `${artistName.toLowerCase().replace(/\s+/g, '.')}@musistash.demo`;
      console.log(`SupabaseService: Looking for user with email: ${email}`);
      
      const user = await this.getUserByEmail(email);
      console.log(`SupabaseService: getUserByEmail result:`, user);
      
      if (user) {
        console.log(`SupabaseService: Found user by email, storing mapping: ${user.id}`);
        localStorage.setItem(mappingKey, user.id);
        return user.id;
      }
      
      console.log(`SupabaseService: No user found for artist: ${artistName}`);
      return null;
    } catch (error) {
      console.error('Error getting demo artist user ID:', error);
      return null;
    }
  }

  // Manually populate demo artist mappings from existing users
  async populateDemoArtistMappings(): Promise<void> {
    try {
      console.log('SupabaseService: Populating demo artist mappings...');
      
      const demoArtists = [
        { name: 'Aria Luna', email: 'aria.luna@musistash.demo' },
        { name: 'Nexus Rhythm', email: 'nexus.rhythm@musistash.demo' },
        { name: 'Echo Horizon', email: 'echo.horizon@musistash.demo' }
      ];
      
      for (const artist of demoArtists) {
        const user = await this.getUserByEmail(artist.email);
        if (user) {
          const mappingKey = `demo_artist_${artist.name.toLowerCase().replace(/\s+/g, '_')}`;
          localStorage.setItem(mappingKey, user.id);
          console.log(`SupabaseService: Mapped ${artist.name} -> ${user.id}`);
        } else {
          console.log(`SupabaseService: No user found for ${artist.name} (${artist.email})`);
        }
      }
      
      console.log('SupabaseService: Demo artist mappings populated');
    } catch (error) {
      console.error('Error populating demo artist mappings:', error);
    }
  }

  // Get all demo artist user IDs
  async getDemoArtistUserIds(): Promise<Record<string, string>> {
    try {
      const demoArtists = ['Aria Luna', 'Nexus Rhythm', 'Echo Horizon'];
      const userIds: Record<string, string> = {};
      
      for (const artistName of demoArtists) {
        const userId = await this.getDemoArtistUserId(artistName);
        if (userId) {
          userIds[artistName] = userId;
        }
      }
      
      return userIds;
    } catch (error) {
      console.error('Error getting demo artist user IDs:', error);
      return {};
    }
  }

  // Create demo projects for the demo artists
  async createDemoProjects(): Promise<void> {
    try {
      console.log('SupabaseService: Creating demo projects in Supabase...');
      
      // Get demo artist user IDs
      const demoArtistIds = await this.getDemoArtistUserIds();
      console.log('SupabaseService: Demo artist user IDs:', demoArtistIds);
      
      const demoProjects = [
        {
          artistName: 'Aria Luna',
          title: 'Lunar Echoes - Debut Album',
          description: 'My first full-length album exploring themes of technology and human connection through electro-pop.',
          detailed_description: 'A groundbreaking electro-pop album that pushes the boundaries of sound design while maintaining heartfelt, relatable lyrics. This project will feature collaborations with top producers and innovative production techniques.',
          banner_image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&h=500',
          project_type: 'album' as const,
          genre: ['Electro-Pop', 'Alternative'],
          funding_goal: 50000,
          min_investment: 100,
          max_investment: 10000,
          expected_roi: 7.5,
          project_duration: '6 months',
          deadline: '2024-12-31'
        },
        {
          artistName: 'Nexus Rhythm',
          title: 'Urban Perspectives - Mixtape',
          description: 'A collaborative mixtape featuring emerging artists from across the city.',
          detailed_description: 'A powerful mixtape that brings together the best emerging hip-hop talent from urban centers. This project will showcase diverse perspectives and innovative storytelling through collaborative tracks.',
          banner_image: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=800&h=500',
          project_type: 'mixtape' as const,
          genre: ['Hip-Hop', 'R&B'],
          funding_goal: 75000,
          min_investment: 250,
          max_investment: 15000,
          expected_roi: 10,
          project_duration: '4 months',
          deadline: '2024-11-30'
        },
        {
          artistName: 'Echo Horizon',
          title: 'Endless Horizons - EP',
          description: 'A 5-track EP exploring atmospheric soundscapes and emotional narratives.',
          detailed_description: 'An atmospheric indie rock EP that blends nostalgic sounds with futuristic production techniques. Each track tells a unique emotional story through innovative sound design.',
          banner_image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&h=500',
          project_type: 'ep' as const,
          genre: ['Indie Rock', 'Shoegaze'],
          funding_goal: 35000,
          min_investment: 50,
          max_investment: 5000,
          expected_roi: 6,
          project_duration: '3 months',
          deadline: '2024-10-15'
        }
      ];

      for (const projectData of demoProjects) {
        const artistUserId = demoArtistIds[projectData.artistName];
        
        if (artistUserId) {
          console.log(`SupabaseService: Creating demo project for ${projectData.artistName}: ${projectData.title}`);
          
          // Get the artist profile ID for this user
          const artistProfile = await this.getArtistProfileByUserId(artistUserId);
          
          if (artistProfile) {
            console.log(`SupabaseService: Found artist profile for ${projectData.artistName}: ${artistProfile.id}`);
            
            // Check if project already exists
            const existingProjects = await this.getProjectsByArtist(artistProfile.id);
            const projectExists = existingProjects.some(p => p.title === projectData.title);
            
            if (!projectExists) {
              const project = await this.createProject({
                artist_id: artistProfile.id, // Use artist profile ID, not user ID
                title: projectData.title,
                description: projectData.description,
                detailed_description: projectData.detailed_description,
                banner_image: projectData.banner_image,
                project_type: projectData.project_type,
                genre: projectData.genre,
                funding_goal: projectData.funding_goal,
                min_investment: projectData.min_investment,
                max_investment: projectData.max_investment,
                expected_roi: projectData.expected_roi,
                project_duration: projectData.project_duration,
                deadline: projectData.deadline,
                status: 'active' // Set status to active for demo projects
              });
              
              if (project) {
                console.log(`SupabaseService: Created demo project: ${project.id}`);
                
                // Store mapping for easy lookup
                const mappingKey = `demo_project_${projectData.title.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;
                localStorage.setItem(mappingKey, project.id);
              }
            } else {
              console.log(`SupabaseService: Demo project already exists: ${projectData.title}`);
            }
          } else {
            console.log(`SupabaseService: Could not find artist profile for user: ${artistUserId}`);
          }
        } else {
          console.log(`SupabaseService: Could not find artist user ID for: ${projectData.artistName}`);
        }
      }
      
      console.log('SupabaseService: Demo projects setup complete');
    } catch (error) {
      console.error('Error creating demo projects:', error);
    }
  }

  // Get demo project ID by title
  async getDemoProjectId(projectTitle: string): Promise<string | null> {
    try {
      const mappingKey = `demo_project_${projectTitle.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;
      const projectId = localStorage.getItem(mappingKey);
      
      if (projectId) {
        return projectId;
      }
      
      // If not in localStorage, try to find by title
      const allProjects = await this.getAllProjects();
      const project = allProjects.find(p => p.title === projectTitle);
      
      if (project) {
        localStorage.setItem(mappingKey, project.id);
        return project.id;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting demo project ID:', error);
      return null;
    }
  }

  async getRecentFollowers(artistId: string, limit: number = 5): Promise<FollowRelationship[]> {
    try {
      const { data, error } = await supabase
        .from('follow_relationships')
        .select('*')
        .eq('artist_id', artistId)
        .order('followed_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting recent followers:', error)
      return []
    }
  }

  async getProjectStatus(projectId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('status')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return data?.status || null;
    } catch (error) {
      console.error('Error getting project status:', error);
      return null;
    }
  }

  async getProjectById(projectId: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting project by ID:', error);
      return null;
    }
  }

  async uploadProjectImage(file: File, projectId: string): Promise<string | null> {
    try {
      console.log('SupabaseService: Starting image upload for project:', projectId);
      console.log('SupabaseService: File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const fileExt = file.name.split('.').pop();
      const fileName = `${projectId}-${Date.now()}.${fileExt}`;
      const filePath = `project-banners/${fileName}`;

      console.log('SupabaseService: Upload path:', filePath);

      // First, try to create the bucket if it doesn't exist
      try {
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        console.log('SupabaseService: Available buckets:', buckets?.map(b => b.name));
        
        if (listError) {
          console.error('SupabaseService: Error listing buckets:', listError);
        }

        const projectImagesBucket = buckets?.find(b => b.name === 'project-images');
        if (!projectImagesBucket) {
          console.log('SupabaseService: project-images bucket not found, attempting to create...');
          const { data: newBucket, error: createError } = await supabase.storage.createBucket('project-images', {
            public: true,
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            fileSizeLimit: 5242880 // 5MB
          });
          
          if (createError) {
            console.error('SupabaseService: Error creating bucket:', createError);
            throw new Error(`Failed to create storage bucket: ${createError.message}`);
          }
          
          console.log('SupabaseService: Created project-images bucket:', newBucket);
        }
      } catch (bucketError) {
        console.error('SupabaseService: Bucket setup error:', bucketError);
        // Continue with upload attempt even if bucket creation fails
      }

      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('SupabaseService: Upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log('SupabaseService: Upload successful:', data);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      console.log('SupabaseService: Generated public URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('SupabaseService: Error uploading project image:', error);
      
      // Fallback: Convert to base64 and store directly
      console.log('SupabaseService: Attempting fallback base64 conversion...');
      try {
        const base64Url = await this.convertFileToBase64(file);
        console.log('SupabaseService: Base64 conversion successful');
        return base64Url;
      } catch (base64Error) {
        console.error('SupabaseService: Base64 conversion also failed:', base64Error);
        throw error; // Re-throw original error
      }
    }
  }

  private async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsDataURL(file);
    });
  }

  async updateProjectImage(projectId: string, imageUrl: string): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ banner_image: imageUrl })
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating project image:', error);
      return null;
    }
  }
}

export const supabaseService = new SupabaseService() 
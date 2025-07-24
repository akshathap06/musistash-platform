import { supabase } from '../lib/supabase';
import { CareerHighlightsService } from './careerHighlightsService';

export class EfficientArtistProfileService {
  /**
   * Efficiently update an artist profile with all data in a single database call
   * Career highlights are handled separately to avoid database issues
   */
  async updateProfile(profileId: string, profileData: {
    // Basic profile info
    artist_name?: string;
    bio?: string;
    biography?: string;
    genre?: string[];
    location?: string;
    musical_style?: string;
    influences?: string;
    
    // Images
    profile_photo?: string;
    banner_photo?: string;
    
    // Social media
    social_links?: Record<string, string>;
    spotify_profile_url?: string;
    spotify_artist_id?: string;
    instagram_handle?: string;
    twitter_handle?: string;
    youtube_channel_id?: string;
    website_url?: string;
    
    // Stats and career
    monthly_listeners?: number;
    total_streams?: number;
    success_rate?: number;
    career_highlights?: any[];
    future_releases?: any[];
    spotify_embed_urls?: string[];
    spotify_data?: any;
    
    // Verification
    verified_status?: boolean;
  }): Promise<any> {
    try {
      console.log('Efficient update: Preparing single update with all data');
      
      // Extract career highlights to handle separately
      const { career_highlights, ...profileDataWithoutHighlights } = profileData;
      
      // Clean the data - remove undefined values but keep null for explicit clearing
      const cleanData = Object.fromEntries(
        Object.entries(profileDataWithoutHighlights).filter(([_, value]) => value !== undefined)
      );
      
      // Add timestamp
      const updateData = {
        ...cleanData,
        updated_at: new Date().toISOString(),
      };
      
      console.log('Efficient update: Single database call with data:', updateData);
      
      const { data, error } = await supabase
        .from('artist_profiles')
        .update(updateData)
        .eq('id', profileId)
        .select()
        .single();

      if (error) {
        console.error('Efficient update error:', error);
        throw error;
      }

      // Handle career highlights separately if provided
      if (career_highlights !== undefined) {
        console.log('Updating career highlights separately');
        const careerHighlightsService = new CareerHighlightsService();
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Career highlights update timeout')), 10000); // 10 second timeout
        });
        
        try {
          await Promise.race([
            careerHighlightsService.updateCareerHighlights(profileId, career_highlights),
            timeoutPromise
          ]);
          console.log('Career highlights updated successfully');
        } catch (error) {
          console.warn('Career highlights update failed or timed out, but continuing:', error);
          // Continue with the main profile update even if career highlights fail
        }
      }

      console.log('Efficient update successful:', data);
      return data;
    } catch (error) {
      console.error('Efficient update failed:', error);
      throw error;
    }
  }

  /**
   * Create a new artist profile efficiently
   */
  async createProfile(userId: string, profileData: {
    artist_name: string;
    email: string;
    bio?: string;
    biography?: string;
    genre?: string[];
    location?: string;
    profile_photo?: string;
    banner_photo?: string;
    musical_style?: string;
    influences?: string;
    social_links?: Record<string, string>;
    career_highlights?: any[];
    monthly_listeners?: number;
    total_streams?: number;
    success_rate?: number;
    future_releases?: any[];
    spotify_artist_id?: string;
    spotify_embed_urls?: string[];
    spotify_profile_url?: string;
    spotify_data?: any;
    youtube_channel_id?: string;
    instagram_handle?: string;
    twitter_handle?: string;
    website_url?: string;
    verified_status?: boolean;
  }): Promise<any> {
    try {
      console.log('Efficient create: Creating new profile for user:', userId);
      
      const insertData = {
        user_id: userId,
        ...profileData,
        is_verified: false,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('Efficient create: Single database call with data:', insertData);
      
      const { data, error } = await supabase
        .from('artist_profiles')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Efficient create error:', error);
        throw error;
      }

      console.log('Efficient create successful:', data);
      return data;
    } catch (error) {
      console.error('Efficient create failed:', error);
      throw error;
    }
  }

  /**
   * Get profile by ID with career highlights
   */
  async getProfileById(profileId: string): Promise<any> {
    try {
      // Try to get from the view that includes career highlights
      const { data, error } = await supabase
        .from('artist_profiles_with_highlights')
        .select('*')
        .eq('id', profileId)
        .single();

      if (error) {
        console.error('Get profile with highlights error:', error);
        // Fallback to regular profile if view doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('artist_profiles')
          .select('*')
          .eq('id', profileId)
          .single();

        if (fallbackError) {
          console.error('Get profile fallback error:', fallbackError);
          throw fallbackError;
        }

        // If fallback succeeded, get career highlights separately
        const careerHighlightsService = new CareerHighlightsService();
        const highlights = await careerHighlightsService.getCareerHighlights(profileId);
        return { ...fallbackData, career_highlights: highlights };
      }

      return data;
    } catch (error) {
      console.error('Get profile failed:', error);
      throw error;
    }
  }

  /**
   * Get profile by user ID
   */
  async getProfileByUserId(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Get profile by user ID error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Get profile by user ID failed:', error);
      throw error;
    }
  }
} 
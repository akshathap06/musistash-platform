import { supabase } from '../lib/supabase';

// Helper function to retry failed requests
const retryRequest = async (requestFn: () => Promise<any>, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw error;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

export class SimpleArtistProfileService {
  async updateBasicProfile(profileId: string, basicData: {
    artist_name?: string;
    bio?: string;
    biography?: string;
    genre?: string[];
    location?: string;
    musical_style?: string;
    influences?: string;
  }): Promise<any> {
    try {
      console.log('Simple update with basic data:', basicData);

      return await retryRequest(async () => {
        const { data, error } = await supabase
          .from('artist_profiles')
          .update({
            ...basicData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profileId)
          .select()
          .single();

        if (error) {
          console.error('Simple update error:', error);
          throw error;
        }

        console.log('Simple update successful:', data);
        return data;
      });
    } catch (error) {
      console.error('Simple update failed after retries:', error);
      throw error;
    }
  }

  async updateSocialData(profileId: string, socialData: {
    social_links?: Record<string, string>;
    spotify_profile_url?: string;
    spotify_artist_id?: string;
    instagram_handle?: string;
    twitter_handle?: string;
    youtube_channel_id?: string;
    website_url?: string;
  }): Promise<any> {
    try {
      console.log('Updating social data:', socialData);

      // Update basic social links first
      if (socialData.social_links) {
        console.log('Updating social links:', socialData.social_links);
        const { data: linksData, error: linksError } = await supabase
          .from('artist_profiles')
          .update({
            social_links: socialData.social_links,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profileId)
          .select()
          .single();

        if (linksError) {
          console.error('Social links update error:', linksError);
          throw linksError;
        }

        console.log('Social links update successful:', linksData);
      }

      // Update handles separately
      const handlesData = {
        instagram_handle: socialData.instagram_handle || '',
        twitter_handle: socialData.twitter_handle || '',
        youtube_channel_id: socialData.youtube_channel_id || '',
        website_url: socialData.website_url || '',
        updated_at: new Date().toISOString(),
      };

      console.log('Updating handles:', handlesData);
      const { data: handlesResult, error: handlesError } = await supabase
        .from('artist_profiles')
        .update(handlesData)
        .eq('id', profileId)
        .select()
        .single();

      if (handlesError) {
        console.error('Handles update error:', handlesError);
        throw handlesError;
      }

      console.log('Handles update successful:', handlesResult);

      // Update Spotify data separately
      if (socialData.spotify_profile_url || socialData.spotify_artist_id) {
        const spotifyData = {
          spotify_profile_url: socialData.spotify_profile_url || '',
          spotify_artist_id: socialData.spotify_artist_id || '',
          updated_at: new Date().toISOString(),
        };

        console.log('Updating Spotify data:', spotifyData);
        const { data: spotifyResult, error: spotifyError } = await supabase
          .from('artist_profiles')
          .update(spotifyData)
          .eq('id', profileId)
          .select()
          .single();

        if (spotifyError) {
          console.error('Spotify data update error:', spotifyError);
          throw spotifyError;
        }

        console.log('Spotify data update successful:', spotifyResult);
      }

      // Get final updated profile
      const { data: finalData, error: finalError } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (finalError) {
        console.error('Final social data fetch error:', finalError);
        throw finalError;
      }

      console.log('Social data update completed successfully:', finalData);
      return finalData;
    } catch (error) {
      console.error('Social data update failed:', error);
      throw error;
    }
  }

  async updateStats(profileId: string, statsData: {
    monthly_listeners?: number;
    total_streams?: number;
    success_rate?: number;
    career_highlights?: any[];
    future_releases?: any[];
  }): Promise<any> {
    try {
      console.log('Updating stats:', statsData);

      // Break down stats into even smaller chunks
      const basicStats = {
        monthly_listeners: statsData.monthly_listeners || 0,
        total_streams: statsData.total_streams || 0,
        success_rate: statsData.success_rate || 0,
        updated_at: new Date().toISOString(),
      };

      console.log('Updating basic stats:', basicStats);
      const { data: basicData, error: basicError } = await supabase
        .from('artist_profiles')
        .update(basicStats)
        .eq('id', profileId)
        .select()
        .single();

      if (basicError) {
        console.error('Basic stats update error:', basicError);
        throw basicError;
      }

      console.log('Basic stats update successful:', basicData);

      // Update career highlights separately
      if (statsData.career_highlights) {
        console.log('Updating career highlights:', statsData.career_highlights);
        const { data: careerData, error: careerError } = await supabase
          .from('artist_profiles')
          .update({
            career_highlights: statsData.career_highlights,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profileId)
          .select()
          .single();

        if (careerError) {
          console.error('Career highlights update error:', careerError);
          throw careerError;
        }

        console.log('Career highlights update successful:', careerData);
      }

      // Update future releases separately
      if (statsData.future_releases) {
        console.log('Updating future releases:', statsData.future_releases);
        const { data: releasesData, error: releasesError } = await supabase
          .from('artist_profiles')
          .update({
            future_releases: statsData.future_releases,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profileId)
          .select()
          .single();

        if (releasesError) {
          console.error('Future releases update error:', releasesError);
          throw releasesError;
        }

        console.log('Future releases update successful:', releasesData);
      }

      // Get final updated profile
      const { data: finalData, error: finalError } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (finalError) {
        console.error('Final profile fetch error:', finalError);
        throw finalError;
      }

      console.log('Stats update completed successfully:', finalData);
      return finalData;
    } catch (error) {
      console.error('Stats update failed:', error);
      throw error;
    }
  }
} 
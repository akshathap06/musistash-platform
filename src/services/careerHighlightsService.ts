import { supabase } from '../lib/supabase';

export interface CareerHighlight {
  id?: string;
  year: string;
  title: string;
  description: string;
}

export class CareerHighlightsService {
  /**
   * Get career highlights for an artist profile
   */
  async getCareerHighlights(artistProfileId: string): Promise<CareerHighlight[]> {
    try {
      const { data, error } = await supabase
        .from('career_highlights')
        .select('id, year, title, description')
        .eq('artist_profile_id', artistProfileId)
        .order('year', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching career highlights:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch career highlights:', error);
      return [];
    }
  }

  /**
   * Update career highlights for an artist profile
   * Uses direct database operations instead of the hanging function
   */
  async updateCareerHighlights(artistProfileId: string, highlights: CareerHighlight[]): Promise<boolean> {
    try {
      console.log('Updating career highlights for profile:', artistProfileId);
      console.log('Highlights data:', highlights);

      // First, delete all existing highlights for this artist
      const { error: deleteError } = await supabase
        .from('career_highlights')
        .delete()
        .eq('artist_profile_id', artistProfileId);

      if (deleteError) {
        console.error('Error deleting existing career highlights:', deleteError);
        throw deleteError;
      }

      console.log('Deleted existing career highlights');

      // If no new highlights, we're done
      if (!highlights || highlights.length === 0) {
        console.log('No new highlights to insert');
        return true;
      }

      // Insert new highlights
      const highlightsToInsert = highlights.map(highlight => ({
        artist_profile_id: artistProfileId,
        year: highlight.year,
        title: highlight.title,
        description: highlight.description
      }));

      const { error: insertError } = await supabase
        .from('career_highlights')
        .insert(highlightsToInsert);

      if (insertError) {
        console.error('Error inserting career highlights:', insertError);
        throw insertError;
      }

      console.log('Career highlights updated successfully');
      return true;
    } catch (error) {
      console.error('Failed to update career highlights:', error);
      return false;
    }
  }

  /**
   * Add a single career highlight
   */
  async addCareerHighlight(artistProfileId: string, highlight: Omit<CareerHighlight, 'id'>): Promise<CareerHighlight | null> {
    try {
      const { data, error } = await supabase
        .from('career_highlights')
        .insert({
          artist_profile_id: artistProfileId,
          year: highlight.year,
          title: highlight.title,
          description: highlight.description
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding career highlight:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to add career highlight:', error);
      return null;
    }
  }

  /**
   * Delete a single career highlight
   */
  async deleteCareerHighlight(highlightId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('career_highlights')
        .delete()
        .eq('id', highlightId);

      if (error) {
        console.error('Error deleting career highlight:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete career highlight:', error);
      return false;
    }
  }

  /**
   * Get artist profile with career highlights using the view
   */
  async getArtistProfileWithHighlights(artistProfileId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('artist_profiles_with_highlights')
        .select('*')
        .eq('id', artistProfileId)
        .single();

      if (error) {
        console.error('Error fetching artist profile with highlights:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch artist profile with highlights:', error);
      return null;
    }
  }
} 
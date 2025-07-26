import { supabase } from '@/lib/supabase';

export interface FavoriteVenue {
  id: string;
  user_id: string;
  venue_id: string;
  venue_name: string;
  venue_address?: string;
  venue_phone?: string;
  venue_website?: string;
  venue_rating?: number;
  venue_total_ratings?: number;
  venue_types?: string[];
  venue_location?: string;
  venue_estimated_capacity?: string;
  venue_booking_difficulty?: string;
  venue_genre_suitability?: number;
  venue_booking_approach?: string;
  venue_description?: string;
  venue_booking_requirements?: string[];
  venue_amenities?: string[];
  created_at: string;
  updated_at: string;
}

export interface VenueData {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  total_ratings?: number;
  types?: string[];
  location?: string;
  estimated_capacity?: string;
  booking_difficulty?: string;
  genre_suitability?: number;
  booking_approach?: string;
  description?: string;
  booking_requirements?: string[];
  amenities?: string[];
}

class FavoriteVenuesService {
  async getFavoriteVenues(userId: string): Promise<FavoriteVenue[]> {
    try {
      const { data, error } = await supabase
        .from('favorite_venues')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorite venues:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFavoriteVenues:', error);
      throw error;
    }
  }

  async addFavoriteVenue(userId: string, venueData: VenueData): Promise<FavoriteVenue> {
    try {
      console.log('➕ Adding favorite venue...');
      console.log('👤 User ID:', userId);
      console.log('🏢 Venue data:', venueData);
      
      const venueToInsert = {
        user_id: userId,
        venue_id: venueData.id,
        venue_name: venueData.name,
        venue_address: venueData.address,
        venue_phone: venueData.phone,
        venue_website: venueData.website,
        venue_rating: venueData.rating,
        venue_total_ratings: venueData.total_ratings,
        venue_types: venueData.types,
        venue_location: venueData.location,
        venue_estimated_capacity: venueData.estimated_capacity,
        venue_booking_difficulty: venueData.booking_difficulty,
        venue_genre_suitability: venueData.genre_suitability,
        venue_booking_approach: venueData.booking_approach,
        venue_description: venueData.description,
        venue_booking_requirements: venueData.booking_requirements,
        venue_amenities: venueData.amenities,
      };

      console.log('📦 Data to insert:', venueToInsert);

      const { data, error } = await supabase
        .from('favorite_venues')
        .insert(venueToInsert)
        .select()
        .single();

      console.log('📊 Insert result:', { data, error });

      if (error) {
        console.error('❌ Error adding favorite venue:', error);
        throw error;
      }

      console.log('✅ Successfully added favorite venue:', data);
      return data;
    } catch (error) {
      console.error('❌ Error in addFavoriteVenue:', error);
      throw error;
    }
  }

  async removeFavoriteVenue(userId: string, venueId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('favorite_venues')
        .delete()
        .eq('user_id', userId)
        .eq('venue_id', venueId);

      if (error) {
        console.error('Error removing favorite venue:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in removeFavoriteVenue:', error);
      throw error;
    }
  }

  async isVenueFavorited(userId: string, venueId: string): Promise<boolean> {
    try {
      console.log('🔍 Checking if venue is favorited...');
      console.log('👤 User ID:', userId);
      console.log('🏢 Venue ID:', venueId);
      
      const { data, error } = await supabase
        .from('favorite_venues')
        .select('id')
        .eq('user_id', userId)
        .eq('venue_id', venueId)
        .single();

      console.log('📊 Query result:', { data, error });

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('❌ Error checking if venue is favorited:', error);
        throw error;
      }

      const isFavorited = !!data;
      console.log('✅ Venue favorited status:', isFavorited);
      return isFavorited;
    } catch (error) {
      console.error('❌ Error in isVenueFavorited:', error);
      return false;
    }
  }

  async toggleFavoriteVenue(userId: string, venueData: VenueData): Promise<boolean> {
    try {
      console.log('🔄 Toggling favorite for venue:', venueData.name, 'User ID:', userId);
      
      const isFavorited = await this.isVenueFavorited(userId, venueData.id);
      console.log('📊 Current favorite status:', isFavorited);
      
      if (isFavorited) {
        console.log('🗑️ Removing from favorites...');
        await this.removeFavoriteVenue(userId, venueData.id);
        return false; // Now unfavorited
      } else {
        console.log('❤️ Adding to favorites...');
        await this.addFavoriteVenue(userId, venueData);
        return true; // Now favorited
      }
    } catch (error) {
      console.error('❌ Error in toggleFavoriteVenue:', error);
      throw error;
    }
  }
}

export const favoriteVenuesService = new FavoriteVenuesService(); 
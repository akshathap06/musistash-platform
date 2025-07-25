"""
Supabase Configuration for MusiStash ML Integration
Handles database connections and operations for storing artist data
"""

import os
import json
from typing import Dict, List, Optional, Any
from datetime import datetime, date
import asyncio
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class SupabaseManager:
    def __init__(self):
        # Use the same fallback values as the frontend for consistency [[memory:4296231]]
        self.supabase_url = os.getenv('SUPABASE_URL') or 'https://dwbetxanfumneukrqodd.supabase.co'
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY') or 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YmV0eGFuZnVtbmV1a3Jxb2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDI2MzYsImV4cCI6MjA2ODM3ODYzNn0.CO3oIID2omAwuex2qE_dXbOYbtA_v9bC38VQizuXVJc'
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Supabase URL and key must be set in environment variables")
        
        self.client: Client = create_client(self.supabase_url, self.supabase_key)
    
    async def store_artist_profile(self, artist_data: Dict[str, Any]) -> Optional[str]:
        """
        Store or update artist profile in Supabase
        Returns the artist ID if successful
        """
        try:
            # Prepare data for storage
            profile_data = {
                'spotify_id': artist_data.get('id', ''),
                'name': artist_data.get('name', ''),
                'spotify_followers': artist_data.get('followers', 0),
                'spotify_popularity': artist_data.get('popularity', 0),
                'spotify_genres': artist_data.get('genres', []),
                'spotify_image_url': artist_data.get('image_url', ''),
                
                # Enhanced data from tier calculation
                'instagram_followers': artist_data.get('tier', {}).get('enhanced_data', {}).get('instagram_followers', 0),
                'net_worth_millions': artist_data.get('tier', {}).get('enhanced_data', {}).get('net_worth_millions', 0),
                'youtube_subscribers': artist_data.get('tier', {}).get('enhanced_data', {}).get('youtube_subscribers', 0),
                'monthly_streams_millions': artist_data.get('tier', {}).get('enhanced_data', {}).get('monthly_streams_millions', 0),
                'career_achievements': artist_data.get('tier', {}).get('enhanced_data', {}).get('career_achievements', []),
                'major_awards': artist_data.get('tier', {}).get('enhanced_data', {}).get('major_awards', []),
                
                # YouTube data
                'youtube_view_count': artist_data.get('youtube_data', {}).get('view_count', 0),
                'youtube_video_count': artist_data.get('youtube_data', {}).get('video_count', 0),
                'youtube_avg_views_per_video': artist_data.get('youtube_data', {}).get('avg_views_per_video', 0),
                'youtube_engagement_rate': artist_data.get('youtube_data', {}).get('engagement_rate', 0),
                'youtube_subscriber_view_ratio': artist_data.get('youtube_data', {}).get('subscriber_to_view_ratio', 0),
                
                # Genius data
                'genius_total_views': artist_data.get('genius_data', {}).get('total_genius_views', 0),
                'genius_avg_views_per_song': artist_data.get('genius_data', {}).get('avg_views_per_song', 0),
                'genius_hot_songs_count': artist_data.get('genius_data', {}).get('hot_songs_count', 0),
                'genius_mainstream_appeal': artist_data.get('genius_data', {}).get('avg_mainstream_appeal', 0),
                'genius_emotional_resonance': artist_data.get('genius_data', {}).get('avg_emotional_resonance', 0),
                'genius_commercial_themes': json.dumps(artist_data.get('genius_data', {}).get('commercial_themes', {})),
                
                # Audio features
                'audio_energy': artist_data.get('audio_features', {}).get('energy', 0),
                'audio_danceability': artist_data.get('audio_features', {}).get('danceability', 0),
                'audio_valence': artist_data.get('audio_features', {}).get('valence', 0),
                'audio_acousticness': artist_data.get('audio_features', {}).get('acousticness', 0),
                'audio_instrumentalness': artist_data.get('audio_features', {}).get('instrumentalness', 0),
                
                # Calculated features
                'genre_mainstream_score': self._calculate_genre_mainstream_score(artist_data.get('genres', [])),
                'genre_diversity_score': min(len(artist_data.get('genres', [])) / 5.0, 1.0),
                'tier_score': artist_data.get('tier', {}).get('composite_score', 0),
                'social_engagement_rate': self._calculate_social_engagement_rate(artist_data),
                
                'updated_at': datetime.now().isoformat()
            }
            
            # Check if artist already exists
            existing = self.client.table('artist_profiles').select('id').eq('spotify_id', profile_data['spotify_id']).execute()
            
            if existing.data:
                # Update existing record
                result = self.client.table('artist_profiles').update(profile_data).eq('spotify_id', profile_data['spotify_id']).execute()
                return existing.data[0]['id']
            else:
                # Insert new record
                result = self.client.table('artist_profiles').insert(profile_data).execute()
                return result.data[0]['id'] if result.data else None
                
        except Exception as e:
            print(f"Error storing artist profile: {e}")
            return None
    
    async def store_artist_comparison(self, artist1_id: str, artist2_id: str, comparison_data: Dict[str, Any]) -> Optional[str]:
        """
        Store artist comparison data
        """
        try:
            comparison_record = {
                'artist1_id': artist1_id,
                'artist2_id': artist2_id,
                'genre_similarity': comparison_data.get('genre_similarity', 0),
                'popularity_similarity': comparison_data.get('popularity_similarity', 0),
                'audience_similarity': comparison_data.get('audience_similarity', 0),
                'overall_similarity': comparison_data.get('overall_similarity', 0),
                'predicted_resonance_score': comparison_data.get('predicted_resonance_score', 0),
                'prediction_confidence': comparison_data.get('prediction_confidence', 0),
                'feature_importance': json.dumps(comparison_data.get('feature_importance', {})),
                'success_drivers': comparison_data.get('success_drivers', []),
                'risk_factors': comparison_data.get('risk_factors', []),
                'ai_insights': comparison_data.get('ai_insights', [])
            }
            
            result = self.client.table('artist_comparisons').insert(comparison_record).execute()
            return result.data[0]['id'] if result.data else None
            
        except Exception as e:
            print(f"Error storing artist comparison: {e}")
            return None
    
    async def store_ml_metrics(self, metrics_data: Dict[str, Any]) -> Optional[str]:
        """
        Store ML model performance metrics
        """
        try:
            metrics_record = {
                'model_version': metrics_data.get('model_version', '1.0.0'),
                'training_accuracy': metrics_data.get('training_accuracy', 0),
                'prediction_confidence': metrics_data.get('prediction_confidence', 0),
                'data_points_processed': metrics_data.get('data_points_processed', 0),
                'features_analyzed': metrics_data.get('features_analyzed', 0),
                'latency_ms': metrics_data.get('latency_ms', 0),
                'feature_importance': json.dumps(metrics_data.get('feature_importance', {})),
                'model_status': metrics_data.get('model_status', 'active'),
                'last_updated': datetime.now().isoformat()
            }
            
            result = self.client.table('ml_model_metrics').insert(metrics_record).execute()
            return result.data[0]['id'] if result.data else None
            
        except Exception as e:
            print(f"Error storing ML metrics: {e}")
            return None
    
    async def get_artist_profile(self, spotify_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve artist profile from Supabase
        """
        try:
            result = self.client.table('artist_profiles').select('*').eq('spotify_id', spotify_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"Error retrieving artist profile: {e}")
            return None
    
    async def get_all_artist_profiles(self) -> List[Dict[str, Any]]:
        """
        Retrieve all artist profiles for ML training
        """
        try:
            result = self.client.table('artist_profiles').select('*').execute()
            return result.data
        except Exception as e:
            print(f"Error retrieving all artist profiles: {e}")
            return []
    
    async def create_artist_snapshot(self, artist_id: str, snapshot_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a historical snapshot of artist data for growth analysis
        """
        try:
            snapshot_record = {
                'artist_id': artist_id,
                'snapshot_date': date.today().isoformat(),
                'spotify_followers': snapshot_data.get('spotify_followers', 0),
                'spotify_popularity': snapshot_data.get('spotify_popularity', 0),
                'youtube_subscribers': snapshot_data.get('youtube_subscribers', 0),
                'instagram_followers': snapshot_data.get('instagram_followers', 0),
                'monthly_growth_rate': snapshot_data.get('monthly_growth_rate', 0)
            }
            
            result = self.client.table('artist_snapshots').insert(snapshot_record).execute()
            return result.data[0]['id'] if result.data else None
            
        except Exception as e:
            print(f"Error creating artist snapshot: {e}")
            return None
    
    async def get_latest_ml_metrics(self) -> Optional[Dict[str, Any]]:
        """
        Get the latest ML model metrics from Supabase
        """
        try:
            result = self.client.table('ml_model_metrics').select('*').order('created_at', desc=True).limit(1).execute()
            if result.data:
                return result.data[0]
            return None
        except Exception as e:
            print(f"Error retrieving latest ML metrics: {e}")
            return None
    
    async def search_artists(self, query: str) -> List[Dict[str, Any]]:
        """
        Search for artists in Supabase by name
        """
        try:
            # Search by name (case insensitive)
            result = self.client.table('artist_profiles').select('*').ilike('name', f'%{query}%').limit(10).execute()
            
            # Convert to frontend format
            artists = []
            for artist in result.data:
                artists.append({
                    'name': artist.get('name', ''),
                    'followers': artist.get('spotify_followers', 0),
                    'genres': artist.get('spotify_genres', []),
                    'popularity': artist.get('spotify_popularity', 0),
                    'image_url': artist.get('spotify_image_url', ''),
                    'tier_score': artist.get('tier_score', 0)
                })
            
            return artists
            
        except Exception as e:
            print(f"Error searching artists: {e}")
            return []
    
    async def get_artist_count(self) -> int:
        """
        Get total number of artists in database
        """
        try:
            result = self.client.table('artist_profiles').select('id', count='exact').execute()
            return result.count or 0
        except Exception as e:
            print(f"Error getting artist count: {e}")
            return 0
    
    async def get_comparison_count(self) -> int:
        """
        Get total number of artist comparisons in database
        """
        try:
            result = self.client.table('artist_comparisons').select('id', count='exact').execute()
            return result.count or 0
        except Exception as e:
            print(f"Error getting comparison count: {e}")
            return 0
    
    def _calculate_genre_mainstream_score(self, genres: List[str]) -> float:
        """
        Calculate how mainstream an artist's genres are (0-1)
        """
        mainstream_genres = ['pop', 'hip-hop', 'rap', 'r&b', 'country', 'rock', 'edm', 'electronic']
        if not genres:
            return 0.0
        
        mainstream_count = sum(1 for genre in genres if any(mainstream in genre.lower() for mainstream in mainstream_genres))
        return min(mainstream_count / len(genres), 1.0)
    
    def _calculate_social_engagement_rate(self, artist_data: Dict[str, Any]) -> float:
        """
        Calculate social engagement rate based on available data
        """
        followers = artist_data.get('followers', 0)
        if followers == 0:
            return 0.0
        
        # Simple calculation - can be enhanced with real engagement data
        youtube_engagement = artist_data.get('youtube_data', {}).get('engagement_rate', 0)
        return min(youtube_engagement / 100, 1.0)  # Normalize to 0-1

# Global instance - initialize only if credentials are valid
try:
    supabase_manager = SupabaseManager()
    print("✅ Supabase manager initialized successfully")
except Exception as e:
    print(f"⚠️  Supabase manager initialization failed: {e}")
    print("   Using fallback mode - data will not be stored in Supabase")
    supabase_manager = None 
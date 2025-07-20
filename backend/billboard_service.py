"""
Billboard Chart Service for MusiStash
Fetches chart performance data for artists
"""

import asyncio
from typing import Dict, Optional, List
from billboard import ChartData
import re

class BillboardService:
    def __init__(self):
        self.charts = ['hot-100', 'billboard-200', 'artist-100']
    
    async def get_artist_billboard_data(self, artist_name: str) -> Dict:
        """
        Get comprehensive Billboard data for an artist
        """
        try:
            # Search across multiple charts
            hot_100_data = await self._search_chart('hot-100', artist_name)
            billboard_200_data = await self._search_chart('billboard-200', artist_name)
            artist_100_data = await self._search_chart('artist-100', artist_name)
            
            # Combine results
            combined_data = {
                'hot_100': hot_100_data,
                'billboard_200': billboard_200_data,
                'artist_100': artist_100_data,
                'current_position': None,
                'peak_position': None,
                'weeks_on_chart': 0,
                'total_chart_entries': 0,
                'chart_performance_score': 0
            }
            
            # Calculate overall metrics
            all_entries = []
            if hot_100_data:
                all_entries.extend(hot_100_data.get('entries', []))
            if billboard_200_data:
                all_entries.extend(billboard_200_data.get('entries', []))
            if artist_100_data:
                all_entries.extend(artist_100_data.get('entries', []))
            
            if all_entries:
                # Find best current position
                current_positions = [entry.get('current_position') for entry in all_entries if entry.get('current_position')]
                combined_data['current_position'] = min(current_positions) if current_positions else None
                
                # Find best peak position
                peak_positions = [entry.get('peak_position') for entry in all_entries if entry.get('peak_position')]
                combined_data['peak_position'] = min(peak_positions) if peak_positions else None
                
                # Sum weeks on chart
                combined_data['weeks_on_chart'] = sum(entry.get('weeks_on_chart', 0) for entry in all_entries)
                combined_data['total_chart_entries'] = len(all_entries)
                
                # Calculate performance score (0-100)
                combined_data['chart_performance_score'] = self._calculate_performance_score(combined_data)
            
            return combined_data
            
        except Exception as e:
            print(f"Error fetching Billboard data for {artist_name}: {e}")
            return self._get_fallback_billboard_data()
    
    async def _search_chart(self, chart_name: str, artist_name: str) -> Optional[Dict]:
        """
        Search for artist in a specific chart
        """
        try:
            # Get current chart
            chart = ChartData(chart_name)
            
            # Search for artist in chart entries
            entries = []
            for entry in chart:
                if self._artist_name_matches(entry.artist, artist_name):
                    entry_data = {
                        'title': entry.title,
                        'artist': entry.artist,
                        'current_position': entry.rank,
                        'peak_position': entry.peakPos,
                        'weeks_on_chart': entry.weeks,
                        'last_week_position': entry.lastWeek,
                        'chart_name': chart_name
                    }
                    entries.append(entry_data)
            
            if entries:
                return {
                    'chart_name': chart_name,
                    'entries': entries,
                    'total_entries': len(entries)
                }
            
            return None
            
        except Exception as e:
            print(f"Error searching {chart_name} for {artist_name}: {e}")
            return None
    
    def _artist_name_matches(self, chart_artist: str, search_artist: str) -> bool:
        """
        Check if artist names match (with fuzzy matching)
        """
        # Clean names for comparison
        chart_clean = re.sub(r'[^\w\s]', '', chart_artist.lower())
        search_clean = re.sub(r'[^\w\s]', '', search_artist.lower())
        
        # Exact match
        if chart_clean == search_clean:
            return True
        
        # Partial match (search artist is contained in chart artist)
        if search_clean in chart_clean:
            return True
        
        # Partial match (chart artist is contained in search artist)
        if chart_clean in search_clean:
            return True
        
        # Word-based matching
        chart_words = set(chart_clean.split())
        search_words = set(search_clean.split())
        
        # If more than 50% of words match
        if len(chart_words.intersection(search_words)) / max(len(chart_words), len(search_words)) > 0.5:
            return True
        
        return False
    
    def _calculate_performance_score(self, data: Dict) -> float:
        """
        Calculate a performance score (0-100) based on chart data
        """
        score = 0
        
        # Current position bonus (better position = higher score)
        if data.get('current_position'):
            if data['current_position'] <= 10:
                score += 40
            elif data['current_position'] <= 50:
                score += 25
            elif data['current_position'] <= 100:
                score += 10
        
        # Peak position bonus
        if data.get('peak_position'):
            if data['peak_position'] <= 10:
                score += 30
            elif data['peak_position'] <= 50:
                score += 20
            elif data['peak_position'] <= 100:
                score += 10
        
        # Weeks on chart bonus
        weeks = data.get('weeks_on_chart', 0)
        if weeks >= 52:  # 1 year
            score += 20
        elif weeks >= 26:  # 6 months
            score += 15
        elif weeks >= 12:  # 3 months
            score += 10
        elif weeks >= 4:   # 1 month
            score += 5
        
        # Multiple chart entries bonus
        entries = data.get('total_chart_entries', 0)
        if entries >= 10:
            score += 10
        elif entries >= 5:
            score += 5
        elif entries >= 1:
            score += 2
        
        return min(score, 100)
    
    def _get_fallback_billboard_data(self) -> Dict:
        """
        Return fallback data when Billboard API fails
        """
        return {
            'hot_100': None,
            'billboard_200': None,
            'artist_100': None,
            'current_position': None,
            'peak_position': None,
            'weeks_on_chart': 0,
            'total_chart_entries': 0,
            'chart_performance_score': 0
        }
    
    async def get_trending_artists(self, limit: int = 10) -> List[Dict]:
        """
        Get currently trending artists from Billboard charts
        """
        try:
            trending = []
            
            # Get top artists from Artist 100
            artist_chart = ChartData('artist-100')
            for i, entry in enumerate(artist_chart[:limit]):
                trending.append({
                    'name': entry.artist,
                    'position': entry.rank,
                    'weeks_on_chart': entry.weeks,
                    'chart': 'artist-100'
                })
            
            return trending
            
        except Exception as e:
            print(f"Error fetching trending artists: {e}")
            return []

# Global instance
billboard_service = BillboardService() 
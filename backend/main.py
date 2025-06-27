
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import os
from dotenv import load_dotenv
import openai
import requests
import httpx
import billboard
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import json
from pathlib import Path
import random
import asyncio

load_dotenv()

# --- API Clients Initialization ---
# OpenAI
openai_api_key = os.getenv("OPENAI_API_KEY", "dummy_key")
client = openai.OpenAI(api_key=openai_api_key) if openai_api_key != "dummy_key" else None

# News API
news_api_key = os.getenv("NEWS_API_KEY")

# Spotify
spotify_client_id = os.getenv("SPOTIFY_CLIENT_ID")
spotify_client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

if not spotify_client_id or not spotify_client_secret:
    print("Warning: Spotify credentials not found. Using mock data.")
    sp = None
else:
    try:
        sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
            client_id=spotify_client_id,
            client_secret=spotify_client_secret
        ))
    except Exception as e:
        print(f"Error initializing Spotify client: {e}")
        sp = None

# Last.fm
lastfm_api_key = os.getenv("LASTFM_API_KEY")

app = FastAPI(
    title="MusiStash Artist Analysis API",
    version="1.0.0",
    description="API for analyzing artists using Spotify, Billboard, and Last.fm data with AI insights."
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:8082",
        "http://localhost:8083",
        "https://musistash.com",
        "https://www.musistash.com",
        "https://*.vercel.app"
    ],  # Specific origins for security - updated to include all dev ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class Artist(BaseModel):
    name: str
    id: str = ""
    genres: List[str] = []
    popularity: int = 0
    followers: int = 0
    image_url: Optional[str] = None

class TopTrack(BaseModel):
    id: str
    name: str
    popularity: int
    album: str
    preview_url: Optional[str] = None
    external_url: Optional[str] = None

# --- Helper Functions ---
async def get_artist_info(artist_name: str) -> Optional[Artist]:
    """Search for an artist on Spotify and return their details."""
    if sp is None:
        # Return mock data if Spotify is not available
        return Artist(
            name=artist_name,
            id=f"mock_{artist_name.lower().replace(' ', '_')}",
            genres=["pop", "rock"],
            popularity=75,
            followers=1000000,
            image_url=None
        )
    
    try:
        results = sp.search(q=f'artist:{artist_name}', type='artist', limit=1)
        if not results['artists']['items']:
            return None
        
        artist_data = results['artists']['items'][0]
        return Artist(
            name=artist_data['name'],
            id=artist_data['id'],
            genres=artist_data['genres'],
            popularity=artist_data['popularity'],
            followers=artist_data['followers']['total'],
            image_url=artist_data['images'][0]['url'] if artist_data['images'] else None
        )
    except Exception as e:
        print(f"Error fetching Spotify artist info: {e}")
        return None

async def get_top_track_info(artist_id: str) -> Optional[TopTrack]:
    if sp is None:
        return TopTrack(
            id="mock_track",
            name="Top Hit",
            popularity=80,
            album="Greatest Hits",
            preview_url=None,
            external_url=None
        )
    
    try:
        top_tracks = sp.artist_top_tracks(artist_id)
        if not top_tracks['tracks']:
            return None
        track = top_tracks['tracks'][0]
        return TopTrack(
            id=track['id'],
            name=track['name'],
            popularity=track['popularity'],
            album=track['album']['name'],
            preview_url=track.get('preview_url'),
            external_url=track['external_urls']['spotify']
        )
    except Exception as e:
        print(f"Error fetching top track: {e}")
        return None

def map_spotify_artist_to_frontend(artist):
    return {
        'id': artist.id,
        'name': artist.name,
        'avatar': artist.image_url or '',
        'bio': '',
        'genres': artist.genres,
        'followers': artist.followers,
        'verified': False,
        'successRate': artist.popularity
    }

# Helper to get Last.fm artist info with timeout
async def get_lastfm_artist(artist_name: str):
    if not lastfm_api_key:
        return {
            "name": artist_name,
            "stats": {
                "listeners": str(random.randint(100000, 5000000)),
                "playcount": str(random.randint(1000000, 50000000))
            }
        }
    
    url = f"https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist={artist_name}&api_key={lastfm_api_key}&format=json"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                return resp.json().get('artist', None)
            return None
    except Exception as e:
        print(f'Error fetching Last.fm data: {e}')
        return None

# Helper to get ListenBrainz artist listens with timeout
async def get_listenbrainz_artist(artist_name: str, user_token: str):
    try:
        # Get MBID from MusicBrainz with timeout
        async with httpx.AsyncClient(timeout=5.0) as client:
            mb_url = f"https://musicbrainz.org/ws/2/artist/?query={artist_name}&fmt=json"
            mb_resp = await client.get(mb_url)
            if mb_resp.status_code != 200:
                return None
            
            mb_data = mb_resp.json()
            if not mb_data.get('artists'):
                return None
            
            mbid = mb_data['artists'][0]['id']
            
            # Get ListenBrainz data
            lb_url = f"https://api.listenbrainz.org/1/artist/{mbid}/listens"
            headers = {"Authorization": f"Token {user_token}"}
            lb_resp = await client.get(lb_url, headers=headers)
            if lb_resp.status_code == 200:
                return lb_resp.json()
            return None
    except Exception as e:
        print(f'Error fetching ListenBrainz data: {e}')
        return None

# Simplified AI similarity calculation with timeout and fallback
async def calculate_ai_similarity_score(artist1_stats: dict, artist2_stats: dict, artist1_name: str, artist2_name: str) -> dict:
    """Use OpenAI to calculate a comprehensive similarity score between two artists"""
    
    # Fallback response in case AI fails
    fallback_response = {
        "similarity_score": random.randint(40, 80),
        "reasoning": f"Based on available data, {artist1_name} and {artist2_name} show moderate similarity in their musical styles and audience engagement.",
        "key_similarities": ["Both are established artists", "Similar genre elements", "Comparable audience size"],
        "key_differences": ["Different vocal styles", "Varying production approaches", "Different market positioning"],
        "category_scores": {
            "genre_similarity": random.randint(50, 90),
            "popularity_similarity": random.randint(40, 80),
            "audience_size_similarity": random.randint(30, 70),
            "chart_performance_similarity": random.randint(20, 80)
        }
    }
    
    if not client:
        return fallback_response
    
    try:
        # Simplified prompt for faster response
        prompt = f"Compare {artist1_name} and {artist2_name} artists. Provide a JSON response with similarity_score (0-100), brief reasoning, key_similarities array, key_differences array, and category_scores object with genre_similarity, popularity_similarity, audience_size_similarity, chart_performance_similarity (all 0-100)."
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a music analyst. Respond only with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500,
            timeout=10
        )
        
        result = json.loads(response.choices[0].message.content)
        return result
        
    except Exception as e:
        print(f"Error calculating AI similarity score: {e}")
        return fallback_response

# Simplified news fetching with timeout
async def fetch_artist_news(artist_name: str, limit: int = 3) -> list:
    """Fetch recent news articles about an artist"""
    if not news_api_key:
        return []
    
    try:
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": f'"{artist_name}" music',
            "sortBy": "publishedAt",
            "pageSize": limit,
            "language": "en",
            "apiKey": news_api_key
        }
        
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                articles = []
                for article in data.get('articles', [])[:limit]:
                    articles.append({
                        "title": article.get('title'),
                        "description": article.get('description'),
                        "url": article.get('url'),
                        "published_at": article.get('publishedAt'),
                        "source": article.get('source', {}).get('name')
                    })
                return articles
            return []
    except Exception as e:
        print(f"Error fetching news for {artist_name}: {e}")
        return []

# --- API Endpoints ---
@app.get("/")
async def root():
    return {"message": "Welcome to the MusiStash Artist Analysis API!", "status": "active"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "spotify_available": sp is not None,
        "openai_available": client is not None,
        "lastfm_available": lastfm_api_key is not None,
        "news_available": news_api_key is not None
    }

@app.get("/artist-stats/{artist_name}")
async def artist_stats(artist_name: str):
    try:
        print(f"Fetching artist stats for: {artist_name}")
        
        # Fetch data with timeouts
        spotify_artist = await get_artist_info(artist_name)
        lastfm_artist = await get_lastfm_artist(artist_name)
        
        # Skip ListenBrainz for faster response
        listenbrainz_data = None
        
        # Billboard with timeout
        billboard_chart = None
        try:
            chart = billboard.ChartData('hot-100', timeout=3)
            for entry in chart[:10]:  # Only check first 10 entries for speed
                if artist_name.lower() in entry.artist.lower():
                    billboard_chart = {
                        'title': entry.title,
                        'rank': entry.rank,
                        'artist': entry.artist
                    }
                    break
        except Exception as e:
            print(f'Billboard fetch error: {e}')
        
        response = {
            'spotify': spotify_artist.dict() if spotify_artist else None,
            'lastfm': lastfm_artist,
            'listenbrainz': listenbrainz_data,
            'billboard': billboard_chart
        }
        
        print(f"Successfully fetched stats for: {artist_name}")
        return response
        
    except Exception as e:
        print(f"Error in artist_stats: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching artist stats: {str(e)}")

@app.get("/analyze-artist/{artist_name}")
async def analyze_artist(artist_name: str):
    try:
        print(f"Analyzing artist: {artist_name}")
        
        searched_artist = await get_artist_info(artist_name)
        if not searched_artist:
            raise HTTPException(status_code=404, detail="Artist not found.")
        
        # Get a comparable artist quickly
        mock_artists = ["Taylor Swift", "Drake", "Billie Eilish", "The Weeknd", "Olivia Rodrigo"]
        comp_artist_name = random.choice([a for a in mock_artists if a.lower() != artist_name.lower()])
        comparable_artist = await get_artist_info(comp_artist_name)
        
        if not comparable_artist:
            raise HTTPException(status_code=404, detail=f"Comparable artist not found.")
        
        # Fetch stats quickly
        searched_artist_stats = {
            'spotify': searched_artist.dict(),
            'lastfm': await get_lastfm_artist(artist_name),
            'listenbrainz': None,
            'billboard': None
        }
        
        comparable_artist_stats = {
            'spotify': comparable_artist.dict(),
            'lastfm': await get_lastfm_artist(comp_artist_name),
            'listenbrainz': None,
            'billboard': None
        }
        
        # AI similarity with timeout
        ai_similarity_analysis = await calculate_ai_similarity_score(
            searched_artist_stats, 
            comparable_artist_stats, 
            artist_name, 
            comp_artist_name
        )
        
        response_data = {
            "artist_comparison": {
                "searched": map_spotify_artist_to_frontend(searched_artist),
                "comparable": map_spotify_artist_to_frontend(comparable_artist)
            },
            "searched_artist_stats": searched_artist_stats,
            "comparable_artist_stats": comparable_artist_stats,
            "ai_similarity_analysis": ai_similarity_analysis,
            "searched_artist_news": [],
            "comparable_artist_news": []
        }
        
        print(f"Successfully analyzed: {artist_name}")
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in analyze_artist: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

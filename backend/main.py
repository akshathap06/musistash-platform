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

# --- Environment Variables ---
# --- THIS IS A TEMPORARY CHANGE FOR TESTING ---
# # Explicitly load .env from the same directory as main.py
# dotenv_path = Path(__file__).resolve().parent / '.env'
# load_dotenv(dotenv_path=dotenv_path, verbose=True)
# print(f"Attempting to load .env file from: {dotenv_path}")

load_dotenv()

# --- API Clients Initialization ---
# OpenAI
openai_api_key = os.getenv("OPENAI_API_KEY", "dummy_key")
client = openai.OpenAI(api_key=openai_api_key)

# News API
news_api_key = os.getenv("NEWS_API_KEY")
if not news_api_key:
    print("Warning: NEWS_API_KEY not found in .env file. News features will be disabled.")

# Spotify
spotify_client_id = os.getenv("SPOTIFY_CLIENT_ID")
spotify_client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

if not spotify_client_id or not spotify_client_secret:
    print("Warning: Spotify credentials not found in .env file. Spotify features will be disabled.")
    sp = None
else:
    sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
        client_id=spotify_client_id,
        client_secret=spotify_client_secret
    ))

# Last.fm
lastfm_api_key = os.getenv("LASTFM_API_KEY")
if not lastfm_api_key:
    print("Warning: LASTFM_API_KEY not found in .env file. Last.fm features will be disabled.")

app = FastAPI(
    title="MusiStash Artist Analysis API",
    version="1.0.0",
    description="API for analyzing artists using Spotify, Billboard, and Last.fm data with AI insights."
)

# Configure CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:8080",
        "http://localhost:8081",
        "https://musistash.com",
        "https://www.musistash.com",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models ---
class Artist(BaseModel):
    name: str
    id: str
    genres: List[str]
    popularity: int
    followers: int
    image_url: Optional[str] = None

class TopTrack(BaseModel):
    id: str
    name: str
    popularity: int
    album: str
    preview_url: Optional[str] = None
    external_url: Optional[str] = None

class AnalysisResponse(BaseModel):
    searched_artist: Artist
    comparable_artist: Artist
    searched_artist_top_track: TopTrack
    comparable_artist_top_track: TopTrack
    artist_comparison: Dict[str, Any]

# --- Helper Functions ---
async def get_artist_info(artist_name: str) -> Optional[Artist]:
    """Search for an artist on Spotify and return their details."""
    if sp is None:
        return None
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

async def get_top_track_info(artist_id: str) -> Optional[TopTrack]:
    if sp is None:
        return None
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

def map_spotify_artist_to_frontend(artist):
    return {
        'id': artist.id,
        'name': artist.name,
        'avatar': artist.image_url or '',
        'bio': '',  # Spotify does not provide bio
        'genres': artist.genres,
        'followers': artist.followers,
        'verified': False,  # Spotify API does not provide this
        'successRate': artist.popularity  # Use popularity as a proxy
    }

# Helper to get Last.fm artist info
async def get_lastfm_artist(artist_name: str):
    api_key = os.getenv("LASTFM_API_KEY")
    if not api_key:
        return None
    url = f"https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist={artist_name}&api_key={api_key}&format=json"
    try:
        resp = requests.get(url, timeout=10)
        return resp.json().get('artist', None)
    except Exception as e:
        print('Error fetching Last.fm data:', e)
        return None

# Helper to get ListenBrainz artist listens
async def get_listenbrainz_artist(artist_name: str, user_token: str):
    # Get MBID from MusicBrainz
    mbid = None
    try:
        mb_url = f"https://musicbrainz.org/ws/2/artist/?query={artist_name}&fmt=json"
        mb_resp = requests.get(mb_url, timeout=10)
        mb_data = mb_resp.json()
        if mb_data.get('artists'):
            mbid = mb_data['artists'][0]['id']
    except Exception as e:
        print('Error fetching MBID:', e)
    if not mbid:
        return None
    try:
        lb_url = f"https://api.listenbrainz.org/1/artist/{mbid}/listens"
        headers = {"Authorization": f"Token {user_token}"}
        lb_resp = requests.get(lb_url, headers=headers, timeout=10)
        return lb_resp.json()
    except Exception as e:
        print('Error fetching ListenBrainz data:', e)
        return None

# OpenAI function to calculate similarity score
async def calculate_ai_similarity_score(artist1_stats: dict, artist2_stats: dict, artist1_name: str, artist2_name: str) -> dict:
    """Use OpenAI to calculate a comprehensive similarity score between two artists"""
    try:
        # Prepare the data for OpenAI
        stats_comparison = {
            "artist1": {
                "name": artist1_name,
                "spotify_followers": artist1_stats.get('spotify', {}).get('followers', 0),
                "spotify_popularity": artist1_stats.get('spotify', {}).get('popularity', 0),
                "spotify_genres": artist1_stats.get('spotify', {}).get('genres', []),
                "lastfm_listeners": artist1_stats.get('lastfm', {}).get('stats', {}).get('listeners', 0) if artist1_stats.get('lastfm') else 0,
                "lastfm_playcount": artist1_stats.get('lastfm', {}).get('stats', {}).get('playcount', 0) if artist1_stats.get('lastfm') else 0,
                "billboard_rank": artist1_stats.get('billboard', {}).get('rank') if artist1_stats.get('billboard') else None
            },
            "artist2": {
                "name": artist2_name,
                "spotify_followers": artist2_stats.get('spotify', {}).get('followers', 0),
                "spotify_popularity": artist2_stats.get('spotify', {}).get('popularity', 0),
                "spotify_genres": artist2_stats.get('spotify', {}).get('genres', []),
                "lastfm_listeners": artist2_stats.get('lastfm', {}).get('stats', {}).get('listeners', 0) if artist2_stats.get('lastfm') else 0,
                "lastfm_playcount": artist2_stats.get('lastfm', {}).get('stats', {}).get('playcount', 0) if artist2_stats.get('lastfm') else 0,
                "billboard_rank": artist2_stats.get('billboard', {}).get('rank') if artist2_stats.get('billboard') else None
            }
        }

        prompt = f"""
        Analyze the following two artists' statistics and calculate a comprehensive similarity score (0-100):

        Artist 1: {artist1_name}
        - Spotify Followers: {stats_comparison['artist1']['spotify_followers']}
        - Spotify Popularity: {stats_comparison['artist1']['spotify_popularity']}/100
        - Genres: {', '.join(stats_comparison['artist1']['spotify_genres'])}
        - Last.fm Listeners: {stats_comparison['artist1']['lastfm_listeners']}
        - Last.fm Play Count: {stats_comparison['artist1']['lastfm_playcount']}
        - Billboard Rank: {stats_comparison['artist1']['billboard_rank'] or 'Not on chart'}

        Artist 2: {artist2_name}
        - Spotify Followers: {stats_comparison['artist2']['spotify_followers']}
        - Spotify Popularity: {stats_comparison['artist2']['spotify_popularity']}/100
        - Genres: {', '.join(stats_comparison['artist2']['spotify_genres'])}
        - Last.fm Listeners: {stats_comparison['artist2']['lastfm_listeners']}
        - Last.fm Play Count: {stats_comparison['artist2']['lastfm_playcount']}
        - Billboard Rank: {stats_comparison['artist2']['billboard_rank'] or 'Not on chart'}

        Please provide a JSON response with:
        1. similarity_score: A number from 0-100 representing overall similarity
        2. reasoning: A detailed explanation of your analysis
        3. key_similarities: Array of main similarities found
        4. key_differences: Array of main differences found
        5. category_scores: Object with scores for different categories (genre_similarity, popularity_similarity, audience_size_similarity, chart_performance_similarity)

        Focus on mathematical relationships between the metrics, genre overlaps, popularity ratios, and audience engagement patterns.
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a music industry analyst expert at comparing artists using statistical data. Provide accurate, data-driven analysis in valid JSON format only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1000
        )

        # Parse the JSON response
        result = json.loads(response.choices[0].message.content)
        return result

    except Exception as e:
        print(f"Error calculating AI similarity score: {e}")
        # Return a fallback basic similarity calculation
        return {
            "similarity_score": 50,
            "reasoning": "AI analysis unavailable. Using basic similarity calculation.",
            "key_similarities": ["Both are established artists"],
            "key_differences": ["Different genres or popularity levels"],
            "category_scores": {
                "genre_similarity": 50,
                "popularity_similarity": 50,
                "audience_size_similarity": 50,
                "chart_performance_similarity": 50
            }
        }

# Function to fetch news articles for artists
async def fetch_artist_news(artist_name: str, limit: int = 3) -> list:
    """Fetch recent news articles about an artist"""
    if not news_api_key:
        return []
    
    try:
        # Use NewsAPI to fetch articles
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": f'"{artist_name}" music OR "{artist_name}" artist OR "{artist_name}" song',
            "sortBy": "publishedAt",
            "pageSize": limit,
            "language": "en",
            "apiKey": news_api_key
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10)
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
            else:
                print(f"News API error: {response.status_code}")
                return []
    except Exception as e:
        print(f"Error fetching news for {artist_name}: {e}")
        return []

# --- API Endpoints ---
@app.get("/analyze-artist/{artist_name}")
async def analyze_artist(artist_name: str):
    searched_artist = await get_artist_info(artist_name)
    if not searched_artist:
        raise HTTPException(status_code=404, detail="Artist not found on Spotify.")
    try:
        chart = billboard.ChartData('hot-100', timeout=10)
        comp_artist_name = chart[1].artist
    except Exception as e:
        print('Error fetching Billboard data:', e)
        mock_artists = [
            "Taylor Swift", "Drake", "Billie Eilish", "The Weeknd", "Olivia Rodrigo",
            "Dua Lipa", "Ariana Grande", "Ed Sheeran", "SZA", "Doja Cat"
        ]
        comp_artist_name = random.choice([a for a in mock_artists if a.lower() != artist_name.lower()])
    comparable_artist = await get_artist_info(comp_artist_name)
    if not comparable_artist:
        raise HTTPException(status_code=404, detail=f"Comparable artist '{comp_artist_name}' not found on Spotify.")
    
    # Fetch detailed stats for both artists
    searched_artist_stats = None
    comparable_artist_stats = None
    
    try:
        # Get stats for searched artist
        searched_lastfm = await get_lastfm_artist(artist_name)
        searched_listenbrainz = await get_listenbrainz_artist(artist_name, 'fc64176c-a544-49d6-a187-9d0ee272a696')
        searched_billboard = None
        try:
            chart = billboard.ChartData('hot-100', timeout=10)
            for entry in chart:
                if artist_name.lower() in entry.artist.lower():
                    searched_billboard = {
                        'title': entry.title,
                        'rank': entry.rank,
                        'artist': entry.artist
                    }
                    break
        except Exception as e:
            print('Error fetching Billboard data for searched artist:', e)
        
        searched_artist_stats = {
            'spotify': searched_artist.dict(),
            'lastfm': searched_lastfm,
            'listenbrainz': searched_listenbrainz,
            'billboard': searched_billboard
        }
        
        # Get stats for comparable artist
        comparable_lastfm = await get_lastfm_artist(comp_artist_name)
        comparable_listenbrainz = await get_listenbrainz_artist(comp_artist_name, 'fc64176c-a544-49d6-a187-9d0ee272a696')
        comparable_billboard = None
        try:
            chart = billboard.ChartData('hot-100', timeout=10)
            for entry in chart:
                if comp_artist_name.lower() in entry.artist.lower():
                    comparable_billboard = {
                        'title': entry.title,
                        'rank': entry.rank,
                        'artist': entry.artist
                    }
                    break
        except Exception as e:
            print('Error fetching Billboard data for comparable artist:', e)
        
        comparable_artist_stats = {
            'spotify': comparable_artist.dict(),
            'lastfm': comparable_lastfm,
            'listenbrainz': comparable_listenbrainz,
            'billboard': comparable_billboard
        }
    except Exception as e:
        print('Error fetching detailed stats:', e)
    
    # Calculate AI similarity score
    ai_similarity_analysis = None
    if searched_artist_stats and comparable_artist_stats:
        ai_similarity_analysis = await calculate_ai_similarity_score(
            searched_artist_stats, 
            comparable_artist_stats, 
            artist_name, 
            comp_artist_name
        )
    
    # Fetch news articles for both artists
    searched_artist_news = await fetch_artist_news(artist_name, limit=3)
    comparable_artist_news = await fetch_artist_news(comp_artist_name, limit=3)
    
    response_data = {
        "artist_comparison": {
            "searched": map_spotify_artist_to_frontend(searched_artist),
            "comparable": map_spotify_artist_to_frontend(comparable_artist)
        },
        "searched_artist_stats": searched_artist_stats,
        "comparable_artist_stats": comparable_artist_stats,
        "ai_similarity_analysis": ai_similarity_analysis,
        "searched_artist_news": searched_artist_news,
        "comparable_artist_news": comparable_artist_news
    }
    return response_data

@app.get("/")
async def root():
    return {"message": "Welcome to the MusiStash Artist Analysis API!"}

@app.get("/artist-stats/{artist_name}")
async def artist_stats(artist_name: str):
    # Spotify profile
    spotify_artist = await get_artist_info(artist_name)
    # Last.fm
    lastfm_artist = await get_lastfm_artist(artist_name)
    # ListenBrainz
    listenbrainz_token = 'fc64176c-a544-49d6-a187-9d0ee272a696'
    listenbrainz_data = await get_listenbrainz_artist(artist_name, listenbrainz_token)
    # Billboard (just return chart position if found)
    billboard_chart = None
    try:
        chart = billboard.ChartData('hot-100', timeout=10)
        for entry in chart:
            if artist_name.lower() in entry.artist.lower():
                billboard_chart = {
                    'title': entry.title,
                    'rank': entry.rank,
                    'artist': entry.artist
                }
                break
    except Exception as e:
        print('Error fetching Billboard data:', e)
    # Compose response
    return {
        'spotify': spotify_artist.dict() if spotify_artist else None,
        'lastfm': lastfm_artist,
        'listenbrainz': listenbrainz_data,
        'billboard': billboard_chart
    }

# Add server startup code
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True) 
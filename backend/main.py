from fastapi import FastAPI, HTTPException, Body, Depends, status, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List, Tuple
import os
from dotenv import load_dotenv
import openai
import requests
import httpx
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import json
from pathlib import Path
import random
import asyncio
import math
from datetime import datetime, timedelta
import soundcharts
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import jwt
from jose import JWTError, jwt as jose_jwt
import yfinance as yf  # For market trend data
import requests
import asyncio
from datetime import datetime, timedelta
import statistics
import numpy as np
import lyricsgenius
import googleapiclient.discovery
import googleapiclient.errors
from scipy import stats
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from textblob import TextBlob
import re
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import ssl
from urllib.parse import quote
import time
from functools import lru_cache
from fastapi import UploadFile, File, Form
import librosa
import tempfile
import shutil
from fastapi import Request

# Import ML service
try:
    from ml_service import get_ml_enhanced_analysis
    ML_AVAILABLE = True
    print("✅ ML service imported successfully")
except ImportError:
    ML_AVAILABLE = False
    print("❌ ML service not available - using fallback analysis")

# Import Supabase service separately from Billboard service
try:
    from supabase_config import supabase_manager
    SUPABASE_AVAILABLE = supabase_manager is not None
    if SUPABASE_AVAILABLE:
        print("✅ Supabase service imported successfully")
    else:
        print("⚠️  Supabase not available - using fallback mode")
except ImportError as e:
    SUPABASE_AVAILABLE = False
    print(f"❌ Supabase service not available: {e}")

# Billboard service disabled - not essential for core functionality
BILLBOARD_AVAILABLE = False

load_dotenv()

# --- API Clients Initialization ---
# OpenAI
openai_api_key = os.getenv("OPENAI_API_KEY", "dummy_key")

# Replace OpenAI client initialization with Gemini
gemini_api_key = os.getenv("GEMINI_API_KEY", "dummy_key")
gemini_base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# News API
news_api_key = os.getenv("NEWS_API_KEY", "dummy_key")

# Spotify
spotify_client_id = os.getenv("SPOTIFY_CLIENT_ID", "dummy_key")
spotify_client_secret = os.getenv("SPOTIFY_CLIENT_SECRET", "dummy_key")

print(f"🔍 Debug: Spotify Client ID exists: {bool(spotify_client_id)}")
print(f"🔍 Debug: Spotify Client Secret exists: {bool(spotify_client_secret)}")

if not spotify_client_id or spotify_client_id == "dummy_key":
    print("❌ Warning: Spotify credentials not found. Using mock data.")
    print(f"   Client ID: {'Present' if spotify_client_id else 'Missing'}")
    print(f"   Client Secret: {'Present' if spotify_client_secret else 'Missing'}")
    sp = None
else:
    try:
        print("✅ Initializing Spotify client with credentials...")
        sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
            client_id=spotify_client_id,
            client_secret=spotify_client_secret
        ))
        print("✅ Spotify client initialized successfully!")
    except Exception as e:
        print(f"❌ Error initializing Spotify client: {e}")
        sp = None

# Last.fm
lastfm_api_key = os.getenv("LASTFM_API_KEY", "dummy_key")

# YouTube Data API
youtube_api_key = os.getenv("YOUTUBE_API_KEY", "dummy_key")

# Initialize YouTube client
try:
    if youtube_api_key and youtube_api_key != "dummy_key":
        youtube = googleapiclient.discovery.build("youtube", "v3", developerKey=youtube_api_key)
        print("✅ YouTube client initialized successfully!")
    else:
        youtube = None
        print("❌ Warning: YouTube credentials not found. Using mock data.")
except Exception as e:
    print(f"❌ Error initializing YouTube client: {e}")
    youtube = None

# Shazam API (via RapidAPI)
shazam_api_key = os.getenv("SHAZAM_API_KEY", "dummy_key")
shazam_api_host = "shazam.p.rapidapi.com"

# Genius API  
genius_client_id = os.getenv("GENIUS_CLIENT_ID", "dummy_key")
genius_client_secret = os.getenv("GENIUS_CLIENT_SECRET", "dummy_key")
genius_access_token = os.getenv("GENIUS_ACCESS_TOKEN", "dummy_key")

# Supabase Configuration
supabase_url = os.getenv("SUPABASE_URL", "dummy_url")
supabase_anon_key = os.getenv("SUPABASE_ANON_KEY", "dummy_key")

# Initialize Genius client
try:
    if genius_access_token and genius_access_token != "dummy_key":
        genius = lyricsgenius.Genius(genius_access_token)
        print("✅ Genius client initialized successfully!")
    else:
        genius = None
        print("❌ Warning: Genius credentials not found. Using mock data.")
except Exception as e:
    print(f"❌ Error initializing Genius client: {e}")
    genius = None

# SoundCharts - Using sandbox credentials
try:
    soundcharts_client = soundcharts.SoundchartsClient(
        app_id="soundcharts",
        api_key="soundcharts"
    )
except Exception as e:
    print(f"Failed to initialize SoundCharts client: {e}")
    soundcharts_client = None

# Google OAuth Configuration
GOOGLE_CLIENT_ID = "767080964358-cknd1jasah1f30ahivbm43mc7ch1pu5c.apps.googleusercontent.com"

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-key-change-this-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_TIME = timedelta(days=7)

# Security
security = HTTPBearer(auto_error=False)

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
        "http://localhost:5174",
        "http://127.0.0.1:5174", 
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:8082",
        "http://localhost:8083",
        "http://localhost:8084",
        "http://localhost:8085",
        "http://localhost:8086",
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

# Authentication Models
class GoogleAuthRequest(BaseModel):
    token: str

class UserCreate(BaseModel):
    name: str
    email: str
    avatar: Optional[str] = None
    role: str = "listener"

class User(BaseModel):
    id: str
    name: str
    email: str
    avatar: Optional[str] = None
    role: str
    created_at: str

class AuthResponse(BaseModel):
    user: User
    access_token: str
    token_type: str = "bearer"

# --- Authentication Helper Functions ---
def create_access_token(data: dict):
    """Create a JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + JWT_EXPIRATION_TIME
    to_encode.update({"exp": expire})
    encoded_jwt = jose_jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    """Verify JWT token"""
    try:
        payload = jose_jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

async def verify_google_token(token: str) -> Optional[Dict]:
    """Verify Google OAuth token"""
    try:
        # Specify the CLIENT_ID of the app that accesses the backend
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
            
        return idinfo
    except ValueError as e:
        print(f"Token verification failed: {e}")
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    if not credentials:
        return None
    
    payload = verify_token(credentials.credentials)
    if not payload:
        return None
    
    return payload

# Simple in-memory user storage (replace with database in production)
users_db = {}

def save_user(user_data: dict) -> User:
    """Save user to database (in-memory for demo)"""
    user_id = f"user_{len(users_db) + 1}"
    user = User(
        id=user_id,
        name=user_data['name'],
        email=user_data['email'],
        avatar=user_data.get('avatar'),
        role=user_data.get('role', 'listener'),
        created_at=datetime.utcnow().isoformat()
    )
    users_db[user.email] = user.dict()
    return user

def get_user_by_email(email: str) -> Optional[User]:
    """Get user by email"""
    user_data = users_db.get(email)
    if user_data:
        return User(**user_data)
    return None

# --- Helper Functions ---
async def get_genres_from_multiple_sources(artist_name: str, spotify_genres: list = None) -> list:
    """Get genres from multiple sources with fallbacks"""
    all_genres = set()
    
    # Use Spotify genres if available
    if spotify_genres:
        all_genres.update([g.lower().strip() for g in spotify_genres if isinstance(g, str) and g])
    
    # Try LastFM for additional genres
    try:
        lastfm_data = await get_lastfm_artist(artist_name)
        if lastfm_data and lastfm_data.get('tags'):
            tags = lastfm_data['tags']
            # Handle both list and dict formats from LastFM API
            if isinstance(tags, dict) and 'tag' in tags:
                tags = tags['tag']
            if isinstance(tags, list):
                lastfm_genres = [tag['name'].lower().strip() for tag in tags[:5] if isinstance(tag, dict) and isinstance(tag.get('name'), str)]
                all_genres.update(lastfm_genres)
    except Exception as e:
        print(f"LastFM genre fetch failed for {artist_name}: {e}")
    
    # If still no genres, use Gemini AI as fallback
    if not all_genres:
        try:
            prompt = f"""What are the main music genres for the artist "{artist_name}"? 
            Provide 2-4 specific genres as a JSON array. Examples: ["pop", "r&b"], ["hip-hop", "rap"], ["alternative rock", "indie"].
            Be specific and accurate. Return ONLY the JSON array, no other text."""
            
            response = call_gemini_api(prompt, max_tokens=100)
            if response is not None:
                response = response.strip()
                if response.startswith('```json'):
                    response = response[7:]
                if response.endswith('```'):
                    response = response[:-3]
                response = response.strip()
                
                genres_from_ai = json.loads(response)
                if isinstance(genres_from_ai, list):
                    all_genres.update([g.lower().strip() for g in genres_from_ai if isinstance(g, str) and g])
        except Exception as e:
            print(f"Gemini genre fetch failed for {artist_name}: {e}")
    
    # Absolute fallback based on known artist patterns
    if not all_genres:
        artist_lower = artist_name.lower()
        if any(name in artist_lower for name in ['weeknd', 'weekend']):
            all_genres.update(['r&b', 'pop', 'alternative r&b'])
        elif 'drake' in artist_lower:
            all_genres.update(['hip-hop', 'rap', 'pop rap'])
        elif 'billie' in artist_lower and 'eilish' in artist_lower:
            all_genres.update(['pop', 'alternative pop', 'electropop'])
        elif 'taylor' in artist_lower and 'swift' in artist_lower:
            all_genres.update(['pop', 'country pop', 'folk pop'])
        elif 'olivia' in artist_lower and 'rodrigo' in artist_lower:
            all_genres.update(['pop', 'pop rock', 'teen pop'])
        else:
            # Generic fallback
            all_genres.update(['pop', 'contemporary'])
    
    return list(all_genres)[:6]  # Limit to 6 genres max

async def get_artist_info(artist_name: str) -> Optional[Artist]:
    """Search for an artist on Spotify and return their details with enhanced genre data."""
    if sp is None:
        # Return mock data if Spotify is not available, but with better genre data
        enhanced_genres = await get_genres_from_multiple_sources(artist_name, [])
        return Artist(
            name=artist_name,
            id=f"mock_{artist_name.lower().replace(' ', '_')}",
            genres=enhanced_genres,
            popularity=75,
            followers=1000000,
            image_url=None
        )
    
    try:
        results = sp.search(q=f'artist:{artist_name}', type='artist', limit=1)
        if not results['artists']['items']:
            return None
        
        artist_data = results['artists']['items'][0]
        spotify_genres = artist_data['genres']
        
        # Always try to enhance genres from multiple sources
        enhanced_genres = await get_genres_from_multiple_sources(artist_name, spotify_genres)
        
        print(f"Enhanced genres for {artist_name}: {enhanced_genres}")
        
        return Artist(
            name=artist_data['name'],
            id=artist_data['id'],
            genres=enhanced_genres,
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

# Add enhanced artist tier calculation with real API integration
async def get_enhanced_artist_data_with_gemini(artist_name: str) -> dict:
    """Get comprehensive artist data using real APIs and Gemini for missing data"""
    
    # Get real YouTube data first
    youtube_data = await get_youtube_channel_data(artist_name)
    youtube_subscribers = youtube_data.get('subscriber_count', 0) if not youtube_data.get('fallback_data', True) else 0
    
    # Get real Spotify monthly listeners (estimate from followers)
    # Spotify doesn't provide monthly listeners directly, so we estimate
    # Typically monthly listeners are 10-15% of followers for active artists
    # This will be calculated in the tier calculation function using Spotify followers
    
    # Use Gemini for data that requires research (net worth, Instagram, achievements)
    prompt = f"""
    Get real-time comprehensive data for the artist "{artist_name}". Return ONLY a valid JSON object with this exact structure:

    {{
        "instagram_followers": 0,
        "net_worth_millions": 0,
        "career_achievements": ["achievement1", "achievement2"],
        "major_awards": ["award1", "award2"],
        "monthly_streams_millions": 0,
        "top_song_streams_billions": 0.0
    }}

    Important:
    - Use current 2024 data when available
    - For net worth, provide the number in millions (e.g., if worth $50M, put 50)
    - For Instagram followers, provide exact number (e.g., 50000000 for 50M)
    - For monthly streams, provide realistic current numbers (typically 10-15% of Spotify followers)
    - Include major Grammy wins, Billboard achievements, etc. in awards
    - Keep arrays concise (max 3-4 items each)
    - Return ONLY the JSON, no other text
    """
    
    try:
        response = call_gemini_api(prompt, max_tokens=400)
        # Clean the response to extract just the JSON
        if response is not None:
            response = response.strip()
        if response.startswith('```json'):
            response = response[7:]
        if response.endswith('```'):
            response = response[:-3]
        response = response.strip()
        
        data = json.loads(response)
        
        # Combine real YouTube data with Gemini data
        data['youtube_subscribers'] = youtube_subscribers
        
        return data
    except Exception as e:
        print(f"Error getting enhanced artist data for {artist_name}: {e}")
        # Return default data structure with real YouTube data
        return {
            "instagram_followers": 0,
            "net_worth_millions": 0,
            "youtube_subscribers": youtube_subscribers,  # Use real YouTube data
            "career_achievements": [],
            "major_awards": [],
            "monthly_streams_millions": 0,
            "top_song_streams_billions": 0.0
        }

async def calculate_enhanced_artist_tier(artist_name: str, spotify_followers: int, spotify_popularity: int) -> dict:
    """
    Enhanced artist tier calculation using Gemini AI to get comprehensive data
    including Instagram followers, net worth, and other metrics
    """
    
    try:
        # Get enhanced data from Gemini
        enhanced_data = await get_enhanced_artist_data_with_gemini(artist_name)
        
        # Calculate composite score based on multiple factors
        instagram_followers = enhanced_data.get("instagram_followers", 0)
        net_worth_millions = enhanced_data.get("net_worth_millions", 0)
        youtube_subscribers = enhanced_data.get("youtube_subscribers", 0)
        
        # Calculate realistic monthly streams from Spotify followers
        # Active artists typically have 10-15% of followers as monthly listeners
        # Each listener streams ~150-200 songs per month on average
        monthly_listeners_estimate = spotify_followers * 0.12  # 12% of followers
        monthly_streams_estimate = monthly_listeners_estimate * 175  # 175 streams per listener per month
        monthly_streams_millions = monthly_streams_estimate / 1_000_000  # Convert to millions
        
        # Use Gemini data if available and realistic, otherwise use calculated estimate
        gemini_monthly_streams = enhanced_data.get("monthly_streams_millions", 0)
        if gemini_monthly_streams > 0 and gemini_monthly_streams <= monthly_streams_millions * 2:  # Allow 2x variance
            monthly_streams_millions = gemini_monthly_streams
        
        major_awards = len(enhanced_data.get("major_awards", []))
        
        # Weight different factors for tier calculation
        spotify_score = min(spotify_followers / 1_000_000, 100)  # Max 100 points
        instagram_score = min(instagram_followers / 1_000_000, 80)  # Max 80 points  
        net_worth_score = min(net_worth_millions, 60)  # Max 60 points
        youtube_score = min(youtube_subscribers / 1_000_000, 40)  # Max 40 points
        streams_score = min(monthly_streams_millions, 30)  # Max 30 points
        awards_score = min(major_awards * 5, 20)  # Max 20 points
        popularity_score = min(spotify_popularity, 30)  # Max 30 points
        
        # Calculate total composite score (max 360)
        composite_score = (spotify_score + instagram_score + net_worth_score + 
                          youtube_score + streams_score + awards_score + popularity_score)
        
        # Determine tier based on composite score and key metrics
        if composite_score >= 250 or spotify_followers >= 80_000_000 or net_worth_millions >= 300:
            tier = "Global Icon"
            color = "#9D4EDD"  # Purple
            description = "Legendary artist with global cultural impact"
        elif composite_score >= 200 or spotify_followers >= 50_000_000 or net_worth_millions >= 200:
            tier = "Superstar"
            color = "#FFD700"  # Gold
            description = "Global icon with massive fanbase"
        elif composite_score >= 150 or spotify_followers >= 20_000_000 or net_worth_millions >= 100:
            tier = "Megastar"
            color = "#FF6B6B"  # Red
            description = "Major artist with worldwide recognition"
        elif composite_score >= 100 or spotify_followers >= 5_000_000 or net_worth_millions >= 50:
            tier = "Established"
            color = "#4ECDC4"  # Teal
            description = "Well-known artist with strong following"
        elif composite_score >= 60 or spotify_followers >= 1_000_000 or net_worth_millions >= 10:
            tier = "Rising Star"
            color = "#45B7D1"  # Blue
            description = "Growing artist gaining momentum"
        elif composite_score >= 30 or spotify_followers >= 100_000:
            tier = "Developing" 
            color = "#96CEB4"  # Green
            description = "Emerging talent building audience"
        else:
            tier = "Emerging"
            color = "#FFEAA7"  # Yellow
            description = "New artist starting their journey"
        
        # Special adjustments for high popularity with lower followers (viral artists)
        if spotify_popularity >= 90 and tier in ["Developing", "Emerging"]:
            tier = "Viral Sensation"
            color = "#FF7F50"  # Coral
            description = "Rapidly rising with viral content"
        
        return {
            "tier": tier,
            "color": color,
            "description": description,
            "composite_score": round(composite_score, 1),
            "enhanced_data": enhanced_data,
            "breakdown": {
                "spotify_followers": spotify_followers,
                "spotify_popularity": spotify_popularity,
                "instagram_followers": instagram_followers,
                "net_worth_millions": net_worth_millions,
                "youtube_subscribers": youtube_subscribers,
                "monthly_streams_millions": monthly_streams_millions,
                "major_awards_count": major_awards
            }
        }
        
    except Exception as e:
        print(f"Error in enhanced tier calculation for {artist_name}: {e}")
        # Fallback to basic calculation
        return calculate_artist_tier(spotify_followers, spotify_popularity)

def calculate_artist_tier(followers: int, popularity: int) -> dict:
    """
    Calculate artist tier based on followers and popularity
    Returns tier info with level, color, and description
    """
    
    # Define tier thresholds
    if followers >= 50_000_000:  # 50M+ followers
        tier = "Superstar"
        color = "#FFD700"  # Gold
        description = "Global icon with massive fanbase"
    elif followers >= 20_000_000:  # 20M+ followers  
        tier = "Megastar"
        color = "#FF6B6B"  # Red
        description = "Major artist with worldwide recognition"
    elif followers >= 5_000_000:   # 5M+ followers
        tier = "Established"
        color = "#4ECDC4"  # Teal
        description = "Well-known artist with strong following"
    elif followers >= 1_000_000:   # 1M+ followers
        tier = "Rising"
        color = "#45B7D1"  # Blue
        description = "Growing artist gaining momentum"
    elif followers >= 100_000:     # 100K+ followers
        tier = "Developing" 
        color = "#96CEB4"  # Green
        description = "Emerging talent building audience"
    else:                           # Under 100K
        tier = "Emerging"
        color = "#FFEAA7"  # Yellow
        description = "New artist starting their journey"
    
    # Adjust based on popularity score
    if popularity >= 85:
        if tier in ["Rising", "Developing"]:
            tier = "Breakout Star"
            color = "#A29BFE"  # Purple
            description = "Rapidly rising with high engagement"
    
    return {
        "tier": tier,
        "color": color, 
        "description": description,
        "followers": followers,
        "popularity": popularity
    }

async def map_spotify_artist_to_frontend(artist):
    """Map Spotify artist data to frontend format with enhanced tier information"""
    if not artist:
        return None
    
    # Calculate enhanced artist tier using AI
    tier_info = await calculate_enhanced_artist_tier(artist.name, artist.followers, artist.popularity)
    
    return {
        "id": artist.id,
        "name": artist.name,
        "avatar": artist.image_url or "",
        "bio": "",  # Could be enhanced with artist bio
        "genres": artist.genres,
        "followers": artist.followers,
        "verified": False,  # Could be enhanced with verification status
        "successRate": artist.popularity,
        "tier": tier_info  # Add enhanced tier information
    }

# Helper to get Last.fm artist info with timeout
async def get_lastfm_artist(artist_name: str):
    if not lastfm_api_key:
        # Instead of random data, return None so we can use Spotify data
        print("Last.fm API key not available, will use Spotify data instead")
        return None
    
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

# SoundCharts helper functions
async def get_soundcharts_artist_data(artist_name: str, allow_fallback: bool = True) -> Optional[Dict]:
    """Search for an artist on SoundCharts and return comprehensive data"""
    
    # SoundCharts sandbox allowed values
    SANDBOX_ALLOWED_ARTISTS = [
        "billie eilish", "billie eillish", "billi eilish",
        "let's dance david bowie", "let's dance david", 
        "let's bance david bowie", "let's danse david bowie",
        "rap caviar", "bbc"
    ]
    
    try:
        search_term = artist_name.lower()
        is_sandbox_available = search_term in SANDBOX_ALLOWED_ARTISTS
        
        # If artist is available in sandbox, use real SoundCharts data
        if is_sandbox_available:
            print(f"Using real SoundCharts data for '{artist_name}'")
            search_results = soundcharts_client.search.search_artist_by_name(search_term, limit=1)
            
            if search_results and search_results.get('items'):
                artist_data = search_results['items'][0]
                artist_id = artist_data['uuid']
                
                # Get comprehensive artist data
                metadata = soundcharts_client.artist.get_artist_metadata(artist_id)
                current_stats = soundcharts_client.artist.get_current_stats(artist_id)
                audience_data = soundcharts_client.artist.get_audience(artist_id)
                popularity_data = soundcharts_client.artist.get_popularity(artist_id)
                
                return {
                    'metadata': metadata,
                    'stats': current_stats,
                    'audience': audience_data,
                    'popularity': popularity_data,
                    'artist_id': artist_id,
                    'search_term_used': search_term,
                    'original_query': artist_name,
                    'is_sandbox_demo': False,
                    'data_source': 'soundcharts_real'
                }
        
        # If not available in sandbox and fallback is disabled, return None
        if not allow_fallback:
            print(f"Artist '{artist_name}' not available in SoundCharts sandbox")
            return None
            
        # Return None to indicate SoundCharts data not available
        # This allows the system to use alternative analysis methods
        print(f"SoundCharts data not available for '{artist_name}' - will use enhanced Spotify/AI analysis")
        return None
        
    except Exception as e:
        print(f"Error fetching SoundCharts data for {artist_name}: {e}")
        return None

# === AGENTIC MANAGER ENDPOINTS ===

@app.post("/api/agent/upload-track")
async def upload_track(
    file: UploadFile = File(...), 
    artist_id: str = Form(...)
):
    """Upload and analyze MP3 track for agentic manager"""
    if not SUPABASE_AVAILABLE:
        raise HTTPException(status_code=500, detail="Supabase not available.")
    
    # Validate file type
    if not file.filename.endswith(('.mp3', '.wav', '.m4a')):
        raise HTTPException(status_code=400, detail="Invalid file type. Only MP3, WAV, and M4A files are supported.")
    
    # Validate file size (max 20MB)
    file_content = await file.read()
    if len(file_content) > 20 * 1024 * 1024:  # 20MB
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 20MB.")
    
    try:
        # Save file temporarily for analysis
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name
        
        try:
            # Load audio file with librosa
            y, sr = librosa.load(temp_file_path)
            
            # Extract audio features
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            chroma = librosa.feature.chroma_stft(y=y, sr=sr)
            key = np.argmax(np.sum(chroma, axis=1))
            key_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
            detected_key = key_names[key]
            
            # Calculate other features
            rms = librosa.feature.rms(y=y)
            energy = np.mean(rms)
            loudness = librosa.amplitude_to_db(rms)
            avg_loudness = np.mean(loudness)
            
            # Determine mode (major/minor) based on chroma
            major_profile = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]
            minor_profile = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]
            
            avg_chroma = np.mean(chroma, axis=1)
            major_score = np.dot(avg_chroma, major_profile)
            minor_score = np.dot(avg_chroma, minor_profile)
            mode = "major" if major_score > minor_score else "minor"
            
            # Duration in seconds
            duration = len(y) / sr
            
            # Store track data in database
            track_data = {
                "artist_id": artist_id,
                "file_url": f"temp/{file.filename}",  # In production, store in cloud storage
                "bpm": float(tempo),
                "key": f"{detected_key} {mode}",
                "energy": float(energy),
                "loudness": float(avg_loudness),
                "mode": mode,
                "duration": float(duration),
                "analysis_json": {
                    "tempo": float(tempo),
                    "key": detected_key,
                    "mode": mode,
                    "energy": float(energy),
                    "loudness": float(avg_loudness),
                    "duration": float(duration)
                }
            }
            
            result = supabase_manager.client.table("uploaded_tracks").insert(track_data).execute()
            
            if result.get("status_code") not in [200, 201]:
                raise HTTPException(status_code=500, detail="Failed to save track analysis.")
            
            return {
                "status": "success",
                "analysis": track_data,
                "message": "Track uploaded and analyzed successfully"
            }
            
        finally:
            # Clean up temporary file
            os.unlink(temp_file_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing track: {str(e)}")

@app.get("/api/agent/venue-recommendations")
async def get_venue_recommendations(artist_id: str = Query(...), city: str = Query(None)):
    """Get venue recommendations using Google Maps API"""
    if not SUPABASE_AVAILABLE:
        raise HTTPException(status_code=500, detail="Supabase not available.")
    
    # Try to get top city from artist_snapshots (if city is not provided)
    search_city = city
    if not search_city:
        snapshots = supabase_manager.client.table("artist_snapshots").select("*").eq("artist_id", artist_id).order("snapshot_date", desc=True).limit(1).execute()
        if snapshots and snapshots.get("data") and len(snapshots["data"]) > 0:
            snapshot = snapshots["data"][0]
            search_city = snapshot.get("city")
    
    if not search_city:
        raise HTTPException(status_code=400, detail="No city provided and no city found in artist_snapshots.")
    
    # Google Maps Places API call
    api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Google Maps API key not configured.")
    
    search_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": f"music venue in {search_city}",
        "key": api_key
    }
    
    response = requests.get(search_url, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Google Maps API error.")
    
    results = response.json().get("results", [])
    venues = []
    
    for venue in results:
        venue_name = venue.get("name")
        address = venue.get("formatted_address")
        place_id = venue.get("place_id")
        relevance_score = venue.get("rating", 0)
        
        # Check if already exists
        exists = supabase_manager.client.table("venue_recommendations").select("id").eq("artist_id", artist_id).eq("city", search_city).eq("venue_name", venue_name).execute()
        if exists and exists.get("data"):
            continue
        
        data = {
            "artist_id": artist_id,
            "city": search_city,
            "venue_name": venue_name,
            "address": address,
            "relevance_score": relevance_score,
            "google_place_id": place_id,
        }
        
        supabase_manager.client.table("venue_recommendations").insert(data).execute()
        venues.append(data)
    
    return {"status": "success", "venues": venues}

class EmailDraftRequest(BaseModel):
    artist_id: str
    draft_type: str
    context: Optional[dict] = None

@app.post("/api/agent/email-drafts")
async def generate_email_drafts(request: EmailDraftRequest):
    """Generate AI-powered email drafts for outreach"""
    if not SUPABASE_AVAILABLE:
        raise HTTPException(status_code=500, detail="Supabase not available.")
    
    # Compose prompt for Gemini/OpenAI
    context_str = ""
    if request.context:
        context_str = ", ".join([f"{k}: {v}" for k, v in request.context.items()])
    
    prompt = f"Write 3 professional outreach email drafts for an artist to send to a {request.draft_type}. Context: {context_str}. Each draft should be concise, friendly, and persuasive."
    
    drafts = []
    
    # Use Gemini if available
    if gemini_api_key and gemini_api_key != "dummy_key":
        headers = {"Content-Type": "application/json"}
        data = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 800}
        }
        
        response = requests.post(
            gemini_base_url + f"?key={gemini_api_key}",
            headers=headers,
            json=data
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Gemini API error.")
        
        text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        drafts = [d.strip() for d in text.split("\n\n") if d.strip()]
        
    elif openai_api_key and openai_api_key != "dummy_key":
        import openai as openai_sdk
        openai_sdk.api_key = openai_api_key
        completion = openai_sdk.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
            temperature=0.7
        )
        text = completion.choices[0].message.content
        drafts = [d.strip() for d in text.split("\n\n") if d.strip()]
    else:
        raise HTTPException(status_code=500, detail="No AI API key available.")
    
    # Store drafts in agentic_email_drafts
    stored_drafts = []
    for draft in drafts:
        data = {
            "artist_id": request.artist_id,
            "draft_type": request.draft_type,
            "subject": f"Outreach to {request.draft_type.title()}",
            "body": draft,
            "sent": False
        }
        
        supabase_manager.client.table("agentic_email_drafts").insert(data).execute()
        stored_drafts.append(data)
    
    return {"status": "success", "drafts": stored_drafts}

@app.get("/api/agent/campaign-recommendations")
async def get_campaign_recommendations(artist_id: str = Query(...)):
    """Get AI-powered campaign strategy recommendations"""
    if not SUPABASE_AVAILABLE:
        raise HTTPException(status_code=500, detail="Supabase not available.")
    
    # Fetch artist profile
    artist_profile = supabase_manager.client.table("artist_profiles").select("*").eq("id", artist_id).single().execute()
    if not artist_profile or not artist_profile.get("data"):
        raise HTTPException(status_code=404, detail="Artist profile not found.")
    
    artist = artist_profile["data"]
    
    # Fetch recent projects
    projects = supabase_manager.client.table("projects").select("*").eq("artist_id", artist_id).order("created_at", desc=True).limit(3).execute()
    project_list = projects.get("data", []) if projects else []
    
    # AI/ML logic for recommendations
    funding_goal = 25000 if not project_list else int(sum([p.get("funding_goal", 0) for p in project_list]) / len(project_list) * 1.1)
    investment_split = "70% artist / 30% investors"
    release_format = "EP" if artist.get("monthly_listeners", 0) > 100000 else "Single"
    timing = "Next 2 months" if artist.get("monthly_growth_rate", 0) > 0.05 else "Next 6 months"
    
    recommendation = {
        "funding_goal": funding_goal,
        "investment_split": investment_split,
        "release_format": release_format,
        "timing": timing,
        "artist_id": artist_id
    }
    
    return {"status": "success", "recommendation": recommendation}

@app.post("/api/agent/onboarding")
async def save_onboarding_data(data: dict):
    """Save onboarding data for agentic manager"""
    if not SUPABASE_AVAILABLE:
        raise HTTPException(status_code=500, detail="Supabase not available.")
    
    try:
        # Save to agentic_manager_profiles
        result = supabase_manager.client.table("agentic_manager_profiles").insert(data).execute()
        
        if result.get("status_code") not in [200, 201]:
            raise HTTPException(status_code=500, detail="Failed to save onboarding data.")
        
        return {"status": "success", "data": result.get("data")}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving onboarding data: {str(e)}")

@app.get("/api/agent/profile/{artist_id}")
async def get_agentic_profile(artist_id: str):
    """Get agentic manager profile for an artist"""
    if not SUPABASE_AVAILABLE:
        raise HTTPException(status_code=500, detail="Supabase not available.")
    
    try:
        # Get existing profile
        result = supabase_manager.client.table("agentic_manager_profiles").select("*").eq("artist_id", artist_id).single().execute()
        profile_data = result.get("data")
        
        if not profile_data:
            return {"status": "success", "data": None, "has_profile": False}
        
        return {"status": "success", "data": profile_data, "has_profile": True}
        
    except Exception as e:
        return {"status": "success", "data": None, "has_profile": False}

@app.put("/api/agent/profile/{artist_id}")
async def update_agentic_profile(artist_id: str, data: dict):
    """Update agentic manager profile for an artist"""
    if not SUPABASE_AVAILABLE:
        raise HTTPException(status_code=500, detail="Supabase not available.")
    
    try:
        # Update existing profile
        data["updated_at"] = "now()"
        result = supabase_manager.client.table("agentic_manager_profiles").update(data).eq("artist_id", artist_id).execute()
        
        if result.get("status_code") not in [200, 201]:
            raise HTTPException(status_code=500, detail="Failed to update profile.")
        
        return {"status": "success", "data": result.get("data")}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating profile: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint to verify all services are working"""
    return {
        "status": "healthy",
        "message": "Backend server is running successfully",
        "services": {
            "supabase": SUPABASE_AVAILABLE,
            "ml_service": ML_AVAILABLE,
            "billboard": BILLBOARD_AVAILABLE
        },
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

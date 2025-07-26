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
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import jwt
from jose import JWTError, jwt as jose_jwt
import yfinance as yf
import statistics
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

def convert_numpy_types(obj):
    """Convert numpy types to JSON-serializable Python types"""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    else:
        return obj

# Import ML service
try:
    from ml_service import get_ml_enhanced_analysis
    ML_AVAILABLE = True
    print("✅ ML service imported successfully")
except ImportError:
    ML_AVAILABLE = False
    print("❌ ML service not available - using fallback analysis")

# Import Enhanced Audio Analysis
try:
    from enhanced_audio_analysis import enhanced_analyzer
    ENHANCED_AUDIO_AVAILABLE = True
    print("✅ Enhanced audio analysis imported successfully")
except ImportError:
    ENHANCED_AUDIO_AVAILABLE = False
    print("❌ Enhanced audio analysis not available - using basic analysis")

# Supabase Configuration
try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
    print("✅ Supabase imported successfully")
except ImportError:
    SUPABASE_AVAILABLE = False
    print("❌ Supabase not available")

# Load environment variables
load_dotenv()

# Supabase Configuration
supabase_url = os.getenv("SUPABASE_URL", "dummy_url")
supabase_key = os.getenv("SUPABASE_ANON_KEY", "dummy_key")

# Initialize Supabase client
if SUPABASE_AVAILABLE and supabase_url != "dummy_url" and supabase_key != "dummy_key":
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        print("✅ Supabase client initialized successfully!")
    except Exception as e:
        print(f"❌ Error initializing Supabase client: {e}")
        supabase = None
else:
    print("⚠️ Supabase not configured - using fallback mode")
    supabase = None

# API Keys Configuration
openai_api_key = os.getenv("OPENAI_API_KEY", "dummy_key")
gemini_api_key = os.getenv("GEMINI_API_KEY", "dummy_key")
gemini_base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# News API
news_api_key = os.getenv("NEWS_API_KEY", "dummy_key")

# Spotify Configuration
spotify_client_id = os.getenv("SPOTIFY_CLIENT_ID", "dummy_key")
spotify_client_secret = os.getenv("SPOTIFY_CLIENT_SECRET", "dummy_key")

# Initialize Spotify client
if not spotify_client_id or spotify_client_id == "dummy_key":
    print("❌ Warning: Spotify credentials not found. Using mock data.")
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

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-super-secret-key-change-this-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_TIME = timedelta(days=7)

# Google OAuth Configuration
GOOGLE_CLIENT_ID = "767080964358-cknd1jasah1f30ahivbm43mc7ch1pu5c.apps.googleusercontent.com"

# Initialize Gemini
if gemini_api_key and gemini_api_key != "dummy_key":
    try:
        genai.configure(api_key=gemini_api_key)
        print("✅ Gemini configured successfully")
    except Exception as e:
        print(f"❌ Error configuring Gemini: {e}")
else:
    print("⚠️ Gemini API key not found")

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
    ],
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
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
        
        return idinfo
    except Exception as e:
        print(f"Error verifying Google token: {e}")
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    payload = verify_token(credentials.credentials)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return payload

# --- Basic Health Check Endpoint ---
@app.get("/health")
async def health_check():
    """Health check endpoint to verify all services are working"""
    return {
        "status": "healthy",
        "message": "Backend server is running successfully",
        "services": {
            "core": True,
            "api": True
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "MusiStash API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

# --- Spotify Artist Endpoint (Simplified) ---
@app.get("/spotify-artist/{artist_id}")
async def get_spotify_artist(artist_id: str):
    """Get Spotify artist data by artist ID"""
    try:
        if sp is None:
            # Return mock data if Spotify is not available
            return {
                "id": artist_id,
                "name": "Mock Artist",
                "followers": {"total": 1000000},
                "popularity": 75,
                "genres": ["pop", "r&b"],
                "topTracks": [
                    {
                        "id": "mock_track_1",
                        "name": "Top Hit",
                        "external_urls": {"spotify": "https://open.spotify.com/track/mock1"}
                    }
                ]
            }
        
        # Get artist data from Spotify
        artist = sp.artist(artist_id)
        if not artist:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        # Get top tracks
        top_tracks = sp.artist_top_tracks(artist_id, country='US')
        tracks = []
        if top_tracks and top_tracks['tracks']:
            tracks = top_tracks['tracks'][:5]  # Get top 5 tracks
        
        return {
            "id": artist['id'],
            "name": artist['name'],
            "followers": artist['followers'],
            "popularity": artist['popularity'],
            "genres": artist['genres'],
            "topTracks": tracks
        }
        
    except Exception as e:
        print(f"Error fetching Spotify artist data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch Spotify data: {str(e)}")

@app.get("/api/artist/search")
async def search_artists(query: str = Query(...)):
    """Search for artists on Spotify"""
    try:
        if sp is None:
            # Return mock data if Spotify is not available
            return {
                "artists": [
                    {
                        "id": "mock_artist_1",
                        "name": "Mock Artist",
                        "followers": {"total": 1000000},
                        "popularity": 75,
                        "genres": ["pop", "r&b"],
                        "images": [{"url": "https://via.placeholder.com/300"}]
                    }
                ]
            }
        
        # Search for artists on Spotify
        results = sp.search(q=query, type='artist', limit=10)
        artists = results['artists']['items']
        
        return {
            "artists": artists
        }
        
    except Exception as e:
        print(f"Error searching artists: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to search artists: {str(e)}")

@app.get("/api/artist/{artist_id}")
async def get_artist_details(artist_id: str):
    """Get detailed artist information"""
    try:
        if sp is None:
            # Return mock data if Spotify is not available
            return {
                "id": artist_id,
                "name": "Mock Artist",
                "followers": {"total": 1000000},
                "popularity": 75,
                "genres": ["pop", "r&b"],
                "images": [{"url": "https://via.placeholder.com/300"}],
                "external_urls": {"spotify": "https://open.spotify.com/artist/mock"}
            }
        
        # Get artist details from Spotify
        artist = sp.artist(artist_id)
        if not artist:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        return artist
        
    except Exception as e:
        print(f"Error fetching artist details: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch artist details: {str(e)}")

@app.get("/api/artists")
async def get_artists():
    """Get all artists from database"""
    try:
        if supabase is None:
            return {"artists": []}
        
        response = supabase.table('artist_profiles').select('*').execute()
        return {"artists": response.data}
        
    except Exception as e:
        print(f"Error fetching artists: {e}")
        return {"artists": []}

@app.get("/api/artist-profile/{artist_id}")
async def get_artist_profile(artist_id: str):
    """Get artist profile from database"""
    try:
        if supabase is None:
            return {"error": "Database not available"}
        
        response = supabase.table('artist_profiles').select('*').eq('id', artist_id).execute()
        if response.data:
            return response.data[0]
        else:
            raise HTTPException(status_code=404, detail="Artist profile not found")
        
    except Exception as e:
        print(f"Error fetching artist profile: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch artist profile: {str(e)}")

@app.post("/api/upload-track")
async def upload_track_analysis(
    file: UploadFile = File(...), 
    artist_id: str = Form(...)
):
    """Upload and analyze a track"""
    try:
        if not ENHANCED_AUDIO_AVAILABLE:
            raise HTTPException(status_code=503, detail="Audio analysis not available")
        
        # Save uploaded file temporarily
        temp_file_path = f"/tmp/{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Analyze the audio
        features = await enhanced_analyzer.analyze_audio_comprehensive(temp_file_path, file.filename, artist_id)
        
        # Clean up temp file
        os.remove(temp_file_path)
        
        return convert_numpy_types(features)
        
    except Exception as e:
        print(f"Error in track analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Track analysis failed: {str(e)}")

@app.post("/api/agent/upload-track")
async def upload_track(
    file: UploadFile = File(...), 
    artist_id: str = Form(...)
):
    """Upload track for agentic analysis"""
    try:
        if not ENHANCED_AUDIO_AVAILABLE:
            raise HTTPException(status_code=503, detail="Audio analysis not available")
        
        # Save uploaded file temporarily
        temp_file_path = f"/tmp/{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Analyze the audio
        features = await enhanced_analyzer.analyze_audio_comprehensive(temp_file_path, file.filename, artist_id)
        
        # Clean up temp file
        os.remove(temp_file_path)
        
        return convert_numpy_types(features)
        
    except Exception as e:
        print(f"Error in agentic track analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Agentic track analysis failed: {str(e)}")

@app.get("/api/agent/venue-recommendations")
async def get_venue_recommendations(artist_id: str = Query(...), city: str = Query(None)):
    """Get venue recommendations for an artist"""
    try:
        # Mock venue recommendations for now
        venues = [
            {
                "name": "The Grand Hall",
                "location": city or "New York",
                "capacity": 500,
                "genre_suitability": 8,
                "booking_approach": "Contact via email",
                "description": "Popular music venue"
            }
        ]
        return {"venues": venues}
    except Exception as e:
        print(f"Error getting venue recommendations: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get venue recommendations: {str(e)}")

@app.post("/api/agent/email-drafts")
async def generate_email_drafts(request: dict):
    """Generate email drafts for venues"""
    try:
        # Mock email drafts for now
        drafts = [
            {
                "subject": "Booking Inquiry - [Artist Name]",
                "body": "Hi [Venue Name],\n\nI'm reaching out about booking opportunities for [Artist Name]...",
                "type": "booking"
            }
        ]
        return {"drafts": drafts}
    except Exception as e:
        print(f"Error generating email drafts: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate email drafts: {str(e)}")

@app.get("/api/agent/campaign-recommendations")
async def get_campaign_recommendations(artist_id: str = Query(...)):
    """Get marketing campaign recommendations"""
    try:
        # Mock campaign recommendations
        campaigns = [
            {
                "type": "Social Media",
                "description": "Focus on Instagram and TikTok",
                "budget": "$500-1000",
                "timeline": "3 months"
            }
        ]
        return {"campaigns": campaigns}
    except Exception as e:
        print(f"Error getting campaign recommendations: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get campaign recommendations: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

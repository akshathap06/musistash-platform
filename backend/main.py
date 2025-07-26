from fastapi import FastAPI, HTTPException, Body, Depends, status, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List, Tuple
import os
from dotenv import load_dotenv
import json
from pathlib import Path
import random
import asyncio
import math
from datetime import datetime, timedelta
import time
from functools import lru_cache
from fastapi import UploadFile, File, Form
import tempfile
import shutil
from fastapi import Request
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

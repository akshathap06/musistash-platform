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

# Load environment variables
load_dotenv()

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
            "api": True,
            "spotify": False,
            "supabase": False,
            "ml": False,
            "audio_analysis": False,
            "gemini": False,
            "jwt": False,
            "numpy": False,
            "sklearn": False,
            "librosa": False
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

@app.get("/spotify-artist/{artist_id}")
async def get_spotify_artist(artist_id: str):
    """Get Spotify artist data by artist ID"""
    try:
        # Return mock data for now
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
        
    except Exception as e:
        print(f"Error fetching Spotify artist data: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch Spotify data: {str(e)}")

@app.get("/api/artist/search")
async def search_artists(query: str = Query(...)):
    """Search for artists on Spotify"""
    try:
        # Return mock data for now
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
        
    except Exception as e:
        print(f"Error searching artists: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to search artists: {str(e)}")

@app.get("/api/artist/{artist_id}")
async def get_artist_details(artist_id: str):
    """Get detailed artist information"""
    try:
        # Return mock data for now
        return {
            "id": artist_id,
            "name": "Mock Artist",
            "followers": {"total": 1000000},
            "popularity": 75,
            "genres": ["pop", "r&b"],
            "images": [{"url": "https://via.placeholder.com/300"}],
            "external_urls": {"spotify": "https://open.spotify.com/artist/mock"}
        }
        
    except Exception as e:
        print(f"Error fetching artist details: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch artist details: {str(e)}")

@app.get("/api/artists")
async def get_artists():
    """Get all artists from database"""
    try:
        return {"artists": []}
        
    except Exception as e:
        print(f"Error fetching artists: {e}")
        return {"artists": []}

@app.get("/api/artist-profile/{artist_id}")
async def get_artist_profile(artist_id: str):
    """Get artist profile from database"""
    try:
        return {"error": "Database not available"}
        
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
        return {
            "message": "Audio analysis not available in minimal mode",
            "filename": file.filename,
            "artist_id": artist_id
        }
        
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
        return {
            "message": "Agentic analysis not available in minimal mode",
            "filename": file.filename,
            "artist_id": artist_id
        }
        
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

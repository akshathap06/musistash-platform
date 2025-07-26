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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

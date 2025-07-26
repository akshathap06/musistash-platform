#!/usr/bin/env python3
"""
Startup script for Railway deployment
"""

import os
import sys
import uvicorn

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Set environment variables for simplified analysis
os.environ.setdefault('AUDIO_ANALYSIS_MODE', 'simplified')
os.environ.setdefault('ENABLE_FULL_AUDIO_ANALYSIS', 'false')

if __name__ == "__main__":
    # Get port from environment (Railway sets this)
    port = int(os.environ.get("PORT", 8000))
    
    print(f"🚀 Starting MusiStash on port {port}")
    print(f"🎵 Audio Analysis Mode: {os.environ.get('AUDIO_ANALYSIS_MODE', 'simplified')}")
    
    # Import the app
    from main import app
    
    # Start the server
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    ) 
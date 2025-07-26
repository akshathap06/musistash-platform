#!/usr/bin/env python3
"""
Test script to check if the FastAPI app can start properly
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Set environment variables for testing
os.environ.setdefault('AUDIO_ANALYSIS_MODE', 'simplified')
os.environ.setdefault('ENABLE_FULL_AUDIO_ANALYSIS', 'false')

try:
    print("🔧 Testing FastAPI app import...")
    from main import app
    print("✅ FastAPI app imported successfully!")
    
    print("🔧 Testing health endpoint...")
    from fastapi.testclient import TestClient
    
    client = TestClient(app)
    response = client.get("/health")
    
    if response.status_code == 200:
        print("✅ Health endpoint working!")
        print(f"Response: {response.json()}")
    else:
        print(f"❌ Health endpoint failed: {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"❌ Error testing app: {e}")
    import traceback
    traceback.print_exc() 
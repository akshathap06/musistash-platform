#!/usr/bin/env python3
"""Simple test script to verify deployment works"""

import sys
import os
print(f"Python version: {sys.version}")
print(f"Python executable: {sys.executable}")
print(f"Current working directory: {os.getcwd()}")

# Test imports
try:
    import fastapi
    print(f"✅ FastAPI version: {fastapi.__version__}")
except ImportError as e:
    print(f"❌ FastAPI import failed: {e}")

try:
    import uvicorn
    print(f"✅ Uvicorn imported successfully")
except ImportError as e:
    print(f"❌ Uvicorn import failed: {e}")

try:
    from backend.main import app
    print(f"✅ Main app imported successfully")
except ImportError as e:
    print(f"❌ Main app import failed: {e}")

print("Test complete!") 
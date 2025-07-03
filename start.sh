#!/bin/bash
echo "Starting MusiStash API..."
echo "Current directory: $(pwd)"
echo "Python version: $(python3 --version)"
echo "Files in current directory:"
ls -la

echo "Files in backend directory:"
ls -la backend/

echo "Starting uvicorn server..."
cd backend && python3 -m uvicorn main:app --host 0.0.0.0 --port $PORT 
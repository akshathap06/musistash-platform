#!/bin/bash
echo "Starting MusiStash API..."
echo "Current directory: $(pwd)"
echo "Python version: $(python --version)"
echo "Files in current directory:"
ls -la

echo "Files in backend directory:"
ls -la backend/

echo "Starting uvicorn server..."
cd backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT 
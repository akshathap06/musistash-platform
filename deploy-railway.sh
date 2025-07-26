#!/bin/bash

echo "🚀 Deploying to Railway with simplified audio analysis..."

# Set environment variables for simplified analysis
export AUDIO_ANALYSIS_MODE=simplified
export ENABLE_FULL_AUDIO_ANALYSIS=false

echo "📋 Environment variables set:"
echo "  AUDIO_ANALYSIS_MODE=$AUDIO_ANALYSIS_MODE"
echo "  ENABLE_FULL_AUDIO_ANALYSIS=$ENABLE_FULL_AUDIO_ANALYSIS"

# Check if we're in the right directory
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Error: requirements.txt not found. Make sure you're in the musistash-platform directory."
    exit 1
fi

# Commit any changes
echo "📝 Committing changes..."
git add .
git commit -m "🚀 Railway deployment with simplified audio analysis"

# Push to Railway
echo "🚀 Pushing to Railway..."
git push railway main

echo "✅ Railway deployment initiated!"
echo "🔗 Check your Railway dashboard for deployment status." 
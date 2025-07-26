#!/bin/bash

echo "🚀 Deploying to Railway with buildpack (simplified audio analysis)..."

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

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "⚠️  Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway if not already logged in
echo "🔐 Checking Railway login status..."
railway whoami || railway login

# Set environment variables in Railway
echo "🔧 Setting Railway environment variables..."
railway variables set AUDIO_ANALYSIS_MODE=simplified
railway variables set ENABLE_FULL_AUDIO_ANALYSIS=false
railway variables set PYTHONPATH=/app

# Commit any changes
echo "📝 Committing changes..."
git add .
git commit -m "🚀 Railway buildpack deployment with simplified audio analysis"

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Railway deployment initiated!"
echo "🔗 Check your Railway dashboard for deployment status."
echo "📊 Health check: https://your-app.railway.app/health" 
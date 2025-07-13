#!/bin/bash

echo "🚀 Deploying MusiStash to Production..."
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the musistash-platform directory"
    exit 1
fi

# Install Railway CLI if not installed
echo "📦 Checking Railway CLI..."
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔐 Logging into Railway..."
railway login

# Deploy backend
echo "🚀 Deploying backend to Railway..."
echo "This will create a new Railway project for your backend"
echo "Make sure to add these environment variables in Railway dashboard:"
echo "  - OPENAI_API_KEY"
echo "  - GEMINI_API_KEY" 
echo "  - SPOTIFY_CLIENT_ID"
echo "  - SPOTIFY_CLIENT_SECRET"
echo "  - LASTFM_API_KEY"
echo "  - NEWS_API_KEY"
echo "  - JWT_SECRET_KEY"
echo ""
read -p "Press Enter when you're ready to deploy backend..."

# Deploy backend
cd backend
railway deploy
cd ..

echo "✅ Backend deployed!"
echo ""
echo "🌐 Now deploying frontend to Vercel..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy frontend
echo "🚀 Deploying frontend to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment Complete!"
echo "========================"
echo "✅ Backend: Railway ($5/month)"
echo "✅ Frontend: Vercel (Free)"
echo "✅ Domain: Ready for musistash.com"
echo ""
echo "Next steps:"
echo "1. Update your Railway backend URL in Vercel environment variables"
echo "2. Add your custom domain (musistash.com) in Vercel dashboard"
echo "3. Add all API keys as environment variables in Railway dashboard"
echo ""
echo "🚀 Your app should be live shortly!" 
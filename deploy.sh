#!/bin/bash

echo "🚀 MusiStash Deployment Helper"
echo "==============================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🔧 Deployment Options:"
echo "1. Deploy Backend to Vercel"
echo "2. Deploy Frontend to Vercel"
echo "3. Deploy Both (Full Deployment)"
echo ""

read -p "Select option (1-3): " choice

case $choice in
    1)
        echo "🔧 Deploying Backend..."
        cd backend
        vercel --prod
        echo "✅ Backend deployed!"
        ;;
    2)
        echo "🔧 Deploying Frontend..."
        vercel --prod
        echo "✅ Frontend deployed!"
        ;;
    3)
        echo "🔧 Deploying Backend..."
        cd backend
        vercel --prod
        cd ..
        echo "🔧 Deploying Frontend..."
        vercel --prod
        echo "✅ Full deployment complete!"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo "📋 Next steps:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Configure custom domain (musistash.com)"
echo "3. Update DNS settings"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 
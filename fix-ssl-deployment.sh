#!/bin/bash

echo "🔧 MusiStash SSL Fix & Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Checking current deployment status...${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

echo -e "${YELLOW}Step 2: Checking domain configuration...${NC}"
echo "Current domain: musistash.com"
echo "Current configuration shows SSL mismatch error"

echo -e "${YELLOW}Step 3: Redeploying with proper SSL configuration...${NC}"

# Deploy the frontend with proper SSL headers
echo -e "${GREEN}Deploying frontend to Vercel...${NC}"
vercel --prod --confirm

echo -e "${YELLOW}Step 4: Checking backend connectivity...${NC}"
# Test if Railway backend is accessible
if curl -s --head https://musistash-production.up.railway.app/health | head -n 1 | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Backend is accessible${NC}"
else
    echo -e "${RED}❌ Backend connection issue - Railway backend may be down${NC}"
fi

echo -e "${YELLOW}Step 5: SSL Configuration Instructions${NC}"
echo "================================================="
echo "1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Select your MusiStash project"
echo "3. Go to Settings → Domains"
echo "4. Ensure musistash.com is properly configured"
echo "5. Check SSL certificate status"
echo ""
echo "If SSL issues persist:"
echo "- Remove musistash.com from Vercel domains"
echo "- Wait 5 minutes"
echo "- Re-add musistash.com"
echo "- Vercel will automatically provision new SSL certificate"

echo -e "${YELLOW}Step 6: Alternative Solution - Single Platform Deployment${NC}"
echo "To avoid SSL issues, consider deploying both frontend and backend on the same platform:"
echo "Option A: Deploy everything on Vercel"
echo "Option B: Deploy everything on Railway"

echo -e "${GREEN}🎉 Deployment script completed!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Check https://musistash.com in 5-10 minutes"
echo "2. If still showing SSL error, follow the manual steps above"
echo "3. Test all features once SSL is working" 
# Quick Deployment Checklist for MusiStash

## Before Pushing to GitHub

### ✅ 1. Environment Variables (CRITICAL)

**Frontend (.env file in musistash-platform/):**

```env
VITE_SUPABASE_URL=https://dwbetxanfumneukrqodd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3YmV0eGFuZnVtbmV1a3Jxb2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDI2MzYsImV4cCI6MjA2ODM3ODYzNn0.CO3oIID2omAwuex2qE_dXbOYbtA_v9bC38VQizuXVJc
VITE_API_URL=https://your-backend-domain.com
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_GOOGLE_CLIENT_ID=767080964358-cknd1jasah1f30ahivbm43mc7ch1pu5c.apps.googleusercontent.com
```

**Backend (.env file in musistash-platform/backend/):**

```env
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
NEWS_API_KEY=your_news_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
LASTFM_API_KEY=your_lastfm_api_key
YOUTUBE_API_KEY=your_youtube_api_key
SHAZAM_API_KEY=your_shazam_api_key
GENIUS_CLIENT_ID=your_genius_client_id
GENIUS_CLIENT_SECRET=your_genius_client_secret
GENIUS_ACCESS_TOKEN=your_genius_access_token
JWT_SECRET_KEY=your_super_secret_jwt_key
```

### ✅ 2. .gitignore Check

Make sure `.gitignore` includes:

```
.env
.env.local
.env.production
node_modules/
dist/
build/
venv/
__pycache__/
*.pyc
```

### ✅ 3. Database Schema

Run this in Supabase SQL Editor:

```sql
-- Add missing fields to artist_profiles table
ALTER TABLE artist_profiles
ADD COLUMN IF NOT EXISTS career_highlights JSONB DEFAULT '[]'::jsonb;

ALTER TABLE artist_profiles
ADD COLUMN IF NOT EXISTS musical_style TEXT DEFAULT '';

ALTER TABLE artist_profiles
ADD COLUMN IF NOT EXISTS influences TEXT DEFAULT '';
```

## Deployment Steps

### 🚀 Step 1: Deploy Backend (Railway Recommended)

1. Go to https://railway.app
2. Connect GitHub repository
3. Create new service from repository
4. Set all backend environment variables
5. Deploy (Railway auto-detects Python)

### 🚀 Step 2: Deploy Frontend (Vercel Recommended)

1. Go to https://vercel.com
2. Import GitHub repository
3. Configure:
   - Framework: Vite
   - Root Directory: `musistash-platform`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Set all frontend environment variables
5. Deploy

### 🚀 Step 3: Configure Domain

1. **Frontend**: Point `musistash.com` to Vercel
2. **Backend**: Create `api.musistash.com` subdomain pointing to Railway
3. Update frontend environment variables with new backend URL

### 🚀 Step 4: Update Google OAuth

1. Go to Google Cloud Console
2. Add your production domain to OAuth settings
3. Update authorized origins and redirect URIs

### 🚀 Step 5: Update Supabase

1. Go to Supabase Dashboard
2. Settings > Auth > URL Configuration
3. Set site URL to your production domain
4. Add production domain to redirect URLs

## Will Everything Work?

### ✅ What Will Work:

- **Supabase**: Already configured and working
- **Database Schema**: Fixed and ready
- **Frontend Code**: All components working locally
- **Backend Code**: All APIs working locally
- **Authentication**: Google OAuth working locally

### ⚠️ What Needs Configuration:

- **Environment Variables**: Must be set in deployment platforms
- **Domain Configuration**: Must point to correct services
- **CORS Settings**: Backend needs to allow production domain
- **Google OAuth**: Must be updated for production domain

## Quick Test After Deployment

1. **Frontend**: Visit your domain → Should load
2. **Backend**: Visit `api.musistash.com/health` → Should return 200
3. **Auth**: Try logging in → Should work
4. **Database**: Create a profile → Should save to Supabase

## Common Issues & Solutions

### ❌ CORS Errors

**Solution**: Update backend CORS to include your domain

```python
allow_origins=[
    "https://musistash.com",
    "https://www.musistash.com",
    "http://localhost:3000",
]
```

### ❌ Environment Variables Not Loading

**Solution**: Check deployment platform settings, ensure all variables are set

### ❌ Database Connection Issues

**Solution**: Verify Supabase URL and keys in environment variables

### ❌ Google OAuth Not Working

**Solution**: Update Google Cloud Console with production domain

## Final Answer: YES, it will work! 🎉

Your code is ready for deployment. The main things you need to do are:

1. Set environment variables in deployment platforms
2. Configure your domain
3. Update OAuth settings for production

Everything else (Supabase, database, code) is already working and ready to go!

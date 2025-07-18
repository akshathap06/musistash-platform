# MusiStash Platform Deployment Guide

## Overview

This guide will help you deploy your MusiStash platform to production with your custom domain. The platform consists of:

- **Frontend**: React/Vite application
- **Backend**: FastAPI Python application
- **Database**: Supabase (PostgreSQL)

## Prerequisites

- GitHub account
- Domain name (e.g., musistash.com)
- Supabase project (already set up)
- API keys for various services

## Step 1: Prepare Your Repository

### 1.1 Create .env.example files

Create these files to document required environment variables:

**Frontend (.env.example):**

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Backend API URL
VITE_API_URL=https://your-backend-domain.com
VITE_BACKEND_URL=https://your-backend-domain.com

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Backend (.env.example):**

```env
# API Keys
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

# JWT Secret
JWT_SECRET_KEY=your_super_secret_jwt_key_change_this_in_production
```

### 1.2 Update .gitignore

Make sure your `.gitignore` includes:

```
# Environment variables
.env
.env.local
.env.production

# Python
__pycache__/
*.pyc
venv/
.venv/

# Node
node_modules/
dist/
build/

# IDE
.vscode/
.idea/
```

## Step 2: Deploy Backend

### Option A: Railway (Recommended)

1. **Sign up for Railway** at https://railway.app
2. **Connect your GitHub repository**
3. **Create a new service** from your repository
4. **Set environment variables** in Railway dashboard:
   ```
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
5. **Deploy** - Railway will automatically detect it's a Python app and deploy it

### Option B: Render

1. **Sign up for Render** at https://render.com
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Set environment variables** in Render dashboard
6. **Deploy**

### Option C: Heroku

1. **Sign up for Heroku** at https://heroku.com
2. **Install Heroku CLI**
3. **Create a new app**
4. **Add Python buildpack**
5. **Set environment variables**:
   ```bash
   heroku config:set OPENAI_API_KEY=your_openai_api_key
   heroku config:set GEMINI_API_KEY=your_gemini_api_key
   # ... set all other environment variables
   ```
6. **Deploy**:
   ```bash
   git push heroku main
   ```

## Step 3: Deploy Frontend

### Option A: Vercel (Recommended)

1. **Sign up for Vercel** at https://vercel.com
2. **Import your GitHub repository**
3. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `musistash-platform` (or wherever your frontend is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Set environment variables** in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_API_URL=https://your-backend-domain.com
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```
5. **Deploy**

### Option B: Netlify

1. **Sign up for Netlify** at https://netlify.com
2. **Import your GitHub repository**
3. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. **Set environment variables** in Netlify dashboard
5. **Deploy**

## Step 4: Configure Domain

### 4.1 Point Domain to Frontend

1. **In your domain registrar** (GoDaddy, Namecheap, etc.):

   - Add an A record pointing to your frontend deployment
   - For Vercel: `76.76.19.33`
   - For Netlify: `75.2.60.5`

2. **In your deployment platform**:
   - Add your custom domain
   - Configure SSL certificate (usually automatic)

### 4.2 Configure Backend Subdomain

1. **Create a subdomain** (e.g., `api.musistash.com`)
2. **Point it to your backend deployment**
3. **Update frontend environment variables** to use the new backend URL

## Step 5: Update Environment Variables

### 5.1 Update Frontend Environment Variables

After deploying both frontend and backend, update your frontend environment variables:

```env
VITE_API_URL=https://api.musistash.com
VITE_BACKEND_URL=https://api.musistash.com
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 5.2 Update Google OAuth Settings

1. **Go to Google Cloud Console**
2. **Update OAuth 2.0 Client IDs**:
   - Add your production domain to authorized origins
   - Add your production domain to authorized redirect URIs

## Step 6: Database Configuration

### 6.1 Supabase Settings

1. **Go to your Supabase dashboard**
2. **Settings > API**:

   - Copy your project URL and anon key
   - Update frontend environment variables

3. **Settings > Auth > URL Configuration**:
   - Set your site URL to your production domain
   - Add your production domain to redirect URLs

### 6.2 Database Schema

Make sure your database schema is up to date:

1. **Go to Supabase SQL Editor**
2. **Run the schema migration** (if you haven't already):

   ```sql
   -- Add missing fields to artist_profiles table
   ALTER TABLE artist_profiles
   ADD COLUMN IF NOT EXISTS career_highlights JSONB DEFAULT '[]'::jsonb;

   ALTER TABLE artist_profiles
   ADD COLUMN IF NOT EXISTS musical_style TEXT DEFAULT '';

   ALTER TABLE artist_profiles
   ADD COLUMN IF NOT EXISTS influences TEXT DEFAULT '';
   ```

## Step 7: Test Your Deployment

### 7.1 Test Frontend

1. **Visit your domain** (e.g., https://musistash.com)
2. **Test user registration/login**
3. **Test artist profile creation**
4. **Test admin dashboard**

### 7.2 Test Backend

1. **Test health endpoint**: `https://api.musistash.com/health`
2. **Test artist analysis**: `https://api.musistash.com/analyze-artist/Drake`

### 7.3 Test Database

1. **Create a test user**
2. **Create a test artist profile**
3. **Verify data appears in Supabase dashboard**

## Step 8: Security Considerations

### 8.1 Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use strong, unique JWT secrets
- ✅ Rotate API keys regularly

### 8.2 CORS Configuration

Update your backend CORS settings to allow your production domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://musistash.com",
        "https://www.musistash.com",
        "http://localhost:3000",  # for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 8.3 SSL/HTTPS

- ✅ Ensure all endpoints use HTTPS
- ✅ Configure SSL certificates (usually automatic with modern platforms)

## Step 9: Monitoring and Maintenance

### 9.1 Set Up Monitoring

1. **Enable logging** in your deployment platforms
2. **Set up error tracking** (Sentry, LogRocket, etc.)
3. **Monitor API usage** and costs

### 9.2 Regular Maintenance

1. **Update dependencies** regularly
2. **Monitor API key usage** and limits
3. **Backup database** regularly
4. **Monitor performance** and optimize as needed

## Troubleshooting

### Common Issues

1. **CORS Errors**:

   - Check CORS configuration in backend
   - Verify domain is in allowed origins

2. **Environment Variables Not Loading**:

   - Ensure all variables start with `VITE_` for frontend
   - Check deployment platform environment variable settings

3. **Database Connection Issues**:

   - Verify Supabase URL and keys
   - Check RLS policies

4. **API Endpoints Not Working**:
   - Verify backend URL in frontend environment variables
   - Check backend deployment logs

### Getting Help

- Check deployment platform logs
- Verify environment variables are set correctly
- Test endpoints individually
- Check browser console for frontend errors

## Final Checklist

Before going live:

- [ ] All environment variables set correctly
- [ ] Domain configured and SSL working
- [ ] Database schema up to date
- [ ] Google OAuth configured for production
- [ ] All API endpoints tested
- [ ] User registration/login working
- [ ] Admin dashboard accessible
- [ ] Artist profile creation working
- [ ] Error monitoring set up
- [ ] Backup strategy in place

## Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review deployment platform logs
3. Verify all environment variables are set correctly
4. Test each component individually

Good luck with your deployment! 🚀

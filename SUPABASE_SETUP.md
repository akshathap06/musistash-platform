# 🚀 Supabase Integration Setup Guide

This guide will help you set up the Supabase integration for MusiStash to store real artist data and power the XGBoost ML model.

## 📋 Prerequisites

- Python 3.8+
- Supabase account (free tier available)
- All existing MusiStash API keys

## 🎯 Step-by-Step Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Note down your project URL and anon key

### Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase_schema.sql`
3. Run the SQL to create all tables

### Step 3: Install Dependencies

```bash
# Navigate to your project directory
cd musistash-platform

# Install new dependencies
pip install -r requirements_supabase.txt
```

### Step 4: Configure Environment Variables

Create a `.env` file in your project root with:

```env
# Existing API keys (keep your current ones)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key
GENIUS_ACCESS_TOKEN=your_genius_access_token

# NEW: Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 5: Test the Integration

1. Start your backend server:

```bash
cd backend
python main.py
```

2. Test an artist analysis:

```bash
curl "http://localhost:8000/analyze-artist/Drake"
```

3. Check Supabase dashboard to see if data is being stored

## 🔍 What Data Will Be Stored

### Artist Profiles Table

- **Spotify Data**: Followers, popularity, genres, image URL
- **Enhanced Data**: Instagram followers, net worth, YouTube subscribers
- **YouTube Metrics**: View count, engagement rate, subscriber ratio
- **Genius Metrics**: Page views, mainstream appeal, emotional resonance
- **Audio Features**: Energy, danceability, valence, etc.
- **Calculated Features**: Genre mainstream score, social engagement rate

### Artist Comparisons Table

- **Similarity Scores**: Genre, popularity, audience similarity
- **ML Predictions**: Resonance score, confidence, feature importance
- **Insights**: Success drivers, risk factors, AI insights

### ML Model Metrics Table

- **Performance**: Training accuracy, prediction confidence
- **System**: Data points processed, features analyzed, latency
- **Features**: Real-time feature importance rankings

## 🎯 Expected Results

After setup, your ML Model Dashboard will show:

1. **Real Training Accuracy**: Based on actual data patterns
2. **Live Feature Importance**: From real XGBoost model
3. **Accurate Predictions**: Using historical comparison data
4. **Dynamic Metrics**: Updated with each new analysis

## 🔧 Troubleshooting

### Common Issues

1. **Import Errors**: Make sure all dependencies are installed
2. **Connection Errors**: Verify Supabase URL and key
3. **Schema Errors**: Ensure SQL was executed successfully
4. **Data Not Storing**: Check environment variables

### Debug Commands

```bash
# Check if Supabase is accessible
python -c "from supabase import create_client; print('Supabase client created successfully')"

# Test database connection
python -c "from supabase_config import supabase_manager; print('Supabase manager initialized')"
```

## 📊 Data Flow

```
1. User searches artist →
2. Backend fetches from APIs →
3. Data stored in Supabase →
4. XGBoost model trained on real data →
5. ML Dashboard shows live metrics
```

## 🚀 Next Steps

After successful setup:

1. **Monitor Data Growth**: Check Supabase dashboard for new records
2. **Analyze Patterns**: Use Supabase analytics to understand data trends
3. **Optimize Model**: Adjust XGBoost parameters based on real performance
4. **Add More APIs**: Integrate TikTok, Twitter, etc. for enhanced data

## 📞 Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure Supabase project is active and accessible
4. Test with a simple artist search first

---

**🎉 Congratulations!** Your MusiStash platform now has real data storage and ML capabilities powered by Supabase!

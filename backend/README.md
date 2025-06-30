# MusiStash Backend API

This backend provides comprehensive artist analysis using multiple APIs and AI-powered insights with **real-time music industry data**.

## 🚀 NEW: Google Gemini Integration for Accurate Data

The API now uses **Google Gemini with real-time search** instead of hardcoded estimates, providing:

- ✅ **Accurate tour revenues** (e.g., The Weeknd's $350M After Hours Til Dawn tour)
- ✅ **Real streaming numbers** from current charts
- ✅ **Verified industry data** with citations
- ✅ **Current collaboration info** and musical keys
- ✅ **Live search of Billboard, Pollstar, and music publications**

## Required API Keys

Create a `.env` file in the backend directory with the following keys:

### Google Gemini API Key (REQUIRED for Accurate Music Industry Data)

```
GEMINI_API_KEY=your_gemini_api_key_here
```

- **Get your API key from**: https://ai.google.dev/
- **Why Gemini**: Built-in Google Search provides real-time, accurate music industry data
- **Replaces**: Inaccurate hardcoded estimates with verified facts
- **Powers**: Tour revenue data, streaming numbers, collaboration details, musical analysis

### Spotify API Credentials (Required for Artist Data)

```
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

- Get your credentials from: https://developer.spotify.com/dashboard/applications
- Used for fetching artist information, followers, popularity, and genres

### OpenAI API Key (Legacy - Optional)

```
OPENAI_API_KEY=your_openai_api_key_here
```

- Get your API key from: https://platform.openai.com/api-keys
- **Note**: Now replaced by Gemini for better real-time data accuracy
- Only used as fallback if Gemini is unavailable

### Last.fm API Key (Optional - for Additional Music Data)

```
LASTFM_API_KEY=your_lastfm_api_key_here
```

- Get your API key from: https://www.last.fm/api/account/create
- Used for play counts and listener statistics

### News API Key (Optional - for News Articles)

```
NEWS_API_KEY=your_news_api_key_here
```

- Get your API key from: https://newsapi.org/register
- Used for fetching recent news articles about artists

## Setup Instructions

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Create a `.env` file with your API keys (see above)

3. Run the server:

```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### `GET /analyze-artist/{artist_name}`

Returns comprehensive analysis including:

- Artist comparison data with **real tour revenue figures**
- Detailed statistics for both artists
- **AI-powered similarity analysis using live search data**
- **Accurate streaming numbers and collaboration info**
- Recent news articles for both artists

### `GET /artist-stats/{artist_name}`

Returns detailed statistics for a single artist.

### `GET /health`

Returns API health status and availability of all services.

## 🎯 Key Improvements

### Before (OpenAI + Hardcoded Data):

- ❌ The Weeknd tour revenue: "$25M" (completely wrong)
- ❌ Estimated streaming numbers based on followers
- ❌ Generic collaboration advice
- ❌ Outdated or training-data-limited information

### After (Gemini + Real-Time Search):

- ✅ The Weeknd tour revenue: "$350M" (actual After Hours Til Dawn tour data)
- ✅ Real streaming numbers from current charts
- ✅ Specific collaboration partners and musical keys
- ✅ Up-to-date industry data with source citations

## Features

- **🔍 Real-Time Music Industry Search**: Uses Gemini's Google Search integration for verified data
- **📊 Accurate Financial Data**: Real tour revenues, not estimates
- **🎵 Musical Analysis**: Actual keys, song durations, and collaboration patterns
- **📈 Multi-Source Data**: Combines Spotify, Last.fm, Billboard, and real-time search
- **📰 News Integration**: Recent articles about artists
- **🚀 Enhanced AI Insights**: Context-aware recommendations based on real industry metrics

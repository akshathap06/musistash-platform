# MusiStash Backend API

This backend provides comprehensive artist analysis using multiple APIs and AI-powered insights.

## Required API Keys

Create a `.env` file in the backend directory with the following keys:

### OpenAI API Key (Required for AI Similarity Analysis)

```
OPENAI_API_KEY=your_openai_api_key_here
```

- Get your API key from: https://platform.openai.com/api-keys
- Used for calculating AI-powered similarity scores between artists

### Spotify API Credentials (Required for Artist Data)

```
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

- Get your credentials from: https://developer.spotify.com/dashboard/applications
- Used for fetching artist information, followers, popularity, and genres

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

- Artist comparison data
- Detailed statistics for both artists
- AI-powered similarity analysis
- Recent news articles for both artists

### `GET /artist-stats/{artist_name}`

Returns detailed statistics for a single artist.

## Features

- **AI Similarity Analysis**: Uses OpenAI to calculate comprehensive similarity scores between artists
- **Multi-Source Data**: Combines data from Spotify, Last.fm, Billboard, and ListenBrainz
- **News Integration**: Fetches recent news articles about artists
- **Real-time Analysis**: Provides up-to-date artist comparisons and insights

-- MusiStash Supabase Schema for ML Model Integration
-- This schema stores all artist data for XGBoost model training

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main artist profiles table
CREATE TABLE IF NOT EXISTS artist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spotify_id VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Spotify Data (Already Available)
    spotify_followers BIGINT,
    spotify_popularity INTEGER,
    spotify_genres TEXT[],
    spotify_image_url TEXT,
    
    -- Enhanced Data (Gemini + YouTube) - Already Available
    instagram_followers BIGINT,
    net_worth_millions DECIMAL,
    youtube_subscribers BIGINT,
    monthly_streams_millions DECIMAL,
    career_achievements TEXT[],
    major_awards TEXT[],
    
    -- YouTube Metrics (Already Available)
    youtube_view_count BIGINT,
    youtube_video_count INTEGER,
    youtube_avg_views_per_video BIGINT,
    youtube_engagement_rate DECIMAL,
    youtube_subscriber_view_ratio DECIMAL,
    
    -- Genius Metrics (Already Available)
    genius_total_views BIGINT,
    genius_avg_views_per_song BIGINT,
    genius_hot_songs_count INTEGER,
    genius_mainstream_appeal DECIMAL,
    genius_emotional_resonance DECIMAL,
    genius_commercial_themes JSONB,
    
    -- Audio Features (Already Available)
    audio_energy DECIMAL,
    audio_danceability DECIMAL,
    audio_valence DECIMAL,
    audio_acousticness DECIMAL,
    audio_instrumentalness DECIMAL,
    
    -- New Data (To Be Added)
    billboard_position INTEGER,
    billboard_peak_position INTEGER,
    billboard_weeks_on_chart INTEGER,
    career_start_date DATE,
    record_label VARCHAR,
    label_ownership BOOLEAN,
    
    -- Calculated Features
    genre_mainstream_score DECIMAL,
    genre_diversity_score DECIMAL,
    tier_score DECIMAL,
    social_engagement_rate DECIMAL,
    
    -- ML Model Outputs
    ml_resonance_score DECIMAL,
    ml_prediction_confidence DECIMAL,
    ml_feature_importance JSONB,
    ml_last_updated TIMESTAMP
);

-- Artist comparisons table
CREATE TABLE IF NOT EXISTS artist_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist1_id UUID REFERENCES artist_profiles(id),
    artist2_id UUID REFERENCES artist_profiles(id),
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Comparison metrics
    genre_similarity DECIMAL,
    popularity_similarity DECIMAL,
    audience_similarity DECIMAL,
    overall_similarity DECIMAL,
    
    -- ML predictions
    predicted_resonance_score DECIMAL,
    prediction_confidence DECIMAL,
    feature_importance JSONB,
    
    -- Insights
    success_drivers TEXT[],
    risk_factors TEXT[],
    ai_insights TEXT[]
);

-- ML model performance tracking
CREATE TABLE IF NOT EXISTS ml_model_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_version VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Performance metrics
    training_accuracy DECIMAL,
    prediction_confidence DECIMAL,
    data_points_processed BIGINT,
    features_analyzed INTEGER,
    latency_ms INTEGER,
    
    -- Feature importance
    feature_importance JSONB,
    
    -- System status
    model_status VARCHAR,
    last_updated TIMESTAMP
);

-- Historical data snapshots for growth analysis
CREATE TABLE IF NOT EXISTS artist_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_id UUID REFERENCES artist_profiles(id),
    snapshot_date DATE NOT NULL,
    
    -- Key metrics at this point in time
    spotify_followers BIGINT,
    spotify_popularity INTEGER,
    youtube_subscribers BIGINT,
    instagram_followers BIGINT,
    
    -- Growth calculations
    monthly_growth_rate DECIMAL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_artist_profiles_spotify_id ON artist_profiles(spotify_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_name ON artist_profiles(name);
CREATE INDEX IF NOT EXISTS idx_artist_comparisons_artists ON artist_comparisons(artist1_id, artist2_id);
CREATE INDEX IF NOT EXISTS idx_artist_snapshots_artist_date ON artist_snapshots(artist_id, snapshot_date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_artist_profiles_updated_at 
    BEFORE UPDATE ON artist_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 
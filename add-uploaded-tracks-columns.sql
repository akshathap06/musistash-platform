-- Add missing columns to uploaded_tracks table for comprehensive audio analysis
-- This migration adds fields for emotional analysis, resonance scoring, and similarity data

ALTER TABLE uploaded_tracks 
ADD COLUMN IF NOT EXISTS commercial_score DECIMAL(5,4) DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS arousal DECIMAL(5,4) DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS valence DECIMAL(5,4) DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS emotional_category VARCHAR(50) DEFAULT 'neutral',
ADD COLUMN IF NOT EXISTS resonance_score DECIMAL(5,2) DEFAULT 50.0,
ADD COLUMN IF NOT EXISTS style_consistency DECIMAL(5,4) DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS analysis_json JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS similarity_json JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS resonance_json JSONB DEFAULT '{}';

-- Add comments for documentation
COMMENT ON COLUMN uploaded_tracks.arousal IS 'Emotional arousal score (0-1) from audio analysis';
COMMENT ON COLUMN uploaded_tracks.valence IS 'Emotional valence score (0-1) from audio analysis';
COMMENT ON COLUMN uploaded_tracks.emotional_category IS 'Categorized emotional state (happy, sad, energetic, etc.)';
COMMENT ON COLUMN uploaded_tracks.resonance_score IS 'Audience resonance prediction score (0-100)';
COMMENT ON COLUMN uploaded_tracks.style_consistency IS 'Consistency with artist''s existing style (0-1)';
COMMENT ON COLUMN uploaded_tracks.analysis_json IS 'Complete audio analysis results as JSON';
COMMENT ON COLUMN uploaded_tracks.similarity_json IS 'Similarity analysis with existing tracks as JSON';
COMMENT ON COLUMN uploaded_tracks.resonance_json IS 'Resonance prediction details as JSON';

-- Create indexes for better performance on analysis queries
CREATE INDEX IF NOT EXISTS idx_uploaded_tracks_resonance_score ON uploaded_tracks(resonance_score DESC);
CREATE INDEX IF NOT EXISTS idx_uploaded_tracks_emotional_category ON uploaded_tracks(emotional_category);
CREATE INDEX IF NOT EXISTS idx_uploaded_tracks_artist_id ON uploaded_tracks(artist_id); 
-- Add complete analysis fields to uploaded_tracks table
-- This migration adds fields to store all metrics and Gemini responses for comprehensive analysis reports

ALTER TABLE uploaded_tracks 
ADD COLUMN IF NOT EXISTS complete_analysis_json JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gemini_insights_json JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS track_summary JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS technical_analysis JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS artistic_insights JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS actionable_recommendations JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS similar_artists JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS market_positioning JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_saved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_analysis_date TIMESTAMP WITH TIME ZONE;

-- Add comments for documentation
COMMENT ON COLUMN uploaded_tracks.complete_analysis_json IS 'Complete analysis results including all metrics and insights as JSON';
COMMENT ON COLUMN uploaded_tracks.gemini_insights_json IS 'Complete Gemini AI analysis response as JSON';
COMMENT ON COLUMN uploaded_tracks.track_summary IS 'Track summary section from Gemini analysis';
COMMENT ON COLUMN uploaded_tracks.technical_analysis IS 'Technical analysis section from Gemini analysis';
COMMENT ON COLUMN uploaded_tracks.artistic_insights IS 'Artistic insights section from Gemini analysis';
COMMENT ON COLUMN uploaded_tracks.actionable_recommendations IS 'Actionable recommendations section from Gemini analysis';
COMMENT ON COLUMN uploaded_tracks.similar_artists IS 'Similar artists section from Gemini analysis';
COMMENT ON COLUMN uploaded_tracks.market_positioning IS 'Market positioning section from Gemini analysis';
COMMENT ON COLUMN uploaded_tracks.is_saved IS 'Whether this analysis has been saved by the user';
COMMENT ON COLUMN uploaded_tracks.last_analysis_date IS 'Timestamp of when this analysis was performed';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_uploaded_tracks_is_saved ON uploaded_tracks(is_saved);
CREATE INDEX IF NOT EXISTS idx_uploaded_tracks_last_analysis_date ON uploaded_tracks(last_analysis_date DESC);

-- Update existing records to set is_saved to true for existing saved reports
UPDATE uploaded_tracks SET is_saved = TRUE WHERE created_at IS NOT NULL; 
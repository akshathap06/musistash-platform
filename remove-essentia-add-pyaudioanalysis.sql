-- Migration: Remove Essentia fields and add PyAudioAnalysis fields
-- This replaces Essentia audio analysis with PyAudioAnalysis

-- Remove Essentia fields from uploaded_tracks table
ALTER TABLE uploaded_tracks 
DROP COLUMN IF EXISTS essentia_rhythm_clarity,
DROP COLUMN IF EXISTS essentia_bpm,
DROP COLUMN IF EXISTS essentia_beats_confidence,
DROP COLUMN IF EXISTS essentia_dissonance,
DROP COLUMN IF EXISTS essentia_key,
DROP COLUMN IF EXISTS essentia_scale;

-- Add PyAudioAnalysis fields to uploaded_tracks table
ALTER TABLE uploaded_tracks 
ADD COLUMN IF NOT EXISTS pyaudio_rhythm_clarity FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_bpm FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_beats_confidence FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_dissonance FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_key VARCHAR(10),
ADD COLUMN IF NOT EXISTS pyaudio_scale VARCHAR(10),
ADD COLUMN IF NOT EXISTS pyaudio_spectral_centroid FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_spectral_rolloff FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_spectral_flux FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_spectral_contrast FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_key_confidence FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_mfcc_features JSONB,
ADD COLUMN IF NOT EXISTS pyaudio_chroma_vector JSONB,
ADD COLUMN IF NOT EXISTS avg_similarity FLOAT DEFAULT 0.0;

-- Remove Essentia fields from artist_profiles table (if they exist)
ALTER TABLE artist_profiles 
DROP COLUMN IF EXISTS essentia_rhythm_clarity,
DROP COLUMN IF EXISTS essentia_bpm,
DROP COLUMN IF EXISTS essentia_beats_confidence,
DROP COLUMN IF EXISTS essentia_dissonance,
DROP COLUMN IF EXISTS essentia_key,
DROP COLUMN IF EXISTS essentia_scale;

-- Add PyAudioAnalysis fields to artist_profiles table
ALTER TABLE artist_profiles 
ADD COLUMN IF NOT EXISTS pyaudio_rhythm_clarity FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_bpm FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_beats_confidence FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_dissonance FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_key VARCHAR(10),
ADD COLUMN IF NOT EXISTS pyaudio_scale VARCHAR(10),
ADD COLUMN IF NOT EXISTS pyaudio_spectral_centroid FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_spectral_rolloff FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_spectral_flux FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_spectral_contrast FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_key_confidence FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_mfcc_features JSONB,
ADD COLUMN IF NOT EXISTS pyaudio_chroma_vector JSONB,
ADD COLUMN IF NOT EXISTS avg_similarity FLOAT DEFAULT 0.0;

-- Update any existing records to have default values for new fields
UPDATE uploaded_tracks 
SET 
    pyaudio_rhythm_clarity = 0.0,
    pyaudio_bpm = 120.0,
    pyaudio_beats_confidence = 0.0,
    pyaudio_dissonance = 0.0,
    pyaudio_key = 'C',
    pyaudio_scale = 'major',
    pyaudio_spectral_centroid = 0.0,
    pyaudio_spectral_rolloff = 0.0,
    pyaudio_spectral_flux = 0.0,
    pyaudio_spectral_contrast = 0.0,
    pyaudio_key_confidence = 0.0,
    pyaudio_mfcc_features = '[]',
    pyaudio_chroma_vector = '[]'
WHERE pyaudio_rhythm_clarity IS NULL;

UPDATE artist_profiles 
SET 
    pyaudio_rhythm_clarity = 0.0,
    pyaudio_bpm = 120.0,
    pyaudio_beats_confidence = 0.0,
    pyaudio_dissonance = 0.0,
    pyaudio_key = 'C',
    pyaudio_scale = 'major',
    pyaudio_spectral_centroid = 0.0,
    pyaudio_spectral_rolloff = 0.0,
    pyaudio_spectral_flux = 0.0,
    pyaudio_spectral_contrast = 0.0,
    pyaudio_key_confidence = 0.0,
    pyaudio_mfcc_features = '[]',
    pyaudio_chroma_vector = '[]'
WHERE pyaudio_rhythm_clarity IS NULL;

-- Add comments to document the new fields
COMMENT ON COLUMN uploaded_tracks.pyaudio_rhythm_clarity IS 'Rhythm clarity score from PyAudioAnalysis (0-1)';
COMMENT ON COLUMN uploaded_tracks.pyaudio_bpm IS 'Beats per minute from PyAudioAnalysis';
COMMENT ON COLUMN uploaded_tracks.pyaudio_beats_confidence IS 'Confidence in beat detection (0-1)';
COMMENT ON COLUMN uploaded_tracks.pyaudio_dissonance IS 'Dissonance score from PyAudioAnalysis (0-1)';
COMMENT ON COLUMN uploaded_tracks.pyaudio_key IS 'Detected musical key (C, C#, D, etc.)';
COMMENT ON COLUMN uploaded_tracks.pyaudio_scale IS 'Detected musical scale (major/minor)';
COMMENT ON COLUMN uploaded_tracks.pyaudio_spectral_centroid IS 'Spectral centroid from PyAudioAnalysis';
COMMENT ON COLUMN uploaded_tracks.pyaudio_spectral_rolloff IS 'Spectral rolloff from PyAudioAnalysis';
COMMENT ON COLUMN uploaded_tracks.pyaudio_spectral_flux IS 'Spectral flux from PyAudioAnalysis';
COMMENT ON COLUMN uploaded_tracks.pyaudio_spectral_contrast IS 'Spectral contrast from PyAudioAnalysis';
COMMENT ON COLUMN uploaded_tracks.pyaudio_key_confidence IS 'Confidence in key detection (0-1)';
COMMENT ON COLUMN uploaded_tracks.pyaudio_mfcc_features IS 'MFCC features as JSON array';
COMMENT ON COLUMN uploaded_tracks.pyaudio_chroma_vector IS 'Chroma features as JSON array';

-- Add analysis_version column if it doesn't exist
ALTER TABLE uploaded_tracks ADD COLUMN IF NOT EXISTS analysis_version VARCHAR(10);
COMMENT ON COLUMN uploaded_tracks.analysis_version IS 'Version of the analysis algorithm used'; 
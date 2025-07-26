-- Add enhanced audio analysis fields to uploaded_tracks
ALTER TABLE uploaded_tracks
ADD COLUMN IF NOT EXISTS onset_count INTEGER,
ADD COLUMN IF NOT EXISTS spectral_contrast JSONB,
ADD COLUMN IF NOT EXISTS pyaudio_energy_mean FLOAT,
ADD COLUMN IF NOT EXISTS pyaudio_energy_std FLOAT,
ADD COLUMN IF NOT EXISTS music21_analysis TEXT,
ADD COLUMN IF NOT EXISTS analysis_quality VARCHAR(20),
ADD COLUMN IF NOT EXISTS libraries_used JSONB; 
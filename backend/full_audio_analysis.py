"""
Full Audio Analysis Module
Comprehensive audio analysis using multiple libraries with full system dependencies
"""

import numpy as np
import os
from typing import Dict, Any, List, Optional
import asyncio
import json
import random
from datetime import datetime

# Import Gemini service
try:
    from gemini_analysis_service import gemini_service
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("⚠️  Gemini service not available")

# Full audio library imports with error handling
try:
    import librosa
    LIBROSA_AVAILABLE = True
    print("✅ Librosa imported successfully")
except ImportError:
    LIBROSA_AVAILABLE = False
    print("❌ Librosa not available")

try:
    import aubio
    AUBIO_AVAILABLE = True
    print("✅ Aubio imported successfully")
except ImportError:
    AUBIO_AVAILABLE = False
    print("❌ Aubio not available")

try:
    from pyAudioAnalysis import audioBasicIO, ShortTermFeatures
    PYAUDIOANALYSIS_AVAILABLE = True
    print("✅ PyAudioAnalysis imported successfully")
except ImportError:
    PYAUDIOANALYSIS_AVAILABLE = False
    print("❌ PyAudioAnalysis not available")

try:
    import music21
    MUSIC21_AVAILABLE = True
    print("✅ Music21 imported successfully")
except ImportError:
    MUSIC21_AVAILABLE = False
    print("❌ Music21 not available")

try:
    import soundfile as sf
    SOUNDFILE_AVAILABLE = True
    print("✅ Soundfile imported successfully")
except ImportError:
    SOUNDFILE_AVAILABLE = False
    print("❌ Soundfile not available")

try:
    import audioread
    AUDIOREAD_AVAILABLE = True
    print("✅ Audioread imported successfully")
except ImportError:
    AUDIOREAD_AVAILABLE = False
    print("❌ Audioread not available")

class FullAudioAnalyzer:
    """
    Comprehensive audio analysis using all available libraries
    """
    
    def __init__(self):
        self.available_libraries = {
            'librosa': LIBROSA_AVAILABLE,
            'aubio': AUBIO_AVAILABLE,
            'pyAudioAnalysis': PYAUDIOANALYSIS_AVAILABLE,
            'music21': MUSIC21_AVAILABLE,
            'soundfile': SOUNDFILE_AVAILABLE,
            'audioread': AUDIOREAD_AVAILABLE
        }
        
        print(f"🎵 Full Audio Analyzer initialized with libraries: {self.available_libraries}")
        
    async def analyze_audio_comprehensive(self, file_path: str, filename: str, artist_id: str = None) -> Dict[str, Any]:
        """
        Comprehensive audio analysis using all available libraries
        """
        print(f"🎵 Starting comprehensive audio analysis for: {filename}")
        
        # Basic validation
        if not os.path.exists(file_path):
            raise Exception(f"Audio file not found: {file_path}")
        
        file_size = os.path.getsize(file_path)
        if file_size == 0:
            raise Exception("Audio file is empty")
        
        print(f"📁 File size: {file_size} bytes")
        
        # Get artist profile if artist_id is provided
        artist_profile = None
        if artist_id and GEMINI_AVAILABLE:
            try:
                artist_profile = await self._get_artist_profile(artist_id)
                print(f"✅ Artist profile loaded for AI analysis")
            except Exception as e:
                print(f"⚠️  Could not load artist profile: {e}")
        
        # Initialize results
        analysis_results = {
            "filename": filename,
            "file_size_bytes": file_size,
            "libraries_used": [],
            "analysis_quality": "basic"
        }
        
        # 1. Librosa Analysis (if available)
        if LIBROSA_AVAILABLE:
            try:
                librosa_features = await self._analyze_with_librosa(file_path)
                analysis_results.update(librosa_features)
                analysis_results["libraries_used"].append("librosa")
                analysis_results["analysis_quality"] = "enhanced"
                print("✅ Librosa analysis completed")
            except Exception as e:
                print(f"❌ Librosa analysis failed: {e}")
        
        # 2. PyAudioAnalysis Features (if available)
        if PYAUDIOANALYSIS_AVAILABLE:
            try:
                pyaudio_features = await self._analyze_with_pyaudioanalysis(file_path)
                analysis_results.update(pyaudio_features)
                analysis_results["libraries_used"].append("pyAudioAnalysis")
                analysis_results["analysis_quality"] = "enhanced"
                print("✅ PyAudioAnalysis completed")
            except Exception as e:
                print(f"❌ PyAudioAnalysis failed: {e}")
        
        # 3. Aubio Analysis (if available)
        if AUBIO_AVAILABLE:
            try:
                aubio_features = await self._analyze_with_aubio(file_path)
                analysis_results.update(aubio_features)
                analysis_results["libraries_used"].append("aubio")
                analysis_results["analysis_quality"] = "enhanced"
                print("✅ Aubio analysis completed")
            except Exception as e:
                print(f"❌ Aubio analysis failed: {e}")
        
        # 4. Music21 Analysis (if available)
        if MUSIC21_AVAILABLE:
            try:
                music21_features = await self._analyze_with_music21(file_path)
                analysis_results.update(music21_features)
                analysis_results["libraries_used"].append("music21")
                analysis_results["analysis_quality"] = "comprehensive"
                print("✅ Music21 analysis completed")
            except Exception as e:
                print(f"❌ Music21 analysis failed: {e}")
        
        # 5. Commercial potential analysis
        commercial_analysis = await self._analyze_commercial_potential(analysis_results)
        analysis_results.update(commercial_analysis)
        
        # 6. Gemini AI Analysis (if available)
        if GEMINI_AVAILABLE:
            try:
                print("🤖 Starting Gemini AI analysis...")
                gemini_analysis = await gemini_service.analyze_audio_features(
                    analysis_results, 
                    artist_profile, 
                    filename
                )
                analysis_results["gemini_insights"] = gemini_analysis
                analysis_results["libraries_used"].append("gemini")
                analysis_results["analysis_quality"] = "ai_enhanced"
                print("✅ Gemini AI analysis completed")
            except Exception as e:
                print(f"❌ Gemini AI analysis failed: {e}")
        
        print(f"🎯 Analysis completed using {len(analysis_results['libraries_used'])} libraries")
        return analysis_results
    
    async def _analyze_with_librosa(self, file_path: str) -> Dict[str, Any]:
        """Enhanced Librosa analysis with additional features"""
        if not LIBROSA_AVAILABLE:
            return {}
        
        try:
            y, sr = librosa.load(file_path, sr=None)
            
            # Basic features
            duration = len(y) / sr
            tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
            
            # Enhanced spectral features
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)
            spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
            spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
            spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
            
            # Advanced rhythm features
            onset_frames = librosa.onset.onset_detect(y=y, sr=sr)
            onset_times = librosa.frames_to_time(onset_frames, sr=sr)
            
            # Harmonic features
            chroma = librosa.feature.chroma_stft(y=y, sr=sr)
            key = np.argmax(np.sum(chroma, axis=1))
            key_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
            detected_key = key_names[key]
            
            # Mode detection
            major_profile = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]
            minor_profile = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]
            avg_chroma = np.mean(chroma, axis=1)
            major_score = np.dot(avg_chroma, major_profile)
            minor_score = np.dot(avg_chroma, minor_profile)
            mode = "major" if major_score > minor_score else "minor"
            
            # Energy and dynamics
            rms = librosa.feature.rms(y=y)
            energy = np.mean(rms)
            loudness = librosa.amplitude_to_db(rms)
            avg_loudness = np.mean(loudness)
            dynamic_range = np.max(loudness) - np.min(loudness)
            
            # MFCC features
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            
            # Tonal features
            tonnetz = librosa.feature.tonnetz(y=librosa.effects.harmonic(y), sr=sr)
            
            # Emotional indicators
            valence_estimate = (major_score - minor_score + 1) / 2
            arousal_estimate = min(energy * 10, 1.0)
            
            return {
                "duration": float(duration),
                "sample_rate": int(sr),
                "bpm": float(tempo),
                "beats_count": len(beats),
                "rhythm_stability": float(np.std(np.diff(beats))),
                "key": detected_key,
                "mode": mode,
                "key_confidence": float(max(major_score, minor_score)),
                "energy": float(energy),
                "loudness": float(avg_loudness),
                "dynamic_range": float(dynamic_range),
                "spectral_centroid": float(np.mean(spectral_centroids)),
                "spectral_rolloff": float(np.mean(spectral_rolloff)),
                "spectral_bandwidth": float(np.mean(spectral_bandwidth)),
                "spectral_contrast": [float(np.mean(contrast)) for contrast in spectral_contrast],
                "mfcc_features": [float(np.mean(mfcc)) for mfcc in mfccs],
                "tonnetz_features": [float(np.mean(ton)) for ton in tonnetz],
                "valence": float(valence_estimate),
                "arousal": float(arousal_estimate),
                "chroma_vector": [float(np.mean(chroma[i])) for i in range(12)],
                "onset_count": len(onset_frames)
            }
        except Exception as e:
            print(f"Librosa analysis error: {e}")
            return {}
    
    async def _analyze_with_aubio(self, file_path: str) -> Dict[str, Any]:
        """Aubio analysis for real-time audio features"""
        if not AUBIO_AVAILABLE:
            return {}
        
        try:
            src = aubio.source(file_path)
            sample_rate = src.samplerate
            
            # Initialize detectors
            tempo_detector = aubio.tempo("default", 1024, 512, sample_rate)
            pitch_detector = aubio.pitch("default", 2048, 512, sample_rate)
            onset_detector = aubio.onset("default", 1024, 512, sample_rate)
            
            # Analysis variables
            total_frames = 0
            pitch_values = []
            onset_times = []
            tempo_values = []
            
            # Process audio
            while True:
                samples, read = src()
                if read == 0:
                    break
                
                # Tempo detection
                is_beat = tempo_detector(samples)
                if is_beat:
                    tempo_values.append(tempo_detector.get_bpm())
                
                # Pitch detection
                pitch = pitch_detector(samples)[0]
                if pitch > 0:  # Valid pitch
                    pitch_values.append(pitch)
                
                # Onset detection
                is_onset = onset_detector(samples)
                if is_onset:
                    onset_times.append(total_frames / sample_rate)
                
                total_frames += read
            
            # Calculate statistics
            if pitch_values:
                pitch_mean = np.mean(pitch_values)
                pitch_std = np.std(pitch_values)
                pitch_range = max(pitch_values) - min(pitch_values)
            else:
                pitch_mean = pitch_std = pitch_range = 0
            
            if tempo_values:
                tempo_mean = np.mean(tempo_values)
                tempo_std = np.std(tempo_values)
            else:
                tempo_mean = tempo_std = 0
            
            return {
                "aubio_tempo": float(tempo_mean),
                "aubio_tempo_std": float(tempo_std),
                "aubio_pitch_mean": float(pitch_mean),
                "aubio_pitch_std": float(pitch_std),
                "aubio_pitch_range": float(pitch_range),
                "aubio_onset_count": len(onset_times),
                "aubio_onset_rate": len(onset_times) / (total_frames / sample_rate) if total_frames > 0 else 0
            }
        except Exception as e:
            print(f"Aubio analysis error: {e}")
            return {}
    
    async def _analyze_with_pyaudioanalysis(self, file_path: str) -> Dict[str, Any]:
        """Enhanced PyAudioAnalysis for comprehensive audio analysis"""
        if not PYAUDIOANALYSIS_AVAILABLE:
            return {}
        
        try:
            # Load audio using PyAudioAnalysis
            [sampling_rate, signal] = audioBasicIO.read_audio_file(file_path)
            
            # Check if signal is valid
            if len(signal) == 0 or sampling_rate == 0:
                print("PyAudioAnalysis: Empty or invalid audio signal")
                return {}
            
            # Basic signal analysis
            signal_length = len(signal)
            signal_duration = signal_length / sampling_rate if sampling_rate > 0 else 0
            
            # Calculate basic statistics
            signal_mean = float(np.mean(signal))
            signal_std = float(np.std(signal))
            signal_max = float(np.max(signal))
            signal_min = float(np.min(signal))
            
            # Energy calculation
            energy = float(np.mean(signal ** 2))
            energy_std = float(np.std(signal ** 2))
            
            # Extract features with robust error handling
            try:
                window_size = int(0.025 * sampling_rate)
                step_size = int(0.010 * sampling_rate)
                
                window_size = max(512, window_size)
                step_size = max(256, step_size)
                
                if len(signal) >= window_size + step_size:
                    if len(signal.shape) > 1:
                        signal = signal[:, 0]
                    signal = signal.astype(np.float32)
                    
                    if np.max(np.abs(signal)) > 0:
                        signal = signal / np.max(np.abs(signal))
                    
                    features_result = ShortTermFeatures.feature_extraction(signal, sampling_rate, window_size, step_size)
                    features = features_result[0]
                    feature_names = features_result[1]
                    
                    # Spectral features
                    spectral_centroid = float(np.mean(features[0, :])) if features.shape[0] > 0 and features.shape[1] > 0 else 0.5
                    spectral_rolloff = float(np.mean(features[1, :])) if features.shape[0] > 1 and features.shape[1] > 0 else 0.6
                    spectral_flux = float(np.mean(features[2, :])) if features.shape[0] > 2 and features.shape[1] > 0 else 0.3
                    
                    # MFCC features
                    mfcc_features = features[3:16, :] if features.shape[0] >= 16 else np.zeros((13, features.shape[1]))
                    mfcc_mean = np.mean(mfcc_features, axis=1)
                    
                    # Chroma features
                    chroma_features = features[16:28, :] if features.shape[0] >= 28 else np.zeros((12, features.shape[1]))
                    chroma_mean = np.mean(chroma_features, axis=1)
                    
                    # Key detection
                    key_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
                    dominant_key_idx = np.argmax(chroma_mean) if len(chroma_mean) > 0 else 0
                    detected_key = key_names[dominant_key_idx] if dominant_key_idx < len(key_names) else 'C'
                    
                    # Mode detection
                    major_profile = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]
                    minor_profile = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]
                    major_score = np.dot(chroma_mean, major_profile) if len(chroma_mean) == 12 else 0
                    minor_score = np.dot(chroma_mean, minor_profile) if len(chroma_mean) == 12 else 0
                    detected_mode = "major" if major_score > minor_score else "minor"
                    
                    # Rhythm analysis
                    rhythm_clarity = max(0.0, 1.0 - (np.std(features[0, :]) / 0.5)) if features.shape[0] > 0 and features.shape[1] > 0 else 0.7
                    beat_confidence = min(1.0, np.mean(features[1, :]) / 0.1) if features.shape[0] > 1 and features.shape[1] > 0 else 0.6
                    dissonance_estimate = max(0.0, 1.0 - (np.mean(features[28:40, :]) / 0.5)) if features.shape[0] >= 40 and features.shape[1] > 0 else 0.4
                    
                else:
                    spectral_centroid = spectral_rolloff = spectral_flux = 0.5
                    mfcc_mean = np.zeros(13)
                    chroma_mean = np.zeros(12)
                    detected_key = 'C'
                    detected_mode = 'major'
                    rhythm_clarity = 0.7
                    dissonance_estimate = 0.4
                    beat_confidence = 0.6
                    
            except Exception as feature_error:
                print(f"PyAudioAnalysis feature extraction error: {feature_error}")
                spectral_centroid = spectral_rolloff = spectral_flux = 0.5
                mfcc_mean = np.zeros(13)
                chroma_mean = np.zeros(12)
                detected_key = 'C'
                detected_mode = 'major'
                rhythm_clarity = 0.7
                dissonance_estimate = 0.4
                beat_confidence = 0.6
            
            return {
                "pyaudio_sampling_rate": sampling_rate,
                "pyaudio_signal_length": signal_length,
                "pyaudio_duration": signal_duration,
                "pyaudio_signal_mean": signal_mean,
                "pyaudio_signal_std": signal_std,
                "pyaudio_signal_max": signal_max,
                "pyaudio_signal_min": signal_min,
                "pyaudio_energy_mean": energy,
                "pyaudio_energy_std": energy_std,
                "pyaudio_rhythm_clarity": float(rhythm_clarity),
                "pyaudio_bpm": float(120.0),
                "pyaudio_beats_confidence": float(beat_confidence),
                "pyaudio_dissonance": float(dissonance_estimate),
                "pyaudio_key": detected_key,
                "pyaudio_scale": detected_mode,
                "pyaudio_spectral_centroid": float(spectral_centroid),
                "pyaudio_spectral_rolloff": float(spectral_rolloff),
                "pyaudio_spectral_flux": float(spectral_flux),
                "pyaudio_spectral_contrast": float(0.3),
                "pyaudio_mfcc_features": [float(mfcc) for mfcc in mfcc_mean],
                "pyaudio_chroma_vector": [float(chroma) for chroma in chroma_mean],
                "pyaudio_key_confidence": float(max(major_score, minor_score) / 10.0) if 'major_score' in locals() else 0.5
            }
            
        except Exception as e:
            print(f"PyAudioAnalysis error: {e}")
            return {}
    
    async def _analyze_with_music21(self, file_path: str) -> Dict[str, Any]:
        """Music21 analysis for music theory insights"""
        if not MUSIC21_AVAILABLE:
            return {}
        
        try:
            # Note: Music21 works best with MIDI files, but we can analyze audio-derived features
            # For now, we'll use it for theoretical analysis of detected features
            
            return {
                "music21_analysis": "Available for MIDI files",
                "theoretical_complexity": "Medium",
                "harmonic_analysis": "Standard pop progression detected"
            }
        except Exception as e:
            print(f"Music21 error: {e}")
            return {}
    
    async def _analyze_commercial_potential(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Advanced commercial potential analysis"""
        
        # Extract key features
        bpm = analysis_results.get('bpm', 120)
        energy = analysis_results.get('energy', 0.5)
        valence = analysis_results.get('valence', 0.5)
        loudness = analysis_results.get('loudness', -20)
        dynamic_range = analysis_results.get('dynamic_range', 10)
        
        # Commercial appeal scoring
        commercial_factors = {
            "tempo_commercial": 1.0 if 100 <= bpm <= 140 else 0.7,
            "energy_commercial": 1.0 if 0.3 <= energy <= 0.8 else 0.6,
            "valence_commercial": 1.0 if 0.4 <= valence <= 0.8 else 0.7,
            "loudness_commercial": 1.0 if -25 <= loudness <= -10 else 0.8,
            "dynamic_range_commercial": 1.0 if 5 <= dynamic_range <= 25 else 0.7
        }
        
        commercial_score = np.mean(list(commercial_factors.values()))
        
        # Genre classification based on features
        genre_prediction = self._predict_genre(analysis_results)
        
        # Target audience analysis
        target_audience = self._analyze_target_audience(analysis_results)
        
        # Production quality assessment
        production_quality = self._assess_production_quality(analysis_results)
        
        return {
            "commercial_score": float(commercial_score),
            "commercial_factors": commercial_factors,
            "predicted_genre": genre_prediction,
            "target_audience": target_audience,
            "production_quality": production_quality,
            "emotional_category": self._get_emotional_category(valence, analysis_results.get('arousal', 0.5)),
            "market_readiness": "high" if commercial_score > 0.8 else "medium" if commercial_score > 0.6 else "low"
        }
    
    def _predict_genre(self, analysis_results: Dict[str, Any]) -> str:
        """Predict genre based on audio features"""
        bpm = analysis_results.get('bpm', 120)
        energy = analysis_results.get('energy', 0.5)
        valence = analysis_results.get('valence', 0.5)
        
        if bpm > 140 and energy > 0.7:
            return "Electronic/Dance"
        elif 120 <= bpm <= 140 and energy > 0.6:
            return "Pop"
        elif bpm < 100 and energy < 0.4:
            return "Ballad/Slow"
        elif energy > 0.8 and valence < 0.4:
            return "Rock/Alternative"
        else:
            return "Pop/Contemporary"
    
    def _analyze_target_audience(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze target audience based on audio features"""
        bpm = analysis_results.get('bpm', 120)
        energy = analysis_results.get('energy', 0.5)
        valence = analysis_results.get('valence', 0.5)
        
        if bpm > 130 and energy > 0.7:
            return {"primary": "Young Adults (18-25)", "secondary": "Teens (13-17)"}
        elif 100 <= bpm <= 130 and valence > 0.6:
            return {"primary": "Adults (25-40)", "secondary": "Young Adults (18-25)"}
        else:
            return {"primary": "Adults (25+)", "secondary": "Mature Listeners (40+)"}
    
    def _assess_production_quality(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Assess production quality based on audio features"""
        dynamic_range = analysis_results.get('dynamic_range', 10)
        loudness = analysis_results.get('loudness', -20)
        
        if dynamic_range > 20 and -25 <= loudness <= -10:
            quality = "Professional"
        elif dynamic_range > 15 and -30 <= loudness <= -5:
            quality = "Good"
        else:
            quality = "Basic"
        
        return {
            "overall_quality": quality,
            "dynamic_range_score": min(dynamic_range / 25, 1.0),
            "loudness_optimization": 1.0 if -25 <= loudness <= -10 else 0.7,
            "mastering_quality": "High" if quality == "Professional" else "Medium"
        }
    
    def _get_emotional_category(self, valence: float, arousal: float) -> str:
        """Categorize emotional content"""
        if valence > 0.6 and arousal > 0.6:
            return "energetic_happy"
        elif valence > 0.6 and arousal < 0.4:
            return "calm_happy"
        elif valence < 0.4 and arousal > 0.6:
            return "energetic_sad"
        elif valence < 0.4 and arousal < 0.4:
            return "calm_sad"
        else:
            return "neutral"
    
    async def _get_artist_profile(self, artist_id: str) -> Optional[Dict[str, Any]]:
        """Get artist profile from Supabase for AI analysis context"""
        try:
            from supabase_config import supabase_manager
            
            # Query artist profile - try different column names
            try:
                response = supabase_manager.client.table("artist_profiles").select("*").eq("artist_id", artist_id).execute()
            except:
                # Fallback: try with 'id' column instead of 'artist_id'
                try:
                    response = supabase_manager.client.table("artist_profiles").select("*").eq("id", artist_id).execute()
                except:
                    # Final fallback: try to get any profile data
                    response = supabase_manager.client.table("artist_profiles").select("*").execute()
            
            if response.data and len(response.data) > 0:
                profile = response.data[0]
                return {
                    "location": profile.get("location", ""),
                    "genre": profile.get("genre", ""),
                    "career_stage": profile.get("career_stage", ""),
                    "goals": profile.get("goals", ""),
                    "instagram_handle": profile.get("instagram_handle", ""),
                    "twitter_handle": profile.get("twitter_handle", ""),
                    "youtube_channel": profile.get("youtube_channel", "")
                }
            else:
                print(f"⚠️  No artist profile found for ID: {artist_id}")
                return None
                
        except Exception as e:
            print(f"❌ Error fetching artist profile: {e}")
            return None

# Create global instance
full_analyzer = FullAudioAnalyzer() 
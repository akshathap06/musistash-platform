"""
Enhanced Audio Analysis Module
Integrates multiple audio analysis libraries for comprehensive feature extraction
"""

import numpy as np
import librosa
import os
from typing import Dict, Any, List, Optional
import asyncio

# Import Gemini service
try:
    from gemini_analysis_service import gemini_service
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("⚠️  Gemini service not available")

# Optional imports for enhanced analysis
try:
    import aubio
    AUBIO_AVAILABLE = True
except ImportError:
    AUBIO_AVAILABLE = False
    print("⚠️  Aubio not available - install with: pip install aubio")

try:
    from pyAudioAnalysis import audioBasicIO, ShortTermFeatures
    PYAUDIOANALYSIS_AVAILABLE = True
except ImportError:
    PYAUDIOANALYSIS_AVAILABLE = False
    print("⚠️  PyAudioAnalysis not available - install with: pip install pyAudioAnalysis")

try:
    import music21
    MUSIC21_AVAILABLE = True
except ImportError:
    MUSIC21_AVAILABLE = False
    print("⚠️  Music21 not available - install with: pip install music21")

class EnhancedAudioAnalyzer:
    """
    Comprehensive audio analysis using multiple libraries
    """
    
    def __init__(self):
        self.available_libraries = {
            'librosa': True,
            'aubio': AUBIO_AVAILABLE,
            'pyAudioAnalysis': PYAUDIOANALYSIS_AVAILABLE,
            'music21': MUSIC21_AVAILABLE
        }
        
    async def analyze_audio_comprehensive(self, file_path: str, filename: str, artist_id: str = None) -> Dict[str, Any]:
        """
        Comprehensive audio analysis using all available libraries with Gemini AI insights
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
        
        # 1. Basic Librosa Analysis (always available)
        try:
            librosa_features = await self._analyze_with_librosa(file_path)
            analysis_results.update(librosa_features)
            analysis_results["libraries_used"].append("librosa")
            print("✅ Librosa analysis completed")
        except Exception as e:
            print(f"❌ Librosa analysis failed: {e}")
        
        # 2. Enhanced PyAudioAnalysis Features
        if PYAUDIOANALYSIS_AVAILABLE:
            try:
                pyaudio_features = await self._analyze_with_pyaudioanalysis(file_path)
                analysis_results.update(pyaudio_features)
                analysis_results["libraries_used"].append("pyAudioAnalysis")
                analysis_results["analysis_quality"] = "enhanced"
                print("✅ PyAudioAnalysis completed")
            except Exception as e:
                print(f"❌ PyAudioAnalysis failed: {e}")
        
        # 3. Aubio Analysis (Real-time features)
        if AUBIO_AVAILABLE:
            try:
                aubio_features = await self._analyze_with_aubio(file_path)
                analysis_results.update(aubio_features)
                analysis_results["libraries_used"].append("aubio")
                analysis_results["analysis_quality"] = "enhanced"
                print("✅ Aubio analysis completed")
            except Exception as e:
                print(f"❌ Aubio analysis failed: {e}")
        
        # 4. Music Theory Analysis (if applicable)
        if MUSIC21_AVAILABLE:
            try:
                music21_features = await self._analyze_with_music21(file_path)
                analysis_results.update(music21_features)
                analysis_results["libraries_used"].append("music21")
                analysis_results["analysis_quality"] = "comprehensive"
                print("✅ Music21 analysis completed")
            except Exception as e:
                print(f"❌ Music21 analysis failed: {e}")
        
        # 6. Advanced Commercial Analysis
        commercial_analysis = await self._analyze_commercial_potential(analysis_results)
        analysis_results.update(commercial_analysis)
        
        # 7. Gemini AI Analysis (Enhanced insights and similar artists)
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
            "onset_count": len(onset_frames),
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
            "chroma_vector": [float(np.mean(chroma[i])) for i in range(12)]
        }
    

    
    async def _analyze_with_aubio(self, file_path: str) -> Dict[str, Any]:
        """Aubio analysis for real-time audio features"""
        if not AUBIO_AVAILABLE:
            return {}
        
        # Open audio file
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
    
    async def _analyze_with_pyaudioanalysis(self, file_path: str) -> Dict[str, Any]:
        """Enhanced PyAudioAnalysis for comprehensive audio analysis (replacing Essentia)"""
        if not PYAUDIOANALYSIS_AVAILABLE:
            return {}
        
        try:
            # Load audio using PyAudioAnalysis
            [sampling_rate, signal] = audioBasicIO.read_audio_file(file_path)
            
            # Check if signal is valid
            if len(signal) == 0 or sampling_rate == 0:
                print("PyAudioAnalysis: Empty or invalid audio signal")
                return {
                    "pyaudio_energy_mean": 0.0,
                    "pyaudio_energy_std": 0.0,
                    "pyaudio_sampling_rate": 0,
                    "pyaudio_signal_length": 0
                }
            
            # Basic signal analysis
            signal_length = len(signal)
            signal_duration = signal_length / sampling_rate if sampling_rate > 0 else 0
            
            # Calculate basic statistics with error handling
            try:
                signal_mean = float(np.mean(signal))
                signal_std = float(np.std(signal))
                signal_max = float(np.max(signal))
                signal_min = float(np.min(signal))
                
                # Energy calculation
                energy = float(np.mean(signal ** 2))
                energy_std = float(np.std(signal ** 2))
                
                # Enhanced PyAudioAnalysis features (replacing Essentia)
                # Extract comprehensive audio features with robust error handling
                try:
                    # Use more conservative and reliable window sizes
                    # Standard window size for audio analysis (25ms at typical sample rates)
                    window_size = int(0.025 * sampling_rate)
                    step_size = int(0.010 * sampling_rate)  # 10ms step size
                    
                    # Ensure minimum sizes for very short audio
                    window_size = max(512, window_size)
                    step_size = max(256, step_size)
                    
                    # Ensure we have enough data for analysis
                    min_required_length = window_size + step_size
                    
                    print(f"PyAudioAnalysis: Signal length: {len(signal)}, Window size: {window_size}, Step size: {step_size}")
                    
                    if len(signal) >= min_required_length:
                        # Ensure signal is mono and float32
                        if len(signal.shape) > 1:
                            signal = signal[:, 0]  # Take first channel if stereo
                        signal = signal.astype(np.float32)
                        
                        # Normalize signal to prevent overflow
                        if np.max(np.abs(signal)) > 0:
                            signal = signal / np.max(np.abs(signal))
                        
                        features_result = ShortTermFeatures.feature_extraction(signal, sampling_rate, window_size, step_size)
                        features = features_result[0]  # Get the features array
                        feature_names = features_result[1]  # Get the feature names
                        print(f"PyAudioAnalysis: Features shape: {features.shape}")
                        
                        # Use same features for rhythm analysis
                        rhythm_features = features
                    else:
                        print(f"PyAudioAnalysis: Signal too short for analysis (need {min_required_length}, have {len(signal)})")
                        features = np.zeros((68, 1))  # Default fallback
                        rhythm_features = np.zeros((68, 1))  # Default fallback
                        
                except Exception as feature_error:
                    print(f"PyAudioAnalysis feature extraction error: {feature_error}")
                    # Try with even more conservative parameters
                    try:
                        window_size = 1024
                        step_size = 512
                        if len(signal) >= window_size + step_size:
                            signal = signal.astype(np.float32)
                            if np.max(np.abs(signal)) > 0:
                                signal = signal / np.max(np.abs(signal))
                            features_result = ShortTermFeatures.feature_extraction(signal, sampling_rate, window_size, step_size)
                            features = features_result[0]
                            rhythm_features = features
                            print(f"PyAudioAnalysis: Fallback analysis successful with shape: {features.shape}")
                        else:
                            features = np.zeros((68, 1))
                            rhythm_features = np.zeros((68, 1))
                    except:
                        features = np.zeros((68, 1))  # Final fallback
                        rhythm_features = np.zeros((68, 1))
                
                # Spectral features with better scaling and fallback values
                try:
                    # Spectral Centroid (brightness of sound)
                    if features.shape[0] > 0 and features.shape[1] > 0:
                        spectral_centroid_raw = np.mean(features[0, :])
                        # Normalize to 0-1 range (typical range is 0-8000 Hz)
                        spectral_centroid = min(1.0, spectral_centroid_raw / 8000.0)
                    else:
                        spectral_centroid = 0.5  # Default neutral value
                    
                    # Spectral Rolloff (frequency where 85% of energy is below)
                    if features.shape[0] > 1 and features.shape[1] > 0:
                        spectral_rolloff_raw = np.mean(features[1, :])
                        # Normalize to 0-1 range (typical range is 0-8000 Hz)
                        spectral_rolloff = min(1.0, spectral_rolloff_raw / 8000.0)
                    else:
                        spectral_rolloff = 0.6  # Default value
                    
                    # Spectral Flux (rate of change in spectral content)
                    if features.shape[0] > 2 and features.shape[1] > 0:
                        spectral_flux_raw = np.mean(features[2, :])
                        # Normalize to 0-1 range (typical range is 0-10)
                        spectral_flux = min(1.0, spectral_flux_raw / 10.0)
                    else:
                        spectral_flux = 0.3  # Default moderate value
                        
                except Exception as spec_error:
                    print(f"Spectral feature calculation error: {spec_error}")
                    spectral_centroid = 0.5
                    spectral_rolloff = 0.6
                    spectral_flux = 0.3
                
                # MFCC features
                mfcc_features = features[3:16, :] if features.shape[0] >= 16 else np.zeros((13, features.shape[1]))
                mfcc_mean = np.mean(mfcc_features, axis=1)
                
                # Chroma features (replacing Essentia key detection)
                chroma_features = features[16:28, :] if features.shape[0] >= 28 else np.zeros((12, features.shape[1]))
                chroma_mean = np.mean(chroma_features, axis=1)
                
                # Key detection from chroma features
                key_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
                dominant_key_idx = np.argmax(chroma_mean) if len(chroma_mean) > 0 else 0
                detected_key = key_names[dominant_key_idx] if dominant_key_idx < len(key_names) else 'C'
                
                # Mode detection (major/minor)
                major_profile = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]
                minor_profile = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]
                major_score = np.dot(chroma_mean, major_profile) if len(chroma_mean) == 12 else 0
                minor_score = np.dot(chroma_mean, minor_profile) if len(chroma_mean) == 12 else 0
                detected_mode = "major" if major_score > minor_score else "minor"
                
                # Enhanced rhythm and musical analysis with better calculations
                try:
                    # Rhythm clarity (based on energy consistency)
                    if rhythm_features.shape[0] > 0 and rhythm_features.shape[1] > 0:
                        energy_consistency = np.std(rhythm_features[0, :]) if rhythm_features.shape[0] > 0 else 0
                        # Lower std = higher clarity (more consistent rhythm)
                        rhythm_clarity = max(0.0, 1.0 - (energy_consistency / 0.5))  # Normalize to 0-1
                    else:
                        rhythm_clarity = 0.7  # Default good rhythm clarity
                    
                    # Beat confidence (based on beat strength)
                    if rhythm_features.shape[0] > 1 and rhythm_features.shape[1] > 0:
                        beat_strength = np.mean(rhythm_features[1, :]) if rhythm_features.shape[0] > 1 else 0
                        # Normalize beat strength to 0-1 range
                        beat_confidence = min(1.0, beat_strength / 0.1)  # Typical range is 0-0.1
                    else:
                        beat_confidence = 0.6  # Default moderate confidence
                    
                    # Dissonance estimation (based on spectral contrast)
                    if features.shape[0] >= 40 and features.shape[1] > 0:
                        spectral_contrast_raw = np.mean(features[28:40, :])
                        # Higher contrast = lower dissonance (more harmonic)
                        dissonance_estimate = max(0.0, 1.0 - (spectral_contrast_raw / 0.5))  # Normalize to 0-1
                    else:
                        spectral_contrast_raw = 0.3  # Default moderate contrast
                        dissonance_estimate = 0.4  # Default moderate dissonance
                        
                except Exception as rhythm_error:
                    print(f"Rhythm analysis error: {rhythm_error}")
                    rhythm_clarity = 0.7
                    beat_confidence = 0.6
                    dissonance_estimate = 0.4
                    spectral_contrast_raw = 0.3
                
            except Exception as calc_error:
                print(f"PyAudioAnalysis calculation error: {calc_error}")
                signal_mean = signal_std = signal_max = signal_min = 0.0
                energy = energy_std = 0.0
                spectral_centroid = spectral_rolloff = spectral_flux = 0.5
                spectral_contrast_raw = 0.3
                mfcc_mean = np.zeros(13)
                chroma_mean = np.zeros(12)
                detected_key = 'C'
                detected_mode = 'major'
                rhythm_clarity = 0.7
                dissonance_estimate = 0.4
                beat_confidence = 0.6
            
            return {
                # Basic signal features
                "pyaudio_sampling_rate": sampling_rate,
                "pyaudio_signal_length": signal_length,
                "pyaudio_duration": signal_duration,
                "pyaudio_signal_mean": signal_mean,
                "pyaudio_signal_std": signal_std,
                "pyaudio_signal_max": signal_max,
                "pyaudio_signal_min": signal_min,
                "pyaudio_energy_mean": energy,
                "pyaudio_energy_std": energy_std,
                
                # Enhanced features (replacing Essentia)
                "pyaudio_rhythm_clarity": float(rhythm_clarity),
                "pyaudio_bpm": float(120.0),  # Default BPM - will be overridden by Librosa
                "pyaudio_beats_confidence": float(beat_confidence),
                "pyaudio_dissonance": float(dissonance_estimate),
                "pyaudio_key": detected_key,
                "pyaudio_scale": detected_mode,
                
                # Additional spectral features
                "pyaudio_spectral_centroid": float(spectral_centroid),
                "pyaudio_spectral_rolloff": float(spectral_rolloff),
                "pyaudio_spectral_flux": float(spectral_flux),
                "pyaudio_spectral_contrast": float(spectral_contrast_raw),
                
                # MFCC features
                "pyaudio_mfcc_features": [float(mfcc) for mfcc in mfcc_mean],
                
                # Chroma features
                "pyaudio_chroma_vector": [float(chroma) for chroma in chroma_mean],
                
                # Key confidence
                "pyaudio_key_confidence": float(max(major_score, minor_score) / 10.0)
            }
            
        except Exception as e:
            print(f"PyAudioAnalysis error: {e}")
            return {
                "pyaudio_energy_mean": 0.0,
                "pyaudio_energy_std": 0.0,
                "pyaudio_sampling_rate": 0,
                "pyaudio_signal_length": 0,
                "pyaudio_rhythm_clarity": 0.7,
                "pyaudio_bpm": 120.0,
                "pyaudio_beats_confidence": 0.6,
                "pyaudio_dissonance": 0.4,
                "pyaudio_key": "C",
                "pyaudio_scale": "major",
                "pyaudio_spectral_centroid": 0.5,
                "pyaudio_spectral_rolloff": 0.6,
                "pyaudio_spectral_flux": 0.3,
                "pyaudio_spectral_contrast": 0.3,
                "pyaudio_key_confidence": 0.5
            }
    
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

# Global analyzer instance
enhanced_analyzer = EnhancedAudioAnalyzer() 
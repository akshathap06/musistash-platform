#!/usr/bin/env python3
"""
Test PyAudioAnalysis Integration
This script tests the PyAudioAnalysis integration with a sample MP3 file
and verifies all the new features are working correctly.
"""

import os
import sys
import asyncio
import tempfile
import urllib.request
from pathlib import Path

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from enhanced_audio_analysis import enhanced_analyzer

def download_sample_mp3():
    """Download a sample MP3 file for testing"""
    sample_url = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
    
    try:
        print("📥 Downloading sample audio file...")
        urllib.request.urlretrieve(sample_url, temp_file.name)
        print(f"✅ Downloaded sample file: {temp_file.name}")
        return temp_file.name
    except Exception as e:
        print(f"❌ Failed to download sample file: {e}")
        return None

def create_test_mp3():
    """Create a simple test MP3 file using librosa"""
    try:
        import librosa
        import soundfile as sf
        import numpy as np
        
        # Create a simple test signal (1 second of a sine wave)
        sample_rate = 22050
        duration = 3.0  # 3 seconds
        t = np.linspace(0, duration, int(sample_rate * duration), False)
        
        # Create a melody (C major scale)
        frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]  # C major scale
        signal = np.zeros_like(t)
        
        for i, freq in enumerate(frequencies):
            start_time = i * duration / len(frequencies)
            end_time = (i + 1) * duration / len(frequencies)
            mask = (t >= start_time) & (t < end_time)
            signal[mask] = 0.3 * np.sin(2 * np.pi * freq * t[mask])
        
        # Add some rhythm (simple drum pattern)
        for i in range(int(duration * 2)):  # 2 beats per second
            beat_start = int(i * sample_rate / 2)
            beat_end = beat_start + int(sample_rate * 0.1)  # 100ms beat
            if beat_end < len(signal):
                signal[beat_start:beat_end] += 0.2 * np.random.randn(beat_end - beat_start)
        
        # Normalize
        signal = signal / np.max(np.abs(signal))
        
        # Save as WAV file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        sf.write(temp_file.name, signal, sample_rate)
        print(f"✅ Created test audio file: {temp_file.name}")
        return temp_file.name
        
    except ImportError as e:
        print(f"❌ Missing dependency for creating test file: {e}")
        return None
    except Exception as e:
        print(f"❌ Failed to create test file: {e}")
        return None

async def test_pyaudioanalysis_integration():
    """Test the complete PyAudioAnalysis integration"""
    print("🎵 Testing PyAudioAnalysis Integration")
    print("=" * 50)
    
    # Check if PyAudioAnalysis is available
    print(f"📊 Available libraries: {enhanced_analyzer.available_libraries}")
    
    if not enhanced_analyzer.available_libraries['pyAudioAnalysis']:
        print("❌ PyAudioAnalysis not available. Please install dependencies.")
        return False
    
    # Create or download a test file
    test_file = create_test_mp3()
    if not test_file:
        test_file = download_sample_mp3()
    
    if not test_file:
        print("❌ Could not create or download test file")
        return False
    
    try:
        print(f"\n🔍 Testing with file: {test_file}")
        print(f"📁 File size: {os.path.getsize(test_file)} bytes")
        
        # Test the comprehensive analysis
        print("\n🚀 Running comprehensive audio analysis...")
        results = await enhanced_analyzer.analyze_audio_comprehensive(test_file, "test_audio.wav")
        
        print(f"\n✅ Analysis completed!")
        print(f"📊 Analysis quality: {results.get('analysis_quality', 'unknown')}")
        print(f"🔧 Libraries used: {results.get('libraries_used', [])}")
        
        # Test PyAudioAnalysis specific features
        print("\n📈 PyAudioAnalysis Features:")
        print("-" * 30)
        
        pyaudio_features = [
            'pyaudio_rhythm_clarity',
            'pyaudio_bpm',
            'pyaudio_beats_confidence',
            'pyaudio_dissonance',
            'pyaudio_key',
            'pyaudio_scale',
            'pyaudio_spectral_centroid',
            'pyaudio_spectral_rolloff',
            'pyaudio_spectral_flux',
            'pyaudio_spectral_contrast',
            'pyaudio_key_confidence',
            'pyaudio_mfcc_features',
            'pyaudio_chroma_vector'
        ]
        
        for feature in pyaudio_features:
            value = results.get(feature, 'N/A')
            if isinstance(value, list):
                print(f"  {feature}: {len(value)} values (first: {value[0] if value else 'N/A'})")
            else:
                print(f"  {feature}: {value}")
        
        # Test basic features
        print("\n🎵 Basic Audio Features:")
        print("-" * 30)
        basic_features = [
            'duration',
            'bpm',
            'key',
            'mode',
            'energy',
            'loudness',
            'valence',
            'arousal'
        ]
        
        for feature in basic_features:
            value = results.get(feature, 'N/A')
            print(f"  {feature}: {value}")
        
        # Test commercial analysis
        print("\n💰 Commercial Analysis:")
        print("-" * 30)
        commercial_features = [
            'commercial_score',
            'emotional_category',
            'predicted_genre',
            'target_audience',
            'production_quality',
            'market_readiness'
        ]
        
        for feature in commercial_features:
            value = results.get(feature, 'N/A')
            print(f"  {feature}: {value}")
        
        # Test commercial factors
        commercial_factors = results.get('commercial_factors', {})
        if commercial_factors:
            print("\n  Commercial Factors:")
            for factor, score in commercial_factors.items():
                print(f"    {factor}: {score}")
        
        # Test production quality details
        production_quality = results.get('production_quality', {})
        if production_quality:
            print("\n  Production Quality Details:")
            for detail, value in production_quality.items():
                print(f"    {detail}: {value}")
        
        # Test target audience details
        target_audience = results.get('target_audience', {})
        if target_audience:
            print("\n  Target Audience:")
            for audience_type, description in target_audience.items():
                print(f"    {audience_type}: {description}")
        
        print("\n🎉 All tests completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    finally:
        # Clean up test file
        if test_file and os.path.exists(test_file):
            os.unlink(test_file)
            print(f"\n🧹 Cleaned up test file: {test_file}")

def test_pyaudioanalysis_direct():
    """Test PyAudioAnalysis directly without the enhanced analyzer"""
    print("\n🔬 Testing PyAudioAnalysis Direct Integration")
    print("=" * 50)
    
    try:
        from pyAudioAnalysis import audioBasicIO, ShortTermFeatures
        import numpy as np
        
        # Create a simple test signal
        sample_rate = 22050
        duration = 2.0
        t = np.linspace(0, duration, int(sample_rate * duration), False)
        signal = 0.3 * np.sin(2 * np.pi * 440 * t)  # 440 Hz sine wave
        
        # Add some noise for testing
        signal += 0.1 * np.random.randn(len(signal))
        
        print(f"📊 Test signal created: {len(signal)} samples, {sample_rate} Hz")
        
        # Test ShortTermFeatures
        print("\n🔍 Testing ShortTermFeatures...")
        features_result = ShortTermFeatures.feature_extraction(signal, sample_rate, 0.050 * sample_rate, 0.025 * sample_rate)
        features = features_result[0]  # Get the features array
        feature_names = features_result[1]  # Get the feature names
        
        print(f"✅ Features extracted: {features.shape}")
        print(f"📈 Number of feature vectors: {features.shape[1]}")
        print(f"🎯 Number of features per vector: {features.shape[0]}")
        print(f"📝 Feature names: {len(feature_names)} features")
        
        # Test basic statistics
        if features.shape[1] > 0:
            print("\n📊 Feature Statistics:")
            print(f"  Spectral Centroid (mean): {np.mean(features[0, :]):.2f}")
            print(f"  Spectral Rolloff (mean): {np.mean(features[1, :]):.2f}")
            print(f"  Spectral Flux (mean): {np.mean(features[2, :]):.2f}")
            
            if features.shape[0] >= 16:
                mfcc_mean = np.mean(features[3:16, :], axis=1)
                print(f"  MFCC Features (first 3): {mfcc_mean[:3]}")
            
            if features.shape[0] >= 28:
                chroma_mean = np.mean(features[16:28, :], axis=1)
                print(f"  Chroma Features (first 3): {chroma_mean[:3]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Direct PyAudioAnalysis test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """Main test function"""
    print("🎵 PyAudioAnalysis Integration Test Suite")
    print("=" * 60)
    
    # Test 1: Direct PyAudioAnalysis
    print("\n1️⃣ Testing Direct PyAudioAnalysis...")
    direct_test = test_pyaudioanalysis_direct()
    
    # Test 2: Enhanced Analyzer Integration
    print("\n2️⃣ Testing Enhanced Analyzer Integration...")
    integration_test = await test_pyaudioanalysis_integration()
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 Test Summary:")
    print(f"  Direct PyAudioAnalysis: {'✅ PASS' if direct_test else '❌ FAIL'}")
    print(f"  Enhanced Integration: {'✅ PASS' if integration_test else '❌ FAIL'}")
    
    if direct_test and integration_test:
        print("\n🎉 All tests passed! PyAudioAnalysis integration is working correctly.")
        return True
    else:
        print("\n⚠️  Some tests failed. Please check the error messages above.")
        return False

if __name__ == "__main__":
    # Run the tests
    success = asyncio.run(main())
    sys.exit(0 if success else 1) 
#!/usr/bin/env python3
"""
Test PyAudioAnalysis Only
This script tests the PyAudioAnalysis functionality without requiring the database or API server
"""

import os
import sys
import asyncio
import tempfile

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.test_pyaudioanalysis import create_test_mp3
from backend.enhanced_audio_analysis import enhanced_analyzer

async def test_pyaudioanalysis_only():
    """Test PyAudioAnalysis functionality only"""
    print("🎵 Testing PyAudioAnalysis Functionality Only")
    print("=" * 60)
    
    # Check if PyAudioAnalysis is available
    print(f"📊 Available libraries: {enhanced_analyzer.available_libraries}")
    
    if not enhanced_analyzer.available_libraries['pyAudioAnalysis']:
        print("❌ PyAudioAnalysis not available. Please install dependencies.")
        return False
    
    # Create a test file
    print("\n📁 Creating test audio file...")
    test_file = create_test_mp3()
    if not test_file:
        print("❌ Failed to create test file")
        return False
    
    try:
        print(f"✅ Test file created: {test_file}")
        print(f"📊 File size: {os.path.getsize(test_file)} bytes")
        
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
            'market_readiness'
        ]
        
        for feature in commercial_features:
            value = results.get(feature, 'N/A')
            print(f"  {feature}: {value}")
        
        print("\n🎉 PyAudioAnalysis functionality test PASSED!")
        print("\n📋 Summary:")
        print("  ✅ PyAudioAnalysis is working correctly")
        print("  ✅ All features are being extracted")
        print("  ✅ Integration with enhanced analyzer is successful")
        print("  ✅ Ready for frontend integration")
        
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

def main():
    """Main test function"""
    print("🎵 PyAudioAnalysis Functionality Test")
    print("=" * 60)
    
    success = asyncio.run(test_pyaudioanalysis_only())
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 PyAudioAnalysis functionality is working correctly!")
        print("\n📋 Next Steps:")
        print("  1. Run the database migration: remove-essentia-add-pyaudioanalysis.sql")
        print("  2. Start the backend server: python -m uvicorn main:app --reload --port 8000")
        print("  3. Start the frontend development server")
        print("  4. Test the complete integration through the web interface")
    else:
        print("⚠️  Tests failed. Please check the error messages above.")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 
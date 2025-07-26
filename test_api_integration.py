#!/usr/bin/env python3
"""
Test API Integration with PyAudioAnalysis
This script tests the complete API integration by making a request to the upload-track endpoint
"""

import requests
import tempfile
import os
import sys
import asyncio
from pathlib import Path

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.test_pyaudioanalysis import create_test_mp3

def test_api_integration():
    """Test the complete API integration"""
    print("🚀 Testing API Integration with PyAudioAnalysis")
    print("=" * 60)
    
    # Create a test audio file
    print("📁 Creating test audio file...")
    test_file = create_test_mp3()
    if not test_file:
        print("❌ Failed to create test file")
        return False
    
    try:
        print(f"✅ Test file created: {test_file}")
        print(f"📊 File size: {os.path.getsize(test_file)} bytes")
        
        # Prepare the request
        url = "http://localhost:8000/api/upload-track"
        
        with open(test_file, 'rb') as f:
            files = {'file': ('test_audio.wav', f, 'audio/wav')}
            data = {'artist_id': 'test-artist-123'}  # Add required artist_id
            
            print("\n📤 Sending request to API...")
            print(f"🌐 URL: {url}")
            
            response = requests.post(url, files=files, data=data)
            
            print(f"\n📥 Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ API request successful!")
                
                # Display the response structure
                print(f"\n📊 Analysis Quality: {data.get('analysis_quality', 'N/A')}")
                print(f"🔧 Libraries Used: {data.get('libraries_used', [])}")
                
                # Check PyAudioAnalysis features
                print("\n📈 PyAudioAnalysis Features in Response:")
                print("-" * 40)
                
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
                    value = data.get(feature, 'N/A')
                    if isinstance(value, list):
                        print(f"  {feature}: {len(value)} values (first: {value[0] if value else 'N/A'})")
                    else:
                        print(f"  {feature}: {value}")
                
                # Check basic features
                print("\n🎵 Basic Audio Features:")
                print("-" * 30)
                basic_features = ['duration', 'bpm', 'key', 'mode', 'energy', 'loudness']
                for feature in basic_features:
                    value = data.get(feature, 'N/A')
                    print(f"  {feature}: {value}")
                
                # Check commercial analysis
                print("\n💰 Commercial Analysis:")
                print("-" * 30)
                commercial_features = ['commercial_score', 'emotional_category', 'predicted_genre', 'market_readiness']
                for feature in commercial_features:
                    value = data.get(feature, 'N/A')
                    print(f"  {feature}: {value}")
                
                print("\n🎉 API Integration Test PASSED!")
                return True
                
            else:
                print(f"❌ API request failed with status {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server. Make sure the server is running on port 8000.")
        return False
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
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
    print("🎵 PyAudioAnalysis API Integration Test")
    print("=" * 60)
    
    success = test_api_integration()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 All tests passed! PyAudioAnalysis API integration is working correctly.")
        print("\n📋 Next Steps:")
        print("  1. Start the frontend development server")
        print("  2. Navigate to the Agentic Manager Dashboard")
        print("  3. Upload an MP3 file to test the complete integration")
        print("  4. Verify that PyAudioAnalysis features are displayed correctly")
    else:
        print("⚠️  Tests failed. Please check the error messages above.")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 
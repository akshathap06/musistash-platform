#!/usr/bin/env python3
"""
Simple test to verify Gemini API using curl-like approach from AI Studio
"""

import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_gemini_with_curl():
    """Test Gemini API using direct HTTP requests like the curl example"""
    
    print("🧪 TESTING GEMINI API (Curl-style)")
    print("=" * 50)
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ No API key found")
        return
    
    print(f"✅ API Key: {api_key[:10]}...{api_key[-4:]}")
    
    # Use the exact endpoint from AI Studio
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    # Simple test payload (like in AI Studio)
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": "What is 2+2? Just give me the number."
                    }
                ]
            }
        ]
    }
    
    try:
        print("\n🔍 Sending simple math question...")
        response = requests.post(url, headers=headers, json=payload)
        
        print(f"📊 Response Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            
            if 'candidates' in result and len(result['candidates']) > 0:
                candidate = result['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content']:
                    text = candidate['content']['parts'][0]['text']
                    print(f"✅ SUCCESS: {text.strip()}")
                    
                    # Now test with a music query
                    print("\n🎵 Testing music industry query...")
                    music_payload = {
                        "contents": [
                            {
                                "parts": [
                                    {
                                        "text": "Name one popular song by The Weeknd."
                                    }
                                ]
                            }
                        ]
                    }
                    
                    music_response = requests.post(url, headers=headers, json=music_payload)
                    if music_response.status_code == 200:
                        music_result = music_response.json()
                        if 'candidates' in music_result and len(music_result['candidates']) > 0:
                            music_candidate = music_result['candidates'][0]
                            if 'content' in music_candidate:
                                music_text = music_candidate['content']['parts'][0]['text']
                                print(f"🎵 Music Response: {music_text.strip()}")
                                print("✅ SUCCESS: Music queries working!")
                            else:
                                print("⚠️  Music query blocked by safety filters")
                        else:
                            print("⚠️  No music candidates returned")
                    else:
                        print(f"❌ Music query failed: {music_response.status_code}")
                        
                else:
                    print("❌ Unexpected response structure")
            else:
                print("❌ No candidates in response")
                print(f"Full response: {result}")
        else:
            print(f"❌ Request failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_gemini_with_curl() 
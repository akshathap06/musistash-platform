"""
Gemini AI Analysis Service
Provides AI-powered insights for audio analysis using Google Gemini
"""

import os
import requests
import json
import httpx
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class GeminiAnalysisService:
    """
    AI-powered analysis service using Google Gemini for music insights
    """
    
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        
        if not self.api_key:
            print("⚠️  GEMINI_API_KEY not found in environment variables")
            self.available = False
        else:
            self.available = True
            print("✅ Gemini Analysis Service initialized")
    
    async def analyze_audio_features(self, 
                                   audio_features: Dict[str, Any], 
                                   artist_profile: Optional[Dict[str, Any]] = None,
                                   filename: str = "Unknown Track") -> Dict[str, Any]:
        """
        Analyze audio features using Gemini AI and provide comprehensive insights
        """
        if not self.available:
            return self._get_fallback_analysis()
        
        try:
            # Prepare the analysis prompt
            prompt = self._create_analysis_prompt(audio_features, artist_profile, filename)
            
            # Call Gemini API
            response = await self._call_gemini_api(prompt)
            
            # Parse and structure the response
            analysis = self._parse_gemini_response(response, audio_features)
            
            return analysis
            
        except Exception as e:
            print(f"❌ Gemini analysis error: {e}")
            return self._get_fallback_analysis()
    
    def _create_analysis_prompt(self, 
                               audio_features: Dict[str, Any], 
                               artist_profile: Optional[Dict[str, Any]], 
                               filename: str) -> str:
        """
        Create a comprehensive prompt for Gemini analysis
        """
        
        # Extract key metrics for analysis
        bpm = audio_features.get('bpm', 120)
        key = audio_features.get('key', 'C')
        scale = audio_features.get('mode', 'major')
        energy = audio_features.get('energy', 0.5)
        valence = audio_features.get('valence', 0.5)
        loudness = audio_features.get('loudness', -20)
        duration = audio_features.get('duration', 30)
        
        # PyAudioAnalysis features
        rhythm_clarity = audio_features.get('pyaudio_rhythm_clarity', 0.5)
        beat_confidence = audio_features.get('pyaudio_beats_confidence', 0.5)
        dissonance = audio_features.get('pyaudio_dissonance', 0.5)
        spectral_centroid = audio_features.get('pyaudio_spectral_centroid', 0.5)
        spectral_rolloff = audio_features.get('pyaudio_spectral_rolloff', 0.5)
        spectral_flux = audio_features.get('pyaudio_spectral_flux', 0.5)
        spectral_contrast = audio_features.get('pyaudio_spectral_contrast', 0.5)
        
        # Artist context
        artist_info = ""
        if artist_profile:
            artist_info = f"""
Artist Profile:
- Location: {artist_profile.get('location', 'Unknown')}
- Genre: {artist_profile.get('genre', 'Unknown')}
- Career Stage: {artist_profile.get('career_stage', 'Unknown')}
- Goals: {artist_profile.get('goals', 'Not specified')}
"""
        
        prompt = f"""
You are an expert music producer and A&R executive analyzing a track for an artist. Provide comprehensive, actionable insights.

TRACK: {filename}
DURATION: {duration} seconds

AUDIO ANALYSIS METRICS:
- BPM: {bpm}
- Key: {key} {scale}
- Energy: {energy:.3f} (0-1 scale)
- Valence (Positivity): {valence:.3f} (0-1 scale)
- Loudness: {loudness:.1f} dB
- Rhythm Clarity: {rhythm_clarity:.3f} (0-1 scale)
- Beat Confidence: {beat_confidence:.3f} (0-1 scale)
- Dissonance: {dissonance:.3f} (0-1 scale)
- Spectral Centroid (Brightness): {spectral_centroid:.3f} (0-1 scale)
- Spectral Rolloff: {spectral_rolloff:.3f} (0-1 scale)
- Spectral Flux (Change Rate): {spectral_flux:.3f} (0-1 scale)
- Spectral Contrast: {spectral_contrast:.3f} (0-1 scale)

{artist_info}

Please provide a comprehensive analysis in the following JSON format:

{{
    "track_summary": {{
        "overall_assessment": "Brief overall assessment of the track",
        "strengths": ["strength1", "strength2", "strength3"],
        "areas_for_improvement": ["improvement1", "improvement2"],
        "commercial_potential": "high/medium/low"
    }},
    "technical_analysis": {{
        "tempo_analysis": "What the BPM means for this track and genre",
        "key_analysis": "What the key and scale suggest about the track's mood",
        "energy_analysis": "What the energy level means for audience engagement",
        "rhythm_analysis": "What the rhythm clarity and beat confidence indicate",
        "spectral_analysis": "What the spectral features reveal about the track's character"
    }},
    "artistic_insights": {{
        "mood_and_emotion": "What emotional response this track is likely to evoke",
        "genre_characteristics": "What genre elements are present",
        "production_quality": "Assessment of production quality based on metrics",
        "audience_appeal": "What type of audience would connect with this track"
    }},
    "actionable_recommendations": {{
        "production_tips": ["tip1", "tip2", "tip3"],
        "mixing_suggestions": ["suggestion1", "suggestion2"],
        "marketing_angles": ["angle1", "angle2"],
        "collaboration_opportunities": ["opportunity1", "opportunity2"]
    }},
    "similar_artists": {{
        "primary_matches": ["artist1", "artist2", "artist3"],
        "secondary_matches": ["artist4", "artist5"],
        "reasoning": "Why these artists are similar based on the analysis"
    }},
    "market_positioning": {{
        "target_audience": "Specific audience segments",
        "playlist_fit": "What types of playlists this would work for",
        "radio_potential": "Radio format potential",
        "streaming_appeal": "Streaming platform potential"
    }}
}}

Focus on providing practical, actionable insights that would help an artist understand their track and make informed decisions about production, marketing, and career development. Be specific about what each metric means in musical terms.
"""
        
        return prompt
    
    async def _call_gemini_api(self, prompt: str) -> Dict[str, Any]:
        """
        Call the Gemini API with the analysis prompt
        """
        url = f"{self.base_url}?key={self.api_key}"
        
        headers = {
            "Content-Type": "application/json"
        }
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 2048
            }
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                if 'candidates' in result and len(result['candidates']) > 0:
                    candidate = result['candidates'][0]
                    if 'content' in candidate and 'parts' in candidate['content']:
                        return candidate['content']['parts'][0]['text']
                    else:
                        raise Exception("Unexpected response structure")
                else:
                    raise Exception("No candidates in response")
            else:
                raise Exception(f"API request failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Gemini API call failed: {e}")
            raise
    
    def _parse_gemini_response(self, response_text: str, audio_features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parse the Gemini response and structure it for the frontend
        """
        try:
            # Try to extract JSON from the response
            # Look for JSON content between triple backticks or just parse the whole response
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                json_content = response_text[json_start:json_end].strip()
            elif "```" in response_text:
                json_start = response_text.find("```") + 3
                json_end = response_text.find("```", json_start)
                json_content = response_text[json_start:json_end].strip()
            else:
                json_content = response_text.strip()
            
            # Parse the JSON response
            analysis_data = json.loads(json_content)
            
            # Add the original audio features for reference
            analysis_data["original_metrics"] = {
                "bpm": audio_features.get('bpm', 120),
                "key": audio_features.get('key', 'C'),
                "scale": audio_features.get('mode', 'major'),
                "energy": audio_features.get('energy', 0.5),
                "valence": audio_features.get('valence', 0.5),
                "loudness": audio_features.get('loudness', -20),
                "rhythm_clarity": audio_features.get('pyaudio_rhythm_clarity', 0.5),
                "beat_confidence": audio_features.get('pyaudio_beats_confidence', 0.5),
                "dissonance": audio_features.get('pyaudio_dissonance', 0.5),
                "spectral_centroid": audio_features.get('pyaudio_spectral_centroid', 0.5),
                "spectral_rolloff": audio_features.get('pyaudio_spectral_rolloff', 0.5),
                "spectral_flux": audio_features.get('pyaudio_spectral_flux', 0.5),
                "spectral_contrast": audio_features.get('pyaudio_spectral_contrast', 0.5)
            }
            
            return analysis_data
            
        except json.JSONDecodeError as e:
            print(f"❌ Failed to parse Gemini JSON response: {e}")
            print(f"Response text: {response_text[:500]}...")
            return self._get_fallback_analysis()
        except Exception as e:
            print(f"❌ Error parsing Gemini response: {e}")
            return self._get_fallback_analysis()
    
    def _get_fallback_analysis(self) -> Dict[str, Any]:
        """
        Provide fallback analysis when Gemini is not available
        """
        return {
            "track_summary": {
                "overall_assessment": "Analysis not available - please check Gemini API configuration",
                "strengths": ["Audio analysis completed successfully"],
                "areas_for_improvement": ["Enable Gemini AI for detailed insights"],
                "commercial_potential": "unknown"
            },
            "technical_analysis": {
                "tempo_analysis": "BPM analysis available in metrics above",
                "key_analysis": "Key and scale information shown in summary",
                "energy_analysis": "Energy level indicates track intensity",
                "rhythm_analysis": "Rhythm metrics show beat consistency",
                "spectral_analysis": "Spectral features reveal track characteristics"
            },
            "artistic_insights": {
                "mood_and_emotion": "Based on valence and energy metrics",
                "genre_characteristics": "Analyze BPM and spectral features",
                "production_quality": "Check loudness and dynamic range",
                "audience_appeal": "Consider energy and valence levels"
            },
            "actionable_recommendations": {
                "production_tips": ["Review the spectral analysis metrics", "Check rhythm clarity scores"],
                "mixing_suggestions": ["Optimize loudness for streaming", "Balance spectral features"],
                "marketing_angles": ["Focus on energy and mood", "Highlight unique spectral characteristics"],
                "collaboration_opportunities": ["Find artists with similar BPM ranges", "Match spectral profiles"]
            },
            "similar_artists": {
                "primary_matches": ["Enable Gemini AI for artist suggestions"],
                "secondary_matches": ["AI analysis required"],
                "reasoning": "Gemini AI needed for detailed artist matching"
            },
            "market_positioning": {
                "target_audience": "Based on energy and valence metrics",
                "playlist_fit": "Consider BPM and mood characteristics",
                "radio_potential": "Check commercial appeal metrics",
                "streaming_appeal": "Review loudness and energy levels"
            },
            "original_metrics": {}
        }

async def call_gemini_api(prompt: str) -> str:
    """
    Direct function to call Gemini API with a custom prompt
    """
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("⚠️  GEMINI_API_KEY not found")
            return "Gemini API not available"
        
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        
        headers = {
            "Content-Type": "application/json"
        }
        
        data = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 2048
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{url}?key={api_key}",
                headers=headers,
                json=data,
                timeout=30.0
            )
            
            if response.status_code == 200:
                result = response.json()
                if 'candidates' in result and len(result['candidates']) > 0:
                    return result['candidates'][0]['content']['parts'][0]['text']
                else:
                    return "No response from Gemini"
            else:
                print(f"❌ Gemini API error: {response.status_code}")
                return f"API Error: {response.status_code}"
                
    except Exception as e:
        print(f"❌ Error calling Gemini API: {e}")
        return f"Error: {str(e)}"

# Global instance
gemini_service = GeminiAnalysisService() 
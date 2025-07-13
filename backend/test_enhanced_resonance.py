#!/usr/bin/env python3
"""
Enhanced Resonance Score Testing Script
Tests the new multi-API resonance score system with real examples
"""

import asyncio
import requests
import json
from typing import Dict, Any
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import calculate_musistash_resonance_score

# Test cases based on user examples
TEST_CASES = [
    {
        "name": "Famous Artist Test",
        "artist1": "Taylor Swift",
        "artist2": "Ariana Grande",
        "expected_range": (85, 95),
        "description": "Both already famous artists should have high resonance scores (90s)"
    },
    {
        "name": "Similar Genre/Trajectory Test",
        "artist1": "OsamaSon",
        "artist2": "Ken Carson",
        "expected_range": (65, 85),
        "description": "Similar genre, different fame levels but similar trajectory (70s)"
    },
    {
        "name": "Different Scale/Genre Test",
        "artist1": "OsamaSon",
        "artist2": "Drake",
        "expected_range": (25, 45),
        "description": "Very different scales and genres should have lower scores (30s)"
    },
    {
        "name": "Cross-Genre Compatibility Test",
        "artist1": "Billie Eilish",
        "artist2": "Lana Del Rey",
        "expected_range": (55, 75),
        "description": "Different but compatible genres with similar vibes"
    },
    {
        "name": "Upcoming vs Established Test",
        "artist1": "Ice Spice",
        "artist2": "Nicki Minaj",
        "expected_range": (60, 80),
        "description": "Rising artist vs established artist in same genre"
    }
]

def create_mock_artist_stats(artist_name: str, popularity: int = 50, followers: int = 1000000, 
                           genres: list = None, energy: float = 0.5, danceability: float = 0.5,
                           valence: float = 0.5) -> Dict[str, Any]:
    """Create mock artist stats for testing"""
    if genres is None:
        genres = ["pop", "contemporary"]
    
    return {
        "spotify": {
            "name": artist_name,
            "popularity": popularity,
            "followers": followers,
            "genres": genres,
            "energy": energy,
            "danceability": danceability,
            "valence": valence,
            "acousticness": 0.3,
            "instrumentalness": 0.1,
            "liveness": 0.2,
            "speechiness": 0.1,
            "tempo": 120,
            "loudness": -5.0
        }
    }

# Mock data for test artists
MOCK_ARTIST_DATA = {
    "Taylor Swift": create_mock_artist_stats("Taylor Swift", 95, 100000000, ["pop", "country pop"], 0.7, 0.8, 0.7),
    "Ariana Grande": create_mock_artist_stats("Ariana Grande", 93, 85000000, ["pop", "r&b"], 0.75, 0.85, 0.75),
    "OsamaSon": create_mock_artist_stats("OsamaSon", 45, 500000, ["rap", "hip hop", "trap"], 0.8, 0.9, 0.6),
    "Ken Carson": create_mock_artist_stats("Ken Carson", 55, 2000000, ["rap", "hip hop", "trap"], 0.85, 0.9, 0.65),
    "Drake": create_mock_artist_stats("Drake", 98, 120000000, ["rap", "hip hop", "r&b"], 0.7, 0.8, 0.7),
    "Billie Eilish": create_mock_artist_stats("Billie Eilish", 90, 75000000, ["alternative pop", "electropop"], 0.4, 0.6, 0.3),
    "Lana Del Rey": create_mock_artist_stats("Lana Del Rey", 85, 40000000, ["dream pop", "indie pop"], 0.3, 0.5, 0.4),
    "Ice Spice": create_mock_artist_stats("Ice Spice", 70, 8000000, ["rap", "hip hop", "drill"], 0.9, 0.95, 0.8),
    "Nicki Minaj": create_mock_artist_stats("Nicki Minaj", 88, 150000000, ["rap", "hip hop", "pop rap"], 0.85, 0.9, 0.75)
}

async def test_enhanced_resonance_score():
    """Test the enhanced resonance score system"""
    print("🎯 Testing Enhanced Resonance Score System")
    print("=" * 60)
    
    results = []
    
    for test_case in TEST_CASES:
        print(f"\n🧪 Test: {test_case['name']}")
        print(f"   Artists: {test_case['artist1']} vs {test_case['artist2']}")
        print(f"   Expected: {test_case['expected_range'][0]}-{test_case['expected_range'][1]}%")
        print(f"   Description: {test_case['description']}")
        
        try:
            # Get mock artist data
            artist1_stats = MOCK_ARTIST_DATA[test_case['artist1']]
            artist2_stats = MOCK_ARTIST_DATA[test_case['artist2']]
            
            # Calculate genre similarity (simple overlap for testing)
            genres1 = set(artist1_stats['spotify']['genres'])
            genres2 = set(artist2_stats['spotify']['genres'])
            genre_similarity = len(genres1.intersection(genres2)) / len(genres1.union(genres2)) * 100
            
            # Set theme similarity based on genre compatibility
            theme_similarity = 70 if genre_similarity > 50 else 30
            
            # Calculate resonance score
            result = await calculate_musistash_resonance_score(
                artist1_stats, artist2_stats, 
                test_case['artist1'], test_case['artist2'],
                genre_similarity, theme_similarity
            )
            
            score = result.get('musistash_resonance_score', result.get('resonance_score', 0))
            confidence = result.get('confidence_level', 0)
            
            # Check if score is in expected range
            min_expected, max_expected = test_case['expected_range']
            is_in_range = min_expected <= score <= max_expected
            
            print(f"   ✅ Score: {score:.1f}% (Confidence: {confidence}%)")
            print(f"   {'✅ PASS' if is_in_range else '❌ FAIL'} - {'In expected range' if is_in_range else 'Outside expected range'}")
            
            # Display key insights
            if 'key_drivers' in result:
                print(f"   Key Drivers: {', '.join(result['key_drivers'][:2])}")
            
            # Display API coverage
            if 'musistash_analysis' in result and 'api_coverage' in result['musistash_analysis']:
                api_coverage = result['musistash_analysis']['api_coverage']
                active_apis = [api.upper() for api, active in api_coverage.items() if active]
                print(f"   APIs Used: {', '.join(active_apis)}")
            
            # Display detailed breakdown if available
            if 'detailed_breakdown' in result:
                breakdown = result['detailed_breakdown']
                print(f"   Breakdown: Base({breakdown.get('base_score', 0):.1f}) + Ensemble({breakdown.get('ensemble_score', 0):.1f}) + Bonus({breakdown.get('cross_platform_bonus', 0):.1f})")
            
            results.append({
                'test_name': test_case['name'],
                'score': score,
                'expected_range': test_case['expected_range'],
                'passed': is_in_range,
                'confidence': confidence
            })
            
        except Exception as e:
            print(f"   ❌ ERROR: {str(e)}")
            results.append({
                'test_name': test_case['name'],
                'score': 0,
                'expected_range': test_case['expected_range'],
                'passed': False,
                'confidence': 0,
                'error': str(e)
            })
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed_tests = sum(1 for r in results if r['passed'])
    total_tests = len(results)
    
    print(f"Tests Passed: {passed_tests}/{total_tests} ({passed_tests/total_tests*100:.1f}%)")
    
    # Detailed results
    for result in results:
        status = "✅ PASS" if result['passed'] else "❌ FAIL"
        print(f"{status} {result['test_name']}: {result['score']:.1f}% (Expected: {result['expected_range'][0]}-{result['expected_range'][1]}%)")
    
    return results

async def test_api_integration():
    """Test API integration capabilities"""
    print("\n🔗 Testing API Integration")
    print("=" * 60)
    
    # Test which APIs are available
    apis_to_test = [
        ("Spotify", "SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"),
        ("YouTube", "YOUTUBE_API_KEY", None),
        ("Genius", "GENIUS_ACCESS_TOKEN", None),
        ("Gemini", "GEMINI_API_KEY", None)
    ]
    
    available_apis = []
    
    for api_name, env_var1, env_var2 in apis_to_test:
        var1_available = os.getenv(env_var1) is not None
        var2_available = os.getenv(env_var2) is not None if env_var2 else True
        
        is_available = var1_available and var2_available
        available_apis.append((api_name, is_available))
        
        status = "✅ Available" if is_available else "❌ Not Available"
        print(f"{status} {api_name} API")
    
    print(f"\nAPI Coverage: {sum(1 for _, available in available_apis if available)}/{len(available_apis)} APIs available")
    
    return available_apis

async def main():
    """Run all tests"""
    print("🚀 Enhanced MusiStash Resonance Score Test Suite")
    print("=" * 60)
    
    # Test API integration
    api_results = await test_api_integration()
    
    # Test resonance score calculation
    test_results = await test_enhanced_resonance_score()
    
    # Final summary
    print("\n" + "=" * 60)
    print("🎯 FINAL RESULTS")
    print("=" * 60)
    
    api_count = sum(1 for _, available in api_results if available)
    test_count = sum(1 for r in test_results if r['passed'])
    
    print(f"API Integration: {api_count}/{len(api_results)} APIs available")
    print(f"Resonance Tests: {test_count}/{len(test_results)} tests passed")
    
    if api_count >= 2 and test_count >= 3:
        print("✅ OVERALL: System is working well!")
    elif api_count >= 1 and test_count >= 2:
        print("⚠️  OVERALL: System is functional but could be improved")
    else:
        print("❌ OVERALL: System needs attention")
    
    return test_results, api_results

if __name__ == "__main__":
    asyncio.run(main()) 
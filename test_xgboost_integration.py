#!/usr/bin/env python3
"""
Test script to verify XGBoost ML integration with MusiStash API
"""

import asyncio
import aiohttp
import json

async def test_xgboost_integration():
    """Test the XGBoost ML integration via the API"""
    
    # Test URL (assuming backend is running on localhost:8000)
    url = "http://localhost:8000/analyze-artist/Drake?comparable_artist=Taylor%20Swift"
    
    print("🧪 Testing XGBoost ML Integration...")
    print(f"📡 Making request to: {url}")
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    print("✅ API Response Received!")
                    print(f"📊 Resonance Score: {data.get('musistash_resonance_score', 'N/A')}")
                    
                    # Check for ML insights
                    ml_insights = data.get('ml_insights')
                    if ml_insights:
                        print("\n🚀 XGBoost ML Insights Found!")
                        print(f"   Model Version: {ml_insights.get('model_version', 'N/A')}")
                        print(f"   Prediction Confidence: {ml_insights.get('prediction_confidence', 'N/A')}%")
                        print(f"   Confidence Interval: {ml_insights.get('confidence_interval', 'N/A')}")
                        
                        # Feature importance
                        feature_importance = ml_insights.get('feature_importance', {})
                        if feature_importance:
                            top_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:3]
                            print(f"   Top Features: {[f[0] for f in top_features]}")
                        
                        # Growth potential
                        growth = ml_insights.get('growth_potential', {})
                        if growth:
                            print(f"   Growth Potential: {growth}")
                        
                        # Risk assessment
                        risk = ml_insights.get('risk_assessment', {})
                        if risk:
                            print(f"   Risk Level: {risk.get('overall_risk', 'N/A')}")
                        
                        # Market position
                        competitive = ml_insights.get('competitive_analysis', {})
                        if competitive:
                            print(f"   Market Position: {competitive.get('market_position', 'N/A')}")
                        
                        print("\n🎯 XGBoost Integration: SUCCESS!")
                        return True
                    else:
                        print("❌ No ML insights found in response")
                        print("Response keys:", list(data.keys()))
                        return False
                else:
                    print(f"❌ API Error: {response.status}")
                    return False
                    
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_xgboost_integration())
    if success:
        print("\n🎉 XGBoost ML Integration is working correctly!")
    else:
        print("\n💥 XGBoost ML Integration needs attention!") 
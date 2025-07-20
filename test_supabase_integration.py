#!/usr/bin/env python3
"""
Test script to verify Supabase integration
Run this to check if data is being stored correctly
"""

import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_supabase_connection():
    """Test if Supabase connection is working"""
    try:
        from supabase_config import supabase_manager
        
        print("✅ Supabase manager imported successfully")
        
        # Test basic connection
        print("🔍 Testing Supabase connection...")
        
        # Get artist count
        artist_count = await supabase_manager.get_artist_count()
        print(f"📊 Artists in database: {artist_count}")
        
        # Get comparison count
        comparison_count = await supabase_manager.get_comparison_count()
        print(f"📊 Comparisons in database: {comparison_count}")
        
        # Get latest ML metrics
        ml_metrics = await supabase_manager.get_latest_ml_metrics()
        if ml_metrics:
            print(f"🤖 Latest ML metrics found:")
            print(f"   - Model version: {ml_metrics.get('model_version', 'N/A')}")
            print(f"   - Training accuracy: {ml_metrics.get('training_accuracy', 'N/A')}")
            print(f"   - Data points processed: {ml_metrics.get('data_points_processed', 'N/A')}")
        else:
            print("⚠️  No ML metrics found yet - this is normal for new setup")
        
        print("✅ Supabase integration test completed successfully!")
        return True
        
    except ImportError as e:
        print(f"❌ Failed to import Supabase manager: {e}")
        print("   Make sure you've installed: pip install supabase python-dotenv")
        return False
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
        print("   Check your SUPABASE_URL and SUPABASE_ANON_KEY in .env file")
        return False

async def test_backend_api():
    """Test if backend API is serving ML metrics"""
    try:
        import httpx
        
        print("🔍 Testing backend API...")
        
        async with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:8000/api/ml-metrics")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Backend API is working!")
                print(f"   - Model version: {data.get('model_version', 'N/A')}")
                print(f"   - Training accuracy: {data.get('training_accuracy', 'N/A')}%")
                print(f"   - Features analyzed: {data.get('features_analyzed', 'N/A')}")
                return True
            else:
                print(f"❌ Backend API returned status {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Backend API test failed: {e}")
        print("   Make sure your backend is running: python main.py")
        return False

async def main():
    """Run all tests"""
    print("🚀 Testing MusiStash Supabase Integration")
    print("=" * 50)
    
    # Test 1: Supabase connection
    supabase_ok = await test_supabase_connection()
    
    print("\n" + "=" * 50)
    
    # Test 2: Backend API
    backend_ok = await test_backend_api()
    
    print("\n" + "=" * 50)
    
    # Summary
    if supabase_ok and backend_ok:
        print("🎉 All tests passed! Your integration is working correctly.")
        print("\n📋 Next steps:")
        print("   1. Test an artist analysis: curl 'http://localhost:8000/analyze-artist/Drake'")
        print("   2. Check your ML Model Dashboard for real data")
        print("   3. Monitor Supabase dashboard for new records")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
        print("\n🔧 Troubleshooting:")
        if not supabase_ok:
            print("   - Verify your Supabase credentials in .env file")
            print("   - Make sure you ran the SQL schema in Supabase")
        if not backend_ok:
            print("   - Start your backend: cd backend && python main.py")
            print("   - Check that all dependencies are installed")

if __name__ == "__main__":
    asyncio.run(main()) 
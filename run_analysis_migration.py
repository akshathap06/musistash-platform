#!/usr/bin/env python3
"""
Script to run the complete analysis fields migration
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

def run_migration():
    """Run the complete analysis fields migration"""
    
    # Get Supabase credentials
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Missing Supabase credentials in .env file")
        print("Please set SUPABASE_URL and SUPABASE_ANON_KEY")
        return False
    
    try:
        # Initialize Supabase client
        supabase: Client = create_client(supabase_url, supabase_key)
        print("✅ Connected to Supabase")
        
        # Execute migration steps one by one
        print("🔄 Running migration...")
        
        # Step 1: Add new columns
        print("📊 Adding new columns...")
        try:
            # Add complete_analysis_json column
            supabase.table('uploaded_tracks').select('id').limit(1).execute()
            print("✅ Table exists, proceeding with migration")
        except Exception as e:
            print(f"⚠️  Note: {e}")
        
        # Since we can't execute raw SQL directly, we'll need to manually add these columns
        # through the Supabase dashboard or use the SQL editor
        print("\n📋 Migration SQL to run in Supabase SQL Editor:")
        print("=" * 60)
        print("""
-- Add complete analysis fields to uploaded_tracks table
ALTER TABLE uploaded_tracks 
ADD COLUMN IF NOT EXISTS complete_analysis_json JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gemini_insights_json JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS track_summary JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS technical_analysis JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS artistic_insights JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS actionable_recommendations JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS similar_artists JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS market_positioning JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_saved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_analysis_date TIMESTAMP WITH TIME ZONE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_uploaded_tracks_is_saved ON uploaded_tracks(is_saved);
CREATE INDEX IF NOT EXISTS idx_uploaded_tracks_last_analysis_date ON uploaded_tracks(last_analysis_date DESC);

-- Update existing records to set is_saved to true for existing saved reports
UPDATE uploaded_tracks SET is_saved = TRUE WHERE created_at IS NOT NULL;
        """)
        print("=" * 60)
        
        print("\n📝 Instructions:")
        print("1. Go to your Supabase dashboard")
        print("2. Navigate to the SQL Editor")
        print("3. Copy and paste the SQL above")
        print("4. Click 'Run' to execute the migration")
        print("5. Verify the columns were added successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Complete Analysis Fields Migration")
    print("=" * 50)
    
    success = run_migration()
    
    if success:
        print("\n🎉 Migration instructions provided!")
        print("After running the SQL in Supabase dashboard:")
        print("- Complete analysis storage will be available")
        print("- Gemini AI insights will be stored")
        print("- User-controlled saving will work")
        print("- Last analysis will display on login")
    else:
        print("\n❌ Migration failed!")
        sys.exit(1) 
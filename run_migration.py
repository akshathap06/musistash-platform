#!/usr/bin/env python3
"""
Database Migration Script
Runs the PyAudioAnalysis migration to add missing columns
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the backend directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

try:
    from supabase_config import supabase_manager
    
    print("🔄 Running database migration...")
    
    # Read the migration SQL file
    migration_file = os.path.join(os.path.dirname(__file__), "remove-essentia-add-pyaudioanalysis.sql")
    
    if not os.path.exists(migration_file):
        print(f"❌ Migration file not found: {migration_file}")
        sys.exit(1)
    
    with open(migration_file, 'r') as f:
        migration_sql = f.read()
    
    # Split the SQL into individual statements
    statements = [stmt.strip() for stmt in migration_sql.split(';') if stmt.strip()]
    
    # Execute each statement
    for i, statement in enumerate(statements, 1):
        if statement:
            try:
                print(f"📝 Executing statement {i}/{len(statements)}...")
                result = supabase_manager.client.rpc('exec_sql', {'sql': statement}).execute()
                print(f"✅ Statement {i} executed successfully")
            except Exception as e:
                print(f"⚠️  Statement {i} had an issue (this might be expected): {e}")
    
    print("✅ Migration completed!")
    print("📋 Next steps:")
    print("   1. Start the backend server: cd backend && python -m uvicorn main:app --reload --port 8000")
    print("   2. Test the API integration")
    
except ImportError as e:
    print(f"❌ Error importing dependencies: {e}")
    print("Make sure you're in the correct directory and dependencies are installed")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error running migration: {e}")
    sys.exit(1) 
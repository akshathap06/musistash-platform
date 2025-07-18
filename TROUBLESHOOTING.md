# MusiStash Platform Troubleshooting Guide

## Current Issue: Artist Profile Creation Failing

### Problem Description

- Artist profile creation returns "Profile save returned null" error
- Console shows 400 status code errors from Supabase
- Backend is running successfully on port 8000

### Root Cause

The database schema is missing required fields that the frontend is trying to insert:

- `career_highlights` (JSONB)
- `musical_style` (TEXT)
- `influences` (TEXT)

### Solution Steps

#### Step 1: Update Database Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `fix-database-schema.sql`
4. Click "Run" to execute the migration

#### Step 2: Verify the Fix

1. Refresh your application
2. Try creating an artist profile again
3. Check the browser console for any remaining errors

#### Step 3: Test the Application

1. Create a new artist profile with all fields
2. Test the preview functionality
3. Test saving the profile
4. Verify the profile appears in the admin dashboard

### Prevention Measures

#### 1. Schema Version Control

- Always update the main schema file when adding new fields
- Use migration files for incremental changes
- Test schema changes in development first

#### 2. Frontend-Backend Sync

- Keep TypeScript types in sync with database schema
- Use consistent field naming conventions
- Validate data before sending to database

#### 3. Error Handling

- Add better error messages in the frontend
- Log detailed error information for debugging
- Implement graceful fallbacks

### Common Issues and Solutions

#### Issue 1: "Profile save returned null"

**Cause**: Database schema mismatch or RLS policy issues
**Solution**:

- Run database migrations
- Check RLS policies
- Verify user authentication

#### Issue 2: "Failed to load resource" with 400 status

**Cause**: Invalid data being sent to Supabase
**Solution**:

- Check field names match database schema
- Validate data types
- Ensure required fields are provided

#### Issue 3: Authentication Issues

**Cause**: RLS policies blocking operations
**Solution**:

- Verify user is properly authenticated
- Check RLS policy conditions
- Test with admin user if needed

### Development Workflow

#### 1. Schema Changes

```sql
-- Always add new fields with proper defaults
ALTER TABLE table_name
ADD COLUMN IF NOT EXISTS new_field TYPE DEFAULT value;

-- Update existing records
UPDATE table_name
SET new_field = COALESCE(new_field, default_value)
WHERE new_field IS NULL;
```

#### 2. Frontend Updates

```typescript
// Update TypeScript interfaces
interface ArtistProfile {
  // ... existing fields
  newField: string;
}

// Update service methods
async createProfile(data: ArtistProfile) {
  // Ensure all required fields are included
  const profileData = {
    ...data,
    newField: data.newField || defaultValue
  };
}
```

#### 3. Testing

- Test with minimal data first
- Test with all fields populated
- Test edge cases (empty strings, null values)
- Test with different user roles

### Monitoring and Debugging

#### Console Logging

```typescript
// Add detailed logging
console.log("Creating profile with data:", profileData);
console.log("Supabase response:", response);
console.log("Error details:", error);
```

#### Database Queries

```sql
-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'artist_profiles';

-- Check recent profiles
SELECT * FROM artist_profiles
ORDER BY created_at DESC
LIMIT 5;
```

### Emergency Recovery

If the application is completely broken:

1. **Rollback Database**: Restore from backup if available
2. **Disable RLS**: Temporarily disable RLS for testing
3. **Use Mock Data**: Fall back to localStorage temporarily
4. **Check Logs**: Review all error logs for patterns

### Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
- [RLS Policy Guide](https://supabase.com/docs/guides/auth/row-level-security)

### Next Steps After Fix

1. **Implement Schema Validation**: Add runtime checks
2. **Add Integration Tests**: Test database operations
3. **Improve Error Messages**: Make debugging easier
4. **Add Monitoring**: Track database errors
5. **Documentation**: Update setup guides

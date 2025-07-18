# Supabase Integration Setup Guide

This guide will help you set up Supabase for your MusiStash platform.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `musistash-platform`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## Step 3: Update Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the schema

This will create:

- `users` table
- `artist_profiles` table
- `follow_relationships` table
- `projects` table
- `investments` table
- All necessary indexes and triggers
- Row Level Security (RLS) policies
- Default admin user

## Step 5: Configure Authentication (Optional)

If you want to use Supabase Auth instead of your current auth system:

1. Go to **Authentication** → **Settings**
2. Configure your authentication providers (Google, GitHub, etc.)
3. Update the `useAuth.tsx` hook to use Supabase Auth

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Try creating a user account
3. Test artist profile creation
4. Test follow/unfollow functionality
5. Test investment creation

## Step 7: Migration Strategy

### Phase 1: Dual Storage (Current)

- Keep localStorage for immediate functionality
- Add Supabase as backup/sync
- Users can use either system

### Phase 2: Supabase Primary

- Make Supabase the primary data source
- localStorage becomes cache/offline backup
- Add sync functionality

### Phase 3: Supabase Only

- Remove localStorage dependency
- Implement proper offline handling
- Add real-time subscriptions

## Database Schema Overview

### Users Table

- `id`: UUID primary key
- `name`: User's display name
- `email`: Unique email address
- `avatar`: Profile picture URL
- `role`: User role (artist, listener, developer, admin)
- `created_at`, `updated_at`: Timestamps

### Artist Profiles Table

- `id`: UUID primary key
- `user_id`: Reference to users table
- `artist_name`: Stage name
- `email`: Contact email
- `profile_photo`, `banner_photo`: Image URLs
- `bio`: Artist biography
- `genre`: Array of music genres
- `location`: Geographic location
- `social_links`: JSON object of social media links
- `is_verified`: Verification status
- `status`: Approval status (pending, approved, rejected)
- `approved_at`, `approved_by`: Approval metadata

### Follow Relationships Table

- `id`: UUID primary key
- `follower_id`: User following the artist
- `artist_id`: Artist being followed
- `followed_at`: When the follow occurred
- Unique constraint on (follower_id, artist_id)

### Projects Table

- `id`: UUID primary key
- `artist_id`: Reference to artist_profiles table
- `title`: Project title
- `description`: Short description
- `detailed_description`: Full project description
- `banner_image`: Project banner image
- `project_type`: Type of project (album, single, ep, mixtape)
- `genre`: Array of genres
- `funding_goal`: Target funding amount
- `min_investment`, `max_investment`: Investment limits
- `expected_roi`: Expected return on investment
- `project_duration`: Timeline for completion
- `deadline`: Funding deadline
- `status`: Project status (draft, active, funded, completed)

### Investments Table

- `id`: UUID primary key
- `user_id`: Investor
- `project_id`: Project being invested in
- `amount`: Investment amount
- `date`: Investment date
- `investment_date`: Full timestamp
- `status`: Investment status (pending, completed, cancelled)

## Security Features

### Row Level Security (RLS)

- Users can only access their own data
- Public read access for artist profiles and projects
- Controlled write access based on ownership

### Data Validation

- Check constraints on enums (role, status, project_type)
- Foreign key relationships
- Unique constraints where needed

### Indexes

- Optimized queries for common operations
- Fast lookups by email, user_id, status, etc.

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**

   - Restart your development server after updating `.env.local`
   - Check that variable names start with `VITE_`

2. **Database Connection Errors**

   - Verify your Supabase URL and key are correct
   - Check that your project is active in Supabase dashboard

3. **RLS Policy Errors**

   - Ensure you're authenticated when making requests
   - Check that policies match your user's role

4. **Type Errors**
   - Run `npm run build` to check for TypeScript errors
   - Update types in `supabase.ts` if schema changes

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## Next Steps

After completing this setup:

1. **Test all functionality** with the new database
2. **Implement real-time features** using Supabase subscriptions
3. **Add file upload** for profile pictures and project banners
4. **Set up email notifications** for profile approvals
5. **Add analytics** and monitoring
6. **Implement backup strategies**
7. **Set up production deployment**

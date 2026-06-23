# Supabase SQL Setup Script

Copy and paste this entire SQL code into your Supabase SQL Editor and run it.

## Steps:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in the left menu
4. Click "New Query"
5. Copy the SQL code below
6. Paste into the editor
7. Click "RUN" button
8. Wait for success message

---

\`\`\`sql
-- Create people table
CREATE TABLE IF NOT EXISTS people (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  date_of_death DATE,
  marriage_date DATE,
  profile_picture_url VARCHAR(500),
  parent_id UUID REFERENCES people(id) ON DELETE SET NULL,
  spouse_id UUID REFERENCES people(id) ON DELETE SET NULL,
  special_occasions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_people_user_id ON people(user_id);
CREATE INDEX IF NOT EXISTS idx_people_parent_id ON people(parent_id);
CREATE INDEX IF NOT EXISTS idx_people_spouse_id ON people(spouse_id);

-- Enable Row Level Security
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own family members
CREATE POLICY "Users can only see their own family members"
  ON people
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own family members
CREATE POLICY "Users can only insert their own family members"
  ON people
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own family members
CREATE POLICY "Users can only update their own family members"
  ON people
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own family members
CREATE POLICY "Users can only delete their own family members"
  ON people
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
  VALUES ('profile-pictures', 'profile-pictures', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policy: Users can upload their own profile pictures
CREATE POLICY "Users can upload their own profile pictures"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policy: Users can update their own profile pictures
CREATE POLICY "Users can update their own profile pictures"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policy: Users can delete their own profile pictures
CREATE POLICY "Users can delete their own profile pictures"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policy: Profile pictures are publicly readable
CREATE POLICY "Profile pictures are publicly readable"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-pictures');
\`\`\`

---

## What This Script Does:

1. **Creates `people` table** with fields for:
   - First name, last name
   - Date of birth, date of death, marriage date
   - Profile picture URL
   - Parent and spouse relationships
   - Special occasions (stored as JSON)

2. **Adds indexes** for fast database queries on:
   - user_id (find all members for a user)
   - parent_id (find children of a person)
   - spouse_id (find spouse relationships)

3. **Enables Row Level Security (RLS)** to ensure:
   - Users can only see their own family data
   - Each user's data is completely private and secure

4. **Creates a storage bucket** called `profile-pictures` for:
   - Storing profile photos for family members
   - Automatic public access for displaying images
   - User-specific upload/delete permissions

## Success Indicators

After running the script, you should see:
- ✓ Table `people` created
- ✓ Indexes created
- ✓ RLS enabled
- ✓ Policies created (6 total)
- ✓ Storage bucket created
- ✓ Storage policies created

All green checkmarks = Success!

## If Something Goes Wrong

If you get errors:
1. Try running the script again
2. Check that your Supabase project is active
3. Verify you're in the correct project
4. Look for specific error messages and troubleshoot accordingly

The script is idempotent (safe to run multiple times) - if something exists, it will skip it.

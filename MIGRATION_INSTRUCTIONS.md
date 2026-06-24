# Database Migration Instructions

## Problem
The error `Could not find the table 'public.people' in the schema cache` means the database tables don't exist yet in your Supabase project.

## Solution: Run SQL Migrations

### Step 1: Access Supabase SQL Editor
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Create the Tables
Copy the entire content from `scripts/create-tables.sql` and paste it into the SQL Editor.

**Quick Start - Essential Tables Only:**

If you want to start quickly, run this minimal schema first:

```sql
-- Create people table
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  date_of_death DATE,
  marriage_date DATE,
  special_occasions TEXT,
  profile_picture_url TEXT,
  profile_picture_visible BOOLEAN DEFAULT TRUE,
  parent_id UUID REFERENCES people(id) ON DELETE SET NULL,
  spouse_id UUID REFERENCES people(id) ON DELETE SET NULL,
  whatsapp_number VARCHAR(20),
  email VARCHAR(255),
  phone VARCHAR(20),
  education TEXT,
  occupation VARCHAR(255),
  location VARCHAR(255),
  current_city VARCHAR(255),
  bio TEXT,
  additional_photos JSONB DEFAULT '[]'::jsonb,
  family_photos JSONB DEFAULT '[]'::jsonb,
  custom_fields JSONB DEFAULT '{}'::jsonb,
  family_tree_id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for people table
CREATE POLICY "Users can view their own family members"
  ON people FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own family members"
  ON people FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own family members"
  ON people FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own family members"
  ON people FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT DO NOTHING;

-- Create storage policy for public access
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload profile pictures"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-pictures'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their uploads"
  ON storage.objects FOR UPDATE
  USING (auth.uid()::text = owner);

CREATE POLICY "Users can delete their uploads"
  ON storage.objects FOR DELETE
  USING (auth.uid()::text = owner);
```

### Step 3: Run the SQL
1. Click the **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait for the queries to complete (you should see success messages)
3. Check the **Tables** section in the left sidebar to confirm tables were created

### Step 4: Verify Tables
In Supabase SQL Editor, run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see: `people`, `family_trees`, `family_tree_collaborators`, `family_tree_invitations`, `sharing_links`, `custom_field_templates`

### Step 5: Test the App
After migrations complete:
1. Restart your local dev server: `npm run dev`
2. Try adding a family member
3. The data should save successfully

## Troubleshooting

### Error: "Table already exists"
This is normal if running migrations a second time. Either:
- Add `IF NOT EXISTS` to the CREATE TABLE statements
- Or clear the database in Supabase and re-run

### Error: "Permission denied"
Make sure you're:
1. Logged in as the project owner/admin
2. Using the correct Supabase project

### Storage bucket error
If the storage bucket creation fails, create it manually:
1. Go to **Storage** in Supabase
2. Click **New Bucket**
3. Name it `profile-pictures`
4. Set it to **Public**

## Full Schema vs Minimal
- **Full Schema**: Run all of `scripts/create-tables.sql` for advanced features (sharing, collaborators, custom fields)
- **Minimal Schema**: Run just the SQL above to get started quickly

## Next Steps
Once migrations are complete, the app will work perfectly. Users can:
- Add family members with all fields
- Upload photos with visibility controls
- Add custom fields
- Share family trees (after full migration)

---

Need help? Check the debug logs or contact support.

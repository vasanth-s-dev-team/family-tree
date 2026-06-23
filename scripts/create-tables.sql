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
  parent_id UUID REFERENCES people(id) ON DELETE SET NULL,
  spouse_id UUID REFERENCES people(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users to see only their own data
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

-- Create RLS policy for storage
CREATE POLICY "Public profile picture access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload profile pictures"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-pictures' AND auth.role() = 'authenticated');

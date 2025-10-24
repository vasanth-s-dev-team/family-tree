-- Create people table
CREATE TABLE IF NOT EXISTS people (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  date_of_death DATE,
  marriage_date DATE,
  profile_picture_url TEXT,
  parent_id UUID REFERENCES people(id) ON DELETE SET NULL,
  spouse_id UUID REFERENCES people(id) ON DELETE SET NULL,
  special_occasions JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster queries
CREATE INDEX idx_people_user_id ON people(user_id);
CREATE INDEX idx_people_parent_id ON people(parent_id);
CREATE INDEX idx_people_spouse_id ON people(spouse_id);

-- Enable RLS on people table
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Create RLS policy - users can only see their own family members
CREATE POLICY "Users can view their own family members" ON people
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policy - users can only insert their own family members
CREATE POLICY "Users can insert their own family members" ON people
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policy - users can only update their own family members
CREATE POLICY "Users can update their own family members" ON people
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policy - users can only delete their own family members
CREATE POLICY "Users can delete their own family members" ON people
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policy for storage
CREATE POLICY "Users can upload profile pictures" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view profile pictures" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-pictures');

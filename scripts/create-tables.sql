-- Create the people table
CREATE TABLE IF NOT EXISTS people (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    date_of_death DATE,
    marriage_date DATE,
    profile_picture TEXT,
    special_occasions JSONB DEFAULT '[]'::jsonb,
    parent_id UUID REFERENCES people(id) ON DELETE SET NULL,
    spouse_id UUID REFERENCES people(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_people_user_id ON people(user_id);
CREATE INDEX IF NOT EXISTS idx_people_parent_id ON people(parent_id);
CREATE INDEX IF NOT EXISTS idx_people_spouse_id ON people(spouse_id);

-- Enable Row Level Security
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own family members
CREATE POLICY "Users can only see their own family members" ON people
    FOR ALL USING (auth.uid() = user_id);

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) 
VALUES ('family-tree', 'family-tree', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for storage bucket
CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'family-tree' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view profile pictures" ON storage.objects
    FOR SELECT USING (bucket_id = 'family-tree');

CREATE POLICY "Users can update their own profile pictures" ON storage.objects
    FOR UPDATE USING (bucket_id = 'family-tree' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
    FOR DELETE USING (bucket_id = 'family-tree' AND auth.uid()::text = (storage.foldername(name))[1]);

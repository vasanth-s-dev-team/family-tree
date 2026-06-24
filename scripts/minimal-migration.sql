-- Minimal Database Migration for Family Tree App
-- Run this in Supabase SQL Editor if scripts/create-tables.sql fails

-- Create people table with all fields
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

-- Create RLS policies
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
ON CONFLICT (id) DO NOTHING;

-- Storage policies
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

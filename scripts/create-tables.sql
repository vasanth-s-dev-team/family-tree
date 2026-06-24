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
  -- New fields for enhanced profiles
  whatsapp_number VARCHAR(20),
  email VARCHAR(255),
  phone VARCHAR(20),
  education TEXT,
  occupation VARCHAR(255),
  location VARCHAR(255),
  bio TEXT,
  -- Family tree visibility
  family_tree_id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create family_trees table for managing shared and public trees
CREATE TABLE IF NOT EXISTS family_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  visibility VARCHAR(20) DEFAULT 'private', -- private, shared, public
  is_public BOOLEAN DEFAULT FALSE,
  public_url_slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create collaborators table for managing shared access
CREATE TABLE IF NOT EXISTS family_tree_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'viewer', -- viewer, editor, admin
  invited_by UUID REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP,
  UNIQUE(family_tree_id, user_id)
);

-- Create invitations table for email-based invites
CREATE TABLE IF NOT EXISTS family_tree_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  invited_email VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'viewer',
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(family_tree_id, invited_email)
);

-- Create sharing links table for social media sharing
CREATE TABLE IF NOT EXISTS sharing_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  platform VARCHAR(50), -- twitter, facebook, whatsapp, general
  view_count INT DEFAULT 0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_tree_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_tree_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sharing_links ENABLE ROW LEVEL SECURITY;

-- People table RLS policies
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

-- Family trees RLS policies
CREATE POLICY "Users can view their own trees"
  ON family_trees FOR SELECT
  USING (auth.uid() = owner_id OR is_public = TRUE);

CREATE POLICY "Users can create family trees"
  ON family_trees FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own trees"
  ON family_trees FOR UPDATE
  USING (auth.uid() = owner_id);

-- Family tree collaborators RLS policies
CREATE POLICY "View collaborators on accessible trees"
  ON family_tree_collaborators FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_trees 
      WHERE id = family_tree_id AND owner_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Manage collaborators on owned trees"
  ON family_tree_collaborators FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM family_trees 
      WHERE id = family_tree_id AND owner_id = auth.uid()
    )
  );

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

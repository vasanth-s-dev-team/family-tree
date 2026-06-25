-- Create families table for collaborative family management
CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_code VARCHAR(50) UNIQUE NOT NULL, -- Easy to share: "SMITH-2024"
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  visibility VARCHAR(20) DEFAULT 'private', -- private, shared, public
  is_public BOOLEAN DEFAULT FALSE,
  public_url_slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create family_members table to track which users belong to families
CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- admin, editor, member
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(family_id, user_id)
);

-- Create relationship_roles table for defining relationship types
CREATE TABLE IF NOT EXISTS relationship_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  role_name VARCHAR(100) NOT NULL, -- father, mother, son, daughter, uncle, aunt, grandfather, etc.
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(family_id, role_name)
);

-- Create people table
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE, -- Link to collaborative family
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
  -- New fields for enhanced profiles
  whatsapp_number VARCHAR(20),
  email VARCHAR(255),
  phone VARCHAR(20),
  education TEXT,
  occupation VARCHAR(255),
  location VARCHAR(255),
  current_city VARCHAR(255),
  bio TEXT,
  -- Photo management
  additional_photos JSONB DEFAULT '[]'::jsonb, -- Array of {url, caption, visible}
  family_photos JSONB DEFAULT '[]'::jsonb, -- Array of family photos with {url, caption, visible}
  -- Custom fields (stored as JSONB for flexibility)
  custom_fields JSONB DEFAULT '{}'::jsonb,
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
  family_id UUID REFERENCES families(id) ON DELETE CASCADE, -- For collaborative families
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  invited_email VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'viewer',
  relationship_type VARCHAR(100), -- uncle, aunt, father, mother, etc.
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected
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

-- Create custom fields template table
CREATE TABLE IF NOT EXISTS custom_field_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  field_name VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL, -- text, number, date, select, checkbox, textarea
  field_options JSONB, -- For select/checkbox options
  is_required BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, field_name)
);

-- Helper functions to avoid infinite RLS recursion
CREATE OR REPLACE FUNCTION is_family_member(_family_id UUID, _user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM family_members 
    WHERE family_id = _family_id AND user_id = _user_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_family_role(_family_id UUID, _user_id UUID, _role VARCHAR)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM family_members 
    WHERE family_id = _family_id AND user_id = _user_id AND role = _role
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_family_creator(_family_id UUID, _user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM families 
    WHERE id = _family_id AND created_by = _user_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationship_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_tree_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_tree_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sharing_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_field_templates ENABLE ROW LEVEL SECURITY;

-- Families table RLS policies
CREATE POLICY "Users can view their families"
  ON families FOR SELECT
  USING (
    created_by = auth.uid()
    OR is_family_member(id, auth.uid())
    OR is_public = TRUE
  );

CREATE POLICY "Users can create families"
  ON families FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Family admins can update families"
  ON families FOR UPDATE
  USING (
    created_by = auth.uid()
    OR check_family_role(id, auth.uid(), 'admin')
  );

-- Family members table RLS policies
CREATE POLICY "Users can view family members"
  ON family_members FOR SELECT
  USING (is_family_member(family_id, auth.uid()));

CREATE POLICY "Family admins can manage members"
  ON family_members FOR ALL
  USING (
    check_family_role(family_id, auth.uid(), 'admin')
    OR is_family_creator(family_id, auth.uid())
  );

-- Relationship roles table RLS policies
CREATE POLICY "Users can view relationship roles"
  ON relationship_roles FOR SELECT
  USING (is_family_member(family_id, auth.uid()));

CREATE POLICY "Family admins can manage relationship roles"
  ON relationship_roles FOR ALL
  USING (
    check_family_role(family_id, auth.uid(), 'admin')
    OR is_family_creator(family_id, auth.uid())
  );

-- People table RLS policies
CREATE POLICY "Users can view their own family members"
  ON people FOR SELECT
  USING (auth.uid() = user_id OR (family_id IS NOT NULL AND is_family_member(family_id, auth.uid())));

CREATE POLICY "Users can insert family members"
  ON people FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR (family_id IS NOT NULL AND is_family_member(family_id, auth.uid()))
  );

CREATE POLICY "Users can update family members"
  ON people FOR UPDATE
  USING (
    auth.uid() = user_id
    OR (family_id IS NOT NULL AND is_family_member(family_id, auth.uid()))
  );

CREATE POLICY "Users can delete family members"
  ON people FOR DELETE
  USING (
    auth.uid() = user_id
    OR (family_id IS NOT NULL AND is_family_member(family_id, auth.uid()))
  );

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

-- Custom field templates RLS policies
CREATE POLICY "Users can view their own custom fields"
  ON custom_field_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create custom fields"
  ON custom_field_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom fields"
  ON custom_field_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom fields"
  ON custom_field_templates FOR DELETE
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

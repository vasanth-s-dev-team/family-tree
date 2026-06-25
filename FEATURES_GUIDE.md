# Family Tree App - Comprehensive Features Guide

## New Features Implemented

This guide covers all the new collaborative, sharing, and enhanced profile features added to the Family Tree application.

---

## 1. Enhanced Member Profiles

### New Fields Added to Each Family Member

Users can now add comprehensive information to each family member:

- **WhatsApp Number**: Direct contact via WhatsApp
- **Email**: Email address
- **Phone**: Phone number
- **Occupation**: Current job/profession
- **Education**: Educational background (degrees, schools)
- **Location**: Current location
- **Bio/Notes**: Additional biographical information

### How to Use

1. Click "Add Family Member"
2. Fill in basic information (name, dates)
3. Scroll to "Contact & Additional Info" section
4. Add WhatsApp, email, education, occupation, and location
5. Click "Add Family Member" to save

---

## 2. Family Tree Visibility & Privacy Settings

### Three Privacy Levels

#### Private
- Only you can view and edit
- Family tree is hidden from public
- Best for personal family records

#### Shared
- Only invited collaborators can view
- You control who has access
- Great for collaborative editing

#### Public
- Anyone with the shareable link can view
- Members' contact info (WhatsApp, email) remains visible
- Perfect for family reunions and genealogy sharing

### How to Change Visibility

1. Go to **Family Tree Settings** → **Visibility**
2. Select your desired privacy level
3. Changes take effect immediately

---

## 3. Social Media Sharing

### Share on Multiple Platforms

Share your family tree with one click on:
- **Twitter/X** - Share with your followers
- **Facebook** - Post to your timeline
- **WhatsApp** - Send to groups or individuals
- **Email** - Direct email links

### How to Share

1. Go to **Family Tree Settings** → **Share**
2. Copy the share link or click one of the social buttons
3. Customize the message on the platform
4. Share directly to your network

### Generated Share Link

Each family tree gets a unique shareable URL:
\`\`\`
https://familytree.app/family-tree/my-family-tree-abc123
\`\`\`

---

## 4. Collaboration & Invitations

### Invite Family Members

Invite others to collaborate on your family tree with different permission levels:

- **Viewer**: Can view all members but cannot edit
- **Editor**: Can add, edit, and delete family members
- **Admin**: Full access including changing settings and permissions

### How to Invite

1. Go to **Family Tree Settings** → **Invites**
2. Enter the email address of the person to invite
3. Select their role (Viewer, Editor, or Admin)
4. Click "Send Invitation"
5. They'll receive an email with a link to join

### Managing Collaborators

1. Go to **Family Tree Settings** → **Collaborators**
2. View all people with access
3. Click "Remove" to revoke access
4. Edit roles to change permissions

### Pending Invitations

- Invitations expire after 30 days
- Resend invitations if they weren't accepted
- Collaborators see their role in the invitation email

---

## 5. Public Profile Pages

### What Others See

When viewing a public family tree via link, visitors can see:
- Family member names and photos
- Birth and death dates
- Occupation and education
- Location information
- Direct contact links (WhatsApp, email)
- Family relationships and tree structure

### What They Cannot Edit

- Viewers cannot edit any information
- Viewers cannot access settings
- Only collaborators with Editor role can modify data

---

## 6. Contact & Communication

### WhatsApp Integration

- Each family member can have a WhatsApp number
- Public profiles show a "WhatsApp" button for direct contact
- Clicking opens WhatsApp Web or app with pre-filled message

### Email Integration

- Store email addresses for each member
- Click "Email" button on public profiles to contact
- Use email invitations to add collaborators

### Phone Numbers

- Store phone numbers for reference
- Can be used for SMS reminders or calls

---

## 7. API Endpoints (For External Websites)

### Public Family Tree API

**GET** `/api/public-family-tree/[slug]`

Returns public family tree data:
\`\`\`json
{
  "name": "Smith Family Tree",
  "description": "Our family genealogy",
  "members": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Smith",
      "dateOfBirth": "1980-01-01",
      "occupation": "Software Engineer",
      "education": "BS Computer Science",
      "location": "New York, USA",
      "whatsappNumber": "+1234567890",
      "email": "john@example.com"
    }
  ]
}
\`\`\`

### Embed Public Trees

You can embed family trees on external websites using an iframe:

\`\`\`html
<iframe 
  src="https://familytree.app/family-tree/my-family-tree-abc123"
  width="100%"
  height="600"
  frameborder="0"
  allow="fullscreen"
></iframe>
\`\`\`

---

## 8. Database Schema Changes

### New Tables

#### `family_trees`
Stores family tree metadata and settings:
- `id`: Unique identifier
- `owner_id`: User who created the tree
- `name`: Family tree name
- `visibility`: private/shared/public
- `public_url_slug`: Unique URL slug for sharing

#### `family_tree_collaborators`
Manages who has access:
- `family_tree_id`: Which tree
- `user_id`: Person with access
- `role`: viewer/editor/admin
- `status`: pending/accepted

#### `family_tree_invitations`
Stores pending invitations:
- `family_tree_id`: Which tree
- `invited_email`: Email to invite
- `role`: What permissions they'll have
- `token`: Unique invitation link

#### `sharing_links`
Tracks social sharing:
- `family_tree_id`: Which tree
- `platform`: twitter/facebook/whatsapp
- `view_count`: How many times shared link was viewed

### Updated `people` Table

New columns added:
- `whatsapp_number`: WhatsApp contact
- `email`: Email address
- `phone`: Phone number
- `education`: Educational background
- `occupation`: Job/profession
- `location`: Current location
- `bio`: Additional notes
- `family_tree_id`: Which tree this person belongs to

---

## 9. Setup Instructions

### Step 1: Update Database

Run the SQL migration to add new tables and columns:

\`\`\`bash
# Copy SQL from scripts/create-tables.sql
# Paste in Supabase SQL Editor
# Run all queries
\`\`\`

### Step 2: Install Components

The following components are already created:
- `components/family-tree-settings.tsx` - Settings UI
- `components/public-family-tree.tsx` - Public view
- `app/family-tree/[slug]/page.tsx` - Public page route
- `app/api/public-family-tree/[slug]/route.ts` - API endpoint

### Step 3: Update Main Dashboard

Add settings tab to your main dashboard to include:
\`\`\`tsx
<FamilyTreeSettings />
\`\`\`

---

## 10. User Workflows

### Workflow 1: Create and Share with Family

1. Create family tree (Private initially)
2. Add all family members with full information
3. Change visibility to "Public"
4. Share the link via WhatsApp group
5. Family members can view and contribute

### Workflow 2: Collaborative Tree Building

1. Create family tree (Private)
2. Set visibility to "Shared"
3. Invite specific family members as "Editor"
4. They receive invitation email
5. Accept and start adding/editing members
6. See all changes in real-time

### Workflow 3: Research & Discovery

1. Share tree on social media
2. People with same last name find you
3. They can view your tree and contact members
4. Build larger family connections
5. Merge related family lines

---

## 11. Security & Privacy

### Row Level Security (RLS)

All tables have RLS policies:
- Users can only view trees they own or are invited to
- Editors can only edit authorized trees
- Public trees visible to anyone but read-only
- Sensitive data protected

### Shared Collaborators

- Each invitation generates unique token
- Tokens expire after 30 days
- Collaborators revoked immediately when removed
- Activity logs not yet implemented (future feature)

### Public Data

- Only visibility "Public" shows data to strangers
- Private/Shared trees completely hidden
- Contact info (WhatsApp, email) user's choice

---

## 12. Future Enhancements

### Planned Features

- Activity logs (who changed what)
- Photo gallery with albums
- Timeline view of family events
- DNA matching integration
- PDF export with custom branding
- Mobile app (iOS/Android)
- Family calendar for birthdays/anniversaries
- Advanced search and filtering
- AI genealogy suggestions
- Video testimonials from family members

---

## 13. Troubleshooting

### Invitation Not Received

- Check spam folder
- Verify email address is correct
- Resend invitation
- Wait up to 15 minutes

### Public Link Not Working

- Verify family tree is set to "Public"
- Check if URL slug is correct
- Ensure you're using full URL
- Try sharing link in private window

### WhatsApp Button Not Working

- Ensure WhatsApp number includes country code
- Use format: +1 (555) 123-4567
- Check if WhatsApp is installed

### Changes Not Saving

- Check internet connection
- Verify you have Editor role
- Try refreshing page
- Check browser console for errors

---

## 14. Support & Feedback

For issues or feature requests:
1. Check this guide first
2. Review troubleshooting section
3. Check browser console for errors
4. Create GitHub issue with details

Enjoy your enhanced Family Tree app!

# Collaborative Family Tree System

## Overview

The collaborative family tree system allows multiple family members to join and manage a single shared family tree. Each family has a unique **Family Code** that members can use to join.

## Key Features

### 1. Create a Family
- Start by creating a family with a name and unique family code
- Example code: `SMITH-ABC123`
- The creator becomes the family admin by default

### 2. Invite Family Members
You can invite family members by:
- **Email Invitation**: Send invitations via email with specific relationship roles
- **Family Code**: Share the family code for members to join directly
- **Role Specification**: Define relationships like uncle, aunt, father, mother, cousin, etc.

### 3. Relationship Types
When inviting members, specify their relationship:
- **Generational**: Father, Mother, Son, Daughter, Grandfather, Grandmother, Grandson, Granddaughter
- **Siblings**: Brother, Sister
- **Extended Family**: Uncle, Aunt, Cousin, Nephew, Niece
- **In-Laws**: Father-in-law, Mother-in-law, Brother-in-law, Sister-in-law
- **Spouse**: Spouse
- **Other**: Custom relationships

### 4. Member Roles
- **Admin**: Can manage family members, send invites, edit family settings
- **Editor**: Can add/edit family members and relationships
- **Member**: Can view family tree and add personal information

### 5. Acceptance Flow
- When invited, members receive an email with an invitation link
- Clicking the link takes them to acceptance page
- New users can register during acceptance
- Existing users can accept directly

## Database Schema

### families
```sql
- id: UUID (primary key)
- family_code: VARCHAR (unique, shareable code)
- name: VARCHAR (family name)
- description: TEXT
- created_by: UUID (admin user)
- visibility: VARCHAR (private/shared/public)
- created_at: TIMESTAMP
```

### family_members
```sql
- id: UUID (primary key)
- family_id: UUID (reference to families)
- user_id: UUID (reference to users)
- role: VARCHAR (admin/editor/member)
- joined_at: TIMESTAMP
```

### relationship_roles
```sql
- id: UUID (primary key)
- family_id: UUID
- role_name: VARCHAR (uncle, aunt, etc.)
- description: TEXT
```

### family_tree_invitations (updated)
```sql
- family_id: UUID (new field)
- relationship_type: VARCHAR (uncle, aunt, etc.)
- status: VARCHAR (pending/accepted/rejected)
```

## Row Level Security (RLS)

### Families Table
- Users can view their own families
- Family members can view the family they belong to
- Admins can update family settings
- Public families visible to all

### family_members Table
- Only family members can view the member list
- Only admins can manage members

### People Table
- Family members can view/edit/add members in their family
- Collaboration enabled within family scope

## How It Works: Example Scenario

**Scenario**: You (Person B) want to add your paternal uncle (Person C) to your family tree

1. **Create a Family** (if not already done)
   - Name: "Smith Family"
   - Code: "SMITH-2024"

2. **Invite Your Uncle**
   - Go to Family > Invite Member
   - Enter uncle's email: `uncle@example.com`
   - Select relationship: "Uncle"
   - Click "Send Invitation"

3. **Uncle Receives Email**
   - Click invitation link
   - Option to register or log in
   - Accept the invitation

4. **Uncle Joins the Family**
   - Added to family_members table
   - Can now view all family members
   - Can add/edit his own details

5. **Uncle Invites His Family**
   - Uncle can now invite others to the family
   - Example: Invites his sister (your aunt)
   - Relationship type: "Aunt"

6. **Family Tree Grows**
   - Multiple generations collaborate
   - Each member can manage their own relationships
   - Shared visibility of entire tree

## Components

### CreateFamily
Creates a new collaborative family
- Props: `onSuccess(familyId, familyCode)`
- Generates unique family codes
- Creates admin membership automatically

### FamilyInvite
Invites new members to a family
- Props: `familyId`
- Email input with relationship selector
- 7-day invitation expiry
- Sends invitation token for email link

### FamilyMemberDashboard
Manages family members and pending invites
- Shows current family members
- Lists pending invitations
- Displays member roles and join dates
- Option to remove pending invites

## Integration Steps

1. **Run SQL Migration**
   ```bash
   # In Supabase SQL Editor, run:
   # scripts/create-tables.sql
   ```

2. **Add Components to Dashboard**
   ```tsx
   import { CreateFamily } from '@/components/create-family'
   import { FamilyMemberDashboard } from '@/components/family-member-dashboard'
   ```

3. **Create API Routes for Invites**
   - `/api/accept-invite` - Accept invitation link
   - `/api/send-invite-email` - Send email invitations
   - `/api/join-family` - Join by family code

4. **Add Email Service**
   - Integrate with Resend, SendGrid, or similar
   - Send invitation emails with links

## Security Considerations

- Family code shares use strong random generation
- Invitation tokens are time-limited (7 days)
- RLS policies ensure members can only access their families
- Admin-only operations protected at database level
- Email verification required for new members

## Future Enhancements

- Family tree visualization by role
- Bulk invite functionality
- Family announcements/notifications
- Archive old family records
- Multi-family memberships
- Role-based data visibility

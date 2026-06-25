# Collaborative Family Tree - Complete Implementation Guide

## Project Overview

A fully functional collaborative family tree system where multiple family members can join a shared family tree, invite relatives with specific relationship types (uncle, aunt, father, mother, etc.), and grow the family tree together across generations.

## Database Schema Updates

### New Tables Created

1. **families** - Stores family information with unique codes
   - `family_code`: Shareable code (e.g., "SMITH-2024")
   - `visibility`: private/shared/public
   - `public_url_slug`: For public sharing links

2. **family_members** - Links users to families
   - Tracks role (admin, editor, member)
   - Records join dates

3. **relationship_roles** - Defines relationship types
   - Stores custom relationship names per family

4. **Updated people table**
   - New `family_id` field for collaborative access
   - Maintains backward compatibility

5. **Updated family_tree_invitations**
   - Added `family_id` for collaborative families
   - Added `relationship_type` field
   - Added `status` field (pending/accepted/rejected)

### Row Level Security (RLS)

Comprehensive policies implemented for:
- Family members can only view/edit their families
- Any family member can add/edit people in the family
- Admins manage family settings
- Public families visible to all
- Private details protected from public access

## New Components Created

### 1. CreateFamily (`components/create-family.tsx`)
**Purpose**: Create new collaborative families
- Auto-generates family codes
- Sets creator as admin
- Optional descriptions

**Usage**:
```tsx
<CreateFamily onSuccess={(familyId, code) => handleSuccess()} />
```

### 2. FamilyInvite (`components/family-invite.tsx`)
**Purpose**: Invite members by email with relationship roles
- 21+ relationship types supported
- 7-day invite expiration
- Email token generation ready

**Features**:
- Relationship type dropdown
- Email input validation
- Success/error handling

### 3. FamilyMemberDashboard (`components/family-member-dashboard.tsx`)
**Purpose**: Manage family members and invitations
- View all family members
- Display pending invitations
- Integrated invite system
- Sharing controls

**Tabs**:
- Members & Invites: View current members and pending
- Invite Member: Send new invitations
- Sharing: Configure visibility and sharing links

### 4. RelationshipSelector (`components/relationship-selector.tsx`)
**Purpose**: Select relationships between family members
- Browse family members
- Choose relationship type
- Display current relationships
- Remove relationships

### 5. FamilySharingSettings (`components/family-sharing-settings.tsx`)
**Purpose**: Control family visibility and sharing
- Toggle public/private
- Generate public sharing links
- Copy sharing link to clipboard
- Display privacy notes

### 6. FamilyMemberDashboard (Enhanced)
**Purpose**: Complete family management interface
- Multiple tabs for organization
- Member overview
- Invite interface
- Sharing controls

## New Pages Created

### `/app/family/page.tsx` - Family Management Hub
Complete family management interface:
- List user's families
- Create new family
- Select family to manage
- Access management tools

### `/app/accept-invite/page.tsx` - Invitation Acceptance
Handles invitation acceptance flow:
- Validates invitation token
- Checks expiration
- Displays family information
- Allows acceptance or rejection
- Adds user to family_members
- Redirects to dashboard

**Usage**: User clicks email link with `?token=xxxxx`

## System Architecture

```
User Journey:
├─ Create Family
│  ├─ Name & Code
│  ├─ Create family record
│  └─ Add creator as admin
│
├─ Invite Family Member
│  ├─ Enter email & relationship
│  ├─ Generate invitation token
│  ├─ Store in database
│  └─ Send email with link (future)
│
├─ Accept Invitation
│  ├─ Click email link
│  ├─ Validate token & expiration
│  ├─ Accept if new or existing user
│  ├─ Add to family_members
│  └─ Redirect to dashboard
│
└─ Manage Family
   ├─ View members
   ├─ Send more invites
   ├─ Configure sharing
   └─ Control visibility
```

## Relationship Types Supported

**Generational**:
- Father, Mother
- Son, Daughter
- Grandfather, Grandmother
- Grandson, Granddaughter

**Siblings**:
- Brother, Sister

**Extended Family**:
- Uncle, Aunt
- Cousin
- Nephew, Niece

**In-Laws**:
- Father-in-law, Mother-in-law
- Brother-in-law, Sister-in-law

**Other**:
- Spouse, Step-parents/siblings, Custom

## Key Features

### 1. Collaborative Access
- Multiple family members can edit
- Real-time data sync
- Permission-based access

### 2. Email Invitations
- Relationship role specification
- 7-day expiration
- Token-based acceptance
- Auto-add to family_members on acceptance

### 3. Public Sharing
- Generate public URLs
- Private details hidden from public
- Family code sharing
- Email invitations for members

### 4. Family Dashboard
- Overview of all families
- Member management
- Pending invites display
- Sharing controls

### 5. Security
- RLS policies at database level
- Token-based invitations
- Role-based permissions
- Time-limited invites

## Implementation Checklist

### Database Setup
- [ ] Run SQL migration in `scripts/create-tables.sql`
- [ ] Verify tables created in Supabase
- [ ] Verify RLS policies enabled
- [ ] Test sample queries

### Backend APIs (TODO)
- [ ] `/api/accept-invite` - Process invitation acceptance
- [ ] `/api/send-invite-email` - Send invitation emails (integrate with Resend/SendGrid)
- [ ] `/api/join-family-by-code` - Join using family code
- [ ] `/api/family/[id]/sharing` - Manage sharing settings

### Frontend Integration
- [ ] Add `/app/family` page to main navigation
- [ ] Update dashboard with family links
- [ ] Add family selector to person form
- [ ] Update family tree view for collaborative mode

### Email Service Setup
- [ ] Choose provider (Resend, SendGrid, etc.)
- [ ] Create email template for invitations
- [ ] Implement email sending logic
- [ ] Test email delivery

### Testing
- [ ] Test family creation
- [ ] Test invitation sending
- [ ] Test invitation acceptance
- [ ] Test permission boundaries
- [ ] Test public sharing
- [ ] Test collaborative editing

## API Endpoints Needed

### 1. `/api/accept-invite` (POST)
```json
Request: { "token": "xxxxx" }
Response: { "familyId": "uuid", "message": "success" }
```

### 2. `/api/send-invite-email` (POST)
```json
Request: {
  "familyId": "uuid",
  "email": "uncle@example.com",
  "relationshipType": "Uncle"
}
Response: { "success": true, "inviteId": "uuid" }
```

### 3. `/api/join-family-by-code` (POST)
```json
Request: { "familyCode": "SMITH-2024" }
Response: { "familyId": "uuid", "message": "joined" }
```

## Environment Variables Needed

```env
# Email Service (when implementing)
RESEND_API_KEY=xxx
SENDGRID_API_KEY=xxx

# Email Configuration
SENDER_EMAIL=noreply@familytree.com
SENDER_NAME="Family Tree"

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Example Workflow: Adding Your Paternal Uncle

1. **You create a family**
   - Name: "Smith Family"
   - Code: "SMITH-2024"
   - You become admin

2. **You invite your uncle**
   - Go to `/app/family`
   - Select family → Manage → Invite Member
   - Enter: `uncle@example.com`
   - Relationship: "Uncle"
   - Click Send

3. **Uncle receives email**
   - Clicks invitation link
   - Sees family info and relationship
   - Clicks "Accept Invitation"
   - Registers/logs in if needed
   - Added to family_members as "Member"

4. **Uncle can now**
   - View all family members
   - Add his family (wife, children)
   - Invite others (sister, cousins, etc.)
   - Manage relationships

5. **Family grows**
   - Multiple generations contributing
   - Shared family tree
   - Collaborative management
   - Central family hub

## Security Considerations

- Passwords hashed via Supabase Auth
- RLS enforces data access rules
- Invitation tokens expire in 7 days
- Public families hide sensitive contact info
- Admin-only operations protected
- Email verification recommended

## Future Enhancements

- [ ] Bulk invite functionality
- [ ] Family tree visualization by role
- [ ] Notifications for new members
- [ ] Family announcements
- [ ] Archive old records
- [ ] Multi-family memberships
- [ ] Mobile app version
- [ ] Advanced privacy controls
- [ ] Family tree export (PDF/image)
- [ ] Timeline view of family events

## Troubleshooting

### Invitation not sent
- Check email service configuration
- Verify SMTP credentials
- Check Supabase logs

### User can't accept invite
- Verify token validity
- Check expiration time
- Ensure family exists
- Check RLS policies

### Can't see family members
- Verify family_members record exists
- Check RLS policies
- Verify user authentication

### Sharing link not working
- Check public_url_slug generation
- Verify is_public = true
- Test link directly

## Support & Resources

- Database Schema: `scripts/create-tables.sql`
- Component Reference: `COLLABORATIVE_FAMILY_GUIDE.md`
- Components: `components/family-*`, `components/create-family.tsx`, `components/relationship-*`
- Pages: `/app/family`, `/app/accept-invite`

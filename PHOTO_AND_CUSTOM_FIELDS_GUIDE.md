# Photo and Custom Fields Implementation Guide

## Overview

This guide covers the new photo management and custom fields features added to the Family Tree application.

## New Features

### 1. Profile Photo with Visibility Toggle

Users can now:
- Upload a profile photo for each family member
- Toggle visibility of the profile photo (show/hide)
- The photo is stored in Supabase Storage with public access
- Photos are only displayed based on visibility settings

**Database Fields:**
- `profile_picture_url` - URL to the profile photo
- `profile_picture_visible` - Boolean to control visibility (default: true)

### 2. Additional Photos

Users can add multiple additional photos for each person with:
- Photo file upload
- Caption/description for each photo
- Show/hide toggle for each photo
- Delete individual photos

**Stored in JSONB format:**
```json
[
  {
    "url": "https://...",
    "caption": "Photo description",
    "visible": true
  }
]
```

### 3. Family Photos

Dedicated section for family group photos with:
- Multiple family photo uploads
- Description for each family photo
- Visibility control per photo
- Easy management and deletion

**Stored in JSONB format:**
```json
[
  {
    "url": "https://...",
    "caption": "Family reunion 2024",
    "visible": true
  }
]
```

### 4. Current City Field

New field to track where a family member currently resides:
- Separate from "Location" (birthplace/origin)
- Useful for knowing where family members live now
- Searchable and filterable

**Database Field:**
- `current_city` - Varchar(255) for current residence

### 5. Custom Form Fields

Advanced feature allowing users to create custom fields for family members:
- Add unlimited custom fields (name-value pairs)
- Custom fields are stored per person as JSONB
- Examples: Hobbies, Interests, Languages, Skills, etc.

**Database Fields:**
- `custom_fields` - JSONB object storing custom data
- Can store any key-value pairs

**Optional: Custom Field Templates (for future)**
- Users can create reusable field templates
- Templates stored in `custom_field_templates` table
- Includes: field_name, field_type, field_options, is_required

## Database Schema

### Updated `people` table

```sql
-- Photo management
profile_picture_visible BOOLEAN DEFAULT TRUE
additional_photos JSONB DEFAULT '[]'::jsonb
family_photos JSONB DEFAULT '[]'::jsonb

-- Current location
current_city VARCHAR(255)

-- Custom fields
custom_fields JSONB DEFAULT '{}'::jsonb
```

### New `custom_field_templates` table

```sql
CREATE TABLE custom_field_templates (
  id UUID PRIMARY KEY
  user_id UUID (References auth.users)
  field_name VARCHAR(255)
  field_type VARCHAR(50) -- text, number, date, select, checkbox, textarea
  field_options JSONB -- For select/checkbox options
  is_required BOOLEAN DEFAULT FALSE
  display_order INT DEFAULT 0
  created_at TIMESTAMP
)
```

## Usage Examples

### Adding a Person with Photos

1. **Profile Photo**
   - Upload main profile picture
   - Toggle visibility (visible by default)
   - Photo shows in person's main profile

2. **Additional Photos**
   - Click "Add Additional Photo"
   - Select photo file
   - Add optional caption
   - Toggle visibility
   - Can add unlimited photos

3. **Family Photos**
   - Click "Add Family Photo"
   - Upload group/family photos
   - Add description
   - Control visibility

4. **Custom Fields**
   - Click "Add Custom Field"
   - Enter field name (e.g., "Hobbies")
   - Enter field value (e.g., "Photography, Tennis")
   - Can add unlimited fields

### Visibility Control

**Profile Photo Visibility:**
- When visible: Photo appears on person's profile
- When hidden: Photo is stored but not displayed publicly
- Users can toggle at any time after creation

**Per-Photo Visibility:**
- Each additional/family photo has independent visibility
- Mix of visible and hidden photos possible
- Update visibility without deleting photos

### Search and Filter

Photos and custom fields are stored in JSONB, allowing:
- Full-text search on custom field values
- Filter by custom field presence
- Query photos by visibility status

Example query:
```sql
SELECT * FROM people 
WHERE custom_fields->>'hobbies' ILIKE '%photography%'
  AND family_photos @> '[{"visible": true}]'
```

## Frontend Implementation

### PersonForm Component

**State Management:**
```typescript
const [profileImageVisible, setProfileImageVisible] = useState(true)
const [additionalPhotos, setAdditionalPhotos] = useState<Array<{
  file: File
  caption: string
  visible: boolean
}>>([])
const [familyPhotos, setFamilyPhotos] = useState<Array<{
  file: File
  caption: string
  visible: boolean
}>>([])
const [customFields, setCustomFields] = useState<Array<{
  name: string
  value: string
}>>([])
```

**Photo Upload:**
- Uses Supabase Storage
- Stores in `profile-pictures` bucket
- Public read access
- Authenticated upload required

**Custom Fields Storage:**
- Converted to JSON object before submission
- Example: `{ "hobbies": "Tennis", "languages": "English, Spanish" }`

### UI Components

**Visibility Toggles:**
- Eye/EyeOff icons from lucide-react
- Click to toggle visibility
- Visual feedback

**Photo Management:**
- Add button for each photo type
- Caption input field
- Visibility toggle per photo
- Delete button with trash icon
- Clean card-based layout

**Custom Fields:**
- Field name input
- Field value input
- Add/delete buttons
- Simple key-value interface

## Security Considerations

### Row Level Security (RLS)

All photo and custom field data is protected by:
- Users can only view/edit their own data
- Family tree collaborators can view shared data
- Public shares respect visibility settings

### Photo Storage

- Photos stored in public bucket
- URLs generated at upload time
- Delete photos when person is deleted (cascade)
- File names include user ID for isolation

### Custom Fields

- Stored with person data
- Protected by same RLS policies as person records
- No sensitive data exposure
- JSONB allows flexible schema

## API Integration

### Retrieving Photos in Public API

```json
{
  "id": "...",
  "first_name": "John",
  "profile_picture_url": "https://...",
  "profile_picture_visible": true,
  "additional_photos": [
    {"url": "https://...", "caption": "...", "visible": true}
  ],
  "family_photos": [
    {"url": "https://...", "caption": "...", "visible": true}
  ]
}
```

### Filtering by Visibility

Only return visible photos in public API responses:
```typescript
const visiblePhotos = person.additional_photos.filter(p => p.visible)
```

## Future Enhancements

1. **Photo Gallery**
   - Lightbox view for photos
   - Slideshow functionality
   - Photo organization/ordering

2. **Advanced Custom Fields**
   - Field type validation (email, phone, URL)
   - Conditional fields
   - Field templates for reuse

3. **Photo Sharing**
   - Share specific photos on social media
   - Photo albums
   - Photo permissions

4. **Search and Filter**
   - Search by custom field values
   - Filter people by photo presence
   - Advanced field queries

## Migration Notes

### For Existing Users

Run the SQL migration to add new columns:

```sql
-- Add photo fields
ALTER TABLE people ADD COLUMN profile_picture_visible BOOLEAN DEFAULT TRUE;
ALTER TABLE people ADD COLUMN additional_photos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE people ADD COLUMN family_photos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE people ADD COLUMN current_city VARCHAR(255);
ALTER TABLE people ADD COLUMN custom_fields JSONB DEFAULT '{}'::jsonb;

-- Create custom field templates table
CREATE TABLE custom_field_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  field_name VARCHAR(255) NOT NULL,
  field_type VARCHAR(50) NOT NULL,
  field_options JSONB,
  is_required BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, field_name)
);

ALTER TABLE custom_field_templates ENABLE ROW LEVEL SECURITY;
```

## Troubleshooting

### Photos Not Uploading

- Check file size limits
- Ensure authenticated session
- Verify bucket permissions
- Check browser console for errors

### Custom Fields Not Saving

- Verify field name is not empty
- Check JSON encoding
- Clear browser cache
- Check database storage quota

### Visibility Not Working

- Ensure `profile_picture_visible` is set
- Check public API filtering logic
- Verify person is fetched with all fields

## Testing Checklist

- [ ] Upload profile photo
- [ ] Toggle profile photo visibility
- [ ] Add multiple additional photos
- [ ] Delete additional photos
- [ ] Update photo captions
- [ ] Add family photos
- [ ] Toggle family photo visibility
- [ ] Add custom fields
- [ ] Edit custom field values
- [ ] Delete custom fields
- [ ] Update current city
- [ ] Verify photos display in public profiles
- [ ] Verify visibility settings respected
- [ ] Test with multiple people
- [ ] Test photo uploads with large files
- [ ] Test custom fields with special characters

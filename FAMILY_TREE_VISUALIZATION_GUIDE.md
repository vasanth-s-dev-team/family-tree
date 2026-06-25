# Family Tree Visualization Guide

## Overview

Your family tree app now features beautiful, interactive visualizations that display multi-generational family hierarchies with public and private visibility controls.

## Key Features

### 1. Interactive Visualization Component
The `InteractiveFamilyTree` component displays:
- **Hierarchical Layout**: Family members arranged by generation
- **Visual Connectors**: Lines showing parent-child relationships and marriages
- **Profile Cards**: Each person shown with avatar, name, spouse, occupation, and location
- **Expandable Nodes**: Click to show/hide children to reduce visual clutter
- **Responsive Design**: Works on desktop, tablet, and mobile

### 2. Public/Private Toggle
Each family tree can be marked as:
- **Public**: Visible to anyone with the link (badge shows 🌍 icon)
- **Private**: Only visible to family members (badge shows 🔒 icon)

Both modes use the same visualization, just with different access controls.

### 3. Ambani Family Example
The demo page (`/family-tree-demo`) shows the Ambani family structure:
```
Dhirubhai Ambani (Patriarch)
├── Mukesh Ambani + Nita
│   ├── Akash + Shloka
│   │   ├── Prithvi
│   │   └── Veda
│   ├── Isha + Anand
│   │   ├── Krishna
│   │   └── Aadiya
│   └── Anant + Radhika
├── Anil + Tina
│   ├── Jai Anmol + Krisha
│   └── Jai Anshul
└── Nina (Daughter)
```

## Component Usage

### Basic Usage

```tsx
import { InteractiveFamilyTree } from '@/components/interactive-family-tree'

const familyData = {
  id: '1',
  name: 'Grandparent',
  relationship: 'Patriarch',
  spouse: 'Grandparent Spouse',
  occupation: 'Retired',
  location: 'City, Country',
  children: [
    {
      id: '2',
      name: 'Parent',
      relationship: 'Son',
      spouse: 'Parent Spouse',
      occupation: 'Engineer',
      location: 'City, Country',
      children: [
        {
          id: '3',
          name: 'Child',
          relationship: 'Grandson',
          occupation: 'Student',
          location: 'City, Country',
          children: []
        }
      ]
    }
  ]
}

export default function MyFamilyTree() {
  return (
    <InteractiveFamilyTree 
      rootMember={familyData}
      isPublic={true}
      showDetails={true}
    />
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rootMember` | `FamilyMember` | Required | The root/top person in the tree |
| `isPublic` | `boolean` | `false` | Whether the tree is publicly visible |
| `showDetails` | `boolean` | `true` | Whether to show member details |

### FamilyMember Structure

```typescript
interface FamilyMember {
  id: string              // Unique identifier
  name: string            // Full name
  relationship?: string   // Relationship type (e.g., "Son", "Daughter", "Grandson")
  spouse?: string         // Spouse's name (if married)
  dateOfBirth?: string    // Birth date
  occupation?: string     // Occupation/profession
  location?: string       // Current location/city
  photo?: string          // Profile photo URL
  children?: FamilyMember[] // Array of children
}
```

## Visual Design

### Color Scheme
- **Primary Blue**: #3b82f6 (person cards background)
- **Accent Indigo**: #4f46e5 (gradients and accents)
- **Connector Lines**: Gradient blue for relationships
- **Heart Icon**: Red (#ef4444) for married couples

### Card Features
- Circular initials avatar
- Name displayed prominently
- Relationship badge (colored)
- Spouse link with heart icon
- Occupation and location
- Expandable children section

### Layout
- Cards organized by generation (top to bottom)
- Horizontal spacing between siblings
- Connecting lines show relationships
- Mobile-responsive grid layout

## Features Explained

### 1. Expandable/Collapsible Nodes
Click the "children" indicator to show/hide descendants. Useful for:
- Viewing large families without overwhelming the screen
- Focusing on specific family branches
- Reducing vertical scroll distance

### 2. Visibility Badges
- **Public** (🌍 Green): Anyone with the link can view
- **Private** (🔒 Gray): Only family members can access

### 3. Interactive Elements
- **Hover Effect**: Cards scale and change border color
- **Clickable Buttons**: Expand/collapse children
- **Share Button**: Copy link or share to social media
- **Legend**: Shows what icons/colors mean

## Integration with Your App

### Step 1: Fetch Family Data from Database

```tsx
const getFamilyData = async (familyId: string) => {
  const { data } = await supabase
    .from('people')
    .select('*')
    .eq('family_id', familyId)
  
  // Transform flat data into hierarchical structure
  return buildFamilyHierarchy(data)
}
```

### Step 2: Display in Family Dashboard

```tsx
import { InteractiveFamilyTree } from '@/components/interactive-family-tree'

export default function FamilyDashboard({ familyId, isPublic }) {
  const [familyTree, setFamilyTree] = useState(null)
  
  useEffect(() => {
    getFamilyData(familyId).then(setFamilyTree)
  }, [familyId])
  
  return (
    <InteractiveFamilyTree 
      rootMember={familyTree} 
      isPublic={isPublic}
    />
  )
}
```

### Step 3: Add Share Functionality

```tsx
const handleShare = () => {
  const shareUrl = `${window.location.origin}/family/${familyId}`
  navigator.clipboard.writeText(shareUrl)
  toast.success('Link copied!')
}
```

## Demo Page

Visit `/family-tree-demo` to see:
- Live example with Ambani family data
- Public tree visualization
- Share button demonstration
- Feature overview with icons
- Usage instructions

## Customization

### Change Colors
Update `globals.css` theme tokens:
```css
@theme {
  --color-primary: #3b82f6;
  --color-accent: #4f46e5;
}
```

### Add More Details
Extend `FamilyMember` interface with additional fields:
```typescript
interface FamilyMember {
  // ... existing fields
  email?: string
  phone?: string
  bio?: string
  photos?: Array<{url: string; caption: string}>
}
```

### Custom Relationship Types
Update relationship badges:
```tsx
const relationshipColors = {
  'Son': 'bg-blue-500',
  'Daughter': 'bg-pink-500',
  'Grandson': 'bg-blue-400',
  'Uncle': 'bg-purple-500',
  // Add more...
}
```

## Public vs Private Trees

### Public Tree
- Visible to anyone with the link
- No authentication required
- Shows basic information only
- Includes public photos

### Private Tree
- Requires family member authentication
- Shows all details (contact info, bio, etc.)
- Personal photos visible
- Edit permissions for family members

## Performance Optimization

For large families (100+ members):
- Use lazy loading for deeply nested children
- Paginate siblings (show 5 at a time)
- Implement virtual scrolling
- Cache hierarchical structure

## Troubleshooting

### Trees not showing
- Check that `rootMember` has valid structure
- Verify `children` array exists (even if empty)
- Ensure all IDs are unique

### Styling issues
- Clear browser cache
- Check that `globals.css` loads
- Verify Tailwind classes are included

### Performance slow
- Reduce number of visible generations
- Limit initial visible children count
- Implement pagination for siblings

## Next Steps

1. **Integrate with your database**: Replace hardcoded Ambani data with real family data
2. **Add edit functionality**: Allow family members to update tree structure
3. **Implement sharing**: Social media integration and email invites
4. **Add analytics**: Track public tree views
5. **Mobile optimization**: Ensure responsive design works well

## Support

For questions or issues, refer to:
- Component code: `/components/interactive-family-tree.tsx`
- Demo page: `/app/family-tree-demo/page.tsx`
- Database schema: `/scripts/create-tables.sql`

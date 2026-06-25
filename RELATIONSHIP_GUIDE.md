# Family Relationship Management Guide

## Overview

The Relationship Manager allows you to connect family members and establish parent-child and spouse relationships in your family tree.

## How to Use

### Step 1: Add Family Members First
Before creating relationships, make sure you have added at least 2 family members:
1. Go to the **"Add Member"** tab
2. Fill in the family member's information
3. Click **"Add Family Member"**

Example:
- Person A: John (Father)
- Person B: Sarah (Daughter)
- Person C: Emma (Mother of Sarah)

### Step 2: Create Relationships

1. Click the **"Relationships"** tab
2. In the "Manage Family Relationships" section:
   - **Select Person**: Choose the person you want to connect (e.g., Sarah)
   - **Relationship Type**: Choose either "Add Parent" or "Add Spouse"
   - **Select Relative**: Choose the family member to connect (e.g., John as parent)
   - Click **"Add Parent Relationship"** or **"Add Spouse Relationship"**

### Step 3: View All Relationships

In the "Current Relationships" section, you can see:
- All family members and their connections
- Parent relationships (one-to-one)
- Spouse relationships (bidirectional - automatically connects both people)

## Relationship Types

### Parent-Child Relationship
- One child can have one parent specified
- However, you can add multiple children to one parent
- Represents biological or adoptive parent-child connection

Example:
- John (Parent) → Sarah (Child)
- John (Parent) → Tom (Child)
- Emma (Parent) → Sarah (Child)

### Spouse Relationship
- One person can have one spouse
- When you set A as spouse of B, B is automatically set as spouse of A
- Bidirectional connection (automatic)

Example:
- John ↔ Emma (automatically set for both)

## Common Scenarios

### Scenario 1: Simple Nuclear Family
1. Add members: Grandfather, Grandmother, Father, Mother, Child
2. Set Grandfather as parent of Father
3. Set Grandmother as spouse of Grandfather
4. Set Father as spouse of Mother
5. Set Father as parent of Child

### Scenario 2: Extended Family
1. Add all family members
2. Create parent-child relationships across generations
3. Set spouse relationships for couples
4. Repeat for each family line

### Scenario 3: Removing Incorrect Relationships
1. Find the relationship in "Current Relationships"
2. Click the "Remove" button next to it
3. The relationship will be deleted

## Database Storage

Relationships are stored in the `people` table:
- **parent_id**: UUID pointing to parent person
- **spouse_id**: UUID pointing to spouse person

These relationships are automatically propagated when needed.

## Limitations

- Each person can have only ONE parent set (though a person actually has two biological parents)
- Each person can have only ONE spouse set
- Relationships are stored at the person level in the database

## Future Enhancements

Planned improvements:
1. Support for multiple parents (mother and father)
2. Sibling relationships
3. Grandparent/grandchild quick connections
4. Visual family tree diagram showing all relationships
5. Relationship strength or type (adopted, step-parent, etc.)

## Troubleshooting

### "Could not find person" error
- Make sure both people are already added to the family tree
- Try refreshing the page and reloading the relationships

### Bidirectional spouse not working
- For spouse relationships, refresh the page to see both connections
- Both people should show each other as spouses

### Changing a parent/spouse
- Simply set a new parent/spouse, which will overwrite the old one
- There's no conflict - the latest relationship always wins

## Tips

1. Start with the oldest generation first (grandparents, parents)
2. Work your way down (children, grandchildren)
3. Create spouse relationships once you have both people added
4. Use the "Current Relationships" view frequently to verify your connections
5. Test relationships by viewing the Family Tree tab to see the connections visualized

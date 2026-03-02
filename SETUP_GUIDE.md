# Family Tree Application - Setup Guide

Your Family Tree application is almost ready! Follow these steps to complete the setup.

## Step 1: Run the SQL Script in Supabase

The application requires a database schema. You need to run the SQL script to create the necessary tables.

### Instructions:

1. **Go to Supabase Dashboard**
   - Open [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Open SQL Editor**
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New Query"**

3. **Copy the SQL Script**
   - Copy the SQL code from `scripts/create-tables.sql`
   - Paste it into the SQL editor

4. **Execute the Script**
   - Click the **"RUN"** button (or press Ctrl+Enter)
   - Wait for success confirmation

The SQL script will:
- Create the `people` table for storing family member information
- Set up Row Level Security (RLS) to protect user data
- Create a storage bucket for profile pictures
- Add necessary indexes for performance

## Step 2: Verify Environment Variables

Your `.env.local` file should contain your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**To get these values:**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings → API**
4. Copy the **Project URL** and **anon/public key**

## Step 3: Restart Your Development Server

After updating environment variables:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Step 4: Test the Application

### Test Account:
- **Email:** `demo@familytree.com`
- **Password:** `DemoPassword123!`

### Or Create Your Own:
1. Click **"Need an account? Sign up"**
2. Enter your email and password
3. Click **"Sign Up"**

## Features

Once set up, you can:

### Dashboard
- View family statistics
- See total members, living members, and marriages
- Browse recent family members

### Add Members
- Add family members with first and last name
- Record dates of birth and death
- Track marriage dates
- Upload profile pictures
- Add special occasions (graduations, anniversaries, etc.)

### Family Tree
- View visual representation of your family relationships
- See all family members and their connections
- Track parent-child relationships and spouses

## Data Structure

### People Table
Each family member has:
- **First Name** - Required
- **Last Name** - Required
- **Date of Birth** - Optional
- **Date of Death** - Optional
- **Marriage Date** - Optional
- **Profile Picture** - Optional (stored in Supabase Storage)
- **Special Occasions** - Optional (stored as dates/events)
- **Relationships** - Optional (parent, spouse connections)

## Security

All data is protected with Row Level Security (RLS):
- Users can only see and manage their own family data
- Family members are automatically associated with the logged-in user
- Profile pictures are securely stored in Supabase Storage

## Mobile Version

The web app is fully responsive and works great on mobile devices. For a native mobile app, you can use React Native with the same Supabase backend.

## Troubleshooting

### "Failed to fetch" Error
- Verify your `.env.local` file has correct credentials
- Check that your Supabase project is active
- Restart your development server

### "Invalid login credentials"
- Use the demo account provided above
- Or create a new account through the sign-up form

### "Table people does not exist"
- Run the SQL script from `scripts/create-tables.sql` in your Supabase dashboard
- Verify the script executed successfully

### Profile Picture Upload Fails
- Ensure the `profile-pictures` storage bucket exists in Supabase
- Check that the bucket has appropriate permissions

## Getting Help

If you encounter issues:
1. Check the browser console for error messages (F12)
2. Check the Supabase dashboard for database/auth errors
3. Verify all environment variables are set correctly
4. Ensure the database tables were created successfully

## Next Steps

1. Create your first family member account
2. Add yourself and family members
3. Upload profile pictures
4. Build out your complete family tree
5. Share the app with family members (after deployment)

## Deployment

To deploy to production:
1. Push your code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel project settings
4. Deploy with one click!

Enjoy building your family tree! 🌳

import { createBrowserClient } from "@supabase/ssr"

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Log for debugging
  console.log("[v0] Supabase URL available:", !!url)
  console.log("[v0] Supabase Key available:", !!key)

  if (!url || !key) {
    const errorMsg = `
    Missing Supabase environment variables!
    
    Please ensure your .env.local file contains:
    - NEXT_PUBLIC_SUPABASE_URL
    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    These should be automatically set from your Vercel environment.
    If missing, check your Vercel project settings > Environment Variables.
    `
    console.error("[v0]", errorMsg)
    throw new Error(errorMsg)
  }

  return createBrowserClient(url, key)
}

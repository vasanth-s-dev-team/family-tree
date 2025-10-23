import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Debug logging to help troubleshoot
  console.log("Supabase URL:", supabaseUrl ? "Set" : "Not set")
  console.log("Supabase Anon Key:", supabaseAnonKey ? "Set" : "Not set")

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables. 
      NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "Set" : "Missing"}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? "Set" : "Missing"}
      
      Please ensure your .env.local file contains:
      NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`,
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

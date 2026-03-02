import { createBrowserClient } from "@supabase/ssr"

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export const createClient = () => {
  // Return cached instance if available
  if (clientInstance) {
    return clientInstance
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables")
  }

  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    throw new Error("Invalid Supabase URL format")
  }

  try {
    new URL(url)
  } catch (e) {
    throw new Error("Invalid Supabase URL format")
  }

  try {
    clientInstance = createBrowserClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
    return clientInstance
  } catch (error) {
    console.error("[v0] Failed to create Supabase client:", error)
    throw error
  }
}

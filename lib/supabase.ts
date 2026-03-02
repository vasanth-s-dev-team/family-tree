import { createBrowserClient } from "@supabase/ssr"

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Log for debugging
  console.log("[v0] Supabase URL:", url ? url.substring(0, 30) + "..." : "NOT SET")
  console.log("[v0] Supabase Key:", key ? key.substring(0, 20) + "..." : "NOT SET")

  if (!url || !key) {
    const errorMsg = `Missing Supabase environment variables!`
    console.error("[v0]", errorMsg)
    throw new Error(errorMsg)
  }

  // Validate URL format
  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    console.error("[v0] Invalid Supabase URL format:", url)
    throw new Error(`Invalid Supabase URL. Must start with https:// or http://, got: ${url}`)
  }

  // Validate it's a proper URL
  try {
    new URL(url)
  } catch (e) {
    console.error("[v0] URL validation failed:", url, e)
    throw new Error(`Invalid Supabase URL format: ${url}`)
  }

  try {
    return createBrowserClient(url, key)
  } catch (error) {
    console.error("[v0] Failed to create Supabase client:", error)
    throw error
  }
}

"use client"

import { useEffect, useState } from "react"
import { FamilyTreeDashboard } from "@/components/family-tree-dashboard"
import { LoginCard } from "@/components/login-card"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          setError(sessionError.message)
        } else {
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setError(error instanceof Error ? error.message : "Failed to check authentication")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (error) {
    const isMissingEnvVars = error.includes("Supabase environment variables") || error.includes("Missing Supabase")
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          
          {isMissingEnvVars ? (
            <>
              <p className="text-gray-700 mb-4">Missing Supabase environment variables.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
                <p className="text-sm font-semibold text-yellow-900 mb-3">Solution:</p>
                <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
                  <li>Your Supabase integration is connected to Vercel</li>
                  <li>The environment variables are available in Vercel</li>
                  <li>You need to restart your local dev server to load them</li>
                  <li>Run: <code className="bg-yellow-100 px-2 py-1 rounded">npm run dev</code></li>
                  <li>Then refresh this page</li>
                </ol>
              </div>
              <p className="text-xs text-gray-500">The variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your Vercel environment and should be available to your local dev server.</p>
            </>
          ) : (
            <>
              <p className="text-gray-700 mb-4">{error}</p>
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-blue-900">Please check the browser console for more details.</p>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginCard />
  }

  return <FamilyTreeDashboard user={user} />
}

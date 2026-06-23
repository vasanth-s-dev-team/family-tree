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
        const errorMsg = error instanceof Error ? error.message : "Failed to check authentication"
        console.error("[v0] Auth check error:", errorMsg)
        setError(errorMsg)
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
    const isMissingEnvVars = error.includes("Missing Supabase environment variables")
    const isInvalidURL = error.includes("Invalid") && error.includes("URL")
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Supabase Configuration Error</h1>
          
          {isMissingEnvVars && (
            <>
              <p className="text-gray-700 mb-4">Missing required environment variables.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
                <p className="text-sm font-semibold text-yellow-900 mb-2">Your Supabase integration is connected! But environment variables need to be loaded.</p>
                <p className="text-sm text-yellow-800">Refresh the page - the variables should load automatically.</p>
              </div>
            </>
          )}
          
          {isInvalidURL && (
            <>
              <p className="text-gray-700 mb-4">The Supabase URL is invalid or not properly set.</p>
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                <p className="text-sm text-blue-900 mb-2">This usually means:</p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>The Supabase integration is not properly configured</li>
                  <li>Environment variables haven't loaded yet</li>
                  <li>Your Supabase URL is missing or malformed</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500 mt-4">Try refreshing the page. Check browser console for details.</p>
            </>
          )}
          
          {!isMissingEnvVars && !isInvalidURL && (
            <>
              <p className="text-gray-700 mb-4 font-mono text-sm">{error}</p>
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-blue-900">Check your browser console (F12) for more debugging information.</p>
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

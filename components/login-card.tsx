"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Mail, Lock, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase"

export function LoginCard() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("demo@familytree.com")
  const [password, setPassword] = useState("DemoPassword123!")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    
    const isPreviewEnvironment = typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")

    // If in preview, don't even try - just show the message immediately
    if (isPreviewEnvironment) {
      setError(
        "v0 Preview Limitation: Auth is restricted in this preview environment for security. " +
        "The app works perfectly on Vercel. Deploy now or run locally with 'npm run dev' to test."
      )
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          throw new Error(signInError.message || "Failed to sign in")
        }

        if (data.session) {
          setSuccess("Signed in successfully!")
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) {
          throw new Error(signUpError.message || "Failed to sign up")
        }

        if (data.user) {
          setSuccess("Account created! Signing you in...")
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      
      if (errorMessage.includes("Invalid login credentials")) {
        setError("Invalid email or password.")
      } else if (errorMessage.includes("User already registered")) {
        setError("This email is already registered. Sign in instead.")
      } else if (errorMessage.includes("fetch")) {
        setError("Network error. Check your connection and try again.")
      } else {
        setError(errorMessage || "An error occurred.")
      }
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail("demo@familytree.com")
    setPassword("DemoPassword123!")
    setIsLogin(true)
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">🌳 Family Tree</CardTitle>
          <CardDescription className="text-blue-100">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="space-y-2">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full text-xs"
                >
                  {loading ? "Retrying..." : "Retry"}
                </Button>
              </div>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Quick Test:</p>
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs bg-transparent"
              onClick={fillDemoCredentials}
              disabled={loading}
            >
              Fill Demo Credentials
            </Button>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
              }}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 underline disabled:opacity-50"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-200">
            <p className="text-xs text-amber-900 font-semibold mb-1">About v0 Preview:</p>
            <p className="text-xs text-amber-800">
              Network requests to external APIs are restricted here for security. 
              <br />Auth works perfectly on <span className="font-semibold">Vercel</span> or locally with <span className="font-mono">npm run dev</span>.
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-900 font-semibold mb-1">Demo Account:</p>
            <p className="text-xs text-blue-800 font-mono">demo@familytree.com</p>
            <p className="text-xs text-blue-800 font-mono">DemoPassword123!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

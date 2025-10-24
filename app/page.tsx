import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import FamilyTreeDashboard from "@/components/family-tree-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default async function HomePage() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/auth/login")
    }

    return <FamilyTreeDashboard userId={user.id} />
  } catch (error) {
    console.error("Error:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-red-600">Configuration Error</CardTitle>
            <CardDescription>Supabase is not properly configured</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription className="text-sm">
                {error instanceof Error ? error.message : "Unknown configuration error"}
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-semibold mb-2">To fix this issue:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Ensure your .env.local file is in the project root</li>
                <li>Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set</li>
                <li>Restart your development server</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

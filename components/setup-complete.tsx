"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Info } from "lucide-react"

export function SetupComplete() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Your Supabase integration is complete! You're ready to start building your family tree.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">What you can do now:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>✓ Add family members with their information</li>
              <li>✓ Upload profile pictures for each family member</li>
              <li>✓ Record important dates (births, deaths, marriages)</li>
              <li>✓ Track special occasions and events</li>
              <li>✓ View your family tree structure</li>
              <li>✓ Track living and deceased family members</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Next Steps:</h3>
            <ol className="space-y-1 text-sm text-gray-700 list-decimal list-inside">
              <li>Click on the "Add Member" tab</li>
              <li>Fill in the family member's information</li>
              <li>Upload a profile picture (optional)</li>
              <li>Add any special occasions or important dates</li>
              <li>View your growing family tree in the "Family Tree" tab</li>
            </ol>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-xs font-semibold text-blue-900 mb-1">Demo Account Available:</p>
            <p className="text-xs text-blue-800 font-mono">Email: demo@familytree.com</p>
            <p className="text-xs text-blue-800 font-mono">Password: DemoPassword123!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

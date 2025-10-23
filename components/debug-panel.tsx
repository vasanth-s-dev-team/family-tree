"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function DebugPanel() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const checks = [
    {
      name: "NEXT_PUBLIC_SUPABASE_URL",
      value: supabaseUrl,
      status: supabaseUrl ? "success" : "error",
      message: supabaseUrl ? "Environment variable is set" : "Environment variable is missing",
    },
    {
      name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      value: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : undefined,
      status: supabaseAnonKey ? "success" : "error",
      message: supabaseAnonKey ? "Environment variable is set" : "Environment variable is missing",
    },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Configuration Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {checks.map((check) => (
          <div key={check.name} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {check.status === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <div className="font-medium">{check.name}</div>
                <div className="text-sm text-gray-600">{check.message}</div>
                {check.value && <div className="text-xs text-gray-500 mt-1">Value: {check.value}</div>}
              </div>
            </div>
            <Badge variant={check.status === "success" ? "default" : "destructive"}>
              {check.status === "success" ? "OK" : "ERROR"}
            </Badge>
          </div>
        ))}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Troubleshooting Steps:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>
              Ensure your file is named <code className="bg-blue-100 px-1 rounded">.env.local</code> (not .env)
            </li>
            <li>Restart your development server after adding environment variables</li>
            <li>Check that there are no extra spaces or quotes around the values</li>
            <li>Verify your Supabase project URL and anon key are correct</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

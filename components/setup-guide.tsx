import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Circle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SetupStep {
  id: string
  title: string
  description: string
  completed: boolean
  action?: string
  link?: string
}

export default function SetupGuide() {
  const steps: SetupStep[] = [
    {
      id: "supabase",
      title: "Set up Supabase Integration",
      description: "Connect your Supabase project to enable authentication and database functionality",
      completed: false,
      action: "Add Supabase Integration",
    },
    {
      id: "database",
      title: "Run Database Setup",
      description: "Execute the SQL script to create the necessary tables and security policies",
      completed: false,
      action: "Run SQL Script",
    },
    {
      id: "storage",
      title: "Configure File Storage",
      description: "Set up storage bucket for profile pictures (included in SQL script)",
      completed: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Family Tree</CardTitle>
          <CardDescription>Complete these steps to get started with your family tree application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertDescription>
              Your Family Tree application needs to be configured before you can start adding family members.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">
                    Step {index + 1}: {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  {step.action && (
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      {step.action}
                      {step.link && <ExternalLink className="h-3 w-3 ml-1" />}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Quick Setup Instructions:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Click "Add Supabase Integration" in the integrations panel</li>
              <li>Run the SQL script from the scripts folder to set up your database</li>
              <li>Refresh this page to start using your family tree</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

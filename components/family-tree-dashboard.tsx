"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Users, LogOut, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import PersonForm from "./person-form"
import FamilyTreeView from "./family-tree-view"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Person {
  id: string
  first_name: string
  last_name: string
  date_of_birth?: string
  date_of_death?: string
  marriage_date?: string
  profile_picture?: string
  special_occasions?: any[]
  parent_id?: string
  spouse_id?: string
  created_at: string
}

export default function FamilyTreeDashboard() {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showPersonForm, setShowPersonForm] = useState(false)
  const [editingPerson, setEditingPerson] = useState<Person | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchPeople()
  }, [])

  const fetchPeople = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("people").select("*").order("created_at", { ascending: false })

      if (error) {
        setError(`Error fetching people: ${error.message}`)
        console.error("Error fetching people:", error)
      } else {
        setPeople(data || [])
        setError("")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to database")
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  const handlePersonSaved = () => {
    fetchPeople()
    setShowPersonForm(false)
    setEditingPerson(null)
  }

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person)
    setShowPersonForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-red-600">Database Error</CardTitle>
            <CardDescription>Unable to connect to the database</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
            <div className="mt-4 space-y-2">
              <Button onClick={fetchPeople} className="w-full">
                Retry Connection
              </Button>
              <Button variant="outline" onClick={handleLogout} className="w-full bg-transparent">
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Family Tree</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={showPersonForm} onOpenChange={setShowPersonForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Person
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingPerson ? "Edit Person" : "Add New Person"}</DialogTitle>
                  </DialogHeader>
                  <PersonForm person={editingPerson} onSave={handlePersonSaved} people={people} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Family Tree</CardTitle>
                <CardDescription>Visual representation of your family relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <FamilyTreeView people={people} onEditPerson={handleEditPerson} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Family Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Members</span>
                    <span className="text-sm text-gray-600">{people.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Living Members</span>
                    <span className="text-sm text-gray-600">{people.filter((p) => !p.date_of_death).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Married Members</span>
                    <span className="text-sm text-gray-600">{people.filter((p) => p.marriage_date).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Additions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {people.slice(0, 5).map((person) => (
                    <div key={person.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {person.first_name[0]}
                          {person.last_name[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {person.first_name} {person.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Added {new Date(person.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

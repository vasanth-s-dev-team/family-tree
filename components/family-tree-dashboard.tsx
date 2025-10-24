"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Plus, Users } from "lucide-react"
import PersonForm from "./person-form"
import FamilyTreeView from "./family-tree-view"
import { useToast } from "@/hooks/use-toast"

interface Person {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  date_of_death: string | null
  marriage_date: string | null
  profile_picture_url: string | null
  user_id: string
  parent_id: string | null
  spouse_id: string | null
  special_occasions: string | null
}

export default function FamilyTreeDashboard({ userId }: { userId: string }) {
  const [people, setPeople] = useState<Person[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchPeople()
  }, [])

  const fetchPeople = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase.from("people").select("*").eq("user_id", userId)

      if (error) throw error
      setPeople(data || [])
    } catch (error) {
      console.error("Error fetching people:", error)
      toast({
        title: "Error",
        description: "Failed to fetch family members",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const handlePersonAdded = () => {
    fetchPeople()
    setShowForm(false)
    toast({
      title: "Success",
      description: "Family member added successfully",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Family Tree</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">Loading family members...</p>
                </CardContent>
              </Card>
            ) : people.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500 mb-4">No family members added yet</p>
                  <Button onClick={() => setShowForm(true)} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Family Member
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <FamilyTreeView people={people} onPersonSelect={setSelectedPerson} />
            )}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Family Members ({people.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={() => setShowForm(!showForm)} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>

                {showForm && (
                  <div className="mt-4 border-t pt-4">
                    <PersonForm userId={userId} onPersonAdded={handlePersonAdded} />
                  </div>
                )}

                {people.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-sm mb-2">Members List</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {people.map((person) => (
                        <button
                          key={person.id}
                          onClick={() => setSelectedPerson(person)}
                          className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                            selectedPerson?.id === person.id ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="font-medium">
                            {person.first_name} {person.last_name}
                          </div>
                          {person.date_of_birth && (
                            <div className="text-xs text-gray-600">
                              b. {new Date(person.date_of_birth).toLocaleDateString()}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedPerson && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPerson.profile_picture_url && (
                    <img
                      src={selectedPerson.profile_picture_url || "/placeholder.svg"}
                      alt={`${selectedPerson.first_name} ${selectedPerson.last_name}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold">
                      {selectedPerson.first_name} {selectedPerson.last_name}
                    </h4>
                    {selectedPerson.date_of_birth && (
                      <p className="text-sm text-gray-600">
                        Born: {new Date(selectedPerson.date_of_birth).toLocaleDateString()}
                      </p>
                    )}
                    {selectedPerson.date_of_death && (
                      <p className="text-sm text-gray-600">
                        Died: {new Date(selectedPerson.date_of_death).toLocaleDateString()}
                      </p>
                    )}
                    {selectedPerson.marriage_date && (
                      <p className="text-sm text-gray-600">
                        Married: {new Date(selectedPerson.marriage_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

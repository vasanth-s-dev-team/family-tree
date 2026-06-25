"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Users, Link as LinkIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase"

interface Person {
  id: string
  first_name: string
  last_name: string
  parent_id: string | null
  spouse_id: string | null
}

export function RelationshipManager() {
  const [people, setPeople] = useState<Person[]>([])
  const [selectedPerson, setSelectedPerson] = useState<string>("")
  const [relationshipType, setRelationshipType] = useState<"parent" | "spouse">("parent")
  const [selectedRelative, setSelectedRelative] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadPeople()
  }, [])

  const loadPeople = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error: fetchError } = await supabase
        .from("people")
        .select("id, first_name, last_name, parent_id, spouse_id")
        .eq("user_id", user.id)

      if (fetchError) throw fetchError
      setPeople(data || [])
    } catch (err) {
      console.error("Error loading people:", err)
    }
  }

  const handleAddRelationship = async () => {
    if (!selectedPerson || !selectedRelative) {
      setError("Please select both a person and a relative")
      return
    }

    if (selectedPerson === selectedRelative) {
      setError("A person cannot be related to themselves")
      return
    }

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const supabase = createClient()

      if (relationshipType === "parent") {
        // Set the parent of selectedPerson
        const { error: updateError } = await supabase
          .from("people")
          .update({ parent_id: selectedRelative })
          .eq("id", selectedPerson)

        if (updateError) throw updateError
        setSuccess("Parent relationship added successfully!")
      } else {
        // Set spouse relationship (bidirectional)
        const { error: updateError1 } = await supabase
          .from("people")
          .update({ spouse_id: selectedRelative })
          .eq("id", selectedPerson)

        if (updateError1) throw updateError1

        const { error: updateError2 } = await supabase
          .from("people")
          .update({ spouse_id: selectedPerson })
          .eq("id", selectedRelative)

        if (updateError2) throw updateError2
        setSuccess("Spouse relationship added successfully!")
      }

      // Reset form
      setSelectedPerson("")
      setSelectedRelative("")
      setRelationshipType("parent")

      // Reload people
      setTimeout(() => {
        loadPeople()
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add relationship")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveRelationship = async (personId: string, relationType: "parent" | "spouse") => {
    setLoading(true)
    try {
      const supabase = createClient()

      if (relationType === "spouse") {
        // Remove bidirectional spouse relationship
        const person = people.find((p) => p.id === personId)
        if (person?.spouse_id) {
          await supabase
            .from("people")
            .update({ spouse_id: null })
            .eq("id", person.spouse_id)
        }
      }

      const { error: updateError } = await supabase
        .from("people")
        .update({ [relationType === "parent" ? "parent_id" : "spouse_id"]: null })
        .eq("id", personId)

      if (updateError) throw updateError
      setSuccess("Relationship removed successfully!")

      // Reload people
      setTimeout(() => {
        loadPeople()
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove relationship")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Manage Family Relationships
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Select Person</Label>
              <select
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a person...</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.first_name} {person.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Relationship Type</Label>
              <select
                value={relationshipType}
                onChange={(e) => setRelationshipType(e.target.value as "parent" | "spouse")}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="parent">Add Parent</option>
                <option value="spouse">Add Spouse</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Select {relationshipType === "parent" ? "Parent" : "Spouse"}</Label>
              <select
                value={selectedRelative}
                onChange={(e) => setSelectedRelative(e.target.value)}
                disabled={loading || !selectedPerson}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a {relationshipType}...</option>
                {people
                  .filter((p) => p.id !== selectedPerson)
                  .map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.first_name} {person.last_name}
                    </option>
                  ))}
              </select>
            </div>

            <Button
              onClick={handleAddRelationship}
              disabled={loading || !selectedPerson || !selectedRelative}
              className="md:col-span-2"
            >
              {loading ? "Adding..." : `Add ${relationshipType === "parent" ? "Parent" : "Spouse"} Relationship`}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Current Relationships
          </CardTitle>
        </CardHeader>
        <CardContent>
          {people.length === 0 ? (
            <p className="text-gray-600">No family members yet</p>
          ) : (
            <div className="space-y-4">
              {people.map((person) => (
                <div key={person.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    {person.first_name} {person.last_name}
                  </h3>
                  <div className="space-y-2 text-sm">
                    {person.parent_id ? (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          Parent: <span className="font-medium">{people.find((p) => p.id === person.parent_id)?.first_name} {people.find((p) => p.id === person.parent_id)?.last_name}</span>
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveRelationship(person.id, "parent")}
                          disabled={loading}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <p className="text-gray-400">No parent set</p>
                    )}

                    {person.spouse_id ? (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">
                          Spouse: <span className="font-medium">{people.find((p) => p.id === person.spouse_id)?.first_name} {people.find((p) => p.id === person.spouse_id)?.last_name}</span>
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveRelationship(person.id, "spouse")}
                          disabled={loading}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <p className="text-gray-400">No spouse set</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

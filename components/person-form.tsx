"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, X, Upload } from "lucide-react"

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

interface PersonFormProps {
  person?: Person | null
  onSave: () => void
  people: Person[]
}

interface SpecialOccasion {
  id: string
  name: string
  date: string
  description?: string
}

export default function PersonForm({ person, onSave, people }: PersonFormProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    date_of_death: "",
    marriage_date: "",
    parent_id: "",
    spouse_id: "",
  })
  const [specialOccasions, setSpecialOccasions] = useState<SpecialOccasion[]>([])
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePictureUrl, setProfilePictureUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  useEffect(() => {
    if (person) {
      setFormData({
        first_name: person.first_name || "",
        last_name: person.last_name || "",
        date_of_birth: person.date_of_birth || "",
        date_of_death: person.date_of_death || "",
        marriage_date: person.marriage_date || "",
        parent_id: person.parent_id || "",
        spouse_id: person.spouse_id || "",
      })
      setSpecialOccasions(person.special_occasions || [])
      setProfilePictureUrl(person.profile_picture || "")
    }
  }, [person])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addSpecialOccasion = () => {
    const newOccasion: SpecialOccasion = {
      id: Date.now().toString(),
      name: "",
      date: "",
      description: "",
    }
    setSpecialOccasions((prev) => [...prev, newOccasion])
  }

  const updateSpecialOccasion = (id: string, field: string, value: string) => {
    setSpecialOccasions((prev) =>
      prev.map((occasion) => (occasion.id === id ? { ...occasion, [field]: value } : occasion)),
    )
  }

  const removeSpecialOccasion = (id: string) => {
    setSpecialOccasions((prev) => prev.filter((occasion) => occasion.id !== id))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePicture(file)
      const url = URL.createObjectURL(file)
      setProfilePictureUrl(url)
    }
  }

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!profilePicture) return profilePictureUrl

    const fileExt = profilePicture.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `profile-pictures/${fileName}`

    const { error: uploadError } = await supabase.storage.from("family-tree").upload(filePath, profilePicture)

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      return null
    }

    const { data } = supabase.storage.from("family-tree").getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let pictureUrl = profilePictureUrl
      if (profilePicture) {
        pictureUrl = await uploadProfilePicture()
        if (!pictureUrl) {
          setError("Failed to upload profile picture")
          setLoading(false)
          return
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setError("User not authenticated")
        setLoading(false)
        return
      }

      const personData = {
        ...formData,
        profile_picture: pictureUrl,
        special_occasions: specialOccasions,
        user_id: user.id,
      }

      let result
      if (person) {
        result = await supabase.from("people").update(personData).eq("id", person.id)
      } else {
        result = await supabase.from("people").insert([personData])
      }

      if (result.error) {
        setError(result.error.message)
      } else {
        onSave()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    }

    setLoading(false)
  }

  const availableParents = people.filter((p) => p.id !== person?.id)
  const availableSpouses = people.filter((p) => p.id !== person?.id && p.id !== formData.parent_id)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile_picture">Profile Picture</Label>
        <div className="flex items-center space-x-4">
          {profilePictureUrl && (
            <img
              src={profilePictureUrl || "/placeholder.svg"}
              alt="Profile preview"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <Input id="profile_picture" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <Button type="button" variant="outline" onClick={() => document.getElementById("profile_picture")?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Picture
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date_of_death">Date of Death</Label>
          <Input
            id="date_of_death"
            type="date"
            value={formData.date_of_death}
            onChange={(e) => handleInputChange("date_of_death", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="marriage_date">Marriage Date</Label>
          <Input
            id="marriage_date"
            type="date"
            value={formData.marriage_date}
            onChange={(e) => handleInputChange("marriage_date", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="parent_id">Parent</Label>
          <Select value={formData.parent_id} onValueChange={(value) => handleInputChange("parent_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select parent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No parent</SelectItem>
              {availableParents.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="spouse_id">Spouse</Label>
          <Select value={formData.spouse_id} onValueChange={(value) => handleInputChange("spouse_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select spouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No spouse</SelectItem>
              {availableSpouses.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Special Occasions</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addSpecialOccasion}>
              <Plus className="h-4 w-4 mr-2" />
              Add Occasion
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {specialOccasions.map((occasion) => (
            <div key={occasion.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Special Occasion</h4>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSpecialOccasion(occasion.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Occasion Name</Label>
                  <Input
                    value={occasion.name}
                    onChange={(e) => updateSpecialOccasion(occasion.id, "name", e.target.value)}
                    placeholder="e.g., Graduation, Anniversary"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={occasion.date}
                    onChange={(e) => updateSpecialOccasion(occasion.id, "date", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={occasion.description || ""}
                  onChange={(e) => updateSpecialOccasion(occasion.id, "description", e.target.value)}
                  placeholder="Optional description"
                  rows={2}
                />
              </div>
            </div>
          ))}
          {specialOccasions.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No special occasions added yet. Click "Add Occasion" to get started.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onSave}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : person ? "Update Person" : "Add Person"}
        </Button>
      </div>
    </form>
  )
}

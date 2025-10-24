"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SpecialOccasion {
  date: string
  title: string
}

export default function PersonForm({
  userId,
  onPersonAdded,
}: {
  userId: string
  onPersonAdded: () => void
}) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [dateOfDeath, setDateOfDeath] = useState("")
  const [marriageDate, setMarriageDate] = useState("")
  const [specialOccasions, setSpecialOccasions] = useState<SpecialOccasion[]>([])
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfilePicture(e.target.files[0])
    }
  }

  const addSpecialOccasion = () => {
    setSpecialOccasions([...specialOccasions, { date: "", title: "" }])
  }

  const updateSpecialOccasion = (index: number, field: string, value: string) => {
    const updated = [...specialOccasions]
    updated[index] = { ...updated[index], [field]: value }
    setSpecialOccasions(updated)
  }

  const removeSpecialOccasion = (index: number) => {
    setSpecialOccasions(specialOccasions.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      let profilePictureUrl = null

      // Upload profile picture if provided
      if (profilePicture) {
        const fileExt = profilePicture.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { data, error: uploadError } = await supabase.storage
          .from("profile-pictures")
          .upload(`${userId}/${fileName}`, profilePicture)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage.from("profile-pictures").getPublicUrl(`${userId}/${fileName}`)

        profilePictureUrl = publicUrlData.publicUrl
      }

      // Insert person record
      const { error } = await supabase.from("people").insert([
        {
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth || null,
          date_of_death: dateOfDeath || null,
          marriage_date: marriageDate || null,
          profile_picture_url: profilePictureUrl,
          special_occasions: specialOccasions.length > 0 ? JSON.stringify(specialOccasions) : null,
        },
      ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Family member added successfully",
      })

      // Reset form
      setFirstName("")
      setLastName("")
      setDateOfBirth("")
      setDateOfDeath("")
      setMarriageDate("")
      setSpecialOccasions([])
      setProfilePicture(null)
      if (fileInputRef.current) fileInputRef.current.value = ""

      onPersonAdded()
    } catch (error) {
      console.error("Error adding person:", error)
      toast({
        title: "Error",
        description: "Failed to add family member",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Family Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Death</label>
            <Input type="date" value={dateOfDeath} onChange={(e) => setDateOfDeath(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marriage Date</label>
            <Input type="date" value={marriageDate} onChange={(e) => setMarriageDate(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
            <div className="flex gap-2">
              <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="flex-1" />
              <Button type="button" variant="outline">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {profilePicture && <p className="text-sm text-green-600 mt-1">Selected: {profilePicture.name}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Special Occasions</label>
              <Button type="button" variant="outline" size="sm" onClick={addSpecialOccasion}>
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {specialOccasions.map((occasion, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="date"
                    value={occasion.date}
                    onChange={(e) => updateSpecialOccasion(index, "date", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    value={occasion.title}
                    onChange={(e) => updateSpecialOccasion(index, "title", e.target.value)}
                    placeholder="Event title"
                    className="flex-1"
                  />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeSpecialOccasion(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Family Member"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase"

export function PersonForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    dateOfDeath: "",
    marriageDate: "",
    specialOccasions: "",
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("Not authenticated")
      }

      let profileImageUrl = null

      // Upload image if provided
      if (profileImage) {
        const fileExt = profileImage.name.split(".").pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from("profile-pictures")
          .upload(`public/${fileName}`, profileImage)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from("profile-pictures").getPublicUrl(`public/${fileName}`)

        profileImageUrl = data.publicUrl
      }

      // Insert person record
      const { error: insertError } = await supabase.from("people").insert([
        {
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          date_of_birth: formData.dateOfBirth || null,
          date_of_death: formData.dateOfDeath || null,
          marriage_date: formData.marriageDate || null,
          special_occasions: formData.specialOccasions || null,
          profile_picture_url: profileImageUrl,
        },
      ])

      if (insertError) throw insertError

      setSuccess("Family member added successfully!")
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        dateOfDeath: "",
        marriageDate: "",
        specialOccasions: "",
      })
      setProfileImage(null)

      setTimeout(() => {
        onSuccess()
      }, 1500)
    } catch (err) {
      console.error("Error adding person:", err)
      setError(err instanceof Error ? err.message : "Failed to add family member")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            disabled={loading}
            placeholder="John"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            disabled={loading}
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfDeath">Date of Death (if applicable)</Label>
          <Input
            id="dateOfDeath"
            name="dateOfDeath"
            type="date"
            value={formData.dateOfDeath}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="marriageDate">Marriage Date</Label>
          <Input
            id="marriageDate"
            name="marriageDate"
            type="date"
            value={formData.marriageDate}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profileImage">Profile Picture</Label>
          <Input id="profileImage" type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
          {profileImage && <p className="text-sm text-green-600">✓ Image selected: {profileImage.name}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialOccasions">Special Occasions (comma-separated dates)</Label>
        <textarea
          id="specialOccasions"
          name="specialOccasions"
          value={formData.specialOccasions}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="e.g., 2023-05-15: Graduation, 2023-06-20: Promotion"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Family Member"}
      </Button>
    </form>
  )
}

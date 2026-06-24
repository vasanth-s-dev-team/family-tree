"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Trash2, Eye, EyeOff, Plus } from "lucide-react"
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
    whatsappNumber: "",
    email: "",
    phone: "",
    education: "",
    occupation: "",
    location: "",
    currentCity: "",
    bio: "",
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImageVisible, setProfileImageVisible] = useState(true)
  const [additionalPhotos, setAdditionalPhotos] = useState<Array<{ file: File; caption: string; visible: boolean }>>([])
  const [familyPhotos, setFamilyPhotos] = useState<Array<{ file: File; caption: string; visible: boolean }>>([])
  const [customFields, setCustomFields] = useState<Array<{ name: string; value: string }>>([])
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

      // Upload additional photos
      const uploadedAdditionalPhotos = []
      for (const photo of additionalPhotos) {
        const fileExt = photo.file.name.split(".").pop()
        const fileName = `${user.id}-additional-${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from("profile-pictures")
          .upload(`public/${fileName}`, photo.file)
        
        if (!uploadError) {
          const { data } = supabase.storage.from("profile-pictures").getPublicUrl(`public/${fileName}`)
          uploadedAdditionalPhotos.push({
            url: data.publicUrl,
            caption: photo.caption,
            visible: photo.visible,
          })
        }
      }

      // Upload family photos
      const uploadedFamilyPhotos = []
      for (const photo of familyPhotos) {
        const fileExt = photo.file.name.split(".").pop()
        const fileName = `${user.id}-family-${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from("profile-pictures")
          .upload(`public/${fileName}`, photo.file)
        
        if (!uploadError) {
          const { data } = supabase.storage.from("profile-pictures").getPublicUrl(`public/${fileName}`)
          uploadedFamilyPhotos.push({
            url: data.publicUrl,
            caption: photo.caption,
            visible: photo.visible,
          })
        }
      }

      // Convert custom fields to object
      const customFieldsObj = customFields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: field.value,
        }),
        {}
      )

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
          profile_picture_visible: profileImageVisible,
          additional_photos: uploadedAdditionalPhotos,
          family_photos: uploadedFamilyPhotos,
          whatsapp_number: formData.whatsappNumber || null,
          email: formData.email || null,
          phone: formData.phone || null,
          education: formData.education || null,
          occupation: formData.occupation || null,
          location: formData.location || null,
          current_city: formData.currentCity || null,
          bio: formData.bio || null,
          custom_fields: customFieldsObj,
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
        whatsappNumber: "",
        email: "",
        phone: "",
        education: "",
        occupation: "",
        location: "",
        currentCity: "",
        bio: "",
      })
      setProfileImage(null)
      setProfileImageVisible(true)
      setAdditionalPhotos([])
      setFamilyPhotos([])
      setCustomFields([])

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
          <div className="flex items-center justify-between">
            <Label htmlFor="profileImage">Profile Picture</Label>
            {profileImage && (
              <button
                type="button"
                onClick={() => setProfileImageVisible(!profileImageVisible)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                {profileImageVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {profileImageVisible ? "Visible" : "Hidden"}
              </button>
            )}
          </div>
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
          rows={3}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Contact & Additional Info</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="+1 (555) 987-6543"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Bachelor's in Computer Science"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="New York, USA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentCity">Current City</Label>
            <Input
              id="currentCity"
              name="currentCity"
              value={formData.currentCity}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="bio">Bio/Notes</Label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            disabled={loading}
            placeholder="Add any additional notes or biography..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Additional Photos</h3>
        <div className="space-y-4">
          {additionalPhotos.map((photo, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-sm">{photo.file.name}</p>
                <button
                  type="button"
                  onClick={() => {
                    setAdditionalPhotos(additionalPhotos.filter((_, i) => i !== idx))
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Photo caption"
                  value={photo.caption}
                  onChange={(e) => {
                    const updated = [...additionalPhotos]
                    updated[idx].caption = e.target.value
                    setAdditionalPhotos(updated)
                  }}
                  disabled={loading}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...additionalPhotos]
                    updated[idx].visible = !updated[idx].visible
                    setAdditionalPhotos(updated)
                  }}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  {photo.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const input = document.createElement("input")
              input.type = "file"
              input.accept = "image/*"
              input.onchange = (e: any) => {
                if (e.target.files?.[0]) {
                  setAdditionalPhotos([
                    ...additionalPhotos,
                    { file: e.target.files[0], caption: "", visible: true },
                  ])
                }
              }
              input.click()
            }}
            disabled={loading}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Additional Photo
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Family Photos</h3>
        <div className="space-y-4">
          {familyPhotos.map((photo, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-sm">{photo.file.name}</p>
                <button
                  type="button"
                  onClick={() => {
                    setFamilyPhotos(familyPhotos.filter((_, i) => i !== idx))
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Photo description"
                  value={photo.caption}
                  onChange={(e) => {
                    const updated = [...familyPhotos]
                    updated[idx].caption = e.target.value
                    setFamilyPhotos(updated)
                  }}
                  disabled={loading}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...familyPhotos]
                    updated[idx].visible = !updated[idx].visible
                    setFamilyPhotos(updated)
                  }}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  {photo.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const input = document.createElement("input")
              input.type = "file"
              input.accept = "image/*"
              input.onchange = (e: any) => {
                if (e.target.files?.[0]) {
                  setFamilyPhotos([
                    ...familyPhotos,
                    { file: e.target.files[0], caption: "", visible: true },
                  ])
                }
              }
              input.click()
            }}
            disabled={loading}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Family Photo
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Custom Fields</h3>
        <div className="space-y-4">
          {customFields.map((field, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <Input
                type="text"
                placeholder="Field name"
                value={field.name}
                onChange={(e) => {
                  const updated = [...customFields]
                  updated[idx].name = e.target.value
                  setCustomFields(updated)
                }}
                disabled={loading}
                className="w-40"
              />
              <Input
                type="text"
                placeholder="Field value"
                value={field.value}
                onChange={(e) => {
                  const updated = [...customFields]
                  updated[idx].value = e.target.value
                  setCustomFields(updated)
                }}
                disabled={loading}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  setCustomFields(customFields.filter((_, i) => i !== idx))
                }}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setCustomFields([...customFields, { name: "", value: "" }])
            }}
            disabled={loading}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Field
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Family Member"}
      </Button>
    </form>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Download, Share2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FamilyMember {
  id: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  dateOfDeath?: string
  profilePictureUrl?: string
  whatsappNumber?: string
  email?: string
  occupation?: string
  education?: string
  location?: string
  bio?: string
}

export function PublicFamilyTree({ treeUrl }: { treeUrl: string }) {
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [treeName, setTreeName] = useState("")

  useEffect(() => {
    loadPublicTree()
  }, [treeUrl])

  const loadPublicTree = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/public-family-tree/${treeUrl}`)
      if (!response.ok) throw new Error("Family tree not found")

      const data = await response.json()
      setTreeName(data.name)
      setMembers(data.members)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load family tree")
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async (platform: string) => {
    const shareUrl = window.location.href
    const text = `Check out ${treeName} family tree`

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], "_blank")
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading family tree...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{treeName}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("twitter")}
          >
            Share on X
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("facebook")}
          >
            Share on Facebook
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("whatsapp")}
          >
            Share on WhatsApp
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="pt-6">
              {member.profilePictureUrl && (
                <img
                  src={member.profilePictureUrl}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <h3 className="text-lg font-semibold">
                {member.firstName} {member.lastName}
              </h3>

              {member.dateOfBirth && (
                <p className="text-sm text-gray-600">Born: {new Date(member.dateOfBirth).toLocaleDateString()}</p>
              )}

              {member.dateOfDeath && (
                <p className="text-sm text-gray-600">Died: {new Date(member.dateOfDeath).toLocaleDateString()}</p>
              )}

              <div className="mt-4 space-y-2 text-sm">
                {member.occupation && (
                  <p>
                    <span className="font-semibold">Occupation:</span> {member.occupation}
                  </p>
                )}
                {member.education && (
                  <p>
                    <span className="font-semibold">Education:</span> {member.education}
                  </p>
                )}
                {member.location && (
                  <p>
                    <span className="font-semibold">Location:</span> {member.location}
                  </p>
                )}
              </div>

              {member.bio && (
                <p className="mt-4 text-sm text-gray-700">{member.bio}</p>
              )}

              <div className="mt-4 flex gap-2 flex-wrap">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    Email
                  </a>
                )}
                {member.whatsappNumber && (
                  <a
                    href={`https://wa.me/${member.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {members.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">No family members in this tree yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

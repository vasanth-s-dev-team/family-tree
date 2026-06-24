"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Share2, Users, Globe, Copy, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase"

export function FamilyTreeSettings() {
  const [activeTab, setActiveTab] = useState("visibility")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [copied, setCopied] = useState(false)
  const [treeSettings, setTreeSettings] = useState({
    visibility: "private",
    name: "My Family Tree",
    description: "",
    publicUrl: "my-family-tree-" + Math.random().toString(36).substr(2, 9),
  })
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("viewer")

  const handleVisibilityChange = async (visibility: string) => {
    setLoading(true)
    setError("")
    try {
      const supabase = createClient()
      // Update visibility in database
      setTreeSettings((prev) => ({ ...prev, visibility }))
      setSuccess(`Family tree visibility changed to ${visibility}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update visibility")
    } finally {
      setLoading(false)
    }
  }

  const handleInviteCollaborator = async () => {
    if (!inviteEmail) {
      setError("Please enter an email address")
      return
    }

    setLoading(true)
    setError("")
    try {
      const supabase = createClient()
      // Send invitation
      setSuccess(`Invitation sent to ${inviteEmail}`)
      setInviteEmail("")
      setInviteRole("viewer")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyShareLink = async () => {
    const shareUrl = `${window.location.origin}/family-tree/${treeSettings.publicUrl}`
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareToSocial = (platform: string) => {
    const shareUrl = `${window.location.origin}/family-tree/${treeSettings.publicUrl}`
    const text = `Check out my family tree: ${treeSettings.name}`

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent("Check out my family tree")}&body=${encodeURIComponent(text + "\n" + shareUrl)}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], "_blank")
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visibility">Visibility</TabsTrigger>
          <TabsTrigger value="sharing">Share</TabsTrigger>
          <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>

        <TabsContent value="visibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Family Tree Visibility</CardTitle>
              <CardDescription>Control who can see and access your family tree</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={treeSettings.visibility === "private"}
                    onChange={(e) => handleVisibilityChange(e.target.value)}
                    disabled={loading}
                  />
                  <div>
                    <p className="font-semibold">Private</p>
                    <p className="text-sm text-gray-600">Only you can view this family tree</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value="shared"
                    checked={treeSettings.visibility === "shared"}
                    onChange={(e) => handleVisibilityChange(e.target.value)}
                    disabled={loading}
                  />
                  <div>
                    <p className="font-semibold">Shared</p>
                    <p className="text-sm text-gray-600">Only invited collaborators can view</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={treeSettings.visibility === "public"}
                    onChange={(e) => handleVisibilityChange(e.target.value)}
                    disabled={loading}
                  />
                  <div>
                    <p className="font-semibold">Public</p>
                    <p className="text-sm text-gray-600">Anyone with the link can view</p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sharing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Family Tree</CardTitle>
              <CardDescription>Share your family tree on social media</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={`${window.location.origin}/family-tree/${treeSettings.publicUrl}`}
                    readOnly
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyShareLink}
                    disabled={loading}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Share to Social Media</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleShareToSocial("twitter")}
                    disabled={loading}
                  >
                    Twitter/X
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleShareToSocial("facebook")}
                    disabled={loading}
                  >
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleShareToSocial("whatsapp")}
                    disabled={loading}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleShareToSocial("email")}
                    disabled={loading}
                  >
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaborators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Collaborators</CardTitle>
              <CardDescription>People with access to your family tree</CardDescription>
            </CardHeader>
            <CardContent>
              {collaborators.length === 0 ? (
                <p className="text-sm text-gray-600">No collaborators yet. Invite someone to get started!</p>
              ) : (
                <div className="space-y-3">
                  {collaborators.map((collab) => (
                    <div key={collab.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">{collab.email}</p>
                        <p className="text-sm text-gray-600">Role: {collab.role}</p>
                      </div>
                      <Button variant="ghost" size="sm" disabled={loading}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invite Collaborators</CardTitle>
              <CardDescription>Invite family members to collaborate on your tree</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="inviteEmail">Email Address</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="family@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inviteRole">Role</Label>
                <select
                  id="inviteRole"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">Viewer (can only view)</option>
                  <option value="editor">Editor (can add/edit members)</option>
                  <option value="admin">Admin (full access)</option>
                </select>
              </div>

              <Button onClick={handleInviteCollaborator} className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Invitation"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

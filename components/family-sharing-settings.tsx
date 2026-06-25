'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase'
import { AlertCircle, Copy, Eye, EyeOff, Globe, Lock } from 'lucide-react'

interface Family {
  id: string
  name: string
  visibility: string
  is_public: boolean
  public_url_slug: string | null
}

interface FamilySharingSettingsProps {
  familyId: string
}

export function FamilySharingSettings({ familyId }: FamilySharingSettingsProps) {
  const [family, setFamily] = useState<Family | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadFamily()
  }, [familyId])

  const loadFamily = async () => {
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('families')
        .select('*')
        .eq('id', familyId)
        .single()

      if (fetchError) throw fetchError
      setFamily(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load family'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const generatePublicSlug = () => {
    return Math.random().toString(36).substring(2, 10)
  }

  const handleToggleVisibility = async (isPublic: boolean) => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const supabase = createClient()
      const slug = isPublic ? generatePublicSlug() : null
      const visibility = isPublic ? 'public' : 'private'

      const { error: updateError } = await supabase
        .from('families')
        .update({
          is_public: isPublic,
          visibility: visibility,
          public_url_slug: slug
        })
        .eq('id', familyId)

      if (updateError) throw updateError

      if (family) {
        setFamily({
          ...family,
          is_public: isPublic,
          visibility: visibility,
          public_url_slug: slug
        })
      }

      setSuccess(
        isPublic
          ? 'Family tree is now public! Share the link with anyone.'
          : 'Family tree is now private. Only invited members can access.'
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update visibility'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (family?.public_url_slug) {
      const link = `${window.location.origin}/public-family-tree/${family.public_url_slug}`
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!family) {
    return <Alert variant="destructive"><AlertDescription>Family not found</AlertDescription></Alert>
  }

  return (
    <div className="space-y-4">
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

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {family.is_public ? (
              <Globe className="w-5 h-5" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Family Visibility</p>
              <p className="text-sm text-gray-600">
                {family.is_public
                  ? 'Anyone with the link can view this family tree'
                  : 'Only invited members can view this family tree'}
              </p>
            </div>
            <Button
              onClick={() => handleToggleVisibility(!family.is_public)}
              disabled={loading}
              variant={family.is_public ? 'destructive' : 'default'}
            >
              {family.is_public ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Make Private
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Make Public
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sharing Link */}
      {family.is_public && family.public_url_slug && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Public Sharing Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Share this link with anyone:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/public-family-tree/${family.public_url_slug}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Anyone with this link can view your family tree
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-900">
                <strong>Note:</strong> Public family trees show all members and relationships. 
                Personal contact information (phone, email, WhatsApp) will not be visible to 
                public visitors. Only invited family members can see private details.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Ways to Share</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-sm mb-1">1. Email Invitations</p>
            <p className="text-sm text-gray-600">
              Go to "Manage Family" and invite members by email with specific relationship roles.
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-sm mb-1">2. Family Code</p>
            <p className="text-sm text-gray-600">
              Share your family code <span className="font-mono font-semibold">{family.name}</span> 
              {' '}with trusted family members who can join directly.
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-sm mb-1">3. Public Link</p>
            <p className="text-sm text-gray-600">
              {family.is_public
                ? 'Your public link is available above. Share it on social media or messaging apps.'
                : 'Make your family tree public above to enable public sharing via link.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notes */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy Reminder:</strong> Ensure all family members consent to being included in 
          the family tree. Public trees display names and relationships but protect sensitive contact 
          information.
        </AlertDescription>
      </Alert>
    </div>
  )
}

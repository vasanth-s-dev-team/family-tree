'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Send, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const RELATIONSHIP_TYPES = [
  'Father',
  'Mother',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Grandfather',
  'Grandmother',
  'Grandson',
  'Granddaughter',
  'Uncle',
  'Aunt',
  'Cousin',
  'Nephew',
  'Niece',
  'Father-in-law',
  'Mother-in-law',
  'Brother-in-law',
  'Sister-in-law',
  'Spouse',
  'Other'
]

export function FamilyInvite({ familyId }: { familyId: string }) {
  const [email, setEmail] = useState('')
  const [relationshipType, setRelationshipType] = useState('Other')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }

      // Generate invite token
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days

      // Insert invitation
      const { error: inviteError } = await supabase
        .from('family_tree_invitations')
        .insert([{
          family_id: familyId,
          invited_by: user.id,
          invited_email: email,
          relationship_type: relationshipType,
          token: token,
          expires_at: expiresAt,
          status: 'pending'
        }])

      if (inviteError) {
        throw new Error(inviteError.message)
      }

      // TODO: Send email with invitation link
      // const inviteLink = `${window.location.origin}/accept-invite?token=${token}`
      // Send email using your backend/service

      setSuccess(`Invitation sent to ${email}! They'll receive an email to join your family tree.`)
      setEmail('')
      setRelationshipType('Other')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send invitation'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Family Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleInvite} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="uncle@example.com"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship Type</Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white hover:bg-gray-50"
              >
                {relationshipType}
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {RELATIONSHIP_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setRelationshipType(type)
                        setShowDropdown(false)
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-blue-50 hover:text-blue-900"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Sending...' : 'Send Invitation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

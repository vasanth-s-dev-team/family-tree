'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'

export default function AcceptInvitePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inviteData, setInviteData] = useState<any>(null)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    if (token) {
      loadInvite()
    } else {
      setError('Invalid invitation link')
      setLoading(false)
    }
  }, [token])

  const loadInvite = async () => {
    try {
      const supabase = createClient()

      // Fetch invitation details
      const { data: invitation, error: fetchError } = await supabase
        .from('family_tree_invitations')
        .select(`
          id,
          invited_email,
          relationship_type,
          status,
          expires_at,
          families(name, family_code, description)
        `)
        .eq('token', token)
        .single()

      if (fetchError) {
        throw new Error('Invitation not found')
      }

      if (!invitation) {
        throw new Error('Invitation not found')
      }

      // Check if expired
      if (new Date(invitation.expires_at) < new Date()) {
        throw new Error('This invitation has expired')
      }

      if (invitation.status === 'accepted') {
        throw new Error('This invitation has already been accepted')
      }

      setInviteData(invitation)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load invitation'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Update invitation status
      const { error: updateError } = await supabase
        .from('family_tree_invitations')
        .update({
          status: 'accepted'
        })
        .eq('token', token)

      if (updateError) throw updateError

      // Add user to family_members
      const { error: memberError } = await supabase
        .from('family_members')
        .insert([{
          family_id: inviteData.family_id,
          user_id: user.id,
          role: 'member'
        }])

      if (memberError) throw memberError

      setAccepted(true)
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept invitation'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <p>Loading invitation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-6 h-6" />
              Invitation Accepted!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You have successfully joined the {inviteData?.families?.name} family tree!</p>
            <p className="text-sm text-gray-600">
              Redirecting to your dashboard in a moment...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Family Tree Invitation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!error && inviteData && (
            <>
              <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Family</p>
                  <p className="text-lg font-semibold">{inviteData.families?.name}</p>
                  <p className="text-xs text-gray-600">Code: {inviteData.families?.family_code}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Relationship</p>
                  <p className="text-lg font-semibold">{inviteData.relationship_type}</p>
                </div>

                {inviteData.families?.description && (
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm">{inviteData.families.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Invited Email</p>
                  <p className="text-sm">{inviteData.invited_email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleAccept}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Accepting...' : 'Accept Invitation'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                By accepting this invitation, you will become a member of {inviteData.families?.name} 
                and can manage family relationships and information.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

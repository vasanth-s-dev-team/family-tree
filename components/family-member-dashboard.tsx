'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Mail, Clock, CheckCircle, XCircle, Share2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { FamilyInvite } from './family-invite'
import { FamilySharingSettings } from './family-sharing-settings'

interface FamilyMember {
  id: string
  email: string
  role: string
  joined_at: string
}

interface PendingInvite {
  id: string
  invited_email: string
  relationship_type: string
  status: string
  created_at: string
}

export function FamilyMemberDashboard({ familyId }: { familyId: string }) {
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [familyId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch family members
      const { data: membersData, error: membersError } = await supabase
        .from('family_members')
        .select('id, user_id, role, joined_at')
        .eq('family_id', familyId)

      if (membersError) throw membersError

      // Fetch pending invites
      const { data: invitesData, error: invitesError } = await supabase
        .from('family_tree_invitations')
        .select('id, invited_email, relationship_type, status, created_at')
        .eq('family_id', familyId)
        .eq('status', 'pending')

      if (invitesError) throw invitesError

      setMembers(membersData || [])
      setPendingInvites(invitesData || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveInvite = async (inviteId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('family_tree_invitations')
        .delete()
        .eq('id', inviteId)

      if (error) throw error
      setPendingInvites(pendingInvites.filter(inv => inv.id !== inviteId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove invite'
      setError(errorMessage)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Members & Invites</TabsTrigger>
          <TabsTrigger value="invite">Invite Member</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Family Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Family Members ({members.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.length === 0 ? (
                <p className="text-sm text-gray-500">No family members yet</p>
              ) : (
                members.map((member) => (
                  <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{member.email}</p>
                      <p className="text-xs text-gray-600">Role: {member.role}</p>
                      <p className="text-xs text-gray-500">
                        Joined: {new Date(member.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Invites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Pending Invites ({pendingInvites.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvites.length === 0 ? (
                <p className="text-sm text-gray-500">No pending invites</p>
              ) : (
                pendingInvites.map((invite) => (
                  <div key={invite.id} className="flex justify-between items-start p-3 bg-amber-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{invite.invited_email}</p>
                      <p className="text-xs text-gray-600">Relationship: {invite.relationship_type}</p>
                      <p className="text-xs text-gray-500">
                        Sent: {new Date(invite.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <button
                        onClick={() => handleRemoveInvite(invite.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
          </div>
        </TabsContent>

        <TabsContent value="invite">
          <FamilyInvite familyId={familyId} />
        </TabsContent>

        <TabsContent value="sharing">
          <FamilySharingSettings familyId={familyId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

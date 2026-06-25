'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase'
import { CreateFamily } from '@/components/create-family'
import { FamilyMemberDashboard } from '@/components/family-member-dashboard'
import { AlertCircle, Users, Plus } from 'lucide-react'

interface Family {
  id: string
  name: string
  family_code: string
  description: string | null
  created_by: string
  created_at: string
}

export default function FamilyPage() {
  const [families, setFamilies] = useState<Family[]>([])
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('families')

  useEffect(() => {
    loadFamilies()
  }, [])

  const loadFamilies = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError('Not authenticated')
        return
      }

      // Get families the user is a member of
      const { data: memberData, error: memberError } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)

      if (memberError) throw memberError

      const familyIds = memberData?.map(m => m.family_id) || []

      if (familyIds.length === 0) {
        setFamilies([])
        return
      }

      // Get family details
      const { data: familiesData, error: familiesError } = await supabase
        .from('families')
        .select('*')
        .in('id', familyIds)

      if (familiesError) throw familiesError
      setFamilies(familiesData || [])

      // Set first family as default
      if (familiesData && familiesData.length > 0) {
        setSelectedFamily(familiesData[0].id)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load families'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFamily = (familyId: string, familyCode: string) => {
    setSelectedFamily(familyId)
    loadFamilies()
    setActiveTab('manage')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Loading families...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Family Management</h1>
        <p className="text-gray-600 mt-2">Manage your family members and collaborative tree</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="families">My Families</TabsTrigger>
          <TabsTrigger value="create">Create Family</TabsTrigger>
          <TabsTrigger value="manage" disabled={!selectedFamily}>Manage</TabsTrigger>
        </TabsList>

        {/* My Families Tab */}
        <TabsContent value="families">
          {families.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4">You are not part of any family yet</p>
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Family
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {families.map((family) => (
                <Card
                  key={family.id}
                  className={`cursor-pointer transition-all ${
                    selectedFamily === family.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => {
                    setSelectedFamily(family.id)
                    setActiveTab('manage')
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{family.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600">Family Code</p>
                      <p className="font-mono text-sm font-semibold">{family.family_code}</p>
                    </div>
                    {family.description && (
                      <div>
                        <p className="text-xs text-gray-600">Description</p>
                        <p className="text-sm">{family.description}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-600">Created</p>
                      <p className="text-sm">
                        {new Date(family.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Create Family Tab */}
        <TabsContent value="create">
          <CreateFamily onSuccess={handleCreateFamily} />
        </TabsContent>

        {/* Manage Family Tab */}
        {selectedFamily && (
          <TabsContent value="manage">
            <FamilyMemberDashboard familyId={selectedFamily} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

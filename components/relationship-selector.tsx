'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase'
import { AlertCircle, Plus, Trash2 } from 'lucide-react'

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
  'Step-father',
  'Step-mother',
  'Step-brother',
  'Step-sister',
  'Other'
]

interface Relationship {
  personId: string
  personName: string
  relationshipType: string
}

interface RelationshipSelectorProps {
  familyId: string
  onAddRelationship: (relationship: Relationship) => void
  onRemoveRelationship: (personId: string) => void
  selectedRelationships: Relationship[]
  excludePersonId?: string
}

export function RelationshipSelector({
  familyId,
  onAddRelationship,
  onRemoveRelationship,
  selectedRelationships,
  excludePersonId
}: RelationshipSelectorProps) {
  const [familyMembers, setFamilyMembers] = useState<any[]>([])
  const [selectedPerson, setSelectedPerson] = useState('')
  const [selectedType, setSelectedType] = useState('Other')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPersonDropdown, setShowPersonDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)

  useEffect(() => {
    loadFamilyMembers()
  }, [familyId])

  const loadFamilyMembers = async () => {
    try {
      const supabase = createClient()
      const { data: members, error: membersError } = await supabase
        .from('people')
        .select('id, first_name, last_name')
        .eq('family_id', familyId)
        .neq('id', excludePersonId || '')

      if (membersError) throw membersError
      setFamilyMembers(members || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load family members'
      setError(errorMessage)
    }
  }

  const handleAddRelationship = () => {
    if (!selectedPerson) {
      setError('Please select a family member')
      return
    }

    const selected = familyMembers.find(m => m.id === selectedPerson)
    if (!selected) return

    const relationship: Relationship = {
      personId: selected.id,
      personName: `${selected.first_name} ${selected.last_name}`,
      relationshipType: selectedType
    }

    onAddRelationship(relationship)
    setSelectedPerson('')
    setSelectedType('Other')
  }

  const availableMembers = familyMembers.filter(m => 
    !selectedRelationships.some(r => r.personId === m.id)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relationships</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Selected Relationships */}
        {selectedRelationships.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Current Relationships</Label>
            <div className="space-y-2">
              {selectedRelationships.map((rel) => (
                <div
                  key={rel.personId}
                  className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div>
                    <p className="font-medium text-sm">{rel.personName}</p>
                    <p className="text-xs text-gray-600">{rel.relationshipType}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveRelationship(rel.personId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Relationship */}
        <div className="border-t pt-4 space-y-3">
          <Label className="text-sm font-semibold">Add Relationship</Label>

          <div className="space-y-2">
            <Label htmlFor="person" className="text-xs">Family Member</Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPersonDropdown(!showPersonDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white hover:bg-gray-50"
              >
                {selectedPerson 
                  ? familyMembers.find(m => m.id === selectedPerson)?.first_name + ' ' + 
                    familyMembers.find(m => m.id === selectedPerson)?.last_name
                  : 'Select member...'}
              </button>
              {showPersonDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {availableMembers.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No other family members available
                    </div>
                  ) : (
                    availableMembers.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => {
                          setSelectedPerson(member.id)
                          setShowPersonDropdown(false)
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-blue-50 hover:text-blue-900"
                      >
                        {member.first_name} {member.last_name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-xs">Relationship Type</Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white hover:bg-gray-50"
              >
                {selectedType}
              </button>
              {showTypeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {RELATIONSHIP_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setSelectedType(type)
                        setShowTypeDropdown(false)
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

          <Button
            type="button"
            onClick={handleAddRelationship}
            disabled={loading || !selectedPerson}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Relationship
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

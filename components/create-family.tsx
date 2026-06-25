'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface CreateFamilyProps {
  onSuccess: (familyId: string, familyCode: string) => void
}

export function CreateFamily({ onSuccess }: CreateFamilyProps) {
  const [familyName, setFamilyName] = useState('')
  const [familyCode, setFamilyCode] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateFamilyCode = () => {
    const code = familyName
      .replace(/[^a-z0-9]/gi, '')
      .substring(0, 6)
      .toUpperCase() + 
      '-' + 
      Math.random().toString(36).substring(2, 6).toUpperCase()
    setFamilyCode(code)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!familyName.trim()) {
        throw new Error('Family name is required')
      }
      if (!familyCode.trim()) {
        throw new Error('Please generate a family code')
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      // Create family
      const { data: family, error: createError } = await supabase
        .from('families')
        .insert([{
          name: familyName,
          family_code: familyCode.toUpperCase(),
          description: description || null,
          created_by: user.id,
          visibility: 'private'
        }])
        .select()

      if (createError) throw createError
      if (!family || family.length === 0) throw new Error('Failed to create family')

      const newFamily = family[0]

      // Add creator as family admin
      const { error: memberError } = await supabase
        .from('family_members')
        .insert([{
          family_id: newFamily.id,
          user_id: user.id,
          role: 'admin'
        }])

      if (memberError) throw memberError

      onSuccess(newFamily.id, newFamily.family_code)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create family'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Family
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreate} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="familyName">Family Name</Label>
            <Input
              id="familyName"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="e.g., Smith Family, Johnson Clan"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyCode">Family Code</Label>
            <div className="flex gap-2">
              <Input
                id="familyCode"
                value={familyCode}
                readOnly
                placeholder="Generate a code"
                className="bg-gray-100"
              />
              <Button
                type="button"
                onClick={generateFamilyCode}
                variant="outline"
                disabled={loading || !familyName}
              >
                Generate
              </Button>
            </div>
            <p className="text-xs text-gray-600">
              Share this code with family members to join. Format: FAMILY-CODE
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description about your family..."
              disabled={loading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" disabled={loading || !familyCode} className="w-full">
            {loading ? 'Creating...' : 'Create Family'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Plus, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { PersonForm } from "./person-form"
import { FamilyTreeView } from "./family-tree-view"

export function FamilyTreeDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [familyMembers, setFamilyMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFamilyMembers()
  }, [])

  const loadFamilyMembers = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase.from("people").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setFamilyMembers(data || [])
    } catch (error) {
      console.error("Error loading family members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPerson = async () => {
    await loadFamilyMembers()
    setActiveTab("tree")
  }

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.reload()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🌳</div>
            <h1 className="text-2xl font-bold text-gray-900">Family Tree</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="add">Add Member</TabsTrigger>
            <TabsTrigger value="tree">Family Tree</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Family Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <p className="text-gray-600 text-sm">Total Members</p>
                      <p className="text-3xl font-bold text-blue-600">{familyMembers.length}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <p className="text-gray-600 text-sm">Living Members</p>
                      <p className="text-3xl font-bold text-green-600">
                        {familyMembers.filter((m) => !m.date_of_death).length}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="pt-6">
                      <p className="text-gray-600 text-sm">Marriages</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {familyMembers.filter((m) => m.marriage_date).length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Members</h3>
                  <div className="space-y-2">
                    {familyMembers.slice(0, 5).map((member) => (
                      <div key={member.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {member.date_of_birth && new Date(member.date_of_birth).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Family Member
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PersonForm onSuccess={handleAddPerson} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tree">
            <Card>
              <CardHeader>
                <CardTitle>Family Tree</CardTitle>
              </CardHeader>
              <CardContent>
                <FamilyTreeView members={familyMembers} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FamilyMember {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  date_of_death: string
  marriage_date: string
  profile_picture_url: string
}

export function FamilyTreeView({ members }: { members: FamilyMember[] }) {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No family members added yet</p>
        <p className="text-sm text-gray-500">Go to "Add Member" tab to start building your family tree</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <Card
            key={member.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedMember(member)}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                {member.profile_picture_url && (
                  <img
                    src={member.profile_picture_url || "/placeholder.svg"}
                    alt={`${member.first_name} ${member.last_name}`}
                    className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                  />
                )}
                <h3 className="font-semibold text-lg">
                  {member.first_name} {member.last_name}
                </h3>
                {member.date_of_birth && (
                  <p className="text-sm text-gray-600">Born: {new Date(member.date_of_birth).toLocaleDateString()}</p>
                )}
                {member.date_of_death && (
                  <p className="text-sm text-gray-500">Passed: {new Date(member.date_of_death).toLocaleDateString()}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMember && (
        <Card className="border-2 border-blue-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">
                {selectedMember.first_name} {selectedMember.last_name}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMember(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedMember.profile_picture_url && (
                <div>
                  <img
                    src={selectedMember.profile_picture_url || "/placeholder.svg"}
                    alt={`${selectedMember.first_name} ${selectedMember.last_name}`}
                    className="w-full rounded-lg object-cover"
                  />
                </div>
              )}

              <div className="space-y-3">
                {selectedMember.date_of_birth && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Date of Birth</p>
                    <p className="text-lg">{new Date(selectedMember.date_of_birth).toLocaleDateString()}</p>
                  </div>
                )}

                {selectedMember.date_of_death && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Date of Death</p>
                    <p className="text-lg">{new Date(selectedMember.date_of_death).toLocaleDateString()}</p>
                  </div>
                )}

                {selectedMember.marriage_date && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Marriage Date</p>
                    <p className="text-lg">{new Date(selectedMember.marriage_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Heart, Calendar, User } from "lucide-react"

interface Person {
  id: string
  first_name: string
  last_name: string
  date_of_birth?: string
  date_of_death?: string
  marriage_date?: string
  profile_picture?: string
  special_occasions?: any[]
  parent_id?: string
  spouse_id?: string
  created_at: string
}

interface FamilyTreeViewProps {
  people: Person[]
  onEditPerson: (person: Person) => void
}

export default function FamilyTreeView({ people, onEditPerson }: FamilyTreeViewProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  const getChildren = (parentId: string) => {
    return people.filter((person) => person.parent_id === parentId)
  }

  const getSpouse = (spouseId: string) => {
    return people.find((person) => person.id === spouseId)
  }

  const getRootPeople = () => {
    return people.filter((person) => !person.parent_id)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  const calculateAge = (birthDate?: string, deathDate?: string) => {
    if (!birthDate) return ""
    const birth = new Date(birthDate)
    const end = deathDate ? new Date(deathDate) : new Date()
    const age = end.getFullYear() - birth.getFullYear()
    return deathDate ? `(${age} years)` : `(${age} years old)`
  }

  const PersonCard = ({ person, level = 0 }: { person: Person; level?: number }) => {
    const children = getChildren(person.id)
    const spouse = person.spouse_id ? getSpouse(person.spouse_id) : null
    const isSelected = selectedPerson?.id === person.id

    return (
      <div className={`ml-${level * 8}`}>
        <Card
          className={`mb-4 cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-blue-500" : ""}`}
          onClick={() => setSelectedPerson(person)}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {person.profile_picture ? (
                  <img
                    src={person.profile_picture || "/placeholder.svg"}
                    alt={`${person.first_name} ${person.last_name}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {person.first_name} {person.last_name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditPerson(person)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-2 space-y-1">
                  {person.date_of_birth && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Born: {formatDate(person.date_of_birth)}{" "}
                      {calculateAge(person.date_of_birth, person.date_of_death)}
                    </div>
                  )}

                  {person.date_of_death && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Died: {formatDate(person.date_of_death)}
                    </div>
                  )}

                  {spouse && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Heart className="h-4 w-4 mr-2 text-red-500" />
                      Married to: {spouse.first_name} {spouse.last_name}
                      {person.marriage_date && ` (${formatDate(person.marriage_date)})`}
                    </div>
                  )}
                </div>

                {person.special_occasions && person.special_occasions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {person.special_occasions.slice(0, 3).map((occasion, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {occasion.name}
                      </Badge>
                    ))}
                    {person.special_occasions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{person.special_occasions.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {children.length > 0 && (
          <div className="ml-8 border-l-2 border-gray-200 pl-4">
            {children.map((child) => (
              <PersonCard key={child.id} person={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const rootPeople = getRootPeople()

  if (people.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No family members yet</h3>
        <p className="text-gray-600">Start building your family tree by adding the first person.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Family Tree</h3>
          <div className="max-h-96 overflow-y-auto">
            {rootPeople.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </div>

        {selectedPerson && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Person Details</h3>
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {selectedPerson.profile_picture ? (
                    <img
                      src={selectedPerson.profile_picture || "/placeholder.svg"}
                      alt={`${selectedPerson.first_name} ${selectedPerson.last_name}`}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <h4 className="text-xl font-semibold">
                    {selectedPerson.first_name} {selectedPerson.last_name}
                  </h4>
                </div>

                <div className="space-y-3">
                  {selectedPerson.date_of_birth && (
                    <div>
                      <span className="font-medium">Date of Birth:</span>
                      <span className="ml-2">{formatDate(selectedPerson.date_of_birth)}</span>
                    </div>
                  )}

                  {selectedPerson.date_of_death && (
                    <div>
                      <span className="font-medium">Date of Death:</span>
                      <span className="ml-2">{formatDate(selectedPerson.date_of_death)}</span>
                    </div>
                  )}

                  {selectedPerson.marriage_date && (
                    <div>
                      <span className="font-medium">Marriage Date:</span>
                      <span className="ml-2">{formatDate(selectedPerson.marriage_date)}</span>
                    </div>
                  )}

                  {selectedPerson.special_occasions && selectedPerson.special_occasions.length > 0 && (
                    <div>
                      <span className="font-medium">Special Occasions:</span>
                      <div className="mt-2 space-y-2">
                        {selectedPerson.special_occasions.map((occasion, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-medium">{occasion.name}</div>
                            <div className="text-sm text-gray-600">{formatDate(occasion.date)}</div>
                            {occasion.description && (
                              <div className="text-sm text-gray-600 mt-1">{occasion.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button className="w-full mt-6" onClick={() => onEditPerson(selectedPerson)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Person
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

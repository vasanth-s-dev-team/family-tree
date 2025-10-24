"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Person {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  date_of_death: string | null
  marriage_date: string | null
  profile_picture_url: string | null
  user_id: string
  parent_id: string | null
  spouse_id: string | null
}

export default function FamilyTreeView({
  people,
  onPersonSelect,
}: {
  people: Person[]
  onPersonSelect: (person: Person) => void
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((person) => (
            <div
              key={person.id}
              onClick={() => onPersonSelect(person)}
              className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg p-4 border hover:border-blue-400"
            >
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 mb-3">
                  <AvatarImage
                    src={person.profile_picture_url || ""}
                    alt={`${person.first_name} ${person.last_name}`}
                  />
                  <AvatarFallback>
                    {person.first_name[0]}
                    {person.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">
                  {person.first_name} {person.last_name}
                </h3>
                {person.date_of_birth && (
                  <p className="text-xs text-gray-600">b. {new Date(person.date_of_birth).toLocaleDateString()}</p>
                )}
                {person.date_of_death && (
                  <p className="text-xs text-gray-600">d. {new Date(person.date_of_death).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Globe, ChevronDown, ChevronUp, Heart, Users } from 'lucide-react'

interface FamilyMember {
  id: string
  name: string
  relationship?: string
  spouse?: string
  dateOfBirth?: string
  occupation?: string
  location?: string
  photo?: string
  children?: FamilyMember[]
}

interface InteractiveFamilyTreeProps {
  rootMember: FamilyMember
  isPublic?: boolean
  showDetails?: boolean
}

const PersonCard: React.FC<{
  member: FamilyMember
  level: number
  onExpand?: (id: string) => void
  expanded?: boolean
}> = ({ member, level, onExpand, expanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(expanded)
  const hasChildren = member.children && member.children.length > 0

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
    onExpand?.(member.id)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        {/* Connection line from parent */}
        {level > 0 && (
          <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-gradient-to-b from-blue-300 to-blue-400 transform -translate-x-1/2"></div>
        )}

        {/* Person Card */}
        <Card className="w-64 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 transition-all shadow-lg hover:shadow-xl">
          <CardContent className="p-4">
            {/* Avatar */}
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {member.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
            </div>

            {/* Name */}
            <h3 className="text-center font-bold text-lg text-gray-800 mb-1">
              {member.name}
            </h3>

            {/* Relationship Badge */}
            {member.relationship && (
              <div className="flex justify-center mb-2">
                <Badge className="bg-blue-600 text-white text-xs">
                  {member.relationship}
                </Badge>
              </div>
            )}

            {/* Details */}
            {member.spouse && (
              <div className="text-center text-sm text-gray-600 mb-2 flex items-center justify-center gap-1">
                <Heart className="w-3 h-3 text-red-500" />
                <span>{member.spouse}</span>
              </div>
            )}

            {member.occupation && (
              <div className="text-center text-xs text-gray-600 mb-1">
                {member.occupation}
              </div>
            )}

            {member.location && (
              <div className="text-center text-xs text-gray-500 mb-3">
                📍 {member.location}
              </div>
            )}

            {/* Children count indicator */}
            {hasChildren && (
              <button
                onClick={handleToggle}
                className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-1 pt-2 border-t border-blue-200"
              >
                <Users className="w-3 h-3" />
                {member.children?.length} child{member.children?.length !== 1 ? 'ren' : ''}
                {isExpanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {/* Horizontal connector line */}
          <div className="absolute -top-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>

          {/* Vertical connector line */}
          <div className="absolute top-0 left-1/2 w-0.5 bg-blue-300 transform -translate-x-1/2" style={{ height: '24px' }}></div>

          {/* Children grid */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {member.children?.map((child, index) => {
              const childCount = member.children?.length || 0
              const isLeft = index < childCount / 2
              const marginClass = childCount > 1 ? (isLeft ? 'mr-4' : 'ml-4') : ''

              return (
                <div key={child.id} className={marginClass}>
                  {/* Connector from parent to child */}
                  <div className="absolute w-0.5 bg-blue-300 transform -translate-x-1/2" style={{ left: 'calc(50% + 128px)', top: '-24px', height: '24px' }}></div>

                  <PersonCard
                    member={child}
                    level={level + 1}
                    onExpand={onExpand}
                    expanded={true}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export const InteractiveFamilyTree: React.FC<InteractiveFamilyTreeProps> = ({
  rootMember,
  isPublic = false,
  showDetails = true,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([rootMember.id]))

  const handleExpand = (id: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedNodes(newExpanded)
  }

  return (
    <div className="w-full bg-gradient-to-b from-blue-50 via-white to-indigo-50 p-8 rounded-2xl">
      {/* Header with visibility indicator */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Family Tree</h2>
        <div className="flex items-center gap-2">
          {isPublic ? (
            <Badge className="bg-green-500 text-white flex gap-1">
              <Globe className="w-3 h-3" /> Public
            </Badge>
          ) : (
            <Badge className="bg-gray-600 text-white flex gap-1">
              <Lock className="w-3 h-3" /> Private
            </Badge>
          )}
        </div>
      </div>

      {/* Illustration */}
      <div className="mb-8 flex justify-center">
        <img
          src="/family-tree-illustration.png"
          alt="Family Tree Structure"
          className="max-w-2xl w-full rounded-lg shadow-lg border-2 border-blue-200"
        />
      </div>

      {/* Interactive Tree */}
      <div className="flex justify-center overflow-x-auto pb-8">
        <div className="inline-block">
          <PersonCard
            member={rootMember}
            level={0}
            onExpand={handleExpand}
            expanded={true}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <span>Family Member Profile</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span>Married / Spouse</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <span>Has Children (Click to expand)</span>
        </div>
      </div>
    </div>
  )
}

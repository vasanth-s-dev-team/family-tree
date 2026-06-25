'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Lock, 
  Globe, 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Users, 
  Search, 
  Briefcase, 
  MapPin, 
  Calendar, 
  X,
  Sparkles
} from 'lucide-react'

// Define the interface for the family member data
interface FamilyMember {
  id: string
  name: string
  relationship?: string
  spouse?: string
  dateOfBirth?: string
  occupation?: string
  location?: string
  photo?: string
  bio?: string
  whatsapp?: string
  email?: string
  children?: FamilyMember[]
}

interface InteractiveFamilyTreeProps {
  rootMember: FamilyMember
  isPublic?: boolean
  showDetails?: boolean
}

interface RoleStyle {
  borderColor: string
  bgColor: string
  textColor: string
  badgeBg: string
  badgeText: string
  translation: string
  iconColor: string
  iconType: 'star' | 'heart'
  cardColor: string
}

// Function to match relationship types to styles from the "Family Members" poster
function getRoleStyle(relationship?: string): RoleStyle {
  const rel = (relationship || '').toLowerCase().trim()
  
  if (rel.includes('grandfather') || rel.includes('kakek') || rel.includes('patriarch')) {
    return {
      borderColor: 'border-emerald-400',
      bgColor: 'bg-emerald-50/70',
      textColor: 'text-emerald-800',
      badgeBg: 'bg-emerald-100 hover:bg-emerald-100',
      badgeText: 'text-emerald-800 border-emerald-300',
      translation: 'Kakek',
      iconColor: 'text-emerald-500',
      iconType: 'heart',
      cardColor: 'hover:bg-emerald-50/50'
    }
  }
  if (rel.includes('grandmother') || rel.includes('nenek') || rel.includes('matriarch')) {
    return {
      borderColor: 'border-pink-400',
      bgColor: 'bg-pink-50/70',
      textColor: 'text-pink-800',
      badgeBg: 'bg-pink-100 hover:bg-pink-100',
      badgeText: 'text-pink-800 border-pink-300',
      translation: 'Nenek',
      iconColor: 'text-pink-500',
      iconType: 'heart',
      cardColor: 'hover:bg-pink-50/50'
    }
  }
  if (rel.includes('father') || rel.includes('ayah') || rel === 'dad') {
    return {
      borderColor: 'border-sky-400',
      bgColor: 'bg-sky-50/70',
      textColor: 'text-sky-800',
      badgeBg: 'bg-sky-100 hover:bg-sky-100',
      badgeText: 'text-sky-800 border-sky-300',
      translation: 'Ayah',
      iconColor: 'text-sky-500',
      iconType: 'heart',
      cardColor: 'hover:bg-sky-50/50'
    }
  }
  if (rel.includes('mother') || rel.includes('ibu') || rel === 'mom') {
    return {
      borderColor: 'border-rose-400',
      bgColor: 'bg-rose-50/70',
      textColor: 'text-rose-800',
      badgeBg: 'bg-rose-100 hover:bg-rose-100',
      badgeText: 'text-rose-800 border-rose-300',
      translation: 'Ibu',
      iconColor: 'text-rose-500',
      iconType: 'heart',
      cardColor: 'hover:bg-rose-50/50'
    }
  }
  if (rel.includes('uncle') || rel.includes('paman')) {
    return {
      borderColor: 'border-purple-400',
      bgColor: 'bg-purple-50/70',
      textColor: 'text-purple-800',
      badgeBg: 'bg-purple-100 hover:bg-purple-100',
      badgeText: 'text-purple-800 border-purple-300',
      translation: 'Paman',
      iconColor: 'text-purple-500',
      iconType: 'star',
      cardColor: 'hover:bg-purple-50/50'
    }
  }
  if (rel.includes('aunt') || rel.includes('bibi')) {
    return {
      borderColor: 'border-amber-400',
      bgColor: 'bg-amber-50/70',
      textColor: 'text-amber-800',
      badgeBg: 'bg-amber-100 hover:bg-amber-100',
      badgeText: 'text-amber-800 border-amber-300',
      translation: 'Bibi',
      iconColor: 'text-amber-500',
      iconType: 'star',
      cardColor: 'hover:bg-amber-50/50'
    }
  }
  if (rel.includes('brother') || rel.includes('saudara laki-laki')) {
    return {
      borderColor: 'border-emerald-400',
      bgColor: 'bg-emerald-50/60',
      textColor: 'text-emerald-800',
      badgeBg: 'bg-emerald-100 hover:bg-emerald-100',
      badgeText: 'text-emerald-800 border-emerald-300',
      translation: 'Saudara laki-laki',
      iconColor: 'text-emerald-500',
      iconType: 'star',
      cardColor: 'hover:bg-emerald-50/50'
    }
  }
  if (rel.includes('sister') || rel.includes('saudara perempuan')) {
    return {
      borderColor: 'border-pink-400',
      bgColor: 'bg-pink-50/60',
      textColor: 'text-pink-800',
      badgeBg: 'bg-pink-100 hover:bg-pink-100',
      badgeText: 'text-pink-800 border-pink-300',
      translation: 'Saudara perempuan',
      iconColor: 'text-pink-500',
      iconType: 'star',
      cardColor: 'hover:bg-pink-50/50'
    }
  }
  if (rel.includes('son') || rel.includes('anak laki-laki')) {
    return {
      borderColor: 'border-sky-400',
      bgColor: 'bg-sky-50/60',
      textColor: 'text-sky-800',
      badgeBg: 'bg-sky-100 hover:bg-sky-100',
      badgeText: 'text-sky-800 border-sky-300',
      translation: 'Anak laki-laki',
      iconColor: 'text-sky-500',
      iconType: 'star',
      cardColor: 'hover:bg-sky-50/50'
    }
  }
  if (rel.includes('daughter') || rel.includes('anak perempuan')) {
    return {
      borderColor: 'border-rose-400',
      bgColor: 'bg-rose-50/60',
      textColor: 'text-rose-800',
      badgeBg: 'bg-rose-100 hover:bg-rose-100',
      badgeText: 'text-rose-800 border-rose-300',
      translation: 'Anak perempuan',
      iconColor: 'text-rose-500',
      iconType: 'star',
      cardColor: 'hover:bg-rose-50/50'
    }
  }
  if (rel.includes('sibling') || rel.includes('saudara kandung')) {
    return {
      borderColor: 'border-teal-400',
      bgColor: 'bg-teal-50/70',
      textColor: 'text-teal-800',
      badgeBg: 'bg-teal-100 hover:bg-teal-100',
      badgeText: 'text-teal-800 border-teal-300',
      translation: 'Saudara kandung',
      iconColor: 'text-teal-500',
      iconType: 'heart',
      cardColor: 'hover:bg-teal-50/50'
    }
  }
  if (rel.includes('grandchild') || rel.includes('cucu') || rel.includes('grandson') || rel.includes('granddaughter')) {
    return {
      borderColor: 'border-violet-400',
      bgColor: 'bg-violet-50/60',
      textColor: 'text-violet-800',
      badgeBg: 'bg-violet-100 hover:bg-violet-100',
      badgeText: 'text-violet-800 border-violet-300',
      translation: 'Cucu',
      iconColor: 'text-violet-500',
      iconType: 'star',
      cardColor: 'hover:bg-violet-50/50'
    }
  }
  if (rel.includes('cousin') || rel.includes('sepupu')) {
    return {
      borderColor: 'border-orange-400',
      bgColor: 'bg-orange-50/70',
      textColor: 'text-orange-800',
      badgeBg: 'bg-orange-100 hover:bg-orange-100',
      badgeText: 'text-orange-800 border-orange-300',
      translation: 'Sepupu',
      iconColor: 'text-orange-500',
      iconType: 'heart',
      cardColor: 'hover:bg-orange-50/50'
    }
  }
  if (rel.includes('niece') || rel.includes('nephew')) {
    const isNiece = rel.includes('niece')
    return {
      borderColor: isNiece ? 'border-amber-400' : 'border-blue-400',
      bgColor: isNiece ? 'bg-amber-50/60' : 'bg-blue-50/60',
      textColor: isNiece ? 'text-amber-800' : 'text-blue-800',
      badgeBg: isNiece ? 'bg-amber-100 hover:bg-amber-100' : 'bg-blue-100 hover:bg-blue-100',
      badgeText: isNiece ? 'text-amber-800 border-amber-300' : 'text-blue-800 border-blue-300',
      translation: isNiece ? 'Keponakan perempuan' : 'Keponakan laki-laki',
      iconColor: isNiece ? 'text-amber-500' : 'text-blue-500',
      iconType: 'heart',
      cardColor: isNiece ? 'hover:bg-amber-50/50' : 'hover:bg-blue-50/50'
    }
  }

  // Default / "Me" styling
  return {
    borderColor: 'border-indigo-400',
    bgColor: 'bg-indigo-50/70',
    textColor: 'text-indigo-800',
    badgeBg: 'bg-indigo-100 hover:bg-indigo-100',
    badgeText: 'text-indigo-800 border-indigo-300',
    translation: 'Saya',
    iconColor: 'text-indigo-500',
    iconType: 'heart',
    cardColor: 'hover:bg-indigo-50/50'
  }
}

// Get correct spouse relationship type
function getSpouseRelationship(memberRelationship?: string): string {
  const rel = (memberRelationship || '').toLowerCase()
  if (rel.includes('grandfather') || rel === 'patriarch') return 'Grandmother'
  if (rel.includes('grandmother') || rel === 'matriarch') return 'Grandfather'
  if (rel.includes('father') || rel === 'son') return 'Mother'
  if (rel.includes('mother') || rel === 'daughter') return 'Father'
  if (rel.includes('brother')) return 'Sister-in-law'
  if (rel.includes('sister')) return 'Brother-in-law'
  if (rel.includes('uncle')) return 'Aunt'
  if (rel.includes('aunt')) return 'Uncle'
  return 'Spouse'
}

// Flattens hierarchy into list for Poster Grid View
function flattenTree(member: FamilyMember): FamilyMember[] {
  let list: FamilyMember[] = [member]
  if (member.spouse) {
    list.push({
      id: `${member.id}-spouse`,
      name: member.spouse,
      relationship: getSpouseRelationship(member.relationship),
      location: member.location,
      dateOfBirth: member.dateOfBirth,
      occupation: member.relationship?.toLowerCase().includes('patriarch') ? 'Matriarch' : 'Family Member'
    })
  }
  if (member.children) {
    member.children.forEach(child => {
      list = list.concat(flattenTree(child))
    })
  }
  return list
}

// Background leafy decorations helper
const LeavesBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
    <div className="absolute top-12 left-10 text-emerald-600/70 text-3xl animate-bounce" style={{ animationDuration: '6s' }}>🍃</div>
    <div className="absolute top-24 right-20 text-emerald-500/70 text-2xl animate-pulse">🍃</div>
    <div className="absolute top-1/2 left-24 text-emerald-600/60 text-4xl animate-bounce" style={{ animationDuration: '8s' }}>🌿</div>
    <div className="absolute bottom-40 right-24 text-emerald-500/60 text-3xl animate-pulse">🍃</div>
    <div className="absolute bottom-20 left-16 text-emerald-600/70 text-2xl animate-bounce" style={{ animationDuration: '5s' }}>🍃</div>
  </div>
)

// Circular Node component for Visual Tree View
const CircularNode: React.FC<{
  member: FamilyMember
  isSpouse?: boolean
  onClick: () => void
  highlighted?: boolean
}> = ({ member, onClick, highlighted = false }) => {
  const initials = member.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const style = getRoleStyle(member.relationship)

  return (
    <div 
      className={`flex flex-col items-center group cursor-pointer transition-all duration-300 relative z-20 ${
        highlighted ? 'scale-110' : 'hover:scale-105'
      }`}
      onClick={onClick}
    >
      {/* Glow highlight background */}
      {highlighted && (
        <div className="absolute -inset-2 bg-yellow-300/60 rounded-full blur-md animate-ping" style={{ animationDuration: '3s' }}></div>
      )}

      {/* Circle Container */}
      <div className={`relative w-24 h-24 rounded-full border-4 ${
        highlighted ? 'border-yellow-400 shadow-yellow-200/50 shadow-xl' : `${style.borderColor} shadow-md`
      } ${style.bgColor} flex items-center justify-center overflow-hidden transition-all duration-300`}>
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <span className={`text-2xl font-black tracking-wide ${style.textColor}`}>{initials}</span>
        )}
        
        {/* Corner Badge/Icon */}
        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow border border-gray-100">
          {style.iconType === 'heart' ? (
            <Heart className={`w-3 h-3 ${style.iconColor} fill-current`} />
          ) : (
            <span className={`text-[10px] leading-none ${style.iconColor}`}>⭐</span>
          )}
        </div>
      </div>
      
      {/* Label Box */}
      <div className="mt-3 text-center max-w-[130px]">
        <span className={`inline-block px-2.5 py-0.5 rounded-full border ${style.badgeBg} ${style.badgeText} text-[9px] font-black uppercase tracking-wider shadow-sm`}>
          {member.relationship || 'Member'}
        </span>
        <p className="text-xs font-extrabold text-gray-800 mt-1.5 truncate w-full group-hover:text-indigo-600 transition-colors">
          {member.name}
        </p>
      </div>
    </div>
  )
}

// Recursive Tree Node Renderer for Visual Tree View
const TreeNode: React.FC<{
  member: FamilyMember
  level: number
  onNodeClick: (member: FamilyMember) => void
  highlightedId?: string | null
}> = ({ member, level, onNodeClick, highlightedId }) => {
  const hasChildren = member.children && member.children.length > 0
  const hasSpouse = !!member.spouse

  return (
    <div className="flex flex-col items-center">
      {/* Parent node row */}
      <div className="flex items-center gap-10 relative">
        <CircularNode 
          member={member} 
          onClick={() => onNodeClick(member)} 
          highlighted={highlightedId === member.id}
        />
        
        {hasSpouse && (
          <>
            {/* Pulsing horizontal heart bridge */}
            <div className="flex items-center justify-center w-10 relative z-10">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-300 via-rose-400 to-pink-300 transform -translate-y-1/2"></div>
              <div className="bg-white rounded-full p-1.5 shadow-md border border-rose-100 z-10 hover:scale-125 transition-transform cursor-pointer">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              </div>
            </div>
            
            <CircularNode 
              member={{
                id: `${member.id}-spouse`,
                name: member.spouse!,
                relationship: getSpouseRelationship(member.relationship),
                location: member.location,
                dateOfBirth: member.dateOfBirth,
                occupation: member.relationship?.toLowerCase().includes('patriarch') ? 'Matriarch' : 'Family Member'
              }} 
              isSpouse={true}
              onClick={() => onNodeClick({
                id: `${member.id}-spouse`,
                name: member.spouse!,
                relationship: getSpouseRelationship(member.relationship),
                location: member.location,
                dateOfBirth: member.dateOfBirth,
                occupation: member.relationship?.toLowerCase().includes('patriarch') ? 'Matriarch' : 'Family Member'
              })}
              highlighted={highlightedId === `${member.id}-spouse`}
            />
          </>
        )}
      </div>

      {/* Children branching */}
      {hasChildren && (
        <div className="flex flex-col items-center mt-10 w-full relative">
          {/* Vertical path from parents */}
          <div className="w-1 h-10 bg-gradient-to-b from-amber-700 to-emerald-500 rounded-full"></div>

          {/* Horizontal branching connector */}
          {member.children!.length > 1 && (
            <div className="w-full px-16 relative">
              <div className="absolute top-0 left-16 right-16 h-1 bg-emerald-500 rounded-full"></div>
            </div>
          )}

          {/* Children grids */}
          <div className="flex justify-center gap-14 mt-4 flex-wrap relative">
            {member.children!.map((child) => (
              <div key={child.id} className="relative pt-6">
                {/* Branch connector up to the main horizontal line */}
                <div className="absolute top-0 left-1/2 w-1 h-6 bg-emerald-500 transform -translate-x-1/2 -translate-y-6"></div>
                
                <TreeNode 
                  member={child} 
                  level={level + 1} 
                  onNodeClick={onNodeClick}
                  highlightedId={highlightedId}
                />
              </div>
            ))}
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
  const [activeTab, setActiveTab] = useState<'tree' | 'grid'>('tree')
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  // Flatten the tree for search / Grid wall view
  const allMembers = Array.from(new Map(flattenTree(rootMember).map(m => [m.id, m])).values())

  // Filter list based on search query
  const filteredMembers = allMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.relationship && m.relationship.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (m.location && m.location.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    
    // Auto-highlight match in Tree View
    if (value.trim()) {
      const match = allMembers.find(m => m.name.toLowerCase().includes(value.toLowerCase()))
      if (match) {
        setHighlightedId(match.id)
      } else {
        setHighlightedId(null)
      }
    } else {
      setHighlightedId(null)
    }
  }

  const handleNodeClick = (member: FamilyMember) => {
    setSelectedMember(member)
  }

  return (
    <div className="w-full bg-gradient-to-b from-teal-50 via-white to-blue-50/50 p-6 md:p-8 rounded-3xl border border-teal-100 shadow-xl relative overflow-hidden">
      
      {/* Decorative Tree Background for container */}
      <LeavesBackground />

      {/* Header section with visibility badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-teal-100/50 pb-6 relative z-10">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-teal-500 fill-teal-100" />
            Family Tree
          </h2>
          <p className="text-sm text-gray-500">Discover and manage your ancestry lines</p>
        </div>
        <div className="flex items-center gap-3">
          {isPublic ? (
            <Badge className="bg-emerald-500 text-white font-bold py-1 px-3 rounded-full shadow-sm flex items-center gap-1.5 border-none">
              <Globe className="w-3.5 h-3.5" /> Public View
            </Badge>
          ) : (
            <Badge className="bg-gray-600 text-white font-bold py-1 px-3 rounded-full shadow-sm flex items-center gap-1.5 border-none">
              <Lock className="w-3.5 h-3.5" /> Private
            </Badge>
          )}
        </div>
      </div>

      {/* Search and Tabs Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 relative z-10 bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-teal-50 shadow-sm">
        {/* Toggle tabs styled like wood/playful sliders */}
        <div className="flex gap-1.5 p-1 bg-teal-50 rounded-xl w-full md:w-auto">
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('tree')}
            className={`flex-1 md:flex-none font-extrabold text-sm px-5 py-2.5 rounded-lg transition-all ${
              activeTab === 'tree' 
                ? 'bg-white text-teal-800 shadow-sm border border-teal-100' 
                : 'text-gray-600 hover:text-teal-700'
            }`}
          >
            🌳 Interactive Tree
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('grid')}
            className={`flex-1 md:flex-none font-extrabold text-sm px-5 py-2.5 rounded-lg transition-all ${
              activeTab === 'grid' 
                ? 'bg-white text-teal-800 shadow-sm border border-teal-100' 
                : 'text-gray-600 hover:text-teal-700'
            }`}
          >
            📋 Relationship Poster
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-teal-600/70 w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search family by name, role..."
            className="pl-10 pr-4 py-2 border-teal-100 rounded-xl bg-white/95 focus:ring-2 focus:ring-teal-400 focus:border-transparent"
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setHighlightedId(null); }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div className="relative z-10 min-h-[450px]">
        {activeTab === 'tree' ? (
          /* TREE STRUCTURE MODE */
          <div className="w-full overflow-x-auto pb-10 bg-white/50 backdrop-blur-sm rounded-2xl border border-teal-50/50 p-6 md:p-10 flex justify-center">
            <div className="inline-block relative min-w-max px-8">
              {/* Central Trunk Column Line behind tree nodes */}
              <div className="absolute top-10 bottom-10 left-1/2 w-2.5 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 transform -translate-x-1/2 opacity-35 rounded-full pointer-events-none"></div>
              
              <TreeNode 
                member={rootMember} 
                level={0} 
                onNodeClick={handleNodeClick}
                highlightedId={highlightedId}
              />
            </div>
          </div>
        ) : (
          /* DASHBOARD CARD POSTER MODE */
          <div className="space-y-10">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-teal-200">
                <p className="text-gray-500 font-medium">No family members match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMembers.map((member) => {
                  const style = getRoleStyle(member.relationship)
                  const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  
                  return (
                    <Card 
                      key={member.id} 
                      onClick={() => handleNodeClick(member)}
                      className={`cursor-pointer border-2 border-dashed ${style.borderColor} ${style.bgColor} ${style.cardColor} hover:shadow-xl hover:scale-[1.03] transition-all duration-300 rounded-2xl overflow-hidden`}
                    >
                      <CardContent className="p-5 flex flex-col items-center relative">
                        {/* Playful corner icon badge */}
                        <div className="absolute top-3 right-3">
                          {style.iconType === 'heart' ? (
                            <Heart className={`w-5 h-5 ${style.iconColor} fill-current opacity-80`} />
                          ) : (
                            <span className={`text-base ${style.iconColor} select-none`}>⭐</span>
                          )}
                        </div>

                        {/* Image/Avatar */}
                        <div className={`w-20 h-20 rounded-full border-4 ${style.borderColor} bg-white flex items-center justify-center overflow-hidden mb-4 shadow-sm`}>
                          {member.photo ? (
                            <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className={`text-xl font-black ${style.textColor}`}>{initials}</span>
                          )}
                        </div>

                        {/* Header Details */}
                        <div className="text-center w-full space-y-1">
                          <h4 className="font-extrabold text-gray-800 text-base group-hover:text-indigo-700 truncate px-2" title={member.name}>
                            {member.name}
                          </h4>
                          
                          {/* Relationship and translation label */}
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-black tracking-wide text-gray-700">
                              {member.relationship || 'Family'}
                            </span>
                            {style.translation && (
                              <span className="text-[10px] text-gray-500 italic mt-0.5">
                                ({style.translation})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Summary details */}
                        <div className="mt-4 pt-3 border-t border-dashed border-teal-100/50 w-full space-y-1.5 text-center text-xs text-gray-600">
                          {member.occupation && (
                            <p className="truncate flex items-center justify-center gap-1 px-1">
                              <Briefcase className="w-3 h-3 text-teal-600" /> {member.occupation}
                            </p>
                          )}
                          {member.location && (
                            <p className="truncate flex items-center justify-center gap-1 px-1">
                              <MapPin className="w-3 h-3 text-red-500" /> {member.location}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Rustic wooden signboard quote block at the bottom of the poster */}
            <div className="flex flex-col items-center pt-8">
              <div className="relative bg-amber-100/90 border-4 border-amber-800 rounded-2xl px-10 py-7 shadow-lg max-w-sm text-center border-dashed">
                {/* Bolts details */}
                <div className="absolute top-2 left-2 w-2.5 h-2.5 bg-amber-950 rounded-full"></div>
                <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-amber-950 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-2.5 h-2.5 bg-amber-950 rounded-full"></div>
                <div className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-amber-950 rounded-full"></div>
                
                <p className="font-extrabold text-amber-900 text-lg uppercase tracking-wider mb-0.5 font-serif">
                  Family is where
                </p>
                <p className="font-extrabold text-amber-900 text-lg uppercase tracking-wider mb-0.5 font-serif">
                  life begins and
                </p>
                <p className="font-extrabold text-amber-900 text-lg uppercase tracking-wider font-serif">
                  love never ends.
                </p>
                <div className="flex justify-center mt-3">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                </div>
              </div>
              
              {/* Wooden fence posts */}
              <div className="flex justify-between w-40 -mt-1 h-10">
                <div className="w-3.5 bg-amber-800 shadow"></div>
                <div className="w-3.5 bg-amber-800 shadow"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL DRAWER OVERLAY */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <Card className="w-full max-w-md bg-white border border-teal-100 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
            
            {/* Banner gradient background */}
            <div className="h-28 bg-gradient-to-r from-teal-400 to-indigo-500 relative flex items-end justify-center">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedMember(null)}
                className="absolute top-3 right-3 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Profile Avatar overlaid on banner */}
            <div className="flex justify-center -mt-14 relative z-10">
              <div className="w-28 h-28 rounded-full border-4 border-white bg-teal-50 shadow-md overflow-hidden flex items-center justify-center">
                {selectedMember.photo ? (
                  <img src={selectedMember.photo} alt={selectedMember.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-teal-800">
                    {selectedMember.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <CardContent className="p-6 pt-3 text-center space-y-6">
              {/* Member title */}
              <div className="space-y-1">
                <h3 className="text-xl font-black text-gray-800">{selectedMember.name}</h3>
                <div className="flex justify-center gap-1.5 flex-wrap items-center">
                  <Badge className="bg-teal-600 text-white font-extrabold text-xs px-3 py-0.5 rounded-full border-none">
                    {selectedMember.relationship || 'Family Member'}
                  </Badge>
                  {selectedMember.spouse && (
                    <Badge variant="outline" className="text-rose-600 border-rose-200 bg-rose-50/50 font-bold text-xs flex items-center gap-1 rounded-full">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-400" /> Sp: {selectedMember.spouse}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Bio block if present */}
              {selectedMember.bio && (
                <div className="bg-teal-50/40 p-4 rounded-2xl border border-teal-100/50 text-sm text-gray-600 italic">
                  "{selectedMember.bio}"
                </div>
              )}

              {/* List details */}
              <div className="space-y-3.5 text-sm text-gray-700 text-left bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                {selectedMember.dateOfBirth && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                    <span><strong className="text-gray-800 font-semibold">Born:</strong> {new Date(selectedMember.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
                {selectedMember.occupation && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-teal-600 shrink-0" />
                    <span><strong className="text-gray-800 font-semibold">Occupation:</strong> {selectedMember.occupation}</span>
                  </div>
                )}
                {selectedMember.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    <span><strong className="text-gray-800 font-semibold">Location:</strong> {selectedMember.location}</span>
                  </div>
                )}
                {selectedMember.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-teal-600 font-bold shrink-0">✉</span>
                    <span><strong className="text-gray-800 font-semibold">Email:</strong> {selectedMember.email}</span>
                  </div>
                )}
                {selectedMember.whatsapp && (
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">💬</span>
                    <span><strong className="text-gray-800 font-semibold">WhatsApp:</strong> {selectedMember.whatsapp}</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-2">
                <Button 
                  onClick={() => setSelectedMember(null)}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold py-2.5 shadow-md"
                >
                  Close Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

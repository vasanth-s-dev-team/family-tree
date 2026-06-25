'use client'

import { InteractiveFamilyTree } from '@/components/interactive-family-tree'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Share2, Lock, Globe } from 'lucide-react'

export default function FamilyTreeDemoPage() {
  // Ambani family example
  const ambaniFamilyTree = {
    id: '1',
    name: 'Dhirubhai Ambani',
    relationship: 'Patriarch',
    occupation: 'Founder, Reliance Industries',
    location: 'India',
    children: [
      {
        id: '2',
        name: 'Mukesh Ambani',
        relationship: 'Son',
        spouse: 'Nita Ambani',
        occupation: 'Chairman, Reliance Industries',
        location: 'Mumbai',
        children: [
          {
            id: '5',
            name: 'Akash Ambani',
            relationship: 'Grandson',
            spouse: 'Shloka Mehta',
            occupation: 'Businessman',
            location: 'Mumbai',
            children: [
              {
                id: '9',
                name: 'Prithvi Ambani',
                relationship: 'Great-grandson',
                occupation: 'Student',
                location: 'Mumbai',
                children: [],
              },
              {
                id: '10',
                name: 'Veda Ambani',
                relationship: 'Great-granddaughter',
                occupation: 'Student',
                location: 'Mumbai',
                children: [],
              },
            ],
          },
          {
            id: '6',
            name: 'Isha Ambani',
            relationship: 'Granddaughter',
            spouse: 'Anand Piramal',
            occupation: 'Businesswoman',
            location: 'Mumbai',
            children: [
              {
                id: '11',
                name: 'Krishna Piramal',
                relationship: 'Great-grandson',
                occupation: 'Student',
                location: 'Mumbai',
                children: [],
              },
              {
                id: '12',
                name: 'Aadiya Piramal',
                relationship: 'Great-granddaughter',
                occupation: 'Student',
                location: 'Mumbai',
                children: [],
              },
            ],
          },
          {
            id: '7',
            name: 'Anant Ambani',
            relationship: 'Grandson',
            spouse: 'Radhika Merchant',
            occupation: 'Businessman',
            location: 'Mumbai',
            children: [],
          },
        ],
      },
      {
        id: '3',
        name: 'Anil Ambani',
        relationship: 'Son',
        spouse: 'Tina Ambani',
        occupation: 'Chairman, Reliance Anil Dhirubhai Ambani Group',
        location: 'Mumbai',
        children: [
          {
            id: '8',
            name: 'Jai Anmol Ambani',
            relationship: 'Grandson',
            spouse: 'Krisha Shah',
            occupation: 'Businessman',
            location: 'Mumbai',
            children: [],
          },
          {
            id: '13',
            name: 'Jai Anshul Ambani',
            relationship: 'Grandson',
            occupation: 'Businessman',
            location: 'Mumbai',
            children: [],
          },
        ],
      },
      {
        id: '4',
        name: 'Nina Kothari',
        relationship: 'Daughter',
        occupation: 'Homemaker',
        location: 'India',
        children: [],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Interactive Family Tree Visualization
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Display your family hierarchy with public and private visibility controls
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Globe className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Public View</h3>
                    <p className="text-sm text-gray-600">Share family tree with anyone</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Private View</h3>
                    <p className="text-sm text-gray-600">Only family members see it</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Share2 className="w-6 h-6 text-purple-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Easy Sharing</h3>
                    <p className="text-sm text-gray-600">Share link on social media</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">
                    👥
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Multi-Generation</h3>
                    <p className="text-sm text-gray-600">Support unlimited levels</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Public Family Tree Example */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ambani Family Tree (Public Example)</CardTitle>
              <div className="flex gap-2">
                <Badge className="bg-green-500">
                  <Globe className="w-3 h-3 mr-1" /> Public
                </Badge>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <InteractiveFamilyTree rootMember={ambaniFamilyTree} isPublic={true} />
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">1. Create Your Family</h4>
              <p className="text-gray-600">
                Start by creating a family and adding yourself as the root member.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">2. Add Family Members</h4>
              <p className="text-gray-600">
                Add relatives with their relationships, occupations, and photos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">3. Set Visibility</h4>
              <p className="text-gray-600">
                Choose between Public (anyone can view) or Private (only family members).
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">4. Share & Grow</h4>
              <p className="text-gray-600">
                Share the link with other family members to invite them to join and expand the tree.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

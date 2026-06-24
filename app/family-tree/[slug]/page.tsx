import { PublicFamilyTree } from "@/components/public-family-tree"
import { Metadata } from "next"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Family Tree - " + params.slug,
    description: "View this family tree and share it with your family",
    openGraph: {
      title: "Family Tree",
      description: "Check out this family tree",
      type: "website",
    },
  }
}

export default function PublicFamilyTreePage({ params }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <PublicFamilyTree treeUrl={params.slug} />
      </div>
    </div>
  )
}

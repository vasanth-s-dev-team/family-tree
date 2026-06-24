import { createServerClient, serialize } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    // Find the public family tree by slug
    const { data: familyTree, error: treeError } = await supabase
      .from("family_trees")
      .select("*")
      .eq("public_url_slug", params.slug)
      .eq("is_public", true)
      .single()

    if (treeError || !familyTree) {
      return NextResponse.json(
        { error: "Family tree not found" },
        { status: 404 }
      )
    }

    // Get all members for this family tree
    const { data: members, error: membersError } = await supabase
      .from("people")
      .select("*")
      .eq("family_tree_id", familyTree.id)

    if (membersError) {
      return NextResponse.json(
        { error: "Failed to load members" },
        { status: 500 }
      )
    }

    // Increment view count
    await supabase
      .from("sharing_links")
      .update({ view_count: familyTree.view_count + 1 })
      .eq("id", familyTree.id)

    return NextResponse.json({
      name: familyTree.name,
      description: familyTree.description,
      members: members || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching public family tree:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

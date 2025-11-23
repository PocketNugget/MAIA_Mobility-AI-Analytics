import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Supabase query error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ success: false, error: "Record not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch record"
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

// PUT /api/records/[id] - Update record
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  // TODO: Implement record update
  // - Validate request body
  // - Update record in database
  // - Return updated record
  return Response.json({ success: true, data: { id } })
}

// DELETE /api/records/[id] - Delete record
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  // TODO: Implement record deletion
  // - Delete from database
  // - Return success response
  return Response.json({ success: true, data: { id } })
}

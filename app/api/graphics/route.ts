import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { name, type, groupBy, filters, dateRange } = body

    if (!name || !type || !groupBy) {
      return NextResponse.json(
        { success: false, error: "Name, type, and groupBy are required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("saved_graphics")
      .insert({
        name,
        graphic_type: type,
        group_by: groupBy,
        filters: filters || {},
        date_range: dateRange || "last7days",
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Failed to save graphic:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save graphic" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("saved_graphics")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Failed to fetch graphics:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch graphics" },
      { status: 500 }
    )
  }
}

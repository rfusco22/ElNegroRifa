import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const rifas = await query("SELECT * FROM rifas WHERE is_active = TRUE ORDER BY created_at DESC")
    return NextResponse.json(rifas)
  } catch (error) {
    console.error("Error fetching rifas:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, first_prize, second_prize, third_prize, ticket_price, draw_date } = await request.json()

    await query(
      "INSERT INTO rifas (title, description, first_prize, second_prize, third_prize, ticket_price, draw_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, description, first_prize, second_prize, third_prize, ticket_price, draw_date, (session.user as any).id],
    )

    return NextResponse.json({ message: "Rifa created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating rifa:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

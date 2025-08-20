import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const numbers = await query(
      `
      SELECT 
        n.id,
        n.number,
        n.payment_method,
        n.payment_reference,
        n.is_paid,
        n.payment_validated,
        n.created_at,
        r.title as rifa_title
      FROM numbers n
      JOIN rifas r ON n.rifa_id = r.id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `,
      [(session.user as any).id],
    )

    return NextResponse.json(numbers)
  } catch (error) {
    console.error("Error fetching user numbers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

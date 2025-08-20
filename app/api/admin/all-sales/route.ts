import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const allSales = await query(`
      SELECT 
        n.id,
        n.number,
        n.payment_method,
        n.payment_reference,
        n.payment_validated,
        n.created_at,
        u.name as user_name,
        u.email as user_email,
        u.phone as user_phone,
        r.title as rifa_title,
        r.ticket_price
      FROM numbers n
      JOIN users u ON n.user_id = u.id
      JOIN rifas r ON n.rifa_id = r.id
      WHERE n.is_paid = TRUE
      ORDER BY n.created_at DESC
    `)

    return NextResponse.json(allSales)
  } catch (error) {
    console.error("Error fetching all sales:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

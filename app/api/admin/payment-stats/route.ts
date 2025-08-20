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

    const paymentStats = await query(`
      SELECT 
        n.payment_method as method,
        COUNT(*) as count,
        SUM(r.ticket_price) as total_amount
      FROM numbers n
      JOIN rifas r ON n.rifa_id = r.id
      WHERE n.is_paid = TRUE AND n.payment_validated = TRUE
      GROUP BY n.payment_method
      ORDER BY count DESC
    `)

    return NextResponse.json(paymentStats)
  } catch (error) {
    console.error("Error fetching payment stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

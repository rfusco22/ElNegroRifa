import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    // Get general statistics
    const totalUsers = (await query("SELECT COUNT(*) as count FROM users WHERE role = 'user'")) as any[]
    const totalPurchases = (await query("SELECT COUNT(*) as count FROM purchases")) as any[]
    const pendingPurchases = (await query("SELECT COUNT(*) as count FROM purchases WHERE status = 'pending'")) as any[]
    const validatedPurchases = (await query(
      "SELECT COUNT(*) as count FROM purchases WHERE status = 'validated'",
    )) as any[]

    // Get revenue statistics
    const totalRevenue = (await query(
      "SELECT COALESCE(SUM(total_amount), 0) as total FROM purchases WHERE status = 'validated'",
    )) as any[]

    const pendingRevenue = (await query(
      "SELECT COALESCE(SUM(total_amount), 0) as total FROM purchases WHERE status = 'pending'",
    )) as any[]

    // Get numbers statistics
    const soldNumbers = (await query("SELECT COUNT(*) as count FROM numbers WHERE status = 'sold'")) as any[]
    const availableNumbers = (await query("SELECT COUNT(*) as count FROM numbers WHERE status = 'available'")) as any[]

    // Get recent purchases
    const recentPurchases = (await query(
      `SELECT p.*, u.first_name, u.last_name, r.title as raffle_title
       FROM purchases p
       JOIN users u ON p.user_id = u.id
       JOIN raffles r ON p.raffle_id = r.id
       ORDER BY p.created_at DESC
       LIMIT 10`,
    )) as any[]

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers[0].count,
        totalPurchases: totalPurchases[0].count,
        pendingPurchases: pendingPurchases[0].count,
        validatedPurchases: validatedPurchases[0].count,
        totalRevenue: totalRevenue[0].total,
        pendingRevenue: pendingRevenue[0].total,
        soldNumbers: soldNumbers[0].count,
        availableNumbers: availableNumbers[0].count,
      },
      recentPurchases,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

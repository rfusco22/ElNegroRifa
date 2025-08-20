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

    // Get total users
    const [totalUsersResult] = (await query("SELECT COUNT(*) as count FROM users")) as any[]
    const totalUsers = totalUsersResult.count

    // Get total numbers sold
    const [totalNumbersResult] = (await query("SELECT COUNT(*) as count FROM numbers WHERE is_paid = TRUE")) as any[]
    const totalNumbers = totalNumbersResult.count

    // Get total revenue
    const totalRevenue = totalNumbers * 400

    // Get pending validations
    const [pendingResult] = (await query(
      "SELECT COUNT(*) as count FROM numbers WHERE is_paid = TRUE AND payment_validated = FALSE",
    )) as any[]
    const pendingValidations = pendingResult.count

    return NextResponse.json({
      totalUsers,
      totalNumbers,
      totalRevenue,
      pendingValidations,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

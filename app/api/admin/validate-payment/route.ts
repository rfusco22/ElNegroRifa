import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { numberId, approved } = await request.json()

    if (approved) {
      // Approve payment
      await query("UPDATE numbers SET payment_validated = TRUE, validated_by = ?, validated_at = NOW() WHERE id = ?", [
        (session.user as any).id,
        numberId,
      ])
    } else {
      // Reject payment - remove the number reservation
      await query("DELETE FROM numbers WHERE id = ?", [numberId])
    }

    return NextResponse.json({ message: approved ? "Payment approved" : "Payment rejected" })
  } catch (error) {
    console.error("Error validating payment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

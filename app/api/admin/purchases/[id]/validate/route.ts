import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const purchaseId = params.id
    const { action } = await request.json() // 'approve' or 'reject'

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 })
    }

    // Get purchase details
    const purchases = (await query("SELECT * FROM purchases WHERE id = ?", [purchaseId])) as any[]

    if (purchases.length === 0) {
      return NextResponse.json({ error: "Compra no encontrada" }, { status: 404 })
    }

    const purchase = purchases[0]
    const numbers = JSON.parse(purchase.numbers)

    if (action === "approve") {
      // Update purchase status
      await query("UPDATE purchases SET status = 'validated', validated_by = ?, validated_at = NOW() WHERE id = ?", [
        decoded.id,
        purchaseId,
      ])

      // Mark numbers as sold
      await query(
        `UPDATE numbers SET status = 'sold', user_id = ? 
         WHERE raffle_id = ? AND number IN (${numbers.map(() => "?").join(",")})`,
        [purchase.user_id, purchase.raffle_id, ...numbers],
      )

      return NextResponse.json({ message: "Compra aprobada exitosamente" })
    } else {
      // Reject purchase
      await query("UPDATE purchases SET status = 'rejected', validated_by = ?, validated_at = NOW() WHERE id = ?", [
        decoded.id,
        purchaseId,
      ])

      // Release reserved numbers
      await query(
        `UPDATE numbers SET status = 'available', user_id = NULL, reserved_until = NULL 
         WHERE raffle_id = ? AND number IN (${numbers.map(() => "?").join(",")})`,
        [purchase.raffle_id, ...numbers],
      )

      return NextResponse.json({ message: "Compra rechazada" })
    }
  } catch (error) {
    console.error("Error validating purchase:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

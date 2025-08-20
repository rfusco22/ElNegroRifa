import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const { raffleId, numbers, paymentMethod, paymentReference, paymentProof } = await request.json()

    if (!raffleId || !numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return NextResponse.json({ error: "Datos de compra inválidos" }, { status: 400 })
    }

    if (!paymentMethod || !paymentReference) {
      return NextResponse.json({ error: "Método de pago y referencia son requeridos" }, { status: 400 })
    }

    // Get raffle info
    const raffles = (await query("SELECT ticket_price FROM raffles WHERE id = ? AND status = 'active'", [
      raffleId,
    ])) as any[]

    if (raffles.length === 0) {
      return NextResponse.json({ error: "Rifa no encontrada o inactiva" }, { status: 404 })
    }

    const ticketPrice = raffles[0].ticket_price
    const totalAmount = numbers.length * ticketPrice

    // Verify numbers are still reserved by this user
    const reservedNumbers = (await query(
      `SELECT number FROM numbers WHERE raffle_id = ? AND number IN (${numbers.map(() => "?").join(",")}) 
       AND status = 'reserved' AND user_id = ? AND reserved_until > NOW()`,
      [raffleId, ...numbers, decoded.id],
    )) as any[]

    if (reservedNumbers.length !== numbers.length) {
      return NextResponse.json({ error: "Algunos números ya no están reservados para ti" }, { status: 400 })
    }

    // Create purchase record
    const purchaseResult = (await query(
      `INSERT INTO purchases (user_id, raffle_id, numbers, total_amount, payment_method, payment_reference, payment_proof) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [decoded.id, raffleId, JSON.stringify(numbers), totalAmount, paymentMethod, paymentReference, paymentProof],
    )) as any

    return NextResponse.json({
      message: "Compra registrada exitosamente",
      purchaseId: purchaseResult.insertId,
      status: "pending",
    })
  } catch (error) {
    console.error("Error creating purchase:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const purchases = (await query(
      `SELECT p.*, r.title as raffle_title, r.draw_date 
       FROM purchases p 
       JOIN raffles r ON p.raffle_id = r.id 
       WHERE p.user_id = ? 
       ORDER BY p.created_at DESC`,
      [decoded.id],
    )) as any[]

    return NextResponse.json({ purchases })
  } catch (error) {
    console.error("Error fetching purchases:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

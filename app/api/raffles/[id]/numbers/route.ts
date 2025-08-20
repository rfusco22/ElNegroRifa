import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const raffleId = params.id

    // Get available numbers for the raffle
    const numbers = (await query(
      "SELECT number, status FROM numbers WHERE raffle_id = ? ORDER BY CAST(number AS UNSIGNED)",
      [raffleId],
    )) as any[]

    return NextResponse.json({ numbers })
  } catch (error) {
    console.error("Error fetching numbers:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const raffleId = params.id
    const { numbers } = await request.json()

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return NextResponse.json({ error: "Debe seleccionar al menos un número" }, { status: 400 })
    }

    // Check if numbers are available
    const existingNumbers = (await query(
      `SELECT number FROM numbers WHERE raffle_id = ? AND number IN (${numbers.map(() => "?").join(",")}) AND status != 'available'`,
      [raffleId, ...numbers],
    )) as any[]

    if (existingNumbers.length > 0) {
      return NextResponse.json(
        {
          error: "Algunos números ya no están disponibles",
          unavailableNumbers: existingNumbers.map((n: any) => n.number),
        },
        { status: 400 },
      )
    }

    // Reserve numbers for 10 minutes
    const reserveUntil = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now

    await query(
      `UPDATE numbers SET status = 'reserved', user_id = ?, reserved_until = ? 
       WHERE raffle_id = ? AND number IN (${numbers.map(() => "?").join(",")}) AND status = 'available'`,
      [decoded.id, reserveUntil, raffleId, ...numbers],
    )

    return NextResponse.json({ message: "Números reservados exitosamente", reserveUntil })
  } catch (error) {
    console.error("Error reserving numbers:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

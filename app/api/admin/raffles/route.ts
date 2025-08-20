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

    const raffles = (await query("SELECT * FROM raffles ORDER BY created_at DESC")) as any[]

    return NextResponse.json({ raffles })
  } catch (error) {
    console.error("Error fetching raffles:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const { title, description, ticket_price, first_prize, second_prize, third_prize, draw_date } = await request.json()

    if (!title || !ticket_price || !first_prize || !second_prize || !third_prize || !draw_date) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Create new raffle
    const result = (await query(
      `INSERT INTO raffles (title, description, ticket_price, first_prize, second_prize, third_prize, draw_date, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, ticket_price, first_prize, second_prize, third_prize, draw_date, decoded.id],
    )) as any

    const raffleId = result.insertId

    // Generate all numbers (000-999) for the new raffle
    const numbers = []
    for (let i = 0; i < 1000; i++) {
      numbers.push([raffleId, i.toString().padStart(3, "0")])
    }

    await query(
      `INSERT INTO numbers (raffle_id, number) VALUES ${numbers.map(() => "(?, ?)").join(", ")}`,
      numbers.flat(),
    )

    return NextResponse.json({ message: "Rifa creada exitosamente", raffleId })
  } catch (error) {
    console.error("Error creating raffle:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

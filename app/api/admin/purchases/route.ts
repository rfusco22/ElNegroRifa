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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"

    let whereClause = ""
    const params: any[] = []

    if (status !== "all") {
      whereClause = "WHERE p.status = ?"
      params.push(status)
    }

    const purchases = (await query(
      `SELECT p.*, u.first_name, u.last_name, u.email, u.phone, u.cedula, r.title as raffle_title
       FROM purchases p
       JOIN users u ON p.user_id = u.id
       JOIN raffles r ON p.raffle_id = r.id
       ${whereClause}
       ORDER BY p.created_at DESC`,
      params,
    )) as any[]

    return NextResponse.json({ purchases })
  } catch (error) {
    console.error("Error fetching admin purchases:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

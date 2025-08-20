import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail, generateToken } from "@/lib/auth"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { email, password, first_name, last_name, phone, cedula } = await request.json()

    if (!email || !password || !first_name || !last_name || !phone || !cedula) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 })
    }

    // Check if cedula already exists
    const existingCedula = (await query("SELECT id FROM users WHERE cedula = ?", [cedula])) as any[]
    if (existingCedula.length > 0) {
      return NextResponse.json({ error: "La cédula ya está registrada" }, { status: 400 })
    }

    const user = await createUser({
      email,
      password,
      first_name,
      last_name,
      phone,
      cedula,
    })

    const token = generateToken({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      cedula: user.cedula,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    })

    const response = NextResponse.json({
      message: "Registro exitoso",
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

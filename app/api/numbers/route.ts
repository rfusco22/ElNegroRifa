import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rifaId = searchParams.get("rifaId")

    if (!rifaId) {
      return NextResponse.json({ error: "Rifa ID is required" }, { status: 400 })
    }

    const numbers = await query(
      "SELECT number, is_paid, payment_validated FROM numbers WHERE rifa_id = ? AND (is_paid = TRUE OR payment_validated = TRUE)",
      [rifaId],
    )

    return NextResponse.json(numbers)
  } catch (error) {
    console.error("Error fetching numbers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { rifaId, numbers, paymentMethod, paymentReference } = await request.json()

    // Validate input
    if (!rifaId || !numbers || !Array.isArray(numbers) || numbers.length === 0 || !paymentMethod || !paymentReference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if numbers are already taken
    const existingNumbers = (await query(
      "SELECT number FROM numbers WHERE rifa_id = ? AND number IN (" +
        numbers.map(() => "?").join(",") +
        ") AND (is_paid = TRUE OR payment_validated = TRUE)",
      [rifaId, ...numbers],
    )) as any[]

    if (existingNumbers.length > 0) {
      return NextResponse.json(
        { error: "Some numbers are already taken", takenNumbers: existingNumbers.map((n: any) => n.number) },
        { status: 400 },
      )
    }

    // Insert numbers with is_paid = TRUE (pending validation)
    for (const number of numbers) {
      await query(
        "INSERT INTO numbers (rifa_id, number, user_id, payment_method, payment_reference, is_paid) VALUES (?, ?, ?, ?, ?, TRUE)",
        [rifaId, number, (session.user as any).id, paymentMethod, paymentReference],
      )
    }

    return NextResponse.json({ message: "Numbers reserved successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error reserving numbers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

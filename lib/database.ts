import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "rifas_el_negro",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
}

let connection: mysql.Connection | null = null

export async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection(dbConfig)
  }
  return connection
}

export async function query(sql: string, params: any[] = []) {
  const conn = await getConnection()
  const [results] = await conn.execute(sql, params)
  return results
}

export async function closeConnection() {
  if (connection) {
    await connection.end()
    connection = null
  }
}

// Database models types
export interface User {
  id: number
  email: string
  password: string
  first_name: string
  last_name: string
  phone: string
  cedula: string
  role: "user" | "admin"
  created_at: Date
  updated_at: Date
}

export interface Raffle {
  id: number
  title: string
  description: string
  ticket_price: number
  total_numbers: number
  first_prize: number
  second_prize: number
  third_prize: number
  draw_date: Date
  status: "active" | "closed" | "drawn"
  created_by: number
  created_at: Date
  updated_at: Date
}

export interface RaffleNumber {
  id: number
  raffle_id: number
  number: string
  status: "available" | "reserved" | "sold"
  user_id?: number
  reserved_until?: Date
  created_at: Date
  updated_at: Date
}

export interface Purchase {
  id: number
  user_id: number
  raffle_id: number
  numbers: string[]
  total_amount: number
  payment_method: "pago_movil" | "binance" | "zelle"
  payment_reference?: string
  payment_proof?: string
  status: "pending" | "validated" | "rejected"
  validated_by?: number
  validated_at?: Date
  created_at: Date
  updated_at: Date
}

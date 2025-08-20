import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "./database"
import type { User } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: Omit<User, "password">): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const results = (await query("SELECT * FROM users WHERE email = ?", [email])) as User[]

  return results.length > 0 ? results[0] : null
}

export async function getUserById(id: number): Promise<User | null> {
  const results = (await query("SELECT * FROM users WHERE id = ?", [id])) as User[]

  return results.length > 0 ? results[0] : null
}

export async function createUser(userData: {
  email: string
  password: string
  first_name: string
  last_name: string
  phone: string
  cedula: string
}): Promise<User> {
  const hashedPassword = await hashPassword(userData.password)

  const result = (await query(
    `INSERT INTO users (email, password, first_name, last_name, phone, cedula) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userData.email, hashedPassword, userData.first_name, userData.last_name, userData.phone, userData.cedula],
  )) as any

  const newUser = await getUserById(result.insertId)
  if (!newUser) throw new Error("Failed to create user")

  return newUser
}

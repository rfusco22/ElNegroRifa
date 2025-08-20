"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAuth = false, requireAdmin = false }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (requireAuth && !session) {
      router.push("/auth/signin")
      return
    }

    if (requireAdmin && (!session || !(session.user as any)?.isAdmin)) {
      router.push("/")
      return
    }
  }, [session, status, requireAuth, requireAdmin, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img
            src="/images/rifas-logo.jpg"
            alt="Rifas EL NEGRO"
            className="h-16 w-auto mx-auto rounded-lg mb-4 golden-glow"
          />
          <p className="text-accent">Cargando...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !session) {
    return null
  }

  if (requireAdmin && (!session || !(session.user as any)?.isAdmin)) {
    return null
  }

  return <>{children}</>
}

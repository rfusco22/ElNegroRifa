"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, TicketIcon, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface UserNumber {
  id: number
  number: string
  rifa_title: string
  payment_method: string
  payment_reference: string
  is_paid: boolean
  payment_validated: boolean
  created_at: string
}

export default function MyNumbersPage() {
  const { data: session } = useSession()
  const [numbers, setNumbers] = useState<UserNumber[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMyNumbers = async () => {
      try {
        const response = await fetch("/api/my-numbers")
        if (response.ok) {
          const data = await response.json()
          setNumbers(data)
        }
      } catch (error) {
        console.error("Error fetching numbers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchMyNumbers()
    }
  }, [session])

  return (
    <AuthGuard requireAuth>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-accent mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Mis Números
              </h1>
              <p className="text-muted-foreground">Aquí puedes ver todos tus números comprados</p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
                <p className="text-muted-foreground">Cargando tus números...</p>
              </div>
            ) : numbers.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <TicketIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-muted-foreground mb-2">No tienes números aún</h3>
                  <p className="text-muted-foreground mb-6">¡Compra tus números de la suerte y participa!</p>
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/">Comprar Números</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {numbers.map((number) => (
                  <Card key={number.id} className="border-accent/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-black text-accent bg-accent/10 rounded-lg px-4 py-2">
                              {number.number}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{number.rifa_title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Método: {number.payment_method.replace("_", " ").toUpperCase()}
                            </p>
                            <p className="text-sm text-muted-foreground">Referencia: {number.payment_reference}</p>
                            <p className="text-xs text-muted-foreground">
                              Comprado: {new Date(number.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {number.payment_validated ? (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Validado
                            </Badge>
                          ) : number.is_paid ? (
                            <Badge className="bg-yellow-500 text-white">
                              <Clock className="h-3 w-3 mr-1" />
                              Pendiente
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Rechazado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

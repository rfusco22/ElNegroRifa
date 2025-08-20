"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PendingPayment {
  id: number
  number: string
  user_name: string
  user_email: string
  user_phone: string
  payment_method: string
  payment_reference: string
  created_at: string
  rifa_title: string
}

export default function ValidatePaymentsPage() {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchPendingPayments()
  }, [])

  const fetchPendingPayments = async () => {
    try {
      const response = await fetch("/api/admin/pending-payments")
      if (response.ok) {
        const data = await response.json()
        setPendingPayments(data)
      }
    } catch (error) {
      console.error("Error fetching pending payments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidatePayment = async (numberId: number, approved: boolean) => {
    setProcessingId(numberId)
    try {
      const response = await fetch("/api/admin/validate-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numberId,
          approved,
        }),
      })

      if (response.ok) {
        setMessage(approved ? "Pago aprobado exitosamente" : "Pago rechazado")
        fetchPendingPayments() // Refresh the list
      } else {
        setMessage("Error al procesar la validación")
      }
    } catch (error) {
      setMessage("Error al procesar la validación")
    } finally {
      setProcessingId(null)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleWhatsAppContact = (phone: string, userName: string, number: string) => {
    const message = `Hola ${userName}, te contactamos desde Rifas EL NEGRO sobre tu número ${number}. ¿En qué podemos ayudarte?`
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-black text-accent" style={{ fontFamily: "var(--font-heading)" }}>
                  Validar Pagos
                </h1>
                <p className="text-muted-foreground">Aprueba o rechaza los pagos pendientes</p>
              </div>
            </div>

            {message && (
              <Alert className="mb-6 border-accent/50 text-accent">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Pending Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-accent">Pagos Pendientes ({pendingPayments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-muted-foreground mb-2">¡Todo al día!</h3>
                    <p className="text-muted-foreground">No hay pagos pendientes por validar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPayments.map((payment) => (
                      <div key={payment.id} className="p-6 border rounded-lg bg-card">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-black text-accent bg-accent/10 rounded-lg px-4 py-2">
                                {payment.number}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">400Bs</p>
                            </div>
                            <div className="space-y-1">
                              <h3 className="font-bold text-lg">{payment.user_name}</h3>
                              <p className="text-sm text-muted-foreground">{payment.user_email}</p>
                              <p className="text-sm text-muted-foreground">{payment.user_phone}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {payment.payment_method.replace("_", " ").toUpperCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(payment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="mt-3 p-3 bg-muted rounded-lg">
                                <p className="text-sm font-medium">Referencia de Pago:</p>
                                <p className="text-sm text-muted-foreground break-all">{payment.payment_reference}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() => handleValidatePayment(payment.id, true)}
                              disabled={processingId === payment.id}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleValidatePayment(payment.id, false)}
                              disabled={processingId === payment.id}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Rechazar
                            </Button>
                            {payment.user_phone && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleWhatsAppContact(payment.user_phone, payment.user_name, payment.number)
                                }
                                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                              >
                                <MessageCircle className="h-3 w-3 mr-1" />
                                WhatsApp
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

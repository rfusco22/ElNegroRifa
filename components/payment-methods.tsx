"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Smartphone, Bitcoin, DollarSign, Loader2 } from "lucide-react"

interface PaymentMethodsProps {
  selectedNumbers: string[]
  totalAmount: number
  rifaId: number
}

export function PaymentMethods({ selectedNumbers, totalAmount, rifaId }: PaymentMethodsProps) {
  const { data: session } = useSession()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [paymentReference, setPaymentReference] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const paymentMethods = [
    {
      id: "pago_movil",
      name: "Pago Móvil",
      icon: Smartphone,
      details: "Banco: Banesco • CI: 12.345.678 • Teléfono: 0424-1234567",
      color: "bg-blue-600",
    },
    {
      id: "binance",
      name: "Binance Pay",
      icon: Bitcoin,
      details: "ID Binance: 123456789 • USDT/BUSD aceptados",
      color: "bg-yellow-500",
    },
    {
      id: "zelle",
      name: "Zelle",
      icon: DollarSign,
      details: "Email: rifas@elnegro.com • Solo USD",
      color: "bg-purple-600",
    },
  ]

  const handleSubmitPayment = async () => {
    if (!selectedMethod || selectedNumbers.length === 0 || !paymentReference.trim()) return

    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/numbers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rifaId,
          numbers: selectedNumbers,
          paymentMethod: selectedMethod,
          paymentReference: paymentReference.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("¡Números reservados exitosamente! Espera la validación del pago.")
        setSelectedMethod(null)
        setPaymentReference("")
        // Clear selected numbers after successful submission
        window.location.reload()
      } else {
        setError(data.error || "Error al procesar el pago")
      }
    } catch (error) {
      setError("Error al procesar el pago")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (selectedNumbers.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-accent/50">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Selecciona al menos un número para continuar con el pago</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-accent">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-black text-accent" style={{ fontFamily: "var(--font-heading)" }}>
          Métodos de Pago
        </CardTitle>
        <p className="text-muted-foreground">Total a pagar: {totalAmount.toLocaleString()}Bs</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert className="border-destructive/50 text-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-accent/50 text-accent">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method.id ? "border-accent bg-accent/10" : "border-border hover:border-accent/50"
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${method.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-accent">{method.name}</h3>
                    <p className="text-sm text-muted-foreground">{method.details}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {selectedMethod && (
          <div className="space-y-4 p-4 bg-card rounded-lg border border-accent">
            <h3 className="font-bold text-accent">Información de Pago</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reference">Referencia de Pago *</Label>
                <Textarea
                  id="reference"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Número de referencia, ID de transacción o comprobante de pago"
                  rows={3}
                  className="border-accent/30 focus:border-accent"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Proporciona toda la información necesaria para validar tu pago
                </p>
              </div>
            </div>
            <Button
              onClick={handleSubmitPayment}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg py-3"
              disabled={!paymentReference.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                `Confirmar Pago - ${totalAmount.toLocaleString()}Bs`
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

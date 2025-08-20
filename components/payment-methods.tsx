"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Smartphone, Bitcoin, DollarSign } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface PaymentMethodsProps {
  selectedNumbers: string[]
  totalAmount: number
  raffleId: number
  onPurchaseComplete: () => void
}

export function PaymentMethods({ selectedNumbers, totalAmount, raffleId, onPurchaseComplete }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [paymentReference, setPaymentReference] = useState("")
  const [paymentProof, setPaymentProof] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { user } = useAuth()

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

  const handleReserveNumbers = async () => {
    if (!user || selectedNumbers.length === 0) return

    try {
      setLoading(true)
      setError("")

      const response = await fetch(`/api/raffles/${raffleId}/numbers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: selectedNumbers }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error reservando números")
      }

      setSuccess("Números reservados por 10 minutos. Completa tu pago.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error reservando números")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitPurchase = async () => {
    if (!selectedMethod || !paymentReference.trim()) return

    try {
      setLoading(true)
      setError("")

      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raffleId,
          numbers: selectedNumbers,
          paymentMethod: selectedMethod,
          paymentReference: paymentReference.trim(),
          paymentProof: paymentProof.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error procesando compra")
      }

      setSuccess("¡Compra registrada exitosamente! Tu pago está siendo validado.")
      onPurchaseComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error procesando compra")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-accent/50">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Inicia sesión para continuar con el pago</p>
        </CardContent>
      </Card>
    )
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
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription className="text-green-600">{success}</AlertDescription>
          </Alert>
        )}

        {!success && (
          <>
            <div className="text-center">
              <Button
                onClick={handleReserveNumbers}
                disabled={loading}
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
              >
                {loading ? "Reservando..." : "Reservar Números"}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Reserva tus números por 10 minutos para completar el pago
              </p>
            </div>

            <div className="grid gap-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
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
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="reference">Referencia de Pago *</Label>
                    <Input
                      id="reference"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="Número de referencia del pago"
                      className="border-accent/20 focus:border-accent"
                    />
                  </div>
                  <div>
                    <Label htmlFor="proof">Comprobante de Pago (opcional)</Label>
                    <Textarea
                      id="proof"
                      value={paymentProof}
                      onChange={(e) => setPaymentProof(e.target.value)}
                      placeholder="Información adicional del comprobante"
                      rows={3}
                      className="border-accent/20 focus:border-accent"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSubmitPurchase}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg py-3"
                  disabled={loading || !paymentReference.trim()}
                >
                  {loading ? "Procesando..." : `Confirmar Compra - ${totalAmount.toLocaleString()}Bs`}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

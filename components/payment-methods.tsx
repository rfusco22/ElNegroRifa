"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Smartphone, Bitcoin, DollarSign } from "lucide-react"

interface PaymentMethodsProps {
  selectedNumbers: string[]
  totalAmount: number
}

export function PaymentMethods({ selectedNumbers, totalAmount }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    reference: "",
  })

  const paymentMethods = [
    {
      id: "pago-movil",
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

  const handleSubmitPayment = () => {
    if (!selectedMethod || selectedNumbers.length === 0) return

    // Aquí iría la lógica de procesamiento de pago
    alert(`Pago procesado por ${selectedMethod}. Números: ${selectedNumbers.join(", ")}. Total: ${totalAmount}Bs`)
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
            <h3 className="font-bold text-accent">Información del Comprador</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="0424-1234567"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <Label htmlFor="reference">Referencia de Pago</Label>
                <Textarea
                  id="reference"
                  value={customerInfo.reference}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, reference: e.target.value })}
                  placeholder="Número de referencia o comprobante de pago"
                  rows={3}
                />
              </div>
            </div>
            <Button
              onClick={handleSubmitPayment}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg py-3"
              disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.reference}
            >
              Confirmar Pago - {totalAmount.toLocaleString()}Bs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

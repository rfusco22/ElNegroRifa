"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, X, Send } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface WhatsAppChatProps {
  selectedNumbers?: string[]
  totalAmount?: number
}

export function WhatsAppChat({ selectedNumbers = [], totalAmount = 0 }: WhatsAppChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [consultationType, setConsultationType] = useState("general")
  const { user } = useAuth()

  const whatsappNumber = "+584241234567" // Replace with actual WhatsApp number

  const consultationTypes = [
    { id: "general", label: "Consulta General", description: "Información sobre las rifas" },
    { id: "purchase", label: "Ayuda con Compra", description: "Problemas al comprar números" },
    { id: "payment", label: "Consulta de Pago", description: "Estado de mi pago" },
    { id: "numbers", label: "Números Seleccionados", description: "Ayuda con números específicos" },
    { id: "technical", label: "Soporte Técnico", description: "Problemas con la página" },
  ]

  const generateWhatsAppMessage = () => {
    let baseMessage = "¡Hola! Necesito ayuda con Rifas EL NEGRO.\n\n"

    // Add user info if logged in
    if (user) {
      baseMessage += `👤 *Mi información:*\n`
      baseMessage += `Nombre: ${user.first_name} ${user.last_name}\n`
      baseMessage += `Email: ${user.email}\n\n`
    }

    // Add consultation type
    const selectedType = consultationTypes.find((type) => type.id === consultationType)
    if (selectedType) {
      baseMessage += `📋 *Tipo de consulta:* ${selectedType.label}\n\n`
    }

    // Add selected numbers if any
    if (selectedNumbers.length > 0) {
      baseMessage += `🎯 *Números seleccionados:* ${selectedNumbers.join(", ")}\n`
      baseMessage += `💰 *Total:* ${totalAmount.toLocaleString()}Bs\n\n`
    }

    // Add custom message
    if (message.trim()) {
      baseMessage += `💬 *Mi consulta:*\n${message.trim()}\n\n`
    }

    baseMessage += "¡Gracias por su atención!"

    return encodeURIComponent(baseMessage)
  }

  const handleSendMessage = () => {
    const whatsappMessage = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace("+", "")}?text=${whatsappMessage}`
    window.open(whatsappUrl, "_blank")
    setIsOpen(false)
    setMessage("")
  }

  const getQuickMessages = () => {
    const quickMessages = [
      "¿Cómo puedo comprar números?",
      "¿Cuándo es el sorteo?",
      "¿Cómo valido mi pago?",
      "¿Qué métodos de pago aceptan?",
      "¿Cómo sé si gané?",
    ]

    return quickMessages
  }

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)]">
          <Card className="border-green-500 shadow-2xl">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg">Rifas EL NEGRO</CardTitle>
                  <CardDescription className="text-green-100 text-sm">
                    Soporte en línea • Respuesta rápida
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4 max-h-96 overflow-y-auto">
              <div className="text-sm text-muted-foreground">
                ¡Hola{user ? ` ${user.first_name}` : ""}! ¿En qué podemos ayudarte hoy?
              </div>

              {/* Consultation Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de consulta:</Label>
                <div className="grid gap-2">
                  {consultationTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-2 border rounded-lg cursor-pointer transition-all text-sm ${
                        consultationType === type.id
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : "border-border hover:border-green-300"
                      }`}
                      onClick={() => setConsultationType(type.id)}
                    >
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Numbers Info */}
              {selectedNumbers.length > 0 && (
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="text-sm font-medium text-accent mb-1">Números seleccionados:</div>
                  <div className="text-sm">{selectedNumbers.join(", ")}</div>
                  <div className="text-sm text-accent font-bold">Total: {totalAmount.toLocaleString()}Bs</div>
                </div>
              )}

              {/* Quick Messages */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Mensajes rápidos:</Label>
                <div className="space-y-1">
                  {getQuickMessages().map((quickMsg, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2 text-xs bg-transparent"
                      onClick={() => setMessage(quickMsg)}
                    >
                      {quickMsg}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Message */}
              <div className="space-y-2">
                <Label htmlFor="custom-message" className="text-sm font-medium">
                  Tu mensaje:
                </Label>
                <Textarea
                  id="custom-message"
                  placeholder="Escribe tu consulta aquí..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>

              {/* Send Button */}
              <Button onClick={handleSendMessage} className="w-full bg-green-500 hover:bg-green-600 text-white">
                <Send className="h-4 w-4 mr-2" />
                Enviar por WhatsApp
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                Te redirigiremos a WhatsApp para continuar la conversación
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

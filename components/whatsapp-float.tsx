"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, X, Phone, Clock } from "lucide-react"

export function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false)

  const handleWhatsAppContact = (message: string) => {
    const phoneNumber = "584241234567" // Replace with actual WhatsApp number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    setIsOpen(false)
  }

  const quickMessages = [
    {
      title: "Información General",
      message: "Hola! Me interesa participar en Rifas EL NEGRO. ¿Podrían darme más información?",
    },
    {
      title: "Ayuda con Pago",
      message: "Hola! Necesito ayuda con el proceso de pago para mis números de la rifa.",
    },
    {
      title: "Estado de mi Número",
      message: "Hola! Quisiera consultar el estado de validación de mi número de rifa.",
    },
    {
      title: "Soporte Técnico",
      message: "Hola! Tengo problemas técnicos con la página web. ¿Pueden ayudarme?",
    },
  ]

  return (
    <>
      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <Card className="mb-4 w-80 border-accent/20 bg-card/95 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="font-bold text-accent">Rifas EL NEGRO</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">¡Hola! ¿En qué podemos ayudarte hoy?</p>

              <div className="space-y-2">
                {quickMessages.map((msg, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-3 border-accent/30 hover:bg-accent/10 bg-transparent"
                    onClick={() => handleWhatsAppContact(msg.message)}
                  >
                    <div>
                      <p className="font-medium text-xs">{msg.title}</p>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-accent/20">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Respondemos en minutos</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Phone className="h-3 w-3" />
                  <span>+58 424-123-4567</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>
    </>
  )
}

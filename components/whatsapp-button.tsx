"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
  className?: string
}

export function WhatsAppButton({
  phoneNumber = "+584241234567",
  message = "¡Hola! Tengo una consulta sobre Rifas EL NEGRO.",
  className = "",
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button onClick={handleWhatsAppClick} className={`bg-green-500 hover:bg-green-600 text-white ${className}`}>
      <MessageCircle className="h-4 w-4 mr-2" />
      Contactar por WhatsApp
    </Button>
  )
}

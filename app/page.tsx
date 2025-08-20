"use client"

import { useState } from "react"
import { NumberSelector } from "@/components/number-selector"
import { PrizesDisplay } from "@/components/prizes-display"
import { PaymentMethods } from "@/components/payment-methods"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export default function Home() {
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([])
  const [isDark, setIsDark] = useState(true)
  const totalAmount = selectedNumbers.length * 400

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-accent bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/images/rifas-logo.jpg" alt="Rifas EL NEGRO" className="h-12 w-auto rounded-lg" />
              <div>
                <h1 className="text-2xl font-black text-accent" style={{ fontFamily: "var(--font-heading)" }}>
                  Rifas EL NEGRO
                </h1>
                <p className="text-sm text-muted-foreground">Página certificada</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <img
              src="/images/rifas-flyer.jpg"
              alt="Rifas EL NEGRO - $1000 a repartir"
              className="w-full max-w-md mx-auto rounded-lg shadow-2xl mb-8 float-animation"
            />
            <h2
              className="text-4xl md:text-6xl font-black text-accent mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ¡Participa Ya!
            </h2>
            <p className="text-xl text-muted-foreground mb-8">$1000 a repartir en 3 premios • Juega el 31/10/2025</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Prizes Display */}
        <PrizesDisplay />

        {/* Number Selection */}
        <NumberSelector selectedNumbers={selectedNumbers} onNumberSelect={setSelectedNumbers} />

        {/* Payment Methods */}
        <PaymentMethods selectedNumbers={selectedNumbers} totalAmount={totalAmount} />
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Rifas EL NEGRO</h3>
              <p className="text-sm opacity-90">Página certificada para rifas legales y transparentes.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Información</h3>
              <ul className="text-sm space-y-2 opacity-90">
                <li>Fecha del sorteo: 31/10/2025</li>
                <li>Valor del boleto: 400Bs</li>
                <li>Números disponibles: 000-999</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contacto</h3>
              <p className="text-sm opacity-90">
                Para dudas o consultas, contáctanos a través de nuestros canales oficiales.
              </p>
            </div>
          </div>
          <div className="border-t border-accent/20 mt-8 pt-8 text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <img src="/triple-tachira-logo.png" alt="Triple Táchira" className="h-8" />
              <img src="/conalot-logo.png" alt="CONALOT" className="h-8" />
            </div>
            <p className="text-sm opacity-75">© 2025 Rifas EL NEGRO. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { NumberSelector } from "@/components/number-selector"
import { PrizesDisplay } from "@/components/prizes-display"
import { PaymentMethods } from "@/components/payment-methods"
import { UserMenu } from "@/components/user-menu"
import { ErrorBoundary } from "@/components/error-boundary"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Moon, Sun, Info } from "lucide-react"

export default function Home() {
  const { data: session } = useSession()
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([])
  const [isDark, setIsDark] = useState(true)
  const [currentRifa, setCurrentRifa] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const totalAmount = selectedNumbers.length * 400

  useEffect(() => {
    const fetchCurrentRifa = async () => {
      try {
        const response = await fetch("/api/rifas")
        if (response.ok) {
          const rifas = await response.json()
          if (rifas.length > 0) {
            setCurrentRifa(rifas[0]) // Get the first active rifa
          } else {
            setError("No hay rifas activas en este momento")
          }
        } else {
          setError("Error al cargar las rifas")
        }
      } catch (error) {
        console.error("Error fetching rifas:", error)
        setError("Error de conexión")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentRifa()
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <img
            src="/rifas-el-negro-logo-golden.png"
            alt="Rifas EL NEGRO"
            className="h-20 w-auto mx-auto rounded-lg mb-4 golden-glow"
          />
          <p className="text-accent text-lg">Cargando rifas...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-accent bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src="/rifas-el-negro-logo-golden.png" alt="Rifas EL NEGRO" className="h-12 w-auto rounded-lg" />
                <div>
                  <h1 className="text-2xl font-black text-accent font-serif">Rifas EL NEGRO</h1>
                  <p className="text-sm text-muted-foreground">Página certificada</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <UserMenu />
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
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-background to-card">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <img
                src="/rifas-el-negro-flyer.png"
                alt="Rifas EL NEGRO - $1000 a repartir"
                className="w-full max-w-md mx-auto rounded-lg shadow-2xl mb-8 float-animation"
              />
              <h2 className="text-4xl md:text-6xl font-black text-accent mb-4 font-serif">¡Participa Ya!</h2>
              <p className="text-xl text-muted-foreground mb-8">$1000 a repartir en 3 premios • Juega el 31/10/2025</p>
              {session && <p className="text-accent font-medium">Bienvenido, {session.user?.name}!</p>}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12 space-y-12">
          {error && (
            <Alert className="max-w-2xl mx-auto border-destructive/50 text-destructive">
              <Info className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Prizes Display */}
          <PrizesDisplay />

          {/* Number Selection */}
          {currentRifa && (
            <NumberSelector
              selectedNumbers={selectedNumbers}
              onNumberSelect={setSelectedNumbers}
              rifaId={currentRifa.id}
            />
          )}

          {/* Payment Methods */}
          {currentRifa && session && selectedNumbers.length > 0 && (
            <PaymentMethods selectedNumbers={selectedNumbers} totalAmount={totalAmount} rifaId={currentRifa.id} />
          )}

          {/* Information Section */}
          <section className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-accent font-serif">¿Cómo Participar?</h3>
                <ol className="space-y-2 text-muted-foreground">
                  <li>1. Regístrate o inicia sesión</li>
                  <li>2. Selecciona tus números de la suerte</li>
                  <li>3. Realiza el pago por tu método preferido</li>
                  <li>4. Espera la validación del administrador</li>
                  <li>5. ¡Participa en el sorteo del 31/10/2025!</li>
                </ol>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-accent font-serif">Métodos de Pago</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Pago Móvil (Banesco)</li>
                  <li>• Binance Pay (USDT/BUSD)</li>
                  <li>• Zelle (USD)</li>
                </ul>
              </div>
            </div>
          </section>
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
                <p className="text-sm opacity-90">Para dudas o consultas, contáctanos a través de WhatsApp.</p>
              </div>
            </div>
            <div className="border-t border-accent/20 mt-8 pt-8 text-center">
              <div className="flex justify-center items-center gap-4 mb-4">
                <img src="/placeholder-eyhgl.png" alt="Triple Táchira" className="h-8" />
                <img src="/conalot-logo.png" alt="CONALOT" className="h-8" />
              </div>
              <p className="text-sm opacity-75">© 2025 Rifas EL NEGRO. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

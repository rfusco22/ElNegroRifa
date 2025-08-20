"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Loader2 } from "lucide-react"
import Link from "next/link"

interface NumberSelectorProps {
  onNumberSelect: (numbers: string[]) => void
  selectedNumbers: string[]
  rifaId: number
}

interface NumberStatus {
  number: string
  is_paid: boolean
  payment_validated: boolean
}

export function NumberSelector({ onNumberSelect, selectedNumbers, rifaId }: NumberSelectorProps) {
  const { data: session, status } = useSession()
  const [inputNumber, setInputNumber] = useState("")
  const [takenNumbers, setTakenNumbers] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchTakenNumbers = async () => {
      try {
        const response = await fetch(`/api/numbers?rifaId=${rifaId}`)
        if (response.ok) {
          const numbers: NumberStatus[] = await response.json()
          const taken = new Set(numbers.filter((n) => n.is_paid || n.payment_validated).map((n) => n.number))
          setTakenNumbers(taken)
        }
      } catch (error) {
        console.error("Error fetching numbers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTakenNumbers()
  }, [rifaId])

  if (status === "loading" || isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-accent golden-glow">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando números disponibles...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!session) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-accent golden-glow">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black text-accent" style={{ fontFamily: "var(--font-heading)" }}>
            Selecciona tus Números de la Suerte
          </CardTitle>
          <p className="text-muted-foreground">Números del 000 al 999 • Valor: 400Bs cada uno</p>
        </CardHeader>
        <CardContent>
          <Alert className="border-accent/50">
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-center">
              <p className="mb-4">Debes iniciar sesión para seleccionar números</p>
              <div className="flex gap-2 justify-center">
                <Button
                  asChild
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  <Link href="/auth/signin">Iniciar Sesión</Link>
                </Button>
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/auth/signup">Registrarse</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const handleAddNumber = () => {
    const num = inputNumber.padStart(3, "0")
    if (num.length === 3 && /^\d{3}$/.test(num) && !selectedNumbers.includes(num) && !takenNumbers.has(num)) {
      onNumberSelect([...selectedNumbers, num])
      setInputNumber("")
      setError("")
    } else if (takenNumbers.has(num)) {
      setError(`El número ${num} ya está ocupado`)
    }
  }

  const handleRemoveNumber = (numberToRemove: string) => {
    onNumberSelect(selectedNumbers.filter((num) => num !== numberToRemove))
  }

  const generateRandomNumbers = (count: number) => {
    const newNumbers: string[] = []
    const maxAttempts = count * 10 // Prevent infinite loop
    let attempts = 0

    while (newNumbers.length < count && attempts < maxAttempts) {
      const randomNum = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")

      if (!selectedNumbers.includes(randomNum) && !newNumbers.includes(randomNum) && !takenNumbers.has(randomNum)) {
        newNumbers.push(randomNum)
      }
      attempts++
    }

    if (newNumbers.length > 0) {
      onNumberSelect([...selectedNumbers, ...newNumbers])
      setError("")
    } else {
      setError("No hay suficientes números disponibles")
    }
  }

  const availableCount = 1000 - takenNumbers.size
  const isNumberTaken = inputNumber.length === 3 && takenNumbers.has(inputNumber.padStart(3, "0"))

  return (
    <Card className="w-full max-w-2xl mx-auto border-accent golden-glow">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-black text-accent" style={{ fontFamily: "var(--font-heading)" }}>
          Selecciona tus Números de la Suerte
        </CardTitle>
        <p className="text-muted-foreground">Números del 000 al 999 • Valor: 400Bs cada uno</p>
        <p className="text-sm text-accent font-medium">Números disponibles: {availableCount} de 1000</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert className="border-destructive/50 text-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="000"
            value={inputNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 3)
              setInputNumber(value)
              setError("")
            }}
            className={`text-center text-lg font-bold ${
              isNumberTaken ? "border-destructive focus:border-destructive" : ""
            }`}
            maxLength={3}
          />
          <Button
            onClick={handleAddNumber}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
            disabled={
              inputNumber.length !== 3 ||
              selectedNumbers.includes(inputNumber.padStart(3, "0")) ||
              takenNumbers.has(inputNumber.padStart(3, "0"))
            }
          >
            {isNumberTaken ? "Ocupado" : "Agregar"}
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          <Button
            onClick={() => generateRandomNumbers(1)}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            disabled={availableCount < 1}
          >
            1 Número Aleatorio
          </Button>
          <Button
            onClick={() => generateRandomNumbers(5)}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            disabled={availableCount < 5}
          >
            5 Números Aleatorios
          </Button>
          <Button
            onClick={() => generateRandomNumbers(10)}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            disabled={availableCount < 10}
          >
            10 Números Aleatorios
          </Button>
        </div>

        {selectedNumbers.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-accent">Números Seleccionados ({selectedNumbers.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedNumbers.map((number) => (
                <Badge
                  key={number}
                  variant="secondary"
                  className="text-lg px-3 py-1 bg-accent text-accent-foreground cursor-pointer hover:bg-accent/80"
                  onClick={() => handleRemoveNumber(number)}
                >
                  {number} ✕
                </Badge>
              ))}
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-accent">
              <p className="text-xl font-bold text-accent">
                Total a Pagar: {(selectedNumbers.length * 400).toLocaleString()}Bs
              </p>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 text-center">
            Vista rápida de números (últimos 100)
          </h4>
          <div className="grid grid-cols-10 gap-1 text-xs">
            {Array.from({ length: 100 }, (_, i) => {
              const num = (900 + i).toString()
              const isTaken = takenNumbers.has(num)
              const isSelected = selectedNumbers.includes(num)

              return (
                <div
                  key={num}
                  className={`
                    p-1 text-center rounded text-xs font-mono
                    ${
                      isTaken
                        ? "bg-destructive/20 text-destructive cursor-not-allowed"
                        : isSelected
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted hover:bg-accent/20 cursor-pointer"
                    }
                  `}
                  onClick={() => {
                    if (!isTaken && !isSelected) {
                      onNumberSelect([...selectedNumbers, num])
                    } else if (isSelected) {
                      handleRemoveNumber(num)
                    }
                  }}
                >
                  {num}
                </div>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            <span className="inline-block w-3 h-3 bg-muted rounded mr-1"></span>Disponible
            <span className="inline-block w-3 h-3 bg-accent rounded mr-1 ml-3"></span>Seleccionado
            <span className="inline-block w-3 h-3 bg-destructive/20 rounded mr-1 ml-3"></span>Ocupado
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

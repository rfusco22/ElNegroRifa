"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"

interface NumberSelectorProps {
  onNumberSelect: (numbers: string[]) => void
  selectedNumbers: string[]
  raffleId: number
}

export function NumberSelector({ onNumberSelect, selectedNumbers, raffleId }: NumberSelectorProps) {
  const [inputNumber, setInputNumber] = useState("")
  const [availableNumbers, setAvailableNumbers] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    fetchAvailableNumbers()
  }, [raffleId])

  const fetchAvailableNumbers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/raffles/${raffleId}/numbers`)
      const data = await response.json()

      if (response.ok) {
        const available = new Set(data.numbers.filter((n: any) => n.status === "available").map((n: any) => n.number))
        setAvailableNumbers(available)
      } else {
        setError(data.error || "Error cargando números")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleAddNumber = () => {
    const num = inputNumber.padStart(3, "0")
    if (num.length === 3 && /^\d{3}$/.test(num)) {
      if (!availableNumbers.has(num)) {
        setError(`El número ${num} no está disponible`)
        return
      }
      if (!selectedNumbers.includes(num)) {
        onNumberSelect([...selectedNumbers, num])
        setInputNumber("")
        setError("")
      }
    }
  }

  const handleRemoveNumber = (numberToRemove: string) => {
    onNumberSelect(selectedNumbers.filter((num) => num !== numberToRemove))
  }

  const generateRandomNumbers = (count: number) => {
    const availableArray = Array.from(availableNumbers).filter((num) => !selectedNumbers.includes(num))
    const newNumbers: string[] = []

    for (let i = 0; i < count && availableArray.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * availableArray.length)
      const selectedNum = availableArray.splice(randomIndex, 1)[0]
      newNumbers.push(selectedNum)
    }

    if (newNumbers.length > 0) {
      onNumberSelect([...selectedNumbers, ...newNumbers])
    }
  }

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-accent/50">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground mb-4">Debes iniciar sesión para seleccionar números</p>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <a href="/login">Iniciar Sesión</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-accent/50">
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Cargando números disponibles...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-accent golden-glow">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-black text-accent" style={{ fontFamily: "var(--font-heading)" }}>
          Selecciona tus Números de la Suerte
        </CardTitle>
        <p className="text-muted-foreground">Números disponibles: {availableNumbers.size} • Valor: 400Bs cada uno</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
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
            className="text-center text-lg font-bold"
            maxLength={3}
          />
          <Button
            onClick={handleAddNumber}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
            disabled={
              inputNumber.length !== 3 ||
              selectedNumbers.includes(inputNumber.padStart(3, "0")) ||
              !availableNumbers.has(inputNumber.padStart(3, "0"))
            }
          >
            Agregar
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          <Button
            onClick={() => generateRandomNumbers(1)}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            disabled={availableNumbers.size === 0}
          >
            1 Número Aleatorio
          </Button>
          <Button
            onClick={() => generateRandomNumbers(5)}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            disabled={availableNumbers.size < 5}
          >
            5 Números Aleatorios
          </Button>
          <Button
            onClick={() => generateRandomNumbers(10)}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            disabled={availableNumbers.size < 10}
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
      </CardContent>
    </Card>
  )
}

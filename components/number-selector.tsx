"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface NumberSelectorProps {
  onNumberSelect: (numbers: string[]) => void
  selectedNumbers: string[]
}

export function NumberSelector({ onNumberSelect, selectedNumbers }: NumberSelectorProps) {
  const [inputNumber, setInputNumber] = useState("")

  const handleAddNumber = () => {
    const num = inputNumber.padStart(3, "0")
    if (num.length === 3 && /^\d{3}$/.test(num) && !selectedNumbers.includes(num)) {
      onNumberSelect([...selectedNumbers, num])
      setInputNumber("")
    }
  }

  const handleRemoveNumber = (numberToRemove: string) => {
    onNumberSelect(selectedNumbers.filter((num) => num !== numberToRemove))
  }

  const generateRandomNumbers = (count: number) => {
    const newNumbers: string[] = []
    while (newNumbers.length < count) {
      const randomNum = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")
      if (!selectedNumbers.includes(randomNum) && !newNumbers.includes(randomNum)) {
        newNumbers.push(randomNum)
      }
    }
    onNumberSelect([...selectedNumbers, ...newNumbers])
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-accent golden-glow">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-black text-accent" style={{ fontFamily: "var(--font-heading)" }}>
          Selecciona tus Números de la Suerte
        </CardTitle>
        <p className="text-muted-foreground">Números del 000 al 999 • Valor: 400Bs cada uno</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="000"
            value={inputNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 3)
              setInputNumber(value)
            }}
            className="text-center text-lg font-bold"
            maxLength={3}
          />
          <Button
            onClick={handleAddNumber}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
            disabled={inputNumber.length !== 3 || selectedNumbers.includes(inputNumber.padStart(3, "0"))}
          >
            Agregar
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap justify-center">
          <Button
            onClick={() => generateRandomNumbers(1)}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            1 Número Aleatorio
          </Button>
          <Button
            onClick={() => generateRandomNumbers(5)}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            5 Números Aleatorios
          </Button>
          <Button
            onClick={() => generateRandomNumbers(10)}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
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

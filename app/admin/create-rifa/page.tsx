"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plus, Loader2 } from "lucide-react"
import Link from "next/link"

export default function CreateRifaPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    first_prize: "",
    second_prize: "",
    third_prize: "",
    ticket_price: "400",
    draw_date: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/rifas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          first_prize: Number.parseFloat(formData.first_prize),
          second_prize: Number.parseFloat(formData.second_prize),
          third_prize: Number.parseFloat(formData.third_prize),
          ticket_price: Number.parseFloat(formData.ticket_price),
        }),
      })

      if (response.ok) {
        setSuccess("Rifa creada exitosamente")
        setTimeout(() => {
          router.push("/admin")
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || "Error al crear la rifa")
      }
    } catch (error) {
      setError("Error al crear la rifa")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-black text-accent" style={{ fontFamily: "var(--font-heading)" }}>
                  Crear Nueva Rifa
                </h1>
                <p className="text-muted-foreground">Configura una nueva rifa para tus usuarios</p>
              </div>
            </div>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent">Información de la Rifa</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert className="border-destructive/50 text-destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-accent/50 text-accent">
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="title">Título de la Rifa *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="border-accent/30 focus:border-accent"
                      placeholder="Ej: Rifas EL NEGRO - Diciembre 2025"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="border-accent/30 focus:border-accent"
                      placeholder="Descripción de la rifa..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_prize">Primer Premio ($) *</Label>
                      <Input
                        id="first_prize"
                        name="first_prize"
                        type="number"
                        step="0.01"
                        value={formData.first_prize}
                        onChange={handleChange}
                        required
                        className="border-accent/30 focus:border-accent"
                        placeholder="700"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="second_prize">Segundo Premio ($) *</Label>
                      <Input
                        id="second_prize"
                        name="second_prize"
                        type="number"
                        step="0.01"
                        value={formData.second_prize}
                        onChange={handleChange}
                        required
                        className="border-accent/30 focus:border-accent"
                        placeholder="200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="third_prize">Tercer Premio ($) *</Label>
                      <Input
                        id="third_prize"
                        name="third_prize"
                        type="number"
                        step="0.01"
                        value={formData.third_prize}
                        onChange={handleChange}
                        required
                        className="border-accent/30 focus:border-accent"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ticket_price">Precio del Boleto (Bs) *</Label>
                      <Input
                        id="ticket_price"
                        name="ticket_price"
                        type="number"
                        step="0.01"
                        value={formData.ticket_price}
                        onChange={handleChange}
                        required
                        className="border-accent/30 focus:border-accent"
                        placeholder="400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="draw_date">Fecha del Sorteo *</Label>
                      <Input
                        id="draw_date"
                        name="draw_date"
                        type="date"
                        value={formData.draw_date}
                        onChange={handleChange}
                        required
                        className="border-accent/30 focus:border-accent"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando Rifa...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Rifa
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

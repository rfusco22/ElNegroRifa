"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Users, TicketIcon, DollarSign, MessageCircle } from "lucide-react"
import Link from "next/link"

interface DetailedReport {
  id: number
  number: string
  user_name: string
  user_email: string
  user_phone: string
  payment_method: string
  payment_reference: string
  payment_validated: boolean
  created_at: string
  rifa_title: string
  ticket_price: number
}

interface PaymentMethodStats {
  method: string
  count: number
  total_amount: number
}

export default function ReportsPage() {
  const [allSales, setAllSales] = useState<DetailedReport[]>([])
  const [paymentStats, setPaymentStats] = useState<PaymentMethodStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [salesResponse, statsResponse] = await Promise.all([
          fetch("/api/admin/all-sales"),
          fetch("/api/admin/payment-stats"),
        ])

        if (salesResponse.ok) {
          const salesData = await salesResponse.json()
          setAllSales(salesData)
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setPaymentStats(statsData)
        }
      } catch (error) {
        console.error("Error fetching reports:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  const handleExportCSV = () => {
    const csvContent = [
      ["Número", "Usuario", "Email", "Teléfono", "Método de Pago", "Referencia", "Estado", "Fecha", "Monto"].join(","),
      ...allSales.map((sale) =>
        [
          sale.number,
          sale.user_name,
          sale.user_email,
          sale.user_phone || "",
          sale.payment_method.replace("_", " ").toUpperCase(),
          sale.payment_reference,
          sale.payment_validated ? "Validado" : "Pendiente",
          new Date(sale.created_at).toLocaleDateString(),
          `${sale.ticket_price}Bs`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rifas-reporte-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleWhatsAppContact = (phone: string, userName: string, number: string) => {
    const message = `Hola ${userName}, te contactamos desde Rifas EL NEGRO sobre tu número ${number}. ¿En qué podemos ayudarte?`
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const validatedSales = allSales.filter((sale) => sale.payment_validated)
  const pendingSales = allSales.filter((sale) => !sale.payment_validated)
  const totalRevenue = validatedSales.reduce((sum, sale) => sum + sale.ticket_price, 0)

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-black text-accent" style={{ fontFamily: "var(--font-heading)" }}>
                    Reportes Detallados
                  </h1>
                  <p className="text-muted-foreground">Análisis completo de ventas y pagos</p>
                </div>
              </div>
              <Button onClick={handleExportCSV} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Ventas</p>
                      <p className="text-2xl font-bold text-accent">{allSales.length}</p>
                    </div>
                    <TicketIcon className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Validadas</p>
                      <p className="text-2xl font-bold text-green-500">{validatedSales.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pendientes</p>
                      <p className="text-2xl font-bold text-yellow-500">{pendingSales.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Ingresos</p>
                      <p className="text-2xl font-bold text-accent">{totalRevenue.toLocaleString()}Bs</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Reports */}
            <Tabs defaultValue="all-sales" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all-sales">Todas las Ventas</TabsTrigger>
                <TabsTrigger value="payment-methods">Por Método de Pago</TabsTrigger>
                <TabsTrigger value="pending">Pendientes</TabsTrigger>
              </TabsList>

              <TabsContent value="all-sales">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-accent">Todas las Ventas ({allSales.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {allSales.map((sale) => (
                        <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-lg font-black text-accent bg-accent/10 rounded-lg px-3 py-1">
                                {sale.number}
                              </div>
                            </div>
                            <div>
                              <h3 className="font-bold">{sale.user_name}</h3>
                              <p className="text-sm text-muted-foreground">{sale.user_email}</p>
                              <p className="text-sm text-muted-foreground">{sale.user_phone}</p>
                              <p className="text-xs text-muted-foreground">
                                {sale.payment_method.replace("_", " ").toUpperCase()} - {sale.payment_reference}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(sale.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                sale.payment_validated ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                              }
                            >
                              {sale.payment_validated ? "Validado" : "Pendiente"}
                            </Badge>
                            <span className="text-sm font-bold text-accent">{sale.ticket_price}Bs</span>
                            {sale.user_phone && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleWhatsAppContact(sale.user_phone, sale.user_name, sale.number)}
                                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                              >
                                <MessageCircle className="h-3 w-3 mr-1" />
                                WhatsApp
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment-methods">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-accent">Estadísticas por Método de Pago</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {paymentStats.map((stat) => (
                        <div key={stat.method} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-lg">{stat.method.replace("_", " ").toUpperCase()}</h3>
                              <p className="text-sm text-muted-foreground">{stat.count} transacciones</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-accent">{stat.total_amount.toLocaleString()}Bs</p>
                              <p className="text-sm text-muted-foreground">
                                {((stat.count / allSales.length) * 100).toFixed(1)}% del total
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pending">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-accent">Pagos Pendientes ({pendingSales.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingSales.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No hay pagos pendientes</p>
                        </div>
                      ) : (
                        pendingSales.map((sale) => (
                          <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-lg font-black text-accent bg-accent/10 rounded-lg px-3 py-1">
                                  {sale.number}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-bold">{sale.user_name}</h3>
                                <p className="text-sm text-muted-foreground">{sale.user_email}</p>
                                <p className="text-sm text-muted-foreground">{sale.user_phone}</p>
                                <p className="text-xs text-muted-foreground">
                                  {sale.payment_method.replace("_", " ").toUpperCase()} - {sale.payment_reference}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-yellow-500 text-white">Pendiente</Badge>
                              <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                                <Link href="/admin/validate-payments">Validar</Link>
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

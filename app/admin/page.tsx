"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TicketIcon, DollarSign, TrendingUp, CheckCircle, Clock, Plus, MessageCircle } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalUsers: number
  totalNumbers: number
  totalRevenue: number
  pendingValidations: number
}

interface RecentSale {
  id: number
  user_name: string
  user_email: string
  user_phone: string
  number: string
  payment_method: string
  payment_reference: string
  payment_validated: boolean
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalNumbers: 0,
    totalRevenue: 0,
    pendingValidations: 0,
  })
  const [recentSales, setRecentSales] = useState<RecentSale[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, salesResponse] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/recent-sales"),
        ])

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        if (salesResponse.ok) {
          const salesData = await salesResponse.json()
          setRecentSales(salesData)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleWhatsAppContact = (phone: string, userName: string, number: string) => {
    const message = `Hola ${userName}, te contactamos desde Rifas EL NEGRO sobre tu número ${number}. ¿En qué podemos ayudarte?`
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-accent mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Panel de Administración
                </h1>
                <p className="text-muted-foreground">Gestiona rifas, usuarios y pagos</p>
              </div>
              <div className="flex gap-2">
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/admin/create-rifa">
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Rifa
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  <Link href="/">Volver al Inicio</Link>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Usuarios</p>
                      <p className="text-2xl font-bold text-accent">{stats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Números Vendidos</p>
                      <p className="text-2xl font-bold text-accent">{stats.totalNumbers}</p>
                    </div>
                    <TicketIcon className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                      <p className="text-2xl font-bold text-accent">{stats.totalRevenue.toLocaleString()}Bs</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pagos Pendientes</p>
                      <p className="text-2xl font-bold text-accent">{stats.pendingValidations}</p>
                    </div>
                    <Clock className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="sales" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sales">Ventas Recientes</TabsTrigger>
                <TabsTrigger value="validations">Validar Pagos</TabsTrigger>
                <TabsTrigger value="reports">Reportes</TabsTrigger>
              </TabsList>

              <TabsContent value="sales">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-accent">Ventas Recientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentSales.map((sale) => (
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
                            {sale.payment_validated ? (
                              <Badge className="bg-green-500 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Validado
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-500 text-white">
                                <Clock className="h-3 w-3 mr-1" />
                                Pendiente
                              </Badge>
                            )}
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

              <TabsContent value="validations">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-accent">Validar Pagos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href="/admin/validate-payments">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Ir a Validación de Pagos
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-accent">Reportes Detallados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href="/admin/reports">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Ver Reportes Completos
                        </Link>
                      </Button>
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

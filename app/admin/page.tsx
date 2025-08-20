"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Users, DollarSign, Clock, CheckCircle, XCircle, Hash, Plus } from "lucide-react"

interface Purchase {
  id: number
  user_id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  cedula: string
  raffle_title: string
  numbers: string
  total_amount: number
  payment_method: string
  payment_reference: string
  payment_proof: string
  status: string
  created_at: string
}

interface Stats {
  totalUsers: number
  totalPurchases: number
  pendingPurchases: number
  validatedPurchases: number
  totalRevenue: number
  pendingRevenue: number
  soldNumbers: number
  availableNumbers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "admin") {
      router.push("/")
      return
    }
    fetchData()
  }, [user, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsResponse, purchasesResponse] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/purchases?status=pending"),
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.stats)
        setRecentPurchases(statsData.recentPurchases)
      }

      if (purchasesResponse.ok) {
        const purchasesData = await purchasesResponse.json()
        setPurchases(purchasesData.purchases)
      }
    } catch (err) {
      setError("Error cargando datos del dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleValidatePurchase = async (purchaseId: number, action: "approve" | "reject") => {
    try {
      const response = await fetch(`/api/admin/purchases/${purchaseId}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        fetchData() // Refresh data
      } else {
        const data = await response.json()
        setError(data.error || "Error validando compra")
      }
    } catch (err) {
      setError("Error de conexión")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando dashboard...</p>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-accent bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-accent" style={{ fontFamily: "var(--font-heading)" }}>
                Dashboard Administrativo
              </h1>
              <p className="text-sm text-muted-foreground">Panel de control - Rifas EL NEGRO</p>
            </div>
            <div className="flex gap-2">
              <WhatsAppButton
                message="¡Hola! Soy administrador de Rifas EL NEGRO y necesito soporte técnico."
                className="bg-green-500 hover:bg-green-600"
              />
              <Button asChild variant="outline">
                <a href="/">Volver al sitio</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="purchases">Compras</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
            <TabsTrigger value="raffles">Rifas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-accent/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Usuarios Registrados</CardTitle>
                    <Users className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">{stats.totalUsers}</div>
                  </CardContent>
                </Card>

                <Card className="border-accent/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Compras Pendientes</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-500">{stats.pendingPurchases}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.pendingRevenue.toLocaleString()}Bs pendientes
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-accent/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos Validados</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{stats.totalRevenue.toLocaleString()}Bs</div>
                    <p className="text-xs text-muted-foreground">{stats.validatedPurchases} compras validadas</p>
                  </CardContent>
                </Card>

                <Card className="border-accent/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Números Vendidos</CardTitle>
                    <Hash className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">{stats.soldNumbers}</div>
                    <p className="text-xs text-muted-foreground">{stats.availableNumbers} disponibles</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Purchases */}
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent">Compras Recientes</CardTitle>
                <CardDescription>Últimas 10 transacciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPurchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {purchase.first_name} {purchase.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {JSON.parse(purchase.numbers).length} números • {purchase.total_amount.toLocaleString()}Bs
                        </p>
                      </div>
                      <Badge
                        variant={
                          purchase.status === "validated"
                            ? "default"
                            : purchase.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {purchase.status === "validated"
                          ? "Validado"
                          : purchase.status === "pending"
                            ? "Pendiente"
                            : "Rechazado"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-6">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent">Compras Pendientes de Validación</CardTitle>
                <CardDescription>Revisa y valida los pagos de los usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="border rounded-lg p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-bold text-accent">Información del Comprador</h3>
                          <p>
                            <strong>Nombre:</strong> {purchase.first_name} {purchase.last_name}
                          </p>
                          <p>
                            <strong>Email:</strong> {purchase.email}
                          </p>
                          <p>
                            <strong>Teléfono:</strong> {purchase.phone}
                          </p>
                          <p>
                            <strong>Cédula:</strong> {purchase.cedula}
                          </p>
                        </div>
                        <div>
                          <h3 className="font-bold text-accent">Detalles de la Compra</h3>
                          <p>
                            <strong>Números:</strong> {JSON.parse(purchase.numbers).join(", ")}
                          </p>
                          <p>
                            <strong>Total:</strong> {purchase.total_amount.toLocaleString()}Bs
                          </p>
                          <p>
                            <strong>Método:</strong> {purchase.payment_method}
                          </p>
                          <p>
                            <strong>Referencia:</strong> {purchase.payment_reference}
                          </p>
                          {purchase.payment_proof && (
                            <p>
                              <strong>Comprobante:</strong> {purchase.payment_proof}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleValidatePurchase(purchase.id, "approve")}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aprobar
                        </Button>
                        <Button onClick={() => handleValidatePurchase(purchase.id, "reject")} variant="destructive">
                          <XCircle className="w-4 h-4 mr-2" />
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  ))}
                  {purchases.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No hay compras pendientes</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-accent">Resumen de Ventas</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total de compras:</span>
                        <span className="font-bold">{stats.totalPurchases}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compras validadas:</span>
                        <span className="font-bold text-green-600">{stats.validatedPurchases}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compras pendientes:</span>
                        <span className="font-bold text-yellow-600">{stats.pendingPurchases}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ingresos totales:</span>
                        <span className="font-bold text-accent">{stats.totalRevenue.toLocaleString()}Bs</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-accent">Estado de Números</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats && (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Números vendidos:</span>
                        <span className="font-bold text-green-600">{stats.soldNumbers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Números disponibles:</span>
                        <span className="font-bold text-accent">{stats.availableNumbers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Porcentaje vendido:</span>
                        <span className="font-bold">
                          {((stats.soldNumbers / (stats.soldNumbers + stats.availableNumbers)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="raffles" className="space-y-6">
            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="text-accent">Gestión de Rifas</CardTitle>
                <CardDescription>Administra las rifas activas y crea nuevas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Funcionalidad de gestión de rifas próximamente</p>
                  <Button disabled className="bg-accent text-accent-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Nueva Rifa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

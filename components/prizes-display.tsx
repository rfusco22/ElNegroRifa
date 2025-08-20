import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"

export function PrizesDisplay() {
  const prizes = [
    { place: "1er Lugar", amount: "$700", icon: Trophy, color: "text-yellow-400" },
    { place: "2do Lugar", amount: "$200", icon: Medal, color: "text-gray-400" },
    { place: "3er Lugar", amount: "$100", icon: Award, color: "text-amber-600" },
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto border-accent">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-black text-accent" style={{ fontFamily: "var(--font-heading)" }}>
          $1000 a Repartir en 3 Premios
        </CardTitle>
        <p className="text-muted-foreground">Juega el 31/10/2025</p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {prizes.map((prize, index) => {
            const Icon = prize.icon
            return (
              <div
                key={index}
                className="text-center p-6 bg-card rounded-lg border border-accent hover:bg-accent/10 transition-colors float-animation"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Icon className={`w-12 h-12 mx-auto mb-4 ${prize.color}`} />
                <h3 className="text-xl font-bold text-accent mb-2">{prize.place}</h3>
                <p className="text-3xl font-black text-accent" style={{ fontFamily: "var(--font-heading)" }}>
                  {prize.amount}
                </p>
              </div>
            )
          })}
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            1er premio Táchira A • 2do premio Táchira B • 3er premio Táchira Zodíaco
          </p>
          <p className="text-xs text-muted-foreground mt-2">100$ para la persona que compre más boletos</p>
        </div>
      </CardContent>
    </Card>
  )
}

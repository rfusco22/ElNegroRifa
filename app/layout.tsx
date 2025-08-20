import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import { Providers } from "@/components/providers"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Rifas EL NEGRO - Participa y Gana",
  description:
    "Rifas EL NEGRO - $1000 a repartir en 3 premios. Participa ya! Números del 000 al 999, valor 400Bs cada uno.",
  keywords: "rifas, sorteos, premios, venezuela, el negro, lotería",
  authors: [{ name: "Rifas EL NEGRO" }],
  creator: "Rifas EL NEGRO",
  publisher: "Rifas EL NEGRO",
  robots: "index, follow",
  openGraph: {
    title: "Rifas EL NEGRO - Participa y Gana",
    description: "$1000 a repartir en 3 premios. ¡Participa ya!",
    type: "website",
    locale: "es_ES",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="dark">
        <Providers>
          {children}
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Crimson_Pro, Plus_Jakarta_Sans } from "next/font/google"
import Providers from "@/components/Providers"
import "./globals.css"

const crimson = Crimson_Pro({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Asciende Docente — Práctica para el Concurso de Ascenso",
  description: "Practica con 2,987 preguntas oficiales del Minedu con explicaciones pedagógicas profesionales. Prepárate para el Concurso de Ascenso Docente.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${crimson.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="min-h-screen bg-stone-50 text-stone-800 font-[var(--font-body)] antialiased">
        <Providers>
        {children}
        </Providers>
        <footer className="text-center text-xs text-stone-400 px-4 py-8 max-w-2xl mx-auto leading-relaxed">
          Las preguntas y claves de respuesta provienen del Banco de Exámenes oficial del Minedu.
          Las explicaciones pedagógicas son ayudas de estudio generadas con apoyo de inteligencia artificial
          y no representan posición oficial del Minedu.
          <br />
          <a href="https://evaluaciondocente.perueduca.pe/ascenso25/" target="_blank" rel="noopener" className="underline hover:text-teal-600">
            evaluaciondocente.perueduca.pe
          </a>
        </footer>
      </body>
    </html>
  )
}

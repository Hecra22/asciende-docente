import type { Metadata } from "next"
import { Crimson_Pro, Plus_Jakarta_Sans } from "next/font/google"
import Providers from "@/components/Providers"
import Navbar from "@/components/Navbar"
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
        <Navbar />
        {children}
        </Providers>
        {/* WhatsApp flotante */}
        <a
          href="https://wa.me/51962340472?text=Hola%2C%20quiero%20acceder%20a%20Asciende%20Docente"
          target="_blank"
          rel="noopener"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          aria-label="Contactar por WhatsApp"
        >
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <footer className="text-center text-xs text-stone-400 px-4 py-8 max-w-2xl mx-auto leading-relaxed">
          Las preguntas y claves de respuesta provienen del Banco de Exámenes oficial del Minedu.
          Las explicaciones pedagógicas fueron elaboradas por expertos pedagógicos con apoyo de inteligencia artificial
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

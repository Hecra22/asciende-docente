'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  // Don't show navbar on exam/quiz screens
  if (pathname?.startsWith('/demo') || pathname?.startsWith('/simulacro')) {
    return null
  }

  return (
    <nav className="bg-teal-900 text-white px-4 py-2">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-[var(--font-display)] text-lg font-bold hover:text-teal-200">
          Asciende Docente
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className={`hover:text-teal-200 ${pathname === '/' ? 'text-teal-300 font-semibold' : ''}`}>
            Inicio
          </Link>
          <Link href="/practica" className={`hover:text-teal-200 ${pathname === '/practica' ? 'text-teal-300 font-semibold' : ''}`}>
            Práctica
          </Link>
          <Link href="/simulacro" className={`hover:text-teal-200 ${pathname === '/simulacro' ? 'text-teal-300 font-semibold' : ''}`}>
            Simulacro
          </Link>
          <Link href="/login" className="bg-teal-700 hover:bg-teal-600 px-3 py-1 rounded-lg">
            Ingresar
          </Link>
        </div>
      </div>
    </nav>
  )
}

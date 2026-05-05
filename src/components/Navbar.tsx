'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (pathname?.startsWith('/demo') || pathname?.startsWith('/simulacro')) {
    return null
  }

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/practica', label: 'Práctica' },
    { href: '/simulacro', label: 'Predicción IA 2026' },
  ]

  return (
    <nav className="bg-teal-900 text-white px-4 py-2">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-[var(--font-display)] text-lg font-bold hover:text-teal-200">
          Asciende Docente
        </Link>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-4 text-sm">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`hover:text-teal-200 ${pathname === l.href ? 'text-teal-300 font-semibold' : ''}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="bg-teal-700 hover:bg-teal-600 px-3 py-1 rounded-lg">
            Ingresar
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="sm:hidden p-1" aria-label="Menú">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden mt-2 pb-2 border-t border-teal-800 pt-2 space-y-2">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`block py-2 px-2 rounded hover:bg-teal-800 ${pathname === l.href ? 'text-teal-300 font-semibold' : ''}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)}
            className="block py-2 px-2 bg-teal-700 rounded-lg text-center font-semibold">
            Ingresar
          </Link>
        </div>
      )}
    </nav>
  )
}

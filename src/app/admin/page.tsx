'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface UserData {
  id: string
  name: string | null
  email: string
  active: boolean
  expiresAt: string | null
  createdAt: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session && (session.user as any)?.role === 'admin') {
      fetch('/api/admin/users')
        .then(r => r.json())
        .then(data => { setUsers(data.users || []); setLoading(false) })
    }
  }, [session])

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>

  if (!session || (session.user as any)?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-stone-800">Acceso denegado</h1>
        <Link href="/" className="mt-4 text-teal-600 underline">Volver al inicio</Link>
      </div>
    )
  }

  async function toggleUser(userId: string, active: boolean) {
    const expiresAt = active ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() : null
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, active, expiresAt }),
    })
    setUsers(users.map(u => u.id === userId ? { ...u, active, expiresAt } : u))
  }

  return (
    <div className="min-h-screen">
      <header className="bg-stone-800 text-white py-6 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="font-[var(--font-display)] text-2xl font-bold">Admin — Asciende Docente</h1>
          <Link href="/" className="text-stone-300 text-sm hover:text-white">Inicio</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center">
            <h2 className="font-semibold text-stone-800">Usuarios ({users.length})</h2>
          </div>
          {loading ? (
            <p className="p-6 text-stone-400">Cargando usuarios...</p>
          ) : (
            <div className="divide-y divide-stone-100">
              {users.map(user => (
                <div key={user.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 truncate">{user.name || 'Sin nombre'}</p>
                    <p className="text-sm text-stone-500 truncate">{user.email}</p>
                    <p className="text-xs text-stone-400">
                      Registro: {new Date(user.createdAt).toLocaleDateString('es-PE')}
                      {user.expiresAt && ` · Expira: ${new Date(user.expiresAt).toLocaleDateString('es-PE')}`}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleUser(user.id, !user.active)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      user.active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    }`}
                  >
                    {user.active ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              ))}
              {users.length === 0 && (
                <p className="p-6 text-stone-400 text-center">No hay usuarios registrados aún</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

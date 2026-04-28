'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import QuizEngine from '@/components/QuizEngine'

interface Question {
  id: string; y: number; mod: string; niv: string; esp: string;
  f: number; n: number; ctx: string; txt: string;
  a: { l: string; t: string }[]; r: string;
  ex?: string; h?: Record<string, string>; comp?: string; concepto?: string;
}

export default function PracticaPage() {
  const { data: session, status } = useSession()
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFiltered] = useState<Question[]>([])
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([])
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  // Filters
  const [year, setYear] = useState('')
  const [mod, setMod] = useState('')
  const [niv, setNiv] = useState('')
  const [esp, setEsp] = useState('')
  const [cantidad, setCantidad] = useState('25')
  const [orden, setOrden] = useState('secuencial')

  useEffect(() => {
    fetch('/preguntas.json').then(r => r.json()).then(setQuestions)
  }, [])

  useEffect(() => {
    let f = questions
    if (year) f = f.filter(q => String(q.y) === year)
    if (mod) f = f.filter(q => q.mod === mod)
    if (niv) f = f.filter(q => q.niv === niv)
    if (esp) f = f.filter(q => q.esp === esp)
    setFiltered(f)
  }, [questions, year, mod, niv, esp])

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-stone-400">Cargando...</p></div>
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="font-[var(--font-display)] text-3xl font-bold text-stone-800">Acceso requerido</h1>
        <p className="mt-2 text-stone-500">Inicia sesión para practicar</p>
        <Link href="/login" className="mt-4 px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold">Iniciar sesión</Link>
      </div>
    )
  }

  const user = session.user as any
  if (!user.active) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-[var(--font-display)] text-3xl font-bold text-stone-800">Cuenta no activada</h1>
        <p className="mt-2 text-stone-500 max-w-md">
          Tu cuenta aún no tiene acceso. Realiza tu pago y envía el comprobante por WhatsApp para activarla.
        </p>
        <a
          href="https://wa.me/51962340472?text=Quiero%20activar%20mi%20cuenta%20de%20Asciende%20Docente.%20Mi%20correo%20es%20{user.email}"
          target="_blank"
          rel="noopener"
          className="mt-4 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold"
        >
          Contactar por WhatsApp
        </a>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center space-y-4">
        <h1 className="font-[var(--font-display)] text-3xl font-bold text-stone-800">Sesión completada</h1>
        <div className="flex gap-3">
          <button onClick={() => { setFinished(false); setStarted(false) }} className="px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold">
            Nueva práctica
          </button>
          <Link href="/" className="px-6 py-3 bg-stone-200 rounded-xl font-semibold">Inicio</Link>
        </div>
      </div>
    )
  }

  if (started && sessionQuestions.length > 0) {
    return <QuizEngine questions={sessionQuestions} onFinish={() => setFinished(true)} />
  }

  const years = [...new Set(questions.map(q => q.y))].filter(Boolean).sort()
  const mods = [...new Set(questions.map(q => q.mod))].filter(Boolean).sort()
  const nivs = [...new Set(questions.filter(q => !mod || q.mod === mod).map(q => q.niv))].filter(Boolean).sort()
  const esps = [...new Set(questions.filter(q => (!mod || q.mod === mod) && (!niv || q.niv === niv)).map(q => q.esp))].filter(Boolean).sort()

  function startPractice() {
    let qs = [...filteredQuestions]
    if (orden === 'aleatorio') qs.sort(() => Math.random() - 0.5)
    const cant = parseInt(cantidad) || 0
    if (cant > 0 && cant < qs.length) qs = qs.slice(0, cant)
    setSessionQuestions(qs)
    setStarted(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-teal-800 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-[var(--font-display)] text-4xl font-bold">Asciende Docente</h1>
          <p className="mt-1 text-teal-200 text-sm">Hola, {session.user?.name}</p>
        </div>
      </header>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
          <h2 className="font-[var(--font-display)] text-xl font-semibold">Configura tu práctica</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Año</label>
              <select value={year} onChange={e => setYear(e.target.value)} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm">
                <option value="">Todos</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Modalidad</label>
              <select value={mod} onChange={e => { setMod(e.target.value); setNiv(''); setEsp('') }} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm">
                <option value="">Todas</option>
                {mods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nivel</label>
              <select value={niv} onChange={e => { setNiv(e.target.value); setEsp('') }} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm">
                <option value="">Todos</option>
                {nivs.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Especialidad</label>
              <select value={esp} onChange={e => setEsp(e.target.value)} className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm">
                <option value="">Todas</option>
                {esps.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cantidad</label>
              <select value={cantidad} onChange={e => setCantidad(e.target.value)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="0">Todas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Orden</label>
              <select value={orden} onChange={e => setOrden(e.target.value)} className="rounded-lg border border-stone-300 px-3 py-2 text-sm">
                <option value="secuencial">Secuencial</option>
                <option value="aleatorio">Aleatorio</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 text-center space-y-4">
          <p className="text-lg">
            <span className="font-[var(--font-display)] text-3xl font-bold text-teal-700">{filteredQuestions.length}</span>
            <span className="text-stone-500"> preguntas disponibles</span>
          </p>
          <button
            onClick={startPractice}
            disabled={filteredQuestions.length === 0}
            className="w-full sm:w-auto px-8 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-lg transition-colors disabled:opacity-50"
          >
            Empezar práctica
          </button>
        </div>
      </main>
    </div>
  )
}

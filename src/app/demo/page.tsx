'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import QuizEngine from '@/components/QuizEngine'

interface Question {
  id: string; y: number; mod: string; niv: string; esp: string;
  f: number; n: number; ctx: string; txt: string;
  a: { l: string; t: string }[]; r: string;
  ex?: string; h?: Record<string, string>; comp?: string; concepto?: string;
}

export default function DemoPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [especialidades, setEspecialidades] = useState<string[]>([])
  const [selected, setSelected] = useState<string>('')
  const [demoQuestions, setDemoQuestions] = useState<Question[]>([])
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    fetch('/preguntas.json')
      .then(r => r.json())
      .then((data: Question[]) => {
        setQuestions(data)
        const esps = [...new Set(data.map(q => q.esp).filter(Boolean))].sort()
        setEspecialidades(esps)
      })
  }, [])

  function startDemo() {
    const pool = questions.filter(q => q.esp === selected)
    // Pick 5 random
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    setDemoQuestions(shuffled.slice(0, 5))
    setStarted(true)
  }

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md text-center space-y-6">
          <h1 className="font-[var(--font-display)] text-4xl font-bold text-stone-800">
            Eso fue solo una muestra
          </h1>
          <p className="text-lg text-stone-600">
            Tienes <span className="font-bold text-teal-700">2,987 preguntas</span> esperándote con explicaciones pedagógicas completas.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="https://wa.me/51962340472?text=Quiero%20acceder%20a%20Asciende%20Docente"
              target="_blank"
              rel="noopener"
              className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl text-lg hover:bg-emerald-400 transition-colors"
            >
              Comprar acceso — S/ 25.00
            </a>
            <Link href="/" className="text-teal-700 underline">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (started && demoQuestions.length > 0) {
    return <QuizEngine questions={demoQuestions} onFinish={() => setFinished(true)} isDemo />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-teal-800 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Link href="/" className="text-teal-200 text-sm hover:text-white">
            ← Volver al inicio
          </Link>
          <h1 className="font-[var(--font-display)] text-4xl font-bold mt-2">Demo gratuita</h1>
          <p className="mt-2 text-teal-200">Prueba 5 preguntas con explicaciones pedagógicas</p>
        </div>
      </header>
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-12">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Elige tu especialidad
            </label>
            <select
              value={selected}
              onChange={e => setSelected(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Selecciona una especialidad</option>
              {especialidades.map(esp => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>
          {selected && (
            <div className="text-center">
              <p className="text-stone-500 mb-4">
                {questions.filter(q => q.esp === selected).length} preguntas disponibles en {selected}
              </p>
              <button
                onClick={startDemo}
                className="w-full px-8 py-4 bg-teal-700 text-white font-bold rounded-xl text-lg hover:bg-teal-800 transition-colors"
              >
                Comenzar demo (5 preguntas)
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

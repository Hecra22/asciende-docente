'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Question {
  id: string; y: number; mod: string; niv: string; esp: string;
  f: number; n: number; ctx: string; txt: string;
  a: { l: string; t: string }[]; r: string;
  ex?: string; h?: Record<string, string>; comp?: string; concepto?: string;
}

export default function AdminPreguntas() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [filtered, setFiltered] = useState<Question[]>([])
  const [esp, setEsp] = useState('')
  const [year, setYear] = useState('')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [reviewed, setReviewed] = useState<Set<string>>(new Set())
  const [flagged, setFlagged] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/preguntas.json').then(r => r.json()).then((data: Question[]) => {
      setQuestions(data)
      setFiltered(data)
    })
    // Load saved state
    const savedReviewed = localStorage.getItem('admin-reviewed')
    const savedFlagged = localStorage.getItem('admin-flagged')
    if (savedReviewed) setReviewed(new Set(JSON.parse(savedReviewed)))
    if (savedFlagged) setFlagged(new Set(JSON.parse(savedFlagged)))
  }, [])

  useEffect(() => {
    let f = questions
    if (esp) f = f.filter(q => q.esp === esp)
    if (year) f = f.filter(q => String(q.y) === year)
    setFiltered(f)
    setCurrentIdx(0)
  }, [questions, esp, year])

  function saveState(newReviewed: Set<string>, newFlagged: Set<string>) {
    localStorage.setItem('admin-reviewed', JSON.stringify([...newReviewed]))
    localStorage.setItem('admin-flagged', JSON.stringify([...newFlagged]))
  }

  function markOk() {
    const q = filtered[currentIdx]
    const newR = new Set(reviewed)
    newR.add(q.id)
    const newF = new Set(flagged)
    newF.delete(q.id)
    setReviewed(newR)
    setFlagged(newF)
    saveState(newR, newF)
    if (currentIdx < filtered.length - 1) setCurrentIdx(currentIdx + 1)
  }

  function markFlag() {
    const q = filtered[currentIdx]
    const newF = new Set(flagged)
    newF.add(q.id)
    const newR = new Set(reviewed)
    newR.add(q.id)
    setFlagged(newF)
    setReviewed(newR)
    saveState(newR, newF)
    if (currentIdx < filtered.length - 1) setCurrentIdx(currentIdx + 1)
  }

  function goTo(idx: number) {
    if (idx >= 0 && idx < filtered.length) setCurrentIdx(idx)
  }

  const q = filtered[currentIdx]
  const esps = [...new Set(questions.map(q => q.esp))].filter(Boolean).sort()
  const years = [...new Set(questions.map(q => q.y))].filter(Boolean).sort()
  const reviewedInFilter = filtered.filter(q => reviewed.has(q.id)).length
  const flaggedInFilter = filtered.filter(q => flagged.has(q.id)).length

  if (!q) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-400">Cargando preguntas...</p>
      </div>
    )
  }

  const qStatus = flagged.has(q.id) ? 'flagged' : reviewed.has(q.id) ? 'ok' : 'pending'

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-stone-800 text-white px-4 py-3 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-stone-300 text-sm hover:text-white">Admin</Link>
            <span className="font-bold">Revisar Preguntas</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-emerald-400">{reviewedInFilter - flaggedInFilter} OK</span>
            <span className="text-red-400">{flaggedInFilter} con problema</span>
            <span className="text-stone-400">{filtered.length - reviewedInFilter} sin revisar</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select value={esp} onChange={e => setEsp(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
            <option value="">Todas las especialidades</option>
            {esps.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={year} onChange={e => setYear(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
            <option value="">Todos los años</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="text-sm text-stone-500 self-center">
            {currentIdx + 1} de {filtered.length}
          </span>
          <button onClick={() => {
            // Jump to first unreviewed
            const idx = filtered.findIndex(q => !reviewed.has(q.id))
            if (idx >= 0) setCurrentIdx(idx)
          }} className="text-sm text-teal-600 underline self-center">
            Ir a siguiente sin revisar
          </button>
        </div>

        {/* Navigation dots */}
        <div className="flex flex-wrap gap-1 mb-6 max-h-20 overflow-y-auto">
          {filtered.map((fq, idx) => {
            const s = flagged.has(fq.id) ? 'bg-red-500' : reviewed.has(fq.id) ? 'bg-emerald-500' : 'bg-stone-300'
            const active = idx === currentIdx ? 'ring-2 ring-stone-800' : ''
            return (
              <button key={fq.id} onClick={() => goTo(idx)}
                className={`w-3 h-3 rounded-full ${s} ${active} hover:opacity-80`}
                title={`P${fq.n} (${fq.esp})`}
              />
            )
          })}
        </div>

        {/* Question preview */}
        <div className={`rounded-xl border-2 p-6 mb-4 ${
          qStatus === 'flagged' ? 'border-red-400 bg-red-50' :
          qStatus === 'ok' ? 'border-emerald-400 bg-emerald-50' :
          'border-stone-200 bg-white'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-stone-400">{q.id}</p>
              <p className="text-sm text-stone-500">Pregunta {q.n} — {q.esp} · {q.niv} · {q.y}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              qStatus === 'flagged' ? 'bg-red-200 text-red-700' :
              qStatus === 'ok' ? 'bg-emerald-200 text-emerald-700' :
              'bg-stone-200 text-stone-600'
            }`}>
              {qStatus === 'flagged' ? 'CON PROBLEMA' : qStatus === 'ok' ? 'OK' : 'SIN REVISAR'}
            </span>
          </div>

          {/* Context */}
          {q.ctx && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-justify">
              <p className="text-xs text-amber-600 font-bold mb-1">CONTEXTO:</p>
              {q.ctx}
            </div>
          )}

          {/* Enunciado */}
          <div className="mb-4">
            <p className="text-xs text-stone-400 font-bold mb-1">ENUNCIADO:</p>
            <p className="text-base leading-relaxed text-justify">{q.txt}</p>
          </div>

          {/* Alternativas */}
          <div className="space-y-2 mb-4">
            <p className="text-xs text-stone-400 font-bold">ALTERNATIVAS:</p>
            {q.a.map(alt => (
              <div key={alt.l} className={`flex gap-3 p-3 rounded-lg ${alt.l === q.r ? 'bg-emerald-100 border border-emerald-300' : 'bg-stone-50 border border-stone-200'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${alt.l === q.r ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-600'}`}>{alt.l}</span>
                <span className="flex-1 text-sm text-justify">{alt.t}</span>
              </div>
            ))}
          </div>

          {/* Explicación */}
          {q.ex && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm">
              <p className="text-xs text-blue-600 font-bold mb-1">EXPLICACION:</p>
              {q.ex}
            </div>
          )}

          {/* Hints */}
          {q.h && Object.keys(q.h).length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
              <p className="text-xs text-amber-600 font-bold mb-1">PISTAS:</p>
              {Object.entries(q.h).map(([l, hint]) => (
                <p key={l} className="mb-1"><b>{l}:</b> {hint}</p>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <button onClick={() => goTo(currentIdx - 1)} disabled={currentIdx === 0}
            className="px-4 py-2 bg-stone-200 rounded-lg text-sm disabled:opacity-30">
            Anterior
          </button>

          <div className="flex gap-3">
            <button onClick={markFlag}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors">
              Tiene problema
            </button>
            <button onClick={markOk}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors">
              OK - Siguiente
            </button>
          </div>

          <button onClick={() => goTo(currentIdx + 1)} disabled={currentIdx >= filtered.length - 1}
            className="px-4 py-2 bg-stone-200 rounded-lg text-sm disabled:opacity-30">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

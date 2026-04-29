'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Suspect {
  idx: number; id: string; esp: string; n: number; y: number; issues: string[];
}

interface Question {
  id: string; y: number; mod: string; niv: string; esp: string;
  n: number; ctx: string; txt: string;
  a: { l: string; t: string }[]; r: string;
  ex?: string;
}

export default function RevisarPage() {
  const [suspects, setSuspects] = useState<Suspect[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [filterEsp, setFilterEsp] = useState('')
  const [reviewed, setReviewed] = useState<Set<string>>(new Set())
  const [flagged, setFlagged] = useState<Set<string>>(new Set())

  useEffect(() => {
    Promise.all([
      fetch('/suspect.json').then(r => r.json()),
      fetch('/preguntas.json').then(r => r.json()),
    ]).then(([s, q]) => {
      setSuspects(s)
      setQuestions(q)
    })
    const savedR = localStorage.getItem('review-ok')
    const savedF = localStorage.getItem('review-flag')
    if (savedR) setReviewed(new Set(JSON.parse(savedR)))
    if (savedF) setFlagged(new Set(JSON.parse(savedF)))
  }, [])

  const filtered = filterEsp ? suspects.filter(s => s.esp === filterEsp) : suspects
  const esps = [...new Set(suspects.map(s => s.esp))].sort()
  const current = filtered[currentIdx]
  const q = current ? questions.find(qq => qq.id === current.id) : null

  function save(newR: Set<string>, newF: Set<string>) {
    localStorage.setItem('review-ok', JSON.stringify([...newR]))
    localStorage.setItem('review-flag', JSON.stringify([...newF]))
  }

  function markOk() {
    if (!current) return
    const r = new Set(reviewed); r.add(current.id)
    const f = new Set(flagged); f.delete(current.id)
    setReviewed(r); setFlagged(f); save(r, f)
    if (currentIdx < filtered.length - 1) setCurrentIdx(currentIdx + 1)
  }

  function markFlag() {
    if (!current) return
    const f = new Set(flagged); f.add(current.id)
    const r = new Set(reviewed); r.add(current.id)
    setFlagged(f); setReviewed(r); save(r, f)
    if (currentIdx < filtered.length - 1) setCurrentIdx(currentIdx + 1)
  }

  if (!q || !current) {
    return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>
  }

  const reviewedCount = filtered.filter(s => reviewed.has(s.id)).length
  const flaggedCount = filtered.filter(s => flagged.has(s.id)).length
  const status = flagged.has(current.id) ? 'flag' : reviewed.has(current.id) ? 'ok' : 'pending'

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-red-800 text-white px-4 py-3 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-red-200 text-sm">Admin</Link>
            <span className="font-bold">Revisar sospechosas ({filtered.length})</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-emerald-300">{reviewedCount - flaggedCount} OK</span>
            <span className="text-red-300">{flaggedCount} con error</span>
            <span className="text-red-200">{filtered.length - reviewedCount} pendientes</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <select value={filterEsp} onChange={e => { setFilterEsp(e.target.value); setCurrentIdx(0) }}
            className="rounded-lg border px-3 py-2 text-sm">
            <option value="">Todas ({suspects.length})</option>
            {esps.map(e => <option key={e} value={e}>{e} ({suspects.filter(s => s.esp === e).length})</option>)}
          </select>
          <span className="text-sm text-stone-500">{currentIdx + 1} de {filtered.length}</span>
          <button onClick={() => {
            const idx = filtered.findIndex(s => !reviewed.has(s.id))
            if (idx >= 0) setCurrentIdx(idx)
          }} className="text-sm text-red-600 underline">Ir a siguiente pendiente</button>
        </div>

        {/* Issues */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-xs font-bold text-red-600 mb-1">PROBLEMAS DETECTADOS:</p>
          <div className="flex flex-wrap gap-2">
            {current.issues.map((issue, i) => (
              <span key={i} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">{issue}</span>
            ))}
          </div>
        </div>

        {/* Question */}
        <div className={`rounded-xl border-2 p-6 mb-4 ${status === 'flag' ? 'border-red-400 bg-red-50' : status === 'ok' ? 'border-emerald-400 bg-emerald-50' : 'border-stone-200 bg-white'}`}>
          <p className="text-xs text-stone-400 mb-1">{current.id} · P{current.n} · {current.esp} · {current.y}</p>

          {q.ctx && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-justify">
              <p className="text-xs text-amber-600 font-bold mb-1">CONTEXTO ({q.ctx.length} chars):</p>
              <p className="whitespace-pre-line">{q.ctx}</p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-xs text-stone-400 font-bold mb-1">ENUNCIADO ({q.txt.length} chars):</p>
            <p className="text-base leading-relaxed text-justify whitespace-pre-line">{q.txt}</p>
          </div>

          <div className="space-y-2 mb-4">
            {q.a.map(alt => (
              <div key={alt.l} className={`flex gap-3 p-3 rounded-lg text-sm ${alt.l === q.r ? 'bg-emerald-100 border border-emerald-300' : 'bg-stone-50 border border-stone-200'}`}>
                <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${alt.l === q.r ? 'bg-emerald-500 text-white' : 'bg-stone-200'}`}>{alt.l}</span>
                <div className="flex-1">
                  <p className="text-justify">{alt.t}</p>
                  <p className="text-xs text-stone-400 mt-1">{alt.t.length} chars</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0}
            className="px-4 py-2 bg-stone-200 rounded-lg text-sm disabled:opacity-30">Anterior</button>
          <div className="flex gap-3">
            <button onClick={markFlag} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl">
              Tiene error
            </button>
            <button onClick={markOk} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl">
              Está bien
            </button>
          </div>
          <button onClick={() => setCurrentIdx(Math.min(filtered.length - 1, currentIdx + 1))} disabled={currentIdx >= filtered.length - 1}
            className="px-4 py-2 bg-stone-200 rounded-lg text-sm disabled:opacity-30">Siguiente</button>
        </div>
      </div>
    </div>
  )
}

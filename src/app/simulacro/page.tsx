'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Question {
  id: string; y: number; mod: string; niv: string; esp: string;
  f: number; n: number; ctx: string; txt: string;
  a: { l: string; t: string }[]; r: string;
  ex?: string; h?: Record<string, string>; comp?: string; concepto?: string;
}

type Phase = 'select' | 'exam' | 'results' | 'review'

export default function SimulacroPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [especialidades, setEspecialidades] = useState<string[]>([])
  const [selectedEsp, setSelectedEsp] = useState('')
  const [selectedSim, setSelectedSim] = useState(0)
  const [simQuestions, setSimQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [phase, setPhase] = useState<Phase>('select')
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60) // 3 hours in seconds
  const [timeUsed, setTimeUsed] = useState(0)
  const [reviewIdx, setReviewIdx] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetch('/preguntas.json').then(r => r.json()).then((data: Question[]) => {
      setQuestions(data)
      const esps = [...new Set(data.map(q => q.esp).filter(Boolean))].sort()
      setEspecialidades(esps)
    })
  }, [])

  useEffect(() => {
    if (phase === 'exam' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            finishExam()
            return 0
          }
          return prev - 1
        })
        setTimeUsed(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timerRef.current!)
    }
  }, [phase])

  function startSimulacro(simNum: number) {
    const pool = questions.filter(q => q.esp === selectedEsp)
    // Sort deterministically by ID so simulacros are always the same
    const sorted = [...pool].sort((a, b) => a.id.localeCompare(b.id))
    const start = (simNum - 1) * 60
    const simQs = sorted.slice(start, start + 60)

    if (simQs.length < 60) return

    setSimQuestions(simQs)
    setSelectedSim(simNum)
    setCurrentIdx(0)
    setAnswers({})
    setTimeLeft(3 * 60 * 60)
    setTimeUsed(0)
    setPhase('exam')
  }

  function selectAnswer(letter: string) {
    setAnswers(prev => ({ ...prev, [currentIdx]: letter }))
  }

  function nextQuestion() {
    if (currentIdx < simQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1)
    }
  }

  function prevQuestion() {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1)
    }
  }

  function finishExam() {
    clearInterval(timerRef.current!)
    setPhase('results')
  }

  function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // ═══ PHASE: SELECT ═══
  if (phase === 'select') {
    const espCount = selectedEsp ? questions.filter(q => q.esp === selectedEsp).length : 0
    const canSim = espCount >= 180

    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-teal-800 text-white py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Link href="/" className="text-teal-200 text-sm hover:text-white">← Inicio</Link>
            <h1 className="font-[var(--font-display)] text-4xl font-bold mt-2">Simulacro</h1>
            <p className="mt-2 text-teal-200">Examen completo de 60 preguntas en 3 horas</p>
          </div>
        </header>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
            <h2 className="font-[var(--font-display)] text-xl font-semibold">Elige tu especialidad</h2>
            <select
              value={selectedEsp}
              onChange={e => setSelectedEsp(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Selecciona una especialidad</option>
              {especialidades.map(esp => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>

          {selectedEsp && canSim && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
              <h2 className="font-[var(--font-display)] text-xl font-semibold">Elige tu simulacro</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map(num => (
                  <button
                    key={num}
                    onClick={() => startSimulacro(num)}
                    className="p-6 rounded-xl border-2 border-teal-200 hover:border-teal-500 hover:shadow-md transition-all text-center"
                  >
                    <p className="font-[var(--font-display)] text-3xl font-bold text-teal-700">{num}</p>
                    <p className="text-sm text-stone-500 mt-1">Simulacro {num}</p>
                    <p className="text-xs text-stone-400 mt-1">60 preguntas · 3 horas</p>
                  </button>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <p className="font-semibold">Como en el examen real:</p>
                <ul className="mt-1 space-y-1 text-amber-700">
                  <li>· 60 preguntas con 3 alternativas</li>
                  <li>· Tiempo máximo de 3 horas</li>
                  <li>· Sin pistas ni explicaciones durante el examen</li>
                  <li>· Al terminar, revisas tus respuestas con explicaciones</li>
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    )
  }

  // ═══ PHASE: EXAM ═══
  if (phase === 'exam') {
    const q = simQuestions[currentIdx]
    const answered = Object.keys(answers).length
    const selected = answers[currentIdx]

    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-stone-800 text-white px-4 py-3 sticky top-0 z-20 shadow-md">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="bg-amber-500 text-xs px-2 py-0.5 rounded font-bold">SIMULACRO {selectedSim}</span>
                <span className="font-[var(--font-display)] font-bold text-lg">{currentIdx + 1} / 60</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span>Respondidas: <b>{answered}/60</b></span>
                <span className={`font-mono font-bold ${timeLeft < 600 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-1.5 bg-stone-700 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: `${(answered / 60) * 100}%` }} />
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
          {/* Question navigator dots */}
          <div className="flex flex-wrap gap-1 justify-center">
            {simQuestions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                  idx === currentIdx ? 'bg-teal-600 text-white ring-2 ring-teal-300' :
                  answers[idx] ? 'bg-emerald-500 text-white' :
                  'bg-stone-200 text-stone-500 hover:bg-stone-300'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Context */}
          {q.ctx && q.ctx.trim() && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm leading-relaxed text-justify">
              {q.ctx}
            </div>
          )}

          {/* Question */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-5">
            <p className="text-xs text-stone-400 mb-2">Pregunta {currentIdx + 1} de 60</p>
            <p className="text-lg leading-relaxed font-medium text-justify">{q.txt}</p>
          </div>

          {/* Alternatives */}
          <div className="space-y-3">
            {q.a.map(alt => (
              <button
                key={alt.l}
                onClick={() => selectAnswer(alt.l)}
                className={`w-full text-left rounded-xl border-2 p-4 transition-all flex gap-3 items-start ${
                  selected === alt.l
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  selected === alt.l ? 'bg-teal-500 text-white' : 'bg-stone-100 text-stone-600'
                }`}>{alt.l}</span>
                <span className="flex-1 leading-relaxed text-justify">{alt.t}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={prevQuestion}
              disabled={currentIdx === 0}
              className="px-5 py-2 bg-stone-200 rounded-lg text-sm font-medium disabled:opacity-30"
            >
              Anterior
            </button>

            {currentIdx < 59 ? (
              <button
                onClick={nextQuestion}
                className="px-5 py-2 bg-teal-700 text-white rounded-lg text-sm font-medium hover:bg-teal-800"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={() => {
                  if (answered < 60) {
                    const sin = 60 - answered
                    if (!confirm(`Tienes ${sin} preguntas sin responder. ¿Deseas terminar el simulacro?`)) return
                  }
                  finishExam()
                }}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700"
              >
                Terminar simulacro
              </button>
            )}
          </div>
        </main>
      </div>
    )
  }

  // ═══ PHASE: RESULTS ═══
  if (phase === 'results') {
    const correct = simQuestions.filter((q, i) => answers[i] === q.r).length
    const incorrect = Object.keys(answers).length - correct
    const unanswered = 60 - Object.keys(answers).length
    const pct = Math.round((correct / 60) * 100)

    // Minimum scores by scale
    const scales = [
      { name: '2da escala', min: 36 },
      { name: '3ra escala', min: 38 },
      { name: '4ta escala', min: 40 },
      { name: '5ta escala', min: 42 },
      { name: '6ta escala', min: 44 },
      { name: '7ma escala', min: 46 },
      { name: '8va escala', min: 46 },
    ]

    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-teal-800 text-white py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-[var(--font-display)] text-4xl font-bold">Resultado del Simulacro {selectedSim}</h1>
            <p className="mt-2 text-teal-200">{selectedEsp} · Tiempo: {formatTime(timeUsed)}</p>
          </div>
        </header>

        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
          {/* Score */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 text-center">
            <p className={`font-[var(--font-display)] text-7xl font-bold ${pct >= 70 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
              {correct}/60
            </p>
            <p className="text-xl text-stone-500 mt-2">{pct}% de aciertos</p>
          </div>

          {/* Scale check */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <h3 className="font-[var(--font-display)] text-lg font-semibold mb-3">¿Clasificas a la siguiente etapa?</h3>
            <div className="space-y-2">
              {scales.map(s => (
                <div key={s.name} className={`flex justify-between items-center p-3 rounded-lg ${correct >= s.min ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                  <span className="text-sm font-medium">{s.name} (mínimo {s.min})</span>
                  <span className={`text-sm font-bold ${correct >= s.min ? 'text-emerald-600' : 'text-red-600'}`}>
                    {correct >= s.min ? 'CLASIFICA' : 'NO CLASIFICA'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-[var(--font-display)] text-2xl font-bold text-emerald-600">{correct}</p>
                <p className="text-sm text-stone-500">Correctas</p>
              </div>
              <div>
                <p className="font-[var(--font-display)] text-2xl font-bold text-red-600">{incorrect}</p>
                <p className="text-sm text-stone-500">Incorrectas</p>
              </div>
              <div>
                <p className="font-[var(--font-display)] text-2xl font-bold text-stone-400">{unanswered}</p>
                <p className="text-sm text-stone-500">Sin responder</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setReviewIdx(0); setPhase('review') }}
              className="px-6 py-3 bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800"
            >
              Revisar con explicaciones
            </button>
            <button
              onClick={() => setPhase('select')}
              className="px-6 py-3 bg-stone-200 font-bold rounded-xl hover:bg-stone-300"
            >
              Volver a simulacros
            </button>
          </div>
        </main>
      </div>
    )
  }

  // ═══ PHASE: REVIEW ═══
  if (phase === 'review') {
    const q = simQuestions[reviewIdx]
    const userAnswer = answers[reviewIdx]
    const isCorrect = userAnswer === q.r

    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-stone-800 text-white px-4 py-3 sticky top-0 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-300">Revisión Simulacro {selectedSim}</span>
              <span className="font-bold">{reviewIdx + 1} / 60</span>
            </div>
            <button onClick={() => setPhase('results')} className="text-stone-300 text-sm hover:text-white">
              Volver a resultados
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-4">
              {/* Status badge */}
              <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${isCorrect ? 'bg-emerald-100 text-emerald-700' : userAnswer ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-600'}`}>
                {isCorrect ? 'CORRECTO' : userAnswer ? 'INCORRECTO' : 'SIN RESPONDER'}
                {userAnswer && !isCorrect && ` (marcaste ${userAnswer}, correcta: ${q.r})`}
              </div>

              {/* Context */}
              {q.ctx && q.ctx.trim() && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm leading-relaxed text-justify">
                  {q.ctx}
                </div>
              )}

              {/* Question */}
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-5">
                <p className="text-xs text-stone-400 mb-2">Pregunta {reviewIdx + 1}</p>
                <p className="text-lg leading-relaxed font-medium text-justify">{q.txt}</p>
              </div>

              {/* Alternatives with correct/incorrect markers */}
              <div className="space-y-3">
                {q.a.map(alt => {
                  let cls = 'border-stone-200 bg-white'
                  let circleCls = 'bg-stone-100 text-stone-600'

                  if (alt.l === q.r) {
                    cls = 'border-emerald-500 bg-emerald-50'
                    circleCls = 'bg-emerald-500 text-white'
                  } else if (alt.l === userAnswer) {
                    cls = 'border-red-400 bg-red-50'
                    circleCls = 'bg-red-400 text-white'
                  }

                  return (
                    <div key={alt.l} className={`rounded-xl border-2 p-4 flex gap-3 items-start ${cls}`}>
                      <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${circleCls}`}>{alt.l}</span>
                      <span className="flex-1 leading-relaxed text-justify">{alt.t}</span>
                    </div>
                  )
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4">
                <button onClick={() => setReviewIdx(Math.max(0, reviewIdx - 1))} disabled={reviewIdx === 0}
                  className="px-5 py-2 bg-stone-200 rounded-lg text-sm disabled:opacity-30">Anterior</button>
                <button onClick={() => setReviewIdx(Math.min(59, reviewIdx + 1))} disabled={reviewIdx === 59}
                  className="px-5 py-2 bg-teal-700 text-white rounded-lg text-sm hover:bg-teal-800">Siguiente</button>
              </div>
            </div>

            {/* Prof. Valdivia explanation */}
            <div className="lg:col-span-2">
              <div className="bg-stone-100 rounded-xl border border-stone-200 overflow-hidden sticky top-24">
                <div className="bg-teal-700 text-white px-4 py-3 flex items-center gap-3">
                  <img src="/prof-valdivia.png" alt="Prof. Valdivia" className="w-10 h-10 rounded-full object-cover border-2 border-teal-500" />
                  <div>
                    <p className="font-semibold text-sm">Prof. Valdivia</p>
                    <p className="text-xs text-teal-200">Revisión del simulacro</p>
                  </div>
                </div>
                <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto bg-[#e5ddd5] min-h-[200px]">
                  {isCorrect ? (
                    <div className="rounded-lg px-4 py-3 text-base shadow-sm bg-emerald-100 border border-emerald-300 rounded-tl-none">
                      Correcto. La respuesta es {q.r}.
                    </div>
                  ) : (
                    <div className="rounded-lg px-4 py-3 text-base shadow-sm bg-red-100 border border-red-300 rounded-tl-none">
                      {userAnswer ? `Marcaste ${userAnswer}, pero la correcta es ${q.r}.` : `No respondiste. La correcta es ${q.r}.`}
                    </div>
                  )}
                  {q.ex && (
                    <div className="rounded-lg px-4 py-3 text-base shadow-sm bg-white rounded-tl-none">
                      {q.ex}
                    </div>
                  )}
                  {q.comp && (
                    <div className="rounded-lg px-4 py-3 text-base shadow-sm bg-white rounded-tl-none">
                      <b>Competencia:</b> {q.comp}
                    </div>
                  )}
                  {q.h && userAnswer && userAnswer !== q.r && q.h[userAnswer] && (
                    <div className="rounded-lg px-4 py-3 text-base shadow-sm bg-amber-100 border border-amber-300 rounded-tl-none">
                      <b>¿Por qué {userAnswer} no es correcta?</b><br/>{q.h[userAnswer]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return null
}

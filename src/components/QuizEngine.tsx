'use client'

import { useState, useEffect, useRef } from 'react'

interface Question {
  id: string; y: number; mod: string; niv: string; esp: string;
  f: number; n: number; ctx: string; txt: string;
  a: { l: string; t: string }[]; r: string;
  ex?: string; h?: Record<string, string>; comp?: string; concepto?: string;
}

interface AttemptState {
  attempt: number
  choices: string[]
  firstCorrect: boolean
  correct: boolean
}

interface Props {
  questions: Question[]
  onFinish: () => void
  isDemo?: boolean
}

export default function QuizEngine({ questions, onFinish, isDemo = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [attempts, setAttempts] = useState<Record<string, AttemptState>>({})
  const [messages, setMessages] = useState<{ type: string; text: string }[]>([])
  const [timerStart] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init: Record<string, AttemptState> = {}
    questions.forEach(q => {
      init[q.id] = { attempt: 0, choices: [], firstCorrect: false, correct: false }
    })
    setAttempts(init)
    setMessages([{ type: 'mentor', text: 'Lee con atención y selecciona la alternativa que consideres correcta.' }])
  }, [questions])

  useEffect(() => {
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - timerStart) / 1000)), 1000)
    return () => clearInterval(timer)
  }, [timerStart])

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight)
  }, [messages])

  const q = questions[currentIndex]
  const state = attempts[q?.id]
  if (!q || !state) return null

  const answered = Object.values(attempts).filter(a => a.correct || a.attempt >= 2)
  const firstCorrectCount = answered.filter(a => a.firstCorrect).length
  const totalCorrectCount = answered.filter(a => a.correct).length
  const isResolved = state.correct || state.attempt >= 2

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const secs = String(elapsed % 60).padStart(2, '0')

  function handleAnswer(letter: string) {
    const newAttempts = { ...attempts }
    const s = { ...newAttempts[q.id] }
    s.attempt++
    s.choices = [...s.choices, letter]

    const isCorrect = letter === q.r
    const msgs: { type: string; text: string }[] = []

    if (isCorrect) {
      s.correct = true
      s.firstCorrect = s.attempt === 1
      const badge = s.attempt === 1 ? 'Excelente, acertaste al primer intento.' : 'Correcto en el segundo intento.'
      msgs.push({ type: 'correct', text: `${badge} La respuesta es ${q.r}.` })
      if (q.ex) msgs.push({ type: 'mentor', text: q.ex })
      if (q.comp) msgs.push({ type: 'mentor', text: `Competencia: ${q.comp}` })
    } else if (s.attempt === 1) {
      msgs.push({ type: 'incorrect', text: `La alternativa ${letter} no es correcta.` })
      if (q.h && q.h[letter]) {
        msgs.push({ type: 'mentor', text: q.h[letter] })
      } else {
        msgs.push({ type: 'mentor', text: 'Relee el enunciado con atención. Analiza qué diferencia a cada alternativa en su fundamento pedagógico.' })
      }
      msgs.push({ type: 'mentor', text: 'Tienes un intento más. Vuelve a intentar.' })
    } else {
      s.correct = false
      msgs.push({ type: 'reveal', text: `Incorrecto. La respuesta correcta es ${q.r}.` })
      if (q.ex) msgs.push({ type: 'mentor', text: q.ex })
      if (q.comp) msgs.push({ type: 'mentor', text: `Competencia: ${q.comp}` })
      if (!q.ex) {
        const correctAlt = q.a.find(a => a.l === q.r)
        if (correctAlt) msgs.push({ type: 'mentor', text: `La alternativa correcta señala: "${correctAlt.t.slice(0, 200)}${correctAlt.t.length > 200 ? '...' : ''}"` })
      }
    }

    newAttempts[q.id] = s
    setAttempts(newAttempts)
    setMessages(msgs)
  }

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setMessages([{ type: 'mentor', text: 'Lee con atención y selecciona la alternativa que consideres correcta.' }])
      window.scrollTo(0, 0)
    } else {
      onFinish()
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-teal-800 text-white px-4 py-3 sticky top-0 z-20 shadow-md">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              {isDemo && <span className="bg-amber-500 text-xs px-2 py-0.5 rounded font-bold">DEMO</span>}
              <span className="font-[var(--font-display)] font-bold text-lg">{currentIndex + 1} / {questions.length}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span title="Aciertos al primer intento">1er: <b>{firstCorrectCount}/{answered.length}</b></span>
              <span title="Aciertos totales">Total: <b>{totalCorrectCount}/{answered.length}</b></span>
              <span>{mins}:{secs}</span>
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-teal-950 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400 rounded-full transition-all duration-300" style={{ width: `${(currentIndex / questions.length) * 100}%` }} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question */}
          <div className="lg:col-span-2 space-y-4">
            {/* Context */}
            {q.ctx && q.ctx.trim() && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm leading-relaxed whitespace-pre-line">
                {q.ctx}
              </div>
            )}

            {/* Enunciado */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-5">
              <p className="text-xs text-stone-400 mb-2">
                Pregunta {q.n} — {[q.esp, q.niv, q.y].filter(Boolean).join(' · ')}
              </p>
              <p className="text-lg leading-relaxed font-medium whitespace-pre-line">{q.txt}</p>
            </div>

            {/* Alternativas */}
            <div className="space-y-3">
              {q.a.map(alt => {
                const isDisabled = state.choices.includes(alt.l) && !state.correct
                const isChosen = state.choices.includes(alt.l)

                let btnClass = 'w-full text-left rounded-xl border-2 p-4 transition-all duration-200 flex gap-3 items-start '
                let circleClass = 'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold '

                if (isResolved && alt.l === q.r) {
                  btnClass += 'border-emerald-500 bg-emerald-50 cursor-default '
                  circleClass += 'bg-emerald-500 text-white '
                } else if (isResolved && isChosen) {
                  btnClass += 'border-red-300 bg-red-50 cursor-default opacity-60 '
                  circleClass += 'bg-red-200 text-red-600 '
                } else if (isDisabled) {
                  btnClass += 'border-red-300 bg-red-50 cursor-not-allowed opacity-60 '
                  circleClass += 'bg-red-200 text-red-600 '
                } else if (isResolved) {
                  btnClass += 'border-stone-200 bg-white cursor-default opacity-60 '
                  circleClass += 'bg-stone-100 text-stone-600 '
                } else {
                  btnClass += 'border-stone-200 bg-white hover:border-teal-400 hover:shadow-sm cursor-pointer '
                  circleClass += 'bg-stone-100 text-stone-600 '
                }

                return (
                  <button
                    key={alt.l}
                    className={btnClass}
                    disabled={isResolved || isDisabled}
                    onClick={() => handleAnswer(alt.l)}
                  >
                    <span className={circleClass}>{alt.l}</span>
                    <span className="flex-1 leading-relaxed">{alt.t}</span>
                  </button>
                )
              })}
            </div>

            {/* Next button */}
            {isResolved && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={nextQuestion}
                  className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition-colors"
                >
                  {currentIndex < questions.length - 1 ? 'Siguiente pregunta' : (isDemo ? 'Ver resultados' : 'Ver resultados')}
                </button>
              </div>
            )}
          </div>

          {/* Chat panel */}
          <div className="lg:col-span-1">
            <div className="bg-stone-100 rounded-xl border border-stone-200 overflow-hidden sticky top-24">
              <div className="bg-teal-700 text-white px-4 py-3 flex items-center gap-3">
                <img src="/prof-valdivia.png" alt="Prof. Valdivia" className="w-10 h-10 rounded-full object-cover border-2 border-teal-500" />
                <div>
                  <p className="font-semibold text-sm">Prof. Valdivia</p>
                  <p className="text-xs text-teal-200">Asesor pedagógico</p>
                </div>
              </div>
              <div ref={chatRef} className="p-4 space-y-3 max-h-[500px] overflow-y-auto bg-[#e5ddd5] min-h-[200px]">
                {messages.map((msg, i) => {
                  let bubbleClass = 'rounded-lg px-3 py-2 text-sm shadow-sm max-w-[90%] '
                  if (msg.type === 'correct') bubbleClass += 'bg-emerald-100 border border-emerald-300 rounded-tl-none'
                  else if (msg.type === 'incorrect') bubbleClass += 'bg-amber-100 border border-amber-300 rounded-tl-none'
                  else if (msg.type === 'reveal') bubbleClass += 'bg-red-100 border border-red-300 rounded-tl-none'
                  else bubbleClass += 'bg-white rounded-tl-none'

                  return <div key={i} className={bubbleClass}>{msg.text}</div>
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

import Link from "next/link"

const especialidades = [
  { nombre: "Primaria", preguntas: 537 },
  { nombre: "Matemática", preguntas: 270 },
  { nombre: "Inicial", preguntas: 303 },
  { nombre: "Educación Religiosa", preguntas: 264 },
  { nombre: "Comunicación", preguntas: 240 },
  { nombre: "Arte y Cultura", preguntas: 213 },
  { nombre: "Ciencias Sociales", preguntas: 167 },
  { nombre: "DPCC", preguntas: 137 },
  { nombre: "Ciencia y Tecnología", preguntas: 131 },
  { nombre: "Educación Física", preguntas: 71 },
  { nombre: "Inglés", preguntas: 69 },
  { nombre: "EBE", preguntas: 57 },
  { nombre: "EBA Avanzado", preguntas: 373 },
  { nombre: "EBA Inicial/Intermedio", preguntas: 52 },
]

const pasos = [
  { num: "1", titulo: "Paga por Yape", desc: "Realiza tu pago de S/ 39.90 por Yape o Plin" },
  { num: "2", titulo: "Envía tu comprobante", desc: "Manda la captura de pago a nuestro WhatsApp" },
  { num: "3", titulo: "Activa tu cuenta", desc: "En minutos activamos tu acceso y empiezas a practicar" },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="bg-teal-800 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-[var(--font-display)] text-5xl md:text-6xl font-bold tracking-tight">
            Asciende Docente
          </h1>
          <p className="mt-4 text-xl text-teal-200 max-w-xl mx-auto">
            Practica con las preguntas reales del Minedu y prepárate para el Concurso de Ascenso
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="px-8 py-4 bg-white text-teal-800 font-bold rounded-xl text-lg hover:bg-teal-50 transition-colors"
            >
              Probar demo gratis
            </Link>
            <a
              href="https://wa.me/51962340472?text=Quiero%20acceder%20a%20Asciende%20Docente"
              target="_blank"
              rel="noopener"
              className="px-8 py-4 bg-teal-600 text-white font-bold rounded-xl text-lg hover:bg-teal-500 transition-colors border border-teal-500"
            >
              Comprar acceso — S/ 39.90
            </a>
          </div>
          <p className="mt-4 text-teal-300 text-sm">5 preguntas gratis sin registro</p>
        </div>
      </section>

      {/* NÚMEROS */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-stone-800">
            2,987 preguntas con explicaciones pedagógicas
          </h2>
          <p className="mt-2 text-stone-500">
            Extraídas de los cuadernillos oficiales del Minedu (2018–2025)
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {especialidades.map((esp) => (
              <div key={esp.nombre} className="bg-stone-50 rounded-xl p-4 text-center border border-stone-100">
                <p className="font-[var(--font-display)] text-2xl font-bold text-teal-700">{esp.preguntas}</p>
                <p className="text-sm text-stone-600 mt-1">{esp.nombre}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA EL ANDAMIAJE */}
      <section className="py-16 px-4 bg-stone-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-center text-stone-800">
            No es un quiz, es aprendizaje con andamiaje
          </h2>
          <p className="mt-2 text-center text-stone-500 max-w-xl mx-auto">
            Si fallas, no te damos la respuesta. Te explicamos por qué te equivocaste y te damos una pista para que lo intentes de nuevo.
          </p>
          <div className="mt-8 space-y-4 max-w-lg mx-auto">
            <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">1</span>
                <span className="font-semibold text-stone-700">Primer intento</span>
              </div>
              <p className="mt-2 text-sm text-stone-500 ml-11">Seleccionas una alternativa. Si aciertas, recibes la explicación completa del concepto pedagógico.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">2</span>
                <span className="font-semibold text-stone-700">Si fallas: pista pedagógica</span>
              </div>
              <p className="mt-2 text-sm text-stone-500 ml-11">NO te revelamos la respuesta. Te explicamos por qué tu elección es incorrecta y te damos una pista basada en el CNEB para que razonemos.</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-emerald-200 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">3</span>
                <span className="font-semibold text-stone-700">Segundo intento o revelación</span>
              </div>
              <p className="mt-2 text-sm text-stone-500 ml-11">Si aciertas en el segundo intento, refuerzas el aprendizaje. Si fallas de nuevo, ahora sí revelamos la respuesta con la explicación completa.</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/demo"
              className="inline-block px-8 py-3 bg-teal-700 text-white font-semibold rounded-xl hover:bg-teal-800 transition-colors"
            >
              Probar ahora gratis
            </Link>
          </div>
        </div>
      </section>

      {/* CÓMO ACCEDER */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-stone-800">
            Accede en 3 pasos
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {pasos.map((paso) => (
              <div key={paso.num} className="text-center">
                <div className="w-14 h-14 rounded-full bg-teal-700 text-white flex items-center justify-center text-2xl font-bold mx-auto">
                  {paso.num}
                </div>
                <h3 className="mt-4 font-semibold text-stone-800">{paso.titulo}</h3>
                <p className="mt-1 text-sm text-stone-500">{paso.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECIO */}
      <section className="py-16 px-4 bg-teal-800 text-white">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-[var(--font-display)] text-3xl font-bold">
            Acceso completo
          </h2>
          <div className="mt-6 bg-white/10 rounded-2xl p-8 backdrop-blur">
            <p className="font-[var(--font-display)] text-6xl font-bold">S/ 39.90</p>
            <p className="mt-2 text-teal-200">Acceso hasta el día del examen</p>
            <ul className="mt-6 text-left space-y-2 text-teal-100">
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> 2,987 preguntas oficiales del Minedu</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> 14 especialidades (EBR, EBA, EBE)</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Explicaciones pedagógicas profesionales</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Exámenes 2018, 2019, 2021, 2023, 2024, 2025</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Seguimiento de tu progreso</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Acceso desde celular o computadora</li>
            </ul>
            <a
              href="https://wa.me/51962340472?text=Quiero%20acceder%20a%20Asciende%20Docente"
              target="_blank"
              rel="noopener"
              className="mt-8 inline-block w-full px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl text-lg hover:bg-emerald-400 transition-colors"
            >
              Comprar por WhatsApp
            </a>
            <p className="mt-3 text-teal-300 text-sm">Pago por Yape o Plin</p>
          </div>
        </div>
      </section>
    </div>
  )
}

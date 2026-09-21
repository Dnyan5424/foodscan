import { useState } from 'react'
import { myths } from '../data/content'

export default function MythVsFact() {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const current = myths[index]

  function next() {
    setRevealed(false)
    setIndex((i) => (i + 1) % myths.length)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <p className="text-orange font-semibold text-sm mb-3">Myth vs Fact</p>
      <h1 className="text-3xl font-extrabold mb-10">Question 1 / {myths.length} — {index + 1} / {myths.length}</h1>

      <button
        onClick={() => setRevealed((r) => !r)}
        className="w-full bg-white rounded-card shadow-soft border border-black/5 p-10 mb-6 transition-transform hover:-translate-y-1"
      >
        {!revealed ? (
          <>
            <p className="text-danger font-heading font-bold text-sm mb-3">MYTH ✕</p>
            <p className="text-xl font-heading font-semibold">{current.myth}</p>
            <p className="text-xs text-muted mt-6">Tap to reveal the fact</p>
          </>
        ) : (
          <>
            <p className="text-success font-heading font-bold text-sm mb-3">FACT ✓</p>
            <p className="text-lg leading-relaxed">{current.fact}</p>
          </>
        )}
      </button>

      <button onClick={next} className="rounded-pill bg-forest text-white px-8 py-3 text-sm font-semibold hover:bg-forest-deep transition-colors">
        Next myth
      </button>
    </div>
  )
}

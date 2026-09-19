import { useState } from 'react'
import { quizQuestions } from '../data/content'
import ProgressBar from '../components/ProgressBar'

export default function Quiz() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [finished, setFinished] = useState(false)

  const q = quizQuestions[index]

  function choose(i) {
    if (selected !== null) return
    setSelected(i)
    if (i === q.correctIndex) setScore((s) => s + 1)
  }

  function next() {
    if (index + 1 < quizQuestions.length) {
      setIndex((i) => i + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  function restart() {
    setIndex(0); setScore(0); setSelected(null); setFinished(false)
  }

  if (finished) {
    const pct = Math.round((score / quizQuestions.length) * 100)
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-orange font-semibold text-sm mb-3">Your score</p>
        <h1 className="text-5xl font-extrabold mb-2">{score} / {quizQuestions.length}</h1>
        <p className="text-muted mb-8">
          {pct >= 80 ? 'Excellent food safety awareness!' : pct >= 50 ? 'Good start — a bit more to learn.' : 'Worth a revisit — check the Awareness Hub.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={restart} className="rounded-pill bg-forest text-white px-6 py-3 text-sm font-semibold hover:bg-forest-deep transition-colors">Improve your score</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <p className="text-orange font-semibold text-sm mb-3">Food safety quiz</p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold">Question {index + 1} / {quizQuestions.length}</span>
      </div>
      <ProgressBar value={index + 1} max={quizQuestions.length} />

      <h2 className="text-xl font-heading font-bold my-8">{q.question}</h2>

      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let style = 'bg-white border-black/10 hover:border-forest'
          if (selected !== null) {
            if (i === q.correctIndex) style = 'bg-success/10 border-success'
            else if (i === selected) style = 'bg-danger/10 border-danger'
          }
          return (
            <button
              key={opt}
              onClick={() => choose(i)}
              className={`w-full text-left rounded-2xl border-2 px-5 py-4 text-sm font-medium transition-colors ${style}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <button onClick={next} className="mt-8 w-full rounded-pill bg-forest text-white py-3 text-sm font-semibold hover:bg-forest-deep transition-colors">
          {index + 1 < quizQuestions.length ? 'Next question' : 'See results'}
        </button>
      )}
    </div>
  )
}

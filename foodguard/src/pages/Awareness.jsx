import { Link } from 'react-router-dom'
import { awarenessTopics } from '../data/awarenessTopics'

export default function Awareness() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <p className="text-orange font-semibold text-sm mb-3">Awareness hub</p>
      <h1 className="text-3xl font-extrabold mb-3 max-w-xl">Small knowledge. Big impact.</h1>
      <p className="text-muted max-w-xl mb-10 text-sm leading-relaxed">
        Bite-sized guides on eating well, hygiene, and reading labels — plus a myth-busting section and a quiz to test what you've learned.
      </p>

      <div className="flex gap-3 mb-10">
        <Link to="/awareness/myth-vs-fact" className="rounded-pill bg-charcoal text-white px-6 py-2.5 text-sm font-semibold hover:bg-black transition-colors">Myth vs Fact</Link>
        <Link to="/awareness/quiz" className="rounded-pill bg-orange text-white px-6 py-2.5 text-sm font-semibold hover:bg-orange-gold transition-colors">Take the quiz</Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {awarenessTopics.map((t) => (
          <div key={t.slug} className="bg-white rounded-card shadow-soft border border-black/5 p-6">
            <h3 className="font-heading font-bold text-base mb-2">{t.title}</h3>
            <p className="text-sm text-muted">{t.summary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

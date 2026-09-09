import { govResources } from '../data/govResources'

export default function GovResources() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <p className="text-orange font-semibold text-sm mb-3">Government resources</p>
      <h1 className="text-3xl font-extrabold mb-3">Official food safety resources</h1>
      <p className="text-muted max-w-xl mb-10 text-sm leading-relaxed">
        FoodGuard complements — it does not replace — official enforcement. These are external, official resources.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        {govResources.map((r) => (
          <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="block bg-white rounded-card shadow-soft border border-black/5 p-6 transition-transform hover:-translate-y-1 hover:shadow-lift">
            <h3 className="font-heading font-bold text-base mb-2">{r.name}</h3>
            <p className="text-sm text-muted mb-4">{r.description}</p>
            <span className="text-forest text-sm font-semibold">Visit official website →</span>
          </a>
        ))}
      </div>
    </div>
  )
}

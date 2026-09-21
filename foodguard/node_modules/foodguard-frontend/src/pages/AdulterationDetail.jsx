import { useParams, Link } from 'react-router-dom'
import { adulterationGuides } from '../data/content'

export default function AdulterationDetail() {
  const { slug } = useParams()
  const guide = adulterationGuides.find((g) => g.slug === slug)

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="mb-4">Guide not found.</p>
        <Link to="/adulteration-guide" className="text-forest font-semibold">← Back to all guides</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <Link to="/adulteration-guide" className="text-sm text-forest font-semibold">← All guides</Link>
      <div className="h-48 rounded-card overflow-hidden my-6">
  <img src={guide.image} alt={guide.category} className="h-full w-full object-cover" />
</div>
      <p className="text-orange font-semibold text-sm mb-2">{guide.category}</p>
      <h1 className="text-3xl font-extrabold mb-6">Understanding {guide.category.toLowerCase()} safety</h1>

      <Section title="Common adulterants">
        <ul className="list-disc list-inside space-y-1 text-sm text-charcoal/85">
          {guide.commonAdulterants.map((a) => <li key={a}>{a}</li>)}
        </ul>
      </Section>

      <Section title="Home screening methods">
        <p className="text-xs text-warn font-semibold mb-3">These are indicative screening methods, not definitive proof — use lab testing or official reporting for confirmation.</p>
        <div className="space-y-4">
          {guide.homeScreening.map((h) => (
            <div key={h.title} className="bg-white rounded-2xl border border-black/5 p-4">
              <p className="font-semibold text-sm mb-1">{h.title}</p>
              <p className="text-sm text-muted">{h.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Laboratory testing">
        <p className="text-sm text-charcoal/85">{guide.labTesting}</p>
      </Section>

      <Section title="Health considerations">
        <p className="text-sm text-charcoal/85">{guide.healthImpact}</p>
      </Section>

      <Section title="If you suspect adulteration">
        <p className="text-sm text-charcoal/85 mb-4">
          Stop consuming the product, keep the packaging as evidence, and report it through our complaint register or FSSAI's official Food Safety Connect portal.
        </p>
        <div className="flex gap-3">
          <Link to="/complaints" className="rounded-pill bg-forest text-white px-6 py-2.5 text-sm font-semibold hover:bg-forest-deep transition-colors">Report this</Link>
          <Link to="/resources" className="rounded-pill border border-black/10 px-6 py-2.5 text-sm font-semibold hover:bg-black/5 transition-colors">Official resources</Link>
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading font-bold text-lg mb-3">{title}</h2>
      {children}
    </section>
  )
}

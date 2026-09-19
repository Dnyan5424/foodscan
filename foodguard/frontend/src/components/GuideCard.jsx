import { Link } from 'react-router-dom'

export default function GuideCard({ guide }) {
  return (
    <Link to={`/adulteration-guide/${guide.slug}`} className="group block bg-white rounded-card shadow-soft border border-black/5 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lift">
      <div className="h-36 overflow-hidden">
        <img src={guide.image} alt={guide.category} className="h-full w-full object-cover" />
      </div>
      <div className="p-5">
        <h3 className="font-heading font-bold text-base mb-1">{guide.category}</h3>
        <p className="text-sm text-muted leading-relaxed">{guide.summary}</p>
        <span className="inline-block mt-3 text-xs font-semibold text-forest group-hover:underline">Read the guide</span>
      </div>
    </Link>
  )
}
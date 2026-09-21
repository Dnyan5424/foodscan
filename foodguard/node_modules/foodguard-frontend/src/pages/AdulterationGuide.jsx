import { useState } from 'react'
import { adulterationGuides } from '../data/content'
import GuideCard from '../components/GuideCard'

export default function AdulterationGuide() {
  const [search, setSearch] = useState('')
  const filtered = adulterationGuides.filter((g) => g.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <p className="text-orange font-semibold text-sm mb-3">Adulteration guide</p>
      <h1 className="text-3xl font-extrabold mb-3 max-w-xl">What's really in your food?</h1>
      <p className="text-muted max-w-xl mb-8 text-sm leading-relaxed">
        Learn about common adulteration risks by category, and how simple household screening compares to lab testing.
      </p>

      <input
        type="text"
        placeholder="Search a food category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="rounded-pill border border-black/10 px-4 py-2.5 text-sm w-72 mb-10 focus:border-forest outline-none"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((g) => <GuideCard key={g.slug} guide={g} />)}
      </div>
    </div>
  )
}

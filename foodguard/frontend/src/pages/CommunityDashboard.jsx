const CATEGORY_STATS = [
  { label: 'Adulteration', value: 38 },
  { label: 'Expired Products', value: 24 },
  { label: 'Mislabeling', value: 18 },
  { label: 'Hygiene', value: 14 },
  { label: 'Packaging', value: 6 },
]

export default function CommunityDashboard() {
  const total = CATEGORY_STATS.reduce((s, c) => s + c.value, 0)

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <p className="text-orange font-semibold text-sm mb-3">Community insights</p>
      <h1 className="text-3xl font-extrabold mb-10">Understanding our food safety community</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatBox label="Total Reports" value="1,204" />
        <StatBox label="Resolved" value="892" />
        <StatBox label="Active" value="312" />
        <StatBox label="Top Issue" value="Adulteration" />
      </div>

      <div className="bg-white rounded-card shadow-soft border border-black/5 p-8">
        <h2 className="font-heading font-bold text-lg mb-6">Complaints by category</h2>
        <div className="space-y-4">
          {CATEGORY_STATS.map((c) => (
            <div key={c.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{c.label}</span>
                <span className="text-muted">{c.value}%</span>
              </div>
              <div className="h-2.5 bg-sage rounded-pill overflow-hidden">
                <div className="h-full bg-forest rounded-pill" style={{ width: `${(c.value / total) * 100 * (100 / 38)}%`, maxWidth: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="bg-white rounded-card shadow-soft border border-black/5 p-5 text-center">
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  )
}

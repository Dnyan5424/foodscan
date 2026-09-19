export default function Admin() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <p className="text-orange font-semibold text-sm mb-3">Admin</p>
      <h1 className="text-3xl font-extrabold mb-4">Administration</h1>
      <p className="text-muted max-w-xl mb-8 text-sm leading-relaxed">
        Review, moderation, and operational tools are configured for authorized staff only.
        This view is intentionally free of sample or placeholder data.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'Complaints', text: 'Pending reports and escalations are managed here.' },
          { title: 'Content', text: 'Safety guides and awareness material are reviewed before publishing.' },
          { title: 'Access', text: 'User permissions and admin controls are restricted to approved roles.' },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-card shadow-soft border border-black/5 p-6">
            <h2 className="font-heading font-bold text-lg mb-2">{item.title}</h2>
            <p className="text-sm text-muted leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
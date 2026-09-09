export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="text-center py-16 px-6 border-2 border-dashed border-black/10 rounded-card">
      <h3 className="font-heading font-bold text-lg mb-2">{title}</h3>
      <p className="text-muted text-sm max-w-sm mx-auto mb-6">{description}</p>
      {actionLabel && (
        <button onClick={onAction} className="rounded-pill bg-forest text-white px-6 py-3 text-sm font-semibold hover:bg-forest-deep transition-colors">
          {actionLabel}
        </button>
      )}
    </div>
  )
}

import StatusBadge from './StatusBadge'

function getStatus(daysLeft) {
  if (daysLeft < 0) return 'expired'
  if (daysLeft <= 3) return 'expiring'
  return 'safe'
}

export default function ProductCard({ product, onEdit, onDelete }) {
  const daysLeft = Math.ceil((new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
  const status = getStatus(daysLeft)
  const daysLabel = daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} ago`
    : daysLeft === 0 ? 'Expires today'
    : `Expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`

  return (
    <div className="bg-white rounded-card shadow-soft border border-black/5 p-5 flex flex-col gap-3 transition-transform hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading font-bold text-base">{product.name}</h3>
          <p className="text-xs text-muted">{product.category} · Qty {product.quantity}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <p className="text-sm text-charcoal/80">{daysLabel}</p>
      <div className="flex gap-2 mt-1">
        <button onClick={() => onEdit(product)} className="text-xs font-semibold px-3 py-1.5 rounded-pill bg-sage text-forest-deep hover:bg-forest hover:text-white transition-colors">
          Edit
        </button>
        <button onClick={() => onDelete(product.id)} className="text-xs font-semibold px-3 py-1.5 rounded-pill bg-danger/10 text-danger hover:bg-danger hover:text-white transition-colors">
          Delete
        </button>
      </div>
    </div>
  )
}

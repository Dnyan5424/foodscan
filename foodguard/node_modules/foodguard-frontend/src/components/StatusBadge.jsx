// Always combines color + icon + text (never color alone) for accessibility.
const STATUS_MAP = {
  safe: { label: 'Safe', color: 'bg-success/10 text-success', icon: '\u2713' },
  expiring: { label: 'Expiring Soon', color: 'bg-warn/10 text-warn', icon: '\u26A0' },
  expired: { label: 'Expired', color: 'bg-danger/10 text-danger', icon: '\u2715' },
  submitted: { label: 'Submitted', color: 'bg-muted/10 text-muted', icon: '\u25CF' },
  review: { label: 'Under Review', color: 'bg-orange/10 text-orange', icon: '\u25CF' },
  investigation: { label: 'Investigation', color: 'bg-orange-gold/10 text-orange-gold', icon: '\u25CF' },
  action: { label: 'Action Taken', color: 'bg-forest/10 text-forest', icon: '\u25CF' },
  resolved: { label: 'Resolved', color: 'bg-success/10 text-success', icon: '\u2713' },
}

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.submitted
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-semibold ${s.color}`}>
      <span aria-hidden="true">{s.icon}</span>
      {s.label}
    </span>
  )
}

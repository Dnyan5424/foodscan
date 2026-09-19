const STEPS = ['submitted', 'review', 'investigation', 'action', 'resolved']
const LABELS = { submitted: 'Submitted', review: 'Under Review', investigation: 'Investigation', action: 'Action Taken', resolved: 'Resolved' }

export default function Timeline({ currentStatus }) {
  const currentIndex = STEPS.indexOf(currentStatus)
  return (
    <ol className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
      {STEPS.map((step, i) => (
        <li key={step} className="flex md:flex-1 items-center">
          <div className="flex items-center gap-3 md:flex-col md:gap-2 md:text-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i <= currentIndex ? 'bg-forest text-white' : 'bg-sage text-forest-deep/50'
              }`}
              aria-current={i === currentIndex ? 'step' : undefined}
            >
              {i < currentIndex ? '\u2713' : i + 1}
            </div>
            <span className={`text-xs font-medium ${i <= currentIndex ? 'text-charcoal' : 'text-muted'}`}>{LABELS[step]}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`hidden md:block flex-1 h-0.5 mx-2 ${i < currentIndex ? 'bg-forest' : 'bg-sage'}`} />
          )}
        </li>
      ))}
    </ol>
  )
}

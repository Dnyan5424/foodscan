export default function Card({ children, className = '', hoverLift = true }) {
  return (
    <div
      className={`bg-white rounded-card shadow-soft border border-black/5 p-6 ${
        hoverLift ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

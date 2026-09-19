export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center gap-2 rounded-pill px-6 py-3 font-heading font-semibold text-sm transition-all duration-200 active:scale-[0.97]'
  const variants = {
    primary: 'bg-forest text-white hover:bg-forest-deep hover:shadow-lift',
    secondary: 'bg-transparent border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white',
    ghost: 'bg-sage text-forest-deep hover:bg-forest hover:text-white',
    danger: 'bg-danger text-white hover:opacity-90',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

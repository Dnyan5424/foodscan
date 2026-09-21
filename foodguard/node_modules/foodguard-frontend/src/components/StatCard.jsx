import { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const start = performance.now()
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          setValue(Math.floor(progress * target))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        obs.disconnect()
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])
  return [ref, value]
}

export default function StatCard({ value, suffix = '', label }) {
  const [ref, count] = useCountUp(value)
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-heading font-extrabold text-charcoal">
        {count.toLocaleString()}<span className="text-orange">{suffix}</span>
      </div>
      <div className="mt-2 text-sm tracking-wide text-muted">{label}</div>
    </div>
  )
}

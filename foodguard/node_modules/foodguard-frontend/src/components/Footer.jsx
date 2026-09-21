import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="font-heading font-extrabold text-xl mb-2">FoodGuard</div>
          <p className="text-white/60 text-sm leading-relaxed">Know Your Food.<br/>Protect Your Health.</p>
        </div>
        <FooterCol title="Platform" links={[
          ['Expiry Tracker', '/expiry-tracker'],
          ['Complaints', '/complaints'],
          ['Adulteration Guide', '/adulteration-guide'],
          ['Awareness', '/awareness'],
          ['AI Assistant', '/assistant'],
        ]} />
        <FooterCol title="Resources" links={[
          ['Government Resources', '/resources'],
          ['Community Insights', '/community'],
        ]} />
        <FooterCol title="Company" links={[
          ['About', '/about'],
          ['Profile', '/profile'],
        ]} />
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © 2026 FoodGuard — Built for safer food choices.
      </div>
    </footer>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="font-heading font-semibold text-sm mb-3 text-white/90">{title}</div>
      <ul className="space-y-2">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="text-white/60 hover:text-white text-sm transition-colors">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

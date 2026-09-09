import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/expiry-tracker', label: 'Expiry Tracker' },
  { to: '/adulteration-guide', label: 'Adulteration' },
  { to: '/complaints', label: 'Complaints' },
  { to: '/awareness', label: 'Awareness' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleAuthClick() {
    if (user) {
      logout()
      navigate('/')
    } else {
      navigate('/login')
    }
  }

  return (
    <header className="sticky top-4 z-50 px-4">
      <nav className="mx-auto max-w-6xl bg-charcoal text-white rounded-pill shadow-lift px-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading font-extrabold text-lg">
          <LeafShieldMark />
          FoodGuard
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-pill text-sm font-medium transition-colors ${
                  isActive ? 'bg-forest text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/assistant" className="px-4 py-2 rounded-pill text-sm font-medium text-white/80 hover:text-white hover:bg-white/10">
            AI Assistant
          </Link>
          {user && (
            <Link to="/profile" className="px-4 py-2 rounded-pill text-sm font-medium text-white/80 hover:text-white hover:bg-white/10">
              Dashboard
            </Link>
          )}
          <button onClick={handleAuthClick} className="px-4 py-2 rounded-pill text-sm font-semibold bg-orange text-white hover:bg-orange-gold transition-colors">
            {user ? `Log out (${user.name.split(' ')[0]})` : 'Log in'}
          </button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className="block w-6 h-0.5 bg-white mb-1.5" />
          <span className="block w-6 h-0.5 bg-white mb-1.5" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>
      </nav>

      {open && (
        <div className="md:hidden mx-auto max-w-6xl mt-2 bg-charcoal text-white rounded-3xl shadow-lift p-4 flex flex-col gap-1">
          {[...LINKS, { to: '/assistant', label: 'AI Assistant' }, { to: '/profile', label: 'Dashboard' }].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium ${isActive ? 'bg-forest text-white' : 'text-white/80 hover:bg-white/10'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}

function LeafShieldMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path d="M13 2 L23 6 V13 C23 19 18.5 23 13 24 C7.5 23 3 19 3 13 V6 Z" fill="#3F7D4A" />
      <path d="M9 14 C9 10 12 8 16 8 C16 12 14 15 9 14 Z" fill="#E69A32" />
    </svg>
  )
}

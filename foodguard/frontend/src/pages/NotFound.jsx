import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <h1 className="text-3xl font-extrabold mb-3">Page not found</h1>
      <p className="text-muted mb-6">The page you're looking for doesn't exist yet.</p>
      <Link to="/" className="rounded-pill bg-forest text-white px-6 py-3 text-sm font-semibold hover:bg-forest-deep transition-colors">Back home</Link>
    </div>
  )
}

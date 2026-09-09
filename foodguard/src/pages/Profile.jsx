import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-forest text-white flex items-center justify-center font-heading font-bold text-xl">
          {user.name?.[0]?.toUpperCase() || '?'}
        </div>

        <div>
          <h1 className="font-heading font-bold text-xl">
            {user.name}
          </h1>

          <p className="text-muted text-sm">
            {user.email}
            {user.location ? ` · ${user.location}` : ''}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          to="/expiry-tracker"
          className="bg-white rounded-card shadow-soft border border-black/5 p-6 hover:shadow-lift transition-shadow"
        >
          <h3 className="font-heading font-bold text-base mb-1">
            My Products
          </h3>
          <p className="text-sm text-muted">
            View and manage tracked food items.
          </p>
        </Link>

        <Link
          to="/complaints"
          className="bg-white rounded-card shadow-soft border border-black/5 p-6 hover:shadow-lift transition-shadow"
        >
          <h3 className="font-heading font-bold text-base mb-1">
            My Complaints
          </h3>
          <p className="text-sm text-muted">
            Track the status of reports you've filed.
          </p>
        </Link>

        <Link
          to="/awareness/quiz"
          className="bg-white rounded-card shadow-soft border border-black/5 p-6 hover:shadow-lift transition-shadow"
        >
          <h3 className="font-heading font-bold text-base mb-1">
            Quiz Performance
          </h3>
          <p className="text-sm text-muted">
            See your food safety quiz history and scores.
          </p>
        </Link>

        <Link
          to="/adulteration-guide"
          className="bg-white rounded-card shadow-soft border border-black/5 p-6 hover:shadow-lift transition-shadow"
        >
          <h3 className="font-heading font-bold text-base mb-1">
            Saved Guides
          </h3>
          <p className="text-sm text-muted">
            Adulteration guides you've bookmarked.
          </p>
        </Link>
      </div>
    </div>
  )
}
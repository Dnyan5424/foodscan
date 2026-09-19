import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signup(form)
      navigate('/profile')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="text-2xl font-extrabold mb-6">Create an account</h1>
      {error && <p className="text-danger text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Field label="Password" type="password" required value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
        <Field label="Location (optional)" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
        <button disabled={submitting} className="w-full rounded-pill bg-forest text-white font-semibold py-3 text-sm hover:bg-forest-deep transition-colors disabled:opacity-60">
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
      <p className="text-sm text-muted mt-6">
        Already have an account? <Link to="/login" className="text-forest font-semibold">Log in</Link>
      </p>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted mb-1 block">{label}</span>
      <input {...props} value={props.value} onChange={(e) => props.onChange(e.target.value)} className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm focus:border-forest outline-none" />
    </label>
  )
}

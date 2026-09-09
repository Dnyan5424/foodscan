import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

const STORAGE_KEY = 'foodguard_products_demo'

const SEED = [
  { id: 1, name: 'Milk', category: 'Dairy', quantity: 1, expiryDate: addDays(2) },
  { id: 2, name: 'Bread', category: 'Bakery', quantity: 1, expiryDate: addDays(5) },
  { id: 3, name: 'Cooking Oil', category: 'Oil', quantity: 1, expiryDate: addDays(-3) },
]

function addDays(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export default function ExpiryTracker() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [offline, setOffline] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const toast = useToast()

  useEffect(() => {
    loadProducts()
  }, [user])

  async function loadProducts() {
    if (user) {
      try {
        const data = await api.getProducts()
        setProducts(data.map((p) => ({ ...p, id: p._id, expiryDate: p.expiryDate?.slice(0, 10) })))
        setOffline(false)
        return
      } catch (err) {
        // fall through to local demo mode
      }
    }
    setOffline(true)
    const saved = localStorage.getItem(STORAGE_KEY)
    setProducts(saved ? JSON.parse(saved) : SEED)
  }

  useEffect(() => {
    if (offline && products.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products, offline])

  const daysLeft = (p) => Math.ceil((new Date(p.expiryDate) - new Date()) / 86400000)
  const counts = {
    safe: products.filter((p) => daysLeft(p) > 3).length,
    expiring: products.filter((p) => daysLeft(p) >= 0 && daysLeft(p) <= 3).length,
    expired: products.filter((p) => daysLeft(p) < 0).length,
  }

  const categories = ['all', ...new Set(products.map((p) => p.category).filter(Boolean))]
  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => categoryFilter === 'all' || p.category === categoryFilter)

  async function handleSave(product) {
    try {
      if (!offline && user) {
        if (product.id) {
          const updated = await api.updateProduct(product.id, product)
          setProducts((ps) => ps.map((p) => (p.id === product.id ? { ...updated, id: updated._id, expiryDate: updated.expiryDate?.slice(0, 10) } : p)))
        } else {
          const created = await api.createProduct(product)
          setProducts((ps) => [...ps, { ...created, id: created._id, expiryDate: created.expiryDate?.slice(0, 10) }])
        }
      } else {
        if (product.id) {
          setProducts((ps) => ps.map((p) => (p.id === product.id ? product : p)))
        } else {
          setProducts((ps) => [...ps, { ...product, id: Date.now() }])
        }
      }
      toast?.(product.id ? 'Product updated successfully' : 'Product added successfully')
    } catch (err) {
      toast?.(err.message, 'error')
    }
    setShowForm(false)
    setEditing(null)
  }

  async function handleDelete(id) {
    try {
      if (!offline && user) await api.deleteProduct(id)
      setProducts((ps) => ps.filter((p) => p.id !== id))
      toast?.('Product removed')
    } catch (err) {
      toast?.(err.message, 'error')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-extrabold mb-1">Your food inventory</h1>
      <p className="text-muted mb-8 text-sm">
        {offline
          ? (user ? "Couldn't reach the API — showing local demo data." : <>Demo mode — <Link to="/login" className="text-forest font-semibold">log in</Link> to sync with your account.</>)
          : 'Synced with your account.'}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatBox label="Safe" value={counts.safe} colorClass="text-success" />
        <StatBox label="Expiring Soon" value={counts.expiring} colorClass="text-warn" />
        <StatBox label="Expired" value={counts.expired} colorClass="text-danger" />
        <StatBox label="Total Items" value={products.length} colorClass="text-charcoal" />
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-8">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-pill border border-black/10 px-4 py-2.5 text-sm w-56 focus:border-forest outline-none"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-pill border border-black/10 px-4 py-2.5 text-sm focus:border-forest outline-none"
          >
            {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>)}
          </select>
        </div>
        <div className="flex gap-3">
          <Link to="/expiry-tracker/scan" className="rounded-pill bg-sage text-forest-deep px-6 py-3 text-sm font-semibold hover:bg-forest hover:text-white transition-colors flex items-center">
            Scan product
          </Link>
          <Button variant="secondary" onClick={() => { setEditing(null); setShowForm(true) }}>+ Add food</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No food products yet."
          description="Start tracking your groceries and never miss an expiry date."
          actionLabel="Add your first product"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onEdit={(prod) => { setEditing(prod); setShowForm(true) }} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showForm && (
        <ProductForm
          initial={editing}
          onCancel={() => { setShowForm(false); setEditing(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function StatBox({ label, value, colorClass }) {
  return (
    <div className="bg-white rounded-card shadow-soft border border-black/5 p-5 text-center">
      <div className={`text-3xl font-extrabold ${colorClass}`}>{value}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </div>
  )
}

function ProductForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState(initial || { name: '', category: '', quantity: 1, expiryDate: '' })

  return (
    <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(form) }}
        className="bg-white rounded-card p-8 w-full max-w-md shadow-lift"
      >
        <h2 className="font-heading font-bold text-lg mb-5">{initial ? 'Edit product' : 'Add a food product'}</h2>
        <div className="space-y-4">
          <Field label="Product name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Category" required value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <Field label="Quantity" type="number" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} />
          <Field label="Expiry date" type="date" required value={form.expiryDate} onChange={(v) => setForm({ ...form, expiryDate: v })} />
        </div>
        <div className="flex gap-3 mt-6">
          <button type="submit" className="flex-1 rounded-pill bg-forest text-white font-semibold py-3 text-sm hover:bg-forest-deep transition-colors">
            {initial ? 'Save changes' : 'Add product'}
          </button>
          <button type="button" onClick={onCancel} className="flex-1 rounded-pill border border-black/10 font-semibold py-3 text-sm hover:bg-black/5 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted mb-1 block">{label}</span>
      <input
        {...props}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm focus:border-forest outline-none"
      />
    </label>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

const STORAGE_KEY = 'foodguard_products_demo'

const SEED = [
  {
    id: 1,
    name: 'Milk',
    category: 'Dairy',
    quantity: 1,
    expiryDate: addDays(2),
  },
  {
    id: 2,
    name: 'Bread',
    category: 'Bakery',
    quantity: 1,
    expiryDate: addDays(5),
  },
  {
    id: 3,
    name: 'Cooking Oil',
    category: 'Oil',
    quantity: 1,
    expiryDate: addDays(-3),
  },
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
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('expiry')
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

        setProducts(
          data.map((p) => ({
            ...p,
            id: p._id,
            expiryDate: p.expiryDate?.slice(0, 10),
          }))
        )

        setOffline(false)
        return
      } catch (err) {
        // fallback to local mode
      }
    }

    setOffline(true)

    const saved = localStorage.getItem(STORAGE_KEY)

    setProducts(saved ? JSON.parse(saved) : SEED)
  }

  useEffect(() => {
    if (offline) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    }
  }, [products, offline])

  const daysLeft = (product) => {
    if (!product.expiryDate) return 9999

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const expiry = new Date(product.expiryDate)
    expiry.setHours(0, 0, 0, 0)

    return Math.ceil((expiry - today) / 86400000)
  }

  const getStatus = (product) => {
    const days = daysLeft(product)

    if (days < 0) return 'expired'
    if (days <= 3) return 'expiring'
    return 'safe'
  }

  const counts = {
    safe: products.filter((p) => getStatus(p) === 'safe').length,
    expiring: products.filter((p) => getStatus(p) === 'expiring').length,
    expired: products.filter((p) => getStatus(p) === 'expired').length,
    total: products.length,
  }

  const categories = [
    'all',
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ]

  const filtered = useMemo(() => {
    let result = [...products]

    // Search
    result = result.filter((p) =>
      `${p.name} ${p.category || ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )

    // Category
    if (categoryFilter !== 'all') {
      result = result.filter(
        (p) => p.category === categoryFilter
      )
    }

    // Status
    if (statusFilter !== 'all') {
      result = result.filter(
        (p) => getStatus(p) === statusFilter
      )
    }

    // Sorting
    if (sortBy === 'expiry') {
      result.sort(
        (a, b) =>
          new Date(a.expiryDate) -
          new Date(b.expiryDate)
      )
    }

    if (sortBy === 'name') {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    }

    if (sortBy === 'category') {
      result.sort((a, b) =>
        (a.category || '').localeCompare(
          b.category || ''
        )
      )
    }

    return result
  }, [
    products,
    search,
    categoryFilter,
    statusFilter,
    sortBy,
  ])

  async function handleSave(product) {
    try {
      if (!offline && user) {
        if (product.id) {
          const updated = await api.updateProduct(
            product.id,
            product
          )

          setProducts((ps) =>
            ps.map((p) =>
              p.id === product.id
                ? {
                    ...updated,
                    id: updated._id,
                    expiryDate:
                      updated.expiryDate?.slice(0, 10),
                  }
                : p
            )
          )
        } else {
          const created = await api.createProduct(product)

          setProducts((ps) => [
            ...ps,
            {
              ...created,
              id: created._id,
              expiryDate:
                created.expiryDate?.slice(0, 10),
            },
          ])
        }
      } else {
        if (product.id) {
          setProducts((ps) =>
            ps.map((p) =>
              p.id === product.id ? product : p
            )
          )
        } else {
          setProducts((ps) => [
            ...ps,
            {
              ...product,
              id: Date.now(),
            },
          ])
        }
      }

      toast?.(
        product.id
          ? 'Product updated successfully'
          : 'Product added successfully'
      )
    } catch (err) {
      toast?.(err.message, 'error')
    }

    setShowForm(false)
    setEditing(null)
  }

  async function handleDelete(id) {
    try {
      if (!offline && user) {
        await api.deleteProduct(id)
      }

      setProducts((ps) =>
        ps.filter((p) => p.id !== id)
      )

      toast?.('Product removed')
    } catch (err) {
      toast?.(err.message, 'error')
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f6]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute -top-32 -right-24 w-96 h-96 bg-orange/10 rounded-full blur-3xl" />

        <div className="absolute top-48 -left-32 w-80 h-80 bg-green-100/30 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-10">

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-black/5 shadow-sm px-4 py-2 mb-5">

                <span>📅</span>

                <span className="text-xs font-bold">
                  FOODGUARD EXPIRY TRACKER
                </span>

              </div>

              <p className="text-orange font-bold text-sm uppercase tracking-widest mb-2">
                Your smart pantry
              </p>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Never miss an expiry.
              </h1>

              <p className="text-muted max-w-2xl mt-4 text-sm md:text-base leading-relaxed">
                Keep track of your groceries, discover what needs
                attention, and reduce unnecessary food waste.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">

                <Link
                  to="/expiry-tracker/scan"
                  className="rounded-full bg-orange text-white px-6 py-3 text-sm font-bold shadow-lg hover:-translate-y-1 transition-all"
                >
                  📷 Scan Product
                </Link>

                <Link
                  to="/expiry-tracker/scan-barcode"
                  className="rounded-full bg-white border border-orange text-orange px-6 py-3 text-sm font-bold hover:bg-orange hover:text-white transition-colors"
                >
                  ▦ Scan Barcode
                </Link>

                <button
                  onClick={() => {
                    setEditing(null)
                    setShowForm(true)
                  }}
                  className="rounded-full bg-charcoal text-white px-6 py-3 text-sm font-bold hover:bg-black transition-colors"
                >
                  + Add Food
                </button>

              </div>

            </div>


            {/* Pantry visual */}

            <div className="hidden md:flex relative w-56 h-40 rounded-3xl bg-white/80 backdrop-blur-xl border border-black/5 shadow-xl items-center justify-center">

              <div className="text-center">

                <div className="text-5xl mb-2">
                  🥫
                </div>

                <p className="font-extrabold">
                  {products.length}
                </p>

                <p className="text-xs text-muted">
                  items tracked
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATUS CARDS
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-6 mb-10">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <StatusCard
            icon="🟢"
            label="Safe"
            value={counts.safe}
            description="More than 3 days"
            active={statusFilter === 'safe'}
            onClick={() =>
              setStatusFilter(
                statusFilter === 'safe'
                  ? 'all'
                  : 'safe'
              )
            }
          />

          <StatusCard
            icon="🟠"
            label="Expiring Soon"
            value={counts.expiring}
            description="Within 3 days"
            active={statusFilter === 'expiring'}
            onClick={() =>
              setStatusFilter(
                statusFilter === 'expiring'
                  ? 'all'
                  : 'expiring'
              )
            }
          />

          <StatusCard
            icon="🔴"
            label="Expired"
            value={counts.expired}
            description="Needs attention"
            active={statusFilter === 'expired'}
            onClick={() =>
              setStatusFilter(
                statusFilter === 'expired'
                  ? 'all'
                  : 'expired'
              )
            }
          />

          <StatusCard
            icon="📦"
            label="Total Items"
            value={counts.total}
            description="In your inventory"
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          />

        </div>

      </section>


      {/* =====================================================
          SMART ALERT
      ===================================================== */}

      {counts.expiring > 0 && (

        <section className="max-w-6xl mx-auto px-6 mb-8">

          <div className="relative overflow-hidden rounded-3xl bg-orange/10 border border-orange/20 p-6">

            <div className="flex items-start gap-4">

              <div className="w-11 h-11 rounded-2xl bg-orange text-white flex items-center justify-center text-xl shrink-0">
                ⚡
              </div>

              <div>

                <h3 className="font-extrabold">
                  {counts.expiring} item
                  {counts.expiring > 1 ? 's are' : ' is'} expiring soon
                </h3>

                <p className="text-sm text-muted mt-1">
                  Check your inventory and consider using these
                  products first to reduce food waste.
                </p>

              </div>

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          OFFLINE STATUS
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-6 mb-7">

        <div className="flex items-center gap-2 text-xs">

          <span
            className={`w-2 h-2 rounded-full ${
              offline
                ? 'bg-orange'
                : 'bg-green-500'
            }`}
          />

          <span className="text-muted">

            {offline
              ? user
                ? "Couldn't reach the API — using local storage."
                : (
                  <>
                    Demo mode —{' '}
                    <Link
                      to="/login"
                      className="text-forest font-semibold"
                    >
                      log in
                    </Link>{' '}
                    to sync your inventory.
                  </>
                )
              : 'Inventory synced with your account.'}

          </span>

        </div>

      </section>


      {/* =====================================================
          SEARCH + FILTERS
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-6 mb-8">

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-black/5 shadow-soft p-4">

          <div className="flex flex-col lg:flex-row gap-3">

            {/* Search */}

            <div className="relative flex-1">

              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search your food..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-2xl bg-black/[0.03] border border-black/5 pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange/20"
              />

            </div>


            {/* Category */}

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              className="rounded-2xl bg-black/[0.03] border border-black/5 px-4 py-3 text-sm outline-none"
            >

              {categories.map((category) => (

                <option
                  key={category}
                  value={category}
                >
                  {category === 'all'
                    ? 'All categories'
                    : category}
                </option>

              ))}

            </select>


            {/* Sort */}

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="rounded-2xl bg-black/[0.03] border border-black/5 px-4 py-3 text-sm outline-none"
            >

              <option value="expiry">
                Expiry date
              </option>

              <option value="name">
                Name
              </option>

              <option value="category">
                Category
              </option>

            </select>

          </div>


          {/* Active filter */}

          {statusFilter !== 'all' && (

            <div className="flex items-center gap-2 mt-3">

              <span className="text-xs text-muted">
                Showing:
              </span>

              <button
                onClick={() => setStatusFilter('all')}
                className="rounded-full bg-orange/10 text-orange px-3 py-1.5 text-xs font-bold"
              >
                {statusFilter}
                <span className="ml-2">
                  ×
                </span>
              </button>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          INVENTORY
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-6 pb-16">

        <div className="flex items-end justify-between mb-6">

          <div>

            <p className="text-orange text-xs font-bold uppercase tracking-widest mb-1">
              My Inventory
            </p>

            <h2 className="text-2xl font-extrabold">
              Your food
            </h2>

          </div>

          <span className="text-xs text-muted">
            {filtered.length} item
            {filtered.length !== 1 ? 's' : ''}
          </span>

        </div>


        {filtered.length === 0 ? (

          <EmptyState
            title="No food products found."
            description="Try another search or add a product to start tracking your groceries."
            actionLabel="Add food"
            onAction={() => {
              setEditing(null)
              setShowForm(true)
            }}
          />

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {filtered.map((product) => (

              <div
                key={product.id}
                className="relative group"
              >

                {/* Status strip */}

                <div
                  className={`absolute left-0 top-5 bottom-5 w-1 rounded-full ${
                    getStatus(product) === 'expired'
                      ? 'bg-red-500'
                      : getStatus(product) === 'expiring'
                      ? 'bg-orange'
                      : 'bg-green-500'
                  }`}
                />

                <ProductCard
                  product={product}
                  onEdit={(prod) => {
                    setEditing(prod)
                    setShowForm(true)
                  }}
                  onDelete={handleDelete}
                />

              </div>

            ))}

          </div>

        )}

      </section>


      {/* =====================================================
          FOOD SAVING TIP
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-6 pb-20">

        <div className="rounded-3xl bg-charcoal text-white p-7 md:p-9">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div className="flex gap-4">

              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shrink-0">
                💡
              </div>

              <div>

                <p className="text-orange text-xs font-bold uppercase tracking-widest mb-2">
                  Smart Food Habit
                </p>

                <h3 className="font-extrabold text-lg">
                  Follow the "First Expire, First Use" rule.
                </h3>

                <p className="text-white/60 text-sm mt-2 max-w-2xl">
                  Place foods with the closest expiry dates where
                  they are easy to see and use them before newer items.
                </p>

              </div>

            </div>

            <Link
              to="/awareness"
              className="rounded-full bg-white text-charcoal px-5 py-3 text-sm font-bold hover:bg-orange hover:text-white transition-colors whitespace-nowrap"
            >
              Learn more →
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          FORM
      ===================================================== */}

      {showForm && (

        <ProductForm
          initial={editing}
          onCancel={() => {
            setShowForm(false)
            setEditing(null)
          }}
          onSave={handleSave}
        />

      )}

    </main>
  )
}


/* ============================================================
   STATUS CARD
============================================================ */

function StatusCard({
  icon,
  label,
  value,
  description,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left bg-white rounded-3xl border p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lg ${
        active
          ? 'border-orange/40 ring-2 ring-orange/10'
          : 'border-black/5'
      }`}
    >

      <div className="flex items-center justify-between">

        <span className="text-2xl">
          {icon}
        </span>

        {active && (
          <span className="text-[10px] font-bold text-orange">
            ACTIVE
          </span>
        )}

      </div>

      <div className="text-3xl font-extrabold mt-3">
        {value}
      </div>

      <div className="text-sm font-bold mt-1">
        {label}
      </div>

      <div className="text-[11px] text-muted mt-1">
        {description}
      </div>

    </button>
  )
}


/* ============================================================
   PRODUCT FORM
============================================================ */

function ProductForm({
  initial,
  onCancel,
  onSave,
}) {
  const [form, setForm] = useState(
    initial || {
      name: '',
      category: '',
      quantity: 1,
      expiryDate: '',
    }
  )

  return (

    <div
      className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
    >

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave(form)
        }}
        className="bg-white rounded-3xl p-7 md:p-8 w-full max-w-md shadow-2xl"
      >

        <div className="flex items-center justify-between mb-6">

          <div>

            <p className="text-orange text-xs font-bold uppercase tracking-widest">
              Inventory
            </p>

            <h2 className="font-extrabold text-xl mt-1">
              {initial
                ? 'Edit product'
                : 'Add food'}
            </h2>

          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
          >
            ×
          </button>

        </div>


        <div className="space-y-4">

          <Field
            label="Product name"
            required
            value={form.name}
            placeholder="e.g. Milk"
            onChange={(v) =>
              setForm({
                ...form,
                name: v,
              })
            }
          />

          <Field
            label="Category"
            required
            value={form.category}
            placeholder="e.g. Dairy"
            onChange={(v) =>
              setForm({
                ...form,
                category: v,
              })
            }
          />

          <Field
            label="Quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={(v) =>
              setForm({
                ...form,
                quantity: v,
              })
            }
          />

          <Field
            label="Expiry date"
            type="date"
            required
            value={form.expiryDate}
            onChange={(v) =>
              setForm({
                ...form,
                expiryDate: v,
              })
            }
          />

        </div>


        <div className="flex gap-3 mt-7">

          <button
            type="submit"
            className="flex-1 rounded-full bg-orange text-white font-bold py-3 text-sm hover:bg-orange-gold transition-colors"
          >
            {initial
              ? 'Save changes'
              : 'Add product'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-black/10 font-bold py-3 text-sm hover:bg-black/5 transition-colors"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>

  )
}


/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  ...props
}) {
  return (

    <label className="block">

      <span className="text-xs font-bold text-muted mb-1.5 block">
        {label}
      </span>

      <input
        {...props}
        value={props.value ?? ''}
        onChange={(e) =>
          props.onChange(e.target.value)
        }
        className="w-full rounded-2xl bg-black/[0.03] border border-black/10 px-4 py-3 text-sm focus:border-orange focus:ring-2 focus:ring-orange/10 outline-none transition-all"
      />

    </label>

  )
}
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Timeline from '../components/Timeline'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

const STORAGE_KEY = 'foodguard_complaints_demo'

const ISSUE_TYPES = [
  'Food Adulteration',
  'Expired Product Sold',
  'Mislabeling',
  'Unhygienic Premises',
  'Packaging Issue',
  'False Information',
  'Other',
]

const FSSAI_URL =
  'https://foscos.fssai.gov.in/consumergrievance'

export default function Complaints() {
  const { user } = useAuth()

  const [complaints, setComplaints] = useState([])
  const [offline, setOffline] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [lastId, setLastId] = useState(null)

  const toast = useToast()

  useEffect(() => {
    load()
  }, [user])

  async function load() {
    if (user) {
      try {
        const data = await api.getComplaints()

        setComplaints(
          data.map((c) => ({
            ...c,
            id: c._id,
          }))
        )

        setOffline(false)
        return
      } catch (err) {
        console.warn('Could not load complaints from server:', err)
      }
    }

    // Demo / offline mode
    setOffline(true)

    try {
      const saved = localStorage.getItem(STORAGE_KEY)

      if (saved) {
        setComplaints(JSON.parse(saved))
      } else {
        setComplaints([])
      }
    } catch (err) {
      console.warn('Could not read local complaints:', err)
      setComplaints([])
    }
  }

  useEffect(() => {
    if (offline) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(complaints)
      )
    }
  }, [complaints, offline])

  async function handleSubmit(form) {
    try {
      if (!offline && user) {
        // Real backend mode
        const created = await api.createComplaint(form)

        const complaint = {
          ...created,
          id: created._id,
        }

        setComplaints((current) => [
          complaint,
          ...current,
        ])

        setLastId(created.trackingId)
      } else {
        // Demo / offline mode
        const year = new Date().getFullYear()

        const trackingId =
          `FS-${year}-${String(
            complaints.length + 1
          ).padStart(6, '0')}`

        const complaint = {
          ...form,
          id: Date.now(),
          trackingId,
          status: 'submitted',
          date: new Date()
            .toISOString()
            .slice(0, 10),
        }

        setComplaints((current) => [
          complaint,
          ...current,
        ])

        setLastId(trackingId)
      }

      setShowForm(false)

      toast?.(
        'Complaint recorded successfully'
      )
    } catch (err) {
      toast?.(
        err?.message ||
          'Unable to submit complaint',
        'error'
      )
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* HERO */}
        <section className="grid lg:grid-cols-[1.15fr_.85fr] gap-8 items-stretch mb-10">

          {/* LEFT */}
          <div className="rounded-[28px] bg-white border border-black/5 shadow-soft p-7 sm:p-10">

            <div className="inline-flex items-center gap-2 rounded-pill bg-orange/10 text-orange px-4 py-2 text-xs font-bold mb-5">
              <span>🛡️</span>
              <span>Food Safety Reporting</span>
            </div>

            <p className="text-orange font-semibold text-sm mb-3">
              Make food safety count
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
              Report unsafe food practices.
            </h1>

            <p className="text-muted max-w-2xl text-sm sm:text-base leading-relaxed mb-7">
              Record the details of a food-safety issue in
              FoodGuard and keep your own tracking record.
              For official regulatory complaints, use the
              Government of India's FSSAI Food Safety Connect
              portal.
            </p>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={() => setShowForm(true)}
                className="rounded-pill bg-forest text-white px-6 py-3 text-sm font-semibold hover:bg-forest-deep transition-all hover:-translate-y-0.5"
              >
                📝 Record a complaint
              </button>

              <a
                href={FSSAI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-pill border border-forest/20 bg-sage/40 text-forest-deep px-6 py-3 text-sm font-semibold hover:bg-sage transition-all"
              >
                🇮🇳 Report to FSSAI ↗
              </a>

            </div>

            {offline && !user && (
              <div className="mt-6 rounded-2xl bg-sage/50 border border-forest/10 px-4 py-3">
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-forest-deep">
                    Demo mode:
                  </strong>{' '}
                  Your complaint is being saved only in this
                  browser.
                  <Link
                    to="/login"
                    className="ml-1 text-forest font-bold hover:underline"
                  >
                    Log in
                  </Link>{' '}
                  to save complaints to your FoodGuard account.
                </p>
              </div>
            )}

          </div>

          {/* RIGHT - FSSAI CARD */}
          <div className="relative overflow-hidden rounded-[28px] bg-forest text-white shadow-lift p-7 sm:p-9">

            <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-white/10" />
            <div className="absolute -left-20 -bottom-20 w-52 h-52 rounded-full bg-white/5" />

            <div className="relative">

              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-6">
                🇮🇳
              </div>

              <p className="text-white/60 text-xs uppercase tracking-wider font-bold mb-2">
                Official Government Channel
              </p>

              <h2 className="text-2xl font-extrabold mb-3">
                FSSAI Food Safety Connect
              </h2>

              <p className="text-white/70 text-sm leading-relaxed mb-7">
                Use the official FSSAI platform to submit
                food-safety concerns for government action.
              </p>

              <a
                href={FSSAI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-pill bg-white text-forest px-6 py-3 text-sm font-bold hover:bg-sage transition-colors"
              >
                Open official portal ↗
              </a>

              <div className="mt-7 pt-6 border-t border-white/10">
                <p className="text-xs text-white/50 leading-relaxed">
                  FoodGuard is an independent food-safety
                  assistance platform. Official enforcement
                  decisions are made by the appropriate
                  government authorities.
                </p>
              </div>

            </div>
          </div>

        </section>


        {/* HOW IT WORKS */}
        <section className="mb-12">

          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-orange text-xs font-bold uppercase tracking-wider mb-2">
                Simple process
              </p>

              <h2 className="text-2xl font-extrabold">
                How reporting works
              </h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">

            <ProcessCard
              number="01"
              icon="📝"
              title="Record"
              text="Enter the product, issue, location and incident details."
            />

            <ProcessCard
              number="02"
              icon="🆔"
              title="Track"
              text="FoodGuard creates a tracking ID for your personal record."
            />

            <ProcessCard
              number="03"
              icon="🇮🇳"
              title="Report officially"
              text="Use FSSAI Food Safety Connect when you want to submit an official government complaint."
            />

          </div>

        </section>


        {/* TRACKING ID */}
        {lastId && (
          <section className="mb-10">

            <div className="rounded-[24px] bg-sage border border-forest/10 p-6 sm:p-7">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
                      ✓
                    </span>

                    <p className="text-sm text-forest-deep font-bold">
                      Complaint recorded
                    </p>
                  </div>

                  <p className="text-xs text-muted">
                    Keep this FoodGuard tracking ID for your
                    records.
                  </p>
                </div>

                <div className="bg-white rounded-2xl px-5 py-3 border border-black/5">
                  <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">
                    Tracking ID
                  </p>

                  <p className="text-xl font-heading font-extrabold text-forest-deep">
                    {lastId}
                  </p>
                </div>

              </div>

            </div>

          </section>
        )}


        {/* COMPLAINTS */}
        <section>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div>
              <p className="text-orange text-xs font-bold uppercase tracking-wider mb-1">
                Your records
              </p>

              <h2 className="font-heading font-bold text-xl">
                Your complaints
              </h2>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-pill bg-forest text-white px-6 py-2.5 text-sm font-semibold hover:bg-forest-deep transition-colors"
            >
              + Submit complaint
            </button>

          </div>


          {complaints.length === 0 ? (

            <EmptyState
              title="No complaints submitted yet."
              description="If you've noticed unsafe, expired or mislabeled food, you can document it here."
            />

          ) : (

            <div className="space-y-5">

              {complaints.map((c) => (

                <ComplaintCard
                  key={c.id}
                  complaint={c}
                />

              ))}

            </div>

          )}

        </section>


        {/* GOVERNMENT NOTICE */}
        <section className="mt-12">

          <div className="rounded-[24px] border border-black/5 bg-white shadow-soft p-6">

            <div className="flex gap-4">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-sage flex items-center justify-center">
                ℹ️
              </div>

              <div>

                <h3 className="font-bold mb-2">
                  About official complaints
                </h3>

                <p className="text-sm text-muted leading-relaxed">
                  FoodGuard helps you organize information
                  about a food-safety issue. It does not replace
                  the official government complaint process.
                  For regulatory action, submit the complaint
                  through the official{' '}
                  <a
                    href={FSSAI_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-forest font-semibold hover:underline"
                  >
                    FSSAI Food Safety Connect
                  </a>{' '}
                  portal.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* FORM MODAL */}
      {showForm && (
        <ComplaintForm
          onCancel={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}

    </div>
  )
}


/* =========================================================
   PROCESS CARD
========================================================= */

function ProcessCard({
  number,
  icon,
  title,
  text,
}) {
  return (
    <div className="bg-white rounded-[22px] border border-black/5 shadow-soft p-6 hover:-translate-y-1 hover:shadow-lift transition-all">

      <div className="flex items-center justify-between mb-5">

        <div className="w-11 h-11 rounded-xl bg-sage flex items-center justify-center text-xl">
          {icon}
        </div>

        <span className="text-xs font-bold text-muted">
          {number}
        </span>

      </div>

      <h3 className="font-heading font-bold text-lg mb-2">
        {title}
      </h3>

      <p className="text-sm text-muted leading-relaxed">
        {text}
      </p>

    </div>
  )
}


/* =========================================================
   COMPLAINT CARD
========================================================= */

function ComplaintCard({ complaint: c }) {
  const date = (
    c.date ||
    c.createdAt ||
    c.incidentDate ||
    ''
  ).slice(0, 10)
  const hasCoordinates = c.latitude != null && c.longitude != null

  return (
    <article className="bg-white rounded-[24px] shadow-soft border border-black/5 p-6 sm:p-7 hover:shadow-lift transition-shadow">

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-6">

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-2 mb-2">

            <span className="inline-flex items-center rounded-pill bg-sage px-3 py-1 text-[11px] font-bold text-forest-deep">
              {c.trackingId || 'No tracking ID'}
            </span>

            {date && (
              <span className="text-xs text-muted">
                {date}
              </span>
            )}

          </div>

          <h3 className="font-heading font-bold text-lg break-words">
            {c.productName || 'Food product'}
          </h3>

          <p className="text-sm text-muted mt-1">
            {c.issueType || 'Food safety issue'}
          </p>

        </div>

        <StatusBadge status={c.status || 'submitted'} />

      </div>


      {/* DETAILS */}
      <div className="grid sm:grid-cols-3 gap-3 mb-6">

        <Detail
          icon="📦"
          label="Category"
          value={c.category || 'Not specified'}
        />

        <Detail
          icon="📍"
          label="Location"
          value={c.location || 'Not specified'}
          href={hasCoordinates
            ? `https://maps.google.com/?q=${c.latitude},${c.longitude}`
            : undefined}
        />

        <Detail
          icon="📅"
          label="Incident date"
          value={c.incidentDate || 'Not specified'}
        />

      </div>


      {/* DESCRIPTION */}
      {c.description && (
        <div className="rounded-2xl bg-sage/40 border border-forest/5 p-4 mb-6">

          <p className="text-[11px] uppercase tracking-wider font-bold text-muted mb-1">
            Description
          </p>

          <p className="text-sm leading-relaxed">
            {c.description}
          </p>

        </div>
      )}


      {/* TIMELINE */}
      <div className="pt-5 border-t border-black/5">

        <p className="text-xs font-bold text-muted uppercase tracking-wider mb-4">
          Complaint progress
        </p>

        <Timeline
          currentStatus={c.status || 'submitted'}
        />

      </div>

    </article>
  )
}


/* =========================================================
   DETAIL
========================================================= */

function Detail({
  icon,
  label,
  value,
  href,
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-4">

      <div className="text-base mb-2">
        {icon}
      </div>

      <p className="text-[10px] uppercase tracking-wider text-muted font-bold">
        {label}
      </p>

      <p className="text-sm font-semibold mt-1 break-words">
        {value}
      </p>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-1 text-xs font-semibold text-forest hover:underline"
        >
          View attached location
        </a>
      )}

    </div>
  )
}


/* =========================================================
   COMPLAINT FORM
========================================================= */

function ComplaintForm({
  onCancel,
  onSubmit,
}) {
  const [form, setForm] = useState({
    productName: '',
    category: '',
    issueType: ISSUE_TYPES[0],
    location: '',
    latitude: null,
    longitude: null,
    incidentDate: '',
    description: '',
    evidenceUrl: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState('')

  function attachLiveLocation() {
    if (!navigator.geolocation) {
      setLocationError('Live location is not supported by this browser.')
      return
    }

    setLocationLoading(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((current) => ({
          ...current,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }))
        setLocationLoading(false)
      },
      (error) => {
        setLocationError(error.code === error.PERMISSION_DENIED
          ? 'Location permission was denied. You can still enter an area manually.'
          : 'Could not get your location. Please try again or enter an area manually.')
        setLocationLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  function removeLiveLocation() {
    setForm((current) => ({
      ...current,
      latitude: null,
      longitude: null,
    }))
    setLocationError('')
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleFormSubmit(e) {
    e.preventDefault()

    if (!form.productName.trim()) {
      return
    }

    setSubmitting(true)

    try {
      await onSubmit(form)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="complaint-form-title"
    >

      <form
        onSubmit={handleFormSubmit}
        className="bg-white rounded-[28px] p-6 sm:p-8 w-full max-w-xl shadow-lift max-h-[92vh] overflow-y-auto"
      >

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 mb-7">

          <div>

            <div className="w-11 h-11 rounded-xl bg-sage flex items-center justify-center text-xl mb-4">
              📝
            </div>

            <h2
              id="complaint-form-title"
              className="font-heading font-bold text-xl"
            >
              Record a complaint
            </h2>

            <p className="text-xs text-muted mt-1">
              Add as much accurate information as possible.
            </p>

          </div>

          <button
            type="button"
            onClick={onCancel}
            className="w-9 h-9 rounded-full hover:bg-black/5 text-muted transition-colors"
            aria-label="Close"
          >
            ✕
          </button>

        </div>


        {/* FORM */}
        <div className="space-y-4">

          <TextField
            label="Product name"
            required
            placeholder="Example: Milk, Honey, Turmeric"
            value={form.productName}
            onChange={(value) =>
              updateField('productName', value)
            }
          />


          <div className="grid sm:grid-cols-2 gap-4">

            <TextField
              label="Category"
              placeholder="Example: Dairy"
              value={form.category}
              onChange={(value) =>
                updateField('category', value)
              }
            />

            <TextField
              label="Location"
              placeholder="City / area / shop"
              value={form.location}
              onChange={(value) =>
                updateField('location', value)
              }
            />

          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={attachLiveLocation}
                disabled={locationLoading || submitting}
                className="rounded-pill border border-forest/20 px-4 py-2 text-xs font-semibold text-forest hover:bg-sage/60 transition-colors disabled:opacity-50"
              >
                {locationLoading
                  ? 'Getting location...'
                  : form.latitude != null
                    ? 'Refresh live location'
                    : 'Attach live location'}
              </button>
              {form.latitude != null && form.longitude != null && (
                <>
                  <span className="text-xs text-success">
                    Location attached ({form.latitude.toFixed(5)}, {form.longitude.toFixed(5)})
                  </span>
                  <button
                    type="button"
                    onClick={removeLiveLocation}
                    className="text-xs font-semibold text-muted hover:text-charcoal"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-muted">
              Optional. Your precise location is saved with this complaint only if you attach it.
            </p>
            {locationError && (
              <p role="alert" className="mt-1.5 text-xs text-danger">
                {locationError}
              </p>
            )}
          </div>


          <label className="block">

            <span className="text-xs font-semibold text-muted mb-1.5 block">
              Issue type
            </span>

            <select
              value={form.issueType}
              onChange={(e) =>
                updateField(
                  'issueType',
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-black/10 px-3 py-3 text-sm bg-white focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none"
            >
              {ISSUE_TYPES.map((type) => (
                <option key={type}>
                  {type}
                </option>
              ))}
            </select>

          </label>


          <TextField
            label="Date of incident"
            type="date"
            value={form.incidentDate}
            onChange={(value) =>
              updateField(
                'incidentDate',
                value
              )
            }
          />


          <label className="block">

            <span className="text-xs font-semibold text-muted mb-1.5 block">
              Description
            </span>

            <textarea
              rows={5}
              value={form.description}
              onChange={(e) =>
                updateField(
                  'description',
                  e.target.value
                )
              }
              placeholder="Describe what happened, where you purchased the product, and what you observed."
              className="w-full rounded-xl border border-black/10 px-3 py-3 text-sm resize-none focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none"
            />

          </label>


          <TextField
            label="Evidence URL (optional)"
            type="url"
            placeholder="https://..."
            value={form.evidenceUrl}
            onChange={(value) =>
              updateField(
                'evidenceUrl',
                value
              )
            }
          />


          {/* NOTICE */}
          <div className="rounded-2xl bg-orange/10 border border-orange/10 p-4">

            <p className="text-xs font-bold text-orange mb-1">
              ⚠️ Important
            </p>

            <p className="text-xs text-muted leading-relaxed">
              Only provide accurate information. FoodGuard
              records this information for your FoodGuard
              account/demo record. For official government
              action, submit your complaint separately through
              FSSAI Food Safety Connect.
            </p>

          </div>

        </div>


        {/* ACTIONS */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-7">

          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 rounded-pill border border-black/10 font-semibold py-3 text-sm hover:bg-black/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              submitting ||
              !form.productName.trim()
            }
            className="flex-1 rounded-pill bg-forest text-white font-semibold py-3 text-sm hover:bg-forest-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Recording...'
              : 'Record complaint'}
          </button>

        </div>


        {/* FSSAI LINK */}
        <div className="text-center mt-5">

          <a
            href={FSSAI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-forest font-semibold hover:underline"
          >
            Need official government action? Open FSSAI Food
            Safety Connect ↗
          </a>

        </div>

      </form>

    </div>
  )
}


/* =========================================================
   TEXT FIELD
========================================================= */

function TextField({
  label,
  required = false,
  onChange,
  ...props
}) {
  return (
    <label className="block">

      <span className="text-xs font-semibold text-muted mb-1.5 block">
        {label}

        {required && (
          <span className="text-orange ml-1">
            *
          </span>
        )}
      </span>

      <input
        {...props}
        required={required}
        onChange={(e) =>
          onChange?.(e.target.value)
        }
        className="w-full rounded-xl border border-black/10 px-3 py-3 text-sm focus:border-forest focus:ring-2 focus:ring-forest/10 outline-none"
      />

    </label>
  )
}
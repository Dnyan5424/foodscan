import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import mapWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

import 'maplibre-gl/dist/maplibre-gl.css'

import Papa from 'papaparse'

import {

  Bell,

  BellRing,

  CalendarDays,

  ExternalLink,

  MapPin,

  Newspaper,

  ShieldAlert,

  ShieldCheck,

  SlidersHorizontal,

} from 'lucide-react'

import { useToast } from '../components/Toast'



const PREFERENCES_KEY = 'foodguard_fda_watch_preferences'



const LOCATIONS = ['Pune', 'Pimpri-Chinchwad', 'Mumbai', 'Maharashtra']

const TOPICS = [

  'Food adulteration',

  'FDA raids/actions',

  'Product recalls',

  'Unsafe food',

  'Restaurant hygiene',

  'Milk/dairy',

  'Spices',

  'Packaged food',

  'FSSAI notifications',

]



const SOURCES = [

  { name: 'Maharashtra FDA', type: 'State government', url: 'https://fda.maharashtra.gov.in/notice-category/notification/' },

  { name: 'FSSAI', type: 'Government of India', url: 'https://www.fssai.gov.in/notifications.php' },

  { name: 'Ministry of Health and Family Welfare', type: 'Government of India', url: 'https://mohfw.gov.in/' },

  { name: 'The Hindu', type: 'Trusted media', url: 'https://www.thehindu.com/' },

  { name: 'The Indian Express', type: 'Trusted media', url: 'https://indianexpress.com/' },

  { name: 'Hindustan Times', type: 'Trusted media', url: 'https://www.hindustantimes.com/' },

  { name: 'The Times of India', type: 'Trusted media', url: 'https://timesofindia.indiatimes.com/' },

  { name: 'Loksatta', type: 'Trusted regional media', url: 'https://www.loksatta.com/' },

  { name: 'Press Trust of India', type: 'News agency', url: 'https://www.ptinews.com/' },

]



const UPDATES = [

  {

    id: 'fssai-paneer-draft-2026-09-24',

    title: 'FSSAI invites comments on draft paneer composition rules',

    summary: 'The draft amendment proposes restrictions on paneer made from constituents not derived from milk. FSSAI has published the draft notification and a format for comments; consult the original notice for scope and submission details.',

    published: '2026-09-24',

    location: 'India',

    category: 'Milk/dairy',

    topic: 'FSSAI notifications',

    kind: 'Official update',

    source: 'FSSAI',

    sourceType: 'fssai',

    url: 'https://www.fssai.gov.in/docs/food-law/notice-comment/Notification%20dated%2023.09.2026.pdf',

  },

  {

    id: 'maha-school-food-order-2026-07-28',

    title: 'Maharashtra issues statewide school food-safety compliance order',

    summary: 'The state FDA notice describes an order implementing food-safety regulations for food served in government, aided and private schools. The notice is statewide; it does not report a city-specific raid or enforcement incident.',

    published: '2026-07-28',

    location: 'Maharashtra',

    category: 'School meals',

    topic: 'Restaurant hygiene',

    kind: 'Official update',

    source: 'Maharashtra FDA',

    sourceType: 'state',

    url: 'https://fda.maharashtra.gov.in/notice-category/notification/',

  },

  {

    id: 'fssai-central-advisory-committee-2026-09-24',

    title: 'FSSAI publishes a Gazette notification for its Central Advisory Committee',

    summary: 'A Gazette notification dated 24 September 2026 appears in FSSAI’s official notifications register. Open the original document to review its details and determine whether it is relevant to your food-safety interests.',

    published: '2026-09-24',

    location: 'India',

    category: 'Government notification',

    topic: 'FSSAI notifications',

    kind: 'Official update',

    source: 'FSSAI',

    sourceType: 'fssai',

    url: 'https://www.fssai.gov.in/docs/food-law/notice-comment/Notification%20dt%2018.09.2026.pdf',

  },

]



const VERIFIED_RAIDS = []

const MAP_CENTERS = {

  Pune: [73.8567, 18.5204],

  'Pimpri-Chinchwad': [73.805, 18.6298],

  Mumbai: [72.8777, 19.076],

  Nashik: [73.7898, 19.9975],

  Maharashtra: [75.7139, 19.7515],

}



const DEFAULT_PREFERENCES = {

  locations: ['Pune', 'Pimpri-Chinchwad'],

  topics: [...TOPICS],

  notifications: { inApp: true, browser: false, email: false },

}



const SOURCE_STYLES = {

  state: { label: 'OFFICIAL · STATE', color: 'bg-emerald-100 text-emerald-800' },

  fssai: { label: 'OFFICIAL · FSSAI', color: 'bg-sky-100 text-sky-800' },

  media: { label: 'TRUSTED MEDIA', color: 'bg-amber-100 text-amber-900' },

  other: { label: 'OTHER SOURCE', color: 'bg-slate-100 text-slate-700' },

}



function readPreferences() {

  try {

    const saved = JSON.parse(localStorage.getItem(PREFERENCES_KEY))

    return saved ? { ...DEFAULT_PREFERENCES, ...saved, notifications: { ...DEFAULT_PREFERENCES.notifications, ...saved.notifications } } : DEFAULT_PREFERENCES

  } catch {

    return DEFAULT_PREFERENCES

  }

}



function formatDate(date) {

  return new Date(`${date}T12:00:00`).toLocaleDateString('en-IN', {

    day: 'numeric',

    month: 'short',

    year: 'numeric',

  })

}



function CheckboxRow({ label, checked, onChange, disabled = false }) {

  return (

    <label className={`flex items-center gap-3 py-2 text-sm ${disabled ? 'cursor-not-allowed text-muted' : 'cursor-pointer text-charcoal'}`}>

      <input

        type="checkbox"

        checked={checked}

        disabled={disabled}

        onChange={onChange}

        className="h-4 w-4 accent-forest"

      />

      <span>{label}</span>

    </label>

  )

}



function UpdateCard({ update }) {

  const sourceStyle = SOURCE_STYLES[update.sourceType] || SOURCE_STYLES.other



  return (

    <article className="border-b border-black/10 py-6 last:border-0">

      <div className="mb-3 flex flex-wrap items-center gap-2">

        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wide ${sourceStyle.color}`}>

          {sourceStyle.label}

        </span>

        <span className="rounded-full bg-charcoal/5 px-2.5 py-1 text-[10px] font-semibold text-charcoal/70">

          {update.kind}

        </span>

        <span className="text-xs text-muted">{update.category}</span>

      </div>

      <h3 className="max-w-3xl text-lg font-bold leading-snug text-charcoal">{update.title}</h3>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{update.summary}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">

        <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> Published {formatDate(update.published)}</span>

        <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {update.location}</span>

        <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} /> {update.source}</span>

      </div>

      <a

        href={update.url}

        target="_blank"

        rel="noreferrer"

        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-forest-deep hover:underline"

      >

        Read Original <ExternalLink size={15} />

      </a>

    </article>

  )

}



export default function FDAWatch() {

  const [preferences, setPreferences] = useState(readPreferences)

  const [recalls, setRecalls] = useState([])
  const [newsReports, setNewsReports] = useState([])

  const [recallLoadError, setRecallLoadError] = useState(false)
  const [newsLoadError, setNewsLoadError] = useState(false)

  const [activePlace, setActivePlace] = useState('Maharashtra')

  const [activeRaidId, setActiveRaidId] = useState(null)

  const [activeClusterIds, setActiveClusterIds] = useState([])

  const [showPreferences, setShowPreferences] = useState(false)

  const toast = useToast()



  useEffect(() => {

    let cancelled = false

    fetch('/data/foodguard_india_food_safety_200_full_osm_locations.csv')

      .then((response) => {

        if (!response.ok) throw new Error('Recall data unavailable')

        return response.text()

      })

      .then((csv) => {

        const parsed = Papa.parse(csv, {

          header: true,

          skipEmptyLines: 'greedy',

          transformHeader: (header) => header.trim(),

        })

        if (parsed.errors.length) throw new Error('Could not parse recall data')

        if (!cancelled) setRecalls(parsed.data.filter((row) => row.id && row.title))

      })

      .catch(() => {

        if (!cancelled) setRecallLoadError(true)

      })

    return () => { cancelled = true }

  }, [])

  useEffect(() => {
    let cancelled = false

    fetch('/data/foodguard_india_food_safety_news.csv')
      .then((response) => {
        if (!response.ok) throw new Error('News data unavailable')
        return response.text()
      })
      .then((csv) => {
        const parsed = Papa.parse(csv, {
          header: true,
          skipEmptyLines: 'greedy',
          transformHeader: (header) => header.trim(),
        })
        if (parsed.errors.length) throw new Error('Could not parse news data')

        const reports = parsed.data
          .filter((report) => report.id && report.title)
          .map((report) => {
            const latitudeValue = report.latitude?.trim()
            const longitudeValue = report.longitude?.trim()
            const latitude = Number(latitudeValue)
            const longitude = Number(longitudeValue)
            const hasCoordinates = Boolean(latitudeValue && longitudeValue)
              && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90
              && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180

            return {
              ...report,
              published: report.date,
              source: report.source || report.authority,
              url: report.source_url,
              location: [report.city, report.district, report.state].filter(Boolean).join(', ') || 'India',
              recordType: 'enforcement',
              coordinates: hasCoordinates ? [longitude, latitude] : undefined,
              locationPrecision: report.location_accuracy || (hasCoordinates ? 'Source-provided coordinates' : 'Location coordinates not provided'),
            }
          })

        if (!cancelled) setNewsReports(reports)
      })
      .catch(() => {
        if (!cancelled) setNewsLoadError(true)
      })

    return () => { cancelled = true }
  }, [])



  const visibleUpdates = UPDATES.filter((update) => {

    const locationMatches = update.location === 'India'

      || (update.location === 'Maharashtra' && preferences.locations.some((location) =>

        ['Pune', 'Pimpri-Chinchwad', 'Mumbai', 'Nashik', 'Maharashtra'].includes(location)

      ))

      || preferences.locations.includes(update.location)

    return locationMatches && preferences.topics.includes(update.topic)

  })



  const mappedRecalls = useMemo(() => recalls.flatMap((recall) => {

    const latitudeValue = recall.latitude?.trim()

    const longitudeValue = recall.longitude?.trim()

    const latitude = Number(recall.latitude)

    const longitude = Number(recall.longitude)

    const accuracy = recall.location_accuracy || ''

    const cityAccuracy = /district\s*\/\s*city level/i.test(accuracy)

    if (!latitudeValue || !longitudeValue || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180 || !cityAccuracy) return []



    const location = [recall.city, recall.district, recall.state].filter(Boolean).join(', ')

    if (!location) return []

    return [{

      ...recall,

      location,

      coordinates: [longitude, latitude],

      published: recall.date,

      source: 'FSSAI / FoSCoS',

      url: recall.source_url,

      recordType: 'recall',

      locationPrecision: 'Approximate city/district location',

    }]

  }), [recalls])

  const mapReports = useMemo(() => [...VERIFIED_RAIDS, ...newsReports, ...mappedRecalls], [newsReports, mappedRecalls])



  function updatePreference(group, value, enabled) {

    setPreferences((current) => {

      const next = group === 'notifications'

        ? { ...current, notifications: { ...current.notifications, [value]: enabled } }

        : { ...current, [group]: enabled ? [...current[group], value] : current[group].filter((item) => item !== value) }

      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next))

      return next

    })

  }



  async function toggleBrowserAlerts(enabled) {

    if (!enabled) {

      updatePreference('notifications', 'browser', false)

      return

    }

    if (!('Notification' in window)) {

      toast?.('Browser notifications are not supported here.', 'error')

      return

    }

    const permission = Notification.permission === 'granted'

      ? 'granted'

      : await Notification.requestPermission()

    if (permission === 'granted') {

      updatePreference('notifications', 'browser', true)

      toast?.('Browser notification permission is enabled.')

    } else {

      updatePreference('notifications', 'browser', false)

      toast?.('Browser notification permission was not granted.', 'error')

    }

  }



  const placeCounts = ['Pimpri-Chinchwad', 'Mumbai', 'Maharashtra'].map((place) => ({

    place,

    count: mapReports.filter((report) => report.city === place || report.district === place || report.state === place).length,

  }))

  const selectedEnforcement = activeClusterIds.length
    ? mapReports.filter((report) => activeClusterIds.includes(String(report.id)))
    : activeRaidId
      ? mapReports.filter((report) => String(report.id) === String(activeRaidId))
      : mapReports.filter((report) =>
        report.location === activePlace ||
        report.city === activePlace ||
        report.district === activePlace ||
        report.state === activePlace
      )

  const handleRaidSelect = useCallback((raidId) => {
    const normalizedId = String(raidId)
    setActiveRaidId(normalizedId)
    setActiveClusterIds([])
    const raid = mapReports.find((item) => String(item.id) === normalizedId)
    if (raid) {
      setActivePlace(raid.city || raid.district || raid.state || 'Maharashtra')
    }
  }, [mapReports])

  const handleClusterSelect = useCallback((reportIds) => {
    const ids = reportIds.map(String)
    setActiveClusterIds(ids)
    setActiveRaidId(null)
    const firstReport = mapReports.find((report) => ids.includes(String(report.id)))
    if (firstReport) setActivePlace(firstReport.city || firstReport.district || firstReport.state || 'Maharashtra')
  }, [mapReports])

  const sortedReportList = useMemo(() => [...mapReports].sort((a, b) => {
    const dateA = new Date(a.published || a.date || '2000-01-01').getTime()
    const dateB = new Date(b.published || b.date || '2000-01-01').getTime()
    return dateB - dateA
  }), [mapReports])



  return (

    <div className="min-h-screen bg-[#f2f5ef] text-charcoal">

      <main className="mx-auto max-w-[1480px] px-4 pb-16 pt-5 sm:px-6 sm:pt-8 lg:px-8">

        <section className="relative overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_100%_0%,rgba(255,255,255,0.14),transparent_42%),linear-gradient(125deg,#163e32_0%,#205b45_58%,#14372e_100%)] px-5 py-6 text-white shadow-lg sm:px-8 sm:py-9 lg:px-11 lg:py-10">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.14em] text-white/85">

              <ShieldCheck size={18} className="text-[#f4b269]" /> FOODGUARD FDA WATCH

            </div>

            <button

              type="button"

              onClick={() => setShowPreferences((shown) => !shown)}

              aria-expanded={showPreferences}

              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"

            >

              <SlidersHorizontal size={16} /> Alert preferences

            </button>

          </div>

          <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">

            <div>

              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-[#f4b269]">Daily intelligence · Maharashtra</p>

              <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-[3.5rem]">Food safety,<br className="hidden sm:block" /> <span className="text-[#b9dfbd]">reported with proof.</span></h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">Official notices and source-linked food-safety information. This curated reference snapshot is not a live news feed; each item links to its original publisher.</p>

            </div>

            <div className="grid grid-cols-3 gap-px border border-black/10 bg-black/10">

              <div className="bg-white p-4">

                <span className="block text-2xl font-extrabold">{visibleUpdates.length}</span>

                <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-muted">Source updates</span>

              </div>

              <div className="bg-white p-4">

                <span className="block text-2xl font-extrabold">{newsReports.length}</span>

                <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-muted">Enforcement reports</span>

              </div>

              <div className="bg-white p-4">

                <span className="block text-2xl font-extrabold">{recalls.length || '—'}</span>

                <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-muted">FSSAI recalls</span>

              </div>

            </div>

          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/20 pt-4 text-xs text-white/65">

            <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> Reviewed 25 Sep 2026</span>

            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} /> Official sources prioritized</span>
            <a href="#action-map" className="font-bold text-[#f4b269] underline-offset-4 hover:underline">Explore the action map ↓</a>

            <span className="inline-flex items-center gap-1.5">{visibleUpdates.length} matching source-linked updates</span>

          </div>

        </section>



        {showPreferences && (

          <section className="mt-5 grid gap-7 rounded-2xl border border-black/10 bg-white px-5 py-6 shadow-sm sm:grid-cols-3 sm:px-7" aria-label="Alert preferences">

            <div>

              <h2 className="mb-2 flex items-center gap-2 text-sm font-extrabold"><MapPin size={16} /> Locations</h2>

              {LOCATIONS.map((location) => (

                <CheckboxRow key={location} label={location} checked={preferences.locations.includes(location)} onChange={(event) => updatePreference('locations', location, event.target.checked)} />

              ))}

            </div>

            <div>

              <h2 className="mb-2 flex items-center gap-2 text-sm font-extrabold"><Newspaper size={16} /> Topics</h2>

              {TOPICS.map((topic) => (

                <CheckboxRow key={topic} label={topic} checked={preferences.topics.includes(topic)} onChange={(event) => updatePreference('topics', topic, event.target.checked)} />

              ))}

            </div>

            <div>

              <h2 className="mb-2 flex items-center gap-2 text-sm font-extrabold"><Bell size={16} /> Notifications</h2>

              <CheckboxRow label="In-app preferences" checked={preferences.notifications.inApp} onChange={(event) => updatePreference('notifications', 'inApp', event.target.checked)} />

              <CheckboxRow label="Browser permission" checked={preferences.notifications.browser} onChange={(event) => toggleBrowserAlerts(event.target.checked)} />

              <CheckboxRow label="Email (not available)" checked={false} disabled onChange={() => {}} />

              <p className="mt-3 text-xs leading-5 text-muted">Preferences are saved in this browser and filter the updates shown here. Automatic daily delivery requires a connected publishing service.</p>

            </div>

          </section>

        )}



        <section className="mt-10 grid gap-7 rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7 lg:grid-cols-[minmax(0,1fr)_280px]">

          <div>

            <div className="mb-1 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-forest-deep">

              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> Verified source updates

            </div>

            <p className="mb-1 text-xs text-muted">Summaries are brief; source documents remain the authority.</p>

            {visibleUpdates.length ? (

              visibleUpdates.map((update) => <UpdateCard key={update.id} update={update} />)

            ) : (

              <div className="border-y border-black/10 py-10 text-sm text-muted">

                No source-linked updates match these preferences. Try enabling Maharashtra or FSSAI notifications.

              </div>

            )}

          </div>



          <aside className="h-fit rounded-xl bg-[#f2f5ef] p-5 lg:sticky lg:top-6">

            <h2 className="text-sm font-extrabold">Source confidence</h2>

            <div className="mt-4 space-y-3 text-xs leading-5">

              <p><span className="font-extrabold text-emerald-800">OFFICIAL · STATE</span><br />Maharashtra FDA publications</p>

              <p><span className="font-extrabold text-sky-800">OFFICIAL · FSSAI</span><br />Government of India notices</p>

              <p><span className="font-extrabold text-amber-900">TRUSTED MEDIA</span><br />Established news organizations</p>

              <p><span className="font-extrabold text-slate-700">OTHER SOURCE</span><br />Clearly identified, lower-confidence sources</p>

            </div>

            <p className="mt-4 border-t border-black/10 pt-4 text-xs leading-5 text-muted">A media report is not an official government announcement. FoodGuard does not reproduce full articles.</p>

          </aside>

        </section>



        <section className="scroll-mt-6 mt-6 grid gap-7 rounded-2xl border border-black/10 bg-white p-4 shadow-md sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-7">

          <div>

            <div className="flex flex-wrap items-end justify-between gap-3">

              <div>

                <p className="text-xs font-extrabold uppercase tracking-wide text-orange">Source-linked reports</p>

                <h2 id="action-map" className="mt-1 text-2xl font-extrabold sm:text-3xl">FDA Action Map</h2>

              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-charcoal/75"><span className="h-2.5 w-2.5 rounded-full bg-[#1676a3]" /> FSSAI recalls</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-charcoal/75"><span className="h-2.5 w-2.5 rounded-full bg-[#bd3434]" /> Enforcement</span>
                <a href="https://openfreemap.org/" target="_blank" rel="noreferrer" className="font-semibold text-forest-deep hover:underline">Map provider ↗</a>
              </div>

            </div>

            <p className="mb-4 mt-2 max-w-3xl text-sm leading-6 text-muted">Blue pins are FSSAI recall records; red pins are enforcement reports. Recall pins show district/city-level locations, not exact business addresses. State and central-office-only coordinates are excluded. Reports without supplied coordinates remain in the list and are not pinned. Mapped recalls: {mappedRecalls.length} of {recalls.length}.</p>

            {recallLoadError && <p className="mb-3 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-xs text-red-800">The FSSAI recall data could not be loaded, so recall pins are unavailable.</p>}
            {newsLoadError && <p className="mb-3 border-l-2 border-red-700 bg-red-50 px-4 py-3 text-xs text-red-800">The food-safety news reports could not be loaded.</p>}

            <ActionMap raids={mapReports} activeRaidId={activeRaidId} activePlace={activePlace} onSelectRaid={handleRaidSelect} onSelectCluster={handleClusterSelect} />

            {mapReports.length > 0 && (
              <div className="mt-4 rounded-xl bg-[#f2f5ef] p-3">
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted">Available source reports</p>
                <div className="max-h-52 space-y-2 overflow-y-auto">
                  {sortedReportList.slice(0, 12).map((report) => {
                    const selected = String(report.id) === String(activeRaidId)
                    return (
                      <button
                        key={report.id}
                        type="button"
                        onClick={() => handleRaidSelect(report.id)}
                        className={`w-full border-l-2 px-3 py-2 text-left transition ${selected ? 'border-forest bg-emerald-50' : 'border-transparent bg-slate-50 hover:border-forest/60'} `}
                      >
                        <div className={`text-[10px] font-extrabold uppercase ${report.recordType === 'recall' ? 'text-sky-800' : 'text-red-800'}`}>
                          {report.recordType === 'recall' ? 'FSSAI Recall' : 'FDA Enforcement'}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-charcoal">{report.title}</div>
                        <div className="mt-1 text-[11px] text-muted">{report.location || report.city || report.district || 'India'}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-muted">

              <span>Map: OpenFreeMap / OpenMapTiles</span>

              <span>Geographic data: OpenStreetMap contributors</span>

              <a className="underline underline-offset-2" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Attribution & licensing</a>

            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-3 2xl:grid-cols-5">

              {placeCounts.map(({ place, count }) => (

                <button

                  key={place}

                  type="button"

                  onClick={() => { setActivePlace(place); setActiveRaidId(null); setActiveClusterIds([]) }}
                  className={`min-h-16 rounded-xl border px-3 py-3 text-left transition-colors ${activePlace === place ? 'border-forest bg-emerald-50' : 'border-black/10 bg-white hover:border-charcoal/40'}`}

                >

                  <span className="flex items-center justify-between text-sm font-bold">{place}{count > 0 && <MapPin size={15} className="text-forest" />}</span>

                  <span className={`mt-2 block text-[11px] ${count ? 'font-semibold text-forest-deep' : 'text-muted'}`}>

                    {count ? `${count} source report${count === 1 ? '' : 's'}` : 'No mapped reports'}

                  </span>

                </button>

              ))}

            </div>

          </div>

          <aside aria-live="polite" className="border-t border-black/10 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">

            <h3 className="text-sm font-extrabold">
              {activeClusterIds.length
                ? `${activeClusterIds.length} selected reports`
                : activeRaidId
                  ? 'Selected report'
                  : `${activePlace} reports`}
            </h3>

            {selectedEnforcement.length ? (

              <div className="mt-3 space-y-3">

                {selectedEnforcement.map((raid) => {
                  const isSelected = String(raid.id) === String(activeRaidId)
                  return (

                  <div
                    key={raid.id}
                    onClick={() => handleRaidSelect(raid.id)}
                    className={`cursor-pointer border-l-2 pl-3 text-xs leading-5 ${raid.recordType === 'recall' ? 'border-sky-700' : 'border-red-700'} ${isSelected ? 'rounded-r-lg bg-sky-50 py-2 pr-2 ring-1 ring-sky-200' : 'hover:bg-black/[0.02]'}`}
                  >

                    <span className={`text-[10px] font-extrabold uppercase ${raid.recordType === 'recall' ? 'text-sky-800' : 'text-red-800'}`}>{raid.recordType === 'recall' ? 'FSSAI Recall' : 'FDA Enforcement'}</span>

                    <p className="font-semibold">{raid.title}</p>

                    <p className="mt-1 text-muted">{formatDate(raid.published)} · {raid.category} · {raid.source}</p>
                    {!raid.coordinates && <p className="mt-1 text-[11px] text-muted">Source coordinates were not provided; this report is not pinned.</p>}

                    {raid.recordType === 'recall' && <p className="mt-1 text-muted">Status: {raid.status || 'Not listed'} · Batch: {raid.batch_lot || 'Not listed'}</p>}

                    <a className="mt-1 inline-flex items-center gap-1 font-bold text-forest-deep hover:underline" href={raid.url} target="_blank" rel="noreferrer">View original report <ExternalLink size={12} /></a>

                  </div>
                  )
                })}

              </div>

            ) : (

              <div className="mt-4 rounded-xl border border-black/10 bg-white p-4">

                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-muted"><ShieldCheck size={14} /> NO MAPPED REPORTS</span>

                <p className="mt-2 text-xs leading-5 text-muted">No source reports are listed for this place. Blue recall pins show city/district-level locations, not exact business addresses.</p>

              </div>

            )}

          </aside>

        </section>



        <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_300px]">

          <div>

            <h2 className="text-xl font-extrabold">Official & trusted sources</h2>

            <p className="mt-1 text-xs text-muted">Open publishers directly; items are not copied from their sites.</p>

            <div className="mt-4 grid gap-x-8 sm:grid-cols-2">

              {SOURCES.map((source) => (

                <a key={source.name} href={source.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 border-b border-black/10 py-3 text-sm hover:text-forest-deep">

                  <span><span className="block font-semibold">{source.name}</span><span className="text-xs text-muted">{source.type}</span></span>

                  <ExternalLink size={14} className="shrink-0" />

                </a>

              ))}

            </div>

          </div>

          <aside className="h-fit rounded-xl border border-orange/20 bg-orange/5 p-5">

            <div className="flex items-center gap-2 text-sm font-extrabold"><BellRing size={17} /> Alert delivery</div>

            <p className="mt-3 text-xs leading-5 text-muted">Your selected locations and topics are stored on this device and used to filter this page. Email alerts and automatic background updates are not connected yet.</p>

            <div className="mt-4 flex items-start gap-2 border-l-2 border-orange pl-3 text-xs leading-5 text-charcoal/75">

              <ShieldAlert size={15} className="mt-0.5 shrink-0 text-orange" />

              Verified event counts remain empty unless a linked source explicitly reports a location-specific event.

            </div>

          </aside>

        </section>

      </main>

    </div>

  )

}



function ActionMap({ raids, activeRaidId, activePlace, onSelectRaid, onSelectCluster }) {

  const containerRef = useRef(null)

  const mapRef = useRef(null)

  const [mapError, setMapError] = useState(false)

  const [mapReady, setMapReady] = useState(false)



  useEffect(() => {

    if (!containerRef.current) return undefined

    let map

    let disposed = false



    import('maplibre-gl').then(({ LngLatBounds, Map: MapLibreMap, NavigationControl, Popup, setWorkerUrl }) => {

      if (disposed) return

      setWorkerUrl(mapWorkerUrl)

      map = new MapLibreMap({

        container: containerRef.current,

        style: 'https://tiles.openfreemap.org/styles/liberty',

        center: [78.9629, 22.5937],

        zoom: 4.4,

        minZoom: 4.5,

        maxZoom: 13,

        attributionControl: true,

      })

      mapRef.current = map
      map.addControl(new NavigationControl({ showCompass: false }), 'top-right')

      map.on('error', () => setMapError(true))

      map.once('load', () => setMapReady(true))



      map.on('load', () => {

        const features = raids

          .filter((report) => Array.isArray(report.coordinates) && report.coordinates.length === 2)

          .map((report) => ({

            type: 'Feature',

            geometry: { type: 'Point', coordinates: report.coordinates },

            properties: { reportId: report.id, recordType: report.recordType || 'enforcement' },

          }))



        map.addSource('food-safety-reports', {

          type: 'geojson',

          data: { type: 'FeatureCollection', features },

          cluster: true,

          clusterMaxZoom: 10,

          clusterRadius: 48,

        })

        map.addLayer({

          id: 'report-clusters',

          type: 'circle',

          source: 'food-safety-reports',

          filter: ['has', 'point_count'],

          paint: {

            'circle-color': '#1676a3',

            'circle-radius': ['step', ['get', 'point_count'], 17, 10, 21, 50, 26],

            'circle-stroke-width': 2,

            'circle-stroke-color': '#ffffff',

          },

        })

        map.addLayer({

          id: 'report-cluster-count',

          type: 'symbol',

          source: 'food-safety-reports',

          filter: ['has', 'point_count'],

          layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 12 },

          paint: { 'text-color': '#ffffff' },

        })

        map.addLayer({

          id: 'report-points',

          type: 'circle',

          source: 'food-safety-reports',

          filter: ['!', ['has', 'point_count']],

          paint: {

            'circle-color': ['match', ['get', 'recordType'], 'recall', '#1676a3', '#bd3434'],

            'circle-radius': 8,

            'circle-stroke-width': 2,

            'circle-stroke-color': '#ffffff',

          },

        })



        map.on('click', 'report-clusters', (event) => {
          const cluster = map.queryRenderedFeatures(event.point, { layers: ['report-clusters'] })[0]
          if (!cluster) return

          map.getSource('food-safety-reports').getClusterLeaves(cluster.properties.cluster_id, 100, 0, (error, leaves) => {
            if (error || !leaves?.length) return
            onSelectCluster(leaves.map((leaf) => String(leaf.properties.reportId)))
          })
        })

        map.on('click', 'report-points', (event) => {

          const feature = map.queryRenderedFeatures(event.point, { layers: ['report-points'] })[0]

          const report = raids.find((item) => item.id === feature?.properties?.reportId)

          if (!report) return

          onSelectRaid(report.id)



          const popupContent = document.createElement('div')

          popupContent.style.cssText = 'max-width:260px;font:13px/1.45 sans-serif;color:#1d1d1b'

          const heading = document.createElement('strong')

          heading.textContent = report.title

          const details = document.createElement('p')

          details.textContent = `${report.recordType === 'recall' ? `FSSAI recall ${report.recall_id}` : 'FDA enforcement'} · ${report.location} · ${formatDate(report.published)}`

          popupContent.append(heading, details)

          if (report.product) {

            const product = document.createElement('p')

            product.textContent = `${report.brand || report.fbo_name} · ${report.product}`

            popupContent.append(product)

          }

          if (report.reason) {

            const reason = document.createElement('p')

            reason.textContent = report.reason

            popupContent.append(reason)

          }

          if (report.status || report.batch_lot) {

            const batchStatus = document.createElement('p')

            batchStatus.textContent = `Status: ${report.status || 'Not listed'} · Batch: ${report.batch_lot || 'Not listed'}`

            popupContent.append(batchStatus)

          }

          const accuracy = document.createElement('p')

          accuracy.textContent = report.locationPrecision || report.location_accuracy || 'Location accuracy not stated'

          popupContent.append(accuracy)

          const link = document.createElement('a')

          link.href = report.url

          link.target = '_blank'

          link.rel = 'noreferrer'

          link.textContent = 'Open original report'

          link.style.cssText = 'display:inline-block;margin-top:6px;color:#245b35;font-weight:700'

          popupContent.append(link)

          new Popup({ offset: 12 }).setLngLat(event.lngLat).setDOMContent(popupContent).addTo(map)

        })

        for (const layer of ['report-clusters', 'report-points']) {

          map.on('mouseenter', layer, () => { map.getCanvas().style.cursor = 'pointer' })

          map.on('mouseleave', layer, () => { map.getCanvas().style.cursor = '' })

        }



        if (features.length > 1) {

          const bounds = new LngLatBounds()

          raids.filter((report) => report.coordinates).forEach((report) => bounds.extend(report.coordinates))

          map.fitBounds(bounds, { padding: 72, maxZoom: 9, duration: 500 })

        } else if (features.length === 1) {

          map.flyTo({ center: features[0].geometry.coordinates, zoom: 8, duration: 500 })

        }

      })

    }).catch(() => setMapError(true))



    return () => {

      disposed = true

      map?.remove()
      mapRef.current = null

      setMapReady(false)

    }

  }, [raids, onSelectRaid, onSelectCluster])



  useEffect(() => {

    if (!activeRaidId || !mapRef.current) return

    const raid = raids.find((item) => item.id === activeRaidId)

    if (raid?.coordinates) mapRef.current.flyTo({ center: raid.coordinates, zoom: 8, duration: 500 })

  }, [activeRaidId, raids])



  useEffect(() => {

    if (!activeRaidId && MAP_CENTERS[activePlace] && mapRef.current) {

      mapRef.current.flyTo({ center: MAP_CENTERS[activePlace], zoom: activePlace === 'Maharashtra' ? 5.3 : 8, duration: 500 })

    }

  }, [activePlace, activeRaidId])



  return (

    <div className="relative h-[420px] overflow-hidden rounded-xl border border-black/10 bg-[#e8ece6] sm:h-[560px]">

      <div ref={containerRef} className="h-full w-full" aria-label="Interactive map of source-verified FDA recalls and enforcement reports across India" />

      {mapError && (

        <div className="absolute bottom-3 left-3 max-w-xs border border-black/10 bg-white/95 px-3 py-2 text-xs leading-5 shadow-sm">

          Map tiles could not load. Check your connection; source-linked reports remain available beside the map.

        </div>

      )}

      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-3 py-2 text-[11px] font-bold shadow-md backdrop-blur">

        <span className={`h-2 w-2 rounded-full ${mapError ? 'bg-red-600' : mapReady ? 'bg-emerald-600' : 'bg-amber-500'}`} />

        India · {raids.filter((report) => report.recordType === 'recall').length} city-level recall pins · {mapError ? 'map unavailable' : mapReady ? 'map ready' : 'loading map'}

      </div>

    </div>

  )

}



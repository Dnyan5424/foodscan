import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useToast } from '../components/Toast'

const SCANNER_ELEMENT_ID = 'barcode-scanner-region'

export default function BarcodeScanner() {
  const [scanning, setScanning] = useState(false)
  const [product, setProduct] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [manualCode, setManualCode] = useState('')
  const [lookingUp, setLookingUp] = useState(false)
  const [autoRestart, setAutoRestart] = useState(false)
  const [geoRisk, setGeoRisk] = useState(null)
  const [riskLocation, setRiskLocation] = useState('')
  const scannerRef = useRef(null)
  const toast = useToast()
  const navigate = useNavigate()

  // Only stop the camera on actual unmount — the camera itself is started
  // by a user click (see startScanning), never automatically on mount, to
  // avoid a known html5-qrcode + React StrictMode race where the scanner
  // tries to attach before/during the dev-mode double effect invoke.
  useEffect(() => {
    return () => stopScanning()
  }, [])

  // Handles "Scan another": product must be cleared (which re-mounts the
  // scanner div, since it only renders when !product) BEFORE we can safely
  // call startScanning again. This effect fires only when resetAll()
  // explicitly requests it — never on initial mount.
  useEffect(() => {
    if (autoRestart && !product) {
      setAutoRestart(false)
      startScanning()
    }
  }, [autoRestart, product])

  async function startScanning() {
    setError('')
    setProduct(null)
    setAnalysis(null)

    // Guards against the element not being in the DOM yet for any reason
    // (e.g. rapid repeated clicks) rather than letting html5-qrcode throw.
    if (!document.getElementById(SCANNER_ELEMENT_ID)) {
      setError('Scanner region not ready — please try again.')
      return
    }

    setScanning(true)
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID)
    scannerRef.current = scanner
    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        async (decodedText) => {
          await stopScanning()
          handleBarcode(decodedText)
        },
        () => {} // ignore per-frame "not found" noise
      )
    } catch (err) {
      setError("Couldn't access the camera — check permissions, or use Upload/type the number instead.")
      setScanning(false)
    }
  }

  async function stopScanning() {
    const scanner = scannerRef.current
    scannerRef.current = null
    if (scanner) {
      try { await scanner.stop() } catch (e) { /* already stopped or never fully started */ }
      try { scanner.clear() } catch (e) { /* nothing to clear */ }
    }
    setScanning(false)
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    await stopScanning()
    setError('')
    setProduct(null)
    setAnalysis(null)

    if (!document.getElementById(SCANNER_ELEMENT_ID)) {
      setError('Scanner region not ready — please try again.')
      return
    }

    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID)
    try {
      const decodedText = await scanner.scanFile(file, true)
      handleBarcode(decodedText)
    } catch (err) {
      setError("Couldn't read a barcode from that photo — make sure the barcode is in focus and fills most of the frame, or try live scanning instead.")
    } finally {
      try { scanner.clear() } catch (e) { /* nothing to clear */ }
    }
  }

  async function handleManualLookup(e) {
    e.preventDefault()
    if (!manualCode.trim()) return
    await stopScanning()
    setLookingUp(true)
    await handleBarcode(manualCode.trim())
    setLookingUp(false)
  }

  async function fetchGeoRisk(productName, location) {
    try {
      const risk = await api.getGeoRisk(productName, location)
      setGeoRisk(risk)
    } catch (err) {
      setGeoRisk(null) // silent — this is a supplementary signal, not core to the scan result
    }
  }

  async function handleBarcode(code) {
    setError('')
    try {
      const data = await api.lookupBarcode(code)
      setProduct(data)
      if (data.name) fetchGeoRisk(data.name, riskLocation)
      if (data.ingredientsText) {
        setAnalyzing(true)
        try {
          const result = await api.analyzeIngredients(data.ingredientsText)
          setAnalysis(result)
        } catch (err) {
          setError(`Ingredient analysis unavailable: ${err.message}`)
        } finally {
          setAnalyzing(false)
        }
      }
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSaveProduct() {
    // No expiry date comes from Open Food Facts — user fills that in on the tracker.
    toast?.('Add the expiry date on the Expiry Tracker to finish saving this product.')
    navigate('/expiry-tracker')
  }

  function resetAll() {
    stopScanning()
    setProduct(null)
    setAnalysis(null)
    setError('')
    setManualCode('')
    setGeoRisk(null)
    setRiskLocation('')
    setAutoRestart(true) // triggers the gated effect above once product actually clears
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-14">
      <p className="text-orange font-semibold text-sm mb-3">Barcode scanner</p>
      <h1 className="text-3xl font-extrabold mb-6">Scan a product barcode</h1>

      {!product && (
        <div className="bg-white rounded-card shadow-soft border border-black/5 p-6 text-center">
          <div id={SCANNER_ELEMENT_ID} className={scanning ? 'rounded-xl overflow-hidden mb-4' : 'hidden'} />

          {!scanning && (
            <div className="h-40 rounded-xl border-2 border-dashed border-black/10 flex items-center justify-center text-muted text-sm mb-4">
              Camera preview will appear here
            </div>
          )}

          {error && <p className="text-danger text-sm mb-3">{error}</p>}

          <div className="flex gap-3 justify-center flex-wrap">
            {!scanning ? (
              <button onClick={startScanning} className="rounded-pill bg-forest text-white font-semibold py-3 px-6 text-sm hover:bg-forest-deep transition-colors">
                Start camera
              </button>
            ) : (
              <button onClick={stopScanning} className="rounded-pill border border-black/10 font-semibold py-3 px-6 text-sm hover:bg-black/5 transition-colors">
                Stop camera
              </button>
            )}
            <label className="rounded-pill border-2 border-forest text-forest-deep font-semibold py-3 px-6 text-sm hover:bg-sage transition-colors cursor-pointer">
              Upload barcode photo
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <p className="text-xs text-muted mt-4">Looks up ingredients via Open Food Facts — works for most packaged, barcoded products.</p>

          <div className="border-t border-black/5 mt-5 pt-5">
            <p className="text-xs font-semibold text-muted mb-2">Or type the barcode number printed under it</p>
            <form onSubmit={handleManualLookup} className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 8901234567890"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 rounded-pill border border-black/10 px-4 py-2.5 text-sm focus:border-forest outline-none"
              />
              <button
                type="submit"
                disabled={lookingUp || !manualCode.trim()}
                className="rounded-pill bg-forest text-white font-semibold px-5 py-2.5 text-sm hover:bg-forest-deep transition-colors disabled:opacity-50"
              >
                {lookingUp ? 'Looking up...' : 'Look up'}
              </button>
            </form>
          </div>
        </div>
      )}

      {product && (
        <div className="bg-white rounded-card shadow-soft border border-black/5 p-8">
          <div className="flex items-start gap-4 mb-3">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-xl border border-black/5" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-sage flex items-center justify-center text-forest-deep/40 text-xs shrink-0">No image</div>
            )}
            <div className="flex-1">
              <h2 className="font-heading font-bold text-lg mb-0.5">{product.name || 'Unnamed product'}</h2>
              <p className="text-sm text-muted">{product.brand || 'Brand not available'}</p>
              <p className="text-xs text-muted mt-1">Barcode: {product.barcode}</p>
            </div>
            {product.nutriScore && (
              <span className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center font-heading font-bold text-sm shrink-0">
                {product.nutriScore.toUpperCase()}
              </span>
            )}
          </div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-success mb-5">
            <span aria-hidden="true">✓</span> Product found — Open Food Facts
          </p>

          <div className="mb-5">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a city/area to check local reports (optional)"
                value={riskLocation}
                onChange={(e) => setRiskLocation(e.target.value)}
                className="flex-1 rounded-pill border border-black/10 px-4 py-2 text-xs focus:border-forest outline-none"
              />
              <button
                onClick={() => fetchGeoRisk(product.name, riskLocation)}
                className="rounded-pill bg-sage text-forest-deep font-semibold px-4 py-2 text-xs hover:bg-forest hover:text-white transition-colors"
              >
                Check
              </button>
            </div>
            {geoRisk && (
              <div className={`rounded-lg px-3 py-2 text-xs font-medium ${
                geoRisk.finalRisk === 'high' ? 'bg-danger/10 text-danger'
                : geoRisk.finalRisk === 'medium' ? 'bg-warn/10 text-warn'
                : 'bg-success/10 text-success'
              }`}>
                <span className="uppercase font-bold">{geoRisk.finalRisk} risk</span> — {geoRisk.message}
                <span className="block text-[10px] opacity-70 mt-1">
                  Based on {geoRisk.totalReports} community complaint{geoRisk.totalReports === 1 ? '' : 's'} for this product{geoRisk.location ? ` in ${geoRisk.location}` : ''}.
                </span>
              </div>
            )}
          </div>

          {product.allergens?.length > 0 && (
            <p className="text-xs bg-warn/10 text-warn font-medium rounded-lg px-3 py-2 mb-5">
              ⚠ Allergens: {product.allergens.map((a) => a.replace('en:', '')).join(', ')}
            </p>
          )}

          <SectionLabel>Nutrition <span className="text-muted font-normal normal-case">(per 100g)</span></SectionLabel>
          <div className="grid grid-cols-4 gap-2 mb-5">
            <NutrientBox label="Calories" value={product.nutriments?.calories} unit=" kcal" />
            <NutrientBox label="Fat" value={product.nutriments?.fat} unit="g" />
            <NutrientBox label="Sugar" value={product.nutriments?.sugar} unit="g" />
            <NutrientBox label="Salt" value={product.nutriments?.salt} unit="g" />
            <NutrientBox label="Protein" value={product.nutriments?.protein} unit="g" />
            <NutrientBox label="Carbs" value={product.nutriments?.carbs} unit="g" />
            <NutrientBox label="Saturated Fat" value={product.nutriments?.saturatedFat} unit="g" />
          </div>

          <SectionLabel>Ingredients</SectionLabel>
          <p className="text-sm text-charcoal/85 mb-5">
            {product.ingredientsText || <span className="text-muted italic">Not available</span>}
          </p>

          <SectionLabel>Product details</SectionLabel>
          <div className="space-y-1.5 mb-5">
            <DetailRow label="Brand" value={product.brand} />
            <DetailRow label="Category" value={product.category} />
            <DetailRow label="Quantity" value={product.quantity} />
            <DetailRow label="Barcode" value={product.barcode} />
          </div>

          <SectionLabel>Food information</SectionLabel>
          <div className="space-y-1.5 mb-6">
            <DetailRow label="Nutri-Score" value={product.nutriScore?.toUpperCase()} />
            <DetailRow label="NOVA group" value={product.novaGroup} />
            <DetailRow label="Additives" value={product.additives?.length ? product.additives.join(', ') : 'None detected'} />
          </div>

          {analyzing && <p className="text-sm text-muted mb-4">Analyzing ingredients...</p>}

          {analysis && (
            <div className="mb-6 space-y-4">
              <SectionLabel>AI ingredient analysis</SectionLabel>
              <p className="text-sm text-charcoal/85">{analysis.summary}</p>
              {analysis.risky_ingredients?.length > 0 && (
                <div className="space-y-2">
                  {analysis.risky_ingredients.map((r) => (
                    <div key={r.name} className="bg-danger/5 rounded-lg px-3 py-2">
                      <p className="text-sm font-semibold">{r.name}</p>
                      <p className="text-xs text-charcoal/70">{r.reason}</p>
                      {r.alternative && <p className="text-xs text-forest mt-1">Alternative: {r.alternative}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && <p className="text-danger text-sm mb-4">{error}</p>}

          <p className="text-[11px] text-muted border-t border-black/5 pt-4 mb-6">
            Product data retrieved from Open Food Facts based on the scanned barcode.
          </p>

          <div className="flex gap-3">
            <button onClick={handleSaveProduct} className="flex-1 rounded-pill bg-forest text-white font-semibold py-3 text-sm hover:bg-forest-deep transition-colors">
              Add to expiry tracker
            </button>
            <button onClick={resetAll} className="flex-1 rounded-pill border border-black/10 font-semibold py-3 text-sm hover:bg-black/5 transition-colors">
              Scan another
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }) {
  return <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">{children}</p>
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-charcoal/85">{value || value === 0 ? value : <span className="text-muted italic font-normal">Not available</span>}</span>
    </div>
  )
}

function NutrientBox({ label, value, unit }) {
  return (
    <div className="bg-sage rounded-xl p-3 text-center">
      <p className="text-sm font-bold text-forest-deep">{value != null ? `${value}${unit}` : 'N/A'}</p>
      <p className="text-[10px] text-muted mt-0.5">{label}</p>
    </div>
  )
}
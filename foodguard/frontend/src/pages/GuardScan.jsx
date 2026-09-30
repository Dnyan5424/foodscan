
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ScanLine,
  Barcode,
  Camera,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Upload,
  Loader2,
  ImageIcon,
  AlertTriangle,
  RotateCcw,
  Info,
  FlaskConical,
} from 'lucide-react'
import { analyzeFood, getFoodModelReadiness } from '../services/visionApi'

const FOOD_OPTIONS = [
  { value: 'turmeric', label: 'Turmeric Powder' },
  { value: 'chilli', label: 'Red Chilli Powder' },
  { value: 'flour', label: 'Wheat Flour' },
  { value: 'pulses', label: 'Pulses' },
  { value: 'salt', label: 'Salt' },
  { value: 'milk', label: 'Milk' },
]

const LOW_CONFIDENCE_THRESHOLD = 0.5

export default function GuardScan() {
  const [mode, setMode] = useState('packaged')
  const [selectedFood, setSelectedFood] = useState('turmeric')
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [foodReadiness, setFoodReadiness] = useState(null)
  const captureInputRef = useRef(null)
  const uploadInputRef = useRef(null)

  useEffect(() => {
    let active = true
    getFoodModelReadiness()
      .then((readiness) => {
        if (active) setFoodReadiness(readiness)
      })
      .catch(() => {
        if (active) setFoodReadiness({})
      })

    return () => {
      active = false
    }
  }, [])

  function handleImageFile(file) {
    if (!file) return

    const isValidImage = file.type.startsWith('image/')
    if (!isValidImage) {
      setError('Please upload a valid food image.')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Please use a smaller image under 8MB.')
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedImage(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
    setError('')
  }

  async function handleAnalyze() {
    if (!selectedImage) {
      setError('Please select or capture an image.')
      return
    }

    if (!foodReadiness?.[selectedFood]) {
      setError(`The ${selectedFoodOption?.label || 'selected food'} model is not trained yet. Add labeled images and train it first.`)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await analyzeFood(selectedFood, selectedImage)
      setResult(response)
    } catch (err) {
      setError(err.message || 'Unable to analyze this image. Please try another clear photo.')
    } finally {
      setLoading(false)
    }
  }

  const selectedFoodOption = FOOD_OPTIONS.find((option) => option.value === selectedFood)
  const className = String(result?.class_name || result?.result || '')
  const predictedClass = Number.parseFloat(className.match(/^\s*(\d+(?:\.\d+)?)/)?.[1] || '')
  const predictionLabel = selectedFood === 'turmeric' && Number.isFinite(predictedClass)
    ? `${className.replace(/%?\s*adulteration$/i, '')}% adulteration class`
    : `${className} class`
  const confidence = Math.min(1, Math.max(0, Number(result?.confidence) || 0))
  const confidencePercent = Math.round(confidence * 100)
  const isLowConfidence = confidence < LOW_CONFIDENCE_THRESHOLD
  const isAnomaly = typeof result?.is_anomaly === 'boolean'
    ? result.is_anomaly
    : Number.isFinite(predictedClass) && predictedClass > 0
  const hasScreeningStatus = typeof result?.is_anomaly === 'boolean' || Number.isFinite(predictedClass)
  const screeningLabel = hasScreeningStatus
    ? isAnomaly ? 'Possible Visual Anomaly' : 'Normal Visual Class Predicted'
    : 'Visual Screening Complete'
  const resultExplanation = isAnomaly
    ? `The model assigned this image to a class other than its normal ${selectedFoodOption?.label.toLowerCase() || 'food'} class. ${isLowConfidence ? 'Confidence is low, so retake the image in even lighting before drawing conclusions.' : 'Visual patterns alone cannot establish whether food is adulterated.'}`
    : `The model matched this image to its normal ${selectedFoodOption?.label.toLowerCase() || 'food'} class. This does not rule out adulteration or confirm that the food is safe.`
  const modelReady = foodReadiness?.[selectedFood] === true

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-orange/10 text-orange text-xs font-semibold">
          <Sparkles size={14} />
          GuardScan
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Scan. Check. <span className="text-orange">Stay Safe.</span>
        </h1>

        <p className="text-muted text-sm sm:text-base leading-relaxed">
          Quickly scan your food product to check expiry details, ingredients,
          nutrition information, and safety data.
        </p>
      </div>

      <div className="mb-8 flex w-full max-w-md gap-2 rounded-full border border-black/5 bg-white p-1.5 shadow-soft">
        <button
          type="button"
          onClick={() => setMode('packaged')}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'packaged' ? 'bg-forest text-white' : 'text-muted hover:bg-black/5'}`}
        >
          📦 Packaged Food
        </button>
        <button
          type="button"
          onClick={() => setMode('unpacked')}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${mode === 'unpacked' ? 'bg-forest text-white' : 'text-muted hover:bg-black/5'}`}
        >
          🌿 Unpacked Food
        </button>
      </div>

      {mode === 'packaged' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/expiry-tracker/scan"
            className="group relative overflow-hidden bg-white rounded-3xl border border-black/5 shadow-soft p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-orange/5 transition-transform duration-500 group-hover:scale-150" />
            <div className="relative">
              <div className="flex items-start justify-between mb-7">
                <div className="w-14 h-14 rounded-2xl bg-orange/10 text-orange flex items-center justify-center">
                  <ScanLine size={28} strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange/10 text-orange">OCR</span>
              </div>

              <h2 className="font-heading font-bold text-2xl mb-2">Scan Label</h2>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Take or upload a photo of the package label and let OCR extract important product information automatically.
              </p>

              <div className="space-y-2 mb-7">
                <Feature text="Expiry date detection" />
                <Feature text="Batch number extraction" />
                <Feature text="Product name recognition" />
              </div>

              <div className="flex items-center gap-2 text-forest font-semibold text-sm">
                Start scanning
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          <Link
            to="/expiry-tracker/scan-barcode"
            className="group relative overflow-hidden bg-white rounded-3xl border border-black/5 shadow-soft p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-forest/5 transition-transform duration-500 group-hover:scale-150" />
            <div className="relative">
              <div className="flex items-start justify-between mb-7">
                <div className="w-14 h-14 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                  <Barcode size={28} strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-forest/10 text-forest">FAST</span>
              </div>

              <h2 className="font-heading font-bold text-2xl mb-2">Scan Barcode</h2>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Scan or enter the barcode number to retrieve structured product information from Open Food Facts.
              </p>

              <div className="space-y-2 mb-7">
                <Feature text="Ingredients information" />
                <Feature text="Nutrition facts" />
                <Feature text="Food safety information" />
              </div>

              <div className="flex items-center gap-2 text-forest font-semibold text-sm">
                Scan barcode
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      )}

      {mode === 'unpacked' && (
        <div className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-soft sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest/10 text-forest">
              <ImageIcon size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Unpacked Food</p>
              <h2 className="font-heading text-xl font-bold">AI Visual Screening</h2>
            </div>
          </div>

          <p className="mb-4 text-sm text-muted">
            Select food and upload or take a photo for a basic visual screening.
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">Food Type</label>
              <select
                value={selectedFood}
                onChange={(event) => {
                  setSelectedFood(event.target.value)
                  setResult(null)
                  setError('')
                }}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest"
              >
                {FOOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {foodReadiness && !modelReady && (
              <p className="rounded-xl border border-orange/20 bg-orange/5 px-3 py-2 text-xs leading-relaxed text-orange">
                No trained model for {selectedFoodOption?.label} yet. Add labeled images under <span className="font-semibold">ml_service/dataset/{selectedFood}/&lt;class-name&gt;/</span>, then train it with <span className="font-semibold">python train.py --food {selectedFood}</span>.
              </p>
            )}
            {!foodReadiness && (
              <p className="rounded-xl border border-black/10 bg-gray-50 px-3 py-2 text-xs text-muted">
                Could not check model availability. Confirm the ML service is running.
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/10 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-charcoal hover:bg-black/5">
                <Camera size={16} />
                Take Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={captureInputRef}
                  onChange={(event) => {
                    handleImageFile(event.target.files?.[0])
                    event.currentTarget.value = ''
                  }}
                  className="hidden"
                />
              </label>

              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/10 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-charcoal hover:bg-black/5">
                <Upload size={16} />
                Upload Image
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  ref={uploadInputRef}
                  onChange={(event) => {
                    handleImageFile(event.target.files?.[0])
                    event.currentTarget.value = ''
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {previewUrl && !result && (
              <div className="rounded-2xl border border-black/5 bg-sage/20 p-3">
                <img src={previewUrl} alt="Preview of the food item" className="max-h-56 w-full rounded-xl object-cover" />
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-muted">
              <ShieldCheck size={14} className="text-forest" />
              Use a clear photo in good lighting.
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !selectedImage || !modelReady}
              className="w-full rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white transition hover:bg-forest/90 disabled:cursor-not-allowed disabled:bg-forest/50"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing image...
                </span>
              ) : (
                'Analyze'
              )}
            </button>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </p>
            )}

            {result && (
              <section aria-live="polite" className="overflow-hidden rounded-2xl border border-black/10 bg-white">
                <div className="flex items-center gap-3 border-b border-black/5 bg-sage/20 p-4">
                  {previewUrl && (
                    <img src={previewUrl} alt={`Analyzed ${selectedFoodOption?.label || 'food'}`} className="h-14 w-14 rounded-xl object-cover" />
                  )}
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{selectedFoodOption?.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-charcoal">AI Visual Screening</p>
                    <p className="mt-0.5 text-[11px] text-muted">Image analyzed</p>
                  </div>
                </div>

                <div className="space-y-5 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange/10 text-orange">
                      <AlertTriangle size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-charcoal">{screeningLabel}</h3>
                        {isLowConfidence && (
                          <span className="rounded-full bg-orange/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange">
                            Low confidence
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted">A visual screening signal, not a finding of adulteration.</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-muted">AI screening confidence</p>
                        <p className="mt-1 text-3xl font-extrabold leading-none text-charcoal">{confidencePercent}%</p>
                      </div>
                      <Info size={16} className="mb-1 shrink-0 text-muted" aria-label="Confidence describes the model's support for its class prediction, not a laboratory measurement." />
                    </div>
                    <div
                      role="meter"
                      aria-label="AI screening confidence"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={confidencePercent}
                      className="h-2 overflow-hidden rounded-full bg-black/10"
                    >
                      <div className="h-full rounded-full bg-orange transition-[width] duration-500" style={{ width: `${confidencePercent}%` }} />
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-muted">
                      Confidence shows how strongly the model supports its class prediction. It is not a probability that food is safe or adulterated.
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted">Model prediction</p>
                    <p className="mt-1 text-sm font-bold text-charcoal">{predictionLabel || 'Unclassified'}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted">This is a dataset class label, not a measured adulteration percentage.</p>
                  </div>

                  <div className="border-t border-black/5 pt-4">
                    <h4 className="text-xs font-bold text-charcoal">Why this result?</h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{resultExplanation}</p>
                  </div>

                  <div className="border-t border-black/5 pt-4">
                    <h4 className="text-xs font-bold text-charcoal">Improve your scan</h4>
                    <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-muted">
                      <li>Natural daylight</li>
                      <li>No flash</li>
                      <li>15-20 cm away</li>
                      <li>Keep powder in focus</li>
                      <li>Plain background</li>
                      <li>Avoid shadows</li>
                    </ul>
                  </div>

                  <div className="flex gap-2 rounded-xl border border-forest/10 bg-forest/5 p-3">
                    <FlaskConical size={16} className="mt-0.5 shrink-0 text-forest" />
                    <p className="text-[11px] leading-relaxed text-muted">
                      <span className="font-bold text-charcoal">For confirmation:</span> AI visual screening cannot confirm chemical adulteration. Laboratory testing is required.
                    </p>
                  </div>

                  <details className="border-t border-black/5 pt-3">
                    <summary className="cursor-pointer text-xs font-semibold text-forest">View scan details</summary>
                    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[11px]">
                      <dt className="text-muted">Food</dt><dd className="font-medium text-charcoal">{selectedFoodOption?.label}</dd>
                      <dt className="text-muted">Model</dt><dd className="font-medium text-charcoal">MobileNetV3-Small</dd>
                      <dt className="text-muted">Prediction</dt><dd className="font-medium text-charcoal">{predictionLabel || 'Unclassified'}</dd>
                      <dt className="text-muted">Screening type</dt><dd className="font-medium text-charcoal">RGB visual analysis</dd>
                      <dt className="text-muted">Status</dt><dd className="font-medium text-charcoal">{isLowConfidence ? 'Low-confidence result' : 'Model screening result'}</dd>
                    </dl>
                  </details>

                  <div className="grid grid-cols-2 gap-2 border-t border-black/5 pt-4">
                    <button
                      type="button"
                      onClick={() => captureInputRef.current?.click()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 px-3 py-2.5 text-xs font-semibold text-charcoal transition hover:bg-gray-50"
                    >
                      <Camera size={15} /> Retake Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => uploadInputRef.current?.click()}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-forest/90"
                    >
                      <RotateCcw size={15} /> Scan Again
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      <div className="mt-14">
        <div className="text-center mb-7">
          <h2 className="font-heading text-xl font-bold mb-2">How GuardScan works</h2>
          <p className="text-muted text-sm">Get useful product information in just a few steps.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Step number="01" icon={<Camera size={19} />} title="Scan" text="Capture the label or barcode." />
          <Step number="02" icon={<ScanLine size={19} />} title="Analyze" text="GuardScan processes the product data." />
          <Step number="03" icon={<ShieldCheck size={19} />} title="Check" text="Review expiry and safety information." />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-muted text-xs">
        <ShieldCheck size={15} className="text-forest" />
        Your scan is processed securely
      </div>
    </div>
  )
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckCircle2 size={16} className="text-forest shrink-0" />
      <span className="text-gray-600">{text}</span>
    </div>
  )
}

function Step({ number, icon, title, text }) {
  return (
    <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-soft">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-bold text-orange">{number}</span>
        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-forest">{icon}</div>
      </div>

      <h3 className="font-heading font-bold text-sm mb-1">{title}</h3>
      <p className="text-muted text-xs leading-relaxed">{text}</p>
    </div>
  )
}


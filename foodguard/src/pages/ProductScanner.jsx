import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useToast } from '../components/Toast'

export default function ProductScanner() {
  const [mode, setMode] = useState('choose') // 'choose' | 'camera' | 'review'
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [cameraError, setCameraError] = useState('')

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    return () => stopCamera()
  }, [])

  async function startCamera() {
    setCameraError('')
    setMode('camera')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (err) {
      setCameraError("Couldn't access the camera — check your browser's camera permission, or use Upload Photo instead.")
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (!blob) return
      const capturedFile = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
      stopCamera()
      setFile(capturedFile)
      setPreview(URL.createObjectURL(capturedFile))
      setMode('choose')
      setResult(null)
      setError('')
    }, 'image/jpeg', 0.92)
  }

  function handleUpload(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
    setError('')
  }

  async function handleScan() {
    if (!file) return
    setScanning(true)
    setError('')
    try {
      const data = await api.scanLabel(file)
      setResult({
        name: '',
        category: '',
        expiryDate: normalizeDate(data.expiryDate),
        manufactureDate: normalizeDate(data.manufactureDate),
        batchNumber: data.batchNumber || '',
        brand: '',
        lowConfidence: data.lowConfidence,
        nothingDetected: !data.expiryDate && !data.manufactureDate && !data.batchNumber,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setScanning(false)
    }
  }

  async function handleConfirm() {
    try {
      await api.createProduct({ ...result, source: 'scan', quantity: 1 })
      toast?.('Product added successfully')
      navigate('/expiry-tracker')
    } catch (err) {
      setError(err.message)
    }
  }

  function resetAll() {
    stopCamera()
    setFile(null)
    setPreview(null)
    setResult(null)
    setError('')
    setMode('choose')
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-14">
      <p className="text-orange font-semibold text-sm mb-3">Product scanner</p>
      <h1 className="text-3xl font-extrabold mb-6">Scan your food label</h1>

      {mode === 'camera' && (
        <div className="bg-white rounded-card shadow-soft border border-black/5 p-6 text-center">
          {cameraError ? (
            <>
              <p className="text-danger text-sm mb-4">{cameraError}</p>
              <button onClick={() => setMode('choose')} className="rounded-pill border border-black/10 px-6 py-3 text-sm font-semibold hover:bg-black/5 transition-colors">
                Back
              </button>
            </>
          ) : (
            <>
              <div className="rounded-xl overflow-hidden bg-black mb-4 relative">
                <video ref={videoRef} playsInline muted className="w-full max-h-80 object-contain" />
                <div className="absolute inset-6 border-2 border-forest/70 rounded-lg pointer-events-none" />
              </div>
              <p className="text-xs text-muted mb-4">Line the label up inside the frame, then capture.</p>
              <div className="flex gap-3">
                <button onClick={capturePhoto} className="flex-1 rounded-pill bg-forest text-white font-semibold py-3 text-sm hover:bg-forest-deep transition-colors">
                  Capture photo
                </button>
                <button onClick={() => { stopCamera(); setMode('choose') }} className="flex-1 rounded-pill border border-black/10 font-semibold py-3 text-sm hover:bg-black/5 transition-colors">
                  Cancel
                </button>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {mode === 'choose' && !result && (
        <div className="bg-white rounded-card shadow-soft border border-black/5 p-8 text-center">
          {preview ? (
            <img src={preview} alt="Label preview" className="max-h-64 mx-auto rounded-xl mb-4" />
          ) : (
            <div className="h-48 rounded-xl border-2 border-dashed border-black/10 flex items-center justify-center text-muted text-sm mb-4">
              No image selected
            </div>
          )}

          {!preview ? (
            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <button onClick={startCamera} className="flex-1 rounded-pill bg-forest text-white font-semibold py-3 text-sm hover:bg-forest-deep transition-colors">
                Take photo
              </button>
              <label className="flex-1 rounded-pill border-2 border-forest text-forest-deep font-semibold py-3 text-sm hover:bg-sage transition-colors cursor-pointer text-center">
                Upload photo
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <button
                onClick={handleScan}
                disabled={scanning}
                className="flex-1 rounded-pill bg-forest text-white font-semibold py-3 text-sm hover:bg-forest-deep transition-colors disabled:opacity-50"
              >
                {scanning ? 'Scanning label...' : 'Scan label'}
              </button>
              <button onClick={resetAll} className="flex-1 rounded-pill border border-black/10 font-semibold py-3 text-sm hover:bg-black/5 transition-colors">
                Choose a different photo
              </button>
            </div>
          )}
          <p className="text-xs text-muted mt-2">Best results: flat label, good lighting, no glare, text filling most of the frame.</p>
          {error && <p className="text-danger text-sm mt-3">{error}</p>}
        </div>
      )}

      {result && (
        <div className="bg-white rounded-card shadow-soft border border-black/5 p-8">
          <h2 className="font-heading font-bold text-lg mb-1">Review detected information</h2>
          <p className="text-xs text-muted mb-3">OCR isn't perfect — please check every field before saving.</p>
          {result.nothingDetected && (
            <p className="text-xs bg-warn/10 text-warn font-medium rounded-lg px-3 py-2 mb-4">
              Couldn't detect any dates or batch number from this photo. Try again with better lighting, the label flat and in focus, or fill the fields in manually below.
            </p>
          )}
          {!result.nothingDetected && result.lowConfidence && (
            <p className="text-xs bg-warn/10 text-warn font-medium rounded-lg px-3 py-2 mb-4">
              This scan had low confidence — double-check the fields below carefully.
            </p>
          )}
          <div className="space-y-4">
            <Field label="Product name" required value={result.name} onChange={(v) => setResult({ ...result, name: v })} />
            <Field label="Category" value={result.category} onChange={(v) => setResult({ ...result, category: v })} />
            <Field label="Manufacture date" type="date" value={result.manufactureDate} onChange={(v) => setResult({ ...result, manufactureDate: v })} />
            <Field label="Expiry date" type="date" required value={result.expiryDate} onChange={(v) => setResult({ ...result, expiryDate: v })} />
            <Field label="Batch number" value={result.batchNumber} onChange={(v) => setResult({ ...result, batchNumber: v })} />
            <Field label="Brand" value={result.brand} onChange={(v) => setResult({ ...result, brand: v })} />
          </div>
          {error && <p className="text-danger text-sm mt-3">{error}</p>}
          <div className="flex gap-3 mt-6">
            <button onClick={handleConfirm} className="flex-1 rounded-pill bg-forest text-white font-semibold py-3 text-sm hover:bg-forest-deep transition-colors">
              Confirm & save
            </button>
            <button onClick={resetAll} className="flex-1 rounded-pill border border-black/10 font-semibold py-3 text-sm hover:bg-black/5 transition-colors">
              Scan again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function normalizeDate(raw) {
  if (!raw) return ''
  const parts = raw.split(/[\/\-.]/)
  if (parts.length !== 3) return ''
  let [d, m, y] = parts
  if (y.length === 2) y = `20${y}`
  if (d.length === 4) { [y, m, d] = [d, parts[1], parts[2]] }
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted mb-1 block">{label}</span>
      <input {...props} value={props.value} onChange={(e) => props.onChange(e.target.value)} className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm focus:border-forest outline-none" />
    </label>
  )
}
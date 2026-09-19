import sharp from 'sharp'
import Tesseract from 'tesseract.js'
import { ocrSpaceExtractText } from './ocrSpaceService.js'

const MONTH_MAP = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 }

// Matches BOTH numeric dates (24/04/2026) and month-name dates (24-Apr-23)
const ANY_DATE = '(?:\\d{1,2}[\\/\\-.]\\d{1,2}[\\/\\-.]\\d{2,4}|\\d{1,2}[\\-\\/\\s][A-Za-z]{3,9}[\\-\\/\\s]\\d{2,4})'
const DATE_PATTERN = new RegExp(`\\b(${ANY_DATE})\\b`, 'g')
const MFG_LABEL_PATTERN = new RegExp(`\\b(mfg|manufactured|packed|packing)\\b[^0-9]{0,20}(${ANY_DATE})`, 'i')
const EXP_LABEL_PATTERN = new RegExp(`\\b(exp|expiry|expires|use by|best before)\\b[^0-9]{0,20}(${ANY_DATE})`, 'i')
const BATCH_PATTERN = /\b(?:batch\s*no\.?|batch|b\.?no\.?|lot)\s*[:#]?\s*([A-Z0-9\-]{3,15})\b/i

// Handles labels that give a shelf life instead of an absolute expiry date,
// e.g. "Best Before: 90 Days" — common on Indian packaged snacks.
const RELATIVE_SHELF_LIFE_PATTERN = /\b(?:best before|use by|expiry|shelf life)\b[^0-9]{0,15}(\d{1,4})\s*(day|days|month|months|year|years)\b/i

// A first line that reads like a plain product name (Title Case, letters
// only, short) and isn't obviously the label-printing vendor's own
// boilerplate (many generic label printers stamp their own name/software
// on every label they produce — that's not the food product's name).
const NAME_BLOCKLIST = ['barcode', 'label', 'guru', 'software', 'address', 'line', 'free', 'food', 'packing', 'packed', 'date', 'best', 'before', 'batch', 'weight', 'standard', 'metrology', 'road', 'gujarat', 'net']

/**
 * Cleans up a photo before OCR.
 */
async function preprocessImage(buffer, { binarize = false } = {}) {
  const image = sharp(buffer).rotate()
  const metadata = await image.metadata()
  const longEdge = Math.max(metadata.width || 0, metadata.height || 0)
  const scale = longEdge > 0 && longEdge < 1600 ? Math.ceil(1600 / longEdge) : 1

  let pipeline = image
    .resize({ width: (metadata.width || 800) * scale })
    .grayscale()
    .normalize()
    .sharpen()

  if (binarize) pipeline = pipeline.threshold(160)
  return pipeline.toBuffer()
}

function normalizeOcrText(text) {
  return text
    .replace(/[oO](?=\d)|(?<=\d)[oO]/g, '0')
    .replace(/[Il](?=\d)|(?<=\d)[Il]/g, '1')
}

/** Converts either "24/04/2026" or "24-Apr-23" into a consistent "24/04/2026" string. */
function toNumericDateString(raw) {
  if (!raw) return null

  const numMatch = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/)
  if (numMatch) {
    let [, d, m, y] = numMatch
    if (y.length === 2) y = `20${y}`
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
  }

  const monMatch = raw.match(/^(\d{1,2})[\-\/\s]([A-Za-z]{3,9})[\-\/\s](\d{2,4})$/)
  if (monMatch) {
    let [, d, monName, y] = monMatch
    const monNum = MONTH_MAP[monName.slice(0, 3).toLowerCase()]
    if (!monNum) return null
    if (y.length === 2) y = `20${y}`
    return `${d.padStart(2, '0')}/${String(monNum).padStart(2, '0')}/${y}`
  }

  return null
}

function parseNumericDateString(str) {
  const m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  const [, d, mo, y] = m
  return new Date(Number(y), Number(mo) - 1, Number(d))
}

function addDuration(dateObj, amount, unit) {
  const d = new Date(dateObj)
  const u = unit.toLowerCase()
  if (u.startsWith('day')) d.setDate(d.getDate() + amount)
  else if (u.startsWith('month')) d.setMonth(d.getMonth() + amount)
  else if (u.startsWith('year')) d.setFullYear(d.getFullYear() + amount)
  return d
}

function dateObjToNumericString(d) {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

function guessProductName(rawText) {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean)
  for (const line of lines) {
    if (!/^[A-Za-z][A-Za-z\s]{2,39}$/.test(line)) continue
    const words = line.split(/\s+/)
    if (words.length > 5) continue
    const lower = line.toLowerCase()
    if (NAME_BLOCKLIST.some((w) => lower.includes(w))) continue
    if (!words.every((w) => /^[A-Z]/.test(w))) continue
    return line
  }
  return null
}

function extractFields(rawText) {
  const text = normalizeOcrText(rawText)
  const mfgMatch = text.match(MFG_LABEL_PATTERN)
  const expMatch = text.match(EXP_LABEL_PATTERN)
  const batchMatch = text.match(BATCH_PATTERN)
  const allDates = [...text.matchAll(DATE_PATTERN)].map((m) => m[1])

  const manufactureDate = toNumericDateString(mfgMatch?.[2] || allDates[0] || null)
  let expiryDate = toNumericDateString(expMatch?.[2] || allDates[1] || allDates[0] || null)

  // No absolute expiry found, but there's a relative shelf life and a
  // manufacture date to anchor it to — compute the actual date.
  if (!expMatch && manufactureDate) {
    const relMatch = text.match(RELATIVE_SHELF_LIFE_PATTERN)
    if (relMatch) {
      const mfgDateObj = parseNumericDateString(manufactureDate)
      if (mfgDateObj) {
        const computed = addDuration(mfgDateObj, parseInt(relMatch[1], 10), relMatch[2])
        expiryDate = dateObjToNumericString(computed)
      }
    }
  }

  const productName = guessProductName(rawText)

  return {
    manufactureDate,
    expiryDate,
    batchNumber: batchMatch?.[1] || null,
    productName,
    foundAnything: Boolean(manufactureDate || expiryDate || batchMatch || productName),
  }
}

async function runOcr(buffer, pageSegMode) {
  const { data } = await Tesseract.recognize(buffer, 'eng', { tessedit_pageseg_mode: pageSegMode })
  return data
}

export async function scanLabelImage(imageBuffer) {
  const softPass = await preprocessImage(imageBuffer, { binarize: false })
  let data = await runOcr(softPass, '6')
  let fields = extractFields(data.text || '')
  let engine = 'tesseract'

  if (!fields.foundAnything) {
    const hardPass = await preprocessImage(imageBuffer, { binarize: true })
    const retryData = await runOcr(hardPass, '11')
    const retryFields = extractFields(retryData.text || '')
    if (retryFields.foundAnything) {
      data = retryData
      fields = retryFields
    }
  }

  if (!fields.foundAnything && process.env.OCR_SPACE_API_KEY) {
    try {
      const cloudText = await ocrSpaceExtractText(imageBuffer)
      const cloudFields = extractFields(cloudText)
      if (cloudText.trim()) {
        data = { text: cloudText, confidence: cloudFields.foundAnything ? 75 : data.confidence }
        fields = cloudFields
        engine = 'ocrspace'
      }
    } catch (err) {
      // fall through with whatever Tesseract found
    }
  }

  return {
    rawText: data.text || '',
    manufactureDate: fields.manufactureDate,
    expiryDate: fields.expiryDate,
    batchNumber: fields.batchNumber,
    productName: fields.productName,
    confidence: data.confidence,
    lowConfidence: data.confidence < 60,
    engine,
  }
}
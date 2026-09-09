import sharp from 'sharp'
import Tesseract from 'tesseract.js'

// --- Regex patterns, tuned for common Indian packaged-food label formats ---
const DATE_PATTERN = /\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})\b/g
const BATCH_PATTERN = /\b(?:batch\s*no\.?|batch|b\.?no\.?|lot)\s*[:#]?\s*([A-Z0-9\-]{3,15})\b/i
const MFG_LABEL_PATTERN = /\b(mfg|manufactured|packed|pkd)\b[^0-9]{0,15}(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/i
const EXP_LABEL_PATTERN = /\b(exp|expiry|expires|use by|best before)\b[^0-9]{0,15}(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/i

/**
 * Cleans up a photo before OCR. Real label photos are usually low-contrast,
 * small, and slightly blurry — this step alone typically improves Tesseract
 * accuracy far more than any regex tuning can. Steps:
 *  1. Upscale small images (OCR struggles under ~1000px on the long edge)
 *  2. Convert to grayscale
 *  3. Normalize contrast
 *  4. Sharpen edges
 *  5. Threshold to near-black-and-white, which is what Tesseract likes most
 */
async function preprocessImage(buffer) {
  const image = sharp(buffer).rotate() // auto-orient using EXIF data
  const metadata = await image.metadata()

  const longEdge = Math.max(metadata.width || 0, metadata.height || 0)
  const scale = longEdge > 0 && longEdge < 1400 ? Math.ceil(1400 / longEdge) : 1

  return image
    .resize({ width: (metadata.width || 800) * scale })
    .grayscale()
    .normalize()
    .sharpen()
    .threshold(150) // push toward pure black/white — tune this if labels come out too aggressive
    .toBuffer()
}

/**
 * Fixes the most common OCR character confusions before running date/number
 * regex against the text — O/0, I/1/l, S/5 are the usual offenders inside
 * numeric fields on low-quality scans.
 */
function normalizeOcrText(text) {
  return text
    .replace(/[oO](?=\d)|(?<=\d)[oO]/g, '0')
    .replace(/[Il](?=\d)|(?<=\d)[Il]/g, '1')
}

/**
 * Runs OCR on an image buffer and extracts structured label fields.
 * Always returns a result object (never throws for "nothing found") so the
 * frontend can show whatever was detected and let the user fill the rest in
 * manually — but preprocessing + normalization here means far fewer fields
 * should come back empty than with a raw, unprocessed image.
 */
export async function scanLabelImage(imageBuffer) {
  const processed = await preprocessImage(imageBuffer)

  const { data } = await Tesseract.recognize(processed, 'eng', {
    tessedit_pageseg_mode: '6', // "uniform block of text" — better than default for label photos
  })

  const rawText = data.text || ''
  const text = normalizeOcrText(rawText)

  const mfgMatch = text.match(MFG_LABEL_PATTERN)
  const expMatch = text.match(EXP_LABEL_PATTERN)
  const batchMatch = text.match(BATCH_PATTERN)
  const allDates = [...text.matchAll(DATE_PATTERN)].map((m) => m[1])

  return {
    rawText,
    manufactureDate: mfgMatch?.[2] || allDates[0] || null,
    expiryDate: expMatch?.[2] || allDates[1] || allDates[0] || null,
    batchNumber: batchMatch?.[1] || null,
    confidence: data.confidence, // Tesseract's overall OCR confidence, 0-100
    lowConfidence: data.confidence < 60, // frontend uses this to nudge the user to double check
  }
}
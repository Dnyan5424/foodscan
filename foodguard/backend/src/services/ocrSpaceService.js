const OCR_SPACE_URL = 'https://api.ocr.space/parse/image'

/**
 * Sends an image to OCR.space's free-tier API and returns raw extracted
 * text. Used only as a fallback when local Tesseract passes find nothing —
 * this keeps API usage minimal (free tier is generous but not unlimited)
 * while still giving a meaningfully stronger OCR engine for hard photos.
 *
 * Requires OCR_SPACE_API_KEY in backend/.env — get a free key (no card
 * required) at https://ocr.space/ocrapi
 */
export async function ocrSpaceExtractText(imageBuffer) {
  const apiKey = process.env.OCR_SPACE_API_KEY
  if (!apiKey) {
    throw new Error('OCR_SPACE_API_KEY is not set in backend/.env')
  }

  const form = new FormData()
  form.append('apikey', apiKey)
  form.append('language', 'eng')
  form.append('OCREngine', '2') // OCR.space's more accurate engine — better on real photos than engine 1
  form.append('scale', 'true')
  form.append('file', new Blob([imageBuffer]), 'label.jpg')

  const res = await fetch(OCR_SPACE_URL, { method: 'POST', body: form })
  if (!res.ok) throw new Error(`OCR.space request failed (${res.status})`)

  const data = await res.json()
  if (data.IsErroredOnProcessing) {
    throw new Error(data.ErrorMessage?.join(', ') || 'OCR.space failed to process the image')
  }

  return data.ParsedResults?.[0]?.ParsedText || ''
}
import { scanLabelImage } from '../services/labelOcrService.js'

export async function scanLabel(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded — send a file under field name "label"' })
    const result = await scanLabelImage(req.file.buffer)
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: 'OCR scan failed', error: err.message })
  }
}

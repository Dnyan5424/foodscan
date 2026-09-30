import { scanLabelImage } from '../services/labelOcrService.js'
import { analyzeIngredientText } from '../services/ingredientAnalysisService.js'
import { lookupBarcode } from '../services/openFoodFactsservice.js'

export async function scanLabel(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded — send a file under field name "label"' })
    const result = await scanLabelImage(req.file.buffer)
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: 'OCR scan failed', error: err.message })
  }
}

export async function lookupProduct(req, res) {
  try {
    const product = await lookupBarcode(req.params.code)
    if (!product) return res.status(404).json({ message: 'Product not found in Open Food Facts' })
    res.json(product)
  } catch (err) {
    res.status(502).json({ message: 'Barcode lookup failed', error: err.message })
  }
}

export function analyzeIngredients(req, res) {
  const { ingredientsText } = req.body || {}
  if (!ingredientsText?.trim()) {
    return res.status(400).json({ message: 'Ingredient text is required' })
  }
  res.json(analyzeIngredientText(ingredientsText))
}

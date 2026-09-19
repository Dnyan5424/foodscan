const OFF_BASE = 'https://world.openfoodfacts.org/api/v0/product'

async function fetchProduct(code) {
  const res = await fetch(`${OFF_BASE}/${code}.json`)
  if (!res.ok) throw new Error(`Open Food Facts request failed (${res.status})`)
  return res.json()
}

/**
 * Looks up a barcode against the free, public Open Food Facts database.
 * No API key required. Returns null if the barcode isn't found in any of
 * its common format variants, rather than throwing, so the caller can fall
 * back to manual entry or OCR.
 *
 * Handles the most common real-world mismatch: a 12-digit UPC-A code is
 * often stored in OFF as a 13-digit EAN with a leading zero, and vice
 * versa — so if the exact code isn't found, both variants are tried too.
 */
export async function lookupBarcode(rawCode) {
  const code = String(rawCode).trim().replace(/[^0-9]/g, '')
  if (!code) return null

  const candidates = [code]
  if (code.length === 12) candidates.push(`0${code}`) // UPC-A -> EAN-13
  if (code.length === 13 && code.startsWith('0')) candidates.push(code.slice(1)) // EAN-13 -> UPC-A

  for (const candidate of candidates) {
    const data = await fetchProduct(candidate)
    if (data.status === 1 && data.product) {
      const p = data.product
      return {
        barcode: candidate,
        name: p.product_name || '',
        brand: p.brands || '',
        category: p.categories?.split(',')[0]?.trim() || null,
        quantity: p.quantity || null,
        ingredientsText: p.ingredients_text || '',
        allergens: p.allergens_tags || [],
        nutriScore: p.nutrition_grades || null,
        novaGroup: p.nova_group ?? null,
        additives: p.additives_tags?.map((a) => a.replace('en:', '')) || [],
        imageUrl: p.image_front_url || null,
        nutriments: {
          calories: p.nutriments?.['energy-kcal_100g'] ?? null,
          fat: p.nutriments?.fat_100g ?? null,
          saturatedFat: p.nutriments?.['saturated-fat_100g'] ?? null,
          sugar: p.nutriments?.sugars_100g ?? null,
          salt: p.nutriments?.salt_100g ?? null,
          protein: p.nutriments?.proteins_100g ?? null,
          carbs: p.nutriments?.carbohydrates_100g ?? null,
        },
      }
    }
  }

  return null
}
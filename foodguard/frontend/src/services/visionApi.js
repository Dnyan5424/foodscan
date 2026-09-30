const baseUrl = (import.meta.env.VITE_ML_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export async function getFoodModelReadiness() {
  const response = await fetch(`${baseUrl}/foods`)
  if (!response.ok) throw new Error('Could not check AI model availability.')

  const payload = await response.json()
  return Object.fromEntries((payload.foods || []).map((food) => [food.id, food.ready === true]))
}

export async function analyzeFood(food, file) {
  if (!file) {
    throw new Error('Please select or capture an image.')
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${baseUrl}/predict/${encodeURIComponent(food)}`, {
    method: 'POST',
    body: formData,
  })

  let payload = null
  try {
    payload = await response.json()
  } catch (error) {
    payload = null
  }

  if (!response.ok) {
    const message = payload?.detail || 'AI screening service is currently unavailable. Please try again.'
    throw new Error(message)
  }

  return payload
}

export function analyzeTurmeric(file) {
  return analyzeFood('turmeric', file)
}

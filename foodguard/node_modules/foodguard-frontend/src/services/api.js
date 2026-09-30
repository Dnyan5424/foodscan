const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken() {
  return localStorage.getItem('foodguard_token')
}

async function request(path, { method = 'GET', body, auth = true, isForm = false } = {}) {
  const headers = {}
  if (!isForm) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  })

  const contentType = res.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await res.json() : null

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  // auth
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),
  me: () => request('/auth/me'),

  // products
  getProducts: () => request('/products'),
  createProduct: (p) => request('/products', { method: 'POST', body: p }),
  updateProduct: (id, p) => request(`/products/${id}`, { method: 'PUT', body: p }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // complaints
  getComplaints: () => request('/complaints'),
  createComplaint: (c) => request('/complaints', { method: 'POST', body: c }),
  getComplaintStats: () => request('/complaints/stats', { auth: false }),
  getGeoRisk: (productName, location) => {
  const params = new URLSearchParams({ productName, ...(location ? { location } : {}) })
  return request(`/complaints/risk?${params.toString()}`, { auth: false })
},
  // guides / awareness
  getGuides: () => request('/guides', { auth: false }),
  getGuide: (slug) => request(`/guides/${slug}`, { auth: false }),
  getAwarenessTopics: () => request('/awareness/topics', { auth: false }),
  getMyths: () => request('/awareness/myths', { auth: false }),

  // quiz
  getQuizQuestions: () => request('/quiz/questions', { auth: false }),
  submitQuiz: (answers) => request('/quiz/submit', { method: 'POST', body: { answers } }),

  // scan (OCR)
  scanLabel: (file) => {
    const form = new FormData()
    form.append('label', file)
    return request('/scan', { method: 'POST', body: form, isForm: true })
  },
  lookupBarcode: (code) => request(`/scan/barcode/${encodeURIComponent(code)}`, { auth: false }),
  analyzeIngredients: (ingredientsText) => request('/scan/ingredients/analyze', {
    method: 'POST',
    body: { ingredientsText },
    auth: false,
  }),

  // notifications
  getNotifications: () => request('/notifications'),
  getUnreadCount: () => request('/notifications/unread-count'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PATCH' }),
  subscribeToPush: (subscription) => request('/notifications/subscribe', {
    method: 'POST',
    body: { subscription },
  }),

  // assistant
  askAssistant: (question) => request('/assistant/ask', { method: 'POST', body: { question }, auth: false }),
}

export function setToken(token) {
  if (token) localStorage.setItem('foodguard_token', token)
  else localStorage.removeItem('foodguard_token')
}

export function getStoredToken() {
  return getToken()
}

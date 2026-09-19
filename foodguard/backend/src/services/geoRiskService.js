import Complaint from '../models/Complaint.js'

const WINDOWS = { W7: 7, W14: 14, W30: 30 }
const BASELINE_LOOKBACK_DAYS = 90
const SPIKE_MULTIPLIER = 3 // recent rate > 3x baseline rate => "elevated"

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildMessage(status, recent14, location) {
  const area = location ? `in ${location}` : 'overall'
  if (status === 'elevated') return `Elevated complaint activity ${area} in the last 14 days (${recent14} reports) — above the normal rate for this product.`
  if (status === 'watch') return `Some complaints reported ${area} in the last 14 days (${recent14}) — below the alert threshold, but worth noting.`
  return `No unusual complaint activity ${area} in the last 14 days.`
}

/**
 * Computes a geo-temporal adulteration risk signal for a product by
 * aggregating existing complaint reports against sliding time windows and,
 * optionally, a location filter.
 *
 * This is a simplified, explainable version of a full geo-temporal anomaly
 * detector (see the invention-disclosure-style spec this was built from):
 * it compares a recent window's report rate to a longer-term baseline rate
 * for the same product/region using a fixed spike multiplier, rather than a
 * Poisson or moving-average model — appropriate for a small, still-growing
 * dataset, and easy to explain to a user in one sentence. Swap in a proper
 * statistical anomaly model once there's enough real report volume for one
 * to be meaningful.
 */
export async function computeGeoRisk(productName, location) {
  if (!productName) throw new Error('productName is required')

  const nameRegex = new RegExp(escapeRegex(productName), 'i')
  const baseMatch = { productName: nameRegex }
  if (location) baseMatch.location = new RegExp(escapeRegex(location), 'i')

  const [windowEntries, baselineTotal, adulterationCount, totalCount] = await Promise.all([
    Promise.all(
      Object.entries(WINDOWS).map(async ([key, days]) => {
        const count = await Complaint.countDocuments({ ...baseMatch, createdAt: { $gte: daysAgo(days) } })
        return [key, { days, count }]
      })
    ),
    Complaint.countDocuments({ ...baseMatch, createdAt: { $gte: daysAgo(BASELINE_LOOKBACK_DAYS) } }),
    Complaint.countDocuments({ ...baseMatch, issueType: 'Food Adulteration' }),
    Complaint.countDocuments(baseMatch),
  ])

  const windows = Object.fromEntries(windowEntries)
  const baselineRatePerDay = baselineTotal / BASELINE_LOOKBACK_DAYS

  const recent14 = windows.W14.count
  const expected14 = baselineRatePerDay * 14
  // Cold-start fallback: with no baseline history yet, 3+ reports in 14
  // days is still worth flagging rather than silently reporting "normal".
  const isElevated = expected14 > 0 ? recent14 > expected14 * SPIKE_MULTIPLIER : recent14 >= 3

  let status = 'normal'
  if (isElevated) status = 'elevated'
  else if (recent14 > 0) status = 'watch'

  let finalRisk = 'low'
  if (status === 'elevated' && adulterationCount > 0) finalRisk = 'high'
  else if (status === 'elevated' || adulterationCount > 0) finalRisk = 'medium'

  return {
    productName,
    location: location || null,
    windows,
    baseline: { lookbackDays: BASELINE_LOOKBACK_DAYS, ratePerDay: Number(baselineRatePerDay.toFixed(3)) },
    totalReports: totalCount,
    adulterationReports: adulterationCount,
    status, // 'normal' | 'watch' | 'elevated'
    finalRisk, // 'low' | 'medium' | 'high'
    message: buildMessage(status, recent14, location),
  }
}
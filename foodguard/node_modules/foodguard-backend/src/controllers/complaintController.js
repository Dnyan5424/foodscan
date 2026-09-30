import Complaint from '../models/Complaint.js'
import { suggestIssueType } from '../services/complaintClassifier.js'
import { computeGeoRisk } from '../services/geoRiskService.js'
async function nextTrackingId() {
  const year = new Date().getFullYear()
  const count = await Complaint.countDocuments({ trackingId: new RegExp(`^FS-${year}-`) })
  return `FS-${year}-${String(count + 1).padStart(6, '0')}`
}

export async function listComplaints(req, res) {
  const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(complaints)
}

export async function createComplaint(req, res) {
  try {
    const trackingId = await nextTrackingId()
    const suggestedIssueType = suggestIssueType(req.body.description || '')
    const complaint = await Complaint.create({
      ...req.body,
      user: req.user._id,
      trackingId,
      suggestedIssueType,
      status: 'submitted',
    })
    res.status(201).json(complaint)
  } catch (err) {
    res.status(400).json({ message: 'Could not submit complaint', error: err.message })
  }
}

// Admin-only: move a complaint through the status timeline
export async function updateComplaintStatus(req, res) {
  const { status } = req.body
  const allowed = ['submitted', 'review', 'investigation', 'action', 'resolved']
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' })

  const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!complaint) return res.status(404).json({ message: 'Complaint not found' })
  res.json(complaint)
}

// Admin-only: list all complaints across users
export async function listAllComplaints(req, res) {
  const complaints = await Complaint.find().populate('user', 'name email').sort({ createdAt: -1 })
  res.json(complaints)
}

// Community analytics: counts by issue type (no personal data)
export async function complaintStats(req, res) {
  const byCategory = await Complaint.aggregate([
    { $group: { _id: '$issueType', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ])
  const total = await Complaint.countDocuments()
  const resolved = await Complaint.countDocuments({ status: 'resolved' })
  res.json({ total, resolved, active: total - resolved, byCategory })
}
// Geo-temporal risk: aggregates complaint activity for a product, and
// optionally a location, into a simple risk signal. Public + aggregate
// only — no personal data.
export async function getGeoRisk(req, res) {
  try {
    const { productName, location } = req.query
    if (!productName) return res.status(400).json({ message: 'productName query parameter is required' })
    const risk = await computeGeoRisk(productName, location)
    res.json(risk)
  } catch (err) {
    res.status(500).json({ message: 'Risk lookup failed', error: err.message })
  }
}
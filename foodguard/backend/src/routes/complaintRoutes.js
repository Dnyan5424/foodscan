import { Router } from 'express'
import { protect, adminOnly } from '../middleware/auth.js'
import {
  listComplaints, createComplaint, updateComplaintStatus, listAllComplaints, complaintStats, getGeoRisk,
} from '../controllers/complaintController.js'

const router = Router()
router.get('/stats', complaintStats) // public — aggregate only, no personal data
router.get('/risk', getGeoRisk) // public — aggregate only, no personal data
router.use(protect)
router.get('/', listComplaints)
router.post('/', createComplaint)
router.get('/admin/all', adminOnly, listAllComplaints)
router.patch('/admin/:id/status', adminOnly, updateComplaintStatus)

export default router
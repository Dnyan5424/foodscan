import { Router } from 'express'
import { listGuides, getGuide } from '../controllers/guideController.js'

const router = Router()
router.get('/', listGuides)
router.get('/:slug', getGuide)

export default router

import { Router } from 'express'
import { listTopics, listMyths } from '../controllers/awarenessController.js'

const router = Router()
router.get('/topics', listTopics)
router.get('/myths', listMyths)

export default router

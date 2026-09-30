import { Router } from 'express'
import { ask } from '../controllers/assistantController.js'

const router = Router()
router.post('/ask', ask)

export default router

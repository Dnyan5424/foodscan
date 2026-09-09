import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import { listQuestions, submitAttempt, myAttempts } from '../controllers/quizController.js'

const router = Router()
router.get('/questions', listQuestions)
router.use(protect)
router.post('/submit', submitAttempt)
router.get('/my-attempts', myAttempts)

export default router

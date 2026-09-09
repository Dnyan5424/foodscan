import { Router } from 'express'
import multer from 'multer'
import { scanLabel } from '../controllers/scanController.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } })

const router = Router()
router.post('/', upload.single('label'), scanLabel)

export default router
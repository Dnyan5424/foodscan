import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './src/config/db.js'
import authRoutes from './src/routes/authRoutes.js'
import productRoutes from './src/routes/productRoutes.js'
import complaintRoutes from './src/routes/complaintRoutes.js'
import guideRoutes from './src/routes/guideRoutes.js'
import awarenessRoutes from './src/routes/awarenessRoutes.js'
import quizRoutes from './src/routes/quizRoutes.js'
import scanRoutes from './src/routes/scanRoutes.js'
import assistantRoutes from './src/routes/assistantRoutes.js'
import notificationRoutes from './src/routes/notificationRoutes.js'
import { startExpiryNotificationJob } from './jobs/expiryNotificationJob.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/guides', guideRoutes)
app.use('/api/awareness', awarenessRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/scan', scanRoutes)
app.use('/api/assistant', assistantRoutes)
app.use('/api/notifications', notificationRoutes)

app.use((req, res) => res.status(404).json({ message: 'Route not found' }))
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Server error', error: err.message })
})

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  startExpiryNotificationJob()
  app.listen(PORT, () => console.log(`FoodGuard API running on port ${PORT}`))
})

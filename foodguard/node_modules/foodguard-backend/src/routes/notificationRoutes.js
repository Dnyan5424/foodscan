import { Router } from 'express'
import { protect } from '../middleware/auth.js'
import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  subscribeUserToPush,
  runExpiryNotificationJob,
} from '../services/notificationService.js'

const router = Router()
router.use(protect)

router.get('/', async (req, res) => {
  try {
    await runExpiryNotificationJob()
    const notifications = await getUserNotifications(req.user._id)
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch notifications', error: error.message })
  }
})

router.get('/unread-count', async (req, res) => {
  try {
    await runExpiryNotificationJob()
    const count = await getUnreadNotificationCount(req.user._id)
    res.json({ count })
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch unread count', error: error.message })
  }
})

router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await markNotificationRead(req.user._id, req.params.id)
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    return res.json(notification)
  } catch (error) {
    return res.status(500).json({ message: 'Could not mark notification as read', error: error.message })
  }
})

router.patch('/read-all', async (req, res) => {
  try {
    const notifications = await markAllNotificationsRead(req.user._id)
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: 'Could not mark notifications as read', error: error.message })
  }
})

router.post('/subscribe', async (req, res) => {
  try {
    const subscription = await subscribeUserToPush(req.user._id, req.body?.subscription || req.body)
    res.status(201).json({ message: 'Push subscription saved', subscription })
  } catch (error) {
    res.status(400).json({ message: 'Could not save push subscription', error: error.message })
  }
})

export default router

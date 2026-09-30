import webPush from 'web-push'
import Product from '../models/Product.js'
import Notification from '../models/Notification.js'
import PushSubscription from '../models/PushSubscription.js'

const REMINDER_DAYS = [7, 3, 1, 0]
const REMINDER_TYPE_MAP = {
  7: 'expiry_7',
  3: 'expiry_3',
  1: 'expiry_1',
  0: 'expiry_0',
}

function toLocalStartOfDay(date) {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

export function getDaysRemaining(expiryDate) {
  if (!expiryDate) return null

  const today = toLocalStartOfDay(new Date())
  const expiry = toLocalStartOfDay(new Date(expiryDate))
  const diffMs = expiry.getTime() - today.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

export function getReminderTypeForDays(daysRemaining) {
  return REMINDER_TYPE_MAP[daysRemaining] || null
}

export function getReminderLabel(type) {
  const map = {
    expiry_7: '7 days before expiry',
    expiry_3: '3 days before expiry',
    expiry_1: '1 day before expiry',
    expiry_0: 'expiry day',
  }
  return map[type] || 'Expiry reminder'
}

export async function getUserNotifications(userId) {
  return Notification.find({ userId }).sort({ scheduledFor: -1, createdAt: -1 }).lean()
}

export async function getUnreadNotificationCount(userId) {
  return Notification.countDocuments({ userId, read: false })
}

export async function markNotificationRead(userId, notificationId) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  )

  return notification
}

export async function markAllNotificationsRead(userId) {
  await Notification.updateMany({ userId, read: false }, { read: true })
  return Notification.find({ userId }).sort({ scheduledFor: -1, createdAt: -1 }).lean()
}

export async function subscribeUserToPush(userId, subscription) {
  if (!subscription?.endpoint) {
    throw new Error('Invalid push subscription payload')
  }

  const payload = {
    userId,
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.keys?.p256dh,
      auth: subscription.keys?.auth,
    },
  }

  const result = await PushSubscription.findOneAndUpdate(
    { userId, endpoint: payload.endpoint },
    payload,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  return result
}

async function sendPushToSubscription(subscription, notification) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return
  }

  webPush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )

  await webPush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys?.p256dh,
        auth: subscription.keys?.auth,
      },
    },
    JSON.stringify({
      title: notification.title,
      message: notification.message,
      tag: notification._id.toString(),
      url: '/expiry-tracker',
    })
  )
}

export async function sendPushNotificationsForNotification(notification) {
  if (!notification || notification.pushSent) return

  const subscriptions = await PushSubscription.find({ userId: notification.userId }).lean()
  if (!subscriptions.length) return

  let sent = false

  for (const subscription of subscriptions) {
    try {
      await sendPushToSubscription(subscription, notification)
      sent = true
    } catch (error) {
      if (error?.statusCode === 410 || error?.statusCode === 404) {
        await PushSubscription.deleteOne({ _id: subscription._id })
      }
    }
  }

  if (sent) {
    await Notification.findByIdAndUpdate(notification._id, {
      pushSent: true,
      sentAt: new Date(),
    })
  }
}

export async function createExpiryNotificationsForProduct(product) {
  if (!product || !product.user || !product.expiryDate) return null

  const daysRemaining = getDaysRemaining(product.expiryDate)
  if (!REMINDER_DAYS.includes(daysRemaining)) return null

  const type = getReminderTypeForDays(daysRemaining)
  const productName = product.name || 'Food item'
  const shortDate = new Date(product.expiryDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const title = daysRemaining === 0
    ? `${productName} expires today`
    : `${productName} expires in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`

  const message = `${productName} expires on ${shortDate}. Please check it soon.`

  const existing = await Notification.findOne({ userId: product.user, foodId: product._id, type })
  if (existing) return existing

  const scheduledDate = new Date(product.expiryDate)
  scheduledDate.setDate(scheduledDate.getDate() - daysRemaining)

  const notification = await Notification.create({
    userId: product.user,
    foodId: product._id,
    type,
    title,
    message,
    scheduledFor: scheduledDate,
    createdAt: new Date(),
  })

  await sendPushNotificationsForNotification(notification)

  return notification
}

export async function runExpiryNotificationJob() {
  const products = await Product.find({ expiryDate: { $ne: null } })
  const created = []

  for (const product of products) {
    try {
      const notification = await createExpiryNotificationsForProduct(product)
      if (notification) created.push(notification)
    } catch (error) {
      console.error(`Expiry notification error for product ${product._id}:`, error.message)
    }
  }

  return created
}

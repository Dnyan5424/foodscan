import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import notificationApi, { registerBrowserPushNotifications } from '../services/notificationApi'
import NotificationPanel from './NotificationPanel'

export default function NotificationBell({ user }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const loadNotifications = async () => {
    if (!user) return

    try {
      const [items, unread] = await Promise.all([
        notificationApi.getNotifications(),
        notificationApi.getUnreadCount(),
      ])

      setNotifications(items)
      setUnreadCount(unread?.count ?? unread ?? 0)
    } catch (error) {
      console.error('Could not load notifications:', error)
    }
  }

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      setIsOpen(false)
      return
    }

    loadNotifications()
    registerBrowserPushNotifications().catch((error) => console.error('Push registration failed:', error))
  }, [user])

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications((current) => current.map((n) => (n._id === id ? { ...n, read: true } : n)))
      setUnreadCount((current) => Math.max(current - 1, 0))
    } catch (error) {
      console.error('Could not mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications((current) => current.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Could not mark all notifications as read:', error)
    }
  }

  if (!user) return null

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/10"
        aria-label="Open notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-4 text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

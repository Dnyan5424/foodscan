const reminderColors = {
  expiry_7: 'bg-emerald-500',
  expiry_3: 'bg-amber-500',
  expiry_1: 'bg-orange-500',
  expiry_0: 'bg-red-500',
}

export default function NotificationPanel({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead, onClose }) {
  return (
    <div className="absolute right-0 top-full mt-3 w-[22rem] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800">Notifications</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <button type="button" onClick={onClose} className="text-xs font-medium text-slate-500 hover:text-slate-700">
          Close
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto bg-white">
        {notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-slate-500">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`border-b border-slate-100 px-4 py-3 transition ${notification.read ? 'bg-slate-50' : 'bg-white'}`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-1 h-2.5 w-2.5 rounded-full ${reminderColors[notification.type] || 'bg-slate-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                    {!notification.read && (
                      <button
                        type="button"
                        onClick={() => onMarkAsRead(notification._id)}
                        className="text-[10px] font-semibold uppercase tracking-wide text-orange-600 hover:text-orange-700"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                  <p className="mt-2 text-[11px] text-slate-400">
                    {new Date(notification.createdAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
        <button
          type="button"
          onClick={onMarkAllAsRead}
          className="w-full rounded-xl bg-forest px-3 py-2 text-xs font-semibold text-white hover:bg-forest/90 transition"
        >
          Mark all as read
        </button>
      </div>
    </div>
  )
}

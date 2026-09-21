import { useEffect, useState } from 'react'
import { subscribeToNotifications } from '../services/firestoreService'
import type { AppNotification } from '../types/models'

export function useNotifications(uid: string | undefined) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) {
      setNotifications([])
      setLoading(false)
      return
    }
    setLoading(true)
    const unsubscribe = subscribeToNotifications(uid, (next) => {
      setNotifications(next)
      setLoading(false)
    })
    return unsubscribe
  }, [uid])

  const unreadCount = notifications.filter((n) => !n.read).length

  return { notifications, unreadCount, loading }
}

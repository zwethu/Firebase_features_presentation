import { useState } from 'react'
import { useAuth } from '../app/AuthContext'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { useNotifications } from '../hooks/useNotifications'
import { logAnalyticsEvent } from '../services/analyticsService'
import { markNotificationRead } from '../services/firestoreService'
import { registerForPushNotifications } from '../services/messagingService'
import { cn } from '../lib/cn'

export function NotificationsPage() {
  const { firebaseUser } = useAuth()
  const { notifications, loading } = useNotifications(firebaseUser?.uid)
  const [pushStatus, setPushStatus] = useState<string | null>(null)

  async function handleOpen(id: string, read: boolean) {
    if (!read) {
      await markNotificationRead(id)
      await logAnalyticsEvent('notification_opened')
    }
  }

  async function handleEnablePush() {
    const result = await registerForPushNotifications()
    switch (result.status) {
      case 'granted':
        setPushStatus('Push notifications enabled for this browser.')
        break
      case 'denied':
        setPushStatus('Push notifications permission was denied. In-app notifications still work.')
        break
      case 'not-configured':
        setPushStatus('Push notifications are not configured for this environment. In-app notifications still work.')
        break
      case 'unsupported':
        setPushStatus('This browser does not support push notifications. In-app notifications still work.')
        break
      case 'error':
        setPushStatus(result.message)
        break
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-navy-950">Notifications</h1>
        <Button variant="secondary" size="sm" onClick={handleEnablePush}>
          Enable push notifications
        </Button>
      </div>
      {pushStatus && <p className="text-sm text-slate-500">{pushStatus}</p>}

      {loading ? (
        <Spinner label="Loading notifications" />
      ) : notifications.length === 0 ? (
        <EmptyState title="No notifications yet" description="Submission and announcement updates will show up here." />
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <Card
                className={cn(
                  'cursor-pointer transition-colors',
                  !notification.read && 'border-firebase-blue-300 bg-firebase-blue-500/5',
                )}
                onClick={() => handleOpen(notification.id, notification.read)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-navy-950">{notification.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {notification.createdAt?.toDate().toLocaleString() ?? 'just now'}
                    </p>
                  </div>
                  {!notification.read && <Badge tone="info">New</Badge>}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

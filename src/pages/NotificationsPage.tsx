import { useEffect, useState } from 'react'
import { BellRing } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArchitectureDiagram } from '../components/lab/ArchitectureDiagram'
import { DemoResultPanel } from '../components/lab/DemoResultPanel'
import { FeaturePage } from '../components/lab/FeaturePage'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import {
  createLocalSelfNotification,
  markLocalNotificationRead,
  subscribeToLocalNotifications,
} from '../features/notifications-demo/localNotificationsService'
import {
  createSelfNotification,
  markNotificationRead,
  subscribeToNotifications,
} from '../features/notifications-demo/notificationsService'
import type { DemoNotification } from '../features/notifications-demo/types'
import { useCurrentActor } from '../hooks/useCurrentActor'
import { useDemoResults } from '../hooks/useDemoResults'
import { logDemoEvent } from '../lib/eventLog'
import { getFeature } from '../lib/features'
import { computeFeatureStatus } from '../lib/featureStatus'
import { registerForPushNotifications } from '../services/messagingService'
import { isFirebaseConfigured } from '../services/firebase'

const feature = getFeature('notifications')

export function NotificationsPage() {
  const actor = useCurrentActor()
  const { entries, pushResult } = useDemoResults()

  const [notifications, setNotifications] = useState<DemoNotification[]>([])
  const [pushStatus, setPushStatus] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const blockedPendingSignIn = isFirebaseConfigured && actor.kind !== 'firebase'
  const status = computeFeatureStatus('notifications')

  useEffect(() => {
    if (blockedPendingSignIn) {
      setNotifications([])
      return
    }
    if (!isFirebaseConfigured) {
      return subscribeToLocalNotifications(actor.uid, setNotifications)
    }
    return subscribeToNotifications(actor.uid, setNotifications, () =>
      pushResult('Could not load notifications.', 'error'),
    )
  }, [blockedPendingSignIn, actor.uid, pushResult])

  async function handleCreateNotification() {
    if (blockedPendingSignIn) return
    setIsCreating(true)
    try {
      const title = 'Demo notification'
      const message = `Sent to yourself as ${actor.displayName} at ${new Date().toLocaleTimeString()}.`
      if (isFirebaseConfigured) {
        await createSelfNotification(actor.uid, title, message)
      } else {
        createLocalSelfNotification(actor.uid, title, message)
      }
      logDemoEvent('notifications', `${actor.displayName} sent themselves a notification`)
      pushResult('Notification created.', 'success')
    } catch (err) {
      pushResult(err instanceof Error ? err.message : 'Could not create notification.', 'error')
    } finally {
      setIsCreating(false)
    }
  }

  async function handleMarkRead(notification: DemoNotification) {
    if (notification.read) return
    try {
      if (isFirebaseConfigured && actor.kind === 'firebase') {
        await markNotificationRead(notification.id)
      } else {
        markLocalNotificationRead(notification.id)
      }
    } catch (err) {
      pushResult(err instanceof Error ? err.message : 'Could not mark as read.', 'error')
    }
  }

  async function handleEnablePush() {
    const result = await registerForPushNotifications()
    switch (result.status) {
      case 'granted':
        setPushStatus('Push notifications enabled for this browser.')
        break
      case 'denied':
        setPushStatus('Permission was denied — in-app notifications above still work.')
        break
      case 'not-configured':
        setPushStatus('Push is not configured (no VAPID key) — in-app notifications above still work.')
        break
      case 'unsupported':
        setPushStatus('This browser does not support push — in-app notifications above still work.')
        break
      case 'error':
        setPushStatus(result.message)
        break
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <FeaturePage
      feature={feature}
      status={status}
      statusNote={
        isFirebaseConfigured
          ? actor.kind === 'firebase'
            ? undefined
            : 'Cloud Firestore is configured, but you need to sign in to send and read notifications.'
          : 'Firebase is not configured — this demo runs on localStorage + BroadcastChannel instead, clearly labelled as a simulation.'
      }
      whatItIs={
        <p>
          Notifications shown here are <strong>in-app</strong>: real-time Firestore documents this page
          subscribes to, unrelated to whether the browser has push permission. They're intentionally
          separate from <strong>push notifications</strong> (Firebase Cloud Messaging), which can wake
          the browser even when this tab isn't open — and are entirely optional.
        </p>
      }
      demo={
        <div className="space-y-5">
          <ArchitectureDiagram
            steps={
              isFirebaseConfigured
                ? [
                    'A notification document is created in demoNotifications',
                    '(self-serve button here, or the /functions Cloud Function)',
                    'onSnapshot() pushes it to this page instantly',
                    'Clicking a notification marks read: true',
                  ]
                : [
                    'A notification is created in this browser\'s localStorage',
                    'A BroadcastChannel message notifies other open tabs',
                    'Every tab listening re-reads localStorage and re-renders',
                    'Clicking a notification marks read: true',
                  ]
            }
          />

          {blockedPendingSignIn && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <Link to="/authentication" className="font-medium underline">
                Sign in on the Authentication page
              </Link>{' '}
              to use real notifications here.
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleCreateNotification} isLoading={isCreating} disabled={blockedPendingSignIn}>
              <BellRing size={16} aria-hidden="true" /> Send myself a notification
            </Button>
            <Button variant="secondary" size="sm" onClick={handleEnablePush}>
              Enable push notifications (optional)
            </Button>
            <Badge tone={unreadCount > 0 ? 'info' : 'neutral'}>{unreadCount} unread</Badge>
          </div>
          {pushStatus && <p className="text-xs text-slate-500">{pushStatus}</p>}

          {notifications.length === 0 ? (
            <EmptyState
              title="No notifications yet"
              description="Send yourself one above, or create a demo event on /functions."
            />
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => handleMarkRead(notification)}
                    className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                      notification.read
                        ? 'border-slate-200 bg-white'
                        : 'border-firebase-blue-300 bg-firebase-blue-500/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-navy-950">{notification.title}</p>
                        <p className="mt-0.5 text-slate-600">{notification.message}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(notification.createdAtMs).toLocaleTimeString()}
                        </p>
                      </div>
                      {!notification.read && <Badge tone="info">New</Badge>}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Event / result panel
            </p>
            <DemoResultPanel entries={entries} emptyLabel="Send a notification to see results here." />
          </div>
        </div>
      }
      howItWorks={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Each notification is one document in <code>demoNotifications</code>, with a <code>recipientId</code> field.</li>
          <li>Security Rules let a user read only notifications addressed to them, and update only the <code>read</code> field on their own.</li>
          <li>A real backend (like the /functions Cloud Function) can create notifications for other users via the Admin SDK, which bypasses those client-side rules.</li>
          <li>Push notifications require a separate opt-in — the app works fully without ever asking for that permission.</li>
        </ul>
      }
      useCases={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>"You have a new message" or "Your upload finished" style in-app alerts.</li>
          <li>Backend-triggered alerts (a Cloud Function reacting to another user's action).</li>
          <li>Re-engagement via push, for users who've opted in and closed the tab.</li>
        </ul>
      }
    />
  )
}

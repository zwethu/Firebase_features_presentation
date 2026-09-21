import type { DemoNotification } from './types'

/**
 * Local-only fallback for the /notifications demo when Cloud Firestore
 * isn't configured. Same same-tab + cross-tab notification pattern used by
 * the other local fallbacks (localStorage + BroadcastChannel, with direct
 * same-tab listener notification since BroadcastChannel never delivers
 * back to its own sender). Never touches Firebase.
 */
const STORAGE_KEY = 'firebase-feature-lab:local-notifications'
const CHANNEL_NAME = 'firebase-feature-lab-local-notifications'

function readAll(): DemoNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as DemoNotification[]) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(notifications: DemoNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  } catch {
    // Best-effort only.
  }
}

let channel: BroadcastChannel | null = null
function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null
  if (!channel) channel = new BroadcastChannel(CHANNEL_NAME)
  return channel
}

const localListeners = new Set<() => void>()
function notifyLocalListeners() {
  for (const listener of localListeners) listener()
}

export function subscribeToLocalNotifications(recipientId: string, onData: (notifications: DemoNotification[]) => void) {
  const emit = () =>
    onData(readAll().filter((n) => n.recipientId === recipientId).sort((a, b) => b.createdAtMs - a.createdAtMs))
  emit()

  localListeners.add(emit)
  const bc = getChannel()
  bc?.addEventListener('message', emit)

  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) emit()
  }
  window.addEventListener('storage', onStorage)

  return () => {
    localListeners.delete(emit)
    bc?.removeEventListener('message', emit)
    window.removeEventListener('storage', onStorage)
  }
}

export function createLocalSelfNotification(recipientId: string, title: string, message: string) {
  const notification: DemoNotification = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    recipientId,
    type: 'self-serve',
    title,
    message,
    relatedId: null,
    read: false,
    createdAtMs: Date.now(),
  }
  writeAll([notification, ...readAll()])
  notifyLocalListeners()
  getChannel()?.postMessage('notifications-updated')
}

export function markLocalNotificationRead(notificationId: string) {
  writeAll(readAll().map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  notifyLocalListeners()
  getChannel()?.postMessage('notifications-updated')
}

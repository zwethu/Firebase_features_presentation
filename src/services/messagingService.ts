import { getMessaging, getToken, isSupported } from 'firebase/messaging'
import { app, isFirebaseConfigured } from './firebase'

const vapidKey = import.meta.env.VITE_FCM_VAPID_KEY as string | undefined

export type PushRegistrationResult =
  | { status: 'unsupported' }
  | { status: 'not-configured' }
  | { status: 'denied' }
  | { status: 'granted'; token: string }
  | { status: 'error'; message: string }

/**
 * Registers the service worker and requests notification permission. Only
 * ever called from a direct user action (a button click) — never on page
 * load — per the "ask permission only after a user action" requirement.
 * The app's in-app notification bell works fully without this.
 */
export async function registerForPushNotifications(): Promise<PushRegistrationResult> {
  if (!isFirebaseConfigured || !app || !vapidKey) {
    return { status: 'not-configured' }
  }
  if (!(await isSupported())) {
    return { status: 'unsupported' }
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    return { status: 'denied' }
  }

  try {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    const messaging = getMessaging(app)
    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration })
    return { status: 'granted', token }
  } catch (error) {
    return { status: 'error', message: error instanceof Error ? error.message : 'Could not register for push notifications.' }
  }
}

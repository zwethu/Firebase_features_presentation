import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../../services/firebase'
import type { DemoNotification } from './types'

function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Cloud Firestore is not configured. Add your Firebase web config to .env.local.')
  }
  return db
}

export function subscribeToNotifications(
  recipientId: string,
  onData: (notifications: DemoNotification[]) => void,
  onError: (error: unknown) => void,
) {
  const database = requireDb()
  const notificationsQuery = query(
    collection(database, 'demoNotifications'),
    where('recipientId', '==', recipientId),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(
    notificationsQuery,
    (snapshot) => {
      const notifications: DemoNotification[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as {
          recipientId: string
          type: string
          title: string
          message: string
          relatedId: string | null
          read: boolean
          createdAt: Timestamp | null
        }
        return {
          id: docSnap.id,
          recipientId: data.recipientId,
          type: data.type,
          title: data.title,
          message: data.message,
          relatedId: data.relatedId ?? null,
          read: data.read,
          createdAtMs: data.createdAt ? data.createdAt.toMillis() : Date.now(),
        }
      })
      onData(notifications)
    },
    onError,
  )
}

/**
 * Self-serve demo action: a signed-in user can create a notification only
 * for themselves (Security Rules enforce `recipientId == request.auth.uid`)
 * — this is never a way to message another user.
 */
export async function createSelfNotification(recipientId: string, title: string, message: string) {
  const database = requireDb()
  await addDoc(collection(database, 'demoNotifications'), {
    recipientId,
    type: 'self-serve',
    title,
    message,
    relatedId: null,
    read: false,
    createdAt: serverTimestamp(),
  })
}

export async function markNotificationRead(notificationId: string) {
  const database = requireDb()
  await updateDoc(doc(database, 'demoNotifications', notificationId), { read: true })
}

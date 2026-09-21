import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../../services/firebase'

function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Cloud Firestore is not configured. Add your Firebase web config to .env.local.')
  }
  return db
}

export interface FunctionDemoResult {
  sourceEventId: string
  status: string
  message: string
  createdAtMs: number
}

/**
 * Creates the `functionDemos/{eventId}` document that the deployed
 * `onFunctionDemoCreated` Cloud Function listens for, using a
 * client-generated ID so we can immediately subscribe to the matching
 * `functionDemoResults/{eventId}` document the function is expected to
 * write back.
 */
export async function createFunctionDemoEvent(createdBy: string, label: string): Promise<string> {
  const database = requireDb()
  const eventRef = doc(collection(database, 'functionDemos'))
  await setDoc(eventRef, { createdBy, label, createdAt: serverTimestamp() })
  return eventRef.id
}

export function subscribeToFunctionDemoResult(
  eventId: string,
  onResult: (result: FunctionDemoResult) => void,
  onError: (error: unknown) => void,
) {
  const database = requireDb()
  return onSnapshot(
    doc(database, 'functionDemoResults', eventId),
    (snapshot) => {
      if (!snapshot.exists()) return
      const data = snapshot.data() as {
        sourceEventId: string
        status: string
        message: string
        createdAt: Timestamp | null
      }
      onResult({
        sourceEventId: data.sourceEventId,
        status: data.status,
        message: data.message,
        createdAtMs: data.createdAt ? data.createdAt.toMillis() : Date.now(),
      })
    },
    onError,
  )
}

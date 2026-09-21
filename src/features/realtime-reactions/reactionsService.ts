import { onValue as onRtdbValue, ref, runTransaction, set } from 'firebase/database'
import { firebaseConfig, isFirebaseConfigured, rtdb } from '../../services/firebase'

const REACTIONS_PATH = 'featureLab/reactions/firebase'

export const realtimeDatabaseConfigured = Boolean(
  isFirebaseConfigured && firebaseConfig.databaseURL && rtdb,
)

function requireRtdb() {
  if (!realtimeDatabaseConfigured || !rtdb) {
    throw new Error(
      'Realtime Database is not configured. Set VITE_FIREBASE_DATABASE_URL in .env.local.',
    )
  }
  return rtdb
}

export function subscribeToReactionCount(
  onCount: (count: number) => void,
  onError: (error: unknown) => void,
) {
  const db = requireRtdb()
  return onRtdbValue(
    ref(db, REACTIONS_PATH),
    (snapshot) => onCount(typeof snapshot.val() === 'number' ? snapshot.val() : 0),
    onError,
  )
}

export function subscribeToConnectionStatus(onStatus: (connected: boolean) => void) {
  const db = requireRtdb()
  return onRtdbValue(ref(db, '.info/connected'), (snapshot) => onStatus(Boolean(snapshot.val())))
}

/** Atomic increment — safe even if many clients click "React" at once. */
export async function addReaction() {
  const db = requireRtdb()
  await runTransaction(ref(db, REACTIONS_PATH), (current: number | null) => (current ?? 0) + 1)
}

export async function resetReactionCount() {
  const db = requireRtdb()
  await set(ref(db, REACTIONS_PATH), 0)
}

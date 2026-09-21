import { useAuth } from '../app/AuthContext'
import { useDemoIdentity } from '../app/DemoIdentityContext'

export interface CurrentActor {
  /**
   * 'firebase' = a real signed-in Firebase user (writes to real Firestore
   * are allowed). 'demo' = a selected local demo identity (Student/Teacher/
   * Admin). 'guest' = nobody has signed in or picked a demo identity yet —
   * a stable, anonymous, per-tab fallback so local-simulation demos always
   * have someone to attribute actions to without forcing a detour through
   * /authentication first.
   */
  kind: 'firebase' | 'demo' | 'guest'
  uid: string
  displayName: string
  email: string | null
}

const GUEST_STORAGE_KEY = 'firebase-feature-lab:guest-actor'
let cachedGuestActor: { uid: string; displayName: string } | null = null

function createGuestActor(): { uid: string; displayName: string } {
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return { uid: `guest-${suffix}-${Date.now().toString(36)}`, displayName: `Guest ${suffix}` }
}

function getGuestActor(): { uid: string; displayName: string } {
  if (cachedGuestActor) return cachedGuestActor
  try {
    const raw = sessionStorage.getItem(GUEST_STORAGE_KEY)
    if (raw) {
      cachedGuestActor = JSON.parse(raw) as { uid: string; displayName: string }
      return cachedGuestActor
    }
  } catch {
    // fall through to creating a fresh one
  }
  const actor = createGuestActor()
  cachedGuestActor = actor
  try {
    sessionStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(actor))
  } catch {
    // Best-effort only — the in-memory cache still keeps it stable for this tab's lifetime.
  }
  return actor
}

/**
 * Unifies "who is acting right now" across every feature page. Firestore/
 * Storage/RTDB writes to REAL Firebase must only ever happen for
 * `kind === 'firebase'` — Security Rules require a genuine
 * `request.auth.uid`, and neither a demo uid (`demo-student`) nor a guest
 * uid (`guest-4821-...`) is ever a valid Firebase Auth UID. Local-only
 * simulations (localStorage/BroadcastChannel) may use any of the three.
 */
export function useCurrentActor(): CurrentActor {
  const { firebaseUser } = useAuth()
  const { identity } = useDemoIdentity()

  if (firebaseUser) {
    return {
      kind: 'firebase',
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName ?? firebaseUser.email ?? 'Signed-in user',
      email: firebaseUser.email,
    }
  }

  if (identity) {
    return { kind: 'demo', uid: identity.uid, displayName: identity.displayName, email: null }
  }

  const guest = getGuestActor()
  return { kind: 'guest', uid: guest.uid, displayName: guest.displayName, email: null }
}

import {
  GoogleAuthProvider,
  type User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from './firebase'
import { ensureUserProfile } from './firestoreService'

function requireAuth() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(
      'Firebase Authentication is not configured. Add your Firebase web config to .env.local.',
    )
  }
  return auth
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  if (!isFirebaseConfigured || !auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

/**
 * Fire-and-forget: creates the user's Firestore profile document without
 * blocking the calling sign-in/register flow on it.
 *
 * This *must* stay decoupled from the critical auth path. `ensureUserProfile`
 * does a `getDoc` immediately followed by a `setDoc` on `users/{uid}` — the
 * same document `AuthContext` concurrently opens a real-time `onSnapshot`
 * listener on the moment `firebaseUser` changes. In testing, that
 * combination intermittently hung indefinitely in the browser (never
 * resolved or rejected) roughly 1 in 4 attempts — reproducible in a real
 * browser but not in a plain Node script, so it's most likely a timing
 * issue inside the Firestore Web SDK's listener/get-request multiplexing
 * (possibly aggravated by React StrictMode's mount→cleanup→mount effect
 * cycling), not a bug in this app's own logic. Awaiting it directly used to
 * mean a hung Firestore write silently froze sign-in/register forever, even
 * though Authentication itself had already succeeded. The profile document
 * is a nice-to-have for this demo, not required for anything to function,
 * so any failure here is only logged, never surfaced to the caller.
 */
function ensureUserProfileInBackground(user: User) {
  ensureUserProfile(user).catch((error) => {
    console.error('Could not create user profile document (non-fatal):', error)
  })
}

export async function signInWithGoogle() {
  const authInstance = requireAuth()
  const provider = new GoogleAuthProvider()
  const credential = await signInWithPopup(authInstance, provider)
  ensureUserProfileInBackground(credential.user)
  return credential.user
}

export async function signInWithEmail(email: string, password: string) {
  const authInstance = requireAuth()
  const credential = await signInWithEmailAndPassword(authInstance, email, password)
  ensureUserProfileInBackground(credential.user)
  return credential.user
}

export async function registerWithEmail(email: string, password: string) {
  const authInstance = requireAuth()
  const credential = await createUserWithEmailAndPassword(authInstance, email, password)
  ensureUserProfileInBackground(credential.user)
  return credential.user
}

export async function signOutUser() {
  const authInstance = requireAuth()
  await signOut(authInstance)
}

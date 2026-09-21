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

export async function signInWithGoogle() {
  const authInstance = requireAuth()
  const provider = new GoogleAuthProvider()
  const credential = await signInWithPopup(authInstance, provider)
  await ensureUserProfile(credential.user)
  return credential.user
}

export async function signInWithEmail(email: string, password: string) {
  const authInstance = requireAuth()
  const credential = await signInWithEmailAndPassword(authInstance, email, password)
  await ensureUserProfile(credential.user)
  return credential.user
}

export async function registerWithEmail(email: string, password: string) {
  const authInstance = requireAuth()
  const credential = await createUserWithEmailAndPassword(authInstance, email, password)
  await ensureUserProfile(credential.user)
  return credential.user
}

export async function signOutUser() {
  const authInstance = requireAuth()
  await signOut(authInstance)
}

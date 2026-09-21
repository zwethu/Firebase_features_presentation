import { type FirebaseApp, getApps, initializeApp } from 'firebase/app'
import { type Auth, getAuth } from 'firebase/auth'
import { type Firestore, getFirestore } from 'firebase/firestore'
import { type FirebaseStorage, getStorage } from 'firebase/storage'
import { type Database, getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
}

/**
 * A project is only considered "configured" once the minimum values needed
 * to talk to Firebase are present. The admin dashboard and feature guards
 * read this flag instead of assuming every env var was filled in.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
)

export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined
let storage: FirebaseStorage | undefined
let rtdb: Database | undefined

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  if (firebaseConfig.databaseURL) {
    rtdb = getDatabase(app)
  }
}

export { app, auth, db, storage, rtdb }
export { firebaseConfig }

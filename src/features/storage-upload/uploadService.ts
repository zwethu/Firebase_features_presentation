import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { db, isFirebaseConfigured, storage } from '../../services/firebase'
import { ALLOWED_CONTENT_TYPES, MAX_UPLOAD_SIZE_MB, type UploadMetadata } from './types'

export function validateUploadFile(file: File): string | null {
  if (!ALLOWED_CONTENT_TYPES.includes(file.type as (typeof ALLOWED_CONTENT_TYPES)[number])) {
    return 'Only PDF, PNG, or JPEG files are accepted.'
  }
  const maxBytes = MAX_UPLOAD_SIZE_MB * 1024 * 1024
  if (file.size > maxBytes) {
    return `File is too large. The maximum allowed size is ${MAX_UPLOAD_SIZE_MB} MB.`
  }
  return null
}

/** Keeps the Storage path safe and matches the pattern enforced in storage.rules. */
export function sanitizeFileName(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9._-]/g, '-').slice(0, 100)
  const safe = cleaned.replace(/^[^A-Za-z0-9]+/, '') || 'file'
  return `${Date.now()}-${safe}`
}

export function buildUploadPath(uid: string, fileName: string): string {
  return `feature-lab/${uid}/uploads/${fileName}`
}

export interface UploadHandlers {
  onProgress?: (percent: number) => void
  onError?: (error: unknown) => void
  onComplete?: (result: { storagePath: string; downloadUrl: string | null }) => void
}

export function uploadDemoFile(storagePath: string, file: File, handlers: UploadHandlers = {}) {
  if (!isFirebaseConfigured || !storage) {
    throw new Error('Cloud Storage is not configured. Add your Firebase web config to .env.local.')
  }
  const storageRef = ref(storage, storagePath)
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type })

  task.on(
    'state_changed',
    (snapshot) => handlers.onProgress?.((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
    (error) => handlers.onError?.(error),
    async () => {
      let downloadUrl: string | null = null
      try {
        downloadUrl = await getDownloadURL(task.snapshot.ref)
      } catch {
        // Reading the URL is a nice-to-have for the demo preview — upload already succeeded either way.
      }
      handlers.onComplete?.({ storagePath, downloadUrl })
    },
  )

  return task
}

function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Cloud Firestore is not configured.')
  }
  return db
}

export interface CreateUploadMetadataInput {
  ownerId: string
  fileName: string
  contentType: string
  sizeBytes: number
  storagePath: string
}

export async function saveUploadMetadata(input: CreateUploadMetadataInput) {
  const database = requireDb()
  await addDoc(collection(database, 'demoUploadMetadata'), {
    ...input,
    createdAt: serverTimestamp(),
  })
}

export function subscribeToUploadMetadata(
  ownerId: string,
  onData: (uploads: UploadMetadata[]) => void,
  onError: (error: unknown) => void,
) {
  const database = requireDb()
  const uploadsQuery = query(
    collection(database, 'demoUploadMetadata'),
    where('ownerId', '==', ownerId),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(
    uploadsQuery,
    (snapshot) => {
      const uploads: UploadMetadata[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as {
          ownerId: string
          fileName: string
          contentType: string
          sizeBytes: number
          storagePath: string
          createdAt: Timestamp | null
        }
        return {
          id: docSnap.id,
          ownerId: data.ownerId,
          fileName: data.fileName,
          contentType: data.contentType,
          sizeBytes: data.sizeBytes,
          storagePath: data.storagePath,
          createdAtMs: data.createdAt ? data.createdAt.toMillis() : Date.now(),
        }
      })
      onData(uploads)
    },
    onError,
  )
}

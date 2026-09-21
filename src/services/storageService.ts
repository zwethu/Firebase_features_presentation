import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { isFirebaseConfigured, storage } from './firebase'

export const MAX_UPLOAD_SIZE_MB_DEFAULT = 10
export const ALLOWED_CONTENT_TYPE = 'application/pdf'

export interface UploadValidationError {
  code: 'invalid-type' | 'too-large'
  message: string
}

export function validateAssignmentFile(
  file: File,
  maxSizeMb: number = MAX_UPLOAD_SIZE_MB_DEFAULT,
): UploadValidationError | null {
  if (file.type !== ALLOWED_CONTENT_TYPE) {
    return { code: 'invalid-type', message: 'Only PDF files are accepted for assignment submissions.' }
  }
  const maxBytes = maxSizeMb * 1024 * 1024
  if (file.size > maxBytes) {
    return {
      code: 'too-large',
      message: `File is too large. The maximum allowed size is ${maxSizeMb} MB.`,
    }
  }
  return null
}

export function buildAssignmentStoragePath(uid: string, assignmentId: string, fileName: string) {
  return `assignments/${uid}/${assignmentId}/${fileName}`
}

export interface UploadHandlers {
  onProgress?: (percent: number) => void
  onError?: (error: unknown) => void
  onComplete?: (downloadUrl: string, storagePath: string) => void
}

export function uploadAssignmentFile(
  storagePath: string,
  file: File,
  handlers: UploadHandlers = {},
) {
  if (!isFirebaseConfigured || !storage) {
    throw new Error('Cloud Storage is not configured. Add your Firebase web config to .env.local.')
  }
  const storageRef = ref(storage, storagePath)
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type })

  task.on(
    'state_changed',
    (snapshot) => {
      const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      handlers.onProgress?.(percent)
    },
    (error) => handlers.onError?.(error),
    async () => {
      const url = await getDownloadURL(task.snapshot.ref)
      handlers.onComplete?.(url, storagePath)
    },
  )

  return task
}

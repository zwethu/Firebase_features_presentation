import type { UploadMetadata } from './types'

/**
 * Local-only fallback for the /storage demo when Cloud Storage isn't
 * configured. Simulates upload progress with a timer — it does NOT persist
 * the actual file anywhere, only the metadata, so the "uploaded file" is
 * never claimed to be retrievable. Clearly a simulation, never presented as
 * a real upload.
 */
const STORAGE_KEY = 'firebase-feature-lab:local-uploads'

function readAll(): UploadMetadata[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as UploadMetadata[]) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(uploads: UploadMetadata[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uploads))
  } catch {
    // Best-effort only.
  }
}

export function getLocalUploads(ownerId: string): UploadMetadata[] {
  return readAll()
    .filter((upload) => upload.ownerId === ownerId)
    .sort((a, b) => b.createdAtMs - a.createdAtMs)
}

export interface SimulateUploadHandlers {
  onProgress?: (percent: number) => void
  onComplete?: (metadata: UploadMetadata) => void
}

/** Simulates upload progress over ~1 second, then records local metadata. */
export function simulateLocalUpload(
  storagePath: string,
  file: File,
  ownerId: string,
  handlers: SimulateUploadHandlers = {},
) {
  let percent = 0
  const interval = setInterval(() => {
    percent = Math.min(percent + Math.random() * 30 + 15, 100)
    handlers.onProgress?.(percent)
    if (percent >= 100) {
      clearInterval(interval)
      const metadata: UploadMetadata = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ownerId,
        fileName: file.name,
        contentType: file.type,
        sizeBytes: file.size,
        storagePath,
        createdAtMs: Date.now(),
      }
      writeAll([metadata, ...readAll()])
      handlers.onComplete?.(metadata)
    }
  }, 180)
  return () => clearInterval(interval)
}

export const ALLOWED_CONTENT_TYPES = ['application/pdf', 'image/png', 'image/jpeg'] as const
export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number]

export const MAX_UPLOAD_SIZE_MB = 10

export interface UploadMetadata {
  id: string
  ownerId: string
  fileName: string
  contentType: string
  sizeBytes: number
  storagePath: string
  createdAtMs: number
}

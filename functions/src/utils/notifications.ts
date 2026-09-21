import { FieldValue } from 'firebase-admin/firestore'
import { db } from './admin'

export type NotificationType = 'submission' | 'announcement' | 'system'

export interface CreateNotificationInput {
  recipientId: string
  type: NotificationType
  title: string
  message: string
  relatedId: string | null
}

/**
 * Structured, minimal notification writer shared by both triggers. Kept
 * deliberately dumb (no FCM push here) so push delivery can be layered on
 * later without touching the business logic in submissions.ts/announcements.ts.
 */
export async function createNotification(input: CreateNotificationInput) {
  await db.collection('notifications').add({
    ...input,
    read: false,
    createdAt: FieldValue.serverTimestamp(),
  })
}

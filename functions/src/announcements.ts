import { FieldValue } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { db } from './utils/admin'

interface AnnouncementData {
  courseId: string
  title: string
  message: string
}

const BATCH_LIMIT = 400 // Firestore batches cap at 500 writes; stay comfortably under.

/**
 * Fires when a teacher posts an announcement. Fans out one unread
 * notification per enrolled student using batched writes.
 *
 * Structured to add FCM push later without changing this business logic:
 * a future step could read each recipient's `fcmTokens` and send a push
 * after the batch commits, without touching the notification-fanout code.
 */
export const onAnnouncementCreated = onDocumentCreated(
  'announcements/{announcementId}',
  async (event) => {
    const snapshot = event.data
    if (!snapshot) {
      logger.warn('onAnnouncementCreated: no snapshot data on event')
      return
    }

    const announcementId = event.params.announcementId
    const announcement = snapshot.data() as AnnouncementData

    if (!announcement.courseId) {
      logger.error('onAnnouncementCreated: announcement missing courseId', { announcementId })
      return
    }

    const courseSnap = await db.collection('courses').doc(announcement.courseId).get()
    if (!courseSnap.exists) {
      logger.warn('onAnnouncementCreated: course not found, skipping fan-out', {
        announcementId,
        courseId: announcement.courseId,
      })
      return
    }

    const studentIds = (courseSnap.data()?.studentIds as string[] | undefined) ?? []
    if (studentIds.length === 0) {
      logger.info('onAnnouncementCreated: course has no enrolled students', {
        announcementId,
        courseId: announcement.courseId,
      })
      return
    }

    for (let offset = 0; offset < studentIds.length; offset += BATCH_LIMIT) {
      const batch = db.batch()
      const chunk = studentIds.slice(offset, offset + BATCH_LIMIT)
      for (const studentId of chunk) {
        // Deterministic doc ID keeps a retried event idempotent per student.
        const notificationRef = db
          .collection('notifications')
          .doc(`announcement-${announcementId}-${studentId}`)
        batch.set(
          notificationRef,
          {
            recipientId: studentId,
            type: 'announcement',
            title: announcement.title,
            message: announcement.message,
            relatedId: announcementId,
            read: false,
            createdAt: FieldValue.serverTimestamp(),
          },
          { merge: true },
        )
      }
      await batch.commit()
    }

    logger.info('onAnnouncementCreated: notified enrolled students', {
      announcementId,
      courseId: announcement.courseId,
      studentCount: studentIds.length,
    })
  },
)

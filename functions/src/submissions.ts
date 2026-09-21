import { FieldValue } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { db } from './utils/admin'

interface SubmissionData {
  assignmentId: string
  courseId: string
  studentId: string
  studentName: string
  fileName: string
}

/**
 * Fires when a student submits an assignment. Notifies the course's
 * teacher and rolls up a lightweight per-course submission counter that
 * the Admin Dashboard can read cheaply without scanning submissions.
 */
export const onSubmissionCreated = onDocumentCreated(
  'submissions/{submissionId}',
  async (event) => {
    const snapshot = event.data
    if (!snapshot) {
      logger.warn('onSubmissionCreated: no snapshot data on event')
      return
    }

    const submissionId = event.params.submissionId
    const submission = snapshot.data() as SubmissionData

    if (!submission.courseId) {
      logger.error('onSubmissionCreated: submission missing courseId', { submissionId })
      return
    }

    const courseSnap = await db.collection('courses').doc(submission.courseId).get()
    if (!courseSnap.exists) {
      logger.warn('onSubmissionCreated: course not found, skipping notification', {
        submissionId,
        courseId: submission.courseId,
      })
      return
    }

    const teacherId = courseSnap.data()?.teacherId as string | undefined
    if (!teacherId) {
      logger.warn('onSubmissionCreated: course has no teacherId, skipping notification', {
        submissionId,
        courseId: submission.courseId,
      })
      return
    }

    // Deterministic notification doc ID makes this idempotent: a retried
    // event overwrites the same notification instead of duplicating it.
    const notificationRef = db.collection('notifications').doc(`submission-${submissionId}`)
    await notificationRef.set(
      {
        recipientId: teacherId,
        type: 'submission',
        title: 'New assignment submission',
        message: `${submission.studentName} submitted ${submission.fileName}.`,
        relatedId: submissionId,
        read: false,
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    const summaryRef = db.collection('courseSummaries').doc(submission.courseId)
    await summaryRef.set(
      { submissionCount: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    )

    logger.info('onSubmissionCreated: notified teacher', {
      submissionId,
      courseId: submission.courseId,
      teacherId,
    })
  },
)

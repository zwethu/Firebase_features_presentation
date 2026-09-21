import { FieldValue } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { db } from './utils/admin'

interface FunctionDemoEventData {
  createdBy: string
  label?: string
}

/**
 * Powers the /functions Feature Lab page: the frontend writes a
 * `functionDemos/{eventId}` document (a button click, nothing sensitive),
 * and this Firestore-triggered function reacts by writing a matching
 * `functionDemoResults/{eventId}` document plus a `demoNotifications`
 * entry for whoever created the event — a real, observable "backend code
 * ran automatically" moment for the presentation.
 *
 * Deterministic result/notification doc IDs (derived from the source event
 * ID) make this idempotent — a retried trigger invocation overwrites the
 * same documents instead of creating duplicates.
 */
export const onFunctionDemoCreated = onDocumentCreated(
  'functionDemos/{eventId}',
  async (event) => {
    const snapshot = event.data
    if (!snapshot) {
      logger.warn('onFunctionDemoCreated: no snapshot data on event')
      return
    }

    const eventId = event.params.eventId
    const demoEvent = snapshot.data() as FunctionDemoEventData

    if (!demoEvent.createdBy) {
      logger.error('onFunctionDemoCreated: event missing createdBy', { eventId })
      return
    }

    await db
      .collection('functionDemoResults')
      .doc(eventId)
      .set(
        {
          sourceEventId: eventId,
          status: 'ok',
          message: 'Processed by a Firestore-triggered Cloud Function (onFunctionDemoCreated).',
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      )

    await db
      .collection('demoNotifications')
      .doc(`function-demo-${eventId}`)
      .set(
        {
          recipientId: demoEvent.createdBy,
          type: 'function-demo',
          title: 'Cloud Function completed',
          message: 'Your demo event was processed by a Firestore-triggered Cloud Function.',
          relatedId: eventId,
          read: false,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      )

    logger.info('onFunctionDemoCreated: wrote result and notification', { eventId })
  },
)

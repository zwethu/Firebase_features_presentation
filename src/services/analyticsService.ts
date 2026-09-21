import { type Analytics, isSupported, getAnalytics, logEvent } from 'firebase/analytics'
import { app, isFirebaseConfigured } from './firebase'

export type AnalyticsEventName =
  // Feature Lab events (current product).
  | 'login'
  | 'demo_identity_selected'
  | 'demo_firestore_note_created'
  | 'demo_storage_upload_completed'
  | 'demo_realtime_reaction_added'
  | 'demo_function_event_created'
  | 'demo_remote_config_fetched'
  | 'demo_ai_question_asked'
  // Retired StudyFlow AI product events — kept only so orphaned pages that
  // still reference them continue to type-check.
  | 'course_opened'
  | 'assignment_upload_started'
  | 'assignment_uploaded'
  | 'ai_question_asked'
  | 'quiz_started'
  | 'quiz_completed'
  | 'notification_opened'

let analyticsInstance: Analytics | null = null
let supportChecked = false

/**
 * Analytics can throw in unsupported environments (SSR, some browsers with
 * tracking protection). We lazily probe support once and cache the result
 * so every call site can fire-and-forget events safely.
 */
async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (!isFirebaseConfigured || !app) return null
  if (analyticsInstance) return analyticsInstance
  if (supportChecked) return null

  supportChecked = true
  try {
    const supported = await isSupported()
    if (!supported) return null
    analyticsInstance = getAnalytics(app)
    return analyticsInstance
  } catch {
    return null
  }
}

/**
 * Logs an event without ever including free-text prompts, file contents, or
 * personally sensitive fields — only small, bounded, non-sensitive params.
 */
export async function logAnalyticsEvent(
  name: AnalyticsEventName,
  params?: Record<string, string | number | boolean>,
) {
  const instance = await getAnalyticsInstance()
  if (!instance) return
  // `logEvent`'s overloads narrow certain GA4-reserved names (e.g. "login")
  // to specific param shapes; our union of custom + reserved names doesn't
  // distribute over those overloads, so we call through a generic signature.
  const log = logEvent as (analytics: Analytics, eventName: string, params?: Record<string, unknown>) => void
  log(instance, name, params)
}

export async function isAnalyticsAvailable(): Promise<boolean> {
  return (await getAnalyticsInstance()) !== null
}

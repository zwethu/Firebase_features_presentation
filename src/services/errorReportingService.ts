/**
 * Firebase Crashlytics does not currently ship a supported web SDK. Rather
 * than fabricate an integration, this module implements the documented
 * fallback: a structured logger plus a place to plug in a real monitoring
 * SDK later without touching call sites.
 *
 * See README.md "Crashlytics and error monitoring" for the verified
 * capability status at time of writing and how to upgrade this later.
 */

export const CRASHLYTICS_WEB_SUPPORTED = false

export interface StructuredErrorReport {
  message: string
  stack?: string
  context?: Record<string, unknown>
  timestamp: string
}

const reports: StructuredErrorReport[] = []

export function reportError(error: unknown, context?: Record<string, unknown>) {
  const report: StructuredErrorReport = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
  }
  reports.push(report)
  // eslint-disable-next-line no-console
  console.error('[StudyFlow AI] structured error report', report)
  return report
}

export function getRecentErrorReports(): StructuredErrorReport[] {
  return [...reports].slice(-20)
}

export const CONTROLLED_DEMO_ERROR_MESSAGE = 'Controlled presentation demo error'

export function triggerTestError() {
  throw new Error('StudyFlow AI demo test error — triggered intentionally from /demo-error.')
}

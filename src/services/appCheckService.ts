import {
  type AppCheck,
  ReCaptchaV3Provider,
  initializeAppCheck,
} from 'firebase/app-check'
import { app, isDemoMode, isFirebaseConfigured } from './firebase'

export type AppCheckStatus = 'not-configured' | 'development-configured' | 'production-configured'

const siteKey = import.meta.env.VITE_APP_CHECK_SITE_KEY as string | undefined

let appCheckInstance: AppCheck | null = null
let initialized = false

/**
 * Authentication answers "who is the user?". App Check answers "does this
 * request come from our legitimate app environment?". They are
 * complementary, not interchangeable — Security Rules should not be
 * treated as fully protected by App Check alone.
 */
export function initAppCheck(): AppCheckStatus {
  if (initialized) return getAppCheckStatus()
  initialized = true

  if (!isFirebaseConfigured || !app) {
    return 'not-configured'
  }

  if (isDemoMode) {
    // Debug token flow. Only ever runs when VITE_DEMO_MODE=true, which
    // must never be the case in a real production deployment.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true
  }

  if (!siteKey) {
    return 'not-configured'
  }

  try {
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    })
    return getAppCheckStatus()
  } catch {
    return 'not-configured'
  }
}

export function getAppCheckStatus(): AppCheckStatus {
  if (!siteKey || !appCheckInstance) return 'not-configured'
  return isDemoMode ? 'development-configured' : 'production-configured'
}

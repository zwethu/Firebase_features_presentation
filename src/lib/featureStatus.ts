import { getAppCheckStatus } from '../services/appCheckService'
import { isAiConfigured } from '../services/aiService'
import { CRASHLYTICS_WEB_SUPPORTED } from '../services/errorReportingService'
import { firebaseConfig, isFirebaseConfigured } from '../services/firebase'
import type { FeatureId } from './features'
import { IMPLEMENTED_FEATURES } from './implementedFeatures'

export type FeatureStatus = 'live' | 'demo' | 'optional' | 'not-configured'

export const FEATURE_STATUS_LABEL: Record<FeatureStatus, string> = {
  live: 'Live Firebase Integration',
  demo: 'Demo Data / Simulation',
  optional: 'Optional Setup Required',
  'not-configured': 'Not Configured',
}

/**
 * Whether the current page is being served from an actual Firebase Hosting
 * deployment, judged from the hostname rather than a hard-coded URL — so
 * this is never a false "live" claim when running `npm run dev`.
 */
export function isServedFromFirebaseHosting(): boolean {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host.endsWith('.web.app') || host.endsWith('.firebaseapp.com')
}

/**
 * Best-effort status per feature, computed only from what the client can
 * truthfully know (env config, SDK capability checks). Pages that can
 * verify more at runtime (e.g. Cloud Functions actually responding) refine
 * this further on their own page rather than here.
 */
export function computeFeatureStatus(id: FeatureId): FeatureStatus {
  // A feature with no real demo yet is always "Not Configured" from the
  // outside — regardless of whether the underlying Firebase product
  // happens to be configured — so the Overview grid and sidebar never
  // claim a page is live when clicking into it only shows the honest
  // "not migrated yet" placeholder.
  if (!IMPLEMENTED_FEATURES.has(id)) return 'not-configured'

  switch (id) {
    case 'authentication':
    case 'firestore':
    case 'storage':
      // Each of these has a genuine, clearly-labelled local fallback demo
      // when Firebase isn't configured — never "not configured" once a
      // real interactive simulation exists to show instead.
      return isFirebaseConfigured ? 'live' : 'demo'
    case 'notifications':
      return isFirebaseConfigured ? 'live' : 'not-configured'
    case 'realtime-database':
      return isFirebaseConfigured && Boolean(firebaseConfig.databaseURL) ? 'live' : 'demo'
    case 'functions':
      // Deployment can't be verified client-side without calling a
      // function; each attempt on the Functions page refines this further.
      return isFirebaseConfigured ? 'optional' : 'not-configured'
    case 'ai-logic':
      return isAiConfigured() ? 'live' : 'not-configured'
    case 'app-check': {
      const status = getAppCheckStatus()
      if (status === 'production-configured') return 'live'
      if (status === 'development-configured') return 'demo'
      return 'not-configured'
    }
    case 'remote-config':
      return isFirebaseConfigured ? 'live' : 'demo'
    case 'ab-testing':
      // No verified live A/B Testing experiment is wired up — always shown
      // as sample/demo data until one is.
      return 'demo'
    case 'analytics':
      return isFirebaseConfigured ? 'live' : 'not-configured'
    case 'error-monitoring':
      return CRASHLYTICS_WEB_SUPPORTED ? 'live' : 'not-configured'
    case 'hosting':
      return isServedFromFirebaseHosting() ? 'live' : 'not-configured'
    case 'updates-2026':
      return 'demo'
  }
}

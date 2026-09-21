import type { FeatureId } from './features'

/**
 * Features that have a real interactive demo implementation. Keep this in
 * sync with `IMPLEMENTED_FEATURE_PAGES` in `app/router.tsx` (that map owns
 * the actual component wiring; this is just the id list so status/catalog
 * code can check "is this really built?" without importing page
 * components).
 *
 * Anything NOT listed here still renders `FeatureComingSoonPage` — its
 * status must never claim "Live Firebase Integration" or any other
 * working state just because the underlying Firebase product happens to
 * be configured. A configured-but-unbuilt feature is still unbuilt.
 */
export const IMPLEMENTED_FEATURES: ReadonlySet<FeatureId> = new Set<FeatureId>([
  'authentication',
  'firestore',
  'storage',
  'realtime-database',
  'functions',
  'notifications',
  'remote-config',
  'analytics',
  'ab-testing',
  'error-monitoring',
])

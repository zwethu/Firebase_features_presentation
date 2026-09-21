import type { ComponentType } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { OverviewPage } from '../pages/OverviewPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { AbTestingPage } from '../pages/AbTestingPage'
import { AnalyticsPage } from '../pages/AnalyticsPage'
import { AuthenticationPage } from '../pages/AuthenticationPage'
import { FirestorePage } from '../pages/FirestorePage'
import { FunctionsPage } from '../pages/FunctionsPage'
import { NotificationsPage } from '../pages/NotificationsPage'
import { RealtimeDatabasePage } from '../pages/RealtimeDatabasePage'
import { RemoteConfigPage } from '../pages/RemoteConfigPage'
import { StoragePage } from '../pages/StoragePage'
import { FeatureComingSoonPage } from '../pages/lab/FeatureComingSoonPage'
import { FEATURES, type FeatureId } from '../lib/features'

/**
 * Feature pages that have a real implementation. Anything in FEATURES but
 * not listed here still gets a route (via the fallback below) — it just
 * renders the honest "not migrated yet" placeholder instead of a real demo.
 */
const IMPLEMENTED_FEATURE_PAGES: Partial<Record<FeatureId, ComponentType>> = {
  authentication: AuthenticationPage,
  firestore: FirestorePage,
  storage: StoragePage,
  'realtime-database': RealtimeDatabasePage,
  functions: FunctionsPage,
  notifications: NotificationsPage,
  'remote-config': RemoteConfigPage,
  analytics: AnalyticsPage,
  'ab-testing': AbTestingPage,
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<OverviewPage />} />
        {FEATURES.map((feature) => {
          const Page = IMPLEMENTED_FEATURE_PAGES[feature.id]
          return (
            <Route
              key={feature.id}
              path={feature.route}
              element={Page ? <Page /> : <FeatureComingSoonPage featureId={feature.id} />}
            />
          )
        })}
      </Route>

      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

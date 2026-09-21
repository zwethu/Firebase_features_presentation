import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { OverviewPage } from '../pages/OverviewPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { FeatureComingSoonPage } from '../pages/lab/FeatureComingSoonPage'
import { FEATURES } from '../lib/features'

/**
 * Every feature route is registered up front (per the Feature Lab spec)
 * even before its real interactive demo is migrated in, so the sidebar and
 * direct links always work. `FeatureComingSoonPage` renders an honest
 * placeholder through the same template until a page implements its own
 * route below with a real component.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<OverviewPage />} />
        {FEATURES.map((feature) => (
          <Route
            key={feature.id}
            path={feature.route}
            element={<FeatureComingSoonPage featureId={feature.id} />}
          />
        ))}
      </Route>

      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

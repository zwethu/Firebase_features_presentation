import { FeaturePage } from '../../components/lab/FeaturePage'
import { EmptyState } from '../../components/ui/EmptyState'
import { getFeature, type FeatureId } from '../../lib/features'
import { computeFeatureStatus } from '../../lib/featureStatus'

/**
 * Placeholder for a Feature Lab page whose interactive demo hasn't been
 * migrated yet. Renders through the same FeaturePage template (so nav,
 * layout, and status badge are all consistent) but is honest that nothing
 * live is here — never presented as a working demo.
 *
 * Status comes from computeFeatureStatus() rather than a hardcoded value so
 * this page can never drift out of sync with what the Overview grid and
 * sidebar show for the same feature — both read the same function.
 */
export function FeatureComingSoonPage({ featureId }: { featureId: FeatureId }) {
  const feature = getFeature(featureId)

  return (
    <FeaturePage
      feature={feature}
      status={computeFeatureStatus(featureId)}
      statusNote="This page is scaffolded but its interactive demo hasn't been migrated into the Feature Lab yet."
      whatItIs={<p>{feature.tagline}</p>}
      demo={
        <EmptyState
          title="Demo not migrated yet"
          description="This feature page is part of the Firebase Feature Lab migration plan and will be implemented in an upcoming pass."
        />
      }
      howItWorks={<p className="text-slate-500">Coming soon.</p>}
      useCases={<p className="text-slate-500">Coming soon.</p>}
    />
  )
}

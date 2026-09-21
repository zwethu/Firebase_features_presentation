import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { ArchitectureDiagram } from '../components/lab/ArchitectureDiagram'
import { DemoResultPanel } from '../components/lab/DemoResultPanel'
import { FeaturePage } from '../components/lab/FeaturePage'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useDemoMode } from '../app/DemoContext'
import { useDemoResults } from '../hooks/useDemoResults'
import { useRemoteConfig } from '../hooks/useRemoteConfig'
import { logDemoEvent } from '../lib/eventLog'
import { getFeature } from '../lib/features'
import { computeFeatureStatus } from '../lib/featureStatus'
import { QUIZ_CTA_LABEL } from '../lib/quizCta'
import { REMOTE_CONFIG_DEFAULTS } from '../services/remoteConfigService'
import { logAnalyticsEvent } from '../services/analyticsService'

const feature = getFeature('remote-config')

export function RemoteConfigPage() {
  const { presentationMode } = useDemoMode()
  const { values, status, loading, refetch } = useRemoteConfig()
  const { entries, pushResult } = useDemoResults()
  const [localOverride, setLocalOverride] = useState<'A' | 'B' | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const featureStatus = computeFeatureStatus('remote-config')
  const isLiveFetch = !loading && !status.usingDefaults
  const effectiveVariant = isLiveFetch ? values.quiz_cta_variant : (localOverride ?? values.quiz_cta_variant)
  const modeLabel = isLiveFetch ? 'Live Firebase Integration' : 'Demo Data / Simulation'

  async function handleRefetch() {
    setRefreshing(true)
    try {
      const result = await refetch()
      const sent = await logAnalyticsEvent('demo_remote_config_fetched')
      logDemoEvent('remote-config', 'Fetched latest Remote Config')
      if (result.usingDefaults) {
        pushResult(
          result.error
            ? `Fetch unavailable (${result.error}). Showing defaults / local preview.`
            : 'Fetch completed — using default values.',
          'info',
        )
      } else {
        pushResult(
          sent
            ? 'Configuration fetched successfully. Analytics event demo_remote_config_fetched sent.'
            : 'Configuration fetched successfully.',
          'success',
        )
      }
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <FeaturePage
      feature={feature}
      status={featureStatus}
      statusNote={
        isLiveFetch
          ? undefined
          : 'Live fetch is not active right now. Defaults and the local A/B toggle below are labelled Demo Data / Simulation — they never write to Firebase.'
      }
      whatItIs={
        <p>
          Remote Config changes a feature remotely. Here, <code>quiz_cta_variant</code> chooses the
          quiz call-to-action. Change it in Firebase Console, publish, then fetch — the website
          updates without a rebuild or redeploy.
        </p>
      }
      demo={
        <div className="space-y-5">
          <ArchitectureDiagram
            steps={[
              'Firebase Console',
              'Remote Config parameter: quiz_cta_variant',
              'Fetch and activate in website',
              'Website UI changes without a redeployment',
            ]}
          />

          <div className="rounded-lg border border-firebase-blue-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Class demo
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-navy-900">
              <li>Open Firebase Console → Remote Config.</li>
              <li>Change quiz_cta_variant from A to B.</li>
              <li>Publish changes.</li>
              <li>Return here and click Fetch Latest Configuration.</li>
              <li>Observe the button text change without redeploying the website.</li>
            </ol>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Default value</p>
              <p className="mt-1 font-mono text-lg font-semibold text-navy-950">
                {REMOTE_CONFIG_DEFAULTS.quiz_cta_variant}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Current active / fetched value
              </p>
              <p className="mt-1 font-mono text-lg font-semibold text-navy-950">
                {loading ? 'fetching…' : effectiveVariant}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Last successful fetch</p>
              <p className="mt-1 text-sm text-navy-950">
                {status.fetchedAt ? status.fetchedAt.toLocaleString() : 'Not fetched yet'}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Fetch status</p>
              <Badge tone={isLiveFetch ? 'success' : status.error ? 'danger' : 'warning'}>
                {loading ? 'Fetching…' : isLiveFetch ? 'Fetched & activated' : status.error ? 'Fetch failed' : 'Using defaults'}
              </Badge>
            </div>
          </div>

          <Button variant="primary" size={presentationMode ? 'lg' : 'md'} onClick={handleRefetch} isLoading={refreshing}>
            <RefreshCw size={16} aria-hidden="true" /> Fetch Latest Configuration
          </Button>

          {!isLiveFetch && (
            <div className="space-y-2 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4">
              <Badge tone="warning">Demo Data / Simulation</Badge>
              <p className="text-sm text-amber-900">
                Remote Config is unavailable or could not fetch. This local A/B toggle only changes
                what this page shows.
              </p>
              <div className="flex gap-2">
                {(['A', 'B'] as const).map((variant) => (
                  <button
                    key={variant}
                    type="button"
                    onClick={() => setLocalOverride(variant)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium ${
                      effectiveVariant === variant
                        ? 'border-firebase-blue-400 bg-firebase-blue-500/10 text-firebase-blue-700'
                        : 'border-amber-200 bg-white text-amber-900 hover:border-amber-400'
                    }`}
                  >
                    Variant {variant}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg border-2 border-firebase-blue-300 bg-white p-6 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Active call-to-action — Variant {effectiveVariant}
            </p>
            <Button size="lg" className={presentationMode ? 'px-8 py-4 text-xl' : ''}>
              {QUIZ_CTA_LABEL[effectiveVariant]}
            </Button>
          </div>

          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Remote Config values are delivered to the client. Never store passwords, secret API keys,
            tokens, or confidential information here.
          </p>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Event / result panel
            </p>
            <dl className="grid gap-1 text-sm text-navy-900 sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Mode</dt>
                <dd className="font-medium">{modeLabel}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Default value</dt>
                <dd className="font-medium">{REMOTE_CONFIG_DEFAULTS.quiz_cta_variant}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Active value</dt>
                <dd className="font-medium">{effectiveVariant}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Last fetch</dt>
                <dd className="font-medium">
                  {status.fetchedAt ? status.fetchedAt.toLocaleString() : 'Not fetched yet'}
                </dd>
              </div>
            </dl>
            <div className="mt-3">
              <DemoResultPanel entries={entries} emptyLabel="Latest action: not fetched yet" />
            </div>
          </div>
        </div>
      }
      howItWorks={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            In-code defaults (<code>quiz_cta_variant: "A"</code>) keep the app usable if Remote Config
            is unreachable.
          </li>
          <li>Fetch and activate pulls the latest published Console values into this client.</li>
          <li>Demo mode uses a shorter minimum fetch interval so a live Console change can be shown in class.</li>
        </ul>
      }
      useCases={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Feature flags and copy changes without a redeploy.</li>
          <li>Feeding variants into Firebase A/B Testing.</li>
          <li>Maintenance messages and kill switches.</li>
        </ul>
      }
    />
  )
}

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { ArchitectureDiagram } from '../components/lab/ArchitectureDiagram'
import { DemoResultPanel } from '../components/lab/DemoResultPanel'
import { FeaturePage } from '../components/lab/FeaturePage'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useDemoResults } from '../hooks/useDemoResults'
import { useRemoteConfig } from '../hooks/useRemoteConfig'
import { logDemoEvent } from '../lib/eventLog'
import { getFeature } from '../lib/features'
import type { FeatureStatus } from '../lib/featureStatus'
import { REMOTE_CONFIG_DEFAULTS, initRemoteConfig } from '../services/remoteConfigService'
import { logAnalyticsEvent } from '../services/analyticsService'

const feature = getFeature('remote-config')

const CTA_LABEL: Record<'A' | 'B', string> = {
  A: 'Start Quiz',
  B: 'Start Your 5-Minute Quiz →',
}

export function RemoteConfigPage() {
  const { values, status, loading } = useRemoteConfig()
  const { entries, pushResult } = useDemoResults()
  const [localOverride, setLocalOverride] = useState<'A' | 'B' | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const isLive = !loading && !status.usingDefaults
  const featureStatus: FeatureStatus = isLive ? 'live' : 'demo'
  const effectiveVariant = isLive ? values.quiz_cta_variant : (localOverride ?? values.quiz_cta_variant)

  async function handleRefetch() {
    setRefreshing(true)
    try {
      const result = await initRemoteConfig()
      logAnalyticsEvent('demo_remote_config_fetched')
      logDemoEvent('remote-config', 'Refetched Remote Config values')
      pushResult(
        result.usingDefaults ? 'Fetch completed — using default values.' : 'Fetched and activated new values.',
        result.usingDefaults ? 'info' : 'success',
      )
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <FeaturePage
      feature={feature}
      status={featureStatus}
      statusNote={
        isLive
          ? undefined
          : 'Not fetching live values right now — this page falls back to documented defaults and lets you toggle a local demo override instead, clearly labelled as a simulation.'
      }
      whatItIs={
        <p>
          Remote Config lets you change how your app behaves for users already running it — no new app
          release required. Here, a single parameter, <code>quiz_cta_variant</code>, controls which
          call-to-action text is shown, entirely from the Firebase Console.
        </p>
      }
      demo={
        <div className="space-y-5">
          <ArchitectureDiagram
            steps={[
              'App starts with an in-code default: quiz_cta_variant = "A"',
              'fetchAndActivate() asks the Remote Config backend for current values',
              'If a value was published in Console, it overrides the default',
              'The app re-renders using whatever value is now active',
            ]}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Default value</p>
              <p className="mt-1 font-mono text-sm text-navy-950">{REMOTE_CONFIG_DEFAULTS.quiz_cta_variant}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Fetched value</p>
              <p className="mt-1 font-mono text-sm text-navy-950">
                {loading ? 'fetching…' : isLive ? values.quiz_cta_variant : 'not fetched (using default)'}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Last fetch time</p>
              <p className="mt-1 text-sm text-navy-950">
                {status.fetchedAt ? status.fetchedAt.toLocaleTimeString() : 'never'}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Fetch status</p>
              <Badge tone={isLive ? 'success' : status.error ? 'danger' : 'warning'}>
                {loading ? 'Fetching…' : isLive ? 'Fetched & activated' : status.error ? 'Fetch failed' : 'Using defaults'}
              </Badge>
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={handleRefetch} isLoading={refreshing}>
            <RefreshCw size={14} aria-hidden="true" /> Refetch now
          </Button>

          {!isLive && (
            <div className="space-y-2 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4">
              <Badge tone="warning">Demo Data / Simulation</Badge>
              <p className="text-sm text-amber-900">
                No live Remote Config value is active, so here's a local toggle for the presentation —
                it never touches the real Remote Config, it only changes what this page shows below.
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

          <div className="rounded-lg border border-slate-200 p-4 text-center">
            <p className="mb-2 text-xs text-slate-500">Live-driven quiz CTA:</p>
            <Button size="lg">{CTA_LABEL[effectiveVariant]}</Button>
            <p className="mt-2 text-xs text-slate-400">Currently showing Variant {effectiveVariant}</p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Event / result panel
            </p>
            <DemoResultPanel entries={entries} emptyLabel="Refetch to see results here." />
          </div>
        </div>
      }
      howItWorks={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            In-code defaults (<code>quiz_cta_variant: "A"</code>) guarantee the app never breaks if
            Remote Config is unreachable.
          </li>
          <li><code>fetchAndActivate()</code> pulls the latest published values and swaps them in atomically.</li>
          <li>A minimum fetch interval throttles how often the app re-checks — relaxed in demo mode so presenters can show a live refresh.</li>
          <li>Never place secrets here — every value is downloaded to, and readable in, the client.</li>
        </ul>
      }
      useCases={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Feature flags — turning a feature on/off without a redeploy.</li>
          <li>A/B testing copy or UI variants (paired with Firebase A/B Testing).</li>
          <li>Kill switches and maintenance messages during an incident.</li>
        </ul>
      }
    />
  )
}

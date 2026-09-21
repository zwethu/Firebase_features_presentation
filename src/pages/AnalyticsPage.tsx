import { useEffect, useState } from 'react'
import { Activity, ExternalLink } from 'lucide-react'
import { ArchitectureDiagram } from '../components/lab/ArchitectureDiagram'
import { FeaturePage } from '../components/lab/FeaturePage'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { useDemoEventLog } from '../hooks/useDemoEventLog'
import { getFeature } from '../lib/features'
import type { FeatureStatus } from '../lib/featureStatus'
import { isAnalyticsAvailable } from '../services/analyticsService'
import { firebaseConfig, isFirebaseConfigured } from '../services/firebase'

const feature = getFeature('analytics')

const TRACKED_EVENTS: { name: string; description: string }[] = [
  { name: 'login', description: 'Fired on real sign-in (/authentication)' },
  { name: 'demo_identity_selected', description: 'Fired when choosing a local demo identity' },
  { name: 'demo_firestore_note_created', description: 'Fired when a note is added (/firestore)' },
  { name: 'demo_storage_upload_completed', description: 'Fired when an upload finishes (/storage)' },
  { name: 'demo_realtime_reaction_added', description: 'Fired on each reaction (/realtime-database)' },
  { name: 'demo_function_event_created', description: 'Fired when a demo event is created (/functions)' },
  { name: 'demo_remote_config_fetched', description: 'Fired on a Remote Config refetch (/remote-config)' },
  { name: 'demo_ai_question_asked', description: 'Fired when a question is asked (/ai-logic) — no prompt text included' },
]

export function AnalyticsPage() {
  const events = useDemoEventLog()
  const [available, setAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    isAnalyticsAvailable().then((result) => {
      if (mounted) setAvailable(result)
    })
    return () => {
      mounted = false
    }
  }, [])

  const status: FeatureStatus = available === null ? (isFirebaseConfigured ? 'demo' : 'not-configured') : available ? 'live' : 'not-configured'

  return (
    <FeaturePage
      feature={feature}
      status={status}
      statusNote={
        isFirebaseConfigured
          ? available === false
            ? 'Firebase is configured, but this browser/environment does not support the Analytics SDK — events are not being sent anywhere. The local stream below still works.'
            : undefined
          : 'Firebase is not configured, so no events are actually sent to Google Analytics. The local stream below still shows what would have been logged.'
      }
      whatItIs={
        <p>
          Google Analytics answers "what are users doing in the app?" — small, structured events
          (like "a note was created") sent to Google's servers and aggregated into reports over time.
          It is deliberately decoupled from every other feature: every page here logs its own event and
          moves on.
        </p>
      }
      demo={
        <div className="space-y-5">
          <ArchitectureDiagram
            steps={[
              'A user action happens anywhere in the app (e.g. a note is created)',
              'logAnalyticsEvent() sends a small, non-sensitive event',
              'Google Analytics aggregates events over time',
              'Reports appear in the Firebase Console (not instantly)',
            ]}
          />

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <span className="flex items-center gap-1.5 text-sm font-medium text-navy-900">
              <Activity size={15} aria-hidden="true" /> Analytics SDK availability
            </span>
            <Badge tone={available === null ? 'neutral' : available ? 'success' : 'warning'}>
              {available === null ? 'Checking…' : available ? 'Supported & active' : 'Not available'}
            </Badge>
          </div>

          {isFirebaseConfigured && (
            <a
              href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/analytics`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-firebase-blue-700 hover:underline"
            >
              Open official Analytics reports in Firebase Console
              <ExternalLink size={13} aria-hidden="true" />
            </a>
          )}

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Events tracked across Feature Lab
            </p>
            <ul className="space-y-1.5">
              {TRACKED_EVENTS.map((event) => (
                <li key={event.name} className="flex flex-wrap items-baseline gap-2 text-sm">
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{event.name}</code>
                  <span className="text-slate-500">{event.description}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Local demonstration event stream
              </p>
              <Badge tone="warning">Not the Firebase Analytics Console</Badge>
            </div>
            <p className="mb-2 text-xs text-slate-500">
              Every event fired during this browser session, for on-screen presentation clarity — real
              Analytics reports take time to populate and aren't visible live during a demo.
            </p>
            {events.length === 0 ? (
              <EmptyState
                title="No events yet this session"
                description="Try other feature pages (add a note, upload a file, react) and come back here."
              />
            ) : (
              <ul className="max-h-72 space-y-1 overflow-y-auto">
                {events.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
                  >
                    <span className="text-navy-900">
                      <span className="text-slate-400">[{event.source}]</span> {event.label}
                    </span>
                    <span className="flex-shrink-0 text-xs text-slate-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      }
      howItWorks={
        <ul className="list-disc space-y-1.5 pl-5">
          <li><code>isSupported()</code> is checked once before Analytics ever initializes — it safely no-ops in unsupported environments instead of throwing.</li>
          <li>Events carry only small, bounded, non-sensitive parameters — never emails, UIDs, file contents, or raw AI prompts.</li>
          <li>DebugView in the Firebase Console shows events in near-real-time during development; standard reports can take up to 24 hours.</li>
        </ul>
      }
      useCases={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Understanding which features users actually use.</li>
          <li>Funnels — e.g. how many people who sign in go on to upload a file.</li>
          <li>Pairing with Remote Config values to measure the effect of an A/B Testing experiment.</li>
        </ul>
      }
    />
  )
}

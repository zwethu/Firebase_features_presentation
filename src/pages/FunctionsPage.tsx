import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Unsubscribe } from 'firebase/firestore'
import { ArchitectureDiagram } from '../components/lab/ArchitectureDiagram'
import { DemoResultPanel } from '../components/lab/DemoResultPanel'
import { FeaturePage } from '../components/lab/FeaturePage'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import {
  createFunctionDemoEvent,
  subscribeToFunctionDemoResult,
  type FunctionDemoResult,
} from '../features/function-demo/functionDemoService'
import { useCurrentActor } from '../hooks/useCurrentActor'
import { useDemoResults } from '../hooks/useDemoResults'
import { logDemoEvent } from '../lib/eventLog'
import { getFeature } from '../lib/features'
import type { FeatureStatus } from '../lib/featureStatus'
import { logAnalyticsEvent } from '../services/analyticsService'
import { isFirebaseConfigured } from '../services/firebase'

const feature = getFeature('functions')
const RESULT_TIMEOUT_MS = 20_000

type Phase = 'idle' | 'creating' | 'waiting' | 'received' | 'timeout' | 'error'

export function FunctionsPage() {
  const actor = useCurrentActor()
  const { entries, pushResult } = useDemoResults()

  const [phase, setPhase] = useState<Phase>('idle')
  const [eventId, setEventId] = useState<string | null>(null)
  const [result, setResult] = useState<FunctionDemoResult | null>(null)
  const [verifiedLive, setVerifiedLive] = useState(false)

  const unsubscribeRef = useRef<Unsubscribe | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const blockedPendingSignIn = isFirebaseConfigured && actor.kind !== 'firebase'

  useEffect(() => {
    return () => {
      unsubscribeRef.current?.()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // The status badge starts at the honest "we don't know yet" default and
  // is only ever upgraded/downgraded to something more specific once the
  // user actually triggers the demo and we observe a real outcome —
  // never guessed in advance.
  let status: FeatureStatus = isFirebaseConfigured ? 'optional' : 'not-configured'
  if (phase === 'received' || verifiedLive) status = 'live'
  else if (phase === 'timeout') status = 'optional'

  async function handleCreateEvent() {
    if (blockedPendingSignIn) return
    unsubscribeRef.current?.()
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    setPhase('creating')
    setResult(null)
    setEventId(null)

    try {
      const id = await createFunctionDemoEvent(actor.uid, 'Create Demo Event click')
      setEventId(id)
      logAnalyticsEvent('demo_function_event_created')
      logDemoEvent('functions', `${actor.displayName} created a demo event`)
      pushResult(`Event created: functionDemos/${id}`, 'success')
      setPhase('waiting')

      unsubscribeRef.current = subscribeToFunctionDemoResult(
        id,
        (nextResult) => {
          setResult(nextResult)
          setVerifiedLive(true)
          setPhase('received')
          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          logDemoEvent('functions', 'Result document received from Cloud Function')
          pushResult('Result document received.', 'success')
        },
        (err) => {
          pushResult(err instanceof Error ? err.message : 'Could not listen for the result.', 'error')
        },
      )

      timeoutRef.current = setTimeout(() => {
        unsubscribeRef.current?.()
        setPhase((current) => (current === 'received' ? current : 'timeout'))
        pushResult(
          `No result after ${RESULT_TIMEOUT_MS / 1000}s — Cloud Functions may not be deployed to this project yet.`,
          'error',
        )
      }, RESULT_TIMEOUT_MS)
    } catch (err) {
      setPhase('error')
      pushResult(err instanceof Error ? err.message : 'Could not create the demo event.', 'error')
    }
  }

  return (
    <FeaturePage
      feature={feature}
      status={status}
      statusNote={
        isFirebaseConfigured
          ? actor.kind === 'firebase'
            ? 'Status is unverified until you click "Create Demo Event" below — a Cloud Function cannot be meaningfully simulated client-side, so this page always attempts a real call rather than faking a result.'
            : 'Cloud Firestore is configured, but you need to sign in — this demo requires a real signed-in user to write the trigger document.'
          : 'Firebase is not configured, so this page cannot demonstrate a real Cloud Function. Configure Firebase and deploy the function to try it.'
      }
      whatItIs={
        <p>
          Cloud Functions run backend code automatically in response to events — no server to manage.
          Here, creating a small Firestore document triggers a function that reacts to it, entirely
          server-side.
        </p>
      }
      demo={
        <div className="space-y-5">
          <ArchitectureDiagram
            steps={[
              'You click "Create Demo Event"',
              'App writes functionDemos/{id} to Firestore',
              'A Firestore-triggered Cloud Function (onFunctionDemoCreated) runs automatically',
              'The function writes functionDemoResults/{id} back',
              'This page is listening and shows the result the instant it arrives',
            ]}
          />

          {blockedPendingSignIn && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <Link to="/authentication" className="font-medium underline">
                Sign in on the Authentication page
              </Link>{' '}
              to try this demo.
            </div>
          )}

          {!isFirebaseConfigured && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Firebase is not configured in this environment, so there is nothing to call.
            </div>
          )}

          <div className="space-y-3 rounded-lg border border-slate-200 p-4">
            <Button onClick={handleCreateEvent} disabled={blockedPendingSignIn || phase === 'creating' || phase === 'waiting'} isLoading={phase === 'creating'}>
              <PlayCircle size={16} aria-hidden="true" /> Create Demo Event
            </Button>

            {phase !== 'idle' && (
              <ol className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    className={eventId ? 'text-emerald-600' : 'text-slate-300'}
                    aria-hidden="true"
                  />
                  Event created{eventId ? ` (functionDemos/${eventId})` : '…'}
                </li>
                <li className="flex items-center gap-2">
                  {phase === 'waiting' ? (
                    <Clock size={15} className="text-amber-500" aria-hidden="true" />
                  ) : (
                    <CheckCircle2
                      size={15}
                      className={phase === 'received' ? 'text-emerald-600' : 'text-slate-300'}
                      aria-hidden="true"
                    />
                  )}
                  {phase === 'waiting'
                    ? 'Waiting for the Cloud Function…'
                    : phase === 'timeout'
                      ? 'No result received (timed out)'
                      : 'Waiting for the Cloud Function'}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2
                    size={15}
                    className={phase === 'received' ? 'text-emerald-600' : 'text-slate-300'}
                    aria-hidden="true"
                  />
                  Result document received
                </li>
              </ol>
            )}

            {result && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">
                <Badge tone="success">functionDemoResults/{result.sourceEventId}</Badge>
                <p className="mt-2 text-emerald-900">{result.message}</p>
              </div>
            )}

            {phase === 'timeout' && (
              <div className="space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                <p className="font-medium">Cloud Functions may not be deployed to this project yet.</p>
                <p>Deploy them, then try again:</p>
                <pre className="overflow-x-auto rounded bg-amber-100 p-2 text-xs">
                  cd functions{'\n'}npm install{'\n'}cd ..{'\n'}npx firebase deploy --only functions
                </pre>
                <p className="text-xs">Requires the Blaze (pay-as-you-go) billing plan.</p>
              </div>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Event / result panel
            </p>
            <DemoResultPanel entries={entries} emptyLabel="Create a demo event to see results here." />
          </div>
        </div>
      }
      howItWorks={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <code>onDocumentCreated('functionDemos/&#123;eventId&#125;', ...)</code> registers the
            function to run whenever a new document appears in that collection.
          </li>
          <li>The function uses the Admin SDK, which bypasses Security Rules entirely — it can write anywhere.</li>
          <li>
            A deterministic result document ID (same as the triggering event's ID) makes the whole
            flow idempotent: a retried function invocation overwrites the same result instead of
            duplicating it.
          </li>
          <li>This page never fakes a result — it always attempts a real write-and-listen, and honestly reports a timeout if nothing responds.</li>
        </ul>
      }
      useCases={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Sending a notification when a record is created (exactly this pattern).</li>
          <li>Resizing an uploaded image, moderating content, or fanning out writes after an event.</li>
          <li>Any backend logic that should run automatically without a server you manage.</li>
        </ul>
      }
    />
  )
}

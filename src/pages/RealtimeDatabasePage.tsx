import { useEffect, useState } from 'react'
import { Heart, RotateCcw, Wifi, WifiOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { useDemoMode } from '../app/DemoContext'
import { ArchitectureDiagram } from '../components/lab/ArchitectureDiagram'
import { DemoResultPanel } from '../components/lab/DemoResultPanel'
import { FeaturePage } from '../components/lab/FeaturePage'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import {
  addLocalReaction,
  resetLocalReactionCount,
  subscribeToLocalReactionCount,
} from '../features/realtime-reactions/localReactionsService'
import {
  addReaction,
  realtimeDatabaseConfigured,
  resetReactionCount,
  subscribeToConnectionStatus,
  subscribeToReactionCount,
} from '../features/realtime-reactions/reactionsService'
import { useCurrentActor } from '../hooks/useCurrentActor'
import { useDemoResults } from '../hooks/useDemoResults'
import { logDemoEvent } from '../lib/eventLog'
import { getFeature } from '../lib/features'
import { computeFeatureStatus } from '../lib/featureStatus'
import { logAnalyticsEvent } from '../services/analyticsService'

const feature = getFeature('realtime-database')

export function RealtimeDatabasePage() {
  const actor = useCurrentActor()
  const { firebaseConfigured } = useAuth()
  const { demoMode } = useDemoMode()
  const { entries, pushResult } = useDemoResults()

  const [count, setCount] = useState(0)
  const [connected, setConnected] = useState<boolean | null>(null)
  const [isReacting, setIsReacting] = useState(false)

  const usingLiveRtdb = realtimeDatabaseConfigured && actor.kind === 'firebase'
  // When RTDB IS configured, reactions must go through the real database —
  // never silently fall back to the local simulation just because the
  // user hasn't signed in yet.
  const blockedPendingSignIn = realtimeDatabaseConfigured && actor.kind !== 'firebase'
  const status = computeFeatureStatus('realtime-database')

  useEffect(() => {
    if (blockedPendingSignIn) {
      setConnected(null)
      setCount(0)
      return
    }
    if (!realtimeDatabaseConfigured) {
      setConnected(null)
      return subscribeToLocalReactionCount(setCount)
    }
    const unsubscribeCount = subscribeToReactionCount(setCount, () =>
      pushResult('Could not read the live reaction count.', 'error'),
    )
    const unsubscribeStatus = subscribeToConnectionStatus(setConnected)
    return () => {
      unsubscribeCount()
      unsubscribeStatus()
    }
  }, [blockedPendingSignIn, pushResult])

  async function handleReact() {
    if (blockedPendingSignIn) return
    setIsReacting(true)
    try {
      if (usingLiveRtdb) {
        await addReaction()
      } else {
        addLocalReaction()
      }
      logAnalyticsEvent('demo_realtime_reaction_added')
      logDemoEvent('realtime-database', `${actor.displayName} added a reaction`)
      pushResult('Reaction added.', 'success')
    } catch (err) {
      pushResult(err instanceof Error ? err.message : 'Could not add reaction.', 'error')
    } finally {
      setIsReacting(false)
    }
  }

  async function handleReset() {
    if (blockedPendingSignIn) return
    try {
      if (usingLiveRtdb) {
        await resetReactionCount()
      } else {
        resetLocalReactionCount()
      }
      logDemoEvent('realtime-database', `${actor.displayName} reset the counter (demo mode)`)
      pushResult('Counter reset.', 'info')
    } catch (err) {
      pushResult(err instanceof Error ? err.message : 'Could not reset counter.', 'error')
    }
  }

  return (
    <FeaturePage
      feature={feature}
      status={status}
      statusNote={
        realtimeDatabaseConfigured
          ? actor.kind === 'firebase'
            ? undefined
            : 'Realtime Database is configured, but you need to sign in to react — its rules require a real signed-in user.'
          : firebaseConfigured
            ? 'Realtime Database has no VITE_FIREBASE_DATABASE_URL configured — this demo runs on localStorage + BroadcastChannel instead, clearly labelled as a simulation.'
            : 'Firebase is not configured — this demo runs on localStorage + BroadcastChannel instead, clearly labelled as a simulation.'
      }
      whatItIs={
        <p>
          The Realtime Database stores one big JSON tree and syncs it to every connected client with
          very low latency — built for the "many people, one shared live value" case, like this
          reaction counter. Where Firestore organizes data into collections/documents optimized for
          complex queries, RTDB is a simpler, faster tree optimized for raw sync speed.
        </p>
      }
      demo={
        <div className="space-y-5">
          <ArchitectureDiagram
            steps={
              realtimeDatabaseConfigured
                ? [
                    'You click "React"',
                    'runTransaction() atomically increments featureLab/reactions/firebase',
                    'RTDB pushes the new value to every connected client',
                    'Every open tab/browser updates the count instantly',
                  ]
                : [
                    'You click "React"',
                    'Count is incremented in this browser\'s localStorage',
                    'A BroadcastChannel message notifies other open tabs',
                    'Every tab listening re-reads localStorage and updates',
                  ]
            }
          />

          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <strong>Presentation tip:</strong> open this page in two tabs. Click "React" in one and
            watch the count update instantly in the other{realtimeDatabaseConfigured ? '' : ' (simulated locally)'}.
          </p>

          {blockedPendingSignIn && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <Link to="/authentication" className="font-medium underline">
                Sign in on the Authentication page
              </Link>{' '}
              to react using the real Realtime Database.
            </div>
          )}

          <div className="flex flex-col items-center gap-4 rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-2">
              <Badge tone={realtimeDatabaseConfigured ? 'success' : 'warning'}>
                {realtimeDatabaseConfigured ? 'Live Realtime Database' : 'Local simulation'}
              </Badge>
              {realtimeDatabaseConfigured && (
                <Badge tone={connected ? 'success' : 'neutral'}>
                  {connected === null ? (
                    'Checking connection…'
                  ) : connected ? (
                    <span className="flex items-center gap-1">
                      <Wifi size={12} aria-hidden="true" /> Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <WifiOff size={12} aria-hidden="true" /> Disconnected
                    </span>
                  )}
                </Badge>
              )}
            </div>

            <p className="text-5xl font-bold text-firebase-blue-700">{count}</p>
            <p className="text-sm text-slate-500">reactions to "Firebase"</p>

            <div className="flex gap-2">
              <Button
                onClick={handleReact}
                isLoading={isReacting}
                disabled={blockedPendingSignIn}
              >
                <Heart size={16} aria-hidden="true" /> React
              </Button>
              {demoMode && (
                <Button variant="secondary" onClick={handleReset}>
                  <RotateCcw size={14} aria-hidden="true" /> Reset (demo mode only)
                </Button>
              )}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Event / result panel
            </p>
            <DemoResultPanel entries={entries} emptyLabel="Click React to see results here." />
          </div>
        </div>
      }
      howItWorks={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            The count lives at one JSON path: <code>featureLab/reactions/firebase</code> — a single
            number, not a document with multiple fields.
          </li>
          <li>
            <code>runTransaction()</code> reads the current value and writes <code>current + 1</code>{' '}
            atomically — safe even if two people click "React" at the exact same moment.
          </li>
          <li>
            A live <code>.info/connected</code> path (shown above) reports the actual client-server
            connection state — useful for showing users "you're offline" banners.
          </li>
          <li>Rules require a signed-in user for every read and write — never public.</li>
        </ul>
      }
      useCases={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Live counters, polls, and reactions shared across many simultaneous viewers.</li>
          <li>Online/offline presence ("who's online right now").</li>
          <li>Multiplayer cursors, collaborative whiteboards — anything needing the lowest possible sync latency over complex querying.</li>
        </ul>
      }
    />
  )
}

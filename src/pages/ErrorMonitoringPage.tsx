import { useState } from 'react'
import { ArchitectureDiagram } from '../components/lab/ArchitectureDiagram'
import { DemoResultPanel } from '../components/lab/DemoResultPanel'
import { FeaturePage } from '../components/lab/FeaturePage'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useDemoMode } from '../app/DemoContext'
import { useDemoResults } from '../hooks/useDemoResults'
import { logDemoEvent } from '../lib/eventLog'
import { getFeature } from '../lib/features'
import { computeFeatureStatus } from '../lib/featureStatus'
import { logAnalyticsEvent } from '../services/analyticsService'
import {
  CONTROLLED_DEMO_ERROR_MESSAGE,
  CRASHLYTICS_WEB_SUPPORTED,
  getRecentErrorReports,
} from '../services/errorReportingService'

const feature = getFeature('error-monitoring')

const CONFIRM_MESSAGE =
  'This will trigger a controlled presentation-only error.\nNo user data, Firebase data, files, or authentication data will be changed.\nContinue?'

const MONITORING_STATUS = CRASHLYTICS_WEB_SUPPORTED
  ? 'Crashlytics Active'
  : 'Error Boundary + Local Error Logger Active'

function ControlledErrorThrower({ armed }: { armed: boolean }) {
  if (armed) {
    throw new Error(CONTROLLED_DEMO_ERROR_MESSAGE)
  }
  return null
}

export function ErrorMonitoringPage() {
  const { demoMode, presentationMode } = useDemoMode()
  const { entries, pushResult } = useDemoResults()
  const [buttonClicked, setButtonClicked] = useState(false)
  const [confirmationAccepted, setConfirmationAccepted] = useState(false)
  const [boundaryCaught, setBoundaryCaught] = useState(false)
  const [armed, setArmed] = useState(false)
  const [analyticsState, setAnalyticsState] = useState<'sent' | 'unavailable' | 'local-only'>('unavailable')
  const [localLogger, setLocalLogger] = useState<'recorded' | 'unavailable'>('unavailable')

  const status = computeFeatureStatus('error-monitoring')

  async function handleTriggerClick() {
    setButtonClicked(true)
    const accepted = window.confirm(CONFIRM_MESSAGE)
    if (!accepted) {
      setConfirmationAccepted(false)
      pushResult('Trigger cancelled — no error was thrown.', 'info')
      return
    }

    setConfirmationAccepted(true)
    const sent = await logAnalyticsEvent('demo_controlled_error_triggered')
    setAnalyticsState(sent ? 'sent' : 'local-only')
    logDemoEvent('error-monitoring', 'Controlled presentation demo error armed')
    pushResult(
      sent
        ? 'Confirmation accepted. Analytics event demo_controlled_error_triggered sent.'
        : 'Confirmation accepted. Analytics unavailable — local event only.',
      sent ? 'success' : 'info',
    )
    setArmed(true)
  }

  function handleCaught() {
    setBoundaryCaught(true)
    const reports = getRecentErrorReports()
    setLocalLogger(reports.length > 0 ? 'recorded' : 'unavailable')
    pushResult('Error Boundary caught the controlled demo error.', 'success')
    logDemoEvent('error-monitoring', 'Error Boundary caught controlled demo error')
  }

  function handleReset() {
    setArmed(false)
    pushResult('Demo recovered. The rest of the website was not affected.', 'info')
  }

  return (
    <FeaturePage
      feature={feature}
      status={status}
      statusNote="Firebase Crashlytics is not configured for this React web project. This page demonstrates React Error Boundary and local structured error logging only."
      whatItIs={
        <p>
          Error monitoring captures unexpected failures so developers can fix them with evidence.
          This demo is presentation-only: a static error, a confirmation step, and recovery — no
          Firestore, Storage, Auth, or user data is changed.
        </p>
      }
      demo={
        <div className="space-y-5">
          <ArchitectureDiagram
            steps={[
              'Controlled demo error',
              'React Error Boundary',
              'Local error logger',
              'Optional verified Crashlytics reporting',
              'Developer investigates and fixes issue',
            ]}
          />

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Monitoring status
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="warning">{MONITORING_STATUS}</Badge>
              <Badge tone="neutral">
                {CRASHLYTICS_WEB_SUPPORTED ? 'Crashlytics Active' : 'Crashlytics Not Configured'}
              </Badge>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Crashlytics not configured for this environment. This demo uses React Error Boundary
              and local structured error logging.
            </p>
          </div>

          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            This is a controlled presentation-only error. No user data or Firebase data is changed.
          </p>

          <ErrorBoundary compact onCaught={handleCaught} onReset={handleReset}>
            <ControlledErrorThrower armed={armed} />
            {demoMode ? (
              <Button
                variant="danger"
                size={presentationMode ? 'lg' : 'md'}
                onClick={handleTriggerClick}
              >
                Trigger Controlled Demo Error
              </Button>
            ) : (
              <p className="text-sm text-slate-500">
                The demo trigger is hidden unless <code>VITE_DEMO_MODE=true</code>.
              </p>
            )}
          </ErrorBoundary>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Event / result panel
            </p>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Button clicked</dt>
                <dd className="font-medium">{buttonClicked ? 'yes' : 'no'}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Confirmation accepted</dt>
                <dd className="font-medium">{confirmationAccepted ? 'yes' : 'no'}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Error Boundary caught error</dt>
                <dd className="font-medium">{boundaryCaught ? 'yes' : 'no'}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Local error logger</dt>
                <dd className="font-medium">{localLogger}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Analytics event</dt>
                <dd className="font-medium">{analyticsState}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Crashlytics</dt>
                <dd className="font-medium">
                  {CRASHLYTICS_WEB_SUPPORTED ? 'sent (verified active)' : 'not sent — not configured'}
                </dd>
              </div>
            </dl>
            <div className="mt-3">
              <DemoResultPanel entries={entries} emptyLabel="No controlled error has been triggered yet." />
            </div>
          </div>

          {!CRASHLYTICS_WEB_SUPPORTED && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm font-medium text-navy-950">
                Presentation backup: verified dashboard screenshot required
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Placeholder for a Crashlytics Console screenshot. Do not treat this box as a live
                Firebase dashboard event.
              </p>
            </div>
          )}
        </div>
      }
      howItWorks={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>The trigger never runs on page load. It requires a click and an explicit confirm.</li>
          <li>
            The nested Error Boundary recovers this demo without permanently crashing the rest of
            the website.
          </li>
          <li>
            Analytics, when available, logs only <code>demo_controlled_error_triggered</code> — never
            stacks, emails, UIDs, prompts, file names, tokens, or Firebase config.
          </li>
        </ul>
      }
      useCases={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Catching render failures before they take down the whole session.</li>
          <li>Giving developers a structured local trail when Crashlytics is not available on web.</li>
          <li>Teaching the difference between a safe demo error and a production crash pipeline.</li>
        </ul>
      }
    />
  )
}

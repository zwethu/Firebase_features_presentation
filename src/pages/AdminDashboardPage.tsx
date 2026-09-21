import { useEffect, useState } from 'react'
import { useAuth } from '../app/AuthContext'
import { FirebaseStatusBanner } from '../components/FirebaseStatusBanner'
import { Badge } from '../components/ui/Badge'
import { Card, CardHeader, CardTitle } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { useRemoteConfig } from '../hooks/useRemoteConfig'
import { getAppCheckStatus } from '../services/appCheckService'
import { isAnalyticsAvailable } from '../services/analyticsService'
import { CRASHLYTICS_WEB_SUPPORTED } from '../services/errorReportingService'
import { isFirebaseConfigured } from '../services/firebase'
import { getCollectionCounts, type CollectionCounts } from '../services/firestoreService'
import { isAiConfigured } from '../services/aiService'

type StatusTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

function StatusPill({ label, tone }: { label: string; tone: StatusTone }) {
  return <Badge tone={tone}>{label}</Badge>
}

export function AdminDashboardPage() {
  const { firebaseUser, profile } = useAuth()
  const { values: remoteConfigValues, status: remoteConfigStatus, loading: remoteConfigLoading } = useRemoteConfig()

  const [counts, setCounts] = useState<CollectionCounts | null>(null)
  const [analyticsAvailable, setAnalyticsAvailable] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false)
      return
    }
    let mounted = true
    Promise.all([getCollectionCounts(), isAnalyticsAvailable()])
      .then(([countResult, analyticsResult]) => {
        if (!mounted) return
        setCounts(countResult)
        setAnalyticsAvailable(analyticsResult)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const appCheckStatus = getAppCheckStatus()
  const aiConfigured = isAiConfigured()

  return (
    <div className="space-y-4">
      <FirebaseStatusBanner />
      <h1 className="text-xl font-semibold text-navy-950">Admin / Presenter Dashboard</h1>

      {loading ? (
        <Spinner label="Loading feature status" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Firebase Authentication</CardTitle>
              <StatusPill label={firebaseUser ? 'signed in' : 'signed out'} tone={firebaseUser ? 'success' : 'neutral'} />
            </CardHeader>
            <p className="text-sm text-slate-600">{profile?.email ?? 'No signed-in user'}</p>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cloud Firestore</CardTitle>
              <StatusPill label={isFirebaseConfigured ? 'configured' : 'not configured'} tone={isFirebaseConfigured ? 'success' : 'warning'} />
            </CardHeader>
            <ul className="text-sm text-slate-600">
              <li>Courses: {counts?.courses ?? '—'}</li>
              <li>Submissions: {counts?.submissions ?? '—'}</li>
              <li>Announcements: {counts?.announcements ?? '—'}</li>
            </ul>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cloud Storage</CardTitle>
              <StatusPill label={isFirebaseConfigured ? 'configured' : 'not configured'} tone={isFirebaseConfigured ? 'success' : 'warning'} />
            </CardHeader>
            <p className="text-sm text-slate-600">
              {counts?.submissions ?? 0} assignment file(s) uploaded (derived from submission records).
            </p>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cloud Functions</CardTitle>
              <StatusPill label="see deployment" tone="neutral" />
            </CardHeader>
            <p className="text-sm text-slate-600">
              `onSubmissionCreated` notifies the course teacher. `onAnnouncementCreated` notifies enrolled
              students. Deploy from the <code>functions/</code> directory to activate.
            </p>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Logic</CardTitle>
              <StatusPill label={aiConfigured ? 'configured' : 'not configured'} tone={aiConfigured ? 'success' : 'warning'} />
            </CardHeader>
            <p className="text-sm text-slate-600">Gemini via Firebase AI Logic powers the AI Study Assistant.</p>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>App Check</CardTitle>
              <StatusPill
                label={appCheckStatus.replace('-', ' ')}
                tone={appCheckStatus === 'production-configured' ? 'success' : appCheckStatus === 'development-configured' ? 'info' : 'warning'}
              />
            </CardHeader>
            <p className="text-sm text-slate-600">
              Authentication verifies the user; App Check helps verify requests come from the legitimate
              app environment.
            </p>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <StatusPill label={analyticsAvailable ? 'active' : 'unavailable'} tone={analyticsAvailable ? 'success' : 'neutral'} />
            </CardHeader>
            <p className="text-sm text-slate-600">
              Local/demo counters shown across this app. Official reports live in the Firebase Console
              Analytics dashboard (may take time to populate).
            </p>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crashlytics</CardTitle>
              <StatusPill label={CRASHLYTICS_WEB_SUPPORTED ? 'configured' : 'not configured for this environment'} tone={CRASHLYTICS_WEB_SUPPORTED ? 'success' : 'warning'} />
            </CardHeader>
            <p className="text-sm text-slate-600">
              A React Error Boundary and structured error logger are active as the documented fallback.
              See <code>/demo-error</code>.
            </p>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Remote Config</CardTitle>
              <StatusPill label={remoteConfigLoading ? 'fetching' : remoteConfigStatus.usingDefaults ? 'using defaults' : 'fetched'} tone={remoteConfigStatus.usingDefaults ? 'warning' : 'success'} />
            </CardHeader>
            <ul className="text-sm text-slate-600">
              <li>quiz_cta_variant: {remoteConfigValues.quiz_cta_variant}</li>
              <li>ai_assistant_enabled: {String(remoteConfigValues.ai_assistant_enabled)}</li>
              <li>max_upload_size_mb: {remoteConfigValues.max_upload_size_mb}</li>
              <li className="text-xs text-slate-400">
                Fetched: {remoteConfigStatus.fetchedAt?.toLocaleTimeString() ?? 'not yet'}
              </li>
            </ul>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>A/B Testing</CardTitle>
              <StatusPill label="demo variant" tone="warning" />
            </CardHeader>
            <p className="text-sm text-slate-600">
              Quiz CTA variant {remoteConfigValues.quiz_cta_variant} is currently shown. Sample completion
              rates are illustrative only — see the Quiz page for the demo comparison card.
            </p>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Firebase Hosting</CardTitle>
              <StatusPill label={import.meta.env.MODE} tone="info" />
            </CardHeader>
            <p className="text-sm text-slate-600">Deployed via `firebase deploy --only hosting`.</p>
          </Card>
        </div>
      )}
    </div>
  )
}

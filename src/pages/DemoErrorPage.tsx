import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { CRASHLYTICS_WEB_SUPPORTED } from '../services/errorReportingService'

export function DemoErrorPage() {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    // Thrown during render so React's Error Boundary can catch it, the same
    // way an unexpected rendering bug would surface in production.
    throw new Error('StudyFlow AI demo test error — triggered intentionally from /demo-error.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="max-w-md text-center">
        <AlertTriangle className="mx-auto text-amber-500" size={28} aria-hidden="true" />
        <h1 className="mt-3 text-lg font-semibold text-navy-950">Development-only test error</h1>
        <p className="mt-2 text-sm text-slate-600">
          Crashlytics is {CRASHLYTICS_WEB_SUPPORTED ? 'configured' : 'not configured for web in this environment'}.
          This page triggers a controlled error caught by StudyFlow AI's React Error Boundary and
          structured error logger.
        </p>
        <Button variant="danger" className="mt-4" onClick={() => setShouldThrow(true)}>
          Trigger test error
        </Button>
        <p className="mt-4 text-xs text-slate-400">
          <Link to="/dashboard" className="hover:underline">
            Back to dashboard
          </Link>
        </p>
      </Card>
    </div>
  )
}

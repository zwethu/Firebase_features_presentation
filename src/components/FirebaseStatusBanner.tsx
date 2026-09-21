import { AlertTriangle } from 'lucide-react'
import { useAuth } from '../app/AuthContext'

export function FirebaseStatusBanner() {
  const { firebaseConfigured } = useAuth()
  if (firebaseConfigured) return null

  return (
    <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
      <p>
        Firebase is not configured for this environment. Add your web app config to{' '}
        <code className="rounded bg-amber-100 px-1 py-0.5">.env.local</code> (see{' '}
        <code className="rounded bg-amber-100 px-1 py-0.5">.env.example</code>). You're viewing a
        preview with no live data.
      </p>
    </div>
  )
}

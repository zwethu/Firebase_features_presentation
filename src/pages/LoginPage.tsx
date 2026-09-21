import { type FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { useAuth } from '../app/AuthContext'
import { signInWithEmail, signInWithGoogle } from '../services/authService'
import { logAnalyticsEvent } from '../services/analyticsService'
import { Button } from '../components/ui/Button'
import { FieldError, Input, Label } from '../components/ui/Field'
import { Card } from '../components/ui/Card'

export function LoginPage() {
  const { firebaseUser, firebaseConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  if (firebaseUser) {
    return <Navigate to={from} replace />
  }

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await signInWithEmail(email, password)
      await logAnalyticsEvent('login', { method: 'password' })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleSignIn() {
    setError(null)
    setIsGoogleSubmitting(true)
    try {
      await signInWithGoogle()
      await logAnalyticsEvent('login', { method: 'google' })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in with Google.')
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-firebase-blue-600 text-white">
            <GraduationCap size={20} aria-hidden="true" />
          </span>
          <h1 className="mt-3 text-lg font-semibold text-navy-950">Sign in to StudyFlow AI</h1>
          <p className="mt-1 text-sm text-slate-500">
            Demo accounts may be supplied separately by your presenter.
          </p>
        </div>

        {!firebaseConfigured && (
          <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Firebase Authentication is not configured for this environment. Add your web config to
            .env.local to enable sign-in.
          </p>
        )}

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={handleGoogleSignIn}
          isLoading={isGoogleSubmitting}
          disabled={!firebaseConfigured}
        >
          Continue with Google
        </Button>

        <div className="my-4 flex items-center gap-2 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          or
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!firebaseConfigured}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!firebaseConfigured}
            />
          </div>
          <FieldError>{error}</FieldError>
          <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={!firebaseConfigured}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          <Link to="/" className="hover:underline">
            Back to home
          </Link>
        </p>
      </Card>
    </div>
  )
}

import { FirebaseError } from 'firebase/app'
import { type FormEvent, useState } from 'react'
import { Briefcase, GraduationCap, LogOut, ShieldQuestion, UserCog } from 'lucide-react'
import { useAuth } from '../app/AuthContext'
import { DEMO_IDENTITIES, type DemoIdentityId, useDemoIdentity } from '../app/DemoIdentityContext'
import { ArchitectureDiagram } from '../components/lab/ArchitectureDiagram'
import { DemoResultPanel } from '../components/lab/DemoResultPanel'
import { FeaturePage } from '../components/lab/FeaturePage'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { FieldError, Input, Label } from '../components/ui/Field'
import { useDemoResults } from '../hooks/useDemoResults'
import { logAnalyticsEvent } from '../services/analyticsService'
import { registerWithEmail, signInWithEmail, signInWithGoogle, signOutUser } from '../services/authService'
import { getFeature } from '../lib/features'
import { computeFeatureStatus } from '../lib/featureStatus'
import { logDemoEvent } from '../lib/eventLog'
import { maskEmail, shortenUid } from '../lib/format'

const feature = getFeature('authentication')

const DEMO_IDENTITY_META: Record<DemoIdentityId, { icon: typeof GraduationCap; description: string }> = {
  student: { icon: GraduationCap, description: 'Simulates a signed-in student for the rest of the demo.' },
  teacher: { icon: Briefcase, description: 'Simulates a signed-in teacher/presenter.' },
  admin: { icon: UserCog, description: 'Simulates a signed-in administrator.' },
}

function describeAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/operation-not-allowed':
        return 'This sign-in provider is not enabled for this Firebase project. In Firebase Console → Authentication → Sign-in method, enable it, then try again.'
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled before it completed.'
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'That email/password combination was not recognized.'
      case 'auth/email-already-in-use':
        return 'That email is already registered — try signing in instead.'
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for sign-in. Add it under Firebase Console → Authentication → Settings → Authorized domains.'
      default:
        return `Sign-in failed (${error.code}).`
    }
  }
  return error instanceof Error ? error.message : 'Sign-in failed.'
}

export function AuthenticationPage() {
  const { firebaseUser, firebaseConfigured } = useAuth()
  const { identity, selectIdentity, clearIdentity } = useDemoIdentity()
  const { entries, pushResult } = useDemoResults()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  const status = computeFeatureStatus('authentication')

  async function handleGoogleSignIn() {
    setError(null)
    setIsGoogleSubmitting(true)
    try {
      await signInWithGoogle()
      logAnalyticsEvent('login', { method: 'google' })
      logDemoEvent('authentication', 'Signed in with Google')
      pushResult('Signed in with Google.', 'success')
    } catch (err) {
      const message = describeAuthError(err)
      setError(message)
      pushResult(message, 'error')
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSigningIn(true)
    try {
      await signInWithEmail(email, password)
      logAnalyticsEvent('login', { method: 'password' })
      logDemoEvent('authentication', 'Signed in with email/password')
      pushResult('Signed in with email/password.', 'success')
    } catch (err) {
      const message = describeAuthError(err)
      setError(message)
      pushResult(message, 'error')
    } finally {
      setIsSigningIn(false)
    }
  }

  async function handleRegister() {
    setError(null)
    setIsRegistering(true)
    try {
      await registerWithEmail(email, password)
      logAnalyticsEvent('login', { method: 'password-register' })
      logDemoEvent('authentication', 'Registered a new account')
      pushResult('Account created and signed in.', 'success')
    } catch (err) {
      const message = describeAuthError(err)
      setError(message)
      pushResult(message, 'error')
    } finally {
      setIsRegistering(false)
    }
  }

  async function handleSignOut() {
    await signOutUser()
    pushResult('Signed out.', 'info')
  }

  function handleSelectDemoIdentity(id: DemoIdentityId) {
    selectIdentity(id)
    logAnalyticsEvent('demo_identity_selected')
    logDemoEvent('authentication', `Selected local demo identity: ${DEMO_IDENTITIES[id].displayName}`)
    pushResult(`Now acting as ${DEMO_IDENTITIES[id].displayName} (local simulation only).`, 'info')
  }

  return (
    <FeaturePage
      feature={feature}
      status={status}
      statusNote={
        firebaseConfigured
          ? undefined
          : 'Firebase Authentication is not configured — the interactive demo below runs on a local, clearly-labelled demo identity selector instead of real sign-in.'
      }
      whatItIs={
        <div className="space-y-3">
          <p>
            Firebase Authentication answers one question: <strong>who is the user?</strong> It verifies
            an identity (via Google, email/password, or other providers) and gives your app a stable,
            unique user ID to build everything else on top of.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-navy-950">
                <ShieldQuestion size={14} aria-hidden="true" /> Authentication
              </p>
              <p className="mt-1 text-sm text-slate-600">"Who are you?" — verifies identity.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-semibold text-navy-950">Authorization</p>
              <p className="mt-1 text-sm text-slate-600">
                "What are you allowed to do?" — enforced separately by Security Rules, using the
                identity Authentication provided.
              </p>
            </div>
          </div>
        </div>
      }
      demo={
        <div className="space-y-5">
          <ArchitectureDiagram
            steps={[
              'User clicks "Sign in" (Google or email/password)',
              'Firebase Authentication verifies the credential',
              'App receives a signed-in User object + ID token',
              'Security Rules use that identity to authorize Firestore/Storage requests',
            ]}
          />

          {firebaseConfigured ? (
            firebaseUser ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="success">Signed in</Badge>
                  <Button variant="secondary" size="sm" onClick={handleSignOut}>
                    <LogOut size={14} aria-hidden="true" /> Sign out
                  </Button>
                </div>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Display name</dt>
                    <dd className="font-medium text-navy-950">{firebaseUser.displayName ?? '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Email</dt>
                    <dd className="font-medium text-navy-950">
                      {firebaseUser.email ? maskEmail(firebaseUser.email) : '—'}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">UID</dt>
                    <dd className="font-mono text-xs text-navy-950">{shortenUid(firebaseUser.uid)}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="space-y-3 rounded-lg border border-slate-200 p-4">
                <Badge tone="neutral">Signed out</Badge>
                <Button variant="secondary" className="w-full" onClick={handleGoogleSignIn} isLoading={isGoogleSubmitting}>
                  Continue with Google
                </Button>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
                </div>
                <form onSubmit={handleEmailSubmit} className="space-y-2">
                  <div>
                    <Label htmlFor="auth-email">Email</Label>
                    <Input id="auth-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="auth-password">Password</Label>
                    <Input
                      id="auth-password"
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <FieldError>{error}</FieldError>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="flex-1"
                      isLoading={isSigningIn}
                      disabled={isRegistering}
                    >
                      Sign in
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      isLoading={isRegistering}
                      disabled={isSigningIn}
                      onClick={handleRegister}
                    >
                      Register
                    </Button>
                  </div>
                </form>
              </div>
            )
          ) : (
            <div className="space-y-3 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4">
              <Badge tone="warning">Demo Data / Simulation</Badge>
              <p className="text-sm text-amber-900">
                Choose a local demo identity. This never talks to Firebase — it only labels which
                synthetic user the rest of the local-simulation demos on this site act as.
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {(Object.keys(DEMO_IDENTITIES) as DemoIdentityId[]).map((id) => {
                  const meta = DEMO_IDENTITY_META[id]
                  const Icon = meta.icon
                  const isActive = identity?.id === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleSelectDemoIdentity(id)}
                      className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                        isActive
                          ? 'border-firebase-blue-400 bg-firebase-blue-500/10'
                          : 'border-amber-200 bg-white hover:border-amber-400'
                      }`}
                    >
                      <Icon size={16} className="text-firebase-blue-600" aria-hidden="true" />
                      <p className="mt-1 font-medium text-navy-950">{DEMO_IDENTITIES[id].displayName}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{meta.description}</p>
                    </button>
                  )
                })}
              </div>
              {identity && (
                <Button variant="ghost" size="sm" onClick={clearIdentity}>
                  Clear demo identity
                </Button>
              )}
            </div>
          )}

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Event / result panel
            </p>
            <DemoResultPanel entries={entries} emptyLabel="Sign in or choose a demo identity to see results here." />
          </div>
        </div>
      }
      howItWorks={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>The Firebase Web SDK talks directly to Firebase Authentication — no custom backend needed.</li>
          <li>On success, the SDK returns a signed-in <code>User</code> object and keeps a short-lived ID token refreshed automatically.</li>
          <li>Every other Firebase product (Firestore, Storage, Functions) reads <code>request.auth.uid</code> from that token to decide what the request is allowed to do — Authentication never grants access by itself.</li>
          <li>Multiple providers (Google, email/password, and others) can all resolve to the same underlying user identity.</li>
        </ul>
      }
      useCases={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Personalizing an app per user (their own notes, uploads, notifications).</li>
          <li>Scoping Security Rules so users can only read/write their own data.</li>
          <li>Letting presenters/teachers see different data than students, via a real identity rather than a client-side flag.</li>
          <li>Single sign-on across web and mobile clients sharing the same Firebase project.</li>
        </ul>
      }
    />
  )
}

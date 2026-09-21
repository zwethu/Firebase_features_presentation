import { LogOut, Maximize, Minimize, Monitor } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../app/AuthContext'
import { useDemoMode } from '../../app/DemoContext'
import { cn } from '../../lib/cn'
import { signOutUser } from '../../services/authService'
import { firebaseConfig, isFirebaseConfigured } from '../../services/firebase'
import { Badge } from '../ui/Badge'
import { DemoBadge } from '../DemoBadge'

function useIsFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(document.fullscreenElement))
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])
  return isFullscreen
}

export function Topbar() {
  const { firebaseUser } = useAuth()
  const { presentationMode, setPresentationMode } = useDemoMode()
  const isFullscreen = useIsFullscreen()

  async function handleSignOut() {
    await signOutUser()
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen().catch(() => {})
    }
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-y-2 border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <DemoBadge />
        <Badge tone={isFirebaseConfigured ? 'success' : 'warning'}>
          {isFirebaseConfigured ? `Project: ${firebaseConfig.projectId}` : 'Firebase not configured'}
        </Badge>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setPresentationMode(!presentationMode)}
          aria-pressed={presentationMode}
          title="Presentation mode: larger type, less dense layout"
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
            presentationMode
              ? 'border-firebase-blue-400 bg-firebase-blue-500/10 text-firebase-blue-700'
              : 'border-slate-200 text-slate-500 hover:bg-slate-100',
          )}
        >
          <Monitor size={14} aria-hidden="true" />
          <span className="hidden sm:inline">Presentation mode</span>
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-navy-950"
        >
          {isFullscreen ? <Minimize size={16} aria-hidden="true" /> : <Maximize size={16} aria-hidden="true" />}
        </button>

        {firebaseUser ? (
          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-navy-950">{firebaseUser.displayName ?? 'Signed in'}</p>
              <p className="text-xs text-slate-500">{firebaseUser.email}</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-navy-950"
              aria-label="Sign out"
            >
              <LogOut size={18} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <Link
            to="/authentication"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-navy-900 hover:bg-slate-50"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}

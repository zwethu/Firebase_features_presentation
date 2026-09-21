import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'firebase-feature-lab:demo-identity'

export type DemoIdentityId = 'student' | 'teacher' | 'admin'

export interface DemoIdentity {
  id: DemoIdentityId
  /** A synthetic, stable, non-secret identifier — never a real Firebase UID. */
  uid: string
  displayName: string
}

export const DEMO_IDENTITIES: Record<DemoIdentityId, DemoIdentity> = {
  student: { id: 'student', uid: 'demo-student', displayName: 'Student Demo User' },
  teacher: { id: 'teacher', uid: 'demo-teacher', displayName: 'Teacher Demo User' },
  admin: { id: 'admin', uid: 'demo-admin', displayName: 'Admin Demo User' },
}

interface DemoIdentityContextValue {
  identity: DemoIdentity | null
  selectIdentity: (id: DemoIdentityId) => void
  clearIdentity: () => void
}

const DemoIdentityContext = createContext<DemoIdentityContextValue>({
  identity: null,
  selectIdentity: () => {},
  clearIdentity: () => {},
})

function readStoredIdentityId(): DemoIdentityId | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY)
    return value === 'student' || value === 'teacher' || value === 'admin' ? value : null
  } catch {
    return null
  }
}

/**
 * A presenter-only "who am I" fallback for when Firebase Authentication
 * isn't configured. This is never real authentication or authorization —
 * it only labels which synthetic identity local-only demos (notes,
 * reactions, notifications) attribute actions to. Persisted per-tab via
 * sessionStorage so it survives navigating between feature pages during a
 * presentation, but never leaks across a real login session.
 */
export function DemoIdentityProvider({ children }: { children: ReactNode }) {
  const [identityId, setIdentityId] = useState<DemoIdentityId | null>(readStoredIdentityId)

  useEffect(() => {
    try {
      if (identityId) {
        sessionStorage.setItem(STORAGE_KEY, identityId)
      } else {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // Best-effort only.
    }
  }, [identityId])

  const value = useMemo<DemoIdentityContextValue>(
    () => ({
      identity: identityId ? DEMO_IDENTITIES[identityId] : null,
      selectIdentity: setIdentityId,
      clearIdentity: () => setIdentityId(null),
    }),
    [identityId],
  )

  return <DemoIdentityContext.Provider value={value}>{children}</DemoIdentityContext.Provider>
}

export function useDemoIdentity() {
  return useContext(DemoIdentityContext)
}

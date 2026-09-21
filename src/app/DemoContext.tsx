import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isDemoMode } from '../services/firebase'

const PRESENTATION_MODE_STORAGE_KEY = 'studyflow-ai:presentation-mode'

interface DemoContextValue {
  demoMode: boolean
  /**
   * Projector-friendly display mode: larger type, less dense layout. Purely
   * a UI preference — never affects what data is real vs. simulated.
   */
  presentationMode: boolean
  setPresentationMode: (value: boolean) => void
}

const DemoContext = createContext<DemoContextValue>({
  demoMode: isDemoMode,
  presentationMode: false,
  setPresentationMode: () => {},
})

function readStoredPresentationMode(): boolean {
  try {
    return localStorage.getItem(PRESENTATION_MODE_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [presentationMode, setPresentationModeState] = useState(readStoredPresentationMode)

  useEffect(() => {
    try {
      localStorage.setItem(PRESENTATION_MODE_STORAGE_KEY, String(presentationMode))
    } catch {
      // Best-effort only — presentation mode still works for this session
      // even if storage is unavailable (private browsing, etc).
    }
  }, [presentationMode])

  const value = useMemo(
    () => ({ demoMode: isDemoMode, presentationMode, setPresentationMode: setPresentationModeState }),
    [presentationMode],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemoMode() {
  return useContext(DemoContext)
}

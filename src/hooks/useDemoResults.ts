import { useCallback, useState } from 'react'
import type { DemoResultEntry, DemoResultTone } from '../components/lab/DemoResultPanel'

const MAX_ENTRIES = 8

export function useDemoResults() {
  const [entries, setEntries] = useState<DemoResultEntry[]>([])

  const pushResult = useCallback((message: string, tone: DemoResultTone = 'info') => {
    setEntries((prev) =>
      [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, message, tone, timestamp: Date.now() }, ...prev].slice(
        0,
        MAX_ENTRIES,
      ),
    )
  }, [])

  return { entries, pushResult }
}

import { CheckCircle2, CircleAlert, Clock, Info } from 'lucide-react'
import { cn } from '../../lib/cn'

export type DemoResultTone = 'info' | 'success' | 'error' | 'pending'

export interface DemoResultEntry {
  id: string
  message: string
  tone: DemoResultTone
  timestamp: number
}

const TONE_ICON: Record<DemoResultTone, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  error: CircleAlert,
  pending: Clock,
}

const TONE_CLASS: Record<DemoResultTone, string> = {
  info: 'text-slate-500',
  success: 'text-emerald-600',
  error: 'text-red-600',
  pending: 'text-amber-600',
}

/**
 * A small "what just happened on this page" feed. Distinct from the global
 * analytics event stream (see /analytics) — this shows only this page's own
 * demo results, e.g. "Note created", "Upload complete", "Reaction added".
 */
export function DemoResultPanel({ entries, emptyLabel }: { entries: DemoResultEntry[]; emptyLabel: string }) {
  if (entries.length === 0) {
    return <p className="text-sm text-slate-400">{emptyLabel}</p>
  }

  return (
    <ul className="space-y-1.5">
      {entries.map((entry) => {
        const Icon = TONE_ICON[entry.tone]
        return (
          <li key={entry.id} className="flex items-start gap-2 text-sm">
            <Icon size={15} className={cn('mt-0.5 flex-shrink-0', TONE_CLASS[entry.tone])} aria-hidden="true" />
            <span className="text-navy-900">{entry.message}</span>
            <span className="ml-auto flex-shrink-0 text-xs text-slate-400">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

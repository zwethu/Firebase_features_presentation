import { cn } from '../../lib/cn'

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2">
      <span
        className={cn(
          'h-4 w-4 animate-spin rounded-full border-2 border-firebase-blue-500 border-t-transparent',
          className,
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export function FullPageSpinner({ label = 'Loading StudyFlow AI' }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  )
}

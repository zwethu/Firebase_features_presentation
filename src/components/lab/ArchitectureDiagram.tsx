import { ArrowDown } from 'lucide-react'
import { Fragment } from 'react'
import { cn } from '../../lib/cn'

/**
 * A small, dependency-free step-flow diagram (box → arrow → box) used on
 * every interactive feature page to visualize its architecture. No SVG/
 * diagram library needed — just flex layout, so it stays legible at
 * projector scale and works identically in Presentation Mode.
 */
export function ArchitectureDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      {steps.map((step, index) => (
        <Fragment key={step}>
          <div
            className={cn(
              'w-full max-w-md rounded-lg border px-4 py-2.5 text-center text-sm font-medium',
              index === 0 || index === steps.length - 1
                ? 'border-firebase-blue-300 bg-firebase-blue-500/10 text-firebase-blue-800'
                : 'border-slate-200 bg-slate-50 text-navy-900',
            )}
          >
            {step}
          </div>
          {index < steps.length - 1 && (
            <ArrowDown size={16} className="text-slate-400" aria-hidden="true" />
          )}
        </Fragment>
      ))}
    </div>
  )
}

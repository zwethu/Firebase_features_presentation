import type { ReactNode } from 'react'
import { useDemoMode } from '../../app/DemoContext'
import { cn } from '../../lib/cn'
import type { FeatureDefinition } from '../../lib/features'
import type { FeatureStatus } from '../../lib/featureStatus'
import { FeatureStatusBadge } from './FeatureStatusBadge'

interface FeaturePageProps {
  feature: FeatureDefinition
  status: FeatureStatus
  /** A short, honest caveat shown next to the badge — e.g. why a "live" feature still has a fallback. */
  statusNote?: ReactNode
  whatItIs: ReactNode
  demo: ReactNode
  howItWorks: ReactNode
  useCases: ReactNode
}

export function FeaturePage({ feature, status, statusNote, whatItIs, demo, howItWorks, useCases }: FeaturePageProps) {
  const { presentationMode } = useDemoMode()
  const Icon = feature.icon

  return (
    <div className={cn('mx-auto max-w-4xl space-y-6', presentationMode && 'max-w-5xl space-y-8')}>
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-firebase-blue-600 text-white">
            <Icon size={20} aria-hidden="true" />
          </span>
          <h1 className={cn('text-2xl font-semibold text-navy-950', presentationMode && 'text-3xl')}>
            {feature.title}
          </h1>
          <FeatureStatusBadge status={status} />
        </div>
        <p className={cn('text-sm text-slate-600', presentationMode && 'text-base')}>{feature.tagline}</p>
        {statusNote && (
          <p className={cn('text-xs text-slate-500', presentationMode && 'text-sm')}>{statusNote}</p>
        )}
      </header>

      <Section title="What it is" presentationMode={presentationMode}>
        {whatItIs}
      </Section>

      <Section title="Interactive demo" presentationMode={presentationMode} emphasized>
        {demo}
      </Section>

      <Section title="How it works" presentationMode={presentationMode}>
        {howItWorks}
      </Section>

      <Section title="Practical use cases" presentationMode={presentationMode}>
        {useCases}
      </Section>
    </div>
  )
}

function Section({
  title,
  children,
  presentationMode,
  emphasized,
}: {
  title: string
  children: ReactNode
  presentationMode: boolean
  emphasized?: boolean
}) {
  return (
    <section
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-5',
        presentationMode ? 'p-7' : 'p-5',
        emphasized && 'border-firebase-blue-200 bg-firebase-blue-500/5',
      )}
    >
      <h2 className={cn('mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500', presentationMode && 'text-base')}>
        {title}
      </h2>
      <div className={cn('text-sm text-navy-900', presentationMode && 'text-base leading-relaxed')}>{children}</div>
    </section>
  )
}

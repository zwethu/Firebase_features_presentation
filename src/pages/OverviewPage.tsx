import { Link } from 'react-router-dom'
import { useDemoMode } from '../app/DemoContext'
import { DemoBadge } from '../components/DemoBadge'
import { FeatureStatusBadge } from '../components/lab/FeatureStatusBadge'
import { Card } from '../components/ui/Card'
import { cn } from '../lib/cn'
import { FEATURES } from '../lib/features'
import { computeFeatureStatus } from '../lib/featureStatus'
import { firebaseConfig, isFirebaseConfigured } from '../services/firebase'

export function OverviewPage() {
  const { presentationMode } = useDemoMode()

  return (
    <div className={cn('mx-auto max-w-5xl space-y-8', presentationMode && 'max-w-6xl space-y-10')}>
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <DemoBadge />
          {!isFirebaseConfigured && (
            <span className="text-xs font-medium text-amber-700">
              Firebase is not configured — every page below runs in its honest fallback state.
            </span>
          )}
        </div>
        <h1 className={cn('text-3xl font-semibold tracking-tight text-navy-950', presentationMode && 'text-4xl')}>
          Firebase Feature Lab
        </h1>
        <p className={cn('max-w-2xl text-base text-slate-600', presentationMode && 'text-lg')}>
          Interactive Firebase demos for web applications. Open any feature below, explain it, run
          its one small interactive demo, and move to the next — no fixed order required.
        </p>
      </header>

      {isFirebaseConfigured && (
        <Card className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-navy-950">Connected Firebase project</p>
            <p className="text-sm text-slate-600">{firebaseConfig.projectId}</p>
          </div>
          <Link to="/hosting" className="text-sm font-medium text-firebase-blue-700 hover:underline">
            View deployment status →
          </Link>
        </Card>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Feature pages
        </h2>
        <div
          className={cn(
            'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
            presentationMode && 'gap-6 lg:grid-cols-2',
          )}
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            const status = computeFeatureStatus(feature.id)
            return (
              <Link key={feature.id} to={feature.route}>
                <Card className="flex h-full flex-col gap-3 transition-colors hover:border-firebase-blue-400">
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-firebase-blue-600 text-white">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <FeatureStatusBadge status={status} />
                  </div>
                  <div>
                    <h3 className={cn('text-sm font-semibold text-navy-950', presentationMode && 'text-base')}>
                      {feature.title}
                    </h3>
                    <p className={cn('mt-1 text-sm text-slate-600', presentationMode && 'text-base')}>
                      {feature.tagline}
                    </p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <footer className="border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
        Built for the "Firebase: Core Features and 2026 Platform Update" presentation.
      </footer>
    </div>
  )
}

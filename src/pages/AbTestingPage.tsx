import { useState } from 'react'
import { Eye } from 'lucide-react'
import { ArchitectureDiagram } from '../components/lab/ArchitectureDiagram'
import { DemoResultPanel } from '../components/lab/DemoResultPanel'
import { FeaturePage } from '../components/lab/FeaturePage'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useDemoMode } from '../app/DemoContext'
import { useDemoResults } from '../hooks/useDemoResults'
import { useRemoteConfig } from '../hooks/useRemoteConfig'
import { logDemoEvent } from '../lib/eventLog'
import { getFeature } from '../lib/features'
import { computeFeatureStatus } from '../lib/featureStatus'
import { QUIZ_CTA_LABEL, type QuizCtaVariant } from '../lib/quizCta'
import { logAnalyticsEvent } from '../services/analyticsService'

const feature = getFeature('ab-testing')

const SAMPLE_METRICS: Record<QuizCtaVariant, { rate: number }> = {
  A: { rate: 55 },
  B: { rate: 68 },
}

export function AbTestingPage() {
  const { values } = useRemoteConfig()
  const { demoMode } = useDemoMode()
  const { entries, pushResult } = useDemoResults()
  const [previewVariant, setPreviewVariant] = useState<QuizCtaVariant | null>(null)

  const status = computeFeatureStatus('ab-testing')
  const liveVariant = values.quiz_cta_variant
  const displayedVariant = previewVariant ?? liveVariant

  function handlePreview(variant: QuizCtaVariant) {
    setPreviewVariant(variant)
    logAnalyticsEvent('demo_ab_variant_previewed')
    logDemoEvent('ab-testing', `Previewed Variant ${variant} locally`)
    pushResult(`Previewing Variant ${variant} — local only, does not change Remote Config.`, 'info')
  }

  return (
    <FeaturePage
      feature={feature}
      status={status}
      statusNote="No verified Firebase A/B Testing experiment is connected from this project. The comparison below always uses sample demonstration data, and the variant switcher only changes what this page previews locally — it never writes to Remote Config."
      whatItIs={
        <p>
          A/B Testing answers: <strong>which version helps users succeed more often?</strong> It isn't
          a standalone product you call from code — it's built entirely on top of two things this lab
          already demonstrates: Remote Config delivers each variant, and Analytics measures what
          happens next. Firebase A/B Testing (in Console) is the layer that runs the experiment and
          compares the results.
        </p>
      }
      demo={
        <div className="space-y-5">
          <ArchitectureDiagram
            steps={[
              'Remote Config delivers Variant A or B to each user',
              'The app shows the matching quiz CTA',
              'Analytics logs quiz_started / quiz_completed events',
              'Firebase A/B Testing (Console) compares completion rates between variants',
            ]}
          />

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Live-driven CTA right now
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-3">
              <Badge tone="info">Remote Config says: Variant {liveVariant}</Badge>
              <span className="text-sm text-slate-600">→ "{QUIZ_CTA_LABEL[liveVariant]}"</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Sample completion-rate comparison
              </p>
              <Badge tone="warning">Sample demonstration data</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(['A', 'B'] as const).map((variant) => (
                <div
                  key={variant}
                  className={`rounded-lg border p-4 text-center ${
                    displayedVariant === variant
                      ? 'border-firebase-blue-400 bg-firebase-blue-500/5'
                      : 'border-slate-200'
                  }`}
                >
                  <p className="text-3xl font-bold text-firebase-blue-700">{SAMPLE_METRICS[variant].rate}%</p>
                  <p className="mt-1 text-xs text-slate-500">quiz-start rate (sample)</p>
                  <p className="mt-2 text-sm font-medium text-navy-950">
                    Variant {variant} — "{QUIZ_CTA_LABEL[variant]}"
                  </p>
                  {demoMode && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                      onClick={() => handlePreview(variant)}
                    >
                      <Eye size={13} aria-hidden="true" /> Preview this variant
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              These metrics are sample demonstration data unless a real Firebase A/B Testing
              experiment is configured and has collected sufficient user data.
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Event / result panel
            </p>
            <DemoResultPanel entries={entries} emptyLabel="Preview a variant to see results here." />
          </div>
        </div>
      }
      howItWorks={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Firebase A/B Testing has no client SDK of its own — experiments are configured entirely in
            the Firebase Console, layered on top of Remote Config (which delivers the variant) and
            Analytics (which measures the outcome).
          </li>
          <li>
            Real experiment results are only visible in Console once enough users have been measured —
            this page cannot fetch or verify a live experiment's results from the client.
          </li>
          <li>
            The "Preview this variant" buttons only exist because <code>VITE_DEMO_MODE=true</code> —
            they change what this page shows locally, never the real Remote Config value seen by
            other users.
          </li>
        </ul>
      }
      useCases={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Comparing button copy, onboarding flows, or pricing presentation with real user data.</li>
          <li>Measuring feature adoption before rolling a change out to everyone.</li>
          <li>UI/UX research — deciding with evidence instead of only opinion.</li>
        </ul>
      }
    />
  )
}

import { useState } from 'react'
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

const SAMPLE_METRICS: Record<QuizCtaVariant, number> = {
  A: 55,
  B: 68,
}

type AnalyticsEventState = 'sent' | 'unavailable' | 'local-only'

export function AbTestingPage() {
  const { values } = useRemoteConfig()
  const { presentationMode } = useDemoMode()
  const { entries, pushResult } = useDemoResults()
  const [previewVariant, setPreviewVariant] = useState<QuizCtaVariant>('A')
  const [localClicks, setLocalClicks] = useState(0)
  const [analyticsState, setAnalyticsState] = useState<AnalyticsEventState>('unavailable')

  const status = computeFeatureStatus('ab-testing')
  const liveVariant = values.quiz_cta_variant

  function handlePreview(variant: QuizCtaVariant) {
    setPreviewVariant(variant)
    logDemoEvent('ab-testing', `Previewed Variant ${variant} locally`)
    pushResult(`Previewing Variant ${variant} — local only, does not change Remote Config.`, 'info')
  }

  async function handleCtaClick() {
    const nextClicks = localClicks + 1
    setLocalClicks(nextClicks)
    const sent = await logAnalyticsEvent('quiz_cta_clicked', { variant: previewVariant })
    setAnalyticsState(sent ? 'sent' : 'local-only')
    logDemoEvent('ab-testing', `quiz_cta_clicked variant=${previewVariant}`)
    pushResult(
      sent
        ? `quiz_cta_clicked sent with variant ${previewVariant}. Local clicks: ${nextClicks}.`
        : `Analytics unavailable — local click counted (${nextClicks}). Variant ${previewVariant}.`,
      sent ? 'success' : 'info',
    )
  }

  return (
    <FeaturePage
      feature={feature}
      status={status}
      statusNote="No verified Firebase A/B Testing experiment is connected from this project. Preview and sample rates are Demo Data / Simulation — not real experiment results."
      whatItIs={
        <div className="space-y-3">
          <p>
            Remote Config changes a value. A/B Testing uses Remote Config to give different values to
            different user groups. Analytics measures which version achieves a better outcome.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-1.5 pr-3 font-semibold">Scenario</th>
                  <th className="py-1.5 font-semibold">Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-3 font-medium">Remote Config manual change</td>
                  <td>One Remote Config value is changed for all users</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-medium">A/B Testing experiment</td>
                  <td>Different user groups receive different variants, and Analytics measures outcomes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      }
      demo={
        <div className="space-y-5">
          <ArchitectureDiagram
            steps={[
              'Remote Config',
              'Control A and Variant B',
              'Different user groups',
              'Analytics event: quiz_cta_clicked',
              'Firebase A/B Testing analysis',
            ]}
          />

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Demo Data / Simulation — Preview a Variant
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(['A', 'B'] as const).map((variant) => (
                <button
                  key={variant}
                  type="button"
                  onClick={() => handlePreview(variant)}
                  className={`rounded-lg border p-4 text-left ${
                    previewVariant === variant
                      ? 'border-firebase-blue-400 bg-firebase-blue-500/5'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <Badge tone={variant === 'A' ? 'info' : 'success'}>
                    {variant === 'A' ? 'Control A' : 'Experiment B'}
                  </Badge>
                  <p className={`mt-3 font-semibold text-navy-950 ${presentationMode ? 'text-xl' : 'text-lg'}`}>
                    {QUIZ_CTA_LABEL[variant]}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {variant === 'A' ? 'Control' : 'Experiment'} · parameter quiz_cta_variant = {variant}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border-2 border-firebase-blue-300 bg-white p-6 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Active preview CTA — Variant {previewVariant}
            </p>
            <Button size="lg" className={presentationMode ? 'px-8 py-4 text-xl' : ''} onClick={handleCtaClick}>
              {QUIZ_CTA_LABEL[previewVariant]}
            </Button>
            <p className="mt-2 text-xs text-slate-400">
              Remote Config currently reports Variant {liveVariant} for this client — the preview
              selector above does not change that.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Event / result panel
            </p>
            <dl className="grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-slate-500">Current preview variant</dt>
                <dd className="font-medium text-navy-950">{previewVariant}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Local clicks in this browser session</dt>
                <dd className="font-medium text-navy-950">{localClicks}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Analytics event state</dt>
                <dd className="font-medium text-navy-950">{analyticsState}</dd>
              </div>
            </dl>
            <div className="mt-3">
              <DemoResultPanel entries={entries} emptyLabel="Click the active CTA to record a safe event." />
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-amber-800">
              Sample demonstration data — not real experiment results.
            </p>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-1.5 font-semibold">Variant</th>
                  <th className="py-1.5 text-right font-semibold">Example quiz-start rate</th>
                </tr>
              </thead>
              <tbody>
                {(['A', 'B'] as const).map((variant) => (
                  <tr key={variant} className="border-b border-slate-100">
                    <td className="py-2">{variant}</td>
                    <td className="py-2 text-right font-semibold">{SAMPLE_METRICS[variant]}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="mb-2 font-semibold text-navy-950">How to create the real Firebase A/B Test</p>
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              <li>Firebase Console → A/B Testing</li>
              <li>Create a Remote Config experiment</li>
              <li>Select parameter: quiz_cta_variant</li>
              <li>Set control = A</li>
              <li>Set variant = B</li>
              <li>Choose objective: quiz_cta_clicked</li>
              <li>Start experiment</li>
              <li>Wait for enough users and events before making conclusions</li>
            </ol>
          </div>
        </div>
      }
      howItWorks={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Firebase A/B Testing has no client SDK — experiments live in Console, on top of Remote
            Config (delivery) and Analytics (measurement). Primary metric: <code>quiz_cta_clicked</code>.
            Optional secondary: <code>quiz_completed</code>.
          </li>
          <li>
            CTA clicks log only <code>variant: "A" | "B"</code>. No email, UID, raw user text, tokens,
            or personal data.
          </li>
          <li>This website does not create or start a Firebase A/B Testing experiment.</li>
        </ul>
      }
      useCases={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Comparing button copy before rolling a change out to everyone.</li>
          <li>Measuring onboarding or quiz-start rates with real user groups.</li>
          <li>Deciding with evidence instead of only opinion.</li>
        </ul>
      }
    />
  )
}

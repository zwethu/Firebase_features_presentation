import { useState } from 'react'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle } from '../components/ui/Card'
import { QUIZ_QUESTIONS } from '../features/quiz/questions'
import { useRemoteConfig } from '../hooks/useRemoteConfig'
import { logAnalyticsEvent } from '../services/analyticsService'

export function QuizPage() {
  const { values: remoteConfigValues } = useRemoteConfig()
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [completed, setCompleted] = useState(false)

  const ctaLabel = remoteConfigValues.quiz_cta_variant === 'B' ? 'Start Your 5-Minute Quiz →' : 'Start Quiz'

  function handleStart() {
    setStarted(true)
    setCurrent(0)
    setAnswers([])
    setCompleted(false)
    logAnalyticsEvent('quiz_started', { variant: remoteConfigValues.quiz_cta_variant })
  }

  function handleAnswer(optionIndex: number) {
    const nextAnswers = [...answers, optionIndex]
    setAnswers(nextAnswers)
    if (current + 1 < QUIZ_QUESTIONS.length) {
      setCurrent(current + 1)
    } else {
      setCompleted(true)
      const score = nextAnswers.filter((answer, i) => answer === QUIZ_QUESTIONS[i].correctIndex).length
      logAnalyticsEvent('quiz_completed', { score, total: QUIZ_QUESTIONS.length })
    }
  }

  const score = answers.filter((answer, i) => answer === QUIZ_QUESTIONS[i]?.correctIndex).length

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold text-navy-950">Firebase Quiz</h1>

      <Card className="border-dashed border-amber-300 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-900">A/B Testing demo comparison</CardTitle>
          <Badge tone="warning">Sample / demo values</Badge>
        </CardHeader>
        <p className="text-sm text-amber-900">
          Variant A "Start Quiz" — 42% demo completion rate. Variant B "Start Your 5-Minute Quiz →" —
          58% demo completion rate. These are illustrative sample values, not connected to a real A/B
          Testing experiment unless configured in Firebase Console.
        </p>
      </Card>

      {!started ? (
        <Card className="text-center">
          <p className="text-sm text-slate-600">
            Five quick questions about Firebase. CTA label chosen by Remote Config (
            <span className="font-medium">variant {remoteConfigValues.quiz_cta_variant}</span>).
          </p>
          <Button className="mt-4" onClick={handleStart}>
            {ctaLabel}
          </Button>
        </Card>
      ) : completed ? (
        <Card className="text-center">
          <h2 className="text-lg font-semibold text-navy-950">Quiz complete</h2>
          <p className="mt-2 text-sm text-slate-600">
            You scored {score} out of {QUIZ_QUESTIONS.length}.
          </p>
          <Button className="mt-4" variant="secondary" onClick={handleStart}>
            Try again
          </Button>
        </Card>
      ) : (
        <Card>
          <p className="text-xs text-slate-400">
            Question {current + 1} of {QUIZ_QUESTIONS.length}
          </p>
          <h2 className="mt-1 text-base font-semibold text-navy-950">
            {QUIZ_QUESTIONS[current].question}
          </h2>
          <div className="mt-4 space-y-2">
            {QUIZ_QUESTIONS[current].options.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={() => handleAnswer(index)}
                className="block w-full rounded-lg border border-slate-200 px-4 py-2 text-left text-sm text-navy-900 hover:border-firebase-blue-400 hover:bg-firebase-blue-500/5"
              >
                {option}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

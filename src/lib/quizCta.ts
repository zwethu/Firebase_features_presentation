/** Shared between /remote-config and /ab-testing — both demo the same parameter. */
export type QuizCtaVariant = 'A' | 'B'

export const QUIZ_CTA_LABEL: Record<QuizCtaVariant, string> = {
  A: 'Start Quiz',
  B: 'Start Your 5-Minute Quiz →',
}

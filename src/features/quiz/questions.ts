export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which Firebase product is used to authenticate users?',
    options: ['Cloud Firestore', 'Firebase Authentication', 'Remote Config', 'Cloud Storage'],
    correctIndex: 1,
  },
  {
    id: 'q2',
    question: 'Which Firebase product stores structured application data?',
    options: ['Cloud Firestore', 'Firebase Hosting', 'App Check', 'Analytics'],
    correctIndex: 0,
  },
  {
    id: 'q3',
    question: 'What triggers a 2nd-gen Cloud Function most commonly in this app?',
    options: ['A scheduled cron job only', 'A Firestore document being created', 'A DNS change', 'A CSS update'],
    correctIndex: 1,
  },
  {
    id: 'q4',
    question: 'What does Firebase App Check help verify?',
    options: [
      'That the user typed a strong password',
      'That the request comes from your legitimate app environment',
      'That Analytics events are accurate',
      'That Firestore indexes exist',
    ],
    correctIndex: 1,
  },
  {
    id: 'q5',
    question: 'What can Remote Config change without a new app release?',
    options: ['Firestore security rules', 'Selected app settings and feature flags', 'The Firebase project ID', 'Storage bucket region'],
    correctIndex: 1,
  },
]

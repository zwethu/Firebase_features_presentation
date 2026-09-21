import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { Card } from '../components/ui/Card'

const rows: [string, string][] = [
  ['Firebase Authentication', 'Student, teacher, and admin sign-in'],
  ['Cloud Firestore', 'Courses, assignments, announcements, submissions, notifications, chat metadata'],
  ['Realtime Database', 'Optional online presence'],
  ['Cloud Storage', 'Assignment PDFs and profile files'],
  ['Cloud Functions', 'Submission and announcement automation'],
  ['Firebase AI Logic + Gemini', 'AI Study Assistant'],
  ['App Check', 'Helps protect backend and AI resources'],
  ['Google Analytics', 'Usage events'],
  ['Crashlytics / error reporting', 'Stability monitoring, if configured'],
  ['Remote Config', 'Quiz CTA variant and feature flags'],
  ['A/B Testing', 'UI/UX experiment explanation'],
  ['Firebase Cloud Messaging', 'Optional push notifications'],
  ['Firebase Hosting', 'Deployment'],
]

export function AboutFirebasePage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-firebase-blue-600 text-white">
            <GraduationCap size={18} aria-hidden="true" />
          </span>
          <Link to="/" className="text-sm font-medium text-firebase-blue-700 hover:underline">
            StudyFlow AI
          </Link>
        </div>

        <h1 className="text-2xl font-semibold text-navy-950">Firebase architecture</h1>
        <p className="text-sm text-slate-600">
          StudyFlow AI is intentionally small so every Firebase product used is easy to point to during
          a live presentation. This page maps each feature to the Firebase product that powers it.
        </p>

        <Card className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-4">Firebase product</th>
                <th className="py-2">Used for in StudyFlow AI</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([product, usage]) => (
                <tr key={product} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-4 font-medium text-navy-950">{product}</td>
                  <td className="py-2 text-slate-600">{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <p className="text-xs text-slate-400">
          Not every announced 2026 Firebase feature is generally available — this app labels each
          integration as configured, optional, preview, or not configured rather than assuming GA status.
        </p>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useAuth } from '../app/AuthContext'
import { FirebaseStatusBanner } from '../components/FirebaseStatusBanner'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { listCoursesForProfile, listSubmissionsForCourses } from '../services/firestoreService'
import type { Submission } from '../types/models'

export function TeacherSubmissionsPage() {
  const { profile, firebaseConfigured } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile || !firebaseConfigured) {
      setLoading(false)
      return
    }
    let mounted = true
    listCoursesForProfile(profile)
      .then((courses) => listSubmissionsForCourses(courses.map((c) => c.id)))
      .then((result) => mounted && setSubmissions(result))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [profile, firebaseConfigured])

  return (
    <div className="space-y-4">
      <FirebaseStatusBanner />
      <h1 className="text-xl font-semibold text-navy-950">Submissions</h1>

      {loading ? (
        <Spinner label="Loading submissions" />
      ) : submissions.length === 0 ? (
        <EmptyState title="No submissions yet" description="Submissions for your courses will appear here." />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-4">Student</th>
                <th className="py-2 pr-4">File</th>
                <th className="py-2 pr-4">Submitted</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-4">{submission.studentName}</td>
                  <td className="py-2 pr-4">{submission.fileName}</td>
                  <td className="py-2 pr-4 text-slate-500">
                    {submission.submittedAt?.toDate().toLocaleString() ?? '—'}
                  </td>
                  <td className="py-2 pr-4">
                    <Badge tone="success">{submission.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}

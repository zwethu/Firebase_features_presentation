import { useEffect, useState } from 'react'
import { useAuth } from '../app/AuthContext'
import { FirebaseStatusBanner } from '../components/FirebaseStatusBanner'
import { Badge } from '../components/ui/Badge'
import { Card, CardHeader, CardTitle } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { useNotifications } from '../hooks/useNotifications'
import {
  listAnnouncementsForCourses,
  listCoursesForProfile,
  listSubmissionsForCourses,
} from '../services/firestoreService'
import type { Announcement, Submission } from '../types/models'

export function TeacherDashboardPage() {
  const { profile, firebaseUser, firebaseConfigured } = useAuth()
  const { notifications } = useNotifications(firebaseUser?.uid)

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile || !firebaseConfigured) {
      setLoading(false)
      return
    }
    let mounted = true
    listCoursesForProfile(profile)
      .then(async (courses) => {
        const courseIds = courses.map((c) => c.id)
        const [submissionResult, announcementResult] = await Promise.all([
          listSubmissionsForCourses(courseIds),
          listAnnouncementsForCourses(courseIds),
        ])
        if (!mounted) return
        setSubmissions(submissionResult)
        setAnnouncements(announcementResult)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [profile, firebaseConfigured])

  if (loading) return <Spinner label="Loading teacher dashboard" />

  return (
    <div className="space-y-4">
      <FirebaseStatusBanner />
      <h1 className="text-xl font-semibold text-navy-950">Teacher Dashboard</h1>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
          </CardHeader>
          <p className="text-2xl font-semibold text-navy-950">{submissions.length}</p>
          <p className="text-xs text-slate-500">Across your courses</p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <p className="text-2xl font-semibold text-navy-950">{announcements.length}</p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <p className="text-2xl font-semibold text-navy-950">{notifications.filter((n) => !n.read).length}</p>
          <p className="text-xs text-slate-500">Unread</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent submissions</CardTitle>
        </CardHeader>
        {submissions.length === 0 ? (
          <EmptyState title="No submissions yet" />
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {submissions.slice(0, 5).map((submission) => (
              <li key={submission.id} className="flex items-center justify-between py-2">
                <span>{submission.studentName} — {submission.fileName}</span>
                <Badge tone="success">{submission.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent announcements</CardTitle>
        </CardHeader>
        {announcements.length === 0 ? (
          <EmptyState title="No announcements yet" />
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {announcements.slice(0, 5).map((announcement) => (
              <li key={announcement.id} className="py-2">
                <p className="font-medium text-navy-950">{announcement.title}</p>
                <p className="text-slate-500">{announcement.message}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

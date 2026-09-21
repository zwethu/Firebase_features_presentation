import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { FirebaseStatusBanner } from '../components/FirebaseStatusBanner'
import { Card, CardHeader, CardTitle } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import {
  getCourse,
  listAnnouncementsForCourse,
  listAssignmentsForCourse,
} from '../services/firestoreService'
import type { Announcement, Assignment, Course } from '../types/models'

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { firebaseConfigured } = useAuth()

  const [course, setCourse] = useState<Course | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!courseId || !firebaseConfigured) {
      setLoading(false)
      return
    }
    let mounted = true
    Promise.all([
      getCourse(courseId),
      listAssignmentsForCourse(courseId),
      listAnnouncementsForCourse(courseId),
    ])
      .then(([courseResult, assignmentResult, announcementResult]) => {
        if (!mounted) return
        setCourse(courseResult)
        setAssignments(assignmentResult)
        setAnnouncements(announcementResult)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [courseId, firebaseConfigured])

  if (loading) return <Spinner label="Loading course" />

  if (!course) {
    return (
      <EmptyState
        title="Course not found"
        description="This course may not exist or you may not have access to it."
      />
    )
  }

  return (
    <div className="space-y-4">
      <FirebaseStatusBanner />
      <div>
        <h1 className="text-xl font-semibold text-navy-950">{course.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{course.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        {assignments.length === 0 ? (
          <EmptyState title="No assignments yet" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {assignments.map((assignment) => (
              <li key={assignment.id} className="py-2">
                <Link to={`/assignments/${assignment.id}`} className="text-sm font-medium text-firebase-blue-700 hover:underline">
                  {assignment.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
        </CardHeader>
        {announcements.length === 0 ? (
          <EmptyState title="No announcements yet" />
        ) : (
          <ul className="space-y-3">
            {announcements.map((announcement) => (
              <li key={announcement.id} className="rounded-lg bg-slate-50 p-3">
                <p className="text-sm font-semibold text-navy-950">{announcement.title}</p>
                <p className="mt-1 text-sm text-slate-600">{announcement.message}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

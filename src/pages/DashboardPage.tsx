import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, ClipboardList, Users } from 'lucide-react'
import { useAuth } from '../app/AuthContext'
import { FirebaseStatusBanner } from '../components/FirebaseStatusBanner'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { useNotifications } from '../hooks/useNotifications'
import { useRemoteConfig } from '../hooks/useRemoteConfig'
import {
  listAssignmentsForCourses,
  listCoursesForProfile,
  listSubmissionsForStudent,
} from '../services/firestoreService'
import { presenceEnabled, startPresence, subscribeToOnlineCount } from '../features/presence/presenceService'
import type { Assignment, Course, Submission } from '../types/models'

export function DashboardPage() {
  const { profile, firebaseUser, firebaseConfigured } = useAuth()
  const { unreadCount, notifications } = useNotifications(firebaseUser?.uid)
  const { values: remoteConfigValues } = useRemoteConfig()

  const [courses, setCourses] = useState<Course[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    if (!profile || !firebaseConfigured) {
      setLoading(false)
      return
    }
    let mounted = true
    setLoading(true)
    Promise.all([listCoursesForProfile(profile), listSubmissionsForStudent(profile.uid)])
      .then(async ([courseList, submissionList]) => {
        if (!mounted) return
        setCourses(courseList)
        setSubmissions(submissionList)
        const assignmentList = await listAssignmentsForCourses(courseList.map((c) => c.id))
        if (!mounted) return
        setAssignments(assignmentList)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [profile, firebaseConfigured])

  useEffect(() => {
    if (!presenceEnabled || !firebaseUser || !profile) return
    const stopPresence = startPresence(firebaseUser.uid, profile.displayName)
    const unsubscribe = subscribeToOnlineCount(setOnlineCount)
    return () => {
      stopPresence()
      unsubscribe()
    }
  }, [firebaseUser, profile])

  return (
    <div className="space-y-6">
      <FirebaseStatusBanner />

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-navy-950">
            Welcome back, {profile?.displayName ?? 'Student'}
          </h1>
          <Badge tone="info" className="capitalize">
            {profile?.role ?? 'student'}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Here is what's happening across your courses today.
        </p>
      </div>

      {loading ? (
        <Spinner label="Loading dashboard" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your courses</CardTitle>
                <Link to="/courses" className="text-xs font-medium text-firebase-blue-700 hover:underline">
                  View all
                </Link>
              </CardHeader>
              {courses.length === 0 ? (
                <EmptyState
                  title="No courses yet"
                  description="Enrolled courses from Firestore will appear here."
                />
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {courses.map((course) => (
                    <li key={course.id}>
                      <Link
                        to={`/courses/${course.id}`}
                        className="block rounded-lg border border-slate-200 p-3 hover:border-firebase-blue-400 hover:bg-firebase-blue-500/5"
                      >
                        <p className="text-sm font-semibold text-navy-950">{course.title}</p>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2">{course.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming assignments</CardTitle>
              </CardHeader>
              {assignments.length === 0 ? (
                <EmptyState
                  title="No assignments yet"
                  description="Your teacher hasn't posted any assignments for these courses."
                />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {assignments.map((assignment) => {
                    const submission = submissions.find((s) => s.assignmentId === assignment.id)
                    return (
                      <li key={assignment.id} className="flex items-center justify-between gap-3 py-3">
                        <div>
                          <Link
                            to={`/assignments/${assignment.id}`}
                            className="text-sm font-medium text-navy-950 hover:underline"
                          >
                            {assignment.title}
                          </Link>
                          <p className="text-xs text-slate-500">
                            Due{' '}
                            {assignment.dueDate
                              ? assignment.dueDate.toDate().toLocaleDateString()
                              : 'date TBD'}
                          </p>
                        </div>
                        <Badge tone={submission ? 'success' : 'neutral'}>
                          {submission ? 'Submitted' : 'Not submitted'}
                        </Badge>
                      </li>
                    )
                  })}
                </ul>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <Badge tone={unreadCount > 0 ? 'info' : 'neutral'}>{unreadCount} unread</Badge>
              </CardHeader>
              {notifications.length === 0 ? (
                <EmptyState title="No notifications yet" />
              ) : (
                <ul className="space-y-2">
                  {notifications.slice(0, 3).map((n) => (
                    <li key={n.id} className="rounded-lg bg-slate-50 p-2 text-xs">
                      <p className="font-medium text-navy-950">{n.title}</p>
                      <p className="text-slate-500 line-clamp-2">{n.message}</p>
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/notifications" className="mt-3 block text-xs font-medium text-firebase-blue-700 hover:underline">
                View all notifications
              </Link>
            </Card>

            {presenceEnabled && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={14} aria-hidden="true" /> Students online
                  </CardTitle>
                </CardHeader>
                <p className="text-2xl font-semibold text-navy-950">{onlineCount}</p>
                <p className="text-xs text-slate-500">Live via Realtime Database presence</p>
              </Card>
            )}

            <Card className="bg-firebase-blue-600 text-white">
              <Bot size={20} aria-hidden="true" />
              <h3 className="mt-2 text-sm font-semibold">AI Study Assistant</h3>
              <p className="mt-1 text-xs text-white/80">
                Ask a question about your coursework or generate quiz practice.
              </p>
              <Link to="/ai-assistant">
                <Button variant="secondary" size="sm" className="mt-3">
                  Ask AI Assistant
                </Button>
              </Link>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList size={14} aria-hidden="true" /> Quiz
                </CardTitle>
              </CardHeader>
              <p className="text-xs text-slate-500">Remote Config variant: {remoteConfigValues.quiz_cta_variant}</p>
              <Link to="/quiz">
                <Button size="sm" className="mt-3">
                  {remoteConfigValues.quiz_cta_variant === 'B' ? 'Start Your 5-Minute Quiz →' : 'Start Quiz'}
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

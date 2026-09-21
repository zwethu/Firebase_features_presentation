import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { FirebaseStatusBanner } from '../components/FirebaseStatusBanner'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { listCoursesForProfile } from '../services/firestoreService'
import { logAnalyticsEvent } from '../services/analyticsService'
import type { Course } from '../types/models'

export function CoursesPage() {
  const { profile, firebaseConfigured } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile || !firebaseConfigured) {
      setLoading(false)
      return
    }
    let mounted = true
    listCoursesForProfile(profile)
      .then((result) => mounted && setCourses(result))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [profile, firebaseConfigured])

  return (
    <div className="space-y-4">
      <FirebaseStatusBanner />
      <h1 className="text-xl font-semibold text-navy-950">Courses</h1>

      {loading ? (
        <Spinner label="Loading courses" />
      ) : courses.length === 0 ? (
        <EmptyState
          title="No courses yet"
          description="Courses assigned to your account will appear here once seeded or created."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              onClick={() => logAnalyticsEvent('course_opened', { courseId: course.id })}
            >
              <Card className="h-full transition-colors hover:border-firebase-blue-400">
                <h2 className="text-sm font-semibold text-navy-950">{course.title}</h2>
                <p className="mt-1 text-sm text-slate-600 line-clamp-3">{course.description}</p>
                <p className="mt-3 text-xs text-slate-400">{course.studentIds.length} enrolled students</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

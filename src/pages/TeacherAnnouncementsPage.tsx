import { type FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../app/AuthContext'
import { FirebaseStatusBanner } from '../components/FirebaseStatusBanner'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle } from '../components/ui/Card'
import { FieldError, Input, Label, Textarea } from '../components/ui/Field'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import {
  createAnnouncement,
  listAnnouncementsForCourses,
  listCoursesForProfile,
} from '../services/firestoreService'
import type { Announcement, Course } from '../types/models'

export function TeacherAnnouncementsPage() {
  const { profile, firebaseConfigured } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  const [courseId, setCourseId] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!profile || !firebaseConfigured) {
      setLoading(false)
      return
    }
    let mounted = true
    listCoursesForProfile(profile)
      .then(async (courseList) => {
        if (!mounted) return
        setCourses(courseList)
        setCourseId(courseList[0]?.id ?? '')
        const announcementList = await listAnnouncementsForCourses(courseList.map((c) => c.id))
        if (!mounted) return
        setAnnouncements(announcementList)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [profile, firebaseConfigured])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!profile || !courseId) return
    setError(null)
    setSuccessMessage(null)
    setIsSubmitting(true)
    try {
      await createAnnouncement({ courseId, title, message, createdBy: profile.uid })
      setTitle('')
      setMessage('')
      setSuccessMessage('Announcement created. Enrolled students will receive a notification.')
      const refreshed = await listAnnouncementsForCourses(courses.map((c) => c.id))
      setAnnouncements(refreshed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create announcement.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <Spinner label="Loading announcements" />

  return (
    <div className="space-y-4">
      <FirebaseStatusBanner />
      <h1 className="text-xl font-semibold text-navy-950">Announcements</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create announcement</CardTitle>
        </CardHeader>
        {courses.length === 0 ? (
          <EmptyState title="No courses assigned" description="You need at least one course to post an announcement." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="course">Course</Label>
              <select
                id="course"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" required rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <FieldError>{error}</FieldError>
            {successMessage && <p className="text-sm text-emerald-700">{successMessage}</p>}
            <Button type="submit" isLoading={isSubmitting}>
              Post announcement
            </Button>
          </form>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent announcements</CardTitle>
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

import { type ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { FirebaseStatusBanner } from '../components/FirebaseStatusBanner'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { useRemoteConfig } from '../hooks/useRemoteConfig'
import { logAnalyticsEvent } from '../services/analyticsService'
import {
  createSubmission,
  getAssignment,
  listSubmissionsForAssignment,
} from '../services/firestoreService'
import {
  buildAssignmentStoragePath,
  uploadAssignmentFile,
  validateAssignmentFile,
} from '../services/storageService'
import type { Assignment, Submission } from '../types/models'

export function AssignmentDetailPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>()
  const { profile, firebaseConfigured } = useAuth()
  const { values: remoteConfigValues } = useRemoteConfig()

  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!assignmentId || !firebaseConfigured) {
      setLoading(false)
      return
    }
    let mounted = true
    Promise.all([getAssignment(assignmentId), listSubmissionsForAssignment(assignmentId)])
      .then(([assignmentResult, submissionResult]) => {
        if (!mounted) return
        setAssignment(assignmentResult)
        setSubmissions(submissionResult)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [assignmentId, firebaseConfigured])

  const mySubmission = submissions.find((s) => s.studentId === profile?.uid)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setUploadError(null)
    if (!file) {
      setSelectedFile(null)
      setValidationError(null)
      return
    }
    const validation = validateAssignmentFile(file, remoteConfigValues.max_upload_size_mb)
    setValidationError(validation?.message ?? null)
    setSelectedFile(validation ? null : file)
  }

  async function handleUpload() {
    if (!selectedFile || !assignment || !profile) return
    setIsUploading(true)
    setProgress(0)
    setUploadError(null)
    logAnalyticsEvent('assignment_upload_started', { assignmentId: assignment.id })

    const storagePath = buildAssignmentStoragePath(profile.uid, assignment.id, selectedFile.name)

    uploadAssignmentFile(storagePath, selectedFile, {
      onProgress: setProgress,
      onError: (error) => {
        setUploadError(error instanceof Error ? error.message : 'Upload failed. Please try again.')
        setIsUploading(false)
      },
      onComplete: async () => {
        try {
          await createSubmission({
            assignmentId: assignment.id,
            courseId: assignment.courseId,
            studentId: profile.uid,
            studentName: profile.displayName,
            storagePath,
            fileName: selectedFile.name,
            contentType: selectedFile.type,
            sizeBytes: selectedFile.size,
          })
          await logAnalyticsEvent('assignment_uploaded', { assignmentId: assignment.id })
          const updated = await listSubmissionsForAssignment(assignment.id)
          setSubmissions(updated)
          setSelectedFile(null)
        } catch (error) {
          setUploadError(error instanceof Error ? error.message : 'Could not save submission record.')
        } finally {
          setIsUploading(false)
        }
      },
    })
  }

  if (loading) return <Spinner label="Loading assignment" />

  if (!assignment) {
    return <EmptyState title="Assignment not found" description="It may have been removed or you may not have access." />
  }

  return (
    <div className="space-y-4">
      <FirebaseStatusBanner />
      <div>
        <h1 className="text-xl font-semibold text-navy-950">{assignment.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{assignment.description}</p>
        <p className="mt-1 text-xs text-slate-400">
          Due {assignment.dueDate ? assignment.dueDate.toDate().toLocaleDateString() : 'date TBD'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit your work</CardTitle>
          {mySubmission && <Badge tone="success">Submitted</Badge>}
        </CardHeader>

        {mySubmission ? (
          <p className="text-sm text-slate-600">
            You submitted <span className="font-medium">{mySubmission.fileName}</span> on{' '}
            {mySubmission.submittedAt?.toDate().toLocaleString() ?? 'just now'}.
          </p>
        ) : (
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-navy-900">Assignment PDF</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={isUploading || !firebaseConfigured}
                className="block w-full text-sm text-slate-600"
              />
            </label>
            {validationError && <p role="alert" className="text-sm text-red-600">{validationError}</p>}
            <p className="text-xs text-slate-400">
              PDF only, up to {remoteConfigValues.max_upload_size_mb} MB.
            </p>

            {progress !== null && (
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="h-full bg-firebase-blue-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {uploadError && <p role="alert" className="text-sm text-red-600">{uploadError}</p>}

            <Button onClick={handleUpload} disabled={!selectedFile || isUploading} isLoading={isUploading}>
              Upload submission
            </Button>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submission history</CardTitle>
        </CardHeader>
        {submissions.length === 0 ? (
          <EmptyState title="No submissions yet" />
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {submissions.map((submission) => (
              <li key={submission.id} className="flex items-center justify-between py-2">
                <span>{submission.studentName}</span>
                <Badge tone="success">{submission.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

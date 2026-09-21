import { type ChangeEvent, useEffect, useState } from 'react'
import { ExternalLink, FileText, Image as ImageIcon, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArchitectureDiagram } from '../components/lab/ArchitectureDiagram'
import { DemoResultPanel } from '../components/lab/DemoResultPanel'
import { FeaturePage } from '../components/lab/FeaturePage'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { useCurrentActor } from '../hooks/useCurrentActor'
import { useDemoResults } from '../hooks/useDemoResults'
import { getLocalUploads, simulateLocalUpload } from '../features/storage-upload/localUploadService'
import type { UploadMetadata } from '../features/storage-upload/types'
import {
  buildUploadPath,
  saveUploadMetadata,
  sanitizeFileName,
  subscribeToUploadMetadata,
  uploadDemoFile,
  validateUploadFile,
} from '../features/storage-upload/uploadService'
import { logDemoEvent } from '../lib/eventLog'
import { getFeature } from '../lib/features'
import { computeFeatureStatus } from '../lib/featureStatus'
import { logAnalyticsEvent } from '../services/analyticsService'
import { isFirebaseConfigured } from '../services/firebase'

const feature = getFeature('storage')

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function fileIcon(contentType: string) {
  return contentType === 'application/pdf' ? FileText : ImageIcon
}

export function StoragePage() {
  const actor = useCurrentActor()
  const { entries, pushResult } = useDemoResults()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploads, setUploads] = useState<UploadMetadata[]>([])
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const usingLiveStorage = isFirebaseConfigured && actor.kind === 'firebase'
  // When Firebase IS configured, uploads must go through real Storage —
  // never silently fall back to the local simulation just because the
  // user hasn't signed in yet.
  const blockedPendingSignIn = isFirebaseConfigured && actor.kind !== 'firebase'
  const status = computeFeatureStatus('storage')

  useEffect(() => {
    if (blockedPendingSignIn) {
      setUploads([])
      return
    }
    if (!isFirebaseConfigured) {
      setUploads(getLocalUploads(actor.uid))
      return
    }
    return subscribeToUploadMetadata(
      actor.uid,
      setUploads,
      () => pushResult('Could not load your upload history.', 'error'),
    )
  }, [blockedPendingSignIn, actor.uid, pushResult])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setDownloadUrl(null)
    if (!file) {
      setSelectedFile(null)
      setValidationError(null)
      return
    }
    const error = validateUploadFile(file)
    setValidationError(error)
    setSelectedFile(error ? null : file)
  }

  function handleUpload() {
    if (!selectedFile || blockedPendingSignIn) return
    setIsUploading(true)
    setProgress(0)
    setDownloadUrl(null)
    const fileName = sanitizeFileName(selectedFile.name)
    const storagePath = buildUploadPath(actor.uid, fileName)

    if (usingLiveStorage) {
      uploadDemoFile(storagePath, selectedFile, {
        onProgress: setProgress,
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'Upload failed.'
          pushResult(message, 'error')
          setIsUploading(false)
        },
        onComplete: async ({ storagePath: finalPath, downloadUrl: url }) => {
          try {
            await saveUploadMetadata({
              ownerId: actor.uid,
              fileName: selectedFile.name,
              contentType: selectedFile.type,
              sizeBytes: selectedFile.size,
              storagePath: finalPath,
            })
            setDownloadUrl(url)
            logAnalyticsEvent('demo_storage_upload_completed')
            logDemoEvent('storage', `${actor.displayName} uploaded a file`)
            pushResult(`Uploaded to ${finalPath}`, 'success')
            setSelectedFile(null)
          } catch (err) {
            pushResult(err instanceof Error ? err.message : 'Could not save upload metadata.', 'error')
          } finally {
            setIsUploading(false)
          }
        },
      })
    } else {
      simulateLocalUpload(storagePath, selectedFile, actor.uid, {
        onProgress: setProgress,
        onComplete: (metadata) => {
          setUploads(getLocalUploads(actor.uid))
          logAnalyticsEvent('demo_storage_upload_completed')
          logDemoEvent('storage', `${actor.displayName} simulated an upload`)
          pushResult(`Simulated upload to ${metadata.storagePath} (no real file stored).`, 'success')
          setSelectedFile(null)
          setIsUploading(false)
        },
      })
    }
  }

  return (
    <FeaturePage
      feature={feature}
      status={status}
      statusNote={
        isFirebaseConfigured
          ? actor.kind === 'firebase'
            ? undefined
            : 'Cloud Storage is configured, but you need to sign in to upload — Storage Rules require a real signed-in user.'
          : 'Cloud Storage is not configured — this demo simulates progress and stores only metadata locally, clearly labelled as a simulation. No file is actually stored anywhere.'
      }
      whatItIs={
        <p>
          Cloud Storage holds large binary files — PDFs, images, video — outside your database. Cloud
          Firestore is for small, structured, queryable data; Cloud Storage is for the files
          themselves. Apps typically use both together: the file goes to Storage, and a small metadata
          record (name, size, who uploaded it) goes to Firestore.
        </p>
      }
      demo={
        <div className="space-y-5">
          <ArchitectureDiagram
            steps={
              isFirebaseConfigured
                ? [
                    'You choose a PDF/PNG/JPEG under 10 MB',
                    'uploadBytesResumable() streams it to feature-lab/{uid}/uploads/',
                    'Storage Rules verify your uid, content type, and size',
                    'On success, non-sensitive metadata is saved to Firestore',
                  ]
                : [
                    'You choose a PDF/PNG/JPEG under 10 MB',
                    'Progress is simulated locally (no network upload)',
                    'Only metadata (name, size, type) is saved to localStorage',
                    'The file itself is never actually stored anywhere',
                  ]
            }
          />

          {blockedPendingSignIn && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <Link to="/authentication" className="font-medium underline">
                Sign in on the Authentication page
              </Link>{' '}
              to upload a real file here.
            </div>
          )}

          <div className="space-y-3 rounded-lg border border-slate-200 p-4">
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-sm font-medium text-navy-900">
                <UploadCloud size={16} aria-hidden="true" /> Choose a file
              </span>
              <input
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                onChange={handleFileChange}
                disabled={isUploading || blockedPendingSignIn}
                className="block w-full text-sm text-slate-600"
              />
            </label>
            {validationError && (
              <p role="alert" className="text-sm text-red-600">
                {validationError}
              </p>
            )}
            <p className="text-xs text-slate-400">PDF, PNG, or JPEG — up to 10 MB.</p>

            {selectedFile && !validationError && (
              <p className="text-sm text-slate-600">
                Selected: <span className="font-medium text-navy-950">{selectedFile.name}</span> (
                {formatBytes(selectedFile.size)})
              </p>
            )}

            {progress !== null && (
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="h-full bg-firebase-blue-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}

            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sm font-medium text-firebase-blue-700 hover:underline"
              >
                View uploaded file <ExternalLink size={13} aria-hidden="true" />
              </a>
            )}

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || blockedPendingSignIn}
              isLoading={isUploading}
            >
              Upload
            </Button>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Your uploads</p>
              <Badge tone={isFirebaseConfigured ? 'success' : 'warning'}>
                {isFirebaseConfigured ? 'Live Storage + Firestore metadata' : 'Local simulation'}
              </Badge>
            </div>
            {uploads.length === 0 ? (
              <EmptyState title="No uploads yet" description="Upload a file above to see it listed here." />
            ) : (
              <ul className="space-y-2">
                {uploads.map((upload) => {
                  const Icon = fileIcon(upload.contentType)
                  return (
                    <li
                      key={upload.id}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm"
                    >
                      <Icon size={18} className="flex-shrink-0 text-firebase-blue-600" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-navy-950">{upload.fileName}</p>
                        <p className="truncate text-xs text-slate-400">{upload.storagePath}</p>
                      </div>
                      <span className="flex-shrink-0 text-xs text-slate-500">{formatBytes(upload.sizeBytes)}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Event / result panel
            </p>
            <DemoResultPanel entries={entries} emptyLabel="Upload a file to see results here." />
          </div>
        </div>
      }
      howItWorks={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Files are addressed by path — this demo uses <code>feature-lab/&#123;uid&#125;/uploads/&#123;fileName&#125;</code>,
            one folder per user.
          </li>
          <li>
            <code>uploadBytesResumable()</code> streams the file in chunks and reports progress, and can
            resume after a dropped connection.
          </li>
          <li>
            Storage Rules — not the frontend — are the real enforcement: they reject any upload whose
            path doesn't match the uploader's own uid, whose content type isn't PDF/PNG/JPEG, or whose
            size exceeds 10 MB. Frontend validation is only there for instant feedback.
          </li>
          <li>The file (Storage) and its searchable metadata (Firestore) are deliberately kept separate.</li>
        </ul>
      }
      useCases={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Profile pictures, PDF assignment or document submissions, generated reports.</li>
          <li>Any binary asset too large or unstructured to store efficiently in Firestore.</li>
          <li>Combining Storage (the file) with Firestore (searchable, filterable metadata about it).</li>
        </ul>
      }
    />
  )
}

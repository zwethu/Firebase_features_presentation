import { type FormEvent, useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArchitectureDiagram } from '../components/lab/ArchitectureDiagram'
import { DemoResultPanel } from '../components/lab/DemoResultPanel'
import { FeaturePage } from '../components/lab/FeaturePage'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { FieldError, Textarea } from '../components/ui/Field'
import { Spinner } from '../components/ui/Spinner'
import { useCurrentActor } from '../hooks/useCurrentActor'
import { useDemoResults } from '../hooks/useDemoResults'
import {
  createLocalNote,
  deleteLocalNote,
  subscribeToLocalNotes,
} from '../features/firestore-notes/localNotesService'
import { createNote, deleteNote, subscribeToNotes, validateNoteText } from '../features/firestore-notes/notesService'
import type { DemoNote } from '../features/firestore-notes/types'
import { logDemoEvent } from '../lib/eventLog'
import { getFeature } from '../lib/features'
import { computeFeatureStatus } from '../lib/featureStatus'
import { logAnalyticsEvent } from '../services/analyticsService'
import { isFirebaseConfigured } from '../services/firebase'

const feature = getFeature('firestore')

export function FirestorePage() {
  const actor = useCurrentActor()
  const { entries, pushResult } = useDemoResults()

  const [notes, setNotes] = useState<DemoNote[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const usingLiveFirestore = isFirebaseConfigured && actor.kind === 'firebase'
  // When Firebase IS configured, writes must go through real Firestore —
  // never silently fall back to the local simulation just because the
  // user hasn't signed in yet. That would misrepresent a "Live Firebase
  // Integration" page as actually writing to Firebase when it isn't.
  const blockedPendingSignIn = isFirebaseConfigured && actor.kind !== 'firebase'
  const status = computeFeatureStatus('firestore')

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false)
      setLoadError(null)
      return subscribeToLocalNotes(setNotes)
    }
    if (actor.kind !== 'firebase') {
      setNotes([])
      setLoading(false)
      return
    }
    setLoading(true)
    setLoadError(null)
    return subscribeToNotes(
      (next) => {
        setNotes(next)
        setLoading(false)
      },
      (err) => {
        setLoadError(err instanceof Error ? err.message : 'Could not load notes.')
        setLoading(false)
      },
    )
  }, [actor.kind])

  async function handleAddNote(event: FormEvent) {
    event.preventDefault()
    if (blockedPendingSignIn) return
    const validationError = validateNoteText(text)
    if (validationError) {
      setFormError(validationError)
      return
    }
    setFormError(null)
    setIsSubmitting(true)
    try {
      if (usingLiveFirestore) {
        await createNote(actor.uid, actor.displayName, text)
      } else {
        createLocalNote(actor.uid, actor.displayName, text)
      }
      logAnalyticsEvent('demo_firestore_note_created')
      logDemoEvent('firestore', `${actor.displayName} added a note`)
      pushResult('Note added.', 'success')
      setText('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not add note.'
      setFormError(message)
      pushResult(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(note: DemoNote) {
    if (blockedPendingSignIn) return
    try {
      if (usingLiveFirestore) {
        await deleteNote(note.id)
      } else {
        deleteLocalNote(note.id)
      }
      logDemoEvent('firestore', `${actor.displayName} deleted a note`)
      pushResult('Note deleted.', 'info')
    } catch (err) {
      pushResult(err instanceof Error ? err.message : 'Could not delete note.', 'error')
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
            : 'Cloud Firestore is configured, but you need to sign in to read and write notes — Security Rules require a real signed-in user.'
          : 'Cloud Firestore is not configured — this demo runs on localStorage + BroadcastChannel instead, clearly labelled as a simulation.'
      }
      whatItIs={
        <p>
          Cloud Firestore is a real-time, structured NoSQL database. Data lives in{' '}
          <strong>collections</strong> of <strong>documents</strong> — here, one <code>demoNotes</code>{' '}
          collection holds one document per note, each with fields like <code>text</code>,{' '}
          <code>authorId</code>, and a server-generated <code>createdAt</code> timestamp. Every client
          subscribed to a query gets pushed new data the instant it changes — no polling.
        </p>
      }
      demo={
        <div className="space-y-5">
          <ArchitectureDiagram
            steps={
              isFirebaseConfigured
                ? [
                    'You type a note and click "Add note"',
                    'App calls addDoc() on the demoNotes collection',
                    'Firestore Security Rules verify authorId matches your uid',
                    'onSnapshot() pushes the update to every subscribed client instantly',
                  ]
                : [
                    'You type a note and click "Add note"',
                    'Saved to this browser\'s localStorage (simulated "database")',
                    'A BroadcastChannel message notifies other open tabs',
                    'Every tab listening re-reads localStorage and re-renders',
                  ]
            }
          />

          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <strong>Presentation tip:</strong> open this page in two browser tabs side by side. Add a
            note in one tab and watch it appear instantly in the other — that's the real-time sync in
            action{isFirebaseConfigured ? '' : ' (simulated locally)'}.
          </p>

          {blockedPendingSignIn && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <Link to="/authentication" className="font-medium underline">
                Sign in on the Authentication page
              </Link>{' '}
              to read and write real notes here.
            </div>
          )}

          <form onSubmit={handleAddNote} className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <div className="flex-1">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  blockedPendingSignIn ? 'Sign in to add a note…' : `Add a short note as ${actor.displayName}…`
                }
                rows={2}
                maxLength={280}
                disabled={blockedPendingSignIn}
              />
              <FieldError>{formError}</FieldError>
            </div>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={blockedPendingSignIn}
            >
              Add note
            </Button>
          </form>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</p>
              <Badge tone={isFirebaseConfigured ? 'success' : 'warning'}>
                {isFirebaseConfigured ? 'Live Firestore data' : 'Local simulation'}
              </Badge>
            </div>

            {loading ? (
              <Spinner label="Loading notes" />
            ) : loadError ? (
              <p role="alert" className="text-sm text-red-600">
                {loadError}
              </p>
            ) : notes.length === 0 ? (
              <EmptyState
                title="No notes yet"
                description={
                  blockedPendingSignIn
                    ? 'Sign in to see and add notes.'
                    : 'Add the first note above.'
                }
              />
            ) : (
              <ul className="space-y-2">
                {notes.map((note) => (
                  <li
                    key={note.id}
                    className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <div>
                      <p className="text-sm text-navy-900">{note.text}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {note.authorName} · {new Date(note.createdAtMs).toLocaleTimeString()}
                      </p>
                    </div>
                    {note.authorId === actor.uid && (
                      <button
                        type="button"
                        onClick={() => handleDelete(note)}
                        aria-label="Delete this note"
                        className="flex-shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Event / result panel
            </p>
            <DemoResultPanel entries={entries} emptyLabel="Add or delete a note to see results here." />
          </div>
        </div>
      }
      howItWorks={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <code>demoNotes/</code> is a <strong>collection</strong>; each note is a{' '}
            <strong>document</strong> inside it, identified by an auto-generated ID.
          </li>
          <li>
            <code>addDoc()</code> creates a new document; <code>onSnapshot()</code> keeps a live
            subscription open and re-fires on every change — creates, edits, and deletes alike.
          </li>
          <li>
            Firestore Security Rules (not the app) are the real gatekeeper: a note can only be created
            with <code>authorId == request.auth.uid</code>, and only that same author can edit or
            delete it — enforced server-side, not just hidden in the UI.
          </li>
          <li>The local fallback mimics this with localStorage (the "database") and BroadcastChannel (the "real-time sync").</li>
        </ul>
      }
      useCases={
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Live comment threads, chat, or collaborative notes.</li>
          <li>Dashboards that update the instant underlying data changes, with no manual refresh.</li>
          <li>Any structured app data — user profiles, orders, posts — queried and filtered server-side.</li>
        </ul>
      }
    />
  )
}

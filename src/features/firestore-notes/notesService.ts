import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../../services/firebase'
import type { DemoNote } from './types'

const NOTE_MAX_LENGTH = 280

function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Cloud Firestore is not configured. Add your Firebase web config to .env.local.')
  }
  return db
}

export function validateNoteText(text: string): string | null {
  const trimmed = text.trim()
  if (!trimmed) return 'Write something before adding a note.'
  if (trimmed.length > NOTE_MAX_LENGTH) return `Keep notes under ${NOTE_MAX_LENGTH} characters.`
  return null
}

/** Real-time listener over the shared `demoNotes` collection, newest first. */
export function subscribeToNotes(
  onNotes: (notes: DemoNote[]) => void,
  onError: (error: unknown) => void,
) {
  const database = requireDb()
  const notesQuery = query(collection(database, 'demoNotes'), orderBy('createdAt', 'desc'))
  return onSnapshot(
    notesQuery,
    (snapshot) => {
      const notes: DemoNote[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as {
          authorId: string
          authorName?: string
          text: string
          createdAt: Timestamp | null
        }
        return {
          id: docSnap.id,
          authorId: data.authorId,
          authorName: data.authorName ?? 'Anonymous',
          text: data.text,
          createdAtMs: data.createdAt ? data.createdAt.toMillis() : Date.now(),
        }
      })
      onNotes(notes)
    },
    onError,
  )
}

export async function createNote(authorId: string, authorName: string, text: string) {
  const database = requireDb()
  await addDoc(collection(database, 'demoNotes'), {
    authorId,
    authorName,
    text: text.trim(),
    createdAt: serverTimestamp(),
  })
}

export async function deleteNote(noteId: string) {
  const database = requireDb()
  await deleteDoc(doc(database, 'demoNotes', noteId))
}

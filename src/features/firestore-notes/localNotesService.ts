import type { DemoNote } from './types'

/**
 * Local-only fallback for the /firestore demo when Cloud Firestore isn't
 * configured. Uses localStorage for persistence (shared across tabs of the
 * same origin) and BroadcastChannel to push instant updates to every OTHER
 * open tab — the same "open two tabs, watch it sync" presentation moment as
 * the real Firestore `onSnapshot` listener, just simulated locally. Never
 * touches Firebase.
 *
 * Note: BroadcastChannel (like the native `storage` event) never delivers a
 * message back to the tab that sent it — only to other tabs. So the acting
 * tab's own subscribers are notified directly via `notifyLocalListeners()`
 * below; without that, the tab you actually click "Add note" in would never
 * see its own new note appear.
 */
const STORAGE_KEY = 'firebase-feature-lab:local-demo-notes'
const CHANNEL_NAME = 'firebase-feature-lab-local-demo-notes'

function readAll(): DemoNote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as DemoNote[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(notes: DemoNote[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    // Best-effort only — the in-memory update still renders for this tab.
  }
}

let channel: BroadcastChannel | null = null
function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null
  if (!channel) channel = new BroadcastChannel(CHANNEL_NAME)
  return channel
}

const localListeners = new Set<() => void>()
function notifyLocalListeners() {
  for (const listener of localListeners) listener()
}

export function subscribeToLocalNotes(onNotes: (notes: DemoNote[]) => void) {
  const emit = () => onNotes([...readAll()].sort((a, b) => b.createdAtMs - a.createdAtMs))
  emit()

  localListeners.add(emit)
  const bc = getChannel()
  bc?.addEventListener('message', emit)

  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) emit()
  }
  window.addEventListener('storage', onStorage)

  return () => {
    localListeners.delete(emit)
    bc?.removeEventListener('message', emit)
    window.removeEventListener('storage', onStorage)
  }
}

export function createLocalNote(authorId: string, authorName: string, text: string) {
  const note: DemoNote = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    authorId,
    authorName,
    text: text.trim(),
    createdAtMs: Date.now(),
  }
  writeAll([note, ...readAll()])
  notifyLocalListeners()
  getChannel()?.postMessage('notes-updated')
}

export function deleteLocalNote(noteId: string) {
  writeAll(readAll().filter((note) => note.id !== noteId))
  notifyLocalListeners()
  getChannel()?.postMessage('notes-updated')
}

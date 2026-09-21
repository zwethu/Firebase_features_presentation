/**
 * Local-only fallback for the /realtime-database demo when RTDB isn't
 * configured. Same "open two tabs and watch it sync instantly" moment as
 * the real transaction + listener, simulated with localStorage +
 * BroadcastChannel instead. Never touches Firebase.
 *
 * Note: BroadcastChannel (like the native `storage` event) never delivers a
 * message back to the tab that sent it — only to other tabs. So the acting
 * tab's own subscribers are notified directly via `notifyLocalListeners()`
 * below; without that, clicking "React" would never update the count in
 * the same tab you clicked it in.
 */
const STORAGE_KEY = 'firebase-feature-lab:local-reactions'
const CHANNEL_NAME = 'firebase-feature-lab-local-reactions'

function readCount(): number {
  try {
    const value = Number(localStorage.getItem(STORAGE_KEY))
    return Number.isFinite(value) && value >= 0 ? value : 0
  } catch {
    return 0
  }
}

function writeCount(count: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(count))
  } catch {
    // Best-effort only.
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

export function subscribeToLocalReactionCount(onCount: (count: number) => void) {
  const emit = () => onCount(readCount())
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

export function addLocalReaction() {
  const next = readCount() + 1
  writeCount(next)
  notifyLocalListeners()
  getChannel()?.postMessage('reactions-updated')
}

export function resetLocalReactionCount() {
  writeCount(0)
  notifyLocalListeners()
  getChannel()?.postMessage('reactions-updated')
}

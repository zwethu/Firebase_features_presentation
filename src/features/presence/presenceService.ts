import {
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from 'firebase/database'
import { isFirebaseConfigured, rtdb } from '../../services/firebase'
import type { PresenceRecord } from '../../types/models'

export const presenceEnabled = isFirebaseConfigured && Boolean(rtdb)

export function startPresence(uid: string, displayName: string) {
  if (!presenceEnabled || !rtdb) return () => {}

  const presenceRef = ref(rtdb, `presence/${uid}`)
  set(presenceRef, { online: true, displayName, lastSeen: serverTimestamp() })
  onDisconnect(presenceRef).set({ online: false, displayName, lastSeen: serverTimestamp() })

  return () => {
    set(presenceRef, { online: false, displayName, lastSeen: serverTimestamp() })
  }
}

export function subscribeToOnlineCount(callback: (count: number) => void) {
  if (!presenceEnabled || !rtdb) {
    callback(0)
    return () => {}
  }
  const presenceRef = ref(rtdb, 'presence')
  return onValue(presenceRef, (snapshot) => {
    const value = (snapshot.val() ?? {}) as Record<string, PresenceRecord>
    const onlineCount = Object.values(value).filter((entry) => entry.online).length
    callback(onlineCount)
  })
}

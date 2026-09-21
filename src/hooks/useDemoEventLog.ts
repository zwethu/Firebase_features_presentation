import { useSyncExternalStore } from 'react'
import { getDemoEvents, subscribeToDemoEvents } from '../lib/eventLog'

export function useDemoEventLog() {
  return useSyncExternalStore(subscribeToDemoEvents, getDemoEvents, getDemoEvents)
}

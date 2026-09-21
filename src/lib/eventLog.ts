/**
 * A local, in-memory, presentation-only event stream — NOT Firebase
 * Analytics. Every Feature Lab demo pushes its safe, non-sensitive actions
 * here so presenters have a visible on-screen trail of what just happened.
 * The /analytics page surfaces this same stream and explains the
 * distinction from the real Firebase Analytics Console.
 *
 * Never push emails, UIDs, file names, raw AI prompts, tokens, or any other
 * sensitive value into this log — it is rendered directly on screen.
 */

export interface DemoEvent {
  id: string
  label: string
  source: string
  timestamp: number
}

const MAX_EVENTS = 50
let events: DemoEvent[] = []
const listeners = new Set<() => void>()

function notify() {
  for (const listener of listeners) listener()
}

export function logDemoEvent(source: string, label: string) {
  const event: DemoEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    source,
    timestamp: Date.now(),
  }
  events = [event, ...events].slice(0, MAX_EVENTS)
  notify()
}

export function getDemoEvents(): DemoEvent[] {
  return events
}

export function subscribeToDemoEvents(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * Masks an email for on-screen display during a presentation, e.g.
 * `jordan.lee@example.com` → `jo•••@example.com`.
 */
export function maskEmail(email: string): string {
  const atIndex = email.indexOf('@')
  if (atIndex <= 0) return '•••'
  const local = email.slice(0, atIndex)
  const domain = email.slice(atIndex)
  const visible = local.slice(0, Math.min(2, local.length))
  return `${visible}${'•'.repeat(3)}${domain}`
}

/** Shortens a Firebase UID for display, e.g. `abcdEFgh1234...` → `abcdEFgh…`. */
export function shortenUid(uid: string, visibleChars = 8): string {
  return uid.length <= visibleChars ? uid : `${uid.slice(0, visibleChars)}…`
}

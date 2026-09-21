/** Normalized shape both the real Firestore backend and the local fallback render against. */
export interface DemoNote {
  id: string
  authorId: string
  authorName: string
  text: string
  createdAtMs: number
}

import type { Timestamp } from 'firebase/firestore'

export type UserRole = 'student' | 'teacher' | 'admin'

export interface UserProfile {
  uid: string
  displayName: string
  email: string
  /**
   * Legacy field from the retired role-gated product. Firebase Feature Lab
   * no longer assigns or reads roles — new profiles never set this, and
   * Firestore Rules reject any client write that includes a `role` key at
   * all. Kept optional only so pre-existing documents/orphaned pages still
   * type-check; do not use it for authorization decisions.
   */
  role?: UserRole
  photoURL: string | null
  createdAt: Timestamp | null
}

export interface Course {
  id: string
  title: string
  description: string
  teacherId: string
  studentIds: string[]
  createdAt: Timestamp | null
}

export interface Assignment {
  id: string
  courseId: string
  title: string
  description: string
  dueDate: Timestamp | null
  createdBy: string
  createdAt: Timestamp | null
}

export type SubmissionStatus = 'submitted'

export interface Submission {
  id: string
  assignmentId: string
  courseId: string
  studentId: string
  studentName: string
  storagePath: string
  fileName: string
  contentType: string
  sizeBytes: number
  status: SubmissionStatus
  submittedAt: Timestamp | null
}

export interface Announcement {
  id: string
  courseId: string
  title: string
  message: string
  createdBy: string
  createdAt: Timestamp | null
}

export type NotificationType = 'submission' | 'announcement' | 'system'

export interface AppNotification {
  id: string
  recipientId: string
  type: NotificationType
  title: string
  message: string
  relatedId: string | null
  read: boolean
  createdAt: Timestamp | null
}

export interface AiChat {
  id: string
  userId: string
  prompt: string
  response: string
  createdAt: Timestamp | null
}

export interface PresenceRecord {
  online: boolean
  displayName: string
  lastSeen: number
}

import type { User } from 'firebase/auth'
import {
  type DocumentData,
  type QueryDocumentSnapshot,
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from './firebase'
import type {
  AiChat,
  Announcement,
  AppNotification,
  Assignment,
  Course,
  Submission,
  UserProfile,
  UserRole,
} from '../types/models'

function requireDb() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Cloud Firestore is not configured. Add your Firebase web config to .env.local.')
  }
  return db
}

function withId<T>(snap: QueryDocumentSnapshot<DocumentData>): T {
  return { id: snap.id, ...snap.data() } as T
}

// ---------------------------------------------------------------------------
// users/{uid}
// ---------------------------------------------------------------------------

export async function ensureUserProfile(user: User, defaultRole: UserRole = 'student') {
  const database = requireDb()
  const ref = doc(database, 'users', user.uid)
  const existing = await getDoc(ref)
  if (existing.exists()) {
    return
  }
  await setDoc(ref, {
    displayName: user.displayName ?? user.email?.split('@')[0] ?? 'Student',
    email: user.email ?? '',
    role: defaultRole,
    photoURL: user.photoURL ?? null,
    createdAt: serverTimestamp(),
  })
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const database = requireDb()
  const snap = await getDoc(doc(database, 'users', uid))
  if (!snap.exists()) return null
  return { uid, ...snap.data() } as UserProfile
}

export function subscribeToUserProfile(
  uid: string,
  callback: (profile: UserProfile | null) => void,
) {
  const database = requireDb()
  return onSnapshot(doc(database, 'users', uid), (snap) => {
    callback(snap.exists() ? ({ uid, ...snap.data() } as UserProfile) : null)
  })
}

// ---------------------------------------------------------------------------
// courses/{courseId}
// ---------------------------------------------------------------------------

export async function listCoursesForProfile(profile: UserProfile): Promise<Course[]> {
  const database = requireDb()
  const coursesRef = collection(database, 'courses')

  let snapshotDocs: QueryDocumentSnapshot<DocumentData>[]
  if (profile.role === 'admin') {
    const snap = await getDocs(coursesRef)
    snapshotDocs = snap.docs
  } else if (profile.role === 'teacher') {
    const snap = await getDocs(query(coursesRef, where('teacherId', '==', profile.uid)))
    snapshotDocs = snap.docs
  } else {
    const snap = await getDocs(query(coursesRef, where('studentIds', 'array-contains', profile.uid)))
    snapshotDocs = snap.docs
  }

  return snapshotDocs.map((d) => withId<Course>(d))
}

export async function getCourse(courseId: string): Promise<Course | null> {
  const database = requireDb()
  const snap = await getDoc(doc(database, 'courses', courseId))
  if (!snap.exists()) return null
  return { id: courseId, ...snap.data() } as Course
}

// ---------------------------------------------------------------------------
// assignments/{assignmentId}
// ---------------------------------------------------------------------------

export async function listAssignmentsForCourse(courseId: string): Promise<Assignment[]> {
  const database = requireDb()
  const snap = await getDocs(
    query(collection(database, 'assignments'), where('courseId', '==', courseId)),
  )
  return snap.docs.map((d) => withId<Assignment>(d))
}

export async function listAssignmentsForCourses(courseIds: string[]): Promise<Assignment[]> {
  if (courseIds.length === 0) return []
  const database = requireDb()
  const snap = await getDocs(
    query(collection(database, 'assignments'), where('courseId', 'in', courseIds.slice(0, 30))),
  )
  return snap.docs.map((d) => withId<Assignment>(d))
}

export async function getAssignment(assignmentId: string): Promise<Assignment | null> {
  const database = requireDb()
  const snap = await getDoc(doc(database, 'assignments', assignmentId))
  if (!snap.exists()) return null
  return { id: assignmentId, ...snap.data() } as Assignment
}

// ---------------------------------------------------------------------------
// submissions/{submissionId}
// ---------------------------------------------------------------------------

export interface CreateSubmissionInput {
  assignmentId: string
  courseId: string
  studentId: string
  studentName: string
  storagePath: string
  fileName: string
  contentType: string
  sizeBytes: number
}

export async function createSubmission(input: CreateSubmissionInput) {
  const database = requireDb()
  await addDoc(collection(database, 'submissions'), {
    ...input,
    status: 'submitted',
    submittedAt: serverTimestamp(),
  })
}

export async function listSubmissionsForStudent(studentId: string): Promise<Submission[]> {
  const database = requireDb()
  const snap = await getDocs(
    query(collection(database, 'submissions'), where('studentId', '==', studentId)),
  )
  return snap.docs.map((d) => withId<Submission>(d))
}

export async function listSubmissionsForAssignment(assignmentId: string): Promise<Submission[]> {
  const database = requireDb()
  const snap = await getDocs(
    query(collection(database, 'submissions'), where('assignmentId', '==', assignmentId)),
  )
  return snap.docs.map((d) => withId<Submission>(d))
}

export async function listSubmissionsForCourses(courseIds: string[]): Promise<Submission[]> {
  if (courseIds.length === 0) return []
  const database = requireDb()
  const snap = await getDocs(
    query(collection(database, 'submissions'), where('courseId', 'in', courseIds.slice(0, 30))),
  )
  return snap.docs.map((d) => withId<Submission>(d))
}

// ---------------------------------------------------------------------------
// announcements/{announcementId}
// ---------------------------------------------------------------------------

export interface CreateAnnouncementInput {
  courseId: string
  title: string
  message: string
  createdBy: string
}

export async function createAnnouncement(input: CreateAnnouncementInput) {
  const database = requireDb()
  await addDoc(collection(database, 'announcements'), {
    ...input,
    createdAt: serverTimestamp(),
  })
}

export async function listAnnouncementsForCourse(courseId: string): Promise<Announcement[]> {
  const database = requireDb()
  const snap = await getDocs(
    query(collection(database, 'announcements'), where('courseId', '==', courseId)),
  )
  return snap.docs.map((d) => withId<Announcement>(d))
}

export async function listAnnouncementsForCourses(courseIds: string[]): Promise<Announcement[]> {
  if (courseIds.length === 0) return []
  const database = requireDb()
  const snap = await getDocs(
    query(collection(database, 'announcements'), where('courseId', 'in', courseIds.slice(0, 30))),
  )
  return snap.docs.map((d) => withId<Announcement>(d))
}

// ---------------------------------------------------------------------------
// notifications/{notificationId}
// ---------------------------------------------------------------------------

export function subscribeToNotifications(
  recipientId: string,
  callback: (notifications: AppNotification[]) => void,
) {
  const database = requireDb()
  const notificationsQuery = query(
    collection(database, 'notifications'),
    where('recipientId', '==', recipientId),
    orderBy('createdAt', 'desc'),
  )
  return onSnapshot(notificationsQuery, (snap) => {
    callback(snap.docs.map((d) => withId<AppNotification>(d)))
  })
}

export async function markNotificationRead(notificationId: string) {
  const database = requireDb()
  await updateDoc(doc(database, 'notifications', notificationId), { read: true })
}

// ---------------------------------------------------------------------------
// aiChats/{chatId}
// ---------------------------------------------------------------------------

export interface SaveAiChatInput {
  userId: string
  prompt: string
  response: string
}

export async function saveAiChat(input: SaveAiChatInput) {
  const database = requireDb()
  await addDoc(collection(database, 'aiChats'), {
    ...input,
    createdAt: serverTimestamp(),
  })
}

export async function listAiChatsForUser(userId: string): Promise<AiChat[]> {
  const database = requireDb()
  const snap = await getDocs(
    query(collection(database, 'aiChats'), where('userId', '==', userId), orderBy('createdAt', 'asc')),
  )
  return snap.docs.map((d) => withId<AiChat>(d))
}

// ---------------------------------------------------------------------------
// Admin demo metrics
// ---------------------------------------------------------------------------

export interface CollectionCounts {
  courses: number
  submissions: number
  announcements: number
}

export async function getCollectionCounts(): Promise<CollectionCounts> {
  const database = requireDb()
  const [courses, submissions, announcements] = await Promise.all([
    getCountFromServer(collection(database, 'courses')),
    getCountFromServer(collection(database, 'submissions')),
    getCountFromServer(collection(database, 'announcements')),
  ])
  return {
    courses: courses.data().count,
    submissions: submissions.data().count,
    announcements: announcements.data().count,
  }
}

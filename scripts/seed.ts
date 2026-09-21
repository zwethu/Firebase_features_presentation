/**
 * StudyFlow AI seed script.
 *
 * Seeds deterministic demo data into Firestore so a live presentation shows
 * the same courses/assignments/announcements every time.
 *
 * Usage:
 *   1. Create three Firebase Authentication users (student/teacher/admin) —
 *      via the Firebase Console or by signing in once through the app.
 *   2. Copy their UIDs into the STUDENT_UID / TEACHER_UID / ADMIN_UID
 *      constants below.
 *   3. Download a service account key for your Firebase project and set
 *      GOOGLE_APPLICATION_CREDENTIALS to its path.
 *   4. Run: npx tsx scripts/seed.ts   (or: npm run seed, see package.json)
 *
 * This script is idempotent-ish: it uses fixed document IDs so re-running
 * it overwrites the same demo records instead of duplicating them.
 */
import { getApps, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

// --- Replace these with real Firebase Authentication UIDs before running ---
const STUDENT_UID = 'REPLACE_WITH_STUDENT_UID'
const TEACHER_UID = 'REPLACE_WITH_TEACHER_UID'
const ADMIN_UID = 'REPLACE_WITH_ADMIN_UID'

if (getApps().length === 0) {
  initializeApp()
}
const db = getFirestore()

async function seed() {
  if ([STUDENT_UID, TEACHER_UID, ADMIN_UID].some((uid) => uid.startsWith('REPLACE_WITH'))) {
    console.error(
      'Set STUDENT_UID, TEACHER_UID, and ADMIN_UID in scripts/seed.ts to real Firebase Authentication UIDs before seeding.',
    )
    process.exit(1)
  }

  const batch = db.batch()

  batch.set(db.doc(`users/${STUDENT_UID}`), {
    displayName: 'Demo Student',
    email: 'student@studyflow.demo',
    role: 'student',
    photoURL: null,
    createdAt: FieldValue.serverTimestamp(),
  })
  batch.set(db.doc(`users/${TEACHER_UID}`), {
    displayName: 'Demo Teacher',
    email: 'teacher@studyflow.demo',
    role: 'teacher',
    photoURL: null,
    createdAt: FieldValue.serverTimestamp(),
  })
  batch.set(db.doc(`users/${ADMIN_UID}`), {
    displayName: 'Demo Admin',
    email: 'admin@studyflow.demo',
    role: 'admin',
    photoURL: null,
    createdAt: FieldValue.serverTimestamp(),
  })

  batch.set(db.doc('courses/se101'), {
    title: 'SE101 — Software Engineering Fundamentals',
    description: 'Core software engineering practices: requirements, design, testing, and delivery.',
    teacherId: TEACHER_UID,
    studentIds: [STUDENT_UID],
    createdAt: FieldValue.serverTimestamp(),
  })
  batch.set(db.doc('courses/cloud201'), {
    title: 'CLOUD201 — Cloud Application Development',
    description: 'Building and deploying cloud-native applications, including Firebase-based backends.',
    teacherId: TEACHER_UID,
    studentIds: [STUDENT_UID],
    createdAt: FieldValue.serverTimestamp(),
  })

  batch.set(db.doc('assignments/se101-a1'), {
    courseId: 'se101',
    title: 'Requirements Document',
    description: 'Submit a one-page requirements document for your chosen project idea.',
    dueDate: FieldValue.serverTimestamp(),
    createdBy: TEACHER_UID,
    createdAt: FieldValue.serverTimestamp(),
  })
  batch.set(db.doc('assignments/cloud201-a1'), {
    courseId: 'cloud201',
    title: 'Firebase Architecture Diagram',
    description: 'Submit a PDF diagram of a Firebase-based application architecture.',
    dueDate: FieldValue.serverTimestamp(),
    createdBy: TEACHER_UID,
    createdAt: FieldValue.serverTimestamp(),
  })

  batch.set(db.doc('announcements/welcome'), {
    courseId: 'se101',
    title: 'Welcome to SE101',
    message: 'Welcome to Software Engineering Fundamentals! Check the assignments tab for your first task.',
    createdBy: TEACHER_UID,
    createdAt: FieldValue.serverTimestamp(),
  })

  batch.set(db.doc(`notifications/demo-welcome-${STUDENT_UID}`), {
    recipientId: STUDENT_UID,
    type: 'system',
    title: 'Welcome to StudyFlow AI',
    message: 'Explore your dashboard, courses, and the AI Study Assistant.',
    relatedId: null,
    read: false,
    createdAt: FieldValue.serverTimestamp(),
  })

  await batch.commit()
  console.log('Seed data written successfully.')
}

seed().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})

import { readFileSync } from 'node:fs'
import {
  type RulesTestEnvironment,
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

/**
 * Firestore Rules tests for the Firebase Feature Lab ruleset.
 *
 * Run via `npm run test:rules` — that wraps this file in
 * `firebase emulators:exec`, which starts the Firestore emulator, runs the
 * suite, and shuts the emulator back down automatically. This file never
 * starts or leaves a long-running emulator process on its own.
 */

const PROJECT_ID = 'demo-firebase-feature-lab'

let testEnv: RulesTestEnvironment

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  })
})

afterAll(async () => {
  await testEnv.cleanup()
})

describe('users/{uid}', () => {
  it('a user can create their own profile without a role field', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertSucceeds(
      setDoc(doc(db, 'users/user-a'), {
        displayName: 'User A',
        email: 'a@example.com',
        photoURL: null,
      }),
    )
  })

  it('a user cannot create their own profile with a role field (privilege escalation attempt)', async () => {
    const db = testEnv.authenticatedContext('user-b').firestore()
    await assertFails(
      setDoc(doc(db, 'users/user-b'), {
        displayName: 'User B',
        email: 'b@example.com',
        photoURL: null,
        role: 'admin',
      }),
    )
  })

  it('a user cannot read another user\'s profile', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(ctx.firestore().doc('users/user-a'), { displayName: 'User A', email: 'a@x.com' })
    })
    const db = testEnv.authenticatedContext('user-b').firestore()
    await assertFails(getDoc(doc(db, 'users/user-a')))
  })
})

describe('demoNotes/{noteId} — /firestore demo', () => {
  beforeAll(async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore()
      await setDoc(doc(db, 'demoNotes/note-owned-by-a'), {
        authorId: 'user-a',
        authorName: 'User A',
        text: 'Firestore is a real-time database.',
        createdAt: new Date(),
      })
    })
  })

  it('an authenticated user can create a note', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertSucceeds(
      addDoc(collection(db, 'demoNotes'), {
        authorId: 'user-a',
        authorName: 'User A',
        text: 'Hello from the Feature Lab!',
        createdAt: new Date(),
      }),
    )
  })

  it('an authenticated user can read notes', async () => {
    const db = testEnv.authenticatedContext('user-b').firestore()
    await assertSucceeds(getDoc(doc(db, 'demoNotes/note-owned-by-a')))
  })

  it('an unauthenticated user cannot read notes', async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    await assertFails(getDoc(doc(db, 'demoNotes/note-owned-by-a')))
  })

  it('an unauthenticated user cannot create a note', async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    await assertFails(
      addDoc(collection(db, 'demoNotes'), {
        authorId: 'anonymous',
        text: 'I should not be allowed to write this.',
        createdAt: new Date(),
      }),
    )
  })

  it('a user can delete their own note', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertSucceeds(deleteDoc(doc(db, 'demoNotes/note-owned-by-a')))
  })

  it('a user cannot delete another user\'s note', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(ctx.firestore().doc('demoNotes/note-owned-by-a-2'), {
        authorId: 'user-a',
        text: 'Another note by user A.',
        createdAt: new Date(),
      })
    })
    const db = testEnv.authenticatedContext('user-b').firestore()
    await assertFails(deleteDoc(doc(db, 'demoNotes/note-owned-by-a-2')))
  })

  it('a user cannot edit another user\'s note', async () => {
    const db = testEnv.authenticatedContext('user-b').firestore()
    await assertFails(updateDoc(doc(db, 'demoNotes/note-owned-by-a-2'), { text: 'Hacked!' }))
  })

  it('a note longer than 280 characters is rejected', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertFails(
      addDoc(collection(db, 'demoNotes'), {
        authorId: 'user-a',
        text: 'x'.repeat(281),
        createdAt: new Date(),
      }),
    )
  })

  it('a user cannot create a note claiming another author', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertFails(
      addDoc(collection(db, 'demoNotes'), {
        authorId: 'user-b',
        text: 'Impersonating another user.',
        createdAt: new Date(),
      }),
    )
  })
})

describe('functionDemos/{eventId} and functionDemoResults/{resultId} — /functions demo', () => {
  beforeAll(async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore()
      await setDoc(doc(db, 'functionDemos/event-by-a'), {
        createdBy: 'user-a',
        label: 'test event',
        createdAt: new Date(),
      })
      await setDoc(doc(db, 'functionDemoResults/event-by-a'), {
        sourceEventId: 'event-by-a',
        status: 'ok',
        message: 'Processed.',
        createdAt: new Date(),
      })
    })
  })

  it('a user can create their own functionDemos event', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertSucceeds(
      addDoc(collection(db, 'functionDemos'), { createdBy: 'user-a', label: 'x', createdAt: new Date() }),
    )
  })

  it('a user cannot create an event claiming another creator', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertFails(
      addDoc(collection(db, 'functionDemos'), { createdBy: 'user-b', label: 'x', createdAt: new Date() }),
    )
  })

  it('a user can read their own event', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertSucceeds(getDoc(doc(db, 'functionDemos/event-by-a')))
  })

  it("another user cannot read someone else's event", async () => {
    const db = testEnv.authenticatedContext('user-b').firestore()
    await assertFails(getDoc(doc(db, 'functionDemos/event-by-a')))
  })

  it('a client cannot create a functionDemoResults document directly', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertFails(
      setDoc(doc(db, 'functionDemoResults/fake-result'), {
        sourceEventId: 'event-by-a',
        status: 'ok',
        message: 'Forged client-side.',
        createdAt: new Date(),
      }),
    )
  })

  it('the event creator can read the linked result (cross-collection check)', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertSucceeds(getDoc(doc(db, 'functionDemoResults/event-by-a')))
  })

  it("another user cannot read someone else's linked result", async () => {
    const db = testEnv.authenticatedContext('user-b').firestore()
    await assertFails(getDoc(doc(db, 'functionDemoResults/event-by-a')))
  })
})

describe('demoNotifications/{notificationId} — /notifications demo', () => {
  beforeAll(async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(ctx.firestore().doc('demoNotifications/notif-for-a'), {
        recipientId: 'user-a',
        type: 'self-serve',
        title: 'Hello',
        message: 'Test notification',
        relatedId: null,
        read: false,
        createdAt: new Date(),
      })
    })
  })

  it('a user can create a notification addressed to themselves', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertSucceeds(
      addDoc(collection(db, 'demoNotifications'), {
        recipientId: 'user-a',
        type: 'self-serve',
        title: 'Hi',
        message: 'msg',
        relatedId: null,
        read: false,
        createdAt: new Date(),
      }),
    )
  })

  it('a user cannot create a notification addressed to another user', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertFails(
      addDoc(collection(db, 'demoNotifications'), {
        recipientId: 'user-b',
        type: 'self-serve',
        title: 'Spam',
        message: 'msg',
        relatedId: null,
        read: false,
        createdAt: new Date(),
      }),
    )
  })

  it('a user can read their own notification', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertSucceeds(getDoc(doc(db, 'demoNotifications/notif-for-a')))
  })

  it("another user cannot read someone else's notification", async () => {
    const db = testEnv.authenticatedContext('user-b').firestore()
    await assertFails(getDoc(doc(db, 'demoNotifications/notif-for-a')))
  })

  it('the recipient can mark their own notification as read', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertSucceeds(updateDoc(doc(db, 'demoNotifications/notif-for-a'), { read: true }))
  })

  it('the recipient cannot change fields other than read', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertFails(updateDoc(doc(db, 'demoNotifications/notif-for-a'), { title: 'Hacked' }))
  })

  it("another user cannot update someone else's notification", async () => {
    const db = testEnv.authenticatedContext('user-b').firestore()
    await assertFails(updateDoc(doc(db, 'demoNotifications/notif-for-a'), { read: true }))
  })

  it('a client cannot delete a notification', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertFails(deleteDoc(doc(db, 'demoNotifications/notif-for-a')))
  })
})

describe('default-deny for unlisted collections', () => {
  it('a retired/unlisted collection (e.g. "courses") is completely inaccessible', async () => {
    const db = testEnv.authenticatedContext('user-a').firestore()
    await assertFails(getDoc(doc(db, 'courses/some-course')))
    await assertFails(setDoc(doc(db, 'courses/some-course'), { title: 'x' }))
  })
})

// Sanity check that the environment actually wired up (guards against a
// silently-empty test file passing for the wrong reason).
describe('test environment', () => {
  it('initialized against the Firestore emulator', () => {
    expect(testEnv).toBeDefined()
  })
})

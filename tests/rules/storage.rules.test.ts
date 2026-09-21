import { readFileSync } from 'node:fs'
import {
  type RulesTestEnvironment,
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import { getBytes, ref, uploadBytes } from 'firebase/storage'
import { afterAll, beforeAll, describe, it } from 'vitest'

/**
 * Storage Rules tests for the Firebase Feature Lab ruleset. Run as part of
 * `npm run test:rules`, which wraps this whole tests/rules directory in
 * `firebase emulators:exec` (starts the emulators, runs the suite, shuts
 * them back down automatically).
 */

const PROJECT_ID = 'demo-firebase-feature-lab'

let testEnv: RulesTestEnvironment

const PDF_BYTES = new Uint8Array([0x25, 0x50, 0x44, 0x46]) // "%PDF"
const BIG_BYTES = new Uint8Array(11 * 1024 * 1024) // 11 MB, over the 10 MB limit

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    storage: {
      rules: readFileSync('storage.rules', 'utf8'),
      host: '127.0.0.1',
      port: 9199,
    },
  })
})

afterAll(async () => {
  await testEnv.cleanup()
})

describe('feature-lab/{uid}/uploads/{fileName}', () => {
  it('an authenticated user can upload their own PDF', async () => {
    const storage = testEnv.authenticatedContext('user-a').storage()
    await assertSucceeds(
      uploadBytes(ref(storage, 'feature-lab/user-a/uploads/demo.pdf'), PDF_BYTES, {
        contentType: 'application/pdf',
      }),
    )
  })

  it('an unauthenticated user cannot upload', async () => {
    const storage = testEnv.unauthenticatedContext().storage()
    await assertFails(
      uploadBytes(ref(storage, 'feature-lab/anon/uploads/demo.pdf'), PDF_BYTES, {
        contentType: 'application/pdf',
      }),
    )
  })

  it("a user cannot upload into another user's path", async () => {
    const storage = testEnv.authenticatedContext('user-b').storage()
    await assertFails(
      uploadBytes(ref(storage, 'feature-lab/user-a/uploads/hack.pdf'), PDF_BYTES, {
        contentType: 'application/pdf',
      }),
    )
  })

  it('a non-PDF/PNG/JPEG content type is rejected', async () => {
    const storage = testEnv.authenticatedContext('user-a').storage()
    await assertFails(
      uploadBytes(ref(storage, 'feature-lab/user-a/uploads/demo.txt'), PDF_BYTES, {
        contentType: 'text/plain',
      }),
    )
  })

  it('a file over 10 MB is rejected', async () => {
    const storage = testEnv.authenticatedContext('user-a').storage()
    await assertFails(
      uploadBytes(ref(storage, 'feature-lab/user-a/uploads/big.pdf'), BIG_BYTES, {
        contentType: 'application/pdf',
      }),
    )
  })

  it('a PNG upload is accepted', async () => {
    const storage = testEnv.authenticatedContext('user-a').storage()
    await assertSucceeds(
      uploadBytes(ref(storage, 'feature-lab/user-a/uploads/photo.png'), PDF_BYTES, {
        contentType: 'image/png',
      }),
    )
  })

  it('the owner can read their own uploaded file', async () => {
    const storage = testEnv.authenticatedContext('user-a').storage()
    await assertSucceeds(getBytes(ref(storage, 'feature-lab/user-a/uploads/demo.pdf')))
  })

  it("another user cannot read user-a's file", async () => {
    const storage = testEnv.authenticatedContext('user-b').storage()
    await assertFails(getBytes(ref(storage, 'feature-lab/user-a/uploads/demo.pdf')))
  })

  it('an unauthenticated user cannot read any file', async () => {
    const storage = testEnv.unauthenticatedContext().storage()
    await assertFails(getBytes(ref(storage, 'feature-lab/user-a/uploads/demo.pdf')))
  })
})

describe('unlisted paths are denied by default', () => {
  it('a path outside feature-lab/ is completely inaccessible', async () => {
    const storage = testEnv.authenticatedContext('user-a').storage()
    await assertFails(
      uploadBytes(ref(storage, 'assignments/user-a/some-assignment/demo.pdf'), PDF_BYTES, {
        contentType: 'application/pdf',
      }),
    )
  })
})

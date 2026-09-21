import { readFileSync } from 'node:fs'
import {
  type RulesTestEnvironment,
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import { get, ref, set } from 'firebase/database'
import { afterAll, beforeAll, describe, it } from 'vitest'

/**
 * Realtime Database Rules tests for the Firebase Feature Lab ruleset. Run
 * as part of `npm run test:rules:database` (or add `database` to the
 * combined `--only` list in `test:rules` to run alongside Firestore/Storage).
 */

const PROJECT_ID = 'demo-firebase-feature-lab'
const PATH = 'featureLab/reactions/firebase'

let testEnv: RulesTestEnvironment

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    database: {
      rules: readFileSync('database.rules.json', 'utf8'),
      host: '127.0.0.1',
      port: 9000,
    },
  })
})

afterAll(async () => {
  await testEnv.cleanup()
})

describe('featureLab/reactions/firebase', () => {
  it('an authenticated user can write a valid integer', async () => {
    const db = testEnv.authenticatedContext('user-a').database()
    await assertSucceeds(set(ref(db, PATH), 1))
  })

  it('an unauthenticated user cannot write', async () => {
    const db = testEnv.unauthenticatedContext().database()
    await assertFails(set(ref(db, PATH), 2))
  })

  it('an authenticated user can read the count', async () => {
    const db = testEnv.authenticatedContext('user-b').database()
    await assertSucceeds(get(ref(db, PATH)))
  })

  it('an unauthenticated user cannot read the count', async () => {
    const db = testEnv.unauthenticatedContext().database()
    await assertFails(get(ref(db, PATH)))
  })

  it('a negative value is rejected', async () => {
    const db = testEnv.authenticatedContext('user-a').database()
    await assertFails(set(ref(db, PATH), -1))
  })

  it('a non-numeric value is rejected', async () => {
    const db = testEnv.authenticatedContext('user-a').database()
    await assertFails(set(ref(db, PATH), 'not-a-number'))
  })

  it('a value over the sensible maximum is rejected', async () => {
    const db = testEnv.authenticatedContext('user-a').database()
    await assertFails(set(ref(db, PATH), 10_000_000))
  })
})

describe('presence/{uid}', () => {
  it('a user can write their own presence record', async () => {
    const db = testEnv.authenticatedContext('user-a').database()
    await assertSucceeds(set(ref(db, 'presence/user-a'), { online: true, displayName: 'User A' }))
  })

  it("a user cannot write another user's presence record", async () => {
    const db = testEnv.authenticatedContext('user-b').database()
    await assertFails(set(ref(db, 'presence/user-a'), { online: false, displayName: 'Hacked' }))
  })
})

describe('unlisted paths are denied by default', () => {
  it('an unrelated top-level path is completely inaccessible', async () => {
    const db = testEnv.authenticatedContext('user-a').database()
    await assertFails(set(ref(db, 'somethingElse'), 'value'))
  })
})

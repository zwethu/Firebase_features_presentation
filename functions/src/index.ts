export { onFunctionDemoCreated } from './functionDemo'

// The retired StudyFlow AI product's triggers (onSubmissionCreated,
// onAnnouncementCreated in submissions.ts/announcements.ts) are left on
// disk but intentionally not exported/deployed here — their target
// collections (submissions/, announcements/) have no Firestore Rules under
// the current Feature Lab ruleset, so no client could ever create a
// document there to fire them. Kept only for reference until fully removed.

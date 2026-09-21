# Claude Code Prompt — Focused Firebase Presentation Demos

## Answer to the design question

**Yes. Keep every existing demo as its own tab/page in Firebase Feature Lab.**

Do not remove the existing Feature Lab sidebar, routes, tabs, or feature pages. The website should remain an interactive Firebase product catalog where presenters can open any feature independently.

For this presentation, however, prioritize and polish only these three tabs:

1. **Remote Config** — live Firebase Console value change
2. **A/B Testing** — variant preview, Analytics event tracking, and experiment setup explanation
3. **Error Monitoring** — controlled presentation-only error and truthful monitoring status

Other tabs should remain available. Do not delete working integrations. If a page is not relevant to the short presentation, it can stay in the sidebar with an accurate status badge.

---

# Copy From Here Into Claude Code

We are narrowing the immediate presentation scope because of limited time.

The Firebase Feature Lab website must **keep every individual demo tab/page**. Do not remove routes, sidebar items, the Overview page, Presentation Mode, the four-section FeaturePage structure, or existing working demos.

The website remains a Firebase feature catalog. Presenters should still be able to choose any demo tab independently.

For the upcoming presentation, focus implementation and polish on exactly these three connected tabs:

1. `/remote-config`
2. `/ab-testing`
3. `/error-monitoring`

Do not spend this implementation pass rebuilding unrelated pages unless a shared change is required for accuracy, event tracking, or status display.

## Presentation story

Use this product-improvement lifecycle:

```text
Remote Config changes a feature remotely
        ↓
A/B Testing compares two variants
        ↓
Analytics measures safe user behavior
        ↓
Error monitoring detects unexpected failures
        ↓
Developers improve the application with evidence
```

## Non-negotiable safety and accuracy rules

- Inspect the repository before changing code.
- Reuse existing services and UI where possible:
  - `remoteConfigService`
  - `analyticsService`
  - `errorReportingService`
  - `ErrorBoundary`
  - `firebase.ts`
  - Feature Lab status system
  - existing FeaturePage template
- Do not expose `.env.local`, secrets, API keys, Firebase config values, tokens, VAPID keys, or service-account files.
- Do not commit `.env.local`.
- Do not deploy Hosting, Functions, Rules, indexes, or any Firebase resource.
- Do not change Firebase Console configuration.
- Do not create an actual Firebase A/B Testing experiment.
- Do not enable billing.
- Do not label local simulation, localStorage, browser counters, Error Boundary, or local event streams as a live Firebase product.
- Do not claim Crashlytics is active unless the exact installed SDK, web support, initialization, and Firebase project setup are verified.
- Do not claim sample A/B metrics are real experiment results.
- Keep TypeScript strict and avoid `any`.
- Preserve all existing feature tabs and their routes.

## Required status labels

Every page must truthfully display one of these labels:

```text
Live Firebase Integration
Firebase Emulator Integration
Demo Data / Simulation
Optional Setup Required
Not Configured
```

The Overview page and sidebar must use the same status source as the actual page. Do not allow a page to show “Live Firebase Integration” if its feature page is a placeholder, local fallback, or unavailable integration.

---

# Part A — Remote Config page

## Route

```text
/remote-config
```

## Goal

Demonstrate a real Remote Config value change from Firebase Console without rebuilding or redeploying the website.

## Required Remote Config parameter

```text
quiz_cta_variant
```

Expected values:

```text
A
B
```

## UI requirements

Keep the FeaturePage structure:

1. What it is
2. Interactive demo
3. How it works
4. Practical use cases

The Interactive demo section must show:

- Current default value
- Current active/fetched value
- Fetch status
- Last successful fetch timestamp
- A visible button:

```text
Fetch Latest Configuration
```

- A large visible call-to-action based on active value:

```text
Variant A: Start Quiz
Variant B: Start Your 5-Minute Quiz →
```

- A clear class-demo instruction card:

```text
1. Open Firebase Console → Remote Config.
2. Change quiz_cta_variant from A to B.
3. Publish changes.
4. Return here and click Fetch Latest Configuration.
5. Observe the button text change without redeploying the website.
```

- A clear warning:

```text
Remote Config values are delivered to the client. Never store passwords, secret API keys, tokens, or confidential information here.
```

## Implementation requirements

- Use existing `remoteConfigService` where possible.
- Use safe defaults:

```ts
quiz_cta_variant: "A"
ai_assistant_enabled: true
maintenance_message: ""
max_upload_size_mb: 10
```

- When Remote Config is genuinely available:
  - Use the official Firebase Web SDK flow.
  - Fetch and activate configuration safely.
  - Display truthful fetch outcomes.
  - Log the safe Analytics event `demo_remote_config_fetched` when Analytics is available.
- If Remote Config is unavailable or cannot fetch:
  - Retain an interactive local A/B toggle fallback.
  - Label it exactly as:

```text
Demo Data / Simulation
```

- Never store secrets in Remote Config.

## Architecture diagram

Add a presentation-friendly visual diagram:

```text
Firebase Console
      ↓
Remote Config parameter: quiz_cta_variant
      ↓
Fetch and activate in website
      ↓
Website UI changes without a redeployment
```

## Event/result panel

Show only safe data:

```text
Mode: Live Firebase Integration / Demo Data / Simulation
Default value: A
Active value: A or B
Last fetch: timestamp or “Not fetched yet”
Latest action: “Configuration fetched successfully”
```

---

# Part B — A/B Testing page

## Route

```text
/ab-testing
```

## Goal

Explain how Firebase A/B Testing, Remote Config, and Analytics work together.

The page must make the difference very clear:

| Scenario | Meaning |
|---|---|
| Remote Config manual change | One Remote Config value is changed for all users |
| A/B Testing experiment | Different user groups receive different variants, and Analytics measures outcomes |

## Experiment model

Use the same parameter:

```text
quiz_cta_variant
```

Variants:

```text
Control A: Start Quiz
Experiment B: Start Your 5-Minute Quiz →
```

Primary metric:

```text
quiz_cta_clicked
```

Optional secondary metric:

```text
quiz_completed
```

## UI requirements

Keep the FeaturePage structure.

The Interactive demo section must include:

- Side-by-side cards for Variant A and Variant B
- A local preview selector with exact label:

```text
Demo Data / Simulation — Preview a Variant
```

- One active CTA button based on selected local preview
- When the CTA is clicked:
  - Log the safe Analytics event:

```text
quiz_cta_clicked
```

  - Add only a safe parameter:

```text
variant: "A" | "B"
```

  - Never log email, UID, raw user text, tokens, or personal data.

- A presentation-friendly event/result panel:

```text
Current preview variant: A or B
Local clicks in this browser session: number
Analytics event state: sent / unavailable / local-only
```

- A clearly labelled metrics block:

```text
Sample demonstration data — not real experiment results.
```

Use sample values only under that label:

| Variant | Example quiz-start rate |
|---|---:|
| A | 55% |
| B | 68% |

- A concise card titled:

```text
How to create the real Firebase A/B Test
```

with these manual steps:

```text
1. Firebase Console → A/B Testing
2. Create a Remote Config experiment
3. Select parameter: quiz_cta_variant
4. Set control = A
5. Set variant = B
6. Choose objective: quiz_cta_clicked
7. Start experiment
8. Wait for enough users and events before making conclusions
```

## Implementation requirements

- Do not create or start a Firebase A/B Testing experiment.
- Do not use local sample data as proof of real results.
- Reuse `analyticsService` safely.
- If Analytics is unavailable, retain the local click counter but label it honestly.
- Log safe presentation events in the local event stream.

## Architecture diagram

```text
Remote Config
      ↓
Control A and Variant B
      ↓
Different user groups
      ↓
Analytics event: quiz_cta_clicked
      ↓
Firebase A/B Testing analysis
```

## Suggested presenter wording

Display or document this sentence:

> “Remote Config changes a value. A/B Testing uses Remote Config to give different values to different user groups. Analytics measures which version achieves a better outcome.”

---

# Part C — Error / crash analysis page

## Route

```text
/error-monitoring
```

## Goal

Provide a controlled, safe, presentation-only error demonstration.

## First requirement: verify monitoring truthfulness

Before implementing or changing labels:

1. Inspect installed Firebase SDK packages and versions.
2. Inspect current `errorReportingService`, `ErrorBoundary`, Firebase initialization, and Firebase project setup evidence.
3. Determine whether Firebase Crashlytics is genuinely supported, installed, initialized, and verified for this React web project.

Then use exactly one truthful status:

```text
Crashlytics Active
Crashlytics Not Configured
Error Boundary + Local Error Logger Active
Firebase Emulator Integration
Not Configured
```

Never call Error Boundary or local logging “Crashlytics.”

## Required UI

Keep the FeaturePage structure.

The Interactive demo section must include:

- A visible monitoring-status panel
- A development/demo-only button:

```text
Trigger Controlled Demo Error
```

- The button must appear only when:

```text
VITE_DEMO_MODE=true
```

- Before triggering, show an explicit confirmation dialog:

```text
This will trigger a controlled presentation-only error.
No user data, Firebase data, files, or authentication data will be changed.
Continue?
```

- On confirmation, trigger a static non-sensitive error:

```text
Controlled presentation demo error
```

- React Error Boundary must catch the error and provide a recovery action.
- Do not create an error automatically on page load.
- Do not crash the whole website permanently.
- Do not affect Firestore, Storage, Realtime Database, Functions, Authentication, or user data.

## Event/result panel

Show the progress of the controlled error flow:

```text
Button clicked: yes/no
Confirmation accepted: yes/no
Error Boundary caught error: yes/no
Local error logger: recorded / unavailable
Analytics event: sent / unavailable / local-only
Crashlytics: sent only if verified active
```

## Analytics requirements

When Analytics is available, log only:

```text
demo_controlled_error_triggered
```

Do not log:

- Error stack traces in Analytics
- Email addresses
- User IDs
- Raw prompts
- File names or contents
- Tokens
- Firebase config values
- Passwords

## Crashlytics requirements

- If verified active, use the official supported API to record only the static controlled error.
- If not verified active, show:

```text
Crashlytics not configured for this environment.
This demo uses React Error Boundary and local structured error logging.
```

- Do not fabricate a Firebase Console dashboard event.
- If Crashlytics is not live, provide a prepared placeholder area for the presenter to show a screenshot later, labelled:

```text
Presentation backup: verified dashboard screenshot required
```

## Architecture diagram

```text
Controlled demo error
      ↓
React Error Boundary
      ↓
Local error logger
      ↓
Optional verified Crashlytics reporting
      ↓
Developer investigates and fixes issue
```

## Visible warning

```text
This is a controlled presentation-only error.
No user data or Firebase data is changed.
```

---

# Shared visual and presentation requirements

For all three focus pages:

- Keep the existing Firebase Feature Lab visual system.
- Make Presentation Mode projector-friendly:
  - Large text
  - Strong visible value changes
  - Good contrast
  - Minimal dense paragraphs
  - Clear status badges
- Add an event/result panel to each page.
- Add a simple architecture diagram to each page.
- Do not use long code blocks in the main visible UI.
- Keep mobile layout usable, but optimize desktop/projector view first.
- Update Overview status cards and sidebar dots only when their status is actually true.
- Keep every non-focus Feature Lab tab in place and do not regress existing working demos.

---

# Verification requirements

After implementation:

1. Run:

```bash
npx tsc -b --noEmit
npm run build
```

2. Run relevant existing tests.

3. Verify in browser:

```text
/remote-config
/ab-testing
/error-monitoring
```

Check each in:

- Normal desktop mode
- Presentation Mode
- Mobile-width layout

4. Verify that:

- Remote Config has a safe fallback when fetching is unavailable.
- A/B Testing preview never claims sample data is a real experiment.
- Analytics events never include private data.
- Error button requires confirmation.
- Error Boundary recovers the page correctly.
- No page incorrectly claims Crashlytics is active.
- Overview and sidebar statuses match actual page capability.

---

# Required final response format

Use exactly this structure:

# Focused Demo Report

## Remote Config
- Actual integration mode:
- Parameter used:
- What the presenter changes in Firebase Console:
- Exact live demo click path:
- Fallback behavior:

## A/B Testing
- Analytics events implemented:
- Live Firebase capability:
- Simulation/preview capability:
- Exact manual Firebase Console experiment steps:
- What must not be claimed as real:

## Error / Crash Analysis
- Verified monitoring status:
- Whether Crashlytics is actually active:
- Controlled error behavior:
- Error Boundary behavior:
- Analytics behavior:
- Evidence needed for presentation:

## Accuracy and Safety
- Simulations/fallbacks:
- Services not configured:
- Private data protections:

## Verification
- TypeScript:
- Production build:
- Tests:
- Browser checks:

## Actions Requiring My Confirmation
- List only actions that would change Firebase Console, deploy code/rules/indexes/functions/hosting, enable billing, or create an A/B test.
- Do not perform any of those actions.

Start now by inspecting the repository and the three focus pages. Then implement the changes. Do not stop after analysis, planning, or documentation-only changes.

---

# Presentation Plan After Implementation

Use the Feature Lab as three independent tabs:

## Demo 1 — Remote Config

1. Open `/remote-config`.
2. Show the current active value: `A`.
3. Show CTA: `Start Quiz`.
4. Open Firebase Console → Remote Config.
5. Change `quiz_cta_variant` from `A` to `B`.
6. Publish the change.
7. Return to the website.
8. Click `Fetch Latest Configuration`.
9. Show CTA change: `Start Your 5-Minute Quiz →`.

Main line:

> “We changed the web application’s behavior remotely, without redeploying its code.”

## Demo 2 — A/B Testing

1. Open `/ab-testing`.
2. Show control A and experiment B side by side.
3. Choose a preview variant.
4. Click the corresponding CTA.
5. Show safe local event tracking and/or Analytics status.
6. Show the manual Firebase Console A/B Testing setup steps.

Main line:

> “Remote Config changes a value for users. A/B Testing gives different variants to different user groups, and Analytics measures which version performs better.”

## Demo 3 — Error / Crash Analysis

1. Open `/error-monitoring`.
2. Show monitoring status truthfully.
3. Click `Trigger Controlled Demo Error`.
4. Confirm the dialog.
5. Show the Error Boundary recovery state and event/result panel.
6. If verified, show a prepared Crashlytics dashboard screenshot. Otherwise, explicitly explain the local logger fallback.

Main line:

> “This controlled error demonstrates how an application can capture a failure, give developers useful diagnostic information, and support faster fixes—without affecting users or application data.”
